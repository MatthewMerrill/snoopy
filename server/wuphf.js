// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const config = require('../config.js'); 
const registry = require('./wuphf-registry.js');

const mediums = {};

if (config.enableSMS)
  mediums['sms'] = require('./wuphf-sms.js');

if (config.enableDiscord)
  mediums['discord'] = require('./wuphf-discord.js');

module.exports = function(body, site) {
  let subscriptions = registry.poll(site);
  for (let { medium, target } of subscriptions) {
    mediums[medium](body, target);
  }
}

const process = require('process');
if (process.env['SEND_EXAMPLE_PING'] === 'YES') {
  module.exports('THIS IS A TEST OF THE WUPHF NOTIFIER');
}


