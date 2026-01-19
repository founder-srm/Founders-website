'use client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import type { RowSelectionState } from '@tanstack/react-table';
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Clock,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Users,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getAllEvents } from '@/actions/admin/events';
import { getAllRegistrationsWithUser } from '@/actions/admin/registrations';
import { RegistrationColumns } from '@/components/data-table-admin/registrations/columns';
import { DataTable } from '@/components/data-table-admin/registrations/data-table';
import { EventFilterToggle } from '@/components/EventFilterToggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Event } from '@/types/events';
import type { Registration } from '@/types/registrations';
import { exportToExcel } from '@/utils/export';
import { createClient } from '@/utils/supabase/elevatedClient';

const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[120px]" />
      ))}
    </div>
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function RegistrationsPage() {
  const supabase = createClient();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'team'>('all');

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery<Event[]>(getAllEvents(supabase));

  const {
    data: registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
    refetch,
  } = useQuery<Registration[]>(getAllRegistrationsWithUser(supabase));

  // Transform events for the filter toggle
  const eventOptions = useMemo(() => {
    if (!events) return [];
    return events.map(event => ({
      id: event.id,
      name: event.title,
    }));
  }, [events]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!registrations) return {
      total: 0,
      accepted: 0,
      pending: 0,
      rejected: 0,
      teams: 0,
      acceptanceRate: 0,
    };

    const total = registrations.length;
    const accepted = registrations.filter(r => r.is_approved === 'ACCEPTED').length;
    const pending = registrations.filter(r => r.is_approved === 'SUBMITTED').length;
    const rejected = registrations.filter(r => r.is_approved === 'REJECTED' || r.is_approved === 'INVALID').length;
    const teams = registrations.filter(r => r.is_team_entry === true).length;

    return {
      total,
      accepted,
      pending,
      rejected,
      teams,
      acceptanceRate: total > 0 ? ((accepted / total) * 100).toFixed(1) : '0',
    };
  }, [registrations]);

  // Filter registrations by selected event and tab
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];
    
    let filtered = registrations;

    // Filter by event
    if (selectedEventId) {
      filtered = filtered.filter(reg => reg.event_id && reg.event_id === selectedEventId);
    }

    // Filter by tab
    switch (activeTab) {
      case 'pending':
        filtered = filtered.filter(r => r.is_approved === 'SUBMITTED');
        break;
      case 'accepted':
        filtered = filtered.filter(r => r.is_approved === 'ACCEPTED');
        break;
      case 'team':
        filtered = filtered.filter(r => r.is_team_entry === true);
        break;
      default:
        break;
    }

    return filtered;
  }, [registrations, selectedEventId, activeTab]);

  // Get selected registrations for export
  const selectedRegistrations = useMemo(() => {
    if (!filteredRegistrations) return [];
    const selected: Registration[] = [];

    Object.keys(rowSelection).forEach(key => {
      const index = Number.parseInt(key, 10);
      if (
        !Number.isNaN(index) &&
        rowSelection[key] &&
        filteredRegistrations[index]
      ) {
        selected.push(filteredRegistrations[index]);
      }
    });

    return selected;
  }, [filteredRegistrations, rowSelection]);

  // Reset row selection when the filter changes
  useEffect(() => {
    setRowSelection({});
  }, [selectedEventId, activeTab]);

  // Handle row selection change
  const handleRowSelectionChange = (newRowSelection: RowSelectionState) => {
    setRowSelection(newRowSelection);
  };

  // Handle exports
  const handleExportAll = () => {
    if (filteredRegistrations.length > 0) {
      const filename = selectedEventId
        ? `${events?.find(e => e.id === selectedEventId)?.title || 'event'}_registrations`
        : 'all_registrations';
      exportToExcel(filteredRegistrations, filename);
    }
  };

  const handleExportSelected = () => {
    if (selectedRegistrations.length > 0) {
      const filename = selectedEventId
        ? `${events?.find(e => e.id === selectedEventId)?.title || 'event'}_selected`
        : 'selected_registrations';
      exportToExcel(selectedRegistrations, filename);
    }
  };

  // Calculate registration counts per event for display
  const eventCounts = useMemo(() => {
    return events?.map(event => {
      const count = registrations?.filter(reg => reg.event_id === event.id).length || 0;
      return { id: event.id, name: event.title, count };
    }) || [];
  }, [events, registrations]);

  if (registrationsLoading || eventsLoading) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Registrations</h1>
        <TableSkeleton />
      </div>
    );
  }

  if (registrationsError || eventsError) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <ClipboardList className="h-8 w-8 text-primary" />
                Registrations
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and review all event registrations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExportAll}
                disabled={filteredRegistrations.length === 0}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export All ({filteredRegistrations.length})
              </Button>
              <Button
                className="gap-2"
                onClick={handleExportSelected}
                disabled={selectedRegistrations.length === 0}
              >
                <Download className="h-4 w-4" />
                Export Selected ({selectedRegistrations.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total Registrations"
            value={stats.total}
            description="All time registrations"
            icon={Users}
          />
          <StatsCard
            title="Accepted"
            value={stats.accepted}
            description={`${stats.acceptanceRate}% acceptance rate`}
            icon={CheckCircle}
            className="border-l-4 border-l-emerald-500"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            description="Awaiting approval"
            icon={Clock}
            className="border-l-4 border-l-amber-500"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            description="Declined entries"
            icon={XCircle}
            className="border-l-4 border-l-rose-500"
          />
          <StatsCard
            title="Team Entries"
            value={stats.teams}
            description="Group registrations"
            icon={UserCheck}
            className="border-l-4 border-l-violet-500"
          />
        </div>

        {/* Event Filter */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filter by Event</CardTitle>
          </CardHeader>
          <CardContent>
            <EventFilterToggle
              events={eventOptions}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              eventCounts={eventCounts}
            />
          </CardContent>
        </Card>

        {/* Tabs and Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Registration Records</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredRegistrations.length} registration{filteredRegistrations.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                <TabsList>
                  <TabsTrigger value="all" className="gap-2">
                    All
                    <Badge variant="secondary" className="ml-1">{registrations?.length || 0}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="gap-2">
                    Pending
                    <Badge variant="secondary" className="ml-1 bg-amber-500/20 text-amber-600">{stats.pending}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="accepted" className="gap-2">
                    Accepted
                    <Badge variant="secondary" className="ml-1 bg-emerald-500/20 text-emerald-600">{stats.accepted}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="gap-2">
                    Teams
                    <Badge variant="secondary" className="ml-1 bg-violet-500/20 text-violet-600">{stats.teams}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={RegistrationColumns}
              data={filteredRegistrations}
              onRowSelectionChange={handleRowSelectionChange}
              onRefresh={() => refetch()}
              activeTab={activeTab}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
