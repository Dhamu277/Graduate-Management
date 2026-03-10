const Announcement = require('../models/Announcement');
const User = require('../models/User');

// @desc    Get all announcements
// @route   GET /api/admin/announcements
// @access  Private
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name role')
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an announcement
// @route   POST /api/admin/announcements
// @access  Private (Management)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, description, priority, isPinned } = req.body;

    const announcement = await Announcement.create({
      title,
      description,
      priority,
      isPinned,
      createdBy: req.user._id
    });

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private (Management)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAnnouncements,
  createAnnouncement,
  getAllUsers
};
