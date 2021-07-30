const dateFormat = require('dateformat');
const messagesModel = require('../models/messagesModel');

const usersObj = {};
let users = [];

const handleConnect = (nickname, socket, io) => {
  if (!users.includes(nickname)) {
    if (usersObj[socket.id] && usersObj[socket.id] !== nickname) {
      users = users.filter((user) => user !== usersObj[socket.id]);
    }
    users.push(nickname);
    usersObj[socket.id] = nickname;
    io.emit('nickname', { users });
  }
};

const handleMessage = async (chatMessage, nickname, io) => {
  const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss');
  const messageToClients = `${dateTime} ${nickname} ${chatMessage}`;
  io.emit('message', messageToClients);
  await messagesModel.createMessage(chatMessage, nickname, dateTime);
};

const handleDisconnect = (socket, io) => {
  const currentUser = usersObj[socket.id];
  if (currentUser) {
    users = users.filter((user) => user !== currentUser);
    delete usersObj[socket.id];
    io.emit('nickname', { users });
  }
};

module.exports = (io) =>
  io.on('connection', async (socket) => {
    console.log(`novo usuário conectado! ${socket.id}`);
    
    socket.on('initialLogin', ({ nickname }) => {
      handleConnect(nickname, socket, io);
    });
    socket.on('saveName', ({ nickname }) => {
      handleConnect(nickname, socket, io);
    });
    socket.on('disconnect', () => handleDisconnect(socket, io));
  
    socket.on('message', ({ chatMessage, nickname }) => {
      handleMessage(chatMessage, nickname, io);
    });
  });