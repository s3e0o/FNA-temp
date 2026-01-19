import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectionHealthHome from './pages/services/protection-health/ProtectionHealthHome.jsx';
import LifeProtection from './pages/services/protection-health/LifeProtection.jsx';
import HealthServices from './pages/services/protection-health/HealthServices.jsx';
import SavingsInvestmentsHome from './pages/services/savings-investments/SavingsInvestmentsHome.jsx';
import Savings from './pages/services/savings-investments/Savings.jsx';
import Education from './pages/services/savings-investments/Education.jsx';
import Retirement from './pages/services/savings-investments/Retirement.jsx';
import FNAHomePage from './pages/services/financial-needs-analysis/FNAHomePage.jsx';
import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Routes>{/* routes */}</Routes>
      <Footer />
    </>
  );


  return (
    
    <Router>
      <div className="App">
        <Routes>
          {/* Door 1: Protection & Health */}
          <Route path="/services/protection-health" element={<ProtectionHealthHome />} />
          <Route path="/services/protection-health/life-protection" element={<LifeProtection />} />
          <Route path="/services/protection-health/health-services" element={<HealthServices />} />
          
          {/* Door 2: Savings & Investments */}
          <Route path="/services/savings-investments" element={<SavingsInvestmentsHome />} />
          <Route path="/services/savings-investments/savings" element={<Savings />} />
          <Route path="/services/savings-investments/education" element={<Education />} />
          <Route path="/services/savings-investments/retirement" element={<Retirement />} />

          {/* FNA HomePage*/}
          <Route path="/FNA/Homepage" element={<FNAHomePage />} />
          <Route path="/" element={<FNAHomePage />} />
          
          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#ef4444' }}>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
        Return to Homepage
      </a>
    </div>
  );
}

export default App;