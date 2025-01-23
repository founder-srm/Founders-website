'use client';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/stores/session';
import {
  typeformFieldSchema,
  type eventsInsertType,
} from '../../../../../../../schema.zod';
import { TypeformMultiStep } from './multistep-typeform';
import { useParams } from 'next/navigation';

const typeformSchema = z
  .array(typeformFieldSchema)
  .min(1, 'At least one field is required');

export default function TypeformPage() {
  const params = useParams<{ slug: string }>();
  const Router = useRouter();
  const user = useUser();
  const [event, setEvent] = useState<eventsInsertType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!user?.id) return;

      const supabase = createClient();
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

      // Check if user is already registered
      const { data: registrationData } = await supabase
        .from('eventsregistrations')
        .select('*')
        .eq('event_id', eventData.id)
        .eq('application_id', user.id)
        .single();

      console.log('registrationData', registrationData);
      if (registrationData) {
        Router.push('/dashboard/account');
        return;
      }

      setEvent(eventData);
      setLoading(false);
    }

    fetchEvent();
  }, [params.slug, Router, user?.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
    return <div>Please wait until {publishDate.toLocaleString()}.</div>;
  }

  if (endDate < now) {
    return <div>Event Registration has already ended.</div>;
  }


  return (
    <>
      <TypeformMultiStep eventData={event} fields={parseResult.data} />
    </>
  );
}
