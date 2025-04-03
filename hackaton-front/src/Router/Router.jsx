import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Nav from '../Components/Nav/Nav';
import Footer from '../Components/Footer/Footer';

import HomePage from '../Pages/HomePage';
import Profile from '../Pages/Profile';
import Budget from '../Pages/Budget';
import Targets from '../Pages/Targets';
import Notifications from '../Pages/Notifications';
import Analyses from '../Pages/Analyses';

import Login from '../Components/Login/Login';

export default function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);


  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };


  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Загрузка...</div>;
    }
    
    if (!isAuthenticated) {
      setShowLogin(true);
      return null;
    }
    
    return children;
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <BrowserRouter>
        <Nav setShowLogin={setShowLogin} />
      {showLogin ? (
        <Login 
          setShowLogin={setShowLogin} 
          onLoginSuccess={handleLoginSuccess} 
        />
      ) : null}
    <main className="content">
      <Routes>
        <Route path="/" element={
            <HomePage setShowLogin={setShowLogin} isAuthenticated={isAuthenticated} onLoginSuccess={handleLoginSuccess}/>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        } />
        <Route path="/targets" element={
          <ProtectedRoute>
            <Targets />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/analyses" element={
          <ProtectedRoute>
            <Analyses />
          </ProtectedRoute>
        } />
        <Route path="/analyse" element={
          <ProtectedRoute>
            <Analyses />
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <Navigate to="/" />
        } />
      </Routes>
      <Footer />
      </main>
    </BrowserRouter>
  );
}