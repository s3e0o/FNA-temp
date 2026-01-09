import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LifeProtection() {
  const [yearsProviding, setYearsProviding] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Calculate logic here
    console.log({ yearsProviding, numberInput });
  };

  useEffect(() => {
      document.title = "Financial Needs Analysis | Life Protection ";
    }, []);

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

      <div className="navigation">
        <Link to="/services/protection-health" className="back-link">← Back to Protection & Health Services</Link>
      </div>
    </div>
  );
}

export default LifeProtection;