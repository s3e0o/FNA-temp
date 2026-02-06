import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LifeProtectionResultPDF from "../../../components/pdf/LifeProtectionResultPDF.jsx";

function LifeProtection() {
  const formatCurrency = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "0.00";
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [lifeQuestion1, setLifeQuestion1] = useState("");
  const [lifeQuestion3, setLifeQuestion3] = useState("");
  const [expenses, setExpenses] = useState({
    rent: "",
    loanPayments: "",
    allowances: "",
    utilities: "",
    others: ""
  });
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

  const totalExpenses = useMemo(() => {
    return Object.values(expenses).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  }, [expenses]);

  useEffect(() => {
    document.title = "Life Protection Survey | Financial Needs Analysis";
  }, []);

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep >= 1) {
      const years = lifeQuestion1.trim();
      const yearsNum = parseInt(years, 10);

      if (years === "") {
        newErrors.question1 = "Number of years is required.";
      } else if (isNaN(yearsNum)) {
        newErrors.question1 = "Please enter a valid number of years.";
      } else if (!Number.isInteger(yearsNum) || yearsNum < 1 || yearsNum > 20) {
        newErrors.question1 = "Please enter a whole number of years between 1 and 20.";
      }
    }

    if (currentStep >= 2) {
      const expenseFields = [
        { name: 'rent', label: 'Rent' },
        { name: 'loanPayments', label: 'Loan Payments' },
        { name: 'allowances', label: 'Allowances' },
        { name: 'utilities', label: 'Utilities' },
        { name: 'others', label: 'Others' }
      ];

      expenseFields.forEach(field => {
        const value = expenses[field.name];
        const trimmed = value.trim();
        if (trimmed === "") {
          newErrors[`expense_${field.name}`] = `${field.label} is required.`;
        } else if (isNaN(parseFloat(trimmed)) || parseFloat(trimmed) < 0) {
          newErrors[`expense_${field.name}`] = `Please enter a valid non-negative amount for ${field.label}.`;
        }
      });

      const allExpensesFilledAndValid = Object.values(expenses).every(value => {
        const trimmed = value.trim();
        return trimmed !== "" && !isNaN(parseFloat(trimmed)) && parseFloat(trimmed) >= 0;
      });

      if (!allExpensesFilledAndValid) {
        newErrors.question2 = "Please fill in all monthly expense fields with valid amounts. Enter 0 for any that do not apply.";
      }
    }

    if (currentStep >= 3) {
      if (!lifeQuestion3.trim()) {
        newErrors.question3 = "Total coverage amount is required.";
      } else if (isNaN(parseFloat(lifeQuestion3)) || parseFloat(lifeQuestion3) < 0) {
        newErrors.question3 = "Please enter a valid non-negative amount for total coverage.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
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
    const years = parseInt(lifeQuestion1);
    const totalMonthly = totalExpenses;
    const existingCoverage = parseFloat(lifeQuestion3) || 0;

    const multiplierTable = {
      1: 1.0400, 2: 2.1216, 3: 3.2465, 4: 4.4163, 5: 5.6330,
      6: 6.8983, 7: 8.2142, 8: 9.5828, 9: 11.0061, 10: 12.4864,
      11: 14.0258, 12: 15.6268, 13: 17.2919, 14: 19.0236, 15: 20.8245,
      16: 22.6975, 17: 24.6454, 18: 26.6712, 19: 28.7781, 20: 30.9692,
    };

    const multiplier = multiplierTable[years] || 0;
    const totalNeeded = 12 * totalMonthly * multiplier;
    const minimumAmountNeeded = Math.max(0, totalNeeded - existingCoverage);

    return minimumAmountNeeded.toFixed(2);
  };

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 10;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 5, 5, width, height);
    pdf.save("Life-Protection-Result.pdf");
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

  const handleExpenseChange = (field, value) => {
    setExpenses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (submitted) {
    const result = computeResult();
    const years = parseInt(lifeQuestion1);
    const totalMonthly = totalExpenses;
    const existingCoverage = parseFloat(lifeQuestion3) || 0;
    const multiplierTable = {
      1: 1.0400, 2: 2.1216, 3: 3.2465, 4: 4.4163, 5: 5.6330,
      6: 6.8983, 7: 8.2142, 8: 9.5828, 9: 11.0061, 10: 12.4864,
      11: 14.0258, 12: 15.6268, 13: 17.2919, 14: 19.0236, 15: 20.8245,
      16: 22.6975, 17: 24.6454, 18: 26.6712, 19: 28.7781, 20: 30.9692,
    };
    const multiplier = multiplierTable[years] || 0;

    if (showAppointmentForm) {
      return (
        <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          {/* Your existing appointment form */}
        </div>
      );
    }

    return (
      <>
        <LifeProtectionResultPDF
          ref={resultRef}
          years={parseInt(lifeQuestion1)}
          expenses={{
            "Rent": parseFloat(expenses.rent) || 0,
            "Loan Payments": parseFloat(expenses.loanPayments) || 0,
            "Allowances": parseFloat(expenses.allowances) || 0,
            "Utilities": parseFloat(expenses.utilities) || 0,
            "Others": parseFloat(expenses.others) || 0,
          }}
          totalExpenses={totalExpenses}
          existingCoverage={parseFloat(lifeQuestion3) || 0}
          multiplier={multiplier}
          result={parseFloat(computeResult())}
        />

        <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <Link
            to="/FNA/door"
            className="relative inline-block text-[#395998] font-medium mb-5 ml-10
                        after:content-[''] after:absolute after:left-0 after:-bottom-1
                        after:w-0 after:h-[2.5px] after:bg-[#F4B43C]
                        after:transition-all after:duration-300
                        hover:after:w-full"
          >
            ← Back to Doors
          </Link>
          <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white relative">
            <button onClick={handleExportPDF} className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md text-sm cursor-pointer">
              Export to PDF
            </button>

            <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-6">LIFE PROTECTION</h1>

            <p className="text-lg text-[#003266] text-center mt-6">
              This is the minimum amount you need for life protection to support your family for {lifeQuestion1} years.
            </p>

            <div className="flex justify-center mb-14 mt-6">
              <div className="w-80 py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{formatCurrency(parseFloat(result))}
              </div>
            </div>

            <div className="mt-10 flex justify-between">
              <Link to="/FNA/AppointmentForm">
                <button className="bg-[#003266] text-white px-6 py-3 rounded-md cursor-pointer">
                  Book an Appointment
                </button>
              </Link>
              <Link to="/FNA/OurServices">
                <button className="bg-[#003266] text-white px-6 py-3 rounded-md cursor-pointer">
                  View Recommendations
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Main outer container */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Progress Bar Container - KEEPING THE SLIDING PROGRESS BAR */}
          <div className="mb-12">
            <div className="relative">
              {/* Background track */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                {/* Progress fill - sliding bar */}
                <div 
                  className="h-full bg-[#003266] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              </div>
              
              {/* Step Labels - Simplified to Question 1, Question 2, Question 3, Review */}
              <div className="flex justify-between mt-6">
                {["Question 1", "Question 2", "Question 3", "Review"].map((label, index) => (
                  <div key={index} className="flex flex-col items-center relative -top-2">
                    {/* Step indicator dot */}
                    <div 
                      className={`w-4 h-4 rounded-full mb-2 ${currentStep > index + 1 ? "bg-[#003266]" : currentStep === index + 1 ? "bg-[#003266] ring-4 ring-blue-100" : "bg-gray-300"}`}
                    ></div>
                    <span 
                      className={`text-sm font-medium whitespace-nowrap ${currentStep >= index + 1 ? "text-[#003266]" : "text-gray-500"}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content container - ONLY CHANGING THIS TO MATCH OUTER CONTAINER */}
          <div className="bg-white rounded-xl shadow-lg p-10 mb-8 border border-gray-200">
            {/* Step content header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-[#003266] mb-4">LIFE PROTECTION</h1>
            </div>

            {/* Question/Input container */}
            <div className="max-w-2xl mx-auto">
              {currentStep === 1 && (
                <div className="text-center">
                  <p className="text-xl text-[#003266] mb-10">How many years will you be providing for your family (i.e. until your children became financially independent)?</p>
                  
                  <div className="flex border-2 border-gray-300 rounded-xl overflow-hidden max-w-md mx-auto mb-8">
                    <input 
                      type="number" 
                      value={lifeQuestion1} 
                      onChange={(e)=>setLifeQuestion1(e.target.value)} 
                      className="flex-grow p-5 text-center text-xl focus:outline-none" 
                      placeholder="Enter years"
                      min="1"
                      max="20"
                    />
                    <div className="bg-gray-100 px-8 flex items-center justify-center font-bold text-[#003266] border-l-2 border-gray-300 text-lg">
                      YEARS
                    </div>
                  </div>
                  {errors.question1 && <p className="text-red-500 text-lg mb-8">{errors.question1}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <p className="text-xl text-[#003266] mb-10">How much do you spend monthly for living expenses?</p>
                  
                  <div className="space-y-6 mb-10">
                    {[
                      { key: 'rent', label: 'Rent' },
                      { key: 'loanPayments', label: 'Loan Payments' },
                      { key: 'allowances', label: 'Allowances' },
                      { key: 'utilities', label: 'Utilities' },
                      { key: 'others', label: 'Others' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xl text-[#003266] font-semibold w-1/3 text-right pr-8">{label}:</span>
                        <div className="flex border-2 border-gray-300 rounded-xl overflow-hidden w-2/3">
                          <input
                            type="number"
                            value={expenses[key]}
                            onChange={(e) => handleExpenseChange(key, e.target.value)}
                            placeholder="0.00"
                            className="flex-grow p-4 text-center text-xl focus:outline-none"
                            min="0"
                            step="0.01"
                          />
                          <div className="bg-gray-100 px-8 flex items-center justify-center font-bold text-[#003266] border-l-2 border-gray-300 text-lg">
                            ₱
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Total Expenses */}
                    <div className="pt-10 border-t-2 border-gray-300 mt-10">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#003266] w-1/3 text-right pr-8">Total Expenses:</span>
                        <div className="flex border-2 border-[#003266] rounded-xl overflow-hidden w-2/3 bg-blue-50">
                          <div className="flex-grow p-4 text-center text-2xl font-bold text-[#003266]">
                            ₱{totalExpenses.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {errors.question2 && <p className="text-red-500 text-lg text-center mb-4">{errors.question2}</p>}
                  {Object.keys(errors).map(key => 
                    key.startsWith('expense_') && (
                      <p key={key} className="text-red-500 text-center text-lg">{errors[key]}</p>
                    )
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <p className="text-xl text-[#003266] mb-10">If you have any other plans, how much is your total coverage?</p>
                  
                  <div className="flex border-2 border-gray-300 rounded-xl overflow-hidden max-w-md mx-auto mb-8">
                    <input 
                      type="number" 
                      value={lifeQuestion3} 
                      onChange={(e)=>setLifeQuestion3(e.target.value)} 
                      className="flex-grow p-5 text-center text-xl focus:outline-none" 
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                    <div className="bg-gray-100 px-8 flex items-center justify-center font-bold text-[#003266] border-l-2 border-gray-300 text-lg">
                      ₱
                    </div>
                  </div>
                  {errors.question3 && <p className="text-red-500 text-lg">{errors.question3}</p>}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Years Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100">
                      <h3 className="text-2xl font-bold text-[#003266] mb-6">Question 1: Years providing for family</h3>
                      <div className="flex border-2 border-gray-300 rounded-xl overflow-hidden">
                        <input 
                          type="number" 
                          value={lifeQuestion1} 
                          onChange={(e)=>setLifeQuestion1(e.target.value)} 
                          className="flex-grow p-5 text-center text-xl focus:outline-none" 
                          min="1"
                          max="20"
                        />
                        <div className="bg-gray-100 px-8 flex items-center justify-center font-bold text-[#003266] border-l-2 border-gray-300 text-lg">
                          YEARS
                        </div>
                      </div>
                    </div>

                    {/* Existing Coverage Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100">
                      <h3 className="text-2xl font-bold text-[#003266] mb-6">Question 3: Existing Coverage</h3>
                      <div className="flex border-2 border-gray-300 rounded-xl overflow-hidden">
                        <input 
                          type="number" 
                          value={lifeQuestion3} 
                          onChange={(e)=>setLifeQuestion3(e.target.value)} 
                          className="flex-grow p-5 text-center text-xl focus:outline-none" 
                          min="0"
                          step="0.01"
                        />
                        <div className="bg-gray-100 px-8 flex items-center justify-center font-bold text-[#003266] border-l-2 border-gray-300 text-lg">
                          ₱
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Expenses Review Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl shadow-lg border border-blue-100">
                    <h3 className="text-3xl font-bold text-[#003266] mb-8 text-center">Question 2: Monthly Expenses Review</h3>
                    <div className="space-y-6 max-w-3xl mx-auto">
                      {[
                        { key: 'rent', label: 'Rent' },
                        { key: 'loanPayments', label: 'Loan Payments' },
                        { key: 'allowances', label: 'Allowances' },
                        { key: 'utilities', label: 'Utilities' },
                        { key: 'others', label: 'Others' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xl text-[#003266] font-semibold">{label}:</span>
                          <div className="flex border-2 border-gray-300 rounded-xl overflow-hidden w-64">
                            <input
                              type="number"
                              value={expenses[key]}
                              onChange={(e) => handleExpenseChange(key, e.target.value)}
                              className="flex-grow p-4 text-center text-xl focus:outline-none"
                              min="0"
                              step="0.01"
                            />
                            <div className="bg-gray-100 px-6 flex items-center justify-center font-bold text-[#003266] border-l-2 border-gray-300 text-lg">
                              ₱
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Total Expenses */}
                      <div className="pt-8 mt-8 border-t-2 border-gray-300">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-[#003266]">Total Expenses:</span>
                          <div className="flex border-2 border-[#003266] rounded-xl overflow-hidden w-64 bg-blue-50">
                            <div className="flex-grow p-4 text-center text-2xl font-bold text-[#003266]">
                              ₱{totalExpenses.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons container */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-300">
            {currentStep > 1 ? (
              <button 
                onClick={handleBack} 
                className="border-2 border-[#003266] text-[#003266] font-bold px-12 py-4 rounded-xl hover:bg-[#003266] hover:text-white transition-colors duration-300 text-lg"
              >
                Back
              </button>
            ) : (
              <Link 
                to="/services/yes_services/LifeProHealth" 
                className="border-2 border-[#003266] text-[#003266] font-bold px-12 py-4 rounded-xl hover:bg-[#003266] hover:text-white transition-colors duration-300 text-lg"
              >
                Back
              </Link>
            )}

            <button 
              onClick={handleNext} 
              className="bg-[#003266] text-white font-bold px-16 py-4 rounded-xl hover:bg-[#00214d] transition-colors duration-300 text-lg"
            >
              {currentStep === 4 ? "Submit" : "Next "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LifeProtection;