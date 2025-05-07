// backend/src/api/contact-submission/controllers/contact-submission.ts
import { factories } from '@strapi/strapi';
import { sendContactNotification } from '../../../services/mailServices/contactMail';

export default factories.createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Create the entry using the default controller
      const response = await super.create(ctx);
      
      // Send notification email
      await sendContactNotification({
        name: response.data.attributes.name,
        email: response.data.attributes.email,
        phoneNumber: response.data.attributes.phoneNumber,
        message: response.data.attributes.message
      });
      
      return response;
    } catch (error) {
      return ctx.badRequest(`Error processing contact form: ${error.message}`);
    }
  }
}));