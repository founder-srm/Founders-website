'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import React, { createContext, useContext, useMemo } from 'react';
import { getAllEvents } from '@/actions/admin/events';
import { getAllRegistrations } from '@/actions/admin/registrations';
import type { Event } from '@/types/events';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/client';

// Types for processed analytics data
export interface RegistrationTrend {
  date: string;
  registrations: number;
  accepted: number;
  rejected: number;
}

export interface EventTypeDistribution {
  type: string;
  count: number;
  fill: string;
}

export interface RegistrationStatusData {
  status: string;
  count: number;
  fill: string;
}

export interface EventPerformance {
  title: string;
  registrations: number;
  accepted: number;
  rejected: number;
  conversionRate: number;
}

export interface AttendanceData {
  status: 'Present' | 'Absent';
  count: number;
}

export interface TeamVsIndividualData {
  type: 'Team' | 'Individual';
  count: number;
}

export interface VenueData {
  venue: string;
  count: number;
}

export interface TagData {
  tag: string;
  count: number;
}

export interface GatedEventData {
  type: 'Gated' | 'Open';
  count: number;
}

export interface FeaturedComparisonData {
  metric: string;
  featured: number;
  regular: number;
}

export interface TimelineData {
  daysBeforeEvent: string;
  registrations: number;
}

export interface ApprovalWorkflowData {
  type: string;
  count: number;
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  acceptedRegistrations: number;
  rejectedRegistrations: number;
  pendingRegistrations: number;
  acceptanceRate: number;
  avgRegistrationsPerEvent: number;
  mostPopularEvent: string;
  recentTrend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  attendanceRate: number;
}

interface DashboardDataContextType {
  events: Event[] | null;
  registrations: Registration[] | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  
  // Processed data
  stats: DashboardStats;
  registrationTrends: RegistrationTrend[];
  eventTypeDistribution: EventTypeDistribution[];
  registrationStatusData: RegistrationStatusData[];
  eventPerformance: EventPerformance[];
  monthlyData: { month: string; registrations: number; events: number }[];
  
  // New analytics data
  attendanceData: AttendanceData[];
  teamVsIndividualData: TeamVsIndividualData[];
  venueData: VenueData[];
  tagsData: TagData[];
  gatedEventsData: GatedEventData[];
  featuredComparisonData: FeaturedComparisonData[];
  featuredAvgRegs: number;
  regularAvgRegs: number;
  registrationTimelineData: TimelineData[];
  peakRegistrationDay: string;
  approvalWorkflowData: ApprovalWorkflowData[];
  autoApproveRate: number;
  
  // For AI summaries
  getDataSummary: () => string;
}

const DashboardDataContext = createContext<DashboardDataContextType | null>(null);

