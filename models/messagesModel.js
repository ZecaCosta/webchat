const connection = require('./connection');

const COLLECTION_NAME = 'messages';

const createMessage = async (message, nickname, timestamp) => {
  await connection().then((db) =>
    db.collection(COLLECTION_NAME).insertOne({ message, nickname, timestamp }));
};

const getAllMessages = async () => {
  const allMessages = await connection()
    .then((db) => db.collection(COLLECTION_NAME).find().toArray());
    return allMessages;
};

module.exports = {
  createMessage,
  getAllMessages,
};