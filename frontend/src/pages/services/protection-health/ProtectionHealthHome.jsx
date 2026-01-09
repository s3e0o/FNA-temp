import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

function ProtectionHealthHome() {
  useEffect(() => {
      document.title = "Financial Needs Analysis | Protection & Health ";
    }, []);

  return (
    <div className="container">
      <header>
        <h1>Protection and Health Services</h1>
        <p className="subtitle">Choose a service to analyze your financial needs</p>
      </header>

      <div className="services-grid">
        <Link to="/services/protection-health/life-protection" className="service-card">
          <div className="card-content">
            <h2>LIFE PROTECTION</h2>
            <p>Calculate your life insurance needs and coverage requirements</p>
            <div className="arrow">→</div>
          </div>
        </Link>
        
        <Link to="/services/protection-health/health-services" className="service-card">
          <div className="card-content">
            <h2>HEALTH SERVICES</h2>
            <p>Health insurance and medical coverage planning</p>
            <div className="arrow">→</div>
          </div>
        </Link>
      </div>

      <div className="navigation">
        <Link to="/pick-your-door" className="back-link">← Back to Doors</Link>
      </div>
    </div>
  );
}

export default ProtectionHealthHome;