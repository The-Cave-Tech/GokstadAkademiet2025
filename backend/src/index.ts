export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Subscribe to user creation events
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      
      // Create profile when a new user is created
      async afterCreate(event) {
        const { result } = event;
        console.log('User created in bootstrap, creating profile...', result.id);
        
        try {
          // Check if user already has a profile
          const existingProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
            filters: { users_permissions_user: result.id }
          });
          
          if (existingProfiles && existingProfiles.length > 0) {
            console.log('Profile already exists for user', result.id);
            return;
          }
          
          // Create a user profile for the new user
          await strapi.documents('api::user-profile.user-profile').create({
            data: {
              users_permissions_user: result.id,
              publicProfile: {
                displayName: result.username || '',
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
            }
          });
          
          console.log('Profile created for user', result.id);
        } catch (err) {
          console.error('Error creating user profile:', err);
        }
      },
      
      // Update lastLoginDate when user logs in
      async afterUpdate(event) {
        // Check if this is a login (by checking if lastLoginDate was updated)
        if (event.params && event.params.data && event.params.data.lastLoginDate) {
          const userId = event.result.id;
          
          // Find the user profile
          const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
            filters: { users_permissions_user: userId }
          });
          
          if (userProfiles && userProfiles.length > 0) {
            // Update lastLoginDate in the profile
            await strapi.documents('api::user-profile.user-profile').update({
              documentId: userProfiles[0].documentId,
              data: {
                accountAdministration: {
                  lastLoginDate: new Date()
                }
              }
            });
          }
        }
      },
      
      // Delete profile when user is deleted
      async beforeDelete(event) {
        const userId = event.params.where.id;
        
        try {
          // Find the user profile
          const userProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
            filters: { users_permissions_user: userId }
          });
          
          // Delete the profile if it exists
          if (userProfiles && userProfiles.length > 0) {
            console.log('Deleting profile for user', userId);
            await strapi.documents('api::user-profile.user-profile').delete({
              documentId: userProfiles[0].documentId
            });
          }
        } catch (err) {
          console.error('Error deleting user profile:', err);
        }
      }
    });
    
    // Create profiles for existing users who don't have one
    try {
      // Get all users
      const users = await strapi.documents('plugin::users-permissions.user').findMany({});
      
      for (const user of users) {
        // Check if user has a profile
        const existingProfiles = await strapi.documents('api::user-profile.user-profile').findMany({
          filters: { users_permissions_user: user.id }
        });
        
        if (!existingProfiles || existingProfiles.length === 0) {
          console.log('Creating profile for existing user', user.id);
          
          // Create a profile for the user
          await strapi.documents('api::user-profile.user-profile').create({
            data: {
              users_permissions_user: user.id,
              publicProfile: {
                displayName: user.username || '',
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
            }
          });
        }
      }
    } catch (err) {
      console.error('Error creating profiles for existing users:', err);
    }
  },
  
  /**
   * An asynchronous destroy function that runs before
   * your application gets shut down.
   */
  async destroy({ strapi }) {
    // Clean up resources or perform final tasks before shutdown
  }
};