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
      <div className="navigation">
        <Link to="/services/protection-health" className="back-link">← Back to Protection & Health Services</Link>
      </div>
    </div>
  );
}

export default HealthServices;