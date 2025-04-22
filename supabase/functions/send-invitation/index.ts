
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitationRequest {
  email: string;
  role: string;
  inviter: string;
  message?: string;
  temporaryPassword?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData: InvitationRequest = await req.json()
    const { email, role, inviter, message, temporaryPassword } = requestData

    // Validate required fields
    if (!email || !role || !inviter) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: email, role, and inviter are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // In a production environment, you would use a service like Resend or SendGrid to send emails
    // For now, we'll just log the details and simulate a successful response
    console.log('Sending invitation email to:', email)
    console.log('Role:', role)
    console.log('Invited by:', inviter)
    console.log('Personalized message:', message || 'No personalized message')
    console.log('Temporary password (redacted for security):', temporaryPassword ? '********' : 'None provided')

    // Insert a record in the database to track invitations
    // This would be a good place to store invitation details for tracking/reporting

    // In a real implementation, this would be where you'd call your email service
    // For example, with Resend:
    /*
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    await resend.emails.send({
      from: 'SunderlandFamily Hub <noreply@sunderlandfamily.com>',
      to: [email],
      subject: 'You have been invited to join SunderlandFamily Hub',
      html: `
        <h1>Welcome to SunderlandFamily Hub!</h1>
        <p>You have been invited by ${inviter} to join SunderlandFamily Hub as a ${role}.</p>
        ${message ? `<p>Personal message: "${message}"</p>` : ''}
        ${temporaryPassword ? `<p>Your temporary password is: <strong>${temporaryPassword}</strong></p>` : ''}
        <p>Please click the link below to get started:</p>
        <p><a href="https://your-app-url.com/login">Login to SunderlandFamily Hub</a></p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
    });
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation sent successfully',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error processing invitation request:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process invitation request',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
