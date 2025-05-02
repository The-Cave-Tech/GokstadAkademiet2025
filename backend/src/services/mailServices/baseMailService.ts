// backend/src/services/mailServices/baseMailService.ts
export interface EmailTemplateOptions {
    to: string;
    username: string;
    verificationCode: string;
    subject: string;
    actionText: string;
    additionalText?: string;
  }
  
  /**
   * Generer en felles HTML-mal for alle verifiseringse-poster
   */
  export function generateVerificationEmailHTML({
    username,
    verificationCode,
    actionText,
    additionalText = ''
  }: EmailTemplateOptions): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">${actionText}</h2>
        <p>Hei ${username},</p>
        <p>Din verifiseringskode for ${actionText.toLowerCase()} er:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
          ${verificationCode}
        </div>
        <p>Koden er gyldig i 15 minutter.</p>
        ${additionalText}
        <p>Hvis du ikke ba om denne endringen, kan du ignorere denne e-posten.</p>
        <p>Med vennlig hilsen,<br>The Cave Tech</p>
      </div>
    `;
  }
  
  /**
   * Generere verifiseringskode
   */
  export function generateVerificationCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated verification code: ${code}`);
    return code;
  }
  
  /**
   * Standardfunksjon for å sende e-post med Strapi
   */
  export async function sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'maad1006@gmail.com';
      
      await strapi.plugins['email'].services.email.send({
        to,
        from: fromEmail,
        replyTo: process.env.SENDGRID_REPLY_TO || fromEmail,
        subject,
        text,
        html
      });
      
      console.log(`Email successfully sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      
      if (error.response) {
        console.error('SendGrid API error details:', error.response.body);
      }
      
      throw new Error(`Could not send email: ${error.message || 'Unknown error'}`);
    }
  }