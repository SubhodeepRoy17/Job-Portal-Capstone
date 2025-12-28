import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import JobList from '../components/jobs/JobList';
import JobForm from '../components/jobs/JobForm';
import JobItem from '../components/jobs/JobItem';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Sidebar from '../components/layout/Sidebar';

const JobsPage = () => {
  const { user, isAdmin, isEmployer } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Dialog states
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    category: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await jobService.getJobs(filters);
      
      if (response.success) {
        setJobs(response.jobs);
      } else {
        setError('Failed to load jobs');
      }
    } catch (error) {
      setError('Error loading jobs. Please try again.');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setDialogMode('create');
    setJobDialogOpen(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setDialogMode('edit');
    setJobDialogOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        setLoading(true);
        const response = await jobService.deleteJob(jobId);
        
        if (response.success) {
          setJobs(jobs.filter(job => job._id !== jobId));
          showSnackbar('Job deleted successfully', 'success');
        }
      } catch (error) {
        showSnackbar(error.response?.data?.message || 'Failed to delete job', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApplyJob = (jobId) => {
    // This would be handled by JobItem component
    fetchJobs(); // Refresh to update application status
  };

  const handleJobSubmit = async (jobData) => {
    try {
      setLoading(true);
      
      let response;
      if (dialogMode === 'create') {
        response = await jobService.createJob(jobData);
      } else {
        response = await jobService.updateJob(selectedJob._id, jobData);
      }
      
      if (response.success) {
        setJobDialogOpen(false);
        fetchJobs();
        showSnackbar(
          dialogMode === 'create' ? 'Job created successfully!' : 'Job updated successfully!',
          'success'
        );
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const canCreateJob = isAdmin || isEmployer;
  const isJobOwner = (job) => {
    return isAdmin || (isEmployer && job.postedBy?._id === user?.id);
  };

  if (loading && jobs.length === 0) {
    return <Loader message="Loading jobs..." />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Job Opportunities
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Discover your next career move from thousands of opportunities
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Refresh jobs">
                  <IconButton onClick={fetchJobs} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                
                {canCreateJob && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateJob}
                  >
                    Post New Job
                  </Button>
                )}
              </Box>
            </Box>
            
            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {jobs.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Jobs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {jobs.filter(j => j.jobType === 'full-time').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Full-time
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {jobs.filter(j => j.jobType === 'remote').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Remote
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Card elevation={1}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {jobs.filter(j => j.experienceLevel === 'entry').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Entry Level
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Error Display */}
          {error && (
            <ErrorMessage 
              message={error}
              onRetry={fetchJobs}
              sx={{ mb: 3 }}
            />
          )}

          {/* Jobs List */}
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} key={job._id}>
                <JobItem
                  job={job}
                  onEdit={isJobOwner(job) ? handleEditJob : null}
                  onDelete={isJobOwner(job) ? handleDeleteJob : null}
                  onApply={handleApplyJob}
                />
              </Grid>
            ))}
          </Grid>

          {/* No Jobs Message */}
          {jobs.length === 0 && !loading && !error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No jobs found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search criteria or check back later
              </Typography>
              {canCreateJob && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateJob}
                >
                  Post the First Job
                </Button>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Create/Edit Job Dialog */}
      <Dialog 
        open={jobDialogOpen} 
        onClose={() => setJobDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' ? 'Post New Job' : 'Edit Job'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <JobForm
              initialData={selectedJob}
              onSubmit={handleJobSubmit}
              loading={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setJobDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="job-form"
            variant="contained"
            disabled={loading}
          >
            {dialogMode === 'create' ? 'Create Job' : 'Update Job'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobsPage;