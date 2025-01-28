import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Tag, User, MapPin, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/utils/supabase/server';
import type { eventsInsertType } from '../../../../../../schema.zod';
import { CustomMDX } from '@/mdx-components';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

async function getEventsBySlug({ slug }: { slug: string }) {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !events) {
    console.error('Error fetching events:', error);
    return null;
  }

  return events as eventsInsertType;
}

export default async function EventRegistrationSection({
  params,
}: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const event = await getEventsBySlug({ slug });

  if (!event) {
    return <div className="container py-32 text-center">Event not found</div>;
  }

  return (
    <main className="py-16 md:py-32 w-full flex flex-col items-center space-y-6 max-md:mt-[-4rem]">
      <section className="container px-4 md:px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-semibold lg:text-6xl">
            {event.title}
          </h2>
          <p className="mb-6 text-sm md:text-base font-medium text-muted-foreground lg:text-lg">
            {event.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-10">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={`/dashboard/upcoming/register/${slug}`}>
                Register for this event
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href={event.more_info || '#'}>More Information</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-screen-xl rounded-lg bg-muted pr-4 md:pr-10 pt-4 md:pt-10 lg:pr-32 lg:pt-28">
          <Image
            src={event.banner_image || '/placeholder.svg'}
            alt={event.title}
            width={1200}
            height={600}
            className="h-full max-h-[300px] md:max-h-[600px] w-full rounded-bl-lg rounded-tr-lg object-cover"
          />
        </div>
      </section>

      <section className="container mt-8 md:mt-14 px-4 md:px-6">
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center">
          Event Details
        </h3>
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <EventDetailCard
            icon={<User className="h-5 w-5" />}
            title="Conducted by"
            content={
              <div className="flex items-center gap-4">
                <Image
                  src="/FC-logo1.png"
                  alt="Founder's Club"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span>Founder&apos;s Club</span>
              </div>
            }
            />
            <EventDetailCard
            icon={<CalendarDays className="h-5 w-5" />}
            title="Starting on"
            content={new Date(new Date(event.start_date).getTime() + (5.5 * 60 * 60 * 1000)).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
            />
            <EventDetailCard
            icon={<Tag className="h-5 w-5" />}
            title="Tags"
            content={
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            }
          />
          <EventDetailCard
            icon={<MapPin className="h-5 w-5" />}
            title="Venue"
            content={event.venue || 'To be announced'}
          />
          <EventDetailCard
            icon={<Clock className="h-5 w-5" />}
            title="End Date"
            content={new Date(event.end_date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
          <EventDetailCard
            icon={<Info className="h-5 w-5" />}
            title="Event Type"
            content={event.event_type}
          />
        </div>
      </section>
      <section className="container mt-8 md:mt-14 px-4 md:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Event Rules</CardTitle>
          </CardHeader>
          <CardContent className="ml-2" suppressHydrationWarning>
            <CustomMDX source={event.rules || ''} />
          </CardContent>
          <CardFooter>
            <div className="flex flex-col sm:flex-row w-full justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 md:mb-10">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={`/dashboard/upcoming/register/${slug}`}>
                  Register for this event
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href={event.more_info || '#'}>More Information</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

function EventDetailCard({
  icon,
  title,
  content,
}: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
  return (
    <Card className="bg-accent border-background">
      <CardHeader>
        <CardTitle className="flex items-center text-base md:text-lg font-medium">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm md:text-base text-muted-foreground">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
