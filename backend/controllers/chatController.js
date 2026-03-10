const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');

// @desc    Start/get a chat session
// @route   GET /api/chat/session
// @access  Private
const getChatSession = async (req, res, next) => {
  try {
    let session = await ChatSession.findOne({ userId: req.user._id, status: 'Active' });

    if (!session) {
      session = await ChatSession.create({
        userId: req.user._id,
        status: 'Active'
      });
      
      // Auto-reply greeting
      await ChatMessage.create({
        chatSession: session._id,
        sender: 'Bot',
        text: `Hello ${req.user.name}! I am your Alumni Help Assistant. How can I help you today?`
      });
    }

    const messages = await ChatMessage.find({ chatSession: session._id }).sort({ createdAt: 1 });

    res.json({ session, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { text, sessionId } = req.body;

    const session = await ChatSession.findById(sessionId);
    if (!session || session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this session' });
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      chatSession: session._id,
      sender: 'User',
      text
    });

    // Generate bot reply (Pre-defined logic for now, easily replaceable by AI)
    let botReplyText = "I'm sorry, I don't understand that right now. Try asking about jobs, mentorships, or events.";
    const lowerText = text.toLowerCase();

    if (lowerText.includes('job') || lowerText.includes('career')) {
      botReplyText = "You can find job posts by navigating to the Jobs portal in the sidebar. You can search, filter, and apply from there.";
    } else if (lowerText.includes('mentor')) {
      botReplyText = "Mentorship opportunities are available in the Mentorship module. You can request a mentor or offer mentorship if you are a Graduate.";
    } else if (lowerText.includes('event')) {
      botReplyText = "Check the Events section for upcoming alumni meets and workshops. You can register for an event directly.";
    } else if (lowerText.includes('profile')) {
      botReplyText = "To update your profile, go to the Profile section and click edit. Make sure to complete all fields so others can find you in the directory.";
    }

    const botMessage = await ChatMessage.create({
      chatSession: session._id,
      sender: 'Bot',
      text: botReplyText
    });

    res.status(201).json({ userMessage, botMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear chat session
// @route   DELETE /api/chat/session/:id
// @access  Private
const clearChatSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    
    if (session && session.userId.toString() === req.user._id.toString()) {
      session.status = 'Closed';
      await session.save();
      
      res.json({ message: 'Session closed' });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatSession,
  sendMessage,
  clearChatSession
};
