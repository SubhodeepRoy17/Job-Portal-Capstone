const { body } = require('express-validator');

// Common validation rules
const commonValidators = {
  email: body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  
  name: body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Name can only contain letters and spaces'),
  
  phone: body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),
  
  requiredField: (fieldName, customMessage = null) => 
    body(fieldName)
      .trim()
      .notEmpty()
      .withMessage(customMessage || `${fieldName} is required`)
};

// Job validation rules
const jobValidators = {
  title: body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  company: body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  description: body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50 })
    .withMessage('Description must be at least 50 characters'),
  
  requirements: body('requirements')
    .isArray({ min: 1 })
    .withMessage('At least one requirement is required')
    .custom(requirements => requirements.every(req => typeof req === 'string' && req.trim().length > 0))
    .withMessage('All requirements must be non-empty strings'),
  
  location: body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  salaryMin: body('salary.min')
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  
  salaryMax: body('salary.max')
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number')
    .custom((max, { req }) => {
      if (parseFloat(max) < parseFloat(req.body.salary?.min || 0)) {
        throw new Error('Maximum salary must be greater than minimum salary');
      }
      return true;
    }),
  
  jobType: body('jobType')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
  
  experienceLevel: body('experienceLevel')
    .isIn(['entry', 'mid', 'senior', 'executive'])
    .withMessage('Invalid experience level'),
  
  category: body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  expiresAt: body('expiresAt')
    .isISO8601()
    .withMessage('Invalid expiration date')
    .custom(date => {
      const expDate = new Date(date);
      const now = new Date();
      if (expDate <= now) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    })
};

// User validation rules
const userValidators = {
  role: body('role')
    .optional()
    .isIn(['user', 'admin', 'employer'])
    .withMessage('Invalid role'),
  
  skills: body('skills')
    .optional()
    .custom(value => {
      if (typeof value === 'string') {
        return true;
      }
      if (Array.isArray(value)) {
        return value.every(skill => typeof skill === 'string' && skill.trim().length > 0);
      }
      return false;
    })
    .withMessage('Skills must be an array of strings or comma-separated string'),
  
  experience: body('experience')
    .optional()
    .isIn(['fresher', '0-2 years', '2-5 years', '5+ years'])
    .withMessage('Invalid experience level'),
  
  address: body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters')
};

// Validation error formatter
const formatValidationErrors = (errors) => {
  return errors.array().map(error => ({
    field: error.path,
    message: error.msg
  }));
};

// Async validation wrapper
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: formatValidationErrors(errors)
    });
  };
};

module.exports = {
  commonValidators,
  jobValidators,
  userValidators,
  formatValidationErrors,
  validate
};