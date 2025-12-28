import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Tooltip,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleDashboard = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
    handleMenuClose();
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse Jobs', path: '/jobs' },
  ];

  const profileMenuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, onClick: handleDashboard },
    { label: 'My Profile', path: '/dashboard/profile' },
    { label: 'My Applications', path: '/dashboard/applications' },
  ];

  const adminMenuItems = [
    { label: 'Admin Dashboard', icon: <AdminPanelSettingsIcon />, path: '/admin' },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Manage All Jobs', path: '/admin/jobs' },
  ];

  const employerMenuItems = [
    { label: 'Post New Job', path: '/jobs/new' },
    { label: 'My Jobs', path: '/dashboard/my-jobs' },
  ];

  const getDisplayName = () => {
    if (!user) return '';
    return user.name.split(' ')[0]; // First name only
  };

  const getUserInitials = () => {
    if (!user) return '';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <WorkIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                display: { xs: 'none', md: 'block' }
              }}
            >
              JobPortal
            </Typography>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                display: { xs: 'block', md: 'none' }
              }}
            >
              JP
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.path}
                sx={{ color: 'white', mx: 1 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Side - Desktop */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                {/* Admin/Employer specific buttons */}
                {isAdmin && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{ color: 'white', mr: 2 }}
                  >
                    Admin
                  </Button>
                )}
                
                {user?.role === 'employer' && (
                  <Button
                    component={RouterLink}
                    to="/jobs/new"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white', mr: 2 }}
                  >
                    Post Job
                  </Button>
                )}

                {/* User Profile Menu */}
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ p: 0, ml: 1 }}
                  >
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {getUserInitials()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                    <Typography variant="caption" color="primary" display="block">
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Typography>
                  </Box>

                  {profileMenuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={item.onClick || (() => {
                        navigate(item.path);
                        handleMenuClose();
                      })}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.icon}
                        {item.label}
                      </Box>
                    </MenuItem>
                  ))}

                  {isAdmin && adminMenuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        handleMenuClose();
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.icon}
                        {item.label}
                      </Box>
                    </MenuItem>
                  ))}

                  {user?.role === 'employer' && employerMenuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        handleMenuClose();
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}

                  <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 1, pt: 1 }}>
                    <MenuItem onClick={handleLogout}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                        <ExitToAppIcon />
                        Logout
                      </Box>
                    </MenuItem>
                  </Box>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ color: 'white', mr: 2 }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMenuClose}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}

              <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 1, pt: 1 }}>
                {isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleDashboard}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DashboardIcon />
                        Dashboard
                      </Box>
                    </MenuItem>
                    
                    {isAdmin && (
                      <MenuItem
                        component={RouterLink}
                        to="/admin"
                        onClick={handleMenuClose}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AdminPanelSettingsIcon />
                          Admin Panel
                        </Box>
                      </MenuItem>
                    )}
                    
                    <MenuItem onClick={handleLogout}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                        <ExitToAppIcon />
                        Logout
                      </Box>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      component={RouterLink}
                      to="/login"
                      onClick={handleMenuClose}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountCircleIcon />
                        Login
                      </Box>
                    </MenuItem>
                    <MenuItem
                      component={RouterLink}
                      to="/register"
                      onClick={handleMenuClose}
                    >
                      Sign Up
                    </MenuItem>
                  </>
                )}
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;