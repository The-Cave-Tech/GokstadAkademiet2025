import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-profile.user-profile', ({ strapi }) => ({
  // Get the current user's profile
  async me(ctx) {
    const userId = ctx.state.user.id;
    
    // Find the user profile associated with the current user
    const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
      filters: { users_permissions_user: userId },
      populate: ['publicProfile', 'personalInformation', 'notificationSettings', 'accountAdministration', 'publicProfile.profileimage']
    });
    
    if (!userProfiles || userProfiles.length === 0) {
      // If no profile exists, create one
      const newProfile = await strapi.documents('api::user-profile.user-profile').create({
        data: {
          users_permissions_user: userId,
          publicProfile: {
            displayName: ctx.state.user.username || '',
            biography: '',
            showEmail: false,
            showPhone: false,
            showAddress: false
          },
          personalInformation: {
            fullName: '',
          },
          notificationSettings: {
            importantUpdates: false,
            newsletter: false
          },
          accountAdministration: {
            accountActive: true,
            accountCreationDate: new Date()
          }
        },
        populate: ['publicProfile', 'personalInformation', 'notificationSettings', 'accountAdministration']
      });
      
      return newProfile;
    }
    
    return userProfiles[0];
  },
  
  // Update public profile
  async updatePublicProfile(ctx) {
    const userId = ctx.state.user.id;
    const { data } = ctx.request.body;
    
    // Find the user profile associated with the current user
    const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
      filters: { users_permissions_user: userId }
    });
    
    if (!userProfiles || userProfiles.length === 0) {
      return ctx.notFound('Brukerprofil ikke funnet');
    }
    
    // Update the public profile component
    const updated = await strapi.documents('api::user-profile.user-profile').update({
      documentId: userProfiles[0].documentId,
      data: {
        publicProfile: data
      },
      populate: ['publicProfile', 'publicProfile.profileimage']
    });
    
    return updated;
  },
  
  // Update personal information
  async updatePersonalInformation(ctx) {
    const userId = ctx.state.user.id;
    const { data } = ctx.request.body;
    
    // Find the user profile associated with the current user
    const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
      filters: { users_permissions_user: userId }
    });
    
    if (!userProfiles || userProfiles.length === 0) {
      return ctx.notFound('Brukerprofil ikke funnet');
    }
    
    // Update the personal information component
    const updated = await strapi.documents('api::user-profile.user-profile').update({
      documentId: userProfiles[0].documentId,
      data: {
        personalInformation: data
      },
      populate: ['personalInformation']
    });
    
    return updated;
  },
  
  // Update notification settings
  async updateNotificationSettings(ctx) {
    const userId = ctx.state.user.id;
    const { data } = ctx.request.body;
    
    // Find the user profile associated with the current user
    const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
      filters: { users_permissions_user: userId }
    });
    
    if (!userProfiles || userProfiles.length === 0) {
      return ctx.notFound('Brukerprofil ikke funnet');
    }
    
    // Update the notification settings component
    const updated = await strapi.documents('api::user-profile.user-profile').update({
      documentId: userProfiles[0].documentId,
      data: {
        notificationSettings: data
      },
      populate: ['notificationSettings']
    });
    
    return updated;
  },
  
  // Request email verification for sensitive data changes
  async requestEmailVerification(ctx) {
    const userId = ctx.state.user.id;
    const { action } = ctx.request.body;
    
    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the verification code temporarily
    await strapi.documents('plugin::users-permissions.user').update({
      documentId: userId,
      data: {
        resetPasswordToken: verificationCode
      }
    });
    
    // Get the user's email
    const userData = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: userId
    });
    
    // Send the verification code via email
    try {
      await strapi.plugins['email'].services.email.send({
        to: userData.email,
        subject: `Verifiseringskode for ${action}`,
        text: `Din verifiseringskode for ${action} er: ${verificationCode}`,
        html: `<p>Din verifiseringskode for ${action} er: <strong>${verificationCode}</strong></p>`
      });
      
      return { message: 'Verifiseringskode sendt' };
    } catch (error) {
      console.error('Error sending email:', error);
      return ctx.badRequest('Kunne ikke sende verifiseringsepost');
    }
  },
  
  // Verify email change
  async verifyEmailChange(ctx) {
    const userId = ctx.state.user.id;
    const { verificationCode, newEmail } = ctx.request.body;
    
    // Get the user to check the verification code
    const userData = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: userId
    });
    
    if (userData.resetPasswordToken !== verificationCode) {
      return ctx.badRequest('Ugyldig verifiseringskode');
    }
    
    // Update the email and clear the verification code
    await strapi.documents('plugin::users-permissions.user').update({
      documentId: userId,
      data: {
        email: newEmail,
        resetPasswordToken: null
      }
    });
    
    return { message: 'E-post oppdatert' };
  },
  
  // Request account deletion
  async requestAccountDeletion(ctx) {
    const userId = ctx.state.user.id;
    
    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the verification code temporarily
    await strapi.documents('plugin::users-permissions.user').update({
      documentId: userId,
      data: {
        resetPasswordToken: verificationCode
      }
    });
    
    // Get the user's email
    const userData = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: userId
    });
    
    // Send the verification code via email
    try {
      await strapi.plugins['email'].services.email.send({
        to: userData.email,
        subject: 'Verifiseringskode for sletting av konto',
        text: `Din verifiseringskode for sletting av konto er: ${verificationCode}`,
        html: `<p>Din verifiseringskode for sletting av konto er: <strong>${verificationCode}</strong></p>`
      });
      
      return { message: 'Verifiseringskode sendt' };
    } catch (error) {
      console.error('Error sending email:', error);
      return ctx.badRequest('Kunne ikke sende verifiseringsepost');
    }
  },
  
  // Delete account
  async deleteAccount(ctx) {
    const userId = ctx.state.user.id;
    const { verificationCode, deletionReason } = ctx.request.body;
    
    // Get the user to check the verification code
    const userData = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: userId
    });
    
    if (userData.resetPasswordToken !== verificationCode) {
      return ctx.badRequest('Ugyldig verifiseringskode');
    }
    
    // Find the user profile
    const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
      filters: { users_permissions_user: userId }
    });
    
    if (userProfiles && userProfiles.length > 0) {
      // Update with deletion reason before deleting
      if (deletionReason) {
        await strapi.documents('api::user-profile.user-profile').update({
          documentId: userProfiles[0].documentId,
          data: {
            accountAdministration: {
              deletionReason,
              accountActive: false
            }
          }
        });
      }
      
      // Delete the user profile
      await strapi.documents('api::user-profile.user-profile').delete({
        documentId: userProfiles[0].documentId
      });
    }
    
    // Delete the user account
    await strapi.documents('plugin::users-permissions.user').delete({
      documentId: userId
    });
    
    return { message: 'Konto slettet' };
  }
}));