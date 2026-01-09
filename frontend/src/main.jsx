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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<FNAHomePage />} />
        <Route path="/FNA/Homepage" element={<FNAHomePage />} />
        <Route path="/services/protection-health/HealthServices" element={<HealthServices />} />
        <Route path="/services/savings-investments/savings" element={<Savings />} />
        <Route path="/services/protection-health/LifeProtection" element={<LifeProtection />} />
        <Route path="/services/protection-health/health-services/HealthServices" element={<HealthServices />} />
        <Route path="/services/savings-investments/Retirement" element={<SavingsInvestmentsHome />} />
        <Route path="/services/savings-investments/ProtectionHealthHome" element={<ProtectionHealthHome />} />

        {/* If user chose no */}
        {/* <Route path="/services/savings-investments/education" element={<Education />} />
        <Route path="/services/savings-investments/retirement" element={<Retirement />} /> */}
        <Route path="/services/services-deets/OurServices" element={<OurServices />} />
      </Routes>  
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
