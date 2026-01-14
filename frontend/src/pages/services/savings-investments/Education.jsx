import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Education() {
  const [currentStep, setCurrentStep] = useState(1);
  const [childAge, setChildAge] = useState(""); // Question 1: Child's age
  const [selectedSchool, setSelectedSchool] = useState(""); // Question 2: Selected school
  const [savedAmount, setSavedAmount] = useState(""); // Question 3: Amount saved
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

  // School options with annual fees
  const schoolOptions = [
    { name: "UP", fee: 75000 },
    { name: "La Salle", fee: 195000 },
    { name: "Ateneo", fee: 190000 },
    { name: "UST", fee: 120000 },
    { name: "Other", fee: 0 } // User can input custom amount
  ];

  const [customSchoolFee, setCustomSchoolFee] = useState("");

  useEffect(() => {
    document.title = "Financial Needs Analysis | Education";
  }, []);

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      // Question 1 validation (child's age)
      if (!childAge.trim() || isNaN(parseInt(childAge)) || parseInt(childAge) <= 0) {
        newErrors.question1 = "Please enter a valid age (greater than 0).";
      } else if (parseInt(childAge) >= 18) {
        newErrors.question1 = "Child's age should be less than 18 years.";
      }
    } else if (currentStep === 2) {
      // Question 2 validation (school selection)
      if (!selectedSchool.trim()) {
        newErrors.question2 = "Please select a school.";
      } else if (selectedSchool === "Other" && (!customSchoolFee.trim() || isNaN(parseFloat(customSchoolFee)) || parseFloat(customSchoolFee) <= 0)) {
        newErrors.question2 = "Please enter a valid annual fee for Other school.";
      }
    } else if (currentStep === 3) {
      // Question 3 validation (amount saved)
      if (!savedAmount.trim() || isNaN(parseFloat(savedAmount)) || parseFloat(savedAmount) < 0) {
        newErrors.question3 = "Please enter a valid amount (0 or greater).";
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

  // Calculate years until college (assume college starts at age 18)
  const getYearsUntilCollege = () => {
    const age = parseInt(childAge);
    return Math.max(0, 18 - age);
  };

  // Get annual fee based on school selection
  const getAnnualFee = () => {
    if (selectedSchool === "Other") {
      return parseFloat(customSchoolFee) || 0;
    }
    const school = schoolOptions.find(s => s.name === selectedSchool);
    return school ? school.fee : 0;
  };

  const computeResult = () => {
    const yearsUntilCollege = getYearsUntilCollege();
    const annualFee = getAnnualFee();
    const alreadySaved = parseFloat(savedAmount) || 0;
    
    // Assume 4-year college program
    const totalCollegeYears = 4;
    const totalFeeToday = annualFee * totalCollegeYears;
    
    // Inflation multiplier (assuming 4% annual inflation)
    const inflationMultiplier = Math.pow(1.04, yearsUntilCollege);
    
    // Future value adjusted for inflation
    const futureValue = totalFeeToday * inflationMultiplier;
    
    // Subtract what's already saved
    const remainingNeeded = Math.max(0, futureValue - alreadySaved);
    
    return {
      yearsUntilCollege,
      annualFee,
      totalFeeToday,
      futureValue,
      alreadySaved,
      remainingNeeded
    };
  };

  const computeMonthlySavings = () => {
    const result = computeResult();
    const yearsUntilCollege = result.yearsUntilCollege;
    const remainingNeeded = result.remainingNeeded;
    
    // Calculate monthly savings needed assuming 5% annual return
    const annualRate = 0.05;
    const monthlyRate = annualRate / 12;
    const totalMonths = yearsUntilCollege * 12;
    
    if (yearsUntilCollege === 0 || remainingNeeded === 0) return 0;
    
    // Future value of annuity formula: FV = PMT * [(1 + r)^n - 1] / r
    // Rearranged to solve for PMT: PMT = FV * r / [(1 + r)^n - 1]
    const monthlySavings = remainingNeeded * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
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
    pdf.save("Education-Planning-Result.pdf");
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

          <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-6">EDUCATION</h1>

          <p className="text-lg text-[#003266] text-center mt-6">
            Based on your child's age ({childAge} years) and selected school ({selectedSchool}):
          </p>

          <div className="space-y-6 mt-6 mb-14">
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Years until college starts:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                {result.yearsUntilCollege} years
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Total amount needed for 4-year college:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{result.futureValue.toFixed(2)}
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-[#003266] mb-2">Monthly savings needed:</p>
              <div className="w-80 mx-auto py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
                ₱{monthlySavings.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-between">
          <Link to="/FNA/AppointmentForm">
            <button className="bg-[#003266] text-white px-6 py-3 rounded-md">
              Book an Appointment
            </button>
          </Link>

          <Link to="/FNA/OurServices">
            <button className="bg-[#003266] text-white px-6 py-3 rounded-md">
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
        <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">EDUCATION</h1>

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
              <p className="text-lg text-[#003266] mb-8">What is the age of your child?</p>
              <div className="relative w-80 mx-auto">
                <input 
                  type="number" 
                  value={childAge} 
                  onChange={(e)=>setChildAge(e.target.value)} 
                  className="w-full p-3 border rounded-lg text-center" 
                  placeholder="Enter age"
                  min="1"
                  max="17"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">year/s old</span>
              </div>
              {errors.question1 && <p className="text-red-500 mt-2">{errors.question1}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">Choose a school with the corresponding annual fee you want him/her to attend?</p>
              
              <div className="flex flex-col gap-4 w-80 mx-auto mb-6">
                {schoolOptions.map((school) => (
                  <label
                    key={school.name}
                    className={`flex items-center justify-between bg-white border rounded-lg px-4 py-3 shadow hover:shadow-md cursor-pointer ${
                      selectedSchool === school.name ? 'border-[#003266] border-2' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="school"
                        value={school.name}
                        checked={selectedSchool === school.name}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        className="mr-3 w-5 h-5 accent-[#003266]"
                      />
                      <span className="text-[#003266] font-medium">{school.name}</span>
                    </div>
                    {school.name !== "Other" && (
                      <span className="text-[#003266] font-medium">₱{school.fee.toLocaleString()}</span>
                    )}
                  </label>
                ))}
              </div>

              {selectedSchool === "Other" && (
                <div className="w-80 mx-auto mt-4">
                  <div className="relative">
                    <input 
                      type="number" 
                      value={customSchoolFee} 
                      onChange={(e)=>setCustomSchoolFee(e.target.value)} 
                      className="w-full p-3 pl-10 pr-3 border rounded-lg" 
                      placeholder="Enter custom annual fee"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                  </div>
                </div>
              )}
              
              {errors.question2 && <p className="text-red-500 mt-2">{errors.question2}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">How much have you saved for your child's college?</p>
              <div className="relative w-80 mx-auto">
                <input 
                  type="number" 
                  value={savedAmount} 
                  onChange={(e)=>setSavedAmount(e.target.value)} 
                  className="w-full p-3 pl-10 pr-3 border rounded-lg text-center" 
                  placeholder="Enter amount"
                  min="0"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
              </div>
              {errors.question3 && <p className="text-red-500 mt-2">{errors.question3}</p>}
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <p className="text-lg text-[#003266] mb-4 font-semibold">Review Your Inputs</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border p-4 rounded">
                  <span className="text-[#003266]">Child's Age:</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={childAge} 
                      onChange={(e)=>setChildAge(e.target.value)} 
                      className="border rounded px-3 py-2 w-32 text-center" 
                      min="1"
                      max="17"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003266]">years</span>
                  </div>
                </div>
                
                <div className="border p-4 rounded">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-[#003266]">Selected School:</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#003266]">School:</span>
                      <select 
                        value={selectedSchool} 
                        onChange={(e)=>setSelectedSchool(e.target.value)} 
                        className="border rounded px-3 py-2 w-48"
                      >
                        <option value="">Select school</option>
                        {schoolOptions.map(school => (
                          <option key={school.name} value={school.name}>
                            {school.name} {school.name !== "Other" ? `(₱${school.fee.toLocaleString()})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedSchool === "Other" && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#003266]">Custom Annual Fee:</span>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={customSchoolFee} 
                            onChange={(e)=>setCustomSchoolFee(e.target.value)} 
                            className="border rounded px-3 py-2 w-32 text-center pl-8" 
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003266]">₱</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center border p-4 rounded">
                  <span className="text-[#003266]">Amount Saved:</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={savedAmount} 
                      onChange={(e)=>setSavedAmount(e.target.value)} 
                      className="border rounded px-3 py-2 w-32 text-center pl-8" 
                      min="0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003266]">₱</span>
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

          <button onClick={handleNext} className="bg-[#003266] text-white px-10 py-3 rounded-md">{currentStep===4?"Submit":"Next"}</button>
        </div>
      </div>
    </div>
  );
}

export default Education;