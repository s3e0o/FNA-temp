import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SavingsResultPDF from "../../../components/pdf/SavingsResultPDF.jsx";

function Savings() {
  const [currentStep, setCurrentStep] = useState(1);
  const [dreams, setDreams] = useState([]);
  const [years, setYears] = useState("");
  const [cost, setCost] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const resultRef = useRef(null);

  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  const [appointmentErrors, setAppointmentErrors] = useState({});

  const [otherDream, setOtherDream] = useState("");

  useEffect(() => {
    document.title = "Savings | Financial Needs Analysis";
  }, []);

  const inflationMultipliers = [
    1.0400, 1.0816, 1.1249, 1.1699, 1.2167, 1.2653, 1.3159, 1.3686, 1.4233, 1.4802,
    1.5395, 1.6010, 1.6651, 1.7317, 1.8009, 1.8730, 1.9479, 2.0258, 2.1068, 2.1911
  ];

  const validateInputs = () => {
    const newErrors = {};

    if (currentStep === 1 && dreams.length === 0) newErrors.dreams = "Please select at least one goal.";
    if (currentStep === 2) {
      if (!years || isNaN(parseInt(years)) || parseInt(years) < 1 || parseInt(years) > 20)
        newErrors.years = "Please enter a valid number of years (1–20).";
    }
    if (currentStep === 3) {
      if (!cost || isNaN(parseFloat(cost)) || parseFloat(cost) <= 0)
        newErrors.cost = "Please enter a valid cost.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateInputs()) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
      else setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const computeResult = () => {
    const yearIndex = parseInt(years) - 1;
    const multiplier =
      inflationMultipliers[yearIndex] || Math.pow(1.04, years);

    return Number(parseFloat(cost) * multiplier).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleDreamChange = (e) => {
    const value = e.target.value;
    if (dreams.includes(value)) {
      setDreams(dreams.filter(d => d !== value));
    } else {
      setDreams([...dreams, value]);
    }
  };

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 10;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 5, 5, width, height);
    pdf.save("Savings-Planning-Result.pdf");
  };

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  const parseNumber = (value) => {
    return value.replace(/,/g, "");
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

  // Helper to get selected dream label
  const getSelectedDreamLabel = () => {
    if (dreams[0] === "Other") {
      return otherDream || "Other";
    }
    return dreams[0] || "";
  };

  if (submitted) {
    const result = computeResult();

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
        <SavingsResultPDF
          ref={resultRef}
          dream={getSelectedDreamLabel()}
          years={parseInt(years) || 0}
          currentCost={parseFloat(cost) || 0}
          futureAmountNeeded={parseFloat(result.replace(/,/g, ''))}
          multiplier={inflationMultipliers[parseInt(years) - 1] || Math.pow(1.04, years)}
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
                <h1 className="text-xl font-bold text-[#003266] mb-3">SAVINGS RESULT</h1>
                <button
                  onClick={handleExportPDF}
                  className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
                >
                  Export to PDF
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
                <p className="text-base text-[#003266] text-center mb-5">
                  To achieve your dream of <span className="font-bold">{getSelectedDreamLabel()}</span> in{" "}
                  <span className="font-bold">{years} years</span>, you will need:
                </p>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 mb-5">
                  <div className="text-base font-bold text-[#003266] text-center">
                    ₱{result}
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
              <h1 className="text-xl font-bold text-[#003266] mb-2">SAVINGS</h1>
            </div>

            <div className="max-w-lg mx-auto">
              {currentStep === 1 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">What are you saving for?</p>
                  <div className="flex flex-col gap-3 mb-4">
                    {["House", "Car", "Business", "Other"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center justify-between bg-white border rounded-lg px-4 py-2.5 shadow hover:shadow-md cursor-pointer ${
                          dreams[0] === option ? "border-[#003266] border-2" : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="dream"
                            value={option}
                            checked={dreams[0] === option}
                            onChange={() => setDreams([option])}
                            className="mr-3 w-4 h-4 accent-[#003266]"
                          />
                          <span className="text-[#003266] font-medium">{option}</span>
                        </div>
                        {option === "Other" && dreams[0] === "Other" && (
                          <input
                            type="text"
                            placeholder="Please specify"
                            value={otherDream}
                            onChange={(e) => setOtherDream(e.target.value)}
                            className="ml-4 px-2 py-1 border rounded text-sm w-32"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  {errors.dreams && <p className="text-red-500 text-sm">{errors.dreams}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    In how many years do you want to fulfill your dream?
                  </p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter years"
                      min="1"
                      max="20"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      YEARS
                    </div>
                  </div>
                  {errors.years && <p className="text-red-500 text-sm">{errors.years}</p>}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    What is the cost of realizing your dream now?
                  </p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter amount"
                      min="0"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      ₱
                    </div>
                  </div>
                  {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Saving For</h3>
                      <select
                        value={dreams[0] || ""}
                        onChange={(e) => setDreams([e.target.value])}
                        className="w-full p-2.5 border rounded text-sm focus:outline-none"
                      >
                        <option value="">Select goal</option>
                        {["House", "Car", "Business", "Other"].map((goal) => (
                          <option key={goal} value={goal}>{goal}</option>
                        ))}
                      </select>
                      {dreams[0] === "Other" && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={otherDream}
                            onChange={(e) => setOtherDream(e.target.value)}
                            placeholder="Specify your goal"
                            className="w-full p-2 border rounded text-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Years Until Goal</h3>
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <input
                          type="number"
                          value={years}
                          onChange={(e) => setYears(e.target.value)}
                          className="flex-grow p-2.5 text-center text-sm focus:outline-none"
                          min="1"
                          max="20"
                        />
                        <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                          YEARS
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 md:col-span-2">
                      <h3 className="text-sm font-bold text-[#003266] mb-3">Current Cost (₱)</h3>
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <input
                          type="number"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
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

export default Savings;