const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  mentorship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentorship',
    required: true
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  message: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
