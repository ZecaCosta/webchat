module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('sendUserToServer', (user) => {
      console.log(`novo usuário conectado! ${user}`);

      socket.emit('confirmConnection', user);
      socket.broadcast.emit('newUserConnect', user);
    });
 
    socket.on('sendMessageToServer', (message) => {
      io.emit('sendMessageToClients', message);
    });
  });
};