import { factories } from '@strapi/strapi';
import { sendUsernameChangeVerification, sendEmailChangeVerification } from '../../../services/mailServices/credentialsMail';
import { 
  createTokenData, 
  storeTokenInUser, 
  validateToken, 
  clearToken,
  resendVerificationCode // Add this import
} from '../../../services/shared/tokenService';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  // Handle username change
  async changeUsername(ctx) {
    const userId = ctx.state.user.id;
    const { username, verificationCode } = ctx.request.body;

    if (!username || !verificationCode) {
      return ctx.badRequest('Username and verification code are required');
    }

    try {
      // Valider token
      const validation = await validateToken(userId, verificationCode, 'username');
      if (!validation.valid) {
        return ctx.badRequest(validation.error);
      }

      // Sjekk om brukernavn er opptatt
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { username, id: { $ne: userId } }
      });

      if (existingUser) {
        return ctx.badRequest('Username already in use');
      }

      // Oppdater brukernavn og nullstill token
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { 
          username,
          resetPasswordToken: null 
        }
      });

      return { 
        success: true, 
        message: 'Username updated successfully',
        username
      };
    } catch (error) {
      console.error('Error changing username:', error);
      return ctx.badRequest(`Could not update username: ${error.message}`);
    }
  },

  // Request username change verification
  async requestUsernameChange(ctx) {
    const userId = ctx.state.user.id;
    const { username, password } = ctx.request.body;

    if (!username) {
      return ctx.badRequest('Username is required');
    }
    
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
      
      // Sjekk om brukernavn er opptatt
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { username, id: { $ne: userId } }
      });

      if (existingUser) {
        return ctx.badRequest('Username already in use');
      }

      // Generer verifiseringskode og send e-post
      const verificationCode = await sendUsernameChangeVerification(user.email, user.username, undefined);
      
      // Lag token-data og lagre
      const tokenData = createTokenData(verificationCode, 'username');
      await storeTokenInUser(userId, tokenData);

      return { success: true, message: 'Verification code sent to your email' };
    } catch (error) {
      console.error('Error requesting username change:', error);
      return ctx.badRequest(`Could not send verification code: ${error.message}`);
    }
  },

  // Request email change verification
  async requestEmailChange(ctx) {
    const userId = ctx.state.user.id;
    const { newEmail, password } = ctx.request.body;

    if (!newEmail) {
      return ctx.badRequest('New email is required');
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
      
      // Sjekk om e-post er opptatt
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: newEmail, id: { $ne: userId } }
      });

      if (existingUser) {
        return ctx.badRequest('Email address already in use');
      }

      // Generer og send verifiseringskode
      const verificationCode = await sendEmailChangeVerification(newEmail, user.username, undefined);
      
      // Lag token-data med ny e-post
      const tokenData = createTokenData(verificationCode, 'email', { newEmail });
      await storeTokenInUser(userId, tokenData);

      return { success: true, message: 'Verification code sent to your new email' };
    } catch (error) {
      console.error('Error requesting email change:', error);
      return ctx.badRequest(`Could not send verification code: ${error.message}`);
    }
  },

  // Verify email change
  async verifyEmailChange(ctx) {
    const userId = ctx.state.user.id;
    const { verificationCode } = ctx.request.body;

    if (!verificationCode) {
      return ctx.badRequest('Verification code is required');
    }

    try {
      // Valider token
      const validation = await validateToken(userId, verificationCode, 'email');
      if (!validation.valid) {
        return ctx.badRequest(validation.error);
      }

      const newEmail = validation.tokenData.newEmail;
      if (!newEmail) {
        return ctx.badRequest('Email change information not found');
      }

      // Oppdater e-post og nullstill token
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: {
          email: newEmail,
          resetPasswordToken: null
        }
      });

      return { 
        success: true, 
        message: 'Email updated successfully', 
        email: newEmail 
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      return ctx.badRequest(`Could not verify email: ${error.message}`);
    }
  },

  // Change password
  async changePassword(ctx) {
    const userId = ctx.state.user.id;
    const { currentPassword, newPassword, passwordConfirmation } = ctx.request.body;
  
    if (!currentPassword || !newPassword || !passwordConfirmation) {
      return ctx.badRequest('All password fields are required');
    }
  
    if (newPassword !== passwordConfirmation) {
      return ctx.badRequest('New password and confirmation do not match');
    }
  
    try {
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({ 
        where: { id: userId } 
      });
      
      const validPassword = await strapi.plugin('users-permissions').service('user').validatePassword(
        currentPassword,
        user.password
      );
      
      if (!validPassword) {
        return ctx.badRequest('Current password is incorrect');
      }
      
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: { password: newPassword }
      });
  
      return { 
        success: true, 
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return ctx.badRequest(`Could not update password: ${error.message}`);
    }
  },

  /**
   * Send verifiseringskode på nytt for endring av brukernavn
   */
  async resendUsernameVerification(ctx) {
    const userId = ctx.state.user.id;
    
    try {
      const result = await resendVerificationCode(userId, 'username');
      
      if (!result.success) {
        return ctx.badRequest(result.message);
      }
      
      return { 
        success: true, 
        message: 'Verifiseringskode sendt på nytt til din e-post' 
      };
    } catch (error) {
      console.error('Error resending username verification:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Could not resend verification code";
      return ctx.badRequest(`Could not resend verification code: ${errorMessage}`);
    }
  },

  /**
   * Send verifiseringskode på nytt for endring av e-post
   */
  async resendEmailVerification(ctx) {
    const userId = ctx.state.user.id;
    
    try {
      const result = await resendVerificationCode(userId, 'email');
      
      if (!result.success) {
        return ctx.badRequest(result.message);
      }
      
      return { 
        success: true, 
        message: 'Verifiseringskode sendt på nytt til din nye e-post' 
      };
    } catch (error) {
      console.error('Error resending email verification:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Could not resend verification code";
      return ctx.badRequest(`Could not resend verification code: ${errorMessage}`);
    }
  }
}));