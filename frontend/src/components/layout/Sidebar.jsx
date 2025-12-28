import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const Sidebar = ({ open, onClose }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInitials = () => {
    if (!user) return '';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userMenuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['user', 'employer']
    },
    {
      title: 'My Profile',
      icon: <PersonIcon />,
      path: '/dashboard/profile',
      roles: ['user', 'employer']
    },
    {
      title: 'Browse Jobs',
      icon: <WorkIcon />,
      path: '/jobs',
      roles: ['user', 'employer', 'admin']
    },
    {
      title: 'My Applications',
      icon: <AssignmentIcon />,
      path: '/dashboard/applications',
      roles: ['user']
    },
  ];

  const employerMenuItems = [
    {
      title: 'Post New Job',
      icon: <PostAddIcon />,
      path: '/jobs/new',
      roles: ['employer', 'admin']
    },
    {
      title: 'My Jobs',
      icon: <WorkIcon />,
      path: '/dashboard/my-jobs',
      roles: ['employer', 'admin']
    },
  ];

  const adminMenuItems = [
    {
      title: 'Admin Dashboard',
      icon: <AdminPanelSettingsIcon />,
      path: '/admin',
      roles: ['admin']
    },
    {
      title: 'Manage Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
      roles: ['admin']
    },
    {
      title: 'Manage All Jobs',
      icon: <WorkIcon />,
      path: '/admin/jobs',
      roles: ['admin']
    },
  ];

  const settingsMenuItems = [
    {
      title: 'Settings',
      icon: <SettingsIcon />,
      path: '/dashboard/settings',
      roles: ['user', 'employer', 'admin']
    },
  ];

  const getMenuItems = () => {
    const items = [];
    
    // Add user menu items
    items.push(
      ...userMenuItems.filter(item => item.roles.includes(user?.role))
    );
    
    // Add employer menu items if applicable
    if (user?.role === 'employer' || isAdmin) {
      items.push(...employerMenuItems);
    }
    
    // Add admin menu items if admin
    if (isAdmin) {
      items.push(...adminMenuItems);
    }
    
    // Add settings
    items.push(...settingsMenuItems);
    
    return items;
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'error',
      'employer': 'warning',
      'user': 'success'
    };
    return colors[role] || 'default';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* User Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              mr: 2
            }}
          >
            {getUserInitials()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
            <Chip
              label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              color={getRoleColor(user?.role)}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Navigation Menu */}
        <List sx={{ flexGrow: 1 }}>
          {getMenuItems().map((item) => (
            <ListItem
              key={item.title}
              button
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Footer Section */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            Job Portal v1.0
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            © {new Date().getFullYear()} All rights reserved
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;