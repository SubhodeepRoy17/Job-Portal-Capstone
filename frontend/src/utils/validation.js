import * as yup from 'yup';

// Common validation schemas
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  role: yup
    .string()
    .oneOf(['user', 'employer'], 'Invalid role selected')
    .required('Please select a role'),
  address: yup
    .string()
    .max(200, 'Address cannot exceed 200 characters')
    .optional()
});

export const jobSchema = yup.object({
  title: yup.string().required('Title is required'),
  company: yup.string().required('Company is required'),
  description: yup.string().required('Description is required'),
  requirements: yup.string().required('Requirements are required'),
  location: yup.string().required('Location is required'),
  salaryMin: yup
    .number()
    .required('Minimum salary is required')
    .min(0, 'Salary must be positive'),
  salaryMax: yup
    .number()
    .required('Maximum salary is required')
    .min(yup.ref('salaryMin'), 'Maximum salary must be greater than minimum'),
  jobType: yup.string().required('Job type is required'),
  experienceLevel: yup.string().required('Experience level is required'),
  category: yup.string().required('Category is required'),
  expiresAt: yup.string().required('Expiration date is required')
});

export const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  address: yup
    .string()
    .max(200, 'Address cannot exceed 200 characters')
    .optional(),
  skills: yup
    .string()
    .optional(),
  experience: yup
    .string()
    .oneOf(['fresher', '0-2 years', '2-5 years', '5+ years'], 'Invalid experience level')
    .optional()
});

// Utility functions
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  return errors;
};

export const formatValidationError = (error) => {
  if (error?.response?.data?.errors) {
    return error.response.data.errors.map(err => err.message).join(', ');
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Validation failed';
};

export const parseSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills;
  }
  
  if (typeof skills === 'string') {
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }
  
  return [];
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const calculateProfileCompletion = (user) => {
  const fields = [
    user?.name,
    user?.email,
    user?.phone,
    user?.address,
    user?.skills?.length > 0,
    user?.experience
  ];
  
  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
};