// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const config = require('../config.js'); 

const wuphfSMS = require('./wuphf-sms.js');
const wuphfDiscord = require('./wuphf-discord.js');

const process = require('process');

const notifiers = [];

function registerIf(enable, notifier) {
  if (enable === undefined || enable === true) {
    notifiers.push(notifier);
  }
}

registerIf(config.enableSMS, wuphfSMS);
registerIf(config.enableDiscord, wuphfDiscord);

module.exports = function(body) {
  body = body || 'WUPHF! Snoopy has snooped on a website change.';
  for (const notifier of notifiers) {
    notifier(body);
  }
}

if (process.env['SEND_EXAMPLE_PING'] === 'YES') {
  module.exports('THIS IS A TEST OF THE WUPHF NOTIFIER');
}


