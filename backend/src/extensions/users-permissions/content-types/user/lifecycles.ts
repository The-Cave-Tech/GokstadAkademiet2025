export default {
    async afterCreate(event) {
      const { result } = event;
      console.log('User created, creating profile...', event.result.id);
      try {
        // Create a user profile for the newly registered user
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
      } catch (err) {
        console.error('Error creating user profile:', err);
      }
    }
  };