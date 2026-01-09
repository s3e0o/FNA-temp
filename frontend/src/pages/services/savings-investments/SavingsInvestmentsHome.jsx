import React from 'react';
import { Link } from 'react-router-dom';

function SavingsInvestmentsHome() {
  useEffect(() => {
      document.title = "Financial Needs Analysis | Savings & Investments ";
    }, []);

  return (
    <div className="container">
      <header>
        <h1>Savings and Investments Services</h1>
        <p className="subtitle">Choose a service to analyze your financial needs</p>
      </header>

      <div className="services-grid">
        <Link to="/services/savings-investments/savings" className="service-card">
          <div className="card-content">
            <h2>SAVINGS</h2>
            <p>Short-term and emergency savings planning</p>
            <div className="arrow">→</div>
          </div>
        </Link>
        
        <Link to="/services/savings-investments/education" className="service-card">
          <div className="card-content">
            <h2>EDUCATION</h2>
            <p>Education fund planning for children's future</p>
            <div className="arrow">→</div>
          </div>
        </Link>
        
        <Link to="/services/savings-investments/retirement" className="service-card">
          <div className="card-content">
            <h2>RETIREMENT</h2>
            <p>Retirement planning and pension calculations</p>
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

export default SavingsInvestmentsHome;