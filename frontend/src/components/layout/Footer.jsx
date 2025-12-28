import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="JobPortal Logo"
                sx={{ height: 40, mr: 2 }}
              />
              <Typography variant="h5" fontWeight="bold">
                JobPortal
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connecting talented professionals with amazing opportunities.
              Find your dream job or the perfect candidate with our platform.
            </Typography>
            
            {/* Social Media */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <IconButton color="primary" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              For Job Seekers
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/jobs"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Browse Jobs
              </Link>
              <Link
                component={RouterLink}
                to="/register"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Create Account
              </Link>
              <Link
                component={RouterLink}
                to="/dashboard/applications"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                My Applications
              </Link>
              <Link
                component={RouterLink}
                to="/dashboard/profile"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Career Advice
              </Link>
            </Stack>
          </Grid>

          {/* For Employers */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              For Employers
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/register?role=employer"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Post a Job
              </Link>
              <Link
                component={RouterLink}
                to="/dashboard/my-jobs"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Manage Jobs
              </Link>
              <Link
                component={RouterLink}
                to="/dashboard"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Browse Candidates
              </Link>
              <Link
                component={RouterLink}
                to="/pricing"
                color="inherit"
                underline="hover"
                variant="body2"
              >
                Pricing
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  123 Job Street, Career City, CC 10001
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  support@jobportal.com
                </Typography>
              </Box>
            </Stack>
            
            {/* Newsletter Subscription */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Subscribe to our newsletter
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Get the latest job alerts and career tips
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={3} sx={{ mt: { xs: 2, sm: 0 } }}>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="/cookies"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              Cookie Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;