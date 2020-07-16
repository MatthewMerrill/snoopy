// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const Discord = require('discord.js');
const client = new Discord.Client();

const { token } = require('../config.js').discord || {}; 

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

function broadcast(body) {
  for (let channelId of channels.value()) {
    client.channels.fetch(channelId).then(ch => ch.send(body));
  }
}
let backlog = [];

module.exports = function(body) {
  if (backlog === null) {
    broadcast(body);
  }
  else {
    backlog.push(body);
  }
}

let channels = db.defaults({ discord: { channels: [], }, })
  .get('discord')
  .get('channels');

channels.write();

client.on('ready', () => {
  console.log(`Logged into Discord as ${client.user.tag}!`);
  for (let body of backlog) {
    broadcast(body);
  }
  backlog = null;
});

client.on('message', msg => {
  if (msg.content === '!snoopy notify enable') {
    db.get('discord').get('channels').push(msg.channel.id).write();
    msg.reply("ACK! I'll notify you here.");
    console.log(`Received request for enabling in in ${msg.channel.id}`); 
  }
  if (msg.content === '!snoopy notify disable') {
    db.get('discord').get('channels').pull(msg.channel.id).write();
    msg.reply("ACK! I'll shut up.");
    console.log(`Received request for disabling in ${msg.channel.id}`);
  }
});

client.login(token);
