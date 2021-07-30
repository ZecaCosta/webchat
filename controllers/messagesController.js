const messagesModel = require('../models/messagesModel');

const SUCCESS = 200;
const INTERNAL_SERVER_ERROR = 500;

const getAllMessages = async (req, res) => {
  try {
    const allMessages = await messagesModel.getAllMessages();
    return res.status(SUCCESS).json(allMessages);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao buscar messagens no banco',
        error: error.message,
      });
  }
};

module.exports = {
  getAllMessages,
};