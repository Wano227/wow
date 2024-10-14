import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import logoAnimation from './Invoice.gif'; // Updated to use a relative path

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/invoice');
    }, 5000); // Wait for 5 seconds before routing to invoice page
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="logo-container">
        <img src={logoAnimation} alt="Company Logo" className="company-logo" />
        <h1>Your Company Name</h1>
        <div className="loading-animation">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;