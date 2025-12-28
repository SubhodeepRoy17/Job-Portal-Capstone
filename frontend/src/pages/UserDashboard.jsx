import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from './Dashboard';

// UserDashboard is just an alias for Dashboard for better routing
const UserDashboard = () => {
  const { user } = useAuth();
  
  return <Dashboard />;
};

export default UserDashboard;