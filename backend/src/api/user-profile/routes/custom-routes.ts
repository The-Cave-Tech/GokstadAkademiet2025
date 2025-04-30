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
    }
  ]
};