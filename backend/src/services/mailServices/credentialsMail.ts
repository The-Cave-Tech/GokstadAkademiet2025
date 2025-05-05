// backend/src/services/mailServices/credentialsMail.ts
import { 
    EmailTemplateOptions, 
    generateVerificationEmailHTML, 
    generateVerificationCode, 
    sendEmail 
  } from './baseMailService';
  
  /**
   * Send verifiseringse-post for endring av brukernavn
   */
  export async function sendUsernameChangeVerification(
    email: string, 
    username: string, 
    existingCode?: string
  ): Promise<string> {
    // Use the existing code if provided, otherwise generate a new one
    const verificationCode = existingCode || generateVerificationCode();
    
    const templateOptions: EmailTemplateOptions = {
      to: email,
      username,
      verificationCode,
      subject: 'Verifiser endring av brukernavn',
      actionText: 'Endring av brukernavn'
    };
    
    const html = generateVerificationEmailHTML(templateOptions);
    const text = `Din verifiseringskode for endring av brukernavn er: ${verificationCode}. Koden er gyldig i 15 minutter.`;
    
    await sendEmail(email, templateOptions.subject, text, html);
    
    return verificationCode;
  }
  
  /**
   * Send verifiseringse-post for endring av e-post
   */
  export async function sendEmailChangeVerification(
    newEmail: string, 
    username: string, 
    existingCode?: string
  ): Promise<string> {
    // Use the existing code if provided, otherwise generate a new one
    const verificationCode = existingCode || generateVerificationCode();
    
    const templateOptions: EmailTemplateOptions = {
      to: newEmail,
      username,
      verificationCode,
      subject: 'Verifiser endring av e-post',
      actionText: 'Endring av e-post'
    };
    
    const html = generateVerificationEmailHTML(templateOptions);
    const text = `Din verifiseringskode for endring av e-post er: ${verificationCode}. Koden er gyldig i 15 minutter.`;
    
    await sendEmail(newEmail, templateOptions.subject, text, html);
    
    return verificationCode;
  }
  
  /**
   * Send bekreftelse på endring av passord
   */
  export async function sendPasswordChangeConfirmation(email: string, username: string): Promise<void> {
    const subject = 'Passord endret';
    const text = `Hei ${username}, ditt passord er nå endret. Hvis du ikke gjorde denne endringen, vennligst kontakt support umiddelbart.`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Passord endret</h2>
        <p>Hei ${username},</p>
        <p>Ditt passord er nå endret.</p>
        <p><strong>Hvis du ikke gjorde denne endringen, vennligst kontakt support umiddelbart.</strong></p>
        <p>Med vennlig hilsen,<br>The Cave Tech</p>
      </div>
    `;
    
    await sendEmail(email, subject, text, html);
  }