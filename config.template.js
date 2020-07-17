module.exports = {

  urlBase: 'https://example.example',

  sites: [
    'example.example',
  ],

  enableSMS: false,
  sms: {
    accountSid: '',
    authToken: '',
    fromNumber: '+1XXXXXXXXXX',
    toNumbers: [
      '+1XXXXXXXXXX',
    ],
  },

  enableDiscord: false,
  discord: {
    clientId: '',
    clientSecret: '',
    token: '',
  },
};
