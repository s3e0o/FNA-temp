import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LifeProtectionResultPDF from "../../../components/pdf/LifeProtectionResultPDF.jsx";

// Helper: Format number with commas (max 9 digits)
const formatNumberWithCommas = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/[^0-9]/g, "");
  const truncated = cleaned.slice(0, 9);
  return truncated.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

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

  // ✅ Animation state for review step
  const [displayMinimumAmount, setDisplayMinimumAmount] = useState(0);

  const resultRef = useRef(null);

  const totalExpenses = useMemo(() => {
    return Object.values(expenses).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  }, [expenses]);

  useEffect(() => {
    document.title = "Life Protection Survey | Financial Needs Analysis";
  }, []);

  // ✅ Animation for minimum amount on Step 4
  useEffect(() => {
    if (currentStep !== 4) return;

    const result = parseFloat(computeResult()) || 0;

    const animate = (start, end, duration, setter) => {
      if (Math.abs(end - start) < 1) {
        setter(end);
        return;
      }
      let startTime = null;
      const stepAnim = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const t = Math.min((timestamp - startTime) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const value = Math.round(start + (end - start) * eased);
        setter(value);
        if (t < 1) requestAnimationFrame(stepAnim);
        else setter(end);
      };
      requestAnimationFrame(stepAnim);
    };

    animate(displayMinimumAmount, Math.round(result), 1400, setDisplayMinimumAmount);
  }, [currentStep, lifeQuestion1, lifeQuestion3, expenses]);

  // ✅ Handle coverage input
  const handleLifeQuestion3Change = (e) => {
    let value = e.target.value;
    const digitsOnly = value.replace(/[^0-9]/g, "");
    const limited = digitsOnly.slice(0, 9); // max 9 digits
    setLifeQuestion3(limited);
  };

  // ✅ Handle expense inputs
  const handleExpenseChange = (field, value) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    const limited = digitsOnly.slice(0, 9); // max 9 digits
    setExpenses(prev => ({
      ...prev,
      [field]: limited
    }));
  };

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
          {/* Appointment form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-5">
              <h1 className="text-xl font-bold text-[#003266] text-center mb-6">
                Book Appointment
              </h1>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4 max-w-lg mx-auto">
                {["name", "email", "phone", "date", "time"].map((f) => (
                  <div key={f}>
                    <label className="block text-[#003266] font-semibold mb-1.5 capitalize text-sm">
                      {f.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={
                        f === "email" ? "email" :
                        f === "phone" ? "tel" :
                        f === "date" ? "date" :
                        f === "time" ? "time" : "text"
                      }
                      name={f}
                      value={appointmentData[f]}
                      onChange={handleAppointmentChange}
                      className="w-full p-2.5 border border-gray-300 rounded text-center focus:outline-none focus:border-[#003266]"
                    />
                    {appointmentErrors[f] && (
                      <p className="text-red-500 text-xs mt-1">{appointmentErrors[f]}</p>
                    )}
                  </div>
                ))}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentForm(false)}
                    className="border-2 border-[#003366] text-[#003366] px-6 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="border-2 border-[#003366] bg-[#003366] text-white px-6 py-1.5 rounded-full font-medium hover:bg-[#002244] transition-colors duration-200 text-sm"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
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
            className="relative inline-block text-[#395998] font-medium mb-4 ml-4
                        after:content-[''] after:absolute after:left-0 after:-bottom-1
                        after:w-0 after:h-[1.5px] after:bg-[#F4B43C]
                        after:transition-all after:duration-300
                        hover:after:w-full text-sm"
          >
            ← Back to Doors
          </Link>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-5">
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-[#003266] mb-3">LIFE PROTECTION RESULT</h1>
                <button onClick={handleExportPDF} className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer">
                  Export to PDF
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
                <p className="text-base text-[#003266] text-center mb-5">
                  Minimum amount needed to support your family for <span className="font-bold">{lifeQuestion1} years</span>:
                </p>

                <div className="flex justify-center mb-5">
                  <div className="w-52 py-4 text-center text-xl font-bold border border-[#003266] rounded-lg bg-blue-50">
                    ₱{formatCurrency(parseFloat(computeResult()))}
                  </div>
                </div>

                <div className="space-y-4 mb-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Years</h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        {lifeQuestion1} years
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Existing Coverage</h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        ₱{formatCurrency(parseFloat(lifeQuestion3) || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <h3 className="text-sm font-bold text-[#003266] mb-3 text-center">Monthly Expenses</h3>
                    <div className="space-y-2">
                      {[
                        { key: 'rent', label: 'Rent' },
                        { key: 'loanPayments', label: 'Loan Payments' },
                        { key: 'allowances', label: 'Allowances' },
                        { key: 'utilities', label: 'Utilities' },
                        { key: 'others', label: 'Others' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-[#003266] font-semibold">{label}:</span>
                          <div className="text-sm font-bold text-[#003266]">
                            ₱{formatCurrency(parseFloat(expenses[key]) || 0)}
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-3 mt-3 border-t border-gray-300">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-[#003266]">Total:</span>
                          <div className="text-base font-bold text-[#003266]">
                            ₱{formatCurrency(totalExpenses)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

               <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                      <Link to="/FNA/OurServices">
                      <button className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer">
                        View Services
                      </button>
                      </Link>
                      <Link to="/FNA/AppointmentForm">
                      <button className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer">
                        Book Appointment
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-5">
          {/* Progress Bar */}
          <div className="mb-5">
            <div className="relative">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#003366] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-4">
                {["Question 1", "Question 2", "Question 3", "Review"].map((label, index) => (
                  <div key={index} className="flex flex-col items-center">
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

          <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
            <div className="text-center mb-5">
              <h1 className="text-xl font-bold text-[#003266] mb-2">LIFE PROTECTION</h1>
            </div>

            <div className="max-w-lg mx-auto">
              {currentStep === 1 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">How many years will you be providing for your family (i.e. until your children became financially independent)?</p>
                  
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input 
                      type="number" 
                      value={lifeQuestion1} 
                      onChange={(e)=>setLifeQuestion1(e.target.value)} 
                      className="flex-grow p-2.5 text-center text-base focus:outline-none" 
                      placeholder="Enter years"
                      min="1"
                      max="20"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      YEARS
                    </div>
                  </div>
                  {errors.question1 && <p className="text-red-500 text-sm mb-4">{errors.question1}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">How much do you spend monthly for living expenses?</p>
                  
                  <div className="space-y-3 mb-4">
                    {[
                      { key: 'rent', label: 'Rent' },
                      { key: 'loanPayments', label: 'Loan Payments' },
                      { key: 'allowances', label: 'Allowances' },
                      { key: 'utilities', label: 'Utilities' },
                      { key: 'others', label: 'Others' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-[#003266] font-semibold w-2/5 text-right pr-3">{label}:</span>
                        <div className="flex border border-gray-300 rounded overflow-hidden w-3/5">
                          <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                              ₱
                            </div>
                          <input
                            type="text"
                            value={formatNumberWithCommas(expenses[key])}
                            onChange={(e) => handleExpenseChange(key, e.target.value)}
                            placeholder="0"
                            className="flex-grow p-2 text-center text-sm focus:outline-none"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-300 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-[#003266] w-2/5 text-right pr-3">Total Expenses:</span>
                        <div className="flex border border-[#003266] rounded overflow-hidden w-3/5 bg-blue-50">
                          <div className="flex-grow p-2 text-center text-base font-bold text-[#003266]">
                            ₱{formatCurrency(totalExpenses)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {errors.question2 && <p className="text-red-500 text-sm text-center mb-2">{errors.question2}</p>}
                  {Object.keys(errors).map(key => 
                    key.startsWith('expense_') && (
                      <p key={key} className="text-red-500 text-center text-sm">{errors[key]}</p>
                    )
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">If you have any other plans, how much is your total coverage?</p>
                  
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      ₱
                    </div>
                    <input 
                      type="text"
                      value={formatNumberWithCommas(lifeQuestion3)}
                      onChange={handleLifeQuestion3Change}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter amount"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    
                  </div>
                  {errors.question3 && <p className="text-red-500 text-sm">{errors.question3}</p>}
                </div>
              )}

              {/* ✅ REFACTORED REVIEW STEP (Step 4) */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-[#003266] text-center mb-4">
                    Review & Edit Your Answers
                  </h2>

                  {/* Live animated preview */}
                  <div className="bg-blue-50 border border-[#003266] rounded-lg p-5 mb-6 text-center shadow-sm">
                    <p className="text-base text-[#003266] mb-4">
                      Estimated Minimum Coverage Needed:
                    </p>
                    <div className="text-3xl font-bold text-[#003266] tabular-nums">
                      ₱{formatCurrency(displayMinimumAmount)}
                    </div>
                  </div>

                  {/* Editable fields */}
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-[#003266] mb-2">Years Providing for Family</h3>
                        <div className="flex border border-gray-300 rounded overflow-hidden">
                          <input
                            type="number"
                            value={lifeQuestion1}
                            onChange={(e) => setLifeQuestion1(e.target.value)}
                            className="flex-grow p-2.5 text-center text-sm focus:outline-none focus:border-[#003366]"
                            min="1"
                            max="20"
                          />
                          <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                            YEARS
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-[#003266] mb-2">Existing Coverage</h3>
                        <div className="flex border border-gray-300 rounded overflow-hidden">
                          <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-sm">
                            ₱
                          </div>
                          <input
                            type="text"
                            value={formatNumberWithCommas(lifeQuestion3)}
                            onChange={handleLifeQuestion3Change}
                            className="flex-grow p-2.5 text-center text-sm focus:outline-none focus:border-[#003366]"
                            placeholder="Enter amount"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3 text-center">Monthly Living Expenses</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                        {[
                          { key: 'rent', label: 'Rent' },
                          { key: 'loanPayments', label: 'Loans' },
                          { key: 'allowances', label: 'Allowances' },
                          { key: 'utilities', label: 'Utilities' },
                          { key: 'others', label: 'Others' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex flex-col">
                            <label className="text-xs text-[#003266] font-medium mb-1 text-center">{label}</label>
                            <div className="flex border border-gray-300 rounded overflow-hidden">
                              <div className="bg-gray-100 px-2 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-xs">
                                ₱
                              </div>
                              <input
                                type="text"
                                value={formatNumberWithCommas(expenses[key])}
                                onChange={(e) => handleExpenseChange(key, e.target.value)}
                                className="flex-grow p-1.5 text-center text-xs focus:outline-none focus:border-[#003366]"
                                placeholder="0"
                                inputMode="numeric"
                                pattern="[0-9]*"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="flex items-center justify-center">
                          <span className="text-sm font-bold text-[#003266] mr-3">Total Monthly:</span>
                          <div className="flex border border-[#003266] rounded overflow-hidden bg-blue-50">
                            <div className="px-10 pt-2 pb-2  flex items-center font-bold text-[#003266] text-sm">
                              ₱{formatCurrency(totalExpenses)}
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

          <div className="flex justify-between items-center pt-4 border-t border-gray-300">
            {currentStep > 1 ? (
              <button 
                onClick={handleBack} 
                className="border-2 border-[#003366] text-[#003366] px-5 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
              >
                Back
              </button>
            ) : (
              <Link 
                to="/services/yes_services/LifeProHealth" 
                className="border-2 border-[#003366] text-[#003366] px-5 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
              >
                Back
              </Link>
            )}

            <button 
              onClick={handleNext} 
              className="border-2 border-[#003366] text-[#003366] px-6 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
            >
              {currentStep === 4 ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LifeProtection;