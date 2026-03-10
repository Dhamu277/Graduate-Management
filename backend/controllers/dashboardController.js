const User = require('../models/User');
const Mentorship = require('../models/Mentorship');
const JobPost = require('../models/JobPost');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Post = require('../models/Post');

// @desc    Get dashboard statistics and recent data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res, next) => {
  try {
    // Analytics/Stats
    const totalUsers = await User.countDocuments();
    const totalAlumni = await User.countDocuments({ role: 'Graduate' });
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalManagement = await User.countDocuments({ role: 'Management' });
    
    // Active Users (Assuming students and alumni are 'active')
    const activeUsers = totalStudents + totalAlumni;

    const totalMentorships = await Mentorship.countDocuments();
    const totalJobPosts = await JobPost.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();
    const totalCommunityPosts = await Post.countDocuments();

    // Recent Activities Data
    const recentJobs = await JobPost.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('postedBy', 'name role');

    const recentMentorships = await Mentorship.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('mentor', 'name');

    const upcomingEvents = await Event.find({ status: 'Upcoming' })
      .sort({ date: 1 }) // Closest upcoming
      .limit(5);

    const recentAnnouncements = await Announcement.find()
      .sort({ pinned: -1, createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalAlumni,
        totalStudents,
        totalManagement,
        activeUsers,
        totalMentorships,
        totalJobPosts,
        totalEvents,
        totalAnnouncements,
        totalCommunityPosts
      },
      recentData: {
        recentJobs,
        recentMentorships,
        upcomingEvents,
        recentAnnouncements
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
