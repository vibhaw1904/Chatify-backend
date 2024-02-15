const express = require('express'); // Ensure this line requires 'express'
const { sendMessage, getAllMessages } = require('../Controllers/MessageController');
const protect = require('../Middlewares/authMiddleware');
const { deleteChat } = require('../Controllers/chatController');

const router = express.Router();

router.route('/:chatId').get(protect, getAllMessages);
router.route('/:chatId').delete(protect,deleteChat);
router.route('/').post(protect, sendMessage);

module.exports = router;
