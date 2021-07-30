const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesController = require('./controllers/messagesController');

app.use(express.static(path.join(__dirname, '/view')));
const PORT = process.env.PORT || 3000;
require('./services/socketService')(io);

app.get('/messages', messagesController.getAllMessages);

http.listen(PORT, () => {
  console.log('App listening on PORT', PORT);
});