import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

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

  const [editingQ1, setEditingQ1] = useState(false);
  const [editingQ3, setEditingQ3] = useState(false);
  const [editingFromReview, setEditingFromReview] = useState(false);

  // Calculate total expenses using useMemo
  const totalExpenses = useMemo(() => {
    return Object.values(expenses).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  }, [expenses]);

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
    if (currentStep <= 3) {
      if (validateCurrentStep()) {
        // If editing from review and we're on Q2, go back to review
        if (currentStep === 2 && editingFromReview) {
          setCurrentStep(4);
          setEditingFromReview(false);
        } else {
          setCurrentStep(currentStep + 1);
        }
      }
    } else if (currentStep === 4) {
      // Check if any edit mode is active before submitting
      if (editingQ1 || editingQ3) {
        alert("Please click 'Done' to finish editing before submitting.");
        return;
      }
      if (validateCurrentStep()) {
        setSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // If editing from review and going back from Q2, go to review
      if (currentStep === 2 && editingFromReview) {
        setCurrentStep(4);
        setEditingFromReview(false);
      } else {
        setCurrentStep(currentStep - 1);
      }
      setErrors({});
    }
  };

  const handleExpenseChange = (field, value) => {
    setExpenses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const computeResult = () => {
    const years = parseInt(lifeQuestion1);
    const totalMonthly = totalExpenses;
    const existingCoverage = parseFloat(lifeQuestion3) || 0;
    
    // Total needed for all years = monthly expenses × 12 months × years
    const totalNeeded = totalMonthly * 12 * years;
    
    // Subtract existing coverage
    const remainingNeeded = Math.max(0, totalNeeded - existingCoverage);
    
    // Calculate how many years to save if saving totalMonthly each month
    if (totalMonthly === 0) return 0;
    return (remainingNeeded / (12 * totalMonthly)).toFixed(2);
  };

  const handleImportPDF = () => {
    alert("PDF exported successfully!");
  };

  const handleBookAppointment = () => {
    setShowAppointmentForm(true);
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const validateAppointment = () => {
    const newErrors = {};
    if (!appointmentData.name.trim()) newErrors.name = "Name is required.";
    if (!appointmentData.email.trim() || !/\S+@\S+\.\S+/.test(appointmentData.email)) newErrors.email = "Valid email is required.";
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

  // Handle clicking Done button for Q1
  const handleDoneQ1 = () => {
    if (!lifeQuestion1.trim() || isNaN(parseInt(lifeQuestion1)) || parseInt(lifeQuestion1) <= 0) {
      alert("Please enter a valid number of years greater than 0.");
      return;
    }
    setEditingQ1(false);
  };

  // Handle clicking Done button for Q3
  const handleDoneQ3 = () => {
    if (lifeQuestion3.trim() !== "" && (isNaN(parseFloat(lifeQuestion3)) || parseFloat(lifeQuestion3) < 0)) {
      alert("Please enter a valid amount for total coverage (or leave empty if none).");
      return;
    }
    setEditingQ3(false);
  };

  if (submitted) {
    const result = computeResult();
    if (showAppointmentForm) {
      return (
        <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
          <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
            <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">Appointment Form</h1>
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div>
                <label className="block text-lg text-[#003266] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={appointmentData.name}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter your full name"
                />
                {appointmentErrors.name && <p className="text-red-500 mt-1">{appointmentErrors.name}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={appointmentData.email}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter your email"
                />
                {appointmentErrors.email && <p className="text-red-500 mt-1">{appointmentErrors.email}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={appointmentData.phone}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter your phone number"
                />
                {appointmentErrors.phone && <p className="text-red-500 mt-1">{appointmentErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={appointmentData.date}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                {appointmentErrors.date && <p className="text-red-500 mt-1">{appointmentErrors.date}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Preferred Time</label>
                <input
                  type="time"
                  name="time"
                  value={appointmentData.time}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                {appointmentErrors.time && <p className="text-red-500 mt-1">{appointmentErrors.time}</p>}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#003266] text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
                >
                 Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
     return (
      <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
        <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8
                bg-[url('/src/assets/images/short-cfs-b.png')]
                bg-cover bg-center
                bg-white/97 bg-blend-lighten max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white relative">
          <button
            onClick={handleImportPDF}
            className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#e0a32f] transition duration-200"
          >
            Import to PDF
          </button>
          
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-Axiforma text-[#003266]">
              LIFE PROTECTION 
            </h1>
          </header>
          <p className="text-lg text-[#003266] text-center padding-6 mt-6">
            THANK YOU FOR YOUR INPUT
          </p>
          <p className="text-lg text-[#003266] text-center padding-4 mt-6">
            This represents the number of years to reach your life protection goal.
          </p>
          <div className="flex justify-center mb-14">
            <div className="w-10 pl-8 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg padding-6 mt-6 text-center text-[#003266] text-lg relative w-80">
              <strong>{result} year/s</strong>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between">
            <button
            onClick={handleBookAppointment}
              className="bg-[#003266] text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book an Appointment
            </button>
            <button
              className="bg-[#003266] text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
            >
              View Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8
                bg-[url('/src/assets/images/short-cfs-b.png')]
                bg-cover bg-center
                bg-white/97 bg-blend-lighten ">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-Axiforma text-[#003266]">
            LIFE PROTECTION 
          </h1>
        </header>

        {/* Step Indicators - 4 steps: Q1, Q2, Q3, Review */}
        <div className="flex justify-center mb-10">
          <div className="relative flex items-center w-[640px]"> 
            <div className="absolute left-10 right-10 top-6 h-[2px] bg-[#8FA6BF]" />

            {/* Question 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${currentStep === 1 ? 'bg-[#003266]' : currentStep > 1 ? 'bg-[#003266]' : 'bg-[#B7C5D6]'} flex items-center justify-center`}>
                {currentStep > 1 ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center font-Axiforma text-lg">
                    1
                  </div>
                )}
              </div>
              <span className={`text-sm ${currentStep >= 1 ? 'text-[#003266]' : 'text-[#8FA6BF]'} mt-2 font-Axiforma`}>
                Question 1
              </span>
            </div>

            <div className="flex-1" />

            {/* Question 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${currentStep === 2 ? 'bg-[#003266]' : currentStep > 2 ? 'bg-[#003266]' : 'bg-[#B7C5D6]'} flex items-center justify-center`}>
                {currentStep > 2 ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center font-Axiforma text-lg">
                    2
                  </div>
                )}
              </div>
              <span className={`text-sm ${currentStep >= 2 ? 'text-[#003266]' : 'text-[#8FA6BF]'} mt-2 font-Axiforma`}>
                Question 2
              </span>
            </div>

            <div className="flex-1" />

            {/* Question 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${currentStep === 3 ? 'bg-[#003266]' : currentStep > 3 ? 'bg-[#003266]' : 'bg-[#B7C5D6]'} flex items-center justify-center`}>
                {currentStep > 3 ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center font-Axiforma text-lg">
                    3
                  </div>
                )}
              </div>
              <span className={`text-sm ${currentStep >= 3 ? 'text-[#003266]' : 'text-[#8FA6BF]'} mt-2 font-Axiforma`}>
                Question 3
              </span>
            </div>

            <div className="flex-1" />

            {/* Review */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${currentStep === 4 ? 'bg-[#003266]' : 'bg-[#B7C5D6]'} flex items-center justify-center`}>
                <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center font-Axiforma text-lg">
                  4
                </div>
              </div>
              <span className={`text-sm ${currentStep === 4 ? 'text-[#003266]' : 'text-[#8FA6BF]'} mt-2 font-Axiforma`}>
                Review
              </span>
            </div>
          </div>
        </div>

        <form className="space-y-8">
          {/* Question 1 */}
          {currentStep === 1 && (
            <div>
              <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed text-center">
                How many years will you be providing for your family
                <br />
                (i.e. until your children became financially independent)?
              </p>
              <div className="flex justify-center mb-14">
                <div className="relative w-80">
                  <input
                    type="number"
                    value={lifeQuestion1}
                    onChange={(e) => setLifeQuestion1(e.target.value)}
                    placeholder="0"
                    className="w-full pl-4 pr-12 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">years</span>
                </div>
              </div>
              {errors.question1 && <p className="text-red-500 text-center">{errors.question1}</p>}
            </div>
          )}

          {/* Question 2 - Monthly Expenses */}
          {currentStep === 2 && (
            <div>
              <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed text-center">
                How much do you spend monthly for living expenses?
              </p>
              
              <div className="max-w-md mx-auto space-y-4 mb-14">
                <div className="grid grid-cols-2 gap-8">
                  {/* Left column - Labels */}
                  <div className="space-y-6">
                    <div className="h-12 flex items-center">
                      <span className="text-lg text-[#003266]">Rent</span>
                    </div>
                    <div className="h-12 flex items-center">
                      <span className="text-lg text-[#003266]">Loan Payments</span>
                    </div>
                    <div className="h-12 flex items-center">
                      <span className="text-lg text-[#003266]">Allowances</span>
                    </div>
                    <div className="h-12 flex items-center">
                      <span className="text-lg text-[#003266]">Utilities</span>
                    </div>
                    <div className="h-12 flex items-center">
                      <span className="text-lg text-[#003266]">Others</span>
                    </div>
                  </div>

                  {/* Right column - Inputs */}
                  <div className="space-y-6">
                    {/* Rent Input */}
                    <div className="relative">
                      <input
                        type="number"
                        value={expenses.rent}
                        onChange={(e) => handleExpenseChange('rent', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                    </div>
                    {errors.expense_rent && <p className="text-red-500 text-sm -mt-2">- {errors.expense_rent}</p>}

                    {/* Loan Payments Input */}
                    <div className="relative">
                      <input
                        type="number"
                        value={expenses.loanPayments}
                        onChange={(e) => handleExpenseChange('loanPayments', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                    </div>
                    {errors.expense_loanPayments && <p className="text-red-500 text-sm -mt-2">- {errors.expense_loanPayments}</p>}

                    {/* Allowances Input */}
                    <div className="relative">
                      <input
                        type="number"
                        value={expenses.allowances}
                        onChange={(e) => handleExpenseChange('allowances', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                    </div>
                    {errors.expense_allowances && <p className="text-red-500 text-sm -mt-2">- {errors.expense_allowances}</p>}

                    {/* Utilities Input */}
                    <div className="relative">
                      <input
                        type="number"
                        value={expenses.utilities}
                        onChange={(e) => handleExpenseChange('utilities', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                    </div>
                    {errors.expense_utilities && <p className="text-red-500 text-sm -mt-2">- {errors.expense_utilities}</p>}

                    {/* Others Input */}
                    <div className="relative">
                      <input
                        type="number"
                        value={expenses.others}
                        onChange={(e) => handleExpenseChange('others', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                    </div>
                    {errors.expense_others && <p className="text-red-500 text-sm -mt-2">- {errors.expense_others}</p>}
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="pt-6 border-t-2 border-gray-300">
                  <div className="grid grid-cols-2 gap-8 items-center">
                    <div className="flex items-center justify-end">
                      <span className="text-xl font-semibold text-[#003266]">Total Expenses:</span>
                    </div>
                    <div className="relative">
                      <div className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 bg-gray-50 text-lg">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                        <span className="text-[#003266]">{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* General Question 2 error */}
              {errors.question2 && <p className="text-red-500 text-center mt-4">{errors.question2}</p>}
            </div>
          )}

          {/* Question 3 - Total Coverage */}
          {currentStep === 3 && (
            <div>
              <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed text-center">
                If you have any other plans, how much is your total coverage?
                <br />
                <span className="text-sm text-gray-500">(Leave empty if none)</span>
              </p>
              <div className="flex justify-center mb-14">
                <div className="relative w-80">
                  <input
                    type="number"
                    value={lifeQuestion3}
                    onChange={(e) => setLifeQuestion3(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                </div>
              </div>
              {errors.question3 && <p className="text-red-500 text-center">{errors.question3}</p>}
            </div>
          )}

          {/* Review Step - Editable Answers */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-Axiforma text-[#003266] text-center mb-8">Review Your Answers</h2>
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Question 1 - Editable on Review page */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-lg text-[#003266] font-semibold">Question 1:</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (editingQ1) {
                          handleDoneQ1();
                        } else {
                          setEditingQ1(true);
                        }
                      }}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition ${
                        editingQ1 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-[#003266] text-white hover:bg-[#002255]'
                      }`}
                    >
                      {editingQ1 ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  <p className="text-lg text-[#003266] mb-2">
                    How many years will you be providing for your family?
                  </p>
                  
                  {editingQ1 ? (
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        value={lifeQuestion1}
                        onChange={(e) => setLifeQuestion1(e.target.value)}
                        className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        autoFocus
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">years</span>
                    </div>
                  ) : (
                    <div className="relative max-w-xs">
                      <div className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 bg-gray-100 text-lg">
                        <span className="text-[#003266]">{lifeQuestion1}</span>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">years</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Question 2 - Navigate back to question page */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-lg text-[#003266] font-semibold">Question 2: Monthly Expenses</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingFromReview(true);
                        setCurrentStep(2);
                      }}
                      className="bg-[#003266] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#002255] transition"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-lg text-[#003266] mb-2">
                    How much do you spend monthly for living expenses?
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-[#003266]">Rent</span>
                      <span className="text-lg text-[#003266] font-medium">₱{expenses.rent || "0.00"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-[#003266]">Loan Payments</span>
                      <span className="text-lg text-[#003266] font-medium">₱{expenses.loanPayments || "0.00"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-[#003266]">Allowances</span>
                      <span className="text-lg text-[#003266] font-medium">₱{expenses.allowances || "0.00"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-[#003266]">Utilities</span>
                      <span className="text-lg text-[#003266] font-medium">₱{expenses.utilities || "0.00"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-[#003266]">Others</span>
                      <span className="text-lg text-[#003266] font-medium">₱{expenses.others || "0.00"}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-[#003266]">Total Expenses:</span>
                        <span className="text-lg font-semibold text-[#003266]">₱{totalExpenses.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question 3 - Editable on Review page */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-lg text-[#003266] font-semibold">Question 3:</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (editingQ3) {
                          handleDoneQ3();
                        } else {
                          setEditingQ3(true);
                        }
                      }}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition ${
                        editingQ3 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-[#003266] text-white hover:bg-[#002255]'
                      }`}
                    >
                      {editingQ3 ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  <p className="text-lg text-[#003266] mb-2">
                    If you have any other plans, how much is your total coverage?
                  </p>
                  
                  {editingQ3 ? (
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        value={lifeQuestion3}
                        onChange={(e) => setLifeQuestion3(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        placeholder="0.00"
                        autoFocus
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                    </div>
                  ) : (
                    <div className="relative max-w-xs">
                      <div className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-lg">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                        <span className="text-[#003266]">{lifeQuestion3 || "0.00"}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Leave empty if none</p>
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="mt-10 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="bg-[#003266] text-white px-10 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
            >
               Previous
            </button>
          ) : (
            <Link
              to="/services/protection-health"
              className="relative px-6 py-1 text-lg font-light text-[#003266] transition duration-300 after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-[#F4B43C] after:transition-all after:duration-300 hover:after:w-16"
            >
               Back
            </Link>
          )}

          <button
            onClick={handleNext}
            className="bg-[#003266] text-white px-10 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
          >
            {currentStep === 4 
              ? "Submit" 
              : currentStep === 2 && editingFromReview 
                ? "Review Answers" 
                : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LifeProtection;
