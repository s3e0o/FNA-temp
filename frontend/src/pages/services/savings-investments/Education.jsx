import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import EducationResultPDF from "../../../components/pdf/EducationResultPDF.jsx";

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
  const [customSchoolFee, setCustomSchoolFee] = useState("");
  const resultRef = useRef(null);

  const formatCurrency = (value) => {
    if (isNaN(value) || value === null || value === undefined) return "0.00";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  };

  // School options with annual fees
  const schoolOptions = [
    { name: "UP", fee: 75000 },
    { name: "La Salle", fee: 195000 },
    { name: "Ateneo", fee: 190000 },
    { name: "UST", fee: 120000 },
    { name: "Other", fee: 0 }, // User can input custom amount
  ];

  useEffect(() => {
    document.title = "Financial Needs Analysis | Education";
  }, []);

  const validateCurrentStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!childAge.trim() || isNaN(parseInt(childAge)) || parseInt(childAge) <= 0) {
        newErrors.question1 = "Please enter a valid age (greater than 0).";
      } else if (parseInt(childAge) >= 18) {
        newErrors.question1 = "Child's age should be less than 18 years.";
      }
    } else if (currentStep === 2) {
      if (!selectedSchool.trim()) {
        newErrors.question2 = "Please select a school.";
      } else if (
        selectedSchool === "Other" &&
        (!customSchoolFee.trim() || isNaN(parseFloat(customSchoolFee)) || parseFloat(customSchoolFee) <= 0)
      ) {
        newErrors.question2 = "Please enter a valid annual fee for Other school.";
      }
    } else if (currentStep === 3) {
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
    const school = schoolOptions.find((s) => s.name === selectedSchool);
    return school ? school.fee : 0;
  };

  const computeResult = () => {
    const childAgeNum = parseInt(childAge);
    const yearsUntilCollege = Math.max(0, 18 - childAgeNum);
    const annualFee = getAnnualFee();
    const alreadySaved = parseFloat(savedAmount) || 0;

    const multiplierTable = {
      0: 1.0,
      1: 1.2167,
      2: 1.314,
      3: 1.4191,
      4: 1.5326,
      5: 1.6552,
      6: 1.7877,
      7: 1.9307,
      8: 2.0851,
      9: 2.2519,
      10: 2.4321,
      11: 2.6267,
      12: 2.8368,
      13: 3.0637,
      14: 3.3088,
      15: 3.5735,
      16: 3.8594,
      17: 4.1682,
      18: 4.5016,
      19: 4.8618,
      20: 5.2507,
    };

    const multiplier = multiplierTable[yearsUntilCollege] || 1.0;
    const totalNeededToday = annualFee * 4;
    const futureValue = totalNeededToday * multiplier;
    const remainingNeeded = Math.max(0, futureValue - alreadySaved);

    return {
      yearsUntilCollege,
      annualFee,
      totalNeededToday,
      futureValue,
      alreadySaved,
      remainingNeeded,
    };
  };

  const computeMonthlySavings = () => {
    const result = computeResult();
    const yearsUntilCollege = result.yearsUntilCollege;
    const remainingNeeded = result.remainingNeeded;

    const annualRate = 0.05;
    const monthlyRate = annualRate / 12;
    const totalMonths = yearsUntilCollege * 12;

    if (yearsUntilCollege === 0 || remainingNeeded === 0) return 0;

    const monthlySavings =
      remainingNeeded * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-5">
              <h1 className="text-xl font-bold text-[#003266] text-center mb-8">Appointment Form</h1>
              <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                {["name", "email", "phone", "date", "time"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-bold text-[#003266] mb-2">{field.toUpperCase()}</label>
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
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                    {appointmentErrors[field] && (
                      <p className="text-red-500 text-xs mt-1">{appointmentErrors[field]}</p>
                    )}
                  </div>
                ))}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentForm(false)}
                    className="border-2 border-gray-500 text-gray-500 px-4 py-1.5 rounded-full text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
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
        {/* === HIDDEN PDF TEMPLATE FOR EXPORT === */}
        <EducationResultPDF
          ref={resultRef}
          childAge={parseInt(childAge) || 0}
          selectedSchool={selectedSchool}
          customSchoolFee={parseFloat(customSchoolFee) || 0}
          savedAmount={parseFloat(savedAmount) || 0}
          yearsUntilCollege={result.yearsUntilCollege}
          annualFee={result.annualFee}
          futureValue={result.futureValue}
          remainingNeeded={result.remainingNeeded}
          monthlySavings={monthlySavings}
        />

        {/* === VISIBLE RESULT SECTION === */}
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
                <h1 className="text-xl font-bold text-[#003266] mb-3">EDUCATION RESULT</h1>
                <button
                  onClick={handleExportPDF}
                  className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
                >
                  Export to PDF
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
                <p className="text-base text-[#003266] text-center mb-5">
                  Based on your child's age (<span className="font-bold">{childAge} years</span>) and selected school (<span className="font-bold">{selectedSchool}</span>):
                </p>

                <div className="space-y-4 mb-5">
                  {/* Years Until College */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Years Until College</h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        {result.yearsUntilCollege} years
                      </div>
                    </div>

                    {/* Total Needed */}
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Total Needed (4 yrs)</h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        ₱{formatCurrency(result.futureValue)}
                      </div>
                    </div>
                  </div>

                  {/* Remaining Needed */}
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <h3 className="text-sm font-bold text-[#003266] mb-2 text-center">Remaining Amount Needed</h3>
                    <div className="text-base font-bold text-[#003266] text-center">
                      ₱{formatCurrency(result.remainingNeeded)}
                    </div>
                  </div>

                  {/* Monthly Savings Needed */}
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <h3 className="text-sm font-bold text-[#003266] mb-2 text-center">Monthly Savings Needed (5% return)</h3>
                    <div className="text-base font-bold text-[#003266] text-center">
                      ₱{formatCurrency(monthlySavings)}
                    </div>
                  </div>
                </div>

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
                      className={`w-3 h-3 rounded-full mb-1.5 ${
                        currentStep > index + 1 ? "bg-[#003366]" : currentStep === index + 1 ? "bg-[#003366]" : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        currentStep >= index + 1 ? "text-[#003266]" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
            <div className="text-center mb-5">
              <h1 className="text-xl font-bold text-[#003266] mb-2">EDUCATION</h1>
            </div>

            <div className="max-w-lg mx-auto">
              {currentStep === 1 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">What is the age of your child?</p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input
                      type="number"
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter age"
                      min="1"
                      max="17"
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
                  <p className="text-base text-[#003266] mb-4">
                    Choose a school with the corresponding annual fee you want him/her to attend?
                  </p>
                  <div className="flex flex-col gap-3 mb-4">
                    {schoolOptions.map((school) => (
                      <label
                        key={school.name}
                        className={`flex items-center justify-between bg-white border rounded-lg px-4 py-2.5 shadow hover:shadow-md cursor-pointer ${
                          selectedSchool === school.name ? "border-[#003266] border-2" : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="school"
                            value={school.name}
                            checked={selectedSchool === school.name}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            className="mr-3 w-4 h-4 accent-[#003266]"
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
                    <div className="relative max-w-xs mx-auto mb-4">
                      <input
                        type="number"
                        value={customSchoolFee}
                        onChange={(e) => setCustomSchoolFee(e.target.value)}
                        className="w-full p-2.5 pl-8 pr-3 border rounded text-center focus:outline-none"
                        placeholder="Enter custom annual fee"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003266] text-sm">₱</span>
                    </div>
                  )}

                  {errors.question2 && <p className="text-red-500 text-sm">{errors.question2}</p>}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">How much have you saved for your child's college?</p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input
                      type="number"
                      value={savedAmount}
                      onChange={(e) => setSavedAmount(e.target.value)}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter amount"
                      min="0"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      ₱
                    </div>
                  </div>
                  {errors.question3 && <p className="text-red-500 text-sm">{errors.question3}</p>}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Child's Age</h3>
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <input
                          type="number"
                          value={childAge}
                          onChange={(e) => setChildAge(e.target.value)}
                          className="flex-grow p-2.5 text-center text-sm focus:outline-none"
                          min="1"
                          max="17"
                        />
                        <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                          YEARS
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Selected School</h3>
                      <select
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        className="w-full p-2.5 border rounded text-sm focus:outline-none"
                      >
                        <option value="">Select school</option>
                        {schoolOptions.map((school) => (
                          <option key={school.name} value={school.name}>
                            {school.name} {school.name !== "Other" ? `(₱${school.fee.toLocaleString()})` : ""}
                          </option>
                        ))}
                      </select>
                      {selectedSchool === "Other" && (
                        <div className="mt-2 flex border border-gray-300 rounded overflow-hidden">
                          <input
                            type="number"
                            value={customSchoolFee}
                            onChange={(e) => setCustomSchoolFee(e.target.value)}
                            className="flex-grow p-2 text-center text-sm focus:outline-none"
                            placeholder="Custom fee"
                          />
                          <div className="bg-gray-100 px-2 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                            ₱
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 md:col-span-2">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Amount Saved</h3>
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <input
                          type="number"
                          value={savedAmount}
                          onChange={(e) => setSavedAmount(e.target.value)}
                          className="flex-grow p-2.5 text-center text-sm focus:outline-none"
                          min="0"
                        />
                        <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                          ₱
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
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
                to="/services/yes_services/SavEdRe"
                className="border-2 border-[#003366] text-[#003366] px-5 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
              >
                Back
              </Link>
            )}
            <button
              onClick={handleNext}
              className="border-2 border-[#003366] text-[#003366] px-6 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
            >
              {currentStep === 4 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;