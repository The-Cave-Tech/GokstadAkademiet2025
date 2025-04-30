export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "15m",
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
        defaultFrom: 'maad1006@gmail.com',
        defaultReplyTo: 'maad1006@gmail.com',
      },
    },
  },
});