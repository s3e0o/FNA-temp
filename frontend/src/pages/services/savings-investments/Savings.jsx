import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Savings() {
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your calculation logic here
    console.log('Monthly savings goal:', monthlySavingsGoal);
  };

  return (
    <div className="container">
      <header>
        <h1>SAVINGS PLANNING</h1>
      </header>

      <form onSubmit={handleSubmit} className="questionnaire-form">
        <div className="question-group">
          <h2>Question 1</h2>
          <p className="question-text">What is your monthly savings goal?</p>
          <input 
            type="number" 
            value={monthlySavingsGoal}
            onChange={(e) => setMonthlySavingsGoal(e.target.value)}
            className="number-input" 
            placeholder="Enter amount" 
          />
        </div>

        <hr className="divider" />

        <button type="submit" className="submit-btn">
          Calculate Savings Plan
        </button>
      </form>

      {/* Same footer structure */}
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
          <Link to="/services/savings-investments/savings" className="link">Financial Needs Analysis</Link>
          <Link to="#" className="link">Income Simulation Tracker</Link>
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
        <Link to="/services/savings-investments" className="back-link">← Back to Savings & Investments</Link>
      </div>
    </div>
  );
}

export default Savings;