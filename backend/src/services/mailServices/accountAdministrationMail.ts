// backend/src/services/mailServices/accountAdministrationMail.ts

import { 
  EmailTemplateOptions, 
  generateVerificationEmailHTML, 
  generateVerificationCode, 
  sendEmail 
} from './baseMailService';

/**
 * Send verifiseringse-post for sletting av konto
 */
export async function sendAccountDeletionVerification(
  email: string, 
  username: string,
  existingCode?: string
): Promise<string> {
  // Use the existing code if provided, otherwise generate a new one
  const code = existingCode || generateVerificationCode();
  
  const templateOptions: EmailTemplateOptions = {
    to: email,
    username,
    verificationCode: code,
    subject: 'Verifiser sletting av konto',
    actionText: 'Sletting av konto',
    additionalText: '<p><strong>ADVARSEL:</strong> Dette vil permanent slette kontoen din og all tilhørende data. Denne handlingen kan ikke angres.</p>'
  };
  
  const html = generateVerificationEmailHTML(templateOptions);
  const text = `Din verifiseringskode for sletting av konto er: ${code}. Koden er gyldig i 15 minutter. ADVARSEL: Dette vil permanent slette kontoen din og all tilhørende data. Denne handlingen kan ikke angres.`;
  
  await sendEmail(email, templateOptions.subject, text, html);
  
  return code;
}

/**
 * Send slettingsgrunn til administratorer
 */
export async function sendDeletionFeedback(userEmail: string, username: string, deletionReason: string): Promise<void> {
  const adminEmail = process.env.DEFAULT_REPLY_TO_EMAIL;
  const subject = `Brukertilbakemelding ved kontosletting - ${username}`;
  const text = `
    Bruker ${username} (${userEmail}) har slettet sin konto med følgende begrunnelse:
    
    "${deletionReason}"
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Brukertilbakemelding ved kontosletting</h2>
      <p><strong>Bruker:</strong> ${username}</p>
      <p><strong>E-post:</strong> ${userEmail}</p>
      <p><strong>Årsak til sletting:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 10px 0;">
        ${deletionReason}
      </div>
    </div>
  `;
  
  await sendEmail(adminEmail, subject, text, html);
}

/**
 * Send bekreftelse på at kontoen er slettet
 */
export async function sendAccountDeletionConfirmation(email: string, username: string): Promise<void> {
  const subject = 'Konto slettet';
  const text = `Hei ${username}, din konto er nå permanent slettet. Takk for at du har brukt vår tjeneste.`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Konto slettet</h2>
      <p>Hei ${username},</p>
      <p>Din konto er nå permanent slettet.</p>
      <p>Takk for at du har brukt vår tjeneste.</p>
      <p>Med vennlig hilsen,<br>The Cave Tech</p>
    </div>
  `;
  
  await sendEmail(email, subject, text, html);
}