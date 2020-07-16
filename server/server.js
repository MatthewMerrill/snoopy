console.log(`
███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

`);

const path = require('path');
const express = require('express');

const { sites } = require('../config.js'); 
const gitstore = require('./gitstore.js');

const app = express();
// http://demo.mattmerr.com/memes

app.use(express.json());
app.use(express.static('app'));

app.get('/api/sites', async (req, res) => {
  res.send(sites);
});

app.get('/api/snapshots/:site', async (req, res) => {
  res.json(await gitstore.snapshots(req.params.site));
})

app.get('/api/diff/:site/:base/:head', async (req, res) => {
  let regex = /^([a-fA-F0-9]+|HEAD(~[0-9]+)?)$/;
  if (regex.test(req.params.base) && regex.test(req.params.head)) {
    res.send(await gitstore.diff(req.params.site, req.params.base, req.params.head));
  }
  else {
    res.send('No way, Jose!');
  }
})

for (site of sites) {
  gitstore.init(site);
  require('./requester')(site)
}

app.listen(process.env.PORT || 3000);
