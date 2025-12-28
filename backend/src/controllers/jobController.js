const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      experienceLevel,
      category,
      page = 1,
      limit = 10
    } = req.query;

    let query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Other filters
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (category) query.category = { $regex: category, $options: 'i' };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort('-postedAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Admin/Employer)
const createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Admin/Employer)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is owner or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin/Employer)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is owner or admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.remove();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.find(
      applicant => applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job'
      });
    }

    // Add applicant
    job.applicants.push({
      user: req.user.id,
      status: 'pending'
    });

    await job.save();

    res.json({
      success: true,
      message: 'Applied successfully'
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob
};