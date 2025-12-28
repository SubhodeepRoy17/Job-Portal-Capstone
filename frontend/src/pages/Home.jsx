import React from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../contexts/AuthContext';
import JobList from '../components/jobs/JobList';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const stats = [
    { label: 'Active Jobs', value: '5,000+', icon: <WorkIcon /> },
    { label: 'Companies', value: '1,200+', icon: <PeopleIcon /> },
    { label: 'Success Rate', value: '85%', icon: <TrendingUpIcon /> },
    { label: 'Fast Hiring', value: '24-48h', icon: <AccessTimeIcon /> },
  ];

  const features = [
    {
      title: 'Smart Job Matching',
      description: 'Our AI-powered algorithm matches your skills with the perfect job opportunities.',
      icon: '🤖'
    },
    {
      title: 'Secure Application',
      description: 'Your personal information and applications are protected with enterprise-grade security.',
      icon: '🔒'
    },
    {
      title: 'Real-time Notifications',
      description: 'Get instant updates on your applications and new job postings.',
      icon: '🔔'
    },
    {
      title: 'Career Resources',
      description: 'Access free resume building tools and interview preparation guides.',
      icon: '📚'
    },
  ];

  const jobCategories = [
    'Technology',
    'Healthcare',
    'Finance',
    'Marketing',
    'Design',
    'Education',
    'Sales',
    'Customer Service'
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Find Your Dream Job
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Connect with top companies and discover opportunities that match your skills and ambitions.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {!isAuthenticated ? (
                  <>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<WorkIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      component={Link}
                      to="/login"
                      variant="outlined"
                      color="inherit"
                      size="large"
                      sx={{ borderRadius: 2 }}
                    >
                      Sign In
                    </Button>
                  </>
                ) : (
                  <Button
                    component={Link}
                    to="/jobs"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<SearchIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Browse Jobs
                  </Button>
                )}
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-illustration.svg"
                alt="Job Search"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 16
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card elevation={2} sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
            Why Choose JobPortal?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            We provide the tools and resources you need to advance your career
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={0} sx={{ height: '100%', bgcolor: 'transparent' }}>
                  <CardContent>
                    <Typography variant="h1" align="center" sx={{ mb: 2 }}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Job Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
          Popular Job Categories
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Explore opportunities in various fields
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          {jobCategories.map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                component={Link}
                to={`/jobs?category=${category}`}
                clickable
                sx={{
                  px: 3,
                  py: 2,
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white'
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Latest Jobs Preview */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Latest Job Opportunities
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Discover new positions posted daily
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/jobs"
            variant="outlined"
            size="large"
          >
            View All Jobs
          </Button>
        </Box>
        
        {/* Show limited job preview */}
        <Box sx={{ mb: 4 }}>
          <JobList />
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ bgcolor: 'transparent', textAlign: 'center', p: 4 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to advance your career?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of professionals who found their dream jobs through JobPortal
            </Typography>
            
            {!isAuthenticated ? (
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 6, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
              >
                Get Started Free
              </Button>
            ) : user?.role === 'employer' ? (
              <Button
                component={Link}
                to="/jobs/new"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 6, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
              >
                Post a Job
              </Button>
            ) : (
              <Button
                component={Link}
                to="/jobs"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 6, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
              >
                Browse Jobs
              </Button>
            )}
            
            <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
              No credit card required • Free forever plan available
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;