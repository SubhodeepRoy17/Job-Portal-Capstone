import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import { authService } from '../services/authService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Sidebar from '../components/layout/Sidebar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [usersPage, setUsersPage] = useState(0);
  const [jobsPage, setJobsPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialogs
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users
      const usersResponse = await authService.getUsers();
      if (usersResponse.success) {
        setRecentUsers(usersResponse.users);
        setStats(prev => ({ ...prev, totalUsers: usersResponse.count }));
      }

      // Fetch all jobs
      const jobsResponse = await jobService.getJobs({ limit: 100 });
      if (jobsResponse.success) {
        setRecentJobs(jobsResponse.jobs);
        setStats(prev => ({ 
          ...prev, 
          totalJobs: jobsResponse.total,
          activeJobs: jobsResponse.jobs.filter(job => job.isActive).length
        }));
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDialogOpen = (user = null) => {
    setSelectedUser(user);
    setEditMode(!!user);
    setUserDialogOpen(true);
  };

  const handleUserDialogClose = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Implementation depends on your API
        // await userService.deleteUser(userId);
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUsersPageChange = (event, newPage) => {
    setUsersPage(newPage);
  };

  const handleJobsPageChange = (event, newPage) => {
    setJobsPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setUsersPage(0);
    setJobsPage(0);
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'error',
      'employer': 'warning',
      'user': 'success'
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status) => {
    return status ? 'success' : 'error';
  };

  if (loading) {
    return <Loader message="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage 
          message={error}
          onRetry={fetchAdminData}
        />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome, {user?.name}. Manage your platform from here.
            </Typography>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.totalUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                      <WorkIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.totalJobs}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Jobs
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.activeJobs}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Jobs
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.totalApplications}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applications
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Users Table */}
            <Grid item xs={12} lg={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Users
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => handleUserDialogOpen()}
                  >
                    Add User
                  </Button>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers
                        .slice(usersPage * rowsPerPage, usersPage * rowsPerPage + rowsPerPage)
                        .map((user) => (
                          <TableRow key={user._id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {user.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {user.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {user.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                color={getRoleColor(user.role)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={user.isActive ? <CheckCircleIcon /> : <WarningIcon />}
                                label={user.isActive ? 'Active' : 'Inactive'}
                                color={getStatusColor(user.isActive)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => handleUserDialogOpen(user)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteUser(user._id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={recentUsers.length}
                  rowsPerPage={rowsPerPage}
                  page={usersPage}
                  onPageChange={handleUsersPageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Paper>
            </Grid>

            {/* Recent Jobs Table */}
            <Grid item xs={12} lg={6}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Jobs
                  </Typography>
                  <Button
                    component={Link}
                    to="/jobs/new"
                    startIcon={<AddIcon />}
                    variant="outlined"
                    size="small"
                  >
                    Add Job
                  </Button>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Job Title</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentJobs
                        .slice(jobsPage * rowsPerPage, jobsPage * rowsPerPage + rowsPerPage)
                        .map((job) => (
                          <TableRow key={job._id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {job.title}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{job.company}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={job.jobType}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={job.isActive ? 'Active' : 'Closed'}
                                color={getStatusColor(job.isActive)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" component={Link} to={`/jobs/${job._id}`}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" component={Link} to={`/jobs/${job._id}/edit`}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={recentJobs.length}
                  rowsPerPage={rowsPerPage}
                  page={jobsPage}
                  onPageChange={handleJobsPageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={handleUserDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              defaultValue={selectedUser?.name || ''}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              defaultValue={selectedUser?.email || ''}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Role"
              select
              defaultValue={selectedUser?.role || 'user'}
              margin="normal"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="employer">Employer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            {!editMode && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUserDialogClose}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;