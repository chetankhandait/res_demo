import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { StationProvider, useStation } from './context/StationContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { station } = useStation();
  if (!station) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
    const { station } = useStation();
    
    return (
        <Routes>
            <Route 
                path="/" 
                element={station ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
}

function App() {
  return (
    <Router>
      <SocketProvider>
        <StationProvider>
            <AppContent />
            <Toaster position="top-right" />
        </StationProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
