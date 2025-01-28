import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { to, subject, body } = await request.json();

  try {
    const data = await resend.emails.send({
      from: 'Admin <no-reply@thefoundersclub.tech>',
      to: [to],
      subject: subject,
      html: body,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
