'use client';

import { RefreshCw } from 'lucide-react';
import { ApprovalWorkflowChart } from '@/components/charts-admin/approval-speed-chart';
import { AttendanceChart } from '@/components/charts-admin/attendance-chart';
import { EventPerformanceChart } from '@/components/charts-admin/event-performance-chart';
import { EventTypeChart } from '@/components/charts-admin/event-type-chart';
import { FeaturedPerformanceChart } from '@/components/charts-admin/featured-performance-chart';
import { GatedEventsChart } from '@/components/charts-admin/gated-events-chart';
import { MonthlyOverviewChart } from '@/components/charts-admin/monthly-overview-chart';
import { RegistrationStatusChart } from '@/components/charts-admin/registration-status-chart';
import { RegistrationTimelineChart } from '@/components/charts-admin/registration-timeline-chart';
import { RegistrationTrendsChart } from '@/components/charts-admin/registration-trends-chart';
import { StatsCards } from '@/components/charts-admin/stats-cards';
import { TagsChart } from '@/components/charts-admin/tags-chart';
import { TeamVsIndividualChart } from '@/components/charts-admin/team-vs-individual-chart';
import { VenueChart } from '@/components/charts-admin/venue-chart';
import { useDashboardData } from '@/components/providers/DashboardDataProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardContent() {
  const {
    isLoading,
    isError,
    refetch,
    stats,
    registrationTrends,
    eventTypeDistribution,
    registrationStatusData,
    eventPerformance,
    monthlyData,
    // New data
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
  } = useDashboardData();

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Stats skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-3 w-[80px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Charts skeleton */}
        <Skeleton className="h-[300px] w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Analytics and insights for your events
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Layout: AI Sidebar + Charts */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main Charts Area */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Registration Trends - Full Width */}
          <RegistrationTrendsChart
            data={registrationTrends}
            trend={stats.recentTrend}
            trendPercentage={stats.trendPercentage}
          />

          {/* Row 1: Status Distribution Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <RegistrationStatusChart
              data={registrationStatusData}
              acceptanceRate={stats.acceptanceRate}
            />
            <AttendanceChart
              data={attendanceData}
              attendanceRate={stats.attendanceRate}
            />
            <TeamVsIndividualChart data={teamVsIndividualData} />
            <GatedEventsChart data={gatedEventsData} />
          </div>

          {/* Row 2: Event Analytics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <EventTypeChart data={eventTypeDistribution} />
            <MonthlyOverviewChart data={monthlyData} />
            <FeaturedPerformanceChart
              data={featuredComparisonData}
              featuredAvg={featuredAvgRegs}
              regularAvg={regularAvgRegs}
            />
          </div>

          {/* Row 3: Timeline & Workflow */}
          <div className="grid gap-4 lg:grid-cols-3">
            <RegistrationTimelineChart
              data={registrationTimelineData}
              peakDay={peakRegistrationDay}
            />
            <ApprovalWorkflowChart
              data={approvalWorkflowData}
              autoApproveRate={autoApproveRate}
            />
          </div>

          {/* Row 4: Detailed Breakdowns */}
          <div className="grid gap-4 md:grid-cols-2">
            <VenueChart data={venueData} />
            <TagsChart data={tagsData} />
          </div>

          {/* Row 5: Event Performance */}
          <EventPerformanceChart data={eventPerformance} />
        </div>
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardContent />
  );
}
