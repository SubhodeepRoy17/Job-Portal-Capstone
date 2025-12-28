import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from './Loader';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('=== PrivateRoute Debug ===');
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Allowed Roles:', allowedRoles);
  console.log('User Role:', user?.role);
  console.log('==========================');

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log(`Role ${user?.role} not allowed. Allowed: ${allowedRoles}`);
    return <Navigate to="/dashboard" />;
  }

  console.log('Access granted');
  return children;
};

export default PrivateRoute;