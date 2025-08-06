import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MySessions from './pages/MySessions';
import SessionEditor from './pages/SessionEditor';
import SessionView from './pages/SessionView';
import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/my-sessions" 
            element={
              <ProtectedRoute>
                <MySessions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/session/new" 
            element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/session/edit/:id" 
            element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } 
          />
          <Route path="/session/:id" element={<SessionView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 