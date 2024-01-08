const express = require('express'); // Ensure this line requires 'express'
const { sendMessage, getAllMessages } = require('../Controllers/MessageController');
const protect = require('../Middlewares/authMiddleware');

const router = express.Router();

router.route('/:chatId').get(protect, getAllMessages);
router.route('/').post(protect, sendMessage);

module.exports = router;
