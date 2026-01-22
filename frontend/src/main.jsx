import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AboutCaelum from "./components/AboutCaelum.jsx";

import LifeProtection from "./pages/services/protection-health/LifeProtection.jsx";
import HealthServices from "./pages/services/protection-health/HealthServices.jsx";
import Savings from "./pages/services/savings-investments/Savings.jsx";
import FNAHomePage from "./pages/FNAHomePage.jsx";
import Education from "./pages/services/savings-investments/Education.jsx";
import Retirement from "./pages/services/savings-investments/Retirement.jsx";
import OurServices from "./pages/services/services-deets/OurServices.jsx";
import LifeProHealth from "./pages/services/yes_services/LifeProHealth.jsx";
import SavEdRe from "./pages/services/yes_services/SavEdRe.jsx";
import LifeProtectionDeets from "./pages/services/services-deets/LifeProtectionDeets";
import HealthDeets from "./pages/services/services-deets/HealthDeets.jsx";
import AppointmentForm from "./pages/AppointmentForm.jsx";
import EducationDeets from "./pages/services/services-deets/EducationDeets.jsx";
import RetirementDeets from "./pages/services/services-deets/RetirementDeets.jsx";
import SavingsDeets from "./pages/services/services-deets/SavingsDeets.jsx";
import Door from "./pages/services/yes_services/Door.jsx";
<<<<<<< HEAD
import Questions from "./pages/corporate/Questions.jsx";
=======
import HomePage from "./pages/corporate/HomePage";
>>>>>>> 65f0588 (Update HomePage with features section, hover effects, and styling improvements)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<FNAHomePage />} />
        <Route path="/FNA/Homepage" element={<FNAHomePage />} />
        <Route path="/FNA/AppointmentForm" element={<AppointmentForm />} />
        <Route path="/about" element={<AboutCaelum />} />

        {/* If user chose yes */}
        <Route path="/FNA/door" element={<Door />} />

        {/* Services 1 */}
        <Route path="/services/yes_services/LifeProHealth" element={<LifeProHealth />} /> 
        
        {/* Services 2 */}
        <Route path="/services/yes_services/SavEdRe" element={<SavEdRe />} />    

        {/* Services Questionnaire */}
        <Route path="/services/protection-health/HealthServices" element={<HealthServices />} />
        <Route path="/services/savings-investments/Savings" element={<Savings />} />
        <Route path="/services/protection-health/LifeProtection" element={<LifeProtection />} />
        <Route path="/services/savings-investments/Education" element={<Education />} />
        <Route path="/services/savings-investments/Retirement" element={<Retirement />} />
        

        {/* If user chose no */} 
        <Route path="/FNA/OurServices" element={<OurServices />} />
        <Route path="/FNA/life-protection/details" element={<LifeProtectionDeets />} />
        <Route path="/FNA/health/details" element={<HealthDeets />} />
        <Route path="/FNA/education/details" element={<EducationDeets />} />
        <Route path="/FNA/retirement/details" element={<RetirementDeets />} />
        <Route path="/FNA/savings/details" element={<SavingsDeets />} />

<<<<<<< HEAD
        {/* Corporate FNA */}
        <Route path="/fna/corporate/questions" element={<Questions />} />

        {/* Components for FNA Results PDF Export */}
=======
        
        {/* FNA Corporate - Financial Wellness Assessment */}
        <Route path="/financial-assessment" element={<HomePage />} />

>>>>>>> 65f0588 (Update HomePage with features section, hover effects, and styling improvements)
      </Routes>  
      <Footer /> 
    </BrowserRouter>
  </React.StrictMode>
);
