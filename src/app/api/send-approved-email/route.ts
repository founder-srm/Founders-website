import { RegistrationApprovedEmail } from '@/components/email-templates/registrationApprovedEmail';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { to, event, ticketid } = await request.json();

  try {
    const data = await resend.emails.send({
      from: 'Admin <no-reply@thefoundersclub.tech>',
      to: [to],
      subject: `Registration Approved for ${event}`,
      html: RegistrationApprovedEmail({ email: to, event, ticketid }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
