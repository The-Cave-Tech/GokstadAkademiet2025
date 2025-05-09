// backend/src/services/mailServices/contactMail.ts
import { sendEmail } from './baseMailService';

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber?: string;
  message: string;
}

export async function sendContactNotification(formData: ContactFormData): Promise<void> {
  const adminEmail = process.env.DEFAULT_REPLY_TO_EMAIL;
  
  if (!adminEmail) {
    throw new Error("DEFAULT_REPLY_TO_EMAIL is not configured in environment variables");
  }
  
  const subject = `Ny kontakthenvendelse fra ${formData.name}`;
  
  const text = `
    Ny henvendelse fra kontaktskjema:
    
    Navn: ${formData.name}
    E-post: ${formData.email}
    Telefon: ${formData.phoneNumber || 'Ikke oppgitt'}
    
    Melding:
    ${formData.message}
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Ny henvendelse fra kontaktskjema</h2>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Navn:</strong> ${formData.name}</p>
        <p><strong>E-post:</strong> ${formData.email}</p>
        <p><strong>Telefon:</strong> ${formData.phoneNumber || 'Ikke oppgitt'}</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px;">
        <p><strong>Melding:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      </div>
      
      <p style="margin-top: 20px; color: #777;">
        Med vennlig hilsen,<br>
        The Cave Tech
      </p>
    </div>
  `;
  
  await sendEmail(adminEmail, subject, text, html);
}