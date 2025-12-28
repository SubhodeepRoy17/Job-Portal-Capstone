import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  LinearProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../contexts/AuthContext';

const JobItem = ({ job, onApply, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatSalary = (min, max, currency = 'USD') => {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'primary',
      'part-time': 'secondary',
      'contract': 'warning',
      'internship': 'info',
      'remote': 'success'
    };
    return colors[type] || 'default';
  };

  const getExperienceLabel = (level) => {
    const labels = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level',
      'executive': 'Executive'
    };
    return labels[level] || level;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleApply = async () => {
    if (!user) {
      setError('Please login to apply for jobs');
      return;
    }

    if (user.role !== 'user') {
      setError('Only job seekers can apply for jobs');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await jobService.applyForJob(job._id);
      
      if (response.success) {
        setSuccess('Application submitted successfully!');
        if (onApply) onApply(job._id);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      onDelete(job._id);
    }
  };

  const isJobOwner = user && (user.role === 'admin' || (user.role === 'employer' && job.postedBy?._id === user.id));
  const hasApplied = user && job.applicants?.some(app => app.user === user.id);
  const isUserJobSeeker = user && user.role === 'user';

  return (
    <>
      <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {job.title}
              </Typography>
              <Typography color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BusinessIcon fontSize="small" />
                {job.company}
              </Typography>
            </Box>
            <Chip
              label={job.jobType}
              color={getJobTypeColor(job.jobType)}
              size="small"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <LocationOnIcon fontSize="small" />
              {job.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <AttachMoneyIcon fontSize="small" />
              {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WorkIcon fontSize="small" />
              {getExperienceLabel(job.experienceLevel)}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={job.category}
              variant="outlined"
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
            {job.isActive ? (
              <Chip label="Active" color="success" size="small" />
            ) : (
              <Chip label="Closed" color="error" size="small" />
            )}
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {job.description.substring(0, 150)}...
          </Typography>

          {job.applicants && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary">
            <ScheduleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Posted {new Date(job.postedAt).toLocaleDateString()} • Expires {new Date(job.expiresAt).toLocaleDateString()}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleOpen}
            fullWidth
          >
            View Details
          </Button>
          
          {isJobOwner && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onEdit(job)}
                fullWidth
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                fullWidth
              >
                Delete
              </Button>
            </>
          )}
          
          {isUserJobSeeker && !isJobOwner && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              disabled={loading || hasApplied}
              fullWidth
            >
              {hasApplied ? 'Applied' : 'Apply Now'}
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Job Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{job.title}</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            {job.company}
          </Typography>
        </DialogTitle>
        
        {loading && <LinearProgress />}
        
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOnIcon fontSize="small" />
                  <strong>Location:</strong> {job.location}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AttachMoneyIcon fontSize="small" />
                  <strong>Salary:</strong> {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <WorkIcon fontSize="small" />
                  <strong>Experience:</strong> {getExperienceLabel(job.experienceLevel)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ScheduleIcon fontSize="small" />
                  <strong>Job Type:</strong> {job.jobType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SchoolIcon fontSize="small" />
                  <strong>Category:</strong> {job.category}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Job Description</Typography>
            <Typography variant="body1" paragraph>
              {job.description}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Requirements</Typography>
            <ul style={{ paddingLeft: '20px' }}>
              {job.requirements?.map((req, index) => (
                <li key={index}>
                  <Typography variant="body1">{req}</Typography>
                </li>
              ))}
            </ul>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Posted by: {job.postedBy?.name || 'Company'} • 
              Posted on: {new Date(job.postedAt).toLocaleDateString()} • 
              Expires on: {new Date(job.expiresAt).toLocaleDateString()}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          {isUserJobSeeker && !isJobOwner && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              disabled={loading || hasApplied}
              sx={{ minWidth: '120px' }}
            >
              {loading ? 'Applying...' : hasApplied ? 'Already Applied' : 'Apply Now'}
            </Button>
          )}
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Helper Grid component for DialogContent
const Grid = ({ children, ...props }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }} {...props}>
    {children}
  </div>
);

export default JobItem;