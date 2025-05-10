export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwt: {
       /*  expiresIn: "7h", */
        expiresIn: "6m",
      },
    },
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('DEFAULT_FROM_EMAIL'),
        defaultReplyTo: env('DEFAULT_REPLY_TO_EMAIL'),
      },
    },
  },
});