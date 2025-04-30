import { factories } from '@strapi/strapi';
import { generateVerificationCode, sendVerificationEmail } from '../../../services/email';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  // Handle username change
  async changeUsername(ctx) {
    const userId = ctx.state.user.id;
    const { username, verificationCode } = ctx.request.body;

    if (!username || !verificationCode) {
      return ctx.badRequest('Username and verification code are required');
    }

    try {
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
      
      if (!user.resetPasswordToken) {
        return ctx.badRequest('Invalid verification code - no token found');
      }

      // Parse token data with error handling
      let tokenData;
      try {
        tokenData = JSON.parse(user.resetPasswordToken);
      } catch (e) {
        console.error('Error parsing token data:', e);
        return ctx.badRequest('Invalid token format');
      }

      // Validate verification code and action type
      if (tokenData.code !== verificationCode || tokenData.action !== 'username') {
        console.log('Token validation failed:', { 
          expected: tokenData.code,
          received: verificationCode,
          action: tokenData.action
        });
        return ctx.badRequest('Invalid verification code');
      }

      // Check if token has expired
      if (tokenData.expiresAt && new Date() > new Date(tokenData.expiresAt)) {
        return ctx.badRequest('Verification code has expired');
      }

      // Check if username is already taken
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { username, id: { $ne: userId } }
      });

      if (existingUser) {
        return ctx.badRequest('Username already in use');
      }

      // Update username and clear token
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
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
    const { username } = ctx.request.body;

    if (!username) {
      return ctx.badRequest('Username is required');
    }

    try {
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
      
      // Check if username is already taken
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { username, id: { $ne: userId } }
      });

      if (existingUser) {
        return ctx.badRequest('Username already in use');
      }

      // Generate verification code
      const verificationCode = generateVerificationCode();
      
      // Create token data with 15 minutes expiration
      const tokenData = {
        code: verificationCode,
        action: 'username',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        requestedAt: new Date().toISOString()
      };
      
      // Log token for debugging
      console.log('Creating username change token:', {
        userId,
        code: verificationCode,
        expiresAt: tokenData.expiresAt
      });
      
      // Store token in user record
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: {
          resetPasswordToken: JSON.stringify(tokenData)
        }
      });

      // Send verification email
      await sendVerificationEmail({
        to: user.email,
        subject: 'Verifiser endring av brukernavn',
        username: user.username,
        verificationCode,
        action: 'endring av brukernavn'
      });

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
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
      
      // Verify password if provided
      if (password) {
        const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
          password,
          user.password
        );
        
        if (!validPassword) {
          return ctx.badRequest('Invalid password');
        }
      }
      
      // Check if email is already in use
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: newEmail, id: { $ne: userId } }
      });

      if (existingUser) {
        return ctx.badRequest('Email address already in use');
      }

      // Generate verification code
      const verificationCode = generateVerificationCode();
      
      // Create token data with 15 minutes expiration
      const tokenData = {
        code: verificationCode,
        newEmail,
        action: 'email',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        requestedAt: new Date().toISOString()
      };
      
      // Log token for debugging
      console.log('Creating email change token:', {
        userId,
        newEmail,
        code: verificationCode,
        expiresAt: tokenData.expiresAt
      });
      
      // Store token in user record
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: {
          resetPasswordToken: JSON.stringify(tokenData)
        }
      });

      // Send verification email to the NEW email address
      await sendVerificationEmail({
        to: newEmail,
        subject: 'Verifiser endring av e-post',
        username: user.username,
        verificationCode,
        action: 'endring av e-post'
      });

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
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);

      if (!user.resetPasswordToken) {
        return ctx.badRequest('Invalid verification code - no token found');
      }

      // Parse token data with error handling
      let tokenData;
      try {
        tokenData = JSON.parse(user.resetPasswordToken);
      } catch (e) {
        console.error('Error parsing token data:', e);
        return ctx.badRequest('Invalid token format');
      }

      // Validate verification code and action type
      if (tokenData.code !== verificationCode || tokenData.action !== 'email') {
        console.log('Token validation failed:', { 
          expected: tokenData.code,
          received: verificationCode,
          action: tokenData.action
        });
        return ctx.badRequest('Invalid verification code');
      }

      // Check if token has expired
      if (tokenData.expiresAt && new Date() > new Date(tokenData.expiresAt)) {
        return ctx.badRequest('Verification code has expired');
      }

      if (!tokenData.newEmail) {
        return ctx.badRequest('Email change information not found');
      }

      // Update email and clear token
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: {
          email: tokenData.newEmail,
          resetPasswordToken: null
        }
      });

      return { 
        success: true, 
        message: 'Email updated successfully', 
        email: tokenData.newEmail 
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      return ctx.badRequest(`Could not verify email: ${error.message}`);
    }
  },

  // Legg til denne nye metoden for passordendring
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
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
      
      // Verifiser nåværende passord
      const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
        currentPassword,
        user.password
      );
      
      if (!validPassword) {
        return ctx.badRequest('Current password is incorrect');
      }
      
      // Sjekk passordkrav (minst 8 tegn)
      if (newPassword.length < 8) {
        return ctx.badRequest('New password must be at least 8 characters long');
      }
      
      // Oppdater passord (Strapi håndterer hashing automatisk)
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: { 
          password: newPassword
        }
      });

      return { 
        success: true, 
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return ctx.badRequest(`Could not update password: ${error.message}`);
    }
  }
}));