'use client';
import { getAllRegistrationsWithUser } from '@/actions/admin/registrations';
import { getAllEvents } from '@/actions/admin/events';
import type { Event } from '@/types/events';
import { RegistrationColumns } from '@/components/data-table-admin/registrations/columns';
import { DataTable } from '@/components/data-table-admin/registrations/data-table';
import { EventFilterToggle } from '@/components/EventFilterToggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Registration } from '@/types/registrations';
import { exportToExcel } from '@/utils/export';
import { createClient } from '@/utils/supabase/elevatedClient';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  ClipboardList,
  AlertCircle,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';

const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export default function RegistrationsPage() {
  const supabase = createClient();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Debug state to check event IDs
  const [, setDebug] = useState<{
    eventIds: string[];
    registrationEventIds: string[];
  }>({
    eventIds: [],
    registrationEventIds: [],
  });

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery<Event[]>(getAllEvents(supabase));

  const {
    data: registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
  } = useQuery<Registration[]>(getAllRegistrationsWithUser(supabase));

  // Collect unique event IDs for debugging
  useEffect(() => {
    if (events && registrations) {
      const eventIds = events.map(event => event.id);
      const registrationEventIds = Array.from(
        new Set(
          registrations
            .map(reg => reg.event_id)
            .filter((id): id is string => id !== undefined)
        )
      );

      setDebug({
        eventIds,
        registrationEventIds,
      });

      console.log('Events:', events);
      console.log('Event IDs:', eventIds);
      console.log('Registration Event IDs:', registrationEventIds);
    }
  }, [events, registrations]);

  // Transform events for the filter toggle
  const eventOptions = useMemo(() => {
    if (!events) return [];
    return events.map(event => ({
      id: event.id,
      name: event.title,
    }));
  }, [events]);

  // Filter registrations by selected event - ensure proper comparison
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];
    if (!selectedEventId) return registrations;

    const filtered = registrations.filter(reg => {
      // Ensure we're comparing the same data types and handle possible null values
      return reg.event_id && reg.event_id === selectedEventId;
    });

    console.log(
      `Filtered for event ${selectedEventId}: ${filtered.length} registrations`
    );
    return filtered;
  }, [registrations, selectedEventId]);

  // Get selected registrations for export
  const selectedRegistrations = useMemo(() => {
    if (!filteredRegistrations) return [];
    const selected: Registration[] = [];

    // biome-ignore lint/complexity/noForEach: it works fine
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
  }, []);

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

  if (registrationsLoading || eventsLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Registrations</h1>
        <TableSkeleton />
      </div>
    );
  }

  if (registrationsError || eventsError) {
    return (
      <div className="container mx-auto py-10">
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

  // Calculate registration counts per event for display
  const eventCounts =
    events?.map(event => {
      const count =
        registrations?.filter(reg => reg.event_id === event.id).length || 0;
      return { id: event.id, name: event.title, count };
    }) || [];

  return (
    <div className="min-h-screen">
      <header className="shadow">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center">
              <ClipboardList className="mr-2 h-8 w-8 text-primary" />
              Registrations Manager
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">All Registrations</h2>
              <p className="mt-1 text-sm">
                A list of all registrations for Founders Club Events.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="flex gap-2 items-center"
                onClick={handleExportAll}
              >
                <FileSpreadsheet /> Export All
                {selectedEventId && ` (${filteredRegistrations.length})`}
              </Button>
              <Button
                variant="default"
                className="flex gap-2 items-center"
                onClick={handleExportSelected}
                disabled={selectedRegistrations.length === 0}
              >
                <Download /> Export Selected ({selectedRegistrations.length})
              </Button>
            </div>
          </div>

          <EventFilterToggle
            events={eventOptions}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
            eventCounts={eventCounts}
          />

          <DataTable
            columns={RegistrationColumns}
            data={filteredRegistrations}
            onRowSelectionChange={handleRowSelectionChange}
          />
        </div>
      </main>
    </div>
  );
}
