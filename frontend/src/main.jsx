import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import ProtectionHealthHome from "./pages/services/protection-health/ProtectionHealthHome.jsx";
import LifeProtection from "./pages/services/protection-health/LifeProtection.jsx";
import HealthServices from "./pages/services/protection-health/HealthServices.jsx";
import SavingsInvestmentsHome from "./pages/services/savings-investments/SavingsInvestmentsHome.jsx";
import Savings from "./pages/services/savings-investments/Savings.jsx";
import FNAHomePage from "./pages/FNAHomePage.jsx";
// import Education from "./pages/services/savings-investments/Education.jsx";
// import Retirement from "./pages/services/savings-investments/Retirement.jsx";
import OurServices from "./pages/services/services-deets/OurServices.jsx";
import LifeProHealth from "./pages/services/yes_services/LifeProHealth.jsx";
import SavEdRe from "./pages/services/yes_services/SavEdRe.jsx";
import LifeProtectionDeets from "./pages/services/services-deets/LifeProtectionDeets";
import HealthDeets from "./pages/services/services-deets/HealthDeets.jsx";
import AppointmentForm from "./pages/AppointmentForm.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<FNAHomePage />} />
        <Route path="/FNA/Homepage" element={<FNAHomePage />} />
        <Route path="/FNA/AppointmentForm" element={<AppointmentForm />} />

        {/* If user chose yes */}
        <Route path="/services/protection-health/HealthServices" element={<HealthServices />} />
        <Route path="/services/savings-investments/savings" element={<Savings />} />
        <Route path="/services/protection-health/LifeProtection" element={<LifeProtection />} />
        <Route path="/services/protection-health/health-services/HealthServices" element={<HealthServices />} />
        <Route path="/services/savings-investments/Retirement" element={<SavingsInvestmentsHome />} />
        <Route path="/services/savings-investments/ProtectionHealthHome" element={<ProtectionHealthHome />} />
        <Route path="/services/yes_services/LifeProHealth" element={<LifeProHealth />} /> 
        <Route path="/services/yes_services/SavEdRe" element={<SavEdRe />} />     

        {/* If user chose no */} 
        <Route path="/FNA/OurServices" element={<OurServices />} />
        <Route path="/FNA/life-protection/details" element={<LifeProtectionDeets />} />
        <Route path="/FNA/health/details" element={<HealthDeets />} />

      </Routes>  
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
