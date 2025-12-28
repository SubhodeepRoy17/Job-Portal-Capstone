const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyApplications,
  getMyJobs,
  updateApplicationStatus
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// Profile validation rules
const profileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),
  body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  body('skills').optional().custom(value => {
    if (typeof value === 'string') {
      return true;
    }
    if (Array.isArray(value)) {
      return value.every(skill => typeof skill === 'string');
    }
    return false;
  }).withMessage('Skills must be an array of strings or comma-separated string'),
  body('experience').optional().isIn(['fresher', '0-2 years', '2-5 years', '5+ years'])
    .withMessage('Invalid experience level')
];

// User validation rules (for admin)
const userValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['user', 'admin', 'employer']).withMessage('Invalid role'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),
  body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  body('skills').optional().custom(value => {
    if (typeof value === 'string') {
      return true;
    }
    if (Array.isArray(value)) {
      return value.every(skill => typeof skill === 'string');
    }
    return false;
  }).withMessage('Skills must be an array of strings or comma-separated string'),
  body('experience').optional().isIn(['fresher', '0-2 years', '2-5 years', '5+ years'])
    .withMessage('Invalid experience level')
];

// Application status validation
const applicationStatusValidation = [
  body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected'])
    .withMessage('Invalid status')
];

// All routes are protected
router.use(protect);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', profileValidation, updateProfile);

// User's applications
router.get('/applications', authorize('user'), getMyApplications);

// Employer's job management
router.get('/my-jobs', authorize('employer', 'admin'), getMyJobs);
router.put('/applications/:jobId/:userId', authorize('employer', 'admin'), applicationStatusValidation, updateApplicationStatus);

// Admin user management routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorize('admin'), userValidation, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;