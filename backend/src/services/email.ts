export const generateVerificationCode = (): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated verification code: ${code}`);
    return code;
  };
  
  export interface EmailOptions {
    to: string;
    subject: string;
    username: string;
    verificationCode: string;
    action: string;
  }
  
  /**
   * Send a verification email using Strapi's email plugin
   * @param options Configuration for the verification email
   */
  export const sendVerificationEmail = async (
    { to, subject, username, verificationCode, action }: EmailOptions
  ): Promise<void> => {
    try {
      console.log(`Attempting to send verification email to ${to} for ${action} with code ${verificationCode}`);
      
      // Create a nicely formatted HTML email with Norwegian text
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">${subject}</h2>
          <p>Hei ${username},</p>
          <p>Din verifiseringskode for ${action} er:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>Koden er gyldig i 15 minutter.</p>
          <p>Hvis du ikke ba om denne endringen, kan du ignorere denne e-posten.</p>
          <p>Med vennlig hilsen,<br>The Cave Tech</p>
        </div>
      `;
      
      // Get sender email from environment variables or use default
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'maad1006@gmail.com';
      
      // Use Strapi's email plugin to send the email
      const result = await strapi.plugins['email'].services.email.send({
        to,
        from: fromEmail,
        replyTo: process.env.SENDGRID_REPLY_TO || fromEmail,
        subject,
        text: `Din verifiseringskode for ${action} er: ${verificationCode}. Koden er gyldig i 15 minutter.`,
        html
      });
      
      console.log(`Email successfully sent to ${to} for ${action}`, result);
    } catch (error) {
      console.error(`Failed to send email for ${action} to ${to}:`, error);
      
      // Log more detailed error info if available
      if (error.response) {
        console.error('SendGrid API error details:', error.response.body);
      }
      
      throw new Error(`Could not send verification email: ${error.message || 'Unknown error'}`);
    }
  };