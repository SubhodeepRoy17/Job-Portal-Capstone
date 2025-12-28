/**
 * Custom error classes for better error handling
 */

// Base Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

// 401 Unauthorized
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// 403 Forbidden
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// 404 Not Found
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 409 Conflict
class ConflictError extends AppError {
  constructor(message = 'Conflict occurred') {
    super(message, 409);
  }
}

// 422 Unprocessable Entity
class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 422);
    this.errors = errors;
  }
}

// 500 Internal Server Error
class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
      errors: err.errors
    });
  }

  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  if (err.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  if (err.code === 11000) {
    // Mongoose duplicate key error
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please log in again.'
    });
  }

  // Handle custom AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Handle unknown errors (don't leak error details in production)
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }

  // Development error response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

/**
 * Async error handler wrapper
 * Catches async errors and passes them to the error handler
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
};

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  errorHandler,
  catchAsync,
  notFound
};