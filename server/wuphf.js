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
  console.log('[wuphf] Enabled SMS!');
  mediums['sms'] = require('./wuphf-sms.js');

if (config.enableDiscord)
  console.log('[wuphf] Enabled Discord!');
  mediums['discord'] = require('./wuphf-discord.js');

module.exports = function(body, site) {
  console.log(`[wuphf:${site}] Notifying!`);
  let subscriptions = registry.poll(site);
  for (let { medium, target } of subscriptions) { 
    console.log(`[wuphf:${site}] Notifying`, medium, target);
    mediums[medium](body, target);
  }
}

const process = require('process');
if (process.env['SEND_EXAMPLE_PING'] === 'YES') {
  console.log('Sending example...');
  module.exports('THIS IS A TEST OF THE WUPHF NOTIFIER', 'mattmerr.com');
}


