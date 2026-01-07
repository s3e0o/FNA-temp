import React, { useState } from 'react';

function LifeProtection() {
  const [yearsProviding, setYearsProviding] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Calculate logic here
    console.log({ yearsProviding, numberInput });
  };

  return (
    <div className="container">
      <header>
        <h1>LIFE PROTECTION</h1>
      </header>

      <form onSubmit={handleSubmit} className="questionnaire-form">
        {/* Question 1 */}
        <div className="question-group">
          <h2>Question 1</h2>
          <p className="question-text">
            How many years will you be providing for your family<br />
            (ie. until your children become financially independent) years?
          </p>
          <input
            type="number"
            value={yearsProviding}
            onChange={(e) => setYearsProviding(e.target.value)}
            className="number-input"
            placeholder="Enter number of years"
          />
        </div>

        {/* Question 2 */}
        <div className="question-group">
          <h2>Question 2</h2>
          <p className="question-text">Enter a Number:</p>
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            className="number-input"
            placeholder="Enter a number"
          />
        </div>

        {/* Question 3 - You can add more questions here */}
        <div className="question-group">
          <h2>Question 3</h2>
          <p className="question-text">Additional question would appear here...</p>
        </div>

        <hr className="divider" />

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Calculate Protection Needs
        </button>
      </form>

      {/* Contacts Section */}
      <section className="contacts-section">
        <h2>CONTACTS</h2>
        <address>
          <p>The Upper Class Tower Queson Avenue,</p>
          <p>Quezon City, Metro Manila</p>
          <p>admin@coelumfinancialsolutions.com</p>
          <p>0856465484</p>
        </address>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <h2>QUICK LINKS</h2>
        <div className="links">
          <a href="#" className="link">Financial Needs Analysis</a>
          <a href="#" className="link">Income Simulation Tracker</a>
        </div>
      </section>

      {/* Footer */}
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

export default LifeProtection;