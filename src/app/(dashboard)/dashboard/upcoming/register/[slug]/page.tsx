'use client';
import { formatInTimeZone } from 'date-fns-tz';
import { Info, Lock, Radio } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useUser } from '@/stores/session';
import { createClient } from '@/utils/supabase/client';
import {
  type eventsInsertType,
  typeformFieldSchema,
} from '../../../../../../../schema.zod';
import { TypeformMultiStep } from './multistep-typeform';

const typeformSchema = z
  .array(typeformFieldSchema)
  .min(1, 'At least one field is required');

export default function TypeformPage() {
  const params = useParams<{ slug: string }>();
  const Router = useRouter();
  const user = useUser();
  const [event, setEvent] = useState<(eventsInsertType & { is_gated?: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!user?.id) return;

      const supabase = createClient();
      
      // Check if user is a club member (has club account)
      const { data: clubMemberData } = await supabase
        .from('clubuseraccount')
        .select('id, is_verified')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const isClubMember = clubMemberData?.is_verified === true;
      
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (eventError) {
        setError(eventError.message);
        setLoading(false);
        return;
      }

      // Check if event is gated and user is not a verified club member
      if (eventData.is_gated && !isClubMember) {
        setError('gated');
        setLoading(false);
        return;
      }

      // Check if user is already registered
      const { data: registrationData } = await supabase
        .from('eventsregistrations')
        .select('*')
        .eq('event_id', eventData.id)
        .eq('application_id', user.id)
        .maybeSingle();

      if (registrationData) {
        Router.push('/dashboard/account');
        return;
      }

      setEvent(eventData);
      setLoading(false);
    }

    fetchEvent();
  }, [params.slug, Router, user?.id]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  
  // Handle gated event access denied
  if (error === 'gated') {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-accent p-4 shadow-lg shadow-black/5">
          <div className="flex gap-2">
            <div className="flex grow gap-3">
              <Lock
                className="mt-0.5 shrink-0 text-amber-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              <div className="flex grow flex-col gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Club Members Only Event
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This event is exclusively for club members. Please contact an admin
                    if you believe you should have access.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => Router.push('/upcoming')}>
                    Browse Other Events
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (error) return <div className="h-screen w-full flex items-center justify-center text-destructive">Error: {error}</div>;

  const parseResult = typeformSchema.safeParse(event?.typeform_config);
  if (!parseResult.success) {
    console.error('Form configuration error:', parseResult.error.flatten());
    return (
      <div className="p-4 text-red-600">
        <h2 className="font-bold">Invalid form configuration</h2>
        <pre>{JSON.stringify(parseResult.error.flatten(), null, 2)}</pre>
      </div>
    );
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const now = new Date();
  const publishDate = new Date(event.publish_date);
  const endDate = new Date(event.start_date);

  if (publishDate > now) {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-accent p-4 shadow-lg shadow-black/5 scale-150">
          <div className="flex items-center gap-2">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
              aria-hidden="true"
            >
              <Radio className="opacity-60" size={16} strokeWidth={2} />
            </div>
            <div className="flex grow items-center gap-12">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Live at{' '}
                  {Math.ceil(
                    (publishDate.getTime() - now.getTime()) / (1000 * 60 * 60)
                  )}{' '}
                  hours
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatInTimeZone(
                    publishDate,
                    'Asia/Kolkata',
                    'dd MMMM yyyy, hh:mm a zzz'
                  )}
                  .
                </p>
              </div>
              <Button size="sm" onClick={() => Router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
    // <div>Please wait until {publishDate.toLocaleString()}.</div>;
  }

  if (endDate < now) {
    return (
      <main className="h-screen w-full flex items-center justify-center ">
        <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-accent p-4 shadow-lg shadow-black/5">
          <div className="flex gap-2">
            <div className="flex grow gap-3">
              <Info
                className="mt-0.5 shrink-0 text-blue-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              <div className="flex grow flex-col gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Event Registration has already ended.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatInTimeZone(
                      endDate,
                      'Asia/Kolkata',
                      'dd MMMM yyyy, hh:mm a zzz'
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => Router.push('/upcoming')}>
                    Check out More events
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
    // <div>Event Registration has already ended.</div>;
  }

  return (
    <main className="h-screen w-full flex items-center justify-center bg-accent">
      <TypeformMultiStep eventData={event} fields={parseResult.data} />
    </main>
  );
}
