import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { authService } from '../services/authService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    profileCompletion: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile for completion percentage
      const profileResponse = await authService.getMe();
      if (profileResponse.success) {
        updateUser(profileResponse.user);
        calculateProfileCompletion(profileResponse.user);
      }

      // Fetch user applications
      if (user?.role === 'user') {
        const appsResponse = await jobService.getMyApplications();
        if (appsResponse.success) {
          setApplications(appsResponse.applications);
          setStats(prev => ({
            ...prev,
            applications: appsResponse.count
          }));
        }
      }

      // Fetch recent jobs
      const jobsResponse = await jobService.getJobs({ limit: 3 });
      if (jobsResponse.success) {
        setRecentJobs(jobsResponse.jobs);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (userData) => {
    let completion = 0;
    const fields = [
      userData?.name,
      userData?.email,
      userData?.phone,
      userData?.address,
      userData?.skills?.length > 0,
      userData?.experience
    ];
    
    const completedFields = fields.filter(Boolean).length;
    completion = Math.round((completedFields / fields.length) * 100);
    
    setStats(prev => ({
      ...prev,
      profileCompletion: completion
    }));
  };

  const getApplicationStatusColor = (status) => {
    const colors = {
      'pending': 'default',
      'reviewed': 'info',
      'shortlisted': 'primary',
      'rejected': 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage 
          message={error}
          onRetry={fetchDashboardData}
        />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your job search today.
            </Typography>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                      <WorkIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.applications}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applications Sent
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    component={Link}
                    to="/dashboard/applications"
                    endIcon={<ArrowForwardIcon />}
                    size="small"
                  >
                    View Applications
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight="bold">
                        {stats.interviews}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Interviews
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Track your interview invites
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        Profile Completion
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={stats.profileCompletion}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {stats.profileCompletion}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    component={Link}
                    to="/dashboard/profile"
                    size="small"
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Applications */}
            {user?.role === 'user' && applications.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Recent Applications
                    </Typography>
                    <Button
                      component={Link}
                      to="/dashboard/applications"
                      size="small"
                    >
                      View All
                    </Button>
                  </Box>
                  
                  <List>
                    {applications.slice(0, 5).map((application, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemIcon>
                            <BusinessIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="medium">
                                {application.job.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {application.job.company}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                  <Chip
                                    label={application.status}
                                    color={getApplicationStatusColor(application.status)}
                                    size="small"
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(application.appliedAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < applications.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}

            {/* Recommended Jobs */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recommended For You
                  </Typography>
                  <Button
                    component={Link}
                    to="/jobs"
                    size="small"
                  >
                    Browse All
                  </Button>
                </Box>
                
                <List>
                  {recentJobs.map((job, index) => (
                    <React.Fragment key={job._id}>
                      <ListItem 
                        alignItems="flex-start"
                        button
                        component={Link}
                        to={`/jobs/${job._id}`}
                      >
                        <ListItemIcon>
                          <WorkIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {job.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {job.company} • {job.location}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Chip
                                  label={job.jobType}
                                  size="small"
                                  variant="outlined"
                                />
                                <Typography variant="caption" color="text.secondary">
                                  <ScheduleIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                                  {new Date(job.postedAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentJobs.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Button
                      component={Link}
                      to="/jobs"
                      variant="outlined"
                      fullWidth
                      startIcon={<SearchIcon />}
                      sx={{ py: 2 }}
                    >
                      Search Jobs
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      component={Link}
                      to="/dashboard/profile"
                      variant="outlined"
                      fullWidth
                      startIcon={<PersonIcon />}
                      sx={{ py: 2 }}
                    >
                      Update Profile
                    </Button>
                  </Grid>
                  {user?.role === 'employer' && (
                    <>
                      <Grid item xs={6} sm={3}>
                        <Button
                          component={Link}
                          to="/jobs/new"
                          variant="contained"
                          fullWidth
                          startIcon={<AssignmentIcon />}
                          sx={{ py: 2 }}
                        >
                          Post Job
                        </Button>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Button
                          component={Link}
                          to="/dashboard/my-jobs"
                          variant="outlined"
                          fullWidth
                          startIcon={<WorkIcon />}
                          sx={{ py: 2 }}
                        >
                          My Jobs
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

// Add missing SearchIcon import
const SearchIcon = WorkIcon;

export default Dashboard;