const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    trim: true
  },
  requirements: {
    type: [String],
    required: [true, 'Please provide job requirements']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location'],
    trim: true
  },
  salary: {
    min: {
      type: Number,
      required: [true, 'Please provide minimum salary']
    },
    max: {
      type: Number,
      required: [true, 'Please provide maximum salary']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: [true, 'Please provide job type']
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    required: [true, 'Please provide experience level']
  },
  category: {
    type: String,
    required: [true, 'Please provide job category'],
    trim: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: [true, 'Please provide expiration date']
  }
});

module.exports = mongoose.model('Job', jobSchema);