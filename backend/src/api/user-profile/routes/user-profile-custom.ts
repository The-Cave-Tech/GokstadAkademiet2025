// src/api/user-profile/routes/user-profile-custom.ts

export default {
    routes: [
      // Get current user's profile
      {
        method: 'GET',
        path: '/user-profiles/me',
        handler: 'user-profile.me',
        config: {
          policies: []
        }
      },
      // Update public profile
      {
        method: 'PUT',
        path: '/user-profiles/me/public-profile',
        handler: 'user-profile.updatePublicProfile',
        config: {
          policies: []
        }
      },
      // Update personal information
      {
        method: 'PUT',
        path: '/user-profiles/me/personal-information',
        handler: 'user-profile.updatePersonalInformation',
        config: {
          policies: []
        }
      },
      // Update notification settings
      {
        method: 'PUT',
        path: '/user-profiles/me/notification-settings',
        handler: 'user-profile.updateNotificationSettings',
        config: {
          policies: []
        }
      },
      // Request email verification
      {
        method: 'POST',
        path: '/user-profiles/me/request-email-verification',
        handler: 'user-profile.requestEmailVerification',
        config: {
          policies: []
        }
      },
      // Verify email change
      {
        method: 'POST',
        path: '/user-profiles/me/verify-email-change',
        handler: 'user-profile.verifyEmailChange',
        config: {
          policies: []
        }
      },
      // Request account deletion
      {
        method: 'POST',
        path: '/user-profiles/me/request-account-deletion',
        handler: 'user-profile.requestAccountDeletion',
        config: {
          policies: []
        }
      },
      // Delete account
      {
        method: 'POST',
        path: '/user-profiles/me/delete-account',
        handler: 'user-profile.deleteAccount',
        config: {
          policies: []
        }
      }
    ]
  };