import { format } from 'date-fns';

// Format salary display
export const formatSalary = (min, max, currency = 'USD') => {
  return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
};

// Format numbers with commas
export const formatNumber = (num) => {
  return num?.toLocaleString('en-US') || '0';
};

// Format date
export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return 'N/A';
  
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay > 7) {
    return formatDate(dateString);
  } else if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Get color based on status
export const getStatusColor = (status) => {
  const colors = {
    'pending': 'default',
    'reviewed': 'info',
    'shortlisted': 'primary',
    'rejected': 'error',
    'active': 'success',
    'inactive': 'warning',
    'draft': 'default'
  };
  
  return colors[status?.toLowerCase()] || 'default';
};

// Get label for experience level
export const getExperienceLabel = (level) => {
  const labels = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'executive': 'Executive'
  };
  
  return labels[level] || level;
};

// Get label for job type
export const getJobTypeLabel = (type) => {
  const labels = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship',
    'remote': 'Remote'
  };
  
  return labels[type] || type;
};

// Calculate days until expiration
export const getDaysUntilExpiration = (expiryDate) => {
  if (!expiryDate) return 0;
  
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Validate URL
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Create query string from object
export const createQueryString = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  return queryParams.toString();
};

// Parse query string to object
export const parseQueryString = (queryString) => {
  const params = {};
  const queryParams = new URLSearchParams(queryString);
  
  for (const [key, value] of queryParams.entries()) {
    params[key] = value;
  }
  
  return params;
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename?.split('.').pop()?.toLowerCase() || '';
};

// Validate file type
export const isValidFileType = (filename, allowedTypes = ['pdf', 'doc', 'docx']) => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};