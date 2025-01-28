'use client';

import { getAllEvents } from "@/actions/admin/events";
import { EventColumns } from "@/components/data-table-admin/events/columns"
import { DataTable } from "@/components/data-table-admin/events/data-table"
import type { Event } from "@/types/events";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Calendar, FileSpreadsheet, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export default function EventsPage() {
    const supabase = createClient();

    const {
      data: events,
      isLoading: eventsLoading,
      isError: eventsError,
    } = useQuery<Event[]>(getAllEvents(supabase));

  if (eventsLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Events</h1>
        <TableSkeleton />
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load events. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
    <header className="shadow">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <Calendar className="mr-2 h-8 w-8 text-indigo-600" />
            Events Manager
          </h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>
    </header>
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className=" shadow rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">All Events</h2>
            <p className="mt-2 text-sm ">
              A list of all the events created here. Including their title, type, dates, and venue.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex gap-2 items-center"><FileSpreadsheet /> Export</Button>
          </div>
        </div>
        {/* biome-ignore lint/style/noNonNullAssertion: its handled bruh */}
        <DataTable columns={EventColumns} data={events!} />
      </div>
    </main>
  </div>
  )
}

