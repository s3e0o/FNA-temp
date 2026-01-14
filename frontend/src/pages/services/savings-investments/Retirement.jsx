import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Retirement() {
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
    document.title = "Financial Needs Analysis | Retirement";
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
      // Question 4 validation (years after retirement)
      if (!yearsAfterRetirement.trim() || isNaN(parseInt(yearsAfterRetirement)) || parseInt(yearsAfterRetirement) <= 0) {
        newErrors.question4 = "Please enter a valid number of years (greater than 0).";
      } else if (parseInt(yearsAfterRetirement) > 40) {
        newErrors.question4 = "Please enter a realistic number of years (40 or less).";
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
    
    // Years until retirement
    const yearsUntilRetirement = retirementAgeNum - currentAgeNum;
    
    // Annual income needed during retirement (assuming 70% of current income)
    const retirementIncomeRatio = 0.7; // 70% of current income
    const annualRetirementIncome = monthlyIncomeNum * 12 * retirementIncomeRatio;
    
    // Total amount needed for retirement (annual income × years after retirement)
    const totalNeeded = annualRetirementIncome * yearsAfterRetirementNum;
    
    // Inflation multiplier (assuming 4% annual inflation)
    const inflationMultiplier = Math.pow(1.04, yearsUntilRetirement);
    
    // Future value adjusted for inflation
    const futureValue = totalNeeded * inflationMultiplier;
    
    return {
      yearsUntilRetirement,
      retirementIncomeRatio,
      annualRetirementIncome,
      totalNeeded,
      inflationMultiplier,
      futureValue
    };
  };

  const computeMonthlySavings = () => {
    const result = computeResult();
    const yearsUntilRetirement = result.yearsUntilRetirement;
    const futureValue = result.futureValue;
    
    // Calculate monthly savings needed assuming 6% annual return
    const annualRate = 0.06;
    const monthlyRate = annualRate / 12;
    const totalMonths = yearsUntilRetirement * 12;
    
    if (yearsUntilRetirement === 0 || futureValue === 0) return 0;
    
    // Future value of annuity formula: FV = PMT * [(1 + r)^n - 1] / r
    // Rearranged to solve for PMT: PMT = FV * r / [(1 + r)^n - 1]
    const monthlySavings = futureValue * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
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
          <button onClick={handleExportPDF} className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md text-sm">Export to PDF</button>

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
              <p className="text-lg text-[#003266] mb-2">Annual retirement income needed (70% of current):</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{result.annualRetirementIncome.toFixed(2)}
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Total retirement fund needed:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{result.futureValue.toFixed(2)}
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Monthly savings needed to reach goal:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{monthlySavings.toFixed(2)}
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
              <p className="text-lg text-[#003266] mb-8">How many years after retirement do you want to receive this amount?</p>
              <div className="relative w-80 mx-auto">
                <input 
                  type="number" 
                  value={yearsAfterRetirement} 
                  onChange={(e)=>setYearsAfterRetirement(e.target.value)} 
                  className="w-full p-3 border rounded-lg text-center" 
                  placeholder="Enter years"
                  min="1"
                  max="40"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">years</span>
              </div>
              {errors.question4 && <p className="text-red-500 mt-2">{errors.question4}</p>}
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
            <button onClick={handleBack} className="bg-[#003266] text-white px-10 py-3 rounded-md">Previous</button>
          ) : (
            <Link to="/services/savings-investments" className="text-[#003266]">Back</Link>
          )}

          <button onClick={handleNext} className="bg-[#003266] text-white px-10 py-3 rounded-md">{currentStep===5?"Submit":"Next"}</button>
        </div>
      </div>
    </div>
  );
}

export default Retirement;