export function DashboardDataProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch: refetchEvents,
  } = useQuery<Event[]>(getAllEvents(supabase), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const {
    data: registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
    refetch: refetchRegistrations,
  } = useQuery<Registration[]>(getAllRegistrations(supabase), {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const isLoading = eventsLoading || registrationsLoading;
  const isError = eventsError || registrationsError;

  const refetch = () => {
    refetchEvents();
    refetchRegistrations();
  };

  // Calculate dashboard stats
  const stats = useMemo<DashboardStats>(() => {
    if (!events || !registrations) {
      return {
        totalEvents: 0,
        totalRegistrations: 0,
        acceptedRegistrations: 0,
        rejectedRegistrations: 0,
        pendingRegistrations: 0,
        acceptanceRate: 0,
        avgRegistrationsPerEvent: 0,
        mostPopularEvent: 'N/A',
        recentTrend: 'stable',
        trendPercentage: 0,
        attendanceRate: 0,
      };
    }

    const accepted = registrations.filter(r => r.is_approved === 'ACCEPTED').length;
    const rejected = registrations.filter(r => r.is_approved === 'REJECTED' || r.is_approved === 'INVALID').length;
    const pending = registrations.filter(r => r.is_approved === 'SUBMITTED').length;
    const total = registrations.length;

    // Calculate attendance rate
    const presentCount = registrations.filter(r => r.attendance === 'Present').length;
    const attendanceRate = total > 0 ? (presentCount / total) * 100 : 0;

    // Find most popular event
    const eventRegCounts = events.map(e => ({
      title: e.title,
      count: registrations.filter(r => r.event_id === e.id).length,
    }));
    const mostPopular = eventRegCounts.sort((a, b) => b.count - a.count)[0];

    // Calculate recent trend (last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentRegs = registrations.filter(r => {
      const date = new Date(r.created_at as string);
      return date >= sevenDaysAgo;
    }).length;
    
    const previousRegs = registrations.filter(r => {
      const date = new Date(r.created_at as string);
      return date >= fourteenDaysAgo && date < sevenDaysAgo;
    }).length;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPct = 0;
    if (previousRegs > 0) {
      trendPct = ((recentRegs - previousRegs) / previousRegs) * 100;
      trend = trendPct > 5 ? 'up' : trendPct < -5 ? 'down' : 'stable';
    }

    return {
      totalEvents: events.length,
      totalRegistrations: total,
      acceptedRegistrations: accepted,
      rejectedRegistrations: rejected,
      pendingRegistrations: pending,
      acceptanceRate: total > 0 ? (accepted / total) * 100 : 0,
      avgRegistrationsPerEvent: events.length > 0 ? total / events.length : 0,
      mostPopularEvent: mostPopular?.title || 'N/A',
      recentTrend: trend,
      trendPercentage: Math.abs(trendPct),
      attendanceRate,
    };
  }, [events, registrations]);

  // Registration trends over time (last 30 days)
  const registrationTrends = useMemo<RegistrationTrend[]>(() => {
    if (!registrations) return [];

    const dateMap = new Map<string, { registrations: number; accepted: number; rejected: number }>();
    const now = new Date();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { registrations: 0, accepted: 0, rejected: 0 });
    }

    registrations.forEach(reg => {
      const date = new Date(reg.created_at as string).toISOString().split('T')[0];
      if (dateMap.has(date)) {
        const data = dateMap.get(date)!;
        data.registrations++;
        if (reg.is_approved === 'ACCEPTED') data.accepted++;
        if (reg.is_approved === 'REJECTED' || reg.is_approved === 'INVALID') data.rejected++;
      }
    });

    return Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  }, [registrations]);

  // Event type distribution
  const eventTypeDistribution = useMemo<EventTypeDistribution[]>(() => {
    if (!events) return [];

    const typeCount: Record<string, number> = {};
    events.forEach(event => {
      const type = event.event_type || 'unspecified';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];
    return Object.entries(typeCount).map(([type, count], index) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      fill: colors[index % colors.length],
    }));
  }, [events]);

  // Registration status distribution
  const registrationStatusData = useMemo<RegistrationStatusData[]>(() => {
    if (!registrations) return [];

    return [
      { status: 'Accepted', count: stats.acceptedRegistrations, fill: 'var(--chart-1)' },
      { status: 'Pending', count: stats.pendingRegistrations, fill: 'var(--chart-2)' },
      { status: 'Rejected', count: stats.rejectedRegistrations, fill: 'var(--chart-3)' },
    ].filter(item => item.count > 0);
  }, [registrations, stats]);

  // Event performance data
  const eventPerformance = useMemo<EventPerformance[]>(() => {
    if (!events || !registrations) return [];

    return events.map(event => {
      const eventRegs = registrations.filter(r => r.event_id === event.id);
      const accepted = eventRegs.filter(r => r.is_approved === 'ACCEPTED').length;
      const rejected = eventRegs.filter(r => r.is_approved === 'REJECTED' || r.is_approved === 'INVALID').length;
      const total = eventRegs.length;

      return {
        title: event.title,
        registrations: total,
        accepted,
        rejected,
        conversionRate: total > 0 ? (accepted / total) * 100 : 0,
      };
    }).sort((a, b) => b.registrations - a.registrations);
  }, [events, registrations]);

  // Monthly data for trends
  const monthlyData = useMemo(() => {
    if (!events || !registrations) return [];

    const monthMap = new Map<string, { registrations: number; events: number }>();
    
    // Get last 6 months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months.push(monthStr);
      monthMap.set(monthStr, { registrations: 0, events: 0 });
    }

    registrations.forEach(reg => {
      const date = new Date(reg.created_at as string);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (monthMap.has(monthStr)) {
        monthMap.get(monthStr)!.registrations++;
      }
    });

    events.forEach(event => {
      const date = new Date(event.start_date);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (monthMap.has(monthStr)) {
        monthMap.get(monthStr)!.events++;
      }
    });

    return months.map(month => ({
      month,
      ...monthMap.get(month)!,
    }));
  }, [events, registrations]);

  // Attendance data
  const attendanceData = useMemo<AttendanceData[]>(() => {
    if (!registrations) return [];
    const present = registrations.filter(r => r.attendance === 'Present').length;
    const absent = registrations.filter(r => r.attendance === 'Absent').length;
    return [
      { status: 'Present' as const, count: present },
      { status: 'Absent' as const, count: absent },
    ].filter(d => d.count > 0);
  }, [registrations]);

  // Team vs Individual
  const teamVsIndividualData = useMemo<TeamVsIndividualData[]>(() => {
    if (!registrations) return [];
    const team = registrations.filter(r => r.is_team_entry === true).length;
    const individual = registrations.filter(r => r.is_team_entry !== true).length;
    return [
      { type: 'Team' as const, count: team },
      { type: 'Individual' as const, count: individual },
    ].filter(d => d.count > 0);
  }, [registrations]);

  // Venue distribution
  const venueData = useMemo<VenueData[]>(() => {
    if (!events) return [];
    const venueCount: Record<string, number> = {};
    events.forEach(event => {
      const venue = event.venue || 'TBD';
      venueCount[venue] = (venueCount[venue] || 0) + 1;
    });
    return Object.entries(venueCount)
      .map(([venue, count]) => ({ venue, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  // Tags distribution
  const tagsData = useMemo<TagData[]>(() => {
    if (!events) return [];
    const tagCount: Record<string, number> = {};
    events.forEach(event => {
      (event.tags || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  // Gated vs Open events
  const gatedEventsData = useMemo<GatedEventData[]>(() => {
    if (!events) return [];
    const gated = events.filter(e => e.is_gated).length;
    const open = events.filter(e => !e.is_gated).length;
    return [
      { type: 'Gated' as const, count: gated },
      { type: 'Open' as const, count: open },
    ].filter(d => d.count > 0);
  }, [events]);

  // Featured vs Regular comparison
  const { featuredComparisonData, featuredAvgRegs, regularAvgRegs } = useMemo(() => {
    if (!events || !registrations) return { 
      featuredComparisonData: [], 
      featuredAvgRegs: 0, 
      regularAvgRegs: 0 
    };

    const featured = events.filter(e => e.is_featured);
    const regular = events.filter(e => !e.is_featured);

    const featuredRegs = featured.reduce((sum, e) => 
      sum + registrations.filter(r => r.event_id === e.id).length, 0
    );
    const regularRegs = regular.reduce((sum, e) => 
      sum + registrations.filter(r => r.event_id === e.id).length, 0
    );

    const featuredAvg = featured.length > 0 ? featuredRegs / featured.length : 0;
    const regularAvg = regular.length > 0 ? regularRegs / regular.length : 0;

    return {
      featuredComparisonData: [
        { metric: 'Avg Registrations', featured: Math.round(featuredAvg), regular: Math.round(regularAvg) },
        { metric: 'Total Events', featured: featured.length, regular: regular.length },
      ],
      featuredAvgRegs: featuredAvg,
      regularAvgRegs: regularAvg,
    };
  }, [events, registrations]);

  // Registration timeline (days before event)
  const { registrationTimelineData, peakRegistrationDay } = useMemo(() => {
    if (!events || !registrations) return { 
      registrationTimelineData: [], 
      peakRegistrationDay: 'N/A' 
    };

    const daysBuckets: Record<string, number> = {
      '30+ days': 0,
      '15-30 days': 0,
      '8-14 days': 0,
      '4-7 days': 0,
      '2-3 days': 0,
      '1 day': 0,
      'Same day': 0,
    };

    registrations.forEach(reg => {
      const event = events.find(e => e.id === reg.event_id);
      if (!event) return;

      const regDate = new Date(reg.created_at as string);
      const eventDate = new Date(event.start_date);
      const diffDays = Math.floor((eventDate.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays >= 30) daysBuckets['30+ days']++;
      else if (diffDays >= 15) daysBuckets['15-30 days']++;
      else if (diffDays >= 8) daysBuckets['8-14 days']++;
      else if (diffDays >= 4) daysBuckets['4-7 days']++;
      else if (diffDays >= 2) daysBuckets['2-3 days']++;
      else if (diffDays >= 1) daysBuckets['1 day']++;
      else daysBuckets['Same day']++;
    });

    const timelineData = Object.entries(daysBuckets).map(([daysBeforeEvent, registrations]) => ({
      daysBeforeEvent,
      registrations,
    }));

    // Find peak
    const peak = Object.entries(daysBuckets).reduce((a, b) => a[1] > b[1] ? a : b);

    return {
      registrationTimelineData: timelineData,
      peakRegistrationDay: peak[0],
    };
  }, [events, registrations]);

  // Approval workflow (auto vs manual)
  const { approvalWorkflowData, autoApproveRate } = useMemo(() => {
    if (!events || !registrations) return { 
      approvalWorkflowData: [], 
      autoApproveRate: 0 
    };

    const autoRegs = registrations.filter(r => {
      const event = events.find(e => e.id === r.event_id);
      return event?.always_approve;
    }).length;

    const manualRegs = registrations.length - autoRegs;
    const rate = registrations.length > 0 ? (autoRegs / registrations.length) * 100 : 0;

    return {
      approvalWorkflowData: [
        { type: 'Auto-Approved', count: autoRegs },
        { type: 'Manual Review', count: manualRegs },
      ].filter(d => d.count > 0),
      autoApproveRate: rate,
    };
  }, [events, registrations]);

  // Generate data summary for AI
  const getDataSummary = () => {
    if (!events || !registrations) return 'No data available yet.';

    const topEvents = eventPerformance.slice(0, 3);
    const recentTrendText = stats.recentTrend === 'up' 
      ? `up ${stats.trendPercentage.toFixed(1)}%` 
      : stats.recentTrend === 'down' 
        ? `down ${stats.trendPercentage.toFixed(1)}%`
        : 'stable';

    return `Dashboard Analytics Summary:
- Total Events: ${stats.totalEvents}
- Total Registrations: ${stats.totalRegistrations}
- Acceptance Rate: ${stats.acceptanceRate.toFixed(1)}%
- Accepted: ${stats.acceptedRegistrations}, Pending: ${stats.pendingRegistrations}, Rejected: ${stats.rejectedRegistrations}
- Average Registrations per Event: ${stats.avgRegistrationsPerEvent.toFixed(1)}
- Most Popular Event: "${stats.mostPopularEvent}"
- Recent Trend (7 days): ${recentTrendText}
- Event Types: ${eventTypeDistribution.map(e => `${e.type}: ${e.count}`).join(', ')}
- Top Performing Events: ${topEvents.map(e => `"${e.title}" (${e.registrations} regs, ${e.conversionRate.toFixed(0)}% conversion)`).join('; ')}
- Monthly Trend: ${monthlyData.map(m => `${m.month}: ${m.registrations} regs`).join(', ')}`;
  };

  return (
    <DashboardDataContext.Provider
      value={{
        events: events ?? null,
        registrations: registrations ?? null,
        isLoading,
        isError,
        refetch,
        stats,
        registrationTrends,
        eventTypeDistribution,
        registrationStatusData,
        eventPerformance,
        monthlyData,
        // New analytics
        attendanceData,
        teamVsIndividualData,
        venueData,
        tagsData,
        gatedEventsData,
        featuredComparisonData,
        featuredAvgRegs,
        regularAvgRegs,
        registrationTimelineData,
        peakRegistrationDay,
        approvalWorkflowData,
        autoApproveRate,
        getDataSummary,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
}
