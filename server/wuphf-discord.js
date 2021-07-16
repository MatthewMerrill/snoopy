// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const Discord = require('discord.js');
const client = new Discord.Client();

const { token } = require('../config.js').discord || {}; 
const registry = require('./wuphf-registry.js');

function sendMessage(body, channelId) {
  client.channels.fetch(channelId).then(ch => ch.send(body));
}
let backlog = [];

module.exports = function(body, target) {
  if (backlog === null) {
    sendMessage(body, target);
  }
  else {
    backlog.push([body, target]);
  }
}

client.on('ready', () => {
  console.log(`[wuphf-discord] Logged into Discord as ${client.user.tag}!`);
  for (let [body, channelId] of backlog) {
    sendMessage(body, channelId);
  }
  backlog = null;
});

client.on('message', msg => {
  if (msg.content === "I'll miss you, snoopy.") {
    msg.reply("I'll miss you too. :(");
    return;
  }
  let enableMatch = msg.content.match(/^!snoopy enable (\*|[.a-zA-Z0-9]+)$/i);
  if (enableMatch) {
    let site = enableMatch[1].toLowerCase();
    if (!registry.isValidSite(site)) {
      msg.reply("NACK! Invalid Site :(");
      return;
    }
    registry.enable('discord', msg.channel.id, site);
    msg.reply("ACK! I'll notify you here.");
    return;
  }

  let disableMatch = msg.content.match(/^!snoopy disable (\*|[.a-zA-Z0-9]+)$/i);
  if (disableMatch) {
    let site = disableMatch[1].toLowerCase();
    if (!registry.isValidSite(site)) {
      msg.reply("NACK! Invalid Site :(");
      return;
    }
    registry.disable('discord', msg.channel.id, site);
    msg.reply("ACK! I'll shut up.");
    return;
  }
});

client.login(token);
