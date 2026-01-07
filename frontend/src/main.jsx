import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectionHealthHome from "./pages/services/protection-health/ProtectionHealthHome.jsx";
import LifeProtection from "./pages/services/protection-health/LifeProtection.jsx";
import HealthServices from "./pages/services/protection-health/HealthServices.jsx";
import Savings from "./pages/services/savings-investments/Savings.jsx";
import SavingsInvestmentsHome from "./pages/services/savings-investments/SavingsInvestmentsHome.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar/>
      <ProtectionHealthHome/>
      <LifeProtection/>
      <HealthServices/>
      <SavingsInvestmentsHome/>
      <Savings/>
      <Footer/>
    </BrowserRouter>
  </React.StrictMode>
)

