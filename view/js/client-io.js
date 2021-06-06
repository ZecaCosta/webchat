const client = window.io();

/* 
fonte para construir função para gerar nome aleatório:
https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
*/
const randomNickname = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nameString = '';
  for (let i = 0; i < length; i += 1) {
    nameString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return nameString;
};

let nickname = randomNickname(16);
client.emit('initialLogin', { nickname });

const clientsList = document.querySelector('#clientsList');
const messagesList = document.querySelector('#messagesList');
const nicknameInput = document.querySelector('#nicknameInput');
const messageInput = document.querySelector('#messageInput');
const formSaveNickname = document.querySelector('#formSaveNickname');
const formSendMessage = document.querySelector('#formSendMessage');

const createUsers = (users) => {
  clientsList.innerHTML = '';
  users.map((user) => {
    const userElement = document.createElement('li');
    userElement.setAttribute('data-testid', 'online-user');
    userElement.innerHTML = user;
    return clientsList.appendChild(userElement);
  });
};

client.on('nickname', ({ users }) => {
    const otherUsers = users.filter((user) => user !== nickname);
    const allUsers = [nickname, ...otherUsers];
    createUsers(allUsers);
});

formSaveNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickname = nicknameInput.value;
  if (newNickname) {
    nickname = newNickname;
    client.emit('saveName', { nickname });
  }
});

const createMessage = (message) => {
  const messageElement = document.createElement('li');
  messageElement.setAttribute('data-testid', 'message');
  messageElement.innerHTML = `${message}`;
  return messageElement;
};

formSendMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = messageInput.value;
  const message = { chatMessage, nickname };
  client.emit('message', message);
});

client.on('message', (message) => {
  const newMessage = createMessage(message);
  messagesList.appendChild(newMessage);
});