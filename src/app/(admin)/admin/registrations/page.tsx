'use client';
import { getAllRegistrationsWithUser } from '@/actions/admin/registrations';
import { RegistrationColumns } from '@/components/data-table-admin/registrations/columns';
import { DataTable } from '@/components/data-table-admin/registrations/data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/elevatedClient';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  ClipboardList,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

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

  const {
    data: registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
  } = useQuery<Registration[]>(getAllRegistrationsWithUser(supabase));

  if (registrationsLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Events</h1>
        <TableSkeleton />
      </div>
    );
  }

  if (registrationsError) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Registrations. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="shadow">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold  flex items-center">
              <ClipboardList className="mr-2 h-8 w-8 text-primary" />
              Registrations Manager
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className=" shadow rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">All Registrations</h2>
              <p className="mt-1 text-sm">
                A list of all registrations for Founders Club Events.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex gap-2 items-center">
                <FileSpreadsheet /> Export
              </Button>
            </div>
          </div>
          {/* biome-ignore lint/style/noNonNullAssertion: its handled bruh */}
          <DataTable columns={RegistrationColumns} data={registrations!} />
        </div>
      </main>
    </div>
  );
}
