// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Resend } from 'https://esm.sh/resend@4.1.1';
import { generateHTML } from './template.ts';

// Initialize Resend with your API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

interface EventRegistrationRecord {
  application_id?: string;
  attendance?: 'Present' | 'Absent';
  created_at?: string;
  details: Json;
  event_id?: string;
  event_title: string;
  id?: string;
  is_approved?: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'INVALID';
  registration_email: string;
  ticket_id?: number;
}

Deno.serve(async req => {
  // Get the payload from the request
  const payload = await req.json();
  const record = payload.record as EventRegistrationRecord;

  try {
    // Verify this is an insert or update event
    if (payload.type !== 'UPDATE') {
      return new Response(
        JSON.stringify({
          message: 'This function only handles UPDATE events',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    // Only send email if approval status is REJECTED
    if (record.is_approved !== 'REJECTED') {
      return new Response(
        JSON.stringify({
          message: 'No email sent - approval status is not REJECTED',
          status: record.is_approved,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    // Send confirmation email to registrant
    const registrantEmailData = {
      from: "The Founder's Club <no-reply@thefoundersclub.tech>",
      to: [record.registration_email],
      subject: 'Your Event Registration Confirmation',
      html: generateHTML(record),
    };

    console.log(
      `Sending email to registrant\n${JSON.stringify(registrantEmailData, null, 2)}`
    );
    await resend.emails.send(registrantEmailData);
    console.log(
      `Sent email to registrant\n${JSON.stringify(registrantEmailData, null, 2)}`
    );

    return new Response(
      JSON.stringify({
        message: 'Email sent successfully',
        registrantEmailData,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
