// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { Resend } from 'https://esm.sh/resend'

// Initialize Resend with your API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

Deno.serve(async (req) => {
  // Get the payload from the request
  const payload = await req.json()
  const record = payload.record

  try {
    // Verify this is an insert event
    if (payload.type !== 'INSERT') {
      return new Response(JSON.stringify({
        message: 'This function only handles INSERT events'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Send email using Resend
    let emailData = {
      from: 'The Founder\'s Club <no-reply@thefoundersclub.tech>',
      to: [record.email],
      subject: 'Your Contact Request has been Submitted',
      html: `Hi ${record.name},<br/><br/>Thank you for reaching out to the Founder's Club! We have successfully received your contact request and will be shortly reaching out to you.<br/><br/>The Founder's Club<br/>Directorate of Entrepeunership and Innovation<br/>SRM Institute of Science and Technology<br/>Kattankulathur<br/>Tamil Nadu - 603203
      `
    }
    console.log(`Sending email to contactor<br/>${JSON.stringify(emailData, null, 2)}`)
    await resend.emails.send(emailData)
    console.log(`Sent email to contactor\n${JSON.stringify(emailData, null, 2)}`)
    
    emailData = {
      from: 'The Founder\'s Club <no-reply@thefoundersclub.tech>',
      to: ["support@thefoundersclub.in"],
      subject: 'New Contact Request has been Submitted',
      html: `Name: ${record.name}<br/>Email: ${record.email}<br/>Phone: ${record.phone}<br/>Subject: <strong>${record.subject}</strong><br/>Description: ${record.description}<br/><br/>The Founder's Club<br/>Directorate of Entrepeunership and Innovation<br/>SRM Institute of Science and Technology<br/>Kattankulathur<br/>Tamil Nadu - 603203
      `
    }
    console.log(`Sending email to support\n${JSON.stringify(emailData, null, 2)}`)
    await resend.emails.send(emailData)
    console.log(`Sent email to support\n${JSON.stringify(emailData, null, 2)}`)
    
    return new Response(
      JSON.stringify({ message: 'Email sent successfully', emailData }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/contact-function' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
