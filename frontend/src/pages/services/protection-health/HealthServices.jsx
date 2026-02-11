import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import HealthResultPDF from "../../../components/pdf/HealthResultPDF.jsx";

function HealthServices() {
  const formatCurrency = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "0.00";
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [healthQuestion1, setHealthQuestion1] = useState("");
  const [healthQuestion2, setHealthQuestion2] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  const [appointmentErrors, setAppointmentErrors] = useState({});

  const resultRef = useRef(null);

  useEffect(() => {
    document.title = "Health Services | Financial Needs Analysis";
  }, []);

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep >= 1) {
      if (!healthQuestion1.trim()) {
        newErrors.question1 = "Health fund amount is required.";
      } else if (isNaN(parseFloat(healthQuestion1)) || parseFloat(healthQuestion1) < 0) {
        newErrors.question1 = "Please enter a valid non-negative amount for health fund.";
      }
    }

    if (currentStep >= 2) {
      if (!healthQuestion2.trim()) {
        newErrors.question2 = "Monthly contribution amount is required.";
      } else if (isNaN(parseFloat(healthQuestion2)) || parseFloat(healthQuestion2) < 0) {
        newErrors.question2 = "Please enter a valid non-negative amount for monthly contribution.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        setSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const computeResult = () => {
    const A = parseFloat(healthQuestion1) || 0;
    const B = parseFloat(healthQuestion2) || 0;
    if (B === 0) return 0;
    const years = A / (12 * B);
    return years.toFixed(2);
  };

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 10;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 5, 5, width, height);
    pdf.save("Health-Services-Result.pdf");
  };

  const handleBookAppointment = () => setShowAppointmentForm(true);
  
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };
  
  const validateAppointment = () => {
    const newErrors = {};
    if (!appointmentData.name.trim()) newErrors.name = "Name is required.";
    if (!appointmentData.email.trim() || !/\S+@\S+\.\S+/.test(appointmentData.email))
      newErrors.email = "Valid email is required.";
    if (!appointmentData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!appointmentData.date) newErrors.date = "Preferred date is required.";
    if (!appointmentData.time) newErrors.time = "Preferred time is required.";
    setAppointmentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    if (validateAppointment()) {
      alert("Appointment booked successfully!");
      setShowAppointmentForm(false);
      setAppointmentData({ name: "", email: "", phone: "", date: "", time: "" });
    }
  };

  if (submitted) {
    const result = computeResult();

    if (showAppointmentForm) {
      return (
        <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          {/* Your existing appointment form */}
        </div>
      );
    }

    return (
      <>
        <HealthResultPDF
          ref={resultRef}
          healthFundNeeded={parseFloat(healthQuestion1) || 0}
          monthlyContribution={parseFloat(healthQuestion2) || 0}
          yearsToGoal={parseFloat(computeResult())}
        />

        <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <Link
            to="/FNA/door"
            className="relative inline-block text-[#395998] font-medium mb-4 ml-4
                        after:content-[''] after:absolute after:left-0 after:-bottom-1
                        after:w-0 after:h-[1.5px] after:bg-[#F4B43C]
                        after:transition-all after:duration-300
                        hover:after:w-full text-sm"
          >
            ← Back to Doors
          </Link>
          
          {/* Result container */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-5">
              {/* Title section */}
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-[#003266] mb-3">HEALTH SERVICES RESULT</h1>
                <button onClick={handleExportPDF} className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm">
                  Export to PDF
                </button>
              </div>

              {/* Result description */}
              <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
                <p className="text-base text-[#003266] text-center mb-5">
                  Number of years to reach your health fund goal:
                </p>

                {/* Result amount */}
                <div className="flex justify-center mb-5">
                  <div className="w-52 py-4 text-center text-xl font-bold border border-[#003266] rounded-lg bg-blue-50">
                    {result} year/s
                  </div>
                </div>

                {/* Summary section */}
                <div className="space-y-4 mb-5">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Health Fund Summary */}
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Health Fund Needed</h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        ₱{formatCurrency(parseFloat(healthQuestion1) || 0)}
                      </div>
                    </div>

                    {/* Monthly Contribution Summary */}
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Monthly Contribution</h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        ₱{formatCurrency(parseFloat(healthQuestion2) || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Calculation Explanation */}
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <h3 className="text-sm font-bold text-[#003266] mb-3 text-center">Calculation</h3>
                    <div className="text-center text-sm text-[#003266]">
                      <p>Years = Health Fund Needed ÷ (12 × Monthly Contribution)</p>
                      <p className="mt-2 font-semibold">
                        {formatCurrency(parseFloat(healthQuestion1) || 0)} ÷ (12 × {formatCurrency(parseFloat(healthQuestion2) || 0)}) = {result} years
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  <Link to="/FNA/AppointmentForm">
                    <button className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm">
                      Book Appointment
                    </button>
                  </Link>
                  <Link to="/FNA/OurServices">
                    <button className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm">
                      View Services
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Main outer container */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-5">
          {/* Progress Bar Container */}
          <div className="mb-5">
            <div className="relative">
              {/* Background track */}
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                {/* Progress fill - sliding bar */}
                <div 
                  className="h-full bg-[#003366] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                ></div>
              </div>
              
              {/* Step Labels */}
              <div className="flex justify-between mt-4">
                {["Question 1", "Question 2", "Review"].map((label, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {/* Step indicator dot */}
                    <div 
                      className={`w-3 h-3 rounded-full mb-1.5 ${currentStep > index + 1 ? "bg-[#003366]" : currentStep === index + 1 ? "bg-[#003366]" : "bg-gray-300"}`}
                    ></div>
                    <span 
                      className={`text-xs font-medium whitespace-nowrap ${currentStep >= index + 1 ? "text-[#003266]" : "text-gray-500"}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content container */}
          <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
            {/* Step content header */}
            <div className="text-center mb-5">
              <h1 className="text-xl font-bold text-[#003266] mb-2">HEALTH SERVICES</h1>
            </div>

            {/* Question/Input container */}
            <div className="max-w-lg mx-auto">
              {currentStep === 1 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">How much do you need for your health fund (i.e. an amount that you are comfortable with in case of serious illness)?</p>
                  
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input 
                      type="number" 
                      value={healthQuestion1} 
                      onChange={(e)=>setHealthQuestion1(e.target.value)} 
                      className="flex-grow p-2.5 text-center text-base focus:outline-none" 
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      ₱
                    </div>
                  </div>
                  {errors.question1 && <p className="text-red-500 text-sm mb-4">{errors.question1}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">How much are you willing to set aside monthly for your health fund?</p>
                  
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input 
                      type="number" 
                      value={healthQuestion2} 
                      onChange={(e)=>setHealthQuestion2(e.target.value)} 
                      className="flex-grow p-2.5 text-center text-base focus:outline-none" 
                      placeholder="Enter monthly amount"
                      min="0"
                      step="0.01"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      ₱
                    </div>
                  </div>
                  {errors.question2 && <p className="text-red-500 text-sm mb-4">{errors.question2}</p>}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Health Fund Card */}
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Question 1: Health Fund Needed</h3>
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <input 
                          type="number" 
                          value={healthQuestion1} 
                          onChange={(e)=>setHealthQuestion1(e.target.value)} 
                          className="flex-grow p-2.5 text-center text-sm focus:outline-none" 
                          min="0"
                          step="0.01"
                        />
                        <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                          ₱
                        </div>
                      </div>
                    </div>

                    {/* Monthly Contribution Card */}
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Question 2: Monthly Contribution</h3>
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <input 
                          type="number" 
                          value={healthQuestion2} 
                          onChange={(e)=>setHealthQuestion2(e.target.value)} 
                          className="flex-grow p-2.5 text-center text-sm focus:outline-none" 
                          min="0"
                          step="0.01"
                        />
                        <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                          ₱
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Preview Card */}
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <h3 className="text-base font-bold text-[#003266] mb-4 text-center">Calculation Preview</h3>
                    <div className="text-center text-sm text-[#003266]">
                      <p className="mb-2">Years to reach goal = Health Fund ÷ (12 × Monthly Contribution)</p>
                      <p className="font-semibold">
                        {formatCurrency(parseFloat(healthQuestion1) || 0)} ÷ (12 × {formatCurrency(parseFloat(healthQuestion2) || 0)}) = 
                        <span className="ml-2 text-blue-600">
                          {parseFloat(healthQuestion2) > 0 ? (parseFloat(healthQuestion1) / (12 * parseFloat(healthQuestion2))).toFixed(2) : "0.00"} years
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons container */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-300">
            {currentStep > 1 ? (
              <button 
                onClick={handleBack} 
                className="border-2 border-[#003366] text-[#003366] px-5 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
              >
                Back
              </button>
            ) : (
              <Link 
                to="/services/yes_services/LifeProHealth" 
                className="border-2 border-[#003366] text-[#003366] px-5 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
              >
                Back
              </Link>
            )}

            <button 
              onClick={handleNext} 
              className="border-2 border-[#003366] text-[#003366] px-6 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
            >
              {currentStep === 3 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthServices;