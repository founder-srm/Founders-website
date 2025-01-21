import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'node:fs';
import path from 'node:path';

import type { typeformInsertType } from '../../../../schema.zod';
import { EmailTemplate } from '@/components/email-templates/template';

// if (!process.env.RESEND_API_KEY) {
//   throw new Error('Missing RESEND_API_KEY environment variable');
// }

const resend = new Resend(process.env.RESEND_API_KEY);

// Use verified domain email
const FROM_EMAIL = 'no-reply@thefoundersclub.tech';

export async function POST(req: Request) {
  try {
    const { registration, ticketImageUrl } = await req.json();

    // Read logo and convert to base64
    const logoPath = path.join(process.cwd(), 'public', 'FC-logo2.jpeg');
    const logoBuffer = fs.readFileSync(logoPath);

    // Create a new object with the logo data
    const registrationWithLogo: typeformInsertType & { logoBase64: string } = {
      ...registration,
      logoBase64: logoBuffer.toString('base64')
    };

    // Convert ticket image to buffer for attachment
    const ticketBuffer = Buffer.from(
      ticketImageUrl.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const data = await resend.emails.send({
      from: `Founders Club <${FROM_EMAIL}>`,
      to: [registration.details?.email],
      subject: `Your Ticket for ${registration.event_title}`,
      attachments: [
        {
          filename: `${registration.event_title}-${registration.ticket_id}.png`,
          content: ticketBuffer,
          contentType: 'image/png',
        }
      ],
      html: EmailTemplate({ registration: registrationWithLogo, ticketImageUrl }),
    });

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Detailed API Error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to send email', details: error },
      { status: 500 }
    );
  }
}