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

const gitstore = require('./gitstore.js');
gitstore.init();

const app = express();
// http://demo.mattmerr.com/memes

app.use(express.json());
app.use(express.static('app'));

app.get('/hello', (req, res) => {
  res.send('memes');
});

app.get('/api/snapshots', async (req, res) => {
  res.json(await gitstore.snapshots());
})

app.get('/api/diff/:base/:head', async (req, res) => {
  let regex = /^[a-fA-F0-9]+$/;
  if (regex.test(req.params.base) && regex.test(req.params.head)) {
    res.send(await gitstore.diff(req.params.base, req.params.head));
  }
  else {
    res.send('No way, Jose!');
  }
})

require('./requester')()

app.listen(process.env.PORT || 3000);
