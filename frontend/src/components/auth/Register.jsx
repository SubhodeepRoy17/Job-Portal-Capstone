import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Grid
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  role: yup
    .string()
    .oneOf(['user', 'employer'], 'Invalid role selected')
    .required('Please select a role'),
  address: yup
    .string()
    .max(200, 'Address cannot exceed 200 characters')
    .optional()
});

const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'user'
    }
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    
    // Remove confirmPassword from data
    const { confirmPassword, ...userData } = data;
    
    const result = await authRegister(userData);
    
    if (result.success) {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } else {
      setError(result.error);
      toast.error(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join our job portal community
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  margin="normal"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  margin="normal"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  margin="normal"
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Account Type"
                  margin="normal"
                  {...register('role')}
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  disabled={loading}
                >
                  <MenuItem value="user">Job Seeker</MenuItem>
                  <MenuItem value="employer">Employer</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  margin="normal"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={loading}
                  placeholder="10-digit number"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  margin="normal"
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="text" size="small">
                    Login here
                  </Button>
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;