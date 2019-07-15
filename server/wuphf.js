// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const { accountSid, authToken, fromNumber, toNumbers } = require('../config.js'); 
const client = require('twilio')(accountSid, authToken);

module.exports = function() {
  for (let number of toNumbers) {
    client.messages
      .create({
        body: `WUPHF! Snoopy has snooped on a website change.`,
        from: fromNumber,
        to: number,
      })
      .then(message => console.log('        Message sent to', number, ':', message.sid));
  }
}
