
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend@3.0.0'

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

    console.log('Processing invitation for:', email)
    console.log('Role:', role)
    console.log('Invited by:', inviter)
    
    // Initialize Resend with API key from environment variable
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    
    const resend = new Resend(resendApiKey)

    // Get the application URL from environment or use a default
    // Get deployment URL from Deno.env or use a fallback
    const appUrl = Deno.env.get('APP_URL') || 'https://sunderland-family-hub.vercel.app'
    console.log('Using app URL:', appUrl)

    // Build the HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Welcome to SunderlandFamily Hub!</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
          You have been invited by <strong>${inviter}</strong> to join SunderlandFamily Hub as a <strong>${role}</strong>.
        </p>
        ${message ? `<p style="font-size: 16px; line-height: 1.5; color: #555; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #607d8b; font-style: italic;">
          "${message}"
        </p>` : ''}
        ${temporaryPassword ? `<p style="font-size: 16px; line-height: 1.5; color: #555;">
          Your temporary password is: <strong style="background-color: #f0f0f0; padding: 3px 6px; border-radius: 3px;">${temporaryPassword}</strong>
          <br><em>(Please change your password after logging in for the first time)</em>
        </p>` : ''}
        <div style="text-align: center; margin: 30px 0;">
          <a href="${appUrl}/login" style="background-color: #4a86e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Log In Now</a>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">
          If this is your first time logging in, you will need to use the temporary password provided above or use the password reset option if no temporary password was included.
        </p>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
          If you have any questions, please contact us at support@sunderlandfamily.com
        </p>
      </div>
    `

    console.log('Sending email to:', email)

    // Send email using Resend
    const { data, error: resendError } = await resend.emails.send({
      from: 'SunderlandFamily Hub <noreply@sunderlandfamily.com>',
      to: [email],
      subject: 'You have been invited to join SunderlandFamily Hub',
      html: htmlContent,
    });

    if (resendError) {
      console.error('Resend API error:', resendError);
      throw new Error(`Failed to send email: ${resendError.message}`);
    }

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation sent successfully',
        data
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
