import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { MdInfoOutline } from "react-icons/md";
import EducationResultPDF from "../../../components/pdf/EducationResultPDF.jsx";

// Helper: Format number with commas (max 9 digits)
const formatNumberWithCommas = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/[^0-9]/g, "");
  const truncated = cleaned.slice(0, 9);
  return truncated.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function Education() {
  const [currentStep, setCurrentStep] = useState(1);
  const [childAge, setChildAge] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [savedAmount, setSavedAmount] = useState(""); // clean digit string
  const [customSchoolFee, setCustomSchoolFee] = useState(""); // clean digit string
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

  // Animation values
  const [displayFutureValue, setDisplayFutureValue] = useState(0);
  const [displayMonthlySavings, setDisplayMonthlySavings] = useState(0);

  const resultRef = useRef(null);

  // School options with annual fees
  const schoolOptions = [
    { name: "UP", fee: 75000 },
    { name: "La Salle", fee: 195000 },
    { name: "Ateneo", fee: 190000 },
    { name: "UST", fee: 120000 },
    { name: "Other", fee: 0 },
  ];

  useEffect(() => {
    document.title = "Financial Needs Analysis | Education";
  }, []);

  // Animation effect when entering review step
  useEffect(() => {
    if (currentStep !== 4) return;

    const result = computeResult();
    const monthly = computeMonthlySavings();

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

    animate(displayFutureValue, Math.round(result.futureValue), 1400, setDisplayFutureValue);
    animate(displayMonthlySavings, Math.round(monthly), 1600, setDisplayMonthlySavings);
  }, [currentStep, childAge, selectedSchool, customSchoolFee, savedAmount]);

  const formatCurrency = (value) => {
    if (isNaN(value) || value == null) return "0.00";
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  };

  // ✅ Handle savedAmount input
  const handleSavedAmountChange = (e) => {
    let value = e.target.value;
    const digitsOnly = value.replace(/[^0-9]/g, "");
    const limited = digitsOnly.slice(0, 9); // max 9 digits
    setSavedAmount(limited);
  };

  // ✅ Handle customSchoolFee input
  const handleCustomSchoolFeeChange = (e) => {
    let value = e.target.value;
    const digitsOnly = value.replace(/[^0-9]/g, "");
    const limited = digitsOnly.slice(0, 9); // max 9 digits
    setCustomSchoolFee(limited);
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      const age = parseInt(childAge);
      if (!childAge.trim() || isNaN(age) || age <= 0) {
        newErrors.question1 = "Please enter a valid age (greater than 0).";
      } else if (age >= 18) {
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
      const amount = parseFloat(savedAmount);
      if (!savedAmount.trim() || isNaN(amount) || amount < 0) {
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

  const handleReset = () => {
    setChildAge("");
    setSelectedSchool("");
    setCustomSchoolFee("");
    setSavedAmount("");
    setErrors({});
    setCurrentStep(1);
    setDisplayFutureValue(0);
    setDisplayMonthlySavings(0);
  };

  const getYearsUntilCollege = () => {
    const age = parseInt(childAge);
    return Math.max(0, 18 - age);
  };

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
      0: 1.0, 1: 1.2167, 2: 1.314, 3: 1.4191, 4: 1.5326, 5: 1.6552,
      6: 1.7877, 7: 1.9307, 8: 2.0851, 9: 2.2519, 10: 2.4321,
      11: 2.6267, 12: 2.8368, 13: 3.0637, 14: 3.3088, 15: 3.5735,
      16: 3.8594, 17: 4.1682, 18: 4.5016, 19: 4.8618, 20: 5.2507,
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

    return (
      remainingNeeded * monthlyRate /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
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
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
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
        <div
          className="min-h-auto pt-32 px-4 pb-16"
          style={{
            backgroundImage: `url("/background.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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

        <div
          className="min-h-auto pt-32 px-4 pb-16"
          style={{
            backgroundImage: `url("/background.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Link
            to="/FNA/door"
            className="relative inline-block text-[#395998] font-medium mb-4 ml-4 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[1.5px] after:bg-[#F4B43C] after:transition-all after:duration-300 hover:after:w-full text-sm"
          >
            ← Back to Doors
          </Link>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-5">
              {/* ✅ ADDED: Export to PDF button */}
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-[#003266] mb-3">
                  EDUCATION RESULT
                </h1>
                <button
                  onClick={handleExportPDF}
                  className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
                >
                  Export to PDF
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
                <p className="text-base text-[#003266] text-center mb-5">
                  For a <span className="font-bold">{childAge}-year-old</span> aiming for <span className="font-bold">{selectedSchool}</span>:
                </p>

                <div className="flex justify-center mb-6">
                  <div className="w-72 py-6 text-center text-2xl font-bold border border-[#003266] rounded-lg bg-blue-50">
                    ₱{formatCurrency(result.futureValue)}
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 text-center">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Years Until College</h3>
                      <div className="text-xl font-bold text-[#003266]">
                        {result.yearsUntilCollege} yrs
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 text-center">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Remaining Needed</h3>
                      <div className="text-xl font-bold text-[#003266]">
                        ₱{formatCurrency(result.remainingNeeded)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 text-center">
                      <h3 className="text-sm font-bold text-[#003266] mb-2">Monthly Savings (5%)</h3>
                      <div className="text-xl font-bold text-[#003266]">
                        ₱{formatCurrency(monthlySavings)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-gray-300">
                  <button
                    onClick={handleBookAppointment}
                    className="border-2 border-[#003366] text-[#003366] px-5 py-2 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
                  >
                    Book Appointment
                  </button>
                  <Link to="/FNA/OurServices">
                    <button className="border-2 border-[#003366] text-[#003366] px-5 py-2 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm">
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
    <div
      className="min-h-auto pt-32 px-4 pb-16"
      style={{
        backgroundImage: `url("/background.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-5">
          {/* Progress Bar */}
          <div className="mb-5">
            <div className="relative">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#003366] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {["Question 1", "Question 2", "Question 3", "Review"].map((label, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full mb-1.5 ${
                        currentStep > i + 1
                          ? "bg-[#003366]"
                          : currentStep === i + 1
                          ? "bg-[#003366]"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        currentStep >= i + 1 ? "text-[#003266]" : "text-gray-500"
                      }`}
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
                      className="flex-grow p-2.5 text-center text-base focus:outline-none focus:border-[#003366]"
                      placeholder="Enter age"
                      min="1"
                      max="17"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      YEARS
                    </div>
                  </div>
                  {errors.question1 && <p className="text-red-500 text-sm">{errors.question1}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    Choose the school you want your child to attend
                  </p>
                  <div className="space-y-3">
                    {schoolOptions.map((school) => (
                      <label
                        key={school.name}
                        className={`flex items-center justify-between bg-white border rounded-lg px-4 py-3 shadow hover:shadow-md cursor-pointer ${
                          selectedSchool === school.name ? "border-[#003366] border-2" : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="school"
                            value={school.name}
                            checked={selectedSchool === school.name}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            className="mr-3 w-4 h-4 accent-[#003366]"
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
                    <div className="mt-4 max-w-xs mx-auto">
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-sm">
                          ₱
                        </div>
                        {/* ✅ Formatted custom school fee */}
                        <input
                          type="text"
                          value={formatNumberWithCommas(customSchoolFee)}
                          onChange={handleCustomSchoolFeeChange}
                          className="flex-grow p-2.5 text-center text-base focus:outline-none focus:border-[#003366]"
                          placeholder="Enter annual fee"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </div>
                    </div>
                  )}

                  {errors.question2 && <p className="text-red-500 text-sm mt-4">{errors.question2}</p>}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    How much have you already saved for college?
                  </p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-sm">
                      ₱
                    </div>
                    {/* ✅ Formatted saved amount */}
                    <input
                      type="text"
                      value={formatNumberWithCommas(savedAmount)}
                      onChange={handleSavedAmountChange}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none focus:border-[#003366]"
                      placeholder="Enter amount"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                  {errors.question3 && <p className="text-red-500 text-sm">{errors.question3}</p>}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Live Results Preview */}
                  <div className="bg-blue-50 border border-[#003266] rounded-lg p-6 text-center shadow-sm">
                    <p className="text-base text-[#003266] mb-5 font-medium">
                      Estimated Results (updates live):
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Future College Cost (4 years)</div>
                        <div className="text-2xl md:text-3xl font-bold text-[#003266] tabular-nums">
                          ₱{displayFutureValue.toLocaleString("en-PH")}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Monthly Savings Needed (5% return)</div>
                        <div className="text-2xl md:text-3xl font-bold text-[#003266] tabular-nums">
                          ₱{displayMonthlySavings.toLocaleString("en-PH")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-[#003266]">Child's Current Age</h3>
                          <MdInfoOutline size={16} className="text-[#003266] cursor-help" title="Age today" />
                        </div>
                        <div className="flex border border-gray-300 rounded overflow-hidden">
                          <input
                            type="number"
                            value={childAge}
                            onChange={(e) => setChildAge(e.target.value)}
                            className="flex-grow p-3 text-center focus:outline-none focus:border-[#003366]"
                            min="1"
                            max="17"
                          />
                          <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                            YEARS
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-[#003266]">Target School</h3>
                          <MdInfoOutline size={16} className="text-[#003266] cursor-help" title="School & annual tuition" />
                        </div>
                        <select
                          value={selectedSchool}
                          onChange={(e) => setSelectedSchool(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#003366]"
                        >
                          <option value="">Select school</option>
                          {schoolOptions.map((school) => (
                            <option key={school.name} value={school.name}>
                              {school.name} {school.name !== "Other" ? `(₱${school.fee.toLocaleString()})` : ""}
                            </option>
                          ))}
                        </select>

                        {selectedSchool === "Other" && (
                          <div className="mt-3 flex border border-gray-300 rounded overflow-hidden">
                            <div className="bg-gray-100 px-4 flex items-center font-bold text-[#003266] border-r border-gray-300 text-base">
                              ₱
                            </div>
                            {/* ✅ Formatted custom school fee */}
                            <input
                              type="text"
                              value={formatNumberWithCommas(customSchoolFee)}
                              onChange={handleCustomSchoolFeeChange}
                              className="flex-grow p-3 text-center focus:outline-none focus:border-[#003366]"
                              placeholder="Annual fee"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-[#003266]">Amount Already Saved</h3>
                        <MdInfoOutline size={16} className="text-[#003266] cursor-help" title="Current savings" />
                      </div>
                      <div className="flex border border-gray-300 rounded overflow-hidden max-w-md mx-auto">
                        <div className="bg-gray-100 px-5 flex items-center font-bold text-[#003266] border-r border-gray-300 text-base">
                          ₱
                        </div>
                        {/* ✅ Formatted saved amount */}
                        <input
                          type="text"
                          value={formatNumberWithCommas(savedAmount)}
                          onChange={handleSavedAmountChange}
                          className="flex-grow p-3 text-center focus:outline-none focus:border-[#003366]"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
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