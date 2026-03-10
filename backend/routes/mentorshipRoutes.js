const express = require('express');
const router = express.Router();
const { getMentorships, createMentorship, requestMentorship, getMyRequests, updateRequestStatus } = require('../controllers/mentorshipController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMentorships)
  .post(protect, authorizeRoles('Graduate', 'Management'), createMentorship);

router.route('/requests')
  .get(protect, authorizeRoles('Graduate', 'Management'), getMyRequests);

router.route('/:id/request')
  .post(protect, authorizeRoles('Student'), requestMentorship);

router.route('/requests/:id')
  .put(protect, authorizeRoles('Graduate', 'Management'), updateRequestStatus);

module.exports = router;
