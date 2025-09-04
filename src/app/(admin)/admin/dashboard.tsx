'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useMemo } from 'react';
import { getAllEvents } from '@/actions/admin/events';
import { getAllRegistrations } from '@/actions/admin/registrations';
import { Component as AreaChartInteractive } from '@/components/charts-admin/area-chart-interactive';
import { BarChartComponent } from '@/components/charts-admin/bar-chart';
import { Component as BarChartHorizontal } from '@/components/charts-admin/bar-chart-horizontal';
import PieChartComponent from '@/components/charts-admin/pie-chart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Event } from '@/types/events';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const supabase = createClient();

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery<Event[]>(getAllEvents(supabase));
  const {
    data: registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
  } = useQuery<Registration[]>(getAllRegistrations(supabase));

  const registrationStats = useMemo(() => {
    if (!registrations) return [];
    return registrations.map(r => ({
      ...r,
      event_type: r.is_approved === 'SUBMITTED' ? 'Checked' : 'Pending',
      registrations_count: 1,
    }));
  }, [registrations]);

  if (eventsError || registrationsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (eventsLoading || registrationsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 py-2">
      <Card className="col-span-1 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Event Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartHorizontal
            events={events ?? []}
            registrations={registrations ?? []}
          />
        </CardContent>
      </Card>
      <Card className="col-span-1 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Registrations Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChartComponent data={registrationStats} />
        </CardContent>
      </Card>
      <Card className="col-span-1 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Events Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartComponent data={events} />
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardContent className="py-2">
          <AreaChartInteractive
            events={events ?? []}
            registrations={registrations ?? []}
          />
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events?.map(event => (
            <div key={event.id}>
              <h1>{event.title}</h1>
              <p>{event.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations?.map(r => (
            <div key={r.id}>
              <h2>{r.event_title}</h2>
              <p>ID: {r.id}</p>
              <p>Approved: {String(r.is_approved)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
