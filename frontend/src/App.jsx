import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobsPage from './pages/JobsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#7c3aed',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Toaster position="top-right" />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/jobs" element={
                <PrivateRoute>
                  <JobsPage />
                </PrivateRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;