// backend/src/api/user-profile/routes/custom-routes.ts 
export default {
  routes: [
    // User Profile Routes
    {
      method: 'GET',
      path: '/user-profiles/me',
      handler: 'user-profile.me',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/user-profiles/me/public-profile',
      handler: 'user-profile.updatePublicProfile',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/user-profiles/me/personal-information',
      handler: 'user-profile.updatePersonalInformation',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/user-profiles/me/notification-settings',
      handler: 'user-profile.updateNotificationSettings',
      config: { policies: [] }
    },
    
    // Credential Routes
    {
      method: 'POST',
      path: '/user-credentials/request-username-change',
      handler: 'credentials.requestUsernameChange',
      config: { policies: [], middlewares: [] }
    },
    {
      method: 'POST',
      path: '/user-credentials/change-username',
      handler: 'credentials.changeUsername',
      config: { policies: [], middlewares: [] }
    },
    {
      method: 'POST',
      path: '/user-credentials/request-email-change',
      handler: 'credentials.requestEmailChange',
      config: { policies: [], middlewares: [] }
    },
    {
      method: 'POST',
      path: '/user-credentials/verify-email-change',
      handler: 'credentials.verifyEmailChange',
      config: { policies: [], middlewares: [] }
    },
    {
      method: 'POST',
      path: '/user-credentials/change-password',
      handler: 'credentials.changePassword',
      config: { policies: [], middlewares: [] }
    },
    
    // NEW ROUTES for resending verification codes
    {
      method: 'POST',
      path: '/user-credentials/resend-username-verification',
      handler: 'credentials.resendUsernameVerification',
      config: { policies: [], middlewares: [] }
    },
    {
      method: 'POST',
      path: '/user-credentials/resend-email-verification',
      handler: 'credentials.resendEmailVerification',
      config: { policies: [], middlewares: [] }
    },
    
    // Account Deletion Routes
    {
      method: 'POST',
      path: '/user-profiles/request-account-deletion',
      handler: 'account-deletion.requestAccountDeletion',
      config: { policies: [], middlewares: [] }
    },
    {
      method: 'POST',
      path: '/user-profiles/delete-account',
      handler: 'account-deletion.verifyAndDeleteAccount',
      config: { policies: [],middlewares: [] }
    },
    
    // NEW ROUTE for resending account deletion verification
    {
      method: 'POST',
      path: '/user-profiles/resend-deletion-verification',
      handler: 'account-deletion.resendDeletionVerification',
      config: { policies: [],middlewares: [] }
    }
  ]
};