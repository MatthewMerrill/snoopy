// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const { accountSid, authToken, fromNumber, toNumbers } = require('../config.js').sms || {}; 
const client = require('twilio')(accountSid, authToken);

module.exports = function(body) {
  body = body || 'WUPHF! Snoopy has snooped on a website change.';
  for (let number of toNumbers) {
    client.messages
      .create({
        body,
        from: fromNumber,
        to: number,
      })
      .then(message => console.log('        Message sent to', number, ':', message.sid));
  }
}

