// ███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
// ╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
// ███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
// ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

const { accountSid, authToken, fromNumber, toNumbers } = require('../config.js').sms || {}; 
const registry = require('./wuphf-registry.js');

const twilio = require('twilio');
const client = twilio(accountSid, authToken);
const MessagingResponse = twilio.twiml.MessagingResponse;

// Send SMS
module.exports = function(body, target) {
  client.messages
    .create({
      body,
      from: fromNumber,
      to: target,
    })
    .then(message => console.log('[wuphf-sms] Message sent to', number, ':', message.sid));
}

// Receive SMS
const app = require('./app.js');
const express = require('express');

function handleMessage(body, target) {
  if (body === 'STOP') {
    registry.disable('sms', target, '*');
    return 'You will no longer receive messages from this service.';
  }

  let enableMatch = body.match(/^enable (\*|[.a-zA-Z0-9]+)$/i);
  if (enableMatch) {
    let site = enableMatch[1].toLowerCase();
    if (!registry.isValidSite(site)) {
      return "NACK! Invalid Site :(";
    }
    registry.enable('sms', target, site);
    return "ACK! I'll notify you here.";
  }

  let disableMatch = body.match(/^disable (\*|[.a-zA-Z0-9]+)$/i);
  if (disableMatch) {
    let site = disableMatch[1].toLowerCase();
    if (!registry.isValidSite(site)) {
      return "NACK! Invalid Site :(";
    }
    registry.disable('sms', target, site);
    return "ACK! I'll shut up.";
  }
}

app.use('/_sms', express.urlencoded({ extended: false }));
app.post('/_sms', twilio.webhook(authToken), (req, res) => {
  const twiml = new MessagingResponse();

  let response = handleMessage(req.body.Body, req.body.From);
  if (response) {
    twiml.message(response);
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});
