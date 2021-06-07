const express = require('express');
const path = require('path');
const dateFormat = require('dateformat');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesModel = require('./models/messagesModel');
const messagesController = require('./controllers/messagesController');

app.use(express.static(path.join(__dirname, '/view')));
const PORT = process.env.PORT || 3000;

const usersObj = {};
let users = [];

const handleConnect = (nickname, socket) => {
  if (!users.includes(nickname)) {
    if (usersObj[socket.id] && usersObj[socket.id] !== nickname) {
      users = users.filter((user) => user !== usersObj[socket.id]);
    }
    users.push(nickname);
    usersObj[socket.id] = nickname;
    io.emit('nickname', { users });
  }
};

const handleMessage = async (chatMessage, nickname) => {
  const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss');
  const messageToClients = `${dateTime} ${nickname} ${chatMessage}`;
  io.emit('message', messageToClients);
  await messagesModel.createMessage(chatMessage, nickname, dateTime);
};

const handleDisconnect = (socket) => {
  const currentUser = usersObj[socket.id];
  if (currentUser) {
    users = users.filter((user) => user !== currentUser);
    delete usersObj[socket.id];
    io.emit('nickname', { users });
  }
};

io.on('connection', async (socket) => {
  console.log(`novo usuário conectado! ${socket.id}`);
  
  socket.on('initialLogin', ({ nickname }) => {
    handleConnect(nickname, socket);
  });
  socket.on('saveName', ({ nickname }) => {
    handleConnect(nickname, socket);
  });
  socket.on('disconnect', () => handleDisconnect(socket));

  socket.on('message', ({ chatMessage, nickname }) => {
    handleMessage(chatMessage, nickname);
  });
});

app.get('/messages', messagesController.getAllMessages);

http.listen(PORT, () => {
  console.log('App listening on PORT', PORT);
});