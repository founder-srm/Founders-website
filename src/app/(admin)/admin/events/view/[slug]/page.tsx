'use client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { formatInTimeZone } from 'date-fns-tz';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarDays,
  Clock,
  ExternalLink,
  Info,
  Lock,
  MapPin,
  RefreshCw,
  Tag,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { RegistrationColumns } from '@/components/data-table-admin/registrations/columns';
import { DataTable } from '@/components/data-table-admin/registrations/data-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Event } from '@/types/events';
import type { Registration } from '@/types/registrations';
import { createClient } from '@/utils/supabase/client';

function getEventBySlug(client: ReturnType<typeof createClient>, slug: string) {
  return client.from('events').select('*').eq('slug', slug).single();
}

function getRegistrationsByEventId(
  client: ReturnType<typeof createClient>,
  eventId: string
) {
  return client
    .from('eventsregistrations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
}

const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-8 w-64" />
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
);

export default function AdminEventViewPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const supabase = createClient();

  const {
    data: event,
    isLoading: eventLoading,
    isError: eventError,
    refetch: refetchEvent,
  } = useQuery<Event>(getEventBySlug(supabase, slug));

  const {
    data: registrations,
    isLoading: registrationsLoading,
    isError: registrationsError,
    refetch: refetchRegistrations,
  } = useQuery<Registration[]>(
    getRegistrationsByEventId(supabase, event?.id ?? ''),
    {
      enabled: !!event?.id,
    }
  );

  // Calculate registration stats
  const stats = useMemo(() => {
    if (!registrations) return { total: 0, approved: 0, pending: 0, rejected: 0 };
    return {
      total: registrations.length,
      approved: registrations.filter((r) => r.is_approved === 'ACCEPTED').length,
      pending: registrations.filter((r) => r.is_approved === 'SUBMITTED').length,
      rejected: registrations.filter((r) => r.is_approved === 'REJECTED' || r.is_approved === 'INVALID').length,
    };
  }, [registrations]);

  const handleRefresh = () => {
    refetchEvent();
    refetchRegistrations();
  };

  if (eventLoading) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PageSkeleton />
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load event details. The event may not exist or there was a
            server error.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="/admin/events">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{event.title}</h1>
                  {event.is_gated && (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Gated
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Event ID: {event.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/upcoming/more-info/${event.slug}`}
                  target="_blank"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public Page
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/admin/events/edit/${event.slug}`}>
                  Edit Event
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Calendar className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="registrations" className="gap-2">
              <Users className="h-4 w-4" />
              Registrations ({stats.total})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Event Banner & Description */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={event.banner_image || '/placeholder.svg'}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">Description</h2>
                      <p className="text-muted-foreground">
                        {event.description || 'No description provided.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Registration Stats */}
                <div className="grid gap-4 sm:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Registrations</CardDescription>
                      <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Approved</CardDescription>
                      <CardTitle className="text-3xl text-green-600">
                        {stats.approved}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Pending</CardDescription>
                      <CardTitle className="text-3xl text-yellow-600">
                        {stats.pending}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Rejected</CardDescription>
                      <CardTitle className="text-3xl text-red-600">
                        {stats.rejected}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </div>

              {/* Event Details Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Event Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">
                        {formatInTimeZone(
                          new Date(event.start_date),
                          'Asia/Kolkata',
                          'dd MMMM yyyy, hh:mm a'
                        )}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">
                        {formatInTimeZone(
                          new Date(event.end_date),
                          'Asia/Kolkata',
                          'dd MMMM yyyy, hh:mm a'
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Venue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {event.venue || 'To be announced'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Event Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-sm">
                      {event.event_type || 'Not specified'}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {event.tags && event.tags.length > 0 ? (
                        event.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Featured
                      </span>
                      <Badge
                        variant={event.is_featured ? 'default' : 'secondary'}
                      >
                        {event.is_featured ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Auto Approve
                      </span>
                      <Badge
                        variant={event.always_approve ? 'default' : 'secondary'}
                      >
                        {event.always_approve ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Gated Event
                      </span>
                      <Badge
                        variant={event.is_gated ? 'destructive' : 'secondary'}
                      >
                        {event.is_gated ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Event Registrations</CardTitle>
                    <CardDescription>
                      Manage all registrations for this event
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchRegistrations()}
                    disabled={registrationsLoading}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${registrationsLoading ? 'animate-spin' : ''}`}
                    />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {registrationsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : registrationsError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to load registrations. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : registrations && registrations.length > 0 ? (
                  <DataTable
                    columns={RegistrationColumns}
                    data={registrations}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      No registrations yet
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      This event doesn&apos;t have any registrations yet. Share
                      the event link to get participants!
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                      <Link
                        href={`/upcoming/more-info/${event.slug}`}
                        target="_blank"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Public Page
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
