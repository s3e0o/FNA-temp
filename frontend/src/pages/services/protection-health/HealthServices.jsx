import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HealthServices() {
  const [healthQuestion1, setHealthQuestion1] = useState('');
  const [healthQuestion2, setHealthQuestion2] = useState('');

  return (
    <div className="container">
      <header>
        <h1>HEALTH SERVICES</h1>
      </header>

      <form className="questionnaire-form">
        <div className="question-group">
          <h2>Question 1</h2>
          <p className="question-text">What is your current health insurance coverage?</p>
          <input 
            type="text" 
            value={healthQuestion1}
            onChange={(e) => setHealthQuestion1(e.target.value)}
            className="number-input" 
            placeholder="Enter details" 
          />
        </div>

        <div className="question-group">
          <h2>Question 2</h2>
          <p className="question-text">Any pre-existing medical conditions?</p>
          <input 
            type="text" 
            value={healthQuestion2}
            onChange={(e) => setHealthQuestion2(e.target.value)}
            className="number-input" 
            placeholder="Enter details" 
          />
        </div>

        <hr className="divider" />

        <button type="submit" className="submit-btn">
          Analyze Health Coverage
        </button>
      </form>

      {/* Same footer as Life Protection */}
      <section className="contacts-section">
        <h2>CONTACTS</h2>
        <address>
          <p>The Upper Class Tower Queson Avenue,</p>
          <p>Quezon City, Metro Manila</p>
          <p>admin@coelumfinancialsolutions.com</p>
          <p>0856465484</p>
        </address>
      </section>

      <section className="quick-links">
        <h2>QUICK LINKS</h2>
        <div className="links">
          <a href="#" className="link">Financial Needs Analysis</a>
          <a href="#" className="link">Income Simulation Tracker</a>
        </div>
      </section>

      <footer className="copyright-footer">
        <h2>COPYRIGHT CAELUM 2025</h2>
        <p className="footer-text">
          This digital platform provides general information exclusively to content levels,<br />
          creative personalised theories or investment caveats and users should ensure<br />
          a qualified advisor for specific guidance. By accessing this site, users consent to<br />
          our files collection practices as detailed in our Privacy Policy, and all interactions,<br />
          including those with the digital assistant, are logged for quality assurance and<br />
          services improvement.
        </p>
      </footer>

      <div className="navigation">
        <Link to="/services/protection-health" className="back-link">← Back to Protection & Health Services</Link>
      </div>
    </div>
  );
}

export default HealthServices;