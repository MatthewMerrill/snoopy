console.log(`
███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

`);

const app = require('./app.js');
const express = require('express');
const path = require('path');

const { sites } = require('../config.js'); 
const gitstore = require('./gitstore.js');

app.use('/api', express.json());
app.use(express.static('app'));
app.use(express.static(path.join(__dirname, '../node_modules/preact/dist')))
app.use(express.static(path.join(__dirname, '../node_modules/htm/dist')))

function isValidSite(site) {
  return sites.indexOf(site) > -1;
}

app.get('/api/sites', async (req, res) => {
  res.send(sites);
});

app.get('/api/snapshots/:site', async (req, res) => {
  if (!isValidSite(req.params.site)) {
    res.sendStatus(400);
    return;
  }
  res.json(await gitstore.snapshots(req.params.site));
})

app.get('/api/diff/:site/:base/:head', async (req, res) => {
  if (!isValidSite(req.params.site)) {
    res.sendStatus(400);
    return;
  }
  let regex = /^([a-fA-F0-9]+|HEAD(~[0-9]+)?)$/;
  if (regex.test(req.params.base) && regex.test(req.params.head)) {
    res.send(await gitstore.diff(req.params.site, req.params.base, req.params.head));
  }
  else {
    res.send('No way, Jose!');
  }
})

if (!process.env.APP_ONLY) {
  for (site of sites) {
    gitstore.init(site);
    require('./requester')(site)
  }
}

const port = process.env.PORT || 3000
app.listen(port);
console.log('[server] Now listening on port', port);
