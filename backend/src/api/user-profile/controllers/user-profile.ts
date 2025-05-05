// backend/src/api/user-profile/controllers/user-profile.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-profile.user-profile', ({ strapi }) => ({
  // Get the current user's profile
  async me(ctx) {
    const userId = ctx.state.user.id;
    
    try {
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
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return ctx.badRequest(`Could not retrieve user profile: ${error.message}`);
    }
  },
  
  // Update public profile
  async updatePublicProfile(ctx) {
    const userId = ctx.state.user.id;
    const { data } = ctx.request.body;
    
    if (!data) {
      return ctx.badRequest('Profile data is required');
    }
    
    try {
      // Find the user profile associated with the current user
      const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
        filters: { users_permissions_user: userId }
      });
      
      if (!userProfiles || userProfiles.length === 0) {
        return ctx.notFound('User profile not found');
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
    } catch (error) {
      console.error('Error updating public profile:', error);
      return ctx.badRequest(`Could not update public profile: ${error.message}`);
    }
  },
  
  // Update personal information
  async updatePersonalInformation(ctx) {
    const userId = ctx.state.user.id;
    const { data } = ctx.request.body;
    
    if (!data) {
      return ctx.badRequest('Personal information data is required');
    }
    
    try {
      // Find the user profile associated with the current user
      const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
        filters: { users_permissions_user: userId }
      });
      
      if (!userProfiles || userProfiles.length === 0) {
        return ctx.notFound('User profile not found');
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
    } catch (error) {
      console.error('Error updating personal information:', error);
      return ctx.badRequest(`Could not update personal information: ${error.message}`);
    }
  },
  
  // Update notification settings
  async updateNotificationSettings(ctx) {
    const userId = ctx.state.user.id;
    const { data } = ctx.request.body;
    
    if (!data) {
      return ctx.badRequest('Notification settings data is required');
    }
    
    try {
      // Find the user profile associated with the current user
      const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
        filters: { users_permissions_user: userId }
      });
      
      if (!userProfiles || userProfiles.length === 0) {
        return ctx.notFound('User profile not found');
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
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return ctx.badRequest(`Could not update notification settings: ${error.message}`);
    }
  }
}));