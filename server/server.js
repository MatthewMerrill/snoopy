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

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
  responses: [],
}).write();

db.read()

const app = express();
// http://demo.mattmerr.com/memes

app.use(express.json());
app.use(express.static('app'));

app.get('/hello', (req, res) => {
  res.send('memes');
});

app.get('/api/responses', (req, res) => {
  res.json(db.get('responses').value());
})

require('./requester')(db)

app.listen(3000);
