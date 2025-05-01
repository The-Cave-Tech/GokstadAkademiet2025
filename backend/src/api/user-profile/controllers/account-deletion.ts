import { factories } from '@strapi/strapi';
import { sendAccountDeletionVerification, sendAccountDeletionConfirmation } from '../../../services/mailServices/accountAdministrationMail';
import { createTokenData, storeTokenInUser, validateToken } from '../../../services/shared/tokenService';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  /**
   * Forespørsel om kontosletting
   */
  async requestAccountDeletion(ctx) {
    const userId = ctx.state.user.id;
    
    try {
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { id: userId } });
      
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
      return ctx.badRequest(`Could not send verification code: ${error.message}`);
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
      
      // Finn brukerprofil
      const userProfiles = await strapi.db.query('api::user-profile.user-profile').findMany({
        where: { users_permissions_user: userId }
      });
      
      // Lagre slettingsgrunn hvis gitt
      if (userProfiles && userProfiles.length > 0 && deletionReason) {
        const profileId = userProfiles[0].id;
        try {
          await strapi.db.query('api::user-profile.user-profile').update({
            where: { id: profileId },
            data: {
              accountAdministration: {
                deletionReason,
                accountActive: false
              }
            }
          });
        } catch (err) {
          console.error('Error updating profile before deletion:', err);
        }
      }
      
      try {
        // Send slettingsbekreftelse via e-post
        await sendAccountDeletionConfirmation(user.email, user.username);
      } catch (err) {
        console.error('Error sending deletion confirmation:', err);
      }
      
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
      return ctx.badRequest(`Could not delete account: ${error.message}`);
    }
  }
}));