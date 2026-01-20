import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Retirement() {

  const getRetirementMultiplier = (yearsAfterRetirement, yearsUntilRetirement) => {
    // Cap yearsAfterRetirement to available rows (10–15 in PDF)
    const n = Math.min(Math.max(Math.round(yearsAfterRetirement), 10), 15);
    // Cap yearsUntilRetirement to available columns (1–20 in PDF)
    const t = Math.min(Math.max(Math.round(yearsUntilRetirement), 1), 20);

    // Multiplier table from PDF: rows = retirement period (10-15 years), columns = years until retirement (1-20)
    const table = {
      10: [1.2486,1.2986,1.3505,1.4045,1.4607,1.5192,1.5799,1.6431,1.7088,1.7772,1.8483,1.9222,1.9991,2.0791,2.1622,2.2487,2.3387,2.4322,2.5295],
      11: [1.2751,1.3261,1.3791,1.4343,1.4917,1.5513,1.6134,1.6779,1.7450,1.8148,1.8874,1.9629,2.0414,2.1231,2.2080,2.2963,2.3882,2.4837,2.5831],
      12: [1.3022,1.3543,1.4085,1.4648,1.5234,1.5844,1.6477,1.7137,1.7822,1.8535,1.9276,2.0047,2.0849,2.1683,2.2551,2.3453,2.4391,2.5366,2.6381],
      13: [1.3301,1.3834,1.4387,1.4962,1.5561,1.6183,1.6831,1.7504,1.8204,1.8932,1.9689,2.0477,2.1296,2.2148,2.3034,2.3955,2.4913,2.5910,2.6946],
      14: [1.3588,1.4132,1.4697,1.5285,1.5896,1.6532,1.7194,1.7881,1.8596,1.9340,2.0114,2.0477,2.1296,2.2148,2.3034,2.3955,2.4913,2.5910,2.6946],
      15: [1.3883,1.4438,1.5016,1.5617,1.6241,1.6891,1.7566,1.8269,1.9000,1.9760,2.0550,2.0919,2.1755,2.2625,2.3530,2.4472,2.5451,2.6469,2.7527]
    };

    return table[n][t - 1]; // t=1 → index 0
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [currentAge, setCurrentAge] = useState(""); // Question 1: Current age
  const [retirementAge, setRetirementAge] = useState(""); // Question 2: Planned retirement age
  const [monthlyIncome, setMonthlyIncome] = useState(""); // Question 3: Monthly income
  const [yearsAfterRetirement, setYearsAfterRetirement] = useState(""); // Question 4: Years after retirement
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
    document.title = "Retirement | Financial Needs Analysis";
  }, []);

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      // Question 1 validation (current age)
      if (!currentAge.trim() || isNaN(parseInt(currentAge)) || parseInt(currentAge) <= 0) {
        newErrors.question1 = "Please enter a valid age (greater than 0).";
      } else if (parseInt(currentAge) >= 100) {
        newErrors.question1 = "Please enter a realistic age (less than 100).";
      }
    } else if (currentStep === 2) {
      // Question 2 validation (retirement age)
      if (!retirementAge.trim() || isNaN(parseInt(retirementAge)) || parseInt(retirementAge) <= 0) {
        newErrors.question2 = "Please enter a valid retirement age (greater than 0).";
      } else if (parseInt(retirementAge) <= parseInt(currentAge)) {
        newErrors.question2 = "Retirement age must be greater than your current age.";
      } else if (parseInt(retirementAge) >= 100) {
        newErrors.question2 = "Please enter a realistic retirement age (less than 100).";
      }
    } else if (currentStep === 3) {
      // Question 3 validation (monthly income)
      if (!monthlyIncome.trim() || isNaN(parseFloat(monthlyIncome)) || parseFloat(monthlyIncome) <= 0) {
        newErrors.question3 = "Please enter a valid monthly income (greater than 0).";
      }
    } else if (currentStep === 4) {
      // Question 4: must be one of 10–15 (now enforced by UI, but still validate)
      if (!yearsAfterRetirement || !["10", "11", "12", "13", "14", "15"].includes(yearsAfterRetirement)) {
        newErrors.question4 = "Please select a retirement period.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 5) {
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
    const currentAgeNum = parseInt(currentAge);
    const retirementAgeNum = parseInt(retirementAge);
    const monthlyIncomeNum = parseFloat(monthlyIncome);
    const yearsAfterRetirementNum = parseInt(yearsAfterRetirement);

    const yearsUntilRetirement = retirementAgeNum - currentAgeNum;

    // Get multiplier from PDF table based on retirement period and years until retirement
    const multiplier = getRetirementMultiplier(yearsAfterRetirementNum, yearsUntilRetirement);

    // CORRECTED FORMULA from PDF: (12 × C) × D × multiplier
    // Where C = monthly income, D = years after retirement
    const totalRetirementFundNeeded = (12 * monthlyIncomeNum) * yearsAfterRetirementNum * multiplier;

    return {
      yearsUntilRetirement,
      totalRetirementFundNeeded,
      multiplier
    };
  };

  const computeMonthlySavings = () => {
    const result = computeResult();
    const yearsUntilRetirement = result.yearsUntilRetirement;
    const targetAmount = result.totalRetirementFundNeeded;

    if (yearsUntilRetirement <= 0 || targetAmount <= 0) return 0;

    const annualRate = 0.06;
    const monthlyRate = annualRate / 12;
    const totalMonths = yearsUntilRetirement * 12;

    const monthlySavings = targetAmount * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return monthlySavings;
  };

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 10;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 5, 5, width, height);
    pdf.save("Retirement-Planning-Result.pdf");
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
    const monthlySavings = computeMonthlySavings();

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

          {/* Hidden Printable PDF Template — DO NOT DISPLAY IN UI */}
          <div
            ref={resultRef}
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              boxSizing: 'border-box',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: '12pt',
              color: '#000',
              backgroundColor: '#fff',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0' }}>FINANCIAL NEEDS ANALYSIS</h1>
              <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginTop: '8px', color: '#003266' }}>RETIREMENT</h2>
            </div>

            {/* Goal Statement */}
            <div style={{ marginBottom: '20px', fontStyle: 'italic', paddingLeft: '10px', borderLeft: '3px solid #003266' }}>
              To maintain your lifestyle after retirement
            </div>

            {/* Inputs Section */}
            <div style={{ marginBottom: '24px' }}>
              <p><strong>A.</strong> How old are you? <u>&nbsp;&nbsp;{currentAge}&nbsp;&nbsp;</u> years old</p>
              <p><strong>B.</strong> At what age do you plan to retire? <u>&nbsp;&nbsp;{retirementAge}&nbsp;&nbsp;</u> years old</p>
              <p><strong>C.</strong> How much is your monthly income? ₱<u>&nbsp;&nbsp;{parseFloat(monthlyIncome).toLocaleString('en-PH', { minimumFractionDigits: 2 })}&nbsp;&nbsp;</u></p>
              <p><strong>D.</strong> How many years after retirement do you want to receive this amount?</p>
              <div style={{ marginLeft: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {[10, 11, 12, 13, 14, 15].map((yr) => (
                  <span key={yr} style={{ minWidth: '80px', textAlign: 'center' }}>
                    {yearsAfterRetirement == yr ? (
                      <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>● {yr} years</span>
                    ) : (
                      <span>○ {yr} years</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Calculation Result */}
            <div style={{ marginBottom: '20px' }}>
              <p>
                This is the total retirement fund you need to maintain your current lifestyle in{' '}
                <u>&nbsp;&nbsp;{result.yearsUntilRetirement}&nbsp;&nbsp;</u> years (B – A).
              </p>
              <p style={{ marginTop: '12px' }}>
                <strong>Formula:</strong> (12 × C) × D × multiplier = (12 × {monthlyIncome}) × {yearsAfterRetirement} × {result.multiplier.toFixed(4)} ={' '}
                <strong>₱{result.totalRetirementFundNeeded.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </p>
            </div>

            {/* Monthly Savings Recommendation */}
            <div style={{ marginBottom: '30px' }}>
              <p>
                <strong>Recommended monthly savings*:</strong> ₱{monthlySavings.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Footer Disclaimer */}
            <div style={{
              position: 'absolute',
              bottom: '20mm',
              left: '20mm',
              right: '20mm',
              fontSize: '9pt',
              borderTop: '1px solid #000',
              paddingTop: '8px',
              color: '#555'
            }}>
              <p style={{ margin: '4px 0' }}>
                <em>*Assumes a 6% annual return on investment. Actual savings may vary based on market performance.</em>
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Note:</strong> The results of this FNA are for reference only and should not be interpreted as financial advice, recommendation, or offer. Computation assumes an average inflation rate of 4%.
              </p>
              <p style={{ textAlign: 'right', marginTop: '6px', fontWeight: 'bold' }}>
                Caelum Financial Solutions
              </p>
            </div>
          </div>

          <button onClick={handleExportPDF} className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md text-sm cursor-pointer">Export to PDF</button>

          <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-6">RETIREMENT</h1>

          <p className="text-lg text-[#003266] text-center mt-6">
            Based on your retirement plan starting at age {retirementAge}:
          </p>

          <div className="space-y-6 mt-6 mb-14">
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Years until retirement:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                {result.yearsUntilRetirement} years
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Total retirement fund needed:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{result.totalRetirementFundNeeded.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Monthly savings needed to reach goal:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{monthlySavings.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
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
        <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">RETIREMENT</h1>

        <div className="flex justify-center mb-10">
          <div className="relative flex items-center w-[640px]">
            <div className="absolute left-10 right-1 top-6 h-[2px] bg-[#8FA6BF]" />
            {[1,2,3,4,5].map(n => (
              <React.Fragment key={n}>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${currentStep >= n ? "bg-[#003266]" : "bg-[#B7C5D6]"} flex items-center justify-center`}>
                    <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center text-lg">{n}</div>
                  </div>
                  <span className={`text-sm mt-2 ${currentStep >= n ? "text-[#003266]" : "text-[#8FA6BF]"}`}>
                    {n===1?"Question 1":n===2?"Question 2":n===3?"Question 3":n===4?"Question 4":"Review"}
                  </span>
                </div>
                {n!==5 && <div className="flex-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form className="space-y-8">
          {currentStep === 1 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">How old are you?</p>
              <div className="relative w-80 mx-auto">
                <input 
                  type="number" 
                  value={currentAge} 
                  onChange={(e)=>setCurrentAge(e.target.value)} 
                  className="w-full p-3 border rounded-lg text-center" 
                  placeholder="Enter age"
                  min="18"
                  max="99"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">years old</span>
              </div>
              {errors.question1 && <p className="text-red-500 mt-2">{errors.question1}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">At what age do you plan to retire?</p>
              <div className="relative w-80 mx-auto">
                <input 
                  type="number" 
                  value={retirementAge} 
                  onChange={(e)=>setRetirementAge(e.target.value)} 
                  className="w-full p-3 border rounded-lg text-center" 
                  placeholder="Enter age"
                  min="21"
                  max="99"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">years old</span>
              </div>
              {errors.question2 && <p className="text-red-500 mt-2">{errors.question2}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">How much is your monthly income?</p>
              <div className="relative w-80 mx-auto">
                <input 
                  type="number" 
                  value={monthlyIncome} 
                  onChange={(e)=>setMonthlyIncome(e.target.value)} 
                  className="w-full p-3 pl-10 pr-3 border rounded-lg text-center" 
                  placeholder="Enter amount"
                  min="1"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
              </div>
              {errors.question3 && <p className="text-red-500 mt-2">{errors.question3}</p>}
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-6">
                How many years after retirement do you want to receive this amount?
              </p>
              <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
                {[10, 11, 12, 13, 14, 15].map((year) => (
                  <label
                    key={year}
                    className={`flex items-center justify-center w-full h-14 border rounded-lg cursor-pointer transition-all ${
                      yearsAfterRetirement == year
                        ? "bg-[#003266] text-white border-[#003266]"
                        : "bg-white text-[#003266] border-[#8FA6BF]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="yearsAfterRetirement"
                      value={year}
                      checked={yearsAfterRetirement == year}
                      onChange={(e) => setYearsAfterRetirement(e.target.value)}
                      className="hidden"
                    />
                    {year} years
                  </label>
                ))}
              </div>
              {errors.question4 && <p className="text-red-500 mt-3">{errors.question4}</p>}
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center space-y-6">
              <p className="text-lg text-[#003266] mb-4 font-semibold">Review Your Inputs</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border p-4 rounded">
                  <span className="text-[#003266]">Current Age:</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={currentAge} 
                      onChange={(e)=>setCurrentAge(e.target.value)} 
                      className="border rounded px-3 py-2 w-32 text-center" 
                      min="18"
                      max="99"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003266]">years</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border p-4 rounded">
                  <span className="text-[#003266]">Retirement Age:</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={retirementAge} 
                      onChange={(e)=>setRetirementAge(e.target.value)} 
                      className="border rounded px-3 py-2 w-32 text-center" 
                      min="21"
                      max="99"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003266]">years</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border p-4 rounded">
                  <span className="text-[#003266]">Monthly Income:</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={monthlyIncome} 
                      onChange={(e)=>setMonthlyIncome(e.target.value)} 
                      className="border rounded px-3 py-2 w-32 text-center pl-8" 
                      min="1"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003266]">₱</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border p-4 rounded">
                  <span className="text-[#003266]">Years After Retirement:</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={yearsAfterRetirement} 
                      onChange={(e)=>setYearsAfterRetirement(e.target.value)} 
                      className="border rounded px-3 py-2 w-32 text-center" 
                      min="1"
                      max="40"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003266]">years</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">You can edit any field before final submission.</p>
            </div>
          )}
        </form>

        <div className="mt-10 flex justify-between">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="bg-[#003266] text-white px-10 py-3 rounded-md cursor-pointer">Previous</button>
          ) : (
            <Link to="/services/yes_services/SavEdRe" className="text-[#003266] cursor-pointer">Back</Link>
          )}

          <button onClick={handleNext} className="bg-[#003266] text-white px-10 py-3 rounded-md cursor-pointer">{currentStep===5?"Submit":"Next"}</button>
        </div>
      </div>
    </div>
  );
}

export default Retirement;