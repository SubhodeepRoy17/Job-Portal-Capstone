const User = require('../models/User');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, phone, address, skills, experience } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (experience) updateData.experience = experience;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Admin can view any user, users can only view their own profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, address, skills, experience } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (experience) updateData.experience = experience;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user's jobs if they are an employer
    if (user.role === 'employer') {
      await Job.deleteMany({ postedBy: user._id });
    }

    // Delete user's applications
    await Job.updateMany(
      { 'applicants.user': user._id },
      { $pull: { applicants: { user: user._id } } }
    );

    await user.remove();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's job applications
// @route   GET /api/users/applications
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      'applicants.user': req.user.id
    })
    .populate('postedBy', 'name email')
    .select('title company location salary jobType experienceLevel postedAt')
    .sort('-postedAt');

    // Extract application details
    const applications = jobs.map(job => {
      const application = job.applicants.find(
        app => app.user.toString() === req.user.id
      );
      
      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          postedAt: job.postedAt
        },
        appliedAt: application.appliedAt,
        status: application.status
      };
    });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's posted jobs (for employers)
// @route   GET /api/users/my-jobs
// @access  Private/Employer
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .populate('applicants.user', 'name email')
      .sort('-postedAt');

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update application status (for employers)
// @route   PUT /api/users/applications/:jobId/:userId
// @access  Private/Employer
const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Find and update the application
    const applicantIndex = job.applicants.findIndex(
      app => app.user.toString() === userId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    job.applicants[applicantIndex].status = status;
    await job.save();

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyApplications,
  getMyJobs,
  updateApplicationStatus
};