import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import StationMonitor from './pages/StationMonitor';

const Layout = ({ children, onLogout }) => (
    <div className="flex min-h-screen bg-slate-50">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 ml-64">
            {children}
        </main>
    </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const auth = localStorage.getItem('manager_auth');
      if (auth) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
      setIsAuthenticated(true);
      localStorage.setItem('manager_auth', 'true');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('manager_auth');
  };

  return (
    <Router>
        <Toaster position="top-right" />
        <Routes>
            <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            
            <Route 
                path="/dashboard" 
                element={
                    isAuthenticated ? (
                        <Layout onLogout={handleLogout}>
                            <Dashboard />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                } 
            />
            <Route 
                path="/analytics" 
                element={
                    isAuthenticated ? (
                        <Layout onLogout={handleLogout}>
                            <Analytics />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                } 
            />
            <Route 
                path="/station-monitor" 
                element={
                    isAuthenticated ? (
                        <Layout onLogout={handleLogout}>
                            <StationMonitor />
                        </Layout>
                    ) : (
                        <Navigate to="/" />
                    )
                } 
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
  );
}

export default App;
