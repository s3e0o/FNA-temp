import React from 'react';

const HomePage = () => {
  const handleBeginJourney = () => {
    console.log('Starting assessment...');
  };

  return (
    <div className="fna-corporate-page">
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title header-font">
            <span className="hero-title-black">Discover Your</span><br />
            <span className="hero-title-blue"> Financial Wellness</span><br />
            <span className="hero-title-black"> Score</span>
          </h1>
          
          <p className="hero-description axiforma-regular">
            Take our personalized quiz to uncover insights about your financial health. 
            Get a detailed analytics dashboard with specific metrics and actionable recommendations.
          </p>
        </div>
        
        <div className="hero-actions">
          <button 
            className="assessment-btn"
            onClick={handleBeginJourney}
          >
            <span>Start Your Assessment</span>
            <span className="btn-arrow">&rarr;</span>
          </button>
                    
          <div className="time-indicator">
            <svg className="time-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Takes 5 minutes
          </div>
          
          <div className="inline-stats">
            <div className="stat-box">
              <div className="stat-number stat-counter">50K+</div>
              <div className="stat-label">Assessment Completed</div>
            </div>
            <div className="stat-box">
              <div className="stat-number stat-counter">87%</div>
              <div className="stat-label">Improvement Rate</div>
            </div>
            <div className="stat-box">
              <div className="stat-number stat-counter">4.9</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <h2 className="homepage-section-title">Why Take the Assessment?</h2>
        <p className="section-description">Our comprehensive quiz evaluates multiple dimensions of your financial life to provide a complete picture of your financial wellness.</p>
        
        <div className="features-container">
          <div className="feature-box">
            <svg className="feature-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#003366" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h3 className="feature-title">Personalized Assessment</h3>
            <p className="feature-description">Questions tailored to your unique financial situation and goals</p>
          </div>
          
          <div className="feature-box">
            <svg className="feature-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#003366" strokeWidth="2">
              <path d="M18 20V10"></path>
              <path d="M12 20V4"></path>
              <path d="M6 20v-6"></path>
            </svg>
            <h3 className="feature-title">Data-Driven Insights</h3>
            <p className="feature-description">Get specific scores and metrics across multiple financial dimensions</p>
          </div>
          
          <div className="feature-box">
            <svg className="feature-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#003366" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="feature-title">Actionable Recommendations</h3>
            <p className="feature-description">Receive clear, prioritized steps to improve your financial health</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2 className="homepage-section-title header-font">How It Works</h2>
        
        <div className="steps-grid">
          <div className="step step-connector">
            <div className="step-number-subtle">01</div>
            <div className="step-content">
              <h3 className="step-title">Answer Questions</h3>
              <p className="step-description">
                Respond to personalized questions about your financial habits and goals
              </p>
            </div>
          </div>
          
          <div className="step step-connector">
            <div className="step-number-subtle">02</div>
            <div className="step-content">
              <h3 className="step-title">Get Your Score</h3>
              <p className="step-description">
                Receive a detailed breakdown of your financial wellness across key areas
              </p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number-subtle">03</div>
            <div className="step-content">
              <h3 className="step-title">Take Action</h3>
              <p className="step-description">
                Follow custom made recommendations to improve your financial health
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <button 
          className="begin-journey-btn"
          onClick={handleBeginJourney}
        >
          <span>Begin Your Journey</span>
          <span className="btn-arrow">&rarr;</span>
        </button>
      </section>
    </div>
  );
};

export default HomePage;