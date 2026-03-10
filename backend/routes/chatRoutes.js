const express = require('express');
const router = express.Router();
const { getChatSession, sendMessage, clearChatSession } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/session')
  .get(protect, getChatSession);

router.route('/message')
  .post(protect, sendMessage);

router.route('/session/:id')
  .delete(protect, clearChatSession);

module.exports = router;
