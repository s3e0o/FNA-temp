import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { MdInfoOutline } from "react-icons/md";
import SavingsResultPDF from "../../../components/pdf/SavingsResultPDF.jsx";

// Helper: Format number with commas for display (max 9 digits)
const formatNumberWithCommas = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/[^0-9]/g, "");
  const truncated = cleaned.slice(0, 9);
  return truncated.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function Savings() {
  const [currentStep, setCurrentStep] = useState(1);
  const [dreams, setDreams] = useState([]);
  const [years, setYears] = useState("");
  const [cost, setCost] = useState(""); // stores clean digit string (e.g., "1000000")
  const [otherDream, setOtherDream] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const [displayFutureValue, setDisplayFutureValue] = useState(0);
  const [displayMonthlySavings, setDisplayMonthlySavings] = useState(0);
  const [displayFutureAmount, setDisplayFutureAmount] = useState(0);

  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  const [appointmentErrors, setAppointmentErrors] = useState({});

  const resultRef = useRef(null);

  const handleReset = () => {
    setDreams([]);
    setOtherDream("");
    setYears("");
    setCost("");
    setErrors({});
    setCurrentStep(1);
    setDisplayFutureAmount(0);
  };

  const inflationMultipliers = [
    1.0400, 1.0816, 1.1249, 1.1699, 1.2167, 1.2653, 1.3159, 1.3686, 1.4233, 1.4802,
    1.5395, 1.6010, 1.6651, 1.7317, 1.8009, 1.8730, 1.9479, 2.0258, 2.1068, 2.1911
  ];

  // Animation when entering review step
  useEffect(() => {
    if (currentStep !== 4) return;

    const futureAmount = Number(cost || 0) * (inflationMultipliers[parseInt(years) - 1] || Math.pow(1.04, Number(years) || 0));

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

    animate(displayFutureAmount, Math.round(futureAmount), 1400, setDisplayFutureAmount);
  }, [currentStep, years, cost]);

  const validateInputs = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (dreams.length === 0) {
        newErrors.dreams = "Please select at least one goal.";
      } else if (dreams[0] === "Other") {
        if (!otherDream.trim()) {
          newErrors.otherDream = "Please specify what you are saving for.";
        }
      }
    }
    if (currentStep === 2) {
      const y = parseInt(years);
      if (!years || isNaN(y) || y < 1 || y > 20)
        newErrors.years = "Please enter a valid number of years (1–20).";
    }
    if (currentStep === 3) {
      const c = parseFloat(cost);
      if (!cost || isNaN(c) || c <= 0)
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
    const multiplier = inflationMultipliers[yearIndex] || Math.pow(1.04, Number(years) || 0);
    return Number(parseFloat(cost || 0) * multiplier).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleDreamChange = (value) => {
    if (dreams[0] === value) {
      setDreams([]);
    } else {
      setDreams([value]);
    }
  };

  // ✅ NEW: Handle cost input with formatting & digit limit
  const handleCostChange = (e) => {
    let value = e.target.value;
    const digitsOnly = value.replace(/[^0-9]/g, "");
    const limited = digitsOnly.slice(0, 9); // max 9 digits
    setCost(limited);
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

  const getSelectedDreamLabel = () => {
    if (dreams[0] === "Other") return otherDream.trim() || "Other";
    return dreams[0] || "";
  };

  if (submitted) {
    const result = computeResult();

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
        <SavingsResultPDF
          ref={resultRef}
          dream={getSelectedDreamLabel()}
          years={parseInt(years) || 0}
          currentCost={parseFloat(cost) || 0}
          futureAmountNeeded={parseFloat(result.replace(/,/g, ''))}
          multiplier={inflationMultipliers[parseInt(years) - 1] || Math.pow(1.04, Number(years))}
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
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-[#003266] mb-3">
                  SAVINGS RESULT
                </h1>
                <button
                  onClick={handleExportPDF}
                  className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                >
                  Export to PDF
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
                <p className="text-base text-[#003266] text-center mb-5">
                  To achieve your dream of <span className="font-bold">{getSelectedDreamLabel()}</span> in{" "}
                  <span className="font-bold">{years} years</span>, you will need:
                </p>

                <div className="flex justify-center mb-6">
                  <div className="w-64 py-5 text-center text-2xl font-bold border border-[#003266] rounded-lg bg-blue-50">
                    ₱{result}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  <button
                    onClick={handleBookAppointment}
                    className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
                  >
                    Book Appointment
                  </button>
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
              <h1 className="text-xl font-bold text-[#003266] mb-2">SAVINGS</h1>
            </div>

            <div className="max-w-lg mx-auto">
              {currentStep === 1 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">What are you saving for?</p>
                  <div className="space-y-3">
                    {["House", "Car", "Business", "Other"].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleDreamChange(option)}
                        className={`w-full py-3 px-4 rounded-lg font-medium cursor-pointer transition-all text-left ${
                          dreams[0] === option
                            ? "bg-[#003366] text-white shadow-md"
                            : "bg-gray-100 hover:bg-gray-200 text-[#003266]"
                        }`}
                      >
                        {option}
                        {option === "Other" && dreams[0] === "Other" && (
                          <input
                            type="text"
                            placeholder="Please specify"
                            value={otherDream}
                            onChange={(e) => setOtherDream(e.target.value)}
                            className="mt-2 w-full px-3 py-2 bg-white text-[#003266] rounded border border-gray-300 focus:outline-none focus:border-[#003366]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.dreams && <p className="text-red-500 text-sm mt-4">{errors.dreams}</p>}
                  {errors.otherDream && <p className="text-red-500 text-sm mt-2">{errors.otherDream}</p>}
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
                      className="flex-grow p-2.5 text-center text-base focus:outline-none focus:border-[#003366]"
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
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-sm">
                      ₱
                    </div>
                    <input
                      type="text" // ✅ changed from "number"
                      value={formatNumberWithCommas(cost)}
                      onChange={handleCostChange}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none focus:border-[#003366]"
                      placeholder="Enter amount"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                  {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-[#003266] text-center mb-4">
                    Review & Edit Your Answers
                  </h2>

                  <div className="bg-blue-50 border border-[#003266] rounded-lg p-5 mb-6 text-center shadow-sm">
                    <p className="text-base text-[#003266] mb-4">
                      Estimated Future Amount Needed:
                    </p>
                    <div className="text-3xl font-bold text-[#003266] tabular-nums">
                      ₱{displayFutureAmount.toLocaleString("en-PH")}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-[#003266] mb-2">Saving For</h3>
                        <select
                          value={dreams[0] || ""}
                          onChange={(e) => setDreams([e.target.value])}
                          className="w-full p-2.5 border rounded text-sm focus:outline-none focus:border-[#003366]"
                        >
                          <option value="">Select goal</option>
                          {["House", "Car", "Business", "Other"].map((goal) => (
                            <option key={goal} value={goal}>{goal}</option>
                          ))}
                        </select>

                        {dreams[0] === "Other" && (
                          <input
                            type="text"
                            value={otherDream}
                            onChange={(e) => setOtherDream(e.target.value)}
                            placeholder="Specify your goal"
                            className="mt-3 w-full p-2 border rounded text-sm focus:outline-none focus:border-[#003366]"
                          />
                        )}
                      </div>

                      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-[#003266] mb-2">Years Until Goal</h3>
                        <div className="flex border border-gray-300 rounded overflow-hidden">
                          <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                            className="flex-grow p-2.5 text-center text-sm focus:outline-none focus:border-[#003366]"
                            min="1"
                            max="20"
                          />
                          <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                            YEARS
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3 text-center">
                        Current Cost of Your Goal
                      </h3>
                      <div className="flex border border-gray-300 rounded overflow-hidden max-w-md mx-auto">
                        <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-sm">
                          ₱
                        </div>
                        <input
                          type="text" // ✅ changed from "number"
                          value={formatNumberWithCommas(cost)}
                          onChange={handleCostChange}
                          className="flex-grow p-2.5 text-center text-sm focus:outline-none focus:border-[#003366]"
                          placeholder="Enter amount"
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
                className="border-2 border-[#003366] text-[#003366] px-5 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
              >
                Back
              </button>
            ) : (
              <Link
                to="/services/yes_services/SavEdRe"
                className="border-2 border-[#003366] text-[#003366] px-5 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
              >
                Back
              </Link>
            )}

            <button
              onClick={handleNext}
              className="border-2 border-[#003366] text-[#003366] px-6 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm cursor-pointer"
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