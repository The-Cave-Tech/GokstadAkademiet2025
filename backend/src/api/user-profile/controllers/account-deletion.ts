// backend/src/api/user-profile/controllers/account-deletion.ts

import { factories } from '@strapi/strapi';
import { 
  sendAccountDeletionVerification, 
  sendAccountDeletionConfirmation, 
  sendDeletionFeedback 
} from '../../../services/mailServices/accountAdministrationMail';
import { 
  createTokenData, 
  storeTokenInUser, 
  validateToken,
  resendVerificationCode // Add this import
} from '../../../services/shared/tokenService';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  //KontoSletting
  async requestAccountDeletion(ctx) {
    const userId = ctx.state.user.id;
    const { password } = ctx.request.body;
    
    if (!password) {
      return ctx.badRequest('Password is required');
    }
    
    try {
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({ 
        where: { id: userId } 
      });
      
      // Validate the user's password
      const validPassword = await strapi.plugin('users-permissions').service('user').validatePassword(
        password,
        user.password
      );
      
      if (!validPassword) {
        return ctx.badRequest('Invalid password');
      }
      
      // Generer verifiseringskode og send e-post
      const verificationCode = await sendAccountDeletionVerification(user.email, user.username);
      
      // Opprett og lagre token
      const tokenData = createTokenData(verificationCode, 'account-deletion');
      await storeTokenInUser(userId, tokenData);
      
      return { 
        success: true, 
        message: 'Verifiseringskode sendt til din e-post' 
      };
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Could not send verification code";
      return ctx.badRequest(`Could not send verification code: ${errorMessage}`);
    }
  },
  
  /**
   * Verifiserer kode og sletter konto
   */
  async verifyAndDeleteAccount(ctx) {
    const userId = ctx.state.user.id;
    const { verificationCode, deletionReason } = ctx.request.body;
    
    if (!verificationCode) {
      return ctx.badRequest('Verification code is required');
    }
    
    try {
      // Finn bruker
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { id: userId } });
      
      // Valider token
      const validation = await validateToken(userId, verificationCode, 'account-deletion');
      if (!validation.valid) {
        return ctx.badRequest(validation.error);
      }
      
      // Hvis brukeren har oppgitt en slettingsgrunn, send den på e-post til adminstratorene
      if (deletionReason) {
        try {
          await sendDeletionFeedback(user.email, user.username, deletionReason);
        } catch (err) {
          console.error('Error sending deletion feedback:', err);
          // Vi fortsetter slettingsprosessen selv om sending av tilbakemelding feiler
        }
      }
      
      try {
        // Send slettingsbekreftelse via e-post
        await sendAccountDeletionConfirmation(user.email, user.username);
      } catch (err) {
        console.error('Error sending deletion confirmation:', err);
      }
      
      // Finn brukerprofil
      const userProfiles = await strapi.db.query('api::user-profile.user-profile').findMany({
        where: { users_permissions_user: userId }
      });
      
      // Slett brukerprofil først
      if (userProfiles && userProfiles.length > 0) {
        const profileId = userProfiles[0].id;
        try {
          await strapi.db.query('api::user-profile.user-profile').delete({
            where: { id: profileId }
          });
          console.log(`User profile ${profileId} deleted successfully`);
        } catch (err) {
          console.error(`Error deleting user profile ${profileId}:`, err);
        }
      }
      
      // Slett brukerkonto
      await strapi.db.query('plugin::users-permissions.user').delete({
        where: { id: userId }
      });
      console.log(`User ${userId} deleted successfully`);
      
      return { 
        success: true, 
        message: 'Konto slettet' 
      };
    } catch (error) {
      console.error('Error deleting account:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Could not delete account";
      return ctx.badRequest(`Could not delete account: ${errorMessage}`);
    }
  },

  /**
   * Send verifiseringskode på nytt for sletting av konto
   */
  async resendDeletionVerification(ctx) {
    const userId = ctx.state.user.id;
    
    try {
      const result = await resendVerificationCode(userId, 'account-deletion');
      
      if (!result.success) {
        return ctx.badRequest(result.message);
      }
      
      return { 
        success: true, 
        message: 'Verifiseringskode sendt på nytt til din e-post' 
      };
    } catch (error) {
      console.error('Error resending deletion verification:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Could not resend verification code";
      return ctx.badRequest(`Could not resend verification code: ${errorMessage}`);
    }
  }
}));