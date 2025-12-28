import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ message = 'Loading...', size = 40, fullScreen = false }) => {
  const loaderContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.paper',
          zIndex: 9999
        }}
      >
        {loaderContent}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 8
      }}
    >
      {loaderContent}
    </Box>
  );
};

export default Loader;