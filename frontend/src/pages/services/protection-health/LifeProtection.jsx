import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function LifeProtection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [lifeQuestion1, setLifeQuestion1] = useState(""); // years
  const [lifeQuestion3, setLifeQuestion3] = useState(""); // total coverage
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

  // Calculate total expenses using useMemo
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
    
    if (currentStep === 1) {
      // Question 1 validation (years)
      if (!lifeQuestion1.trim() || isNaN(parseInt(lifeQuestion1)) || parseInt(lifeQuestion1) <= 0) {
        newErrors.question1 = "Please enter a valid number of years greater than 0.";
      }
    } else if (currentStep === 2) {
      // Question 2 validation (expenses)
      const expenseFields = [
        { name: 'rent', label: 'Rent' },
        { name: 'loanPayments', label: 'Loan Payments' },
        { name: 'allowances', label: 'Allowances' },
        { name: 'utilities', label: 'Utilities' },
        { name: 'others', label: 'Others' }
      ];
      
      expenseFields.forEach(field => {
        const value = expenses[field.name];
        if (value.trim() !== "" && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
          newErrors[`expense_${field.name}`] = `Please enter a valid amount for ${field.label}`;
        }
      });
      
      // Check if at least one expense is filled and valid
      const hasValidExpenses = Object.values(expenses).some(value => {
        return value.trim() !== "" && !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
      });
      
      if (!hasValidExpenses) {
        newErrors.question2 = "Please enter at least one expense amount.";
      }
    } else if (currentStep === 3) {
      // Question 3 validation (total coverage)
      // Question 3 is optional, so no validation needed if empty
      // If user enters something, check if it's valid
      if (lifeQuestion3.trim() !== "" && (isNaN(parseFloat(lifeQuestion3)) || parseFloat(lifeQuestion3) < 0)) {
        newErrors.question3 = "Please enter a valid amount for total coverage (or leave empty if none).";
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

  // Calculate minimum amount needed for life protection
  const computeResult = () => {
    const years = parseInt(lifeQuestion1);
    const totalMonthly = totalExpenses;
    const existingCoverage = parseFloat(lifeQuestion3) || 0;
    
    // Total needed for all years = monthly expenses × 12 months × years
    const totalNeeded = totalMonthly * 12 * years;
    
    // Subtract existing coverage to get minimum amount needed
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

    if (showAppointmentForm) {
      return (
        <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
            <h1 className="text-3xl text-center text-[#003266] mb-8">Appointment Form</h1>
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              {["name", "email", "phone", "date", "time"].map((field) => (
                <div key={field}>
                  <label className="block text-lg text-[#003266] mb-2">{field.toUpperCase()}</label>
                  <input
                    type={
                      field === "email"
                        ? "email"
                        : field === "phone"
                        ? "tel"
                        : field === "date"
                        ? "date"
                        : field === "time"
                        ? "time"
                        : "text"
                    }
                    name={field}
                    value={appointmentData[field]}
                    onChange={handleAppointmentChange}
                    className="w-full px-4 py-3 border rounded-lg text-lg"
                  />
                  {appointmentErrors[field] && (
                    <p className="text-red-500 mt-1">{appointmentErrors[field]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-between">
                <button type="button" onClick={() => setShowAppointmentForm(false)} className="bg-gray-500 text-white px-6 py-3 rounded-md">Cancel</button>
                <button type="submit" className="bg-[#003266] text-white px-6 py-3 rounded-md">Submit</button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div ref={resultRef} className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white relative">
          <button onClick={handleExportPDF} className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md text-sm">Export to PDF</button>

          <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-6">LIFE PROTECTION</h1>

          <p className="text-lg text-[#003266] text-center mt-6">
            This is the minimum amount you need for life protection to support your family for {lifeQuestion1} years.
          </p>

          <div className="flex justify-center mb-14 mt-6">
            <div className="w-80 py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
              ₱{result}
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
    );
  }

  return (
    <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
        <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">LIFE PROTECTION</h1>

        <div className="flex justify-center mb-10">
          <div className="relative flex items-center w-[640px]">
            <div className="absolute left-10 right-1 top-6 h-[2px] bg-[#8FA6BF]" />
            {[1,2,3,4].map(n => (
              <React.Fragment key={n}>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${currentStep >= n ? "bg-[#003266]" : "bg-[#B7C5D6]"} flex items-center justify-center`}>
                    <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center text-lg">{n}</div>
                  </div>
                  <span className={`text-sm mt-2 ${currentStep >= n ? "text-[#003266]" : "text-[#8FA6BF]"}`}>
                    {n===1?"Question 1":n===2?"Question 2":n===3?"Question 3":"Review"}
                  </span>
                </div>
                {n!==4 && <div className="flex-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form className="space-y-8">
          {currentStep === 1 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">How many years will you be providing for your family (i.e. until your children became financially independent)?</p>
              <input 
                type="number" 
                value={lifeQuestion1} 
                onChange={(e)=>setLifeQuestion1(e.target.value)} 
                className="w-80 p-3 border rounded-lg text-center" 
                placeholder="Enter years"
              />
              {errors.question1 && <p className="text-red-500 mt-2">{errors.question1}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">How much do you spend monthly for living expenses?</p>
              
              <div className="max-w-md mx-auto space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left column - Labels */}
                  <div className="space-y-4 text-right">
                    <div className="h-12 flex items-center justify-end">
                      <span className="text-lg text-[#003266]">Rent:</span>
                    </div>
                    <div className="h-12 flex items-center justify-end">
                      <span className="text-lg text-[#003266]">Loan Payments:</span>
                    </div>
                    <div className="h-12 flex items-center justify-end">
                      <span className="text-lg text-[#003266]">Allowances:</span>
                    </div>
                    <div className="h-12 flex items-center justify-end">
                      <span className="text-lg text-[#003266]">Utilities:</span>
                    </div>
                    <div className="h-12 flex items-center justify-end">
                      <span className="text-lg text-[#003266]">Others:</span>
                    </div>
                  </div>

                  {/* Right column - Inputs */}
                  <div className="space-y-4">
                    {["rent", "loanPayments", "allowances", "utilities", "others"].map((field) => (
                      <div key={field} className="relative">
                        <input
                          type="number"
                          value={expenses[field]}
                          onChange={(e) => handleExpenseChange(field, e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-3 pr-3 py-3 border rounded-lg text-center"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                        {errors[`expense_${field}`] && <p className="text-red-500 text-sm mt-1">{errors[`expense_${field}`]}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="pt-6 border-t-2 border-gray-300">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center justify-end">
                      <span className="text-lg font-semibold text-[#003266]">Total Expenses:</span>
                    </div>
                    <div className="relative">
                      <div className="w-full pl-3 pr-3 py-3 border rounded-lg bg-gray-50 text-center">
                        <span className="text-lg text-[#003266] font-semibold">₱{totalExpenses.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {errors.question2 && <p className="text-red-500 text-center">{errors.question2}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">If you have any other plans, how much is your total coverage? (Leave empty if none)</p>
              <input 
                type="number" 
                value={lifeQuestion3} 
                onChange={(e)=>setLifeQuestion3(e.target.value)} 
                className="w-80 p-3 border rounded-lg text-center" 
                placeholder="Enter amount"
              />
              {errors.question3 && <p className="text-red-500 mt-2">{errors.question3}</p>}
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <p className="text-lg text-[#003266] mb-4 font-semibold">Review Your Inputs</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border p-4 rounded">
                  <span>Years providing for family:</span>
                  <input 
                    type="number" 
                    value={lifeQuestion1} 
                    onChange={(e)=>setLifeQuestion1(e.target.value)} 
                    className="border rounded px-2 py-1 w-32 text-center" 
                  />
                </div>
                
                <div className="border p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Monthly Expenses:</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Rent:</span>
                      <input 
                        type="number" 
                        value={expenses.rent} 
                        onChange={(e)=>handleExpenseChange('rent', e.target.value)} 
                        className="border rounded px-2 py-1 w-32 text-center" 
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Payments:</span>
                      <input 
                        type="number" 
                        value={expenses.loanPayments} 
                        onChange={(e)=>handleExpenseChange('loanPayments', e.target.value)} 
                        className="border rounded px-2 py-1 w-32 text-center" 
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Allowances:</span>
                      <input 
                        type="number" 
                        value={expenses.allowances} 
                        onChange={(e)=>handleExpenseChange('allowances', e.target.value)} 
                        className="border rounded px-2 py-1 w-32 text-center" 
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Utilities:</span>
                      <input 
                        type="number" 
                        value={expenses.utilities} 
                        onChange={(e)=>handleExpenseChange('utilities', e.target.value)} 
                        className="border rounded px-2 py-1 w-32 text-center" 
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Others:</span>
                      <input 
                        type="number" 
                        value={expenses.others} 
                        onChange={(e)=>handleExpenseChange('others', e.target.value)} 
                        className="border rounded px-2 py-1 w-32 text-center" 
                      />
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total Expenses:</span>
                        <span>₱{totalExpenses.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border p-4 rounded">
                  <span>Existing Coverage:</span>
                  <input 
                    type="number" 
                    value={lifeQuestion3} 
                    onChange={(e)=>setLifeQuestion3(e.target.value)} 
                    className="border rounded px-2 py-1 w-32 text-center" 
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">You can edit any field before final submission.</p>
            </div>
          )}
        </form>

        <div className="mt-10 flex justify-between">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="bg-[#003266] text-white px-10 py-3 rounded-md">Previous</button>
          ) : (
            <Link to="/services/protection-health" className="text-[#003266]">Back</Link>
          )}

          <button onClick={handleNext} className="bg-[#003266] text-white px-10 py-3 rounded-md">{currentStep===4?"Submit":"Next"}</button>
        </div>
      </div>
    </div>
  );
}

export default LifeProtection;
