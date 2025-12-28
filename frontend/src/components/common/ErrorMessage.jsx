import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  error, 
  onRetry,
  severity = 'error',
  fullWidth = true 
}) => {
  const getErrorDetails = () => {
    if (!error) return message;
    
    if (typeof error === 'string') return error;
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return message;
  };

  const errorDetails = getErrorDetails();

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', my: 2 }}>
      <Alert 
        severity={severity}
        icon={<ErrorOutlineIcon fontSize="large" />}
        sx={{ 
          borderRadius: 2,
          ...(severity === 'error' && {
            bgcolor: 'error.lighter',
            color: 'error.darker',
            border: 1,
            borderColor: 'error.light'
          }),
          ...(severity === 'warning' && {
            bgcolor: 'warning.lighter',
            color: 'warning.darker',
            border: 1,
            borderColor: 'warning.light'
          }),
          ...(severity === 'info' && {
            bgcolor: 'info.lighter',
            color: 'info.darker',
            border: 1,
            borderColor: 'info.light'
          })
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {severity === 'error' && 'Error'}
          {severity === 'warning' && 'Warning'}
          {severity === 'info' && 'Information'}
        </AlertTitle>
        
        <Box sx={{ mb: onRetry ? 2 : 0 }}>
          {errorDetails}
        </Box>
        
        {onRetry && (
          <Button
            variant="outlined"
            color={severity}
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ 
              mt: 1,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Try Again
          </Button>
        )}
      </Alert>
      
      {/* Show additional error details in development */}
      {process.env.NODE_ENV === 'development' && error?.response?.data?.errors && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" gutterBottom>
            Debug Details:
          </Typography>
          <pre style={{ margin: 0, fontSize: '0.75rem', overflow: 'auto' }}>
            {JSON.stringify(error.response.data.errors, null, 2)}
          </pre>
        </Box>
      )}
    </Box>
  );
};

// Add missing Typography import
const Typography = ({ children, ...props }) => (
  <span style={{ fontFamily: 'inherit', ...props.style }} {...props}>
    {children}
  </span>
);

export default ErrorMessage;