const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// Job validation rules
const jobValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('requirements').isArray().withMessage('Requirements must be an array'),
  body('location').notEmpty().withMessage('Location is required'),
  body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').isNumeric().withMessage('Maximum salary must be a number'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type'),
  body('experienceLevel').isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
  body('category').notEmpty().withMessage('Category is required'),
  body('expiresAt').isISO8601().withMessage('Invalid expiration date')
];

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.use(protect);

// Employer and Admin routes for job management
router.post('/', authorize('admin', 'employer'), jobValidation, createJob);
router.put('/:id', authorize('admin', 'employer'), jobValidation, updateJob);
router.delete('/:id', authorize('admin', 'employer'), deleteJob);

// User routes
router.post('/:id/apply', authorize('user'), applyForJob);

module.exports = router;