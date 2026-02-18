// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UpcomingContests from './pages/UpComingContests';
import PastContests from './pages/PastContests';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import SystemDesign from './pages/SystemDesign';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-gray-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Router>
        {isAuthenticated && <Navbar />}
        <main className="w-full">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/upcoming" 
              element={isAuthenticated ? <UpcomingContests /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/past" 
              element={isAuthenticated ? <PastContests /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/system-design" 
              element={isAuthenticated ? <SystemDesign /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/system-design/:slug" 
              element={isAuthenticated ? <SystemDesign /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/forgot-password" 
              element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reset-password" 
              element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;