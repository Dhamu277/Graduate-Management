const express = require('express');
const router = express.Router();
const { getJobs, createJob, applyToJob, getMyJobApplications } = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getJobs)
  .post(protect, authorizeRoles('Graduate', 'Management'), createJob);

router.route('/applications')
  .get(protect, authorizeRoles('Graduate', 'Management'), getMyJobApplications);

router.route('/:id/apply')
  .post(protect, authorizeRoles('Student'), applyToJob);

module.exports = router;
