import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Pagination,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { jobService } from '../../services/jobService';
import { Link } from 'react-router-dom';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [category, setCategory] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
  const experienceLevels = ['entry', 'mid', 'senior', 'executive'];
  const categories = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Design',
    'Customer Service'
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {
        search,
        location,
        jobType,
        experienceLevel,
        category,
        page,
        limit: 9
      };
      
      const response = await jobService.getJobs(filters);
      
      if (response.success) {
        setJobs(response.jobs);
        setTotalPages(response.totalPages);
        setTotalJobs(response.total);
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

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setCategory('');
    setPage(1);
    fetchJobs();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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

  if (loading && jobs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Search and Filter Section */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Card elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="Job title, company, or keywords"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="City, state, or remote"
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={jobType}
                  label="Job Type"
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {jobTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Experience</InputLabel>
                <Select
                  value={experienceLevel}
                  label="Experience"
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {experienceLevels.map(level => (
                    <MenuItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ height: '56px' }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          
          {/* Additional Filters */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleReset}
                sx={{ height: '56px' }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>

      {/* Results Summary */}
      <Typography variant="h6" gutterBottom>
        {totalJobs > 0 ? `${totalJobs} Jobs Found` : 'No Jobs Found'}
        {totalJobs > 0 && ` • Page ${page} of ${totalPages}`}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
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
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoneyIcon fontSize="small" />
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={job.experienceLevel}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={job.category}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {job.description.substring(0, 100)}...
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/jobs/${job._id}`}
                  variant="outlined"
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* No Results Message */}
      {jobs.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No jobs found matching your criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default JobList;