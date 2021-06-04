const client = window.io();

const createUser = (user) => {
  const messageElement = document.createElement('li');
    messageElement.innerHTML = `${user}`;
  return messageElement;
};

const createMessage = (message) => {
  const messageElement = document.createElement('li');
    messageElement.innerHTML = `${message}`;
  return messageElement;
};
document.querySelector('#formSaveNickname').addEventListener('submit', (e) => {
  e.preventDefault();

  const newUser = document.querySelector('#nicknameInput').value;

  client.emit('sendUserToServer', newUser);
});

client.on('confirmConnection', (user) => {
  const newUser = createUser(user);
  document.querySelector('#nicknameList').append(newUser);
});

client.on('newUserConnect', (user) => {
  const newUser = createUser(user);
  document.querySelector('#nicknameList').append(newUser);
});

document.querySelector('#formSendMessage').addEventListener('submit', (e) => {
  e.preventDefault();

  const textMessage = document.querySelector('#messageInput').value;

  client.emit('sendMessageToServer', textMessage);
});

client.on('sendMessageToClients', (message) => {
    const newMessageUser = createMessage(message);
  document.querySelector('#listMessages').append(newMessageUser);
});