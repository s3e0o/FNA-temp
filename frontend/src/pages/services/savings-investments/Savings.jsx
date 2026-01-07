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
      <div className="navigation">
        <Link to="/services/savings-investments" className="back-link">← Back to Savings & Investments</Link>
      </div>
    </div>
  );
}

export default Savings;