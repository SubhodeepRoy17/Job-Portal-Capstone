import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  company: yup.string().required('Company is required'),
  description: yup.string().required('Description is required'),
  requirements: yup.string().required('Requirements are required'),
  location: yup.string().required('Location is required'),
  salaryMin: yup
    .number()
    .required('Minimum salary is required')
    .min(0, 'Salary must be positive'),
  salaryMax: yup
    .number()
    .required('Maximum salary is required')
    .min(yup.ref('salaryMin'), 'Maximum salary must be greater than minimum'),
  jobType: yup.string().required('Job type is required'),
  experienceLevel: yup.string().required('Experience level is required'),
  category: yup.string().required('Category is required'),
  expiresAt: yup.string().required('Expiration date is required')
});

const JobForm = ({ initialData = {}, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData
  });

  const jobTypes = [
    'full-time',
    'part-time',
    'contract',
    'internship',
    'remote'
  ];

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

  const handleFormSubmit = (data) => {
    const jobData = {
      ...data,
      salary: {
        min: data.salaryMin,
        max: data.salaryMax,
        currency: 'USD'
      },
      requirements: data.requirements.split('\n').filter(req => req.trim())
    };
    
    delete jobData.salaryMin;
    delete jobData.salaryMax;
    
    onSubmit(jobData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Typography variant="h6" gutterBottom>
        Job Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Job Title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company"
            {...register('company')}
            error={!!errors.company}
            helperText={errors.company?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Minimum Salary"
            type="number"
            {...register('salaryMin')}
            error={!!errors.salaryMin}
            helperText={errors.salaryMin?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Maximum Salary"
            type="number"
            {...register('salaryMax')}
            error={!!errors.salaryMax}
            helperText={errors.salaryMax?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Job Type"
            {...register('jobType')}
            error={!!errors.jobType}
            helperText={errors.jobType?.message}
            disabled={loading}
          >
            {jobTypes.map(type => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Experience Level"
            {...register('experienceLevel')}
            error={!!errors.experienceLevel}
            helperText={errors.experienceLevel?.message}
            disabled={loading}
          >
            {experienceLevels.map(level => (
              <MenuItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Category"
            {...register('category')}
            error={!!errors.category}
            helperText={errors.category?.message}
            disabled={loading}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Requirements (one per line)"
            multiline
            rows={4}
            {...register('requirements')}
            error={!!errors.requirements}
            helperText={errors.requirements?.message}
            disabled={loading}
            placeholder="Enter each requirement on a new line"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Expiration Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('expiresAt')}
            error={!!errors.expiresAt}
            helperText={errors.expiresAt?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Job'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobForm;