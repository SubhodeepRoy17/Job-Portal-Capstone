import api from './api';

export const jobService = {
  // Get all jobs
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/jobs?${params}`);
    return response.data;
  },

  // Get single job
  getJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Apply for job
  applyForJob: async (id) => {
    const response = await api.post(`/jobs/${id}/apply`);
    return response.data;
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await api.get('/users/applications');
    return response.data;
  }
};