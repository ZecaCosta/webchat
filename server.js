const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }});

app.use(express.static(__dirname + '/public'));

require('./sockets/server-io')(io);

const PORT = 3000;

http.listen(PORT, () => {
  console.log('App listening on PORT', PORT)
});