import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import HealthResultPDF from "../../../components/pdf/HealthResultPDF.jsx";

const formatNumberWithCommas = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/[^0-9]/g, "");
  const truncated = cleaned.slice(0, 10); 
  return truncated.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function HealthServices() {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthQuestion1, setHealthQuestion1] = useState("");
  const [healthQuestion2, setHealthQuestion2] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [displayYears, setDisplayYears] = useState(0);

  const resultRef = useRef(null);

  useEffect(() => {
    document.title = "Health Services | Financial Needs Analysis";
  }, []);

  const getCleanNumber = (str) => parseFloat(str.replace(/,/g, "")) || 0;

  const computeResult = () => {
    const goal = getCleanNumber(healthQuestion1);
    const monthly = getCleanNumber(healthQuestion2);
    if (monthly <= 0) return 0;
    return goal / (12 * monthly);
  };

  useEffect(() => {
    if (currentStep !== 3) {
      setDisplayYears(0);
      return;
    }

    const raw = computeResult();
    const target = parseFloat(raw.toFixed(2));

    const animate = (start, end, duration, setter) => {
      if (Math.abs(end - start) < 0.01) {
        setter(end);
        return;
      }
      let startTime = null;
      const stepAnim = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const t = Math.min((timestamp - startTime) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        setter(start + (end - start) * eased);
        if (t < 1) requestAnimationFrame(stepAnim);
        else setter(end);
      };
      requestAnimationFrame(stepAnim);
    };

    animate(displayYears, target, 1400, setDisplayYears);
  }, [currentStep, healthQuestion1, healthQuestion2]);

  const validateCurrentStep = () => {
    const newErrors = {};
    const goal = getCleanNumber(healthQuestion1);
    const monthly = getCleanNumber(healthQuestion2);

    if (currentStep === 1 || currentStep === 3) {
      if (!healthQuestion1.trim() || isNaN(goal) || goal <= 0) {
        newErrors.question1 = "Please enter a valid amount greater than 0.";
      }
    }

    if (currentStep === 2 || currentStep === 3) {
      if (!healthQuestion2.trim() || isNaN(monthly) || monthly <= 0) {
        newErrors.question2 = "Please enter a valid monthly amount greater than 0.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
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

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 10;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 5, 5, width, height);
    pdf.save("Health-Services-Result.pdf");
  };

  if (submitted) {
    const goal = getCleanNumber(healthQuestion1);
    const monthly = getCleanNumber(healthQuestion2);
    const years = computeResult().toFixed(2);

    return (
      <>
        <HealthResultPDF
          ref={resultRef}
          healthFundNeeded={goal}
          monthlyContribution={monthly}
          yearsToGoal={parseFloat(years)}
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-[#003266] mb-3">HEALTH SERVICES RESULT</h1>
                <button
                  onClick={handleExportPDF}
                  className="border-2 border-[#003366] bg-[#003366] text-white px-6 py-2 rounded-full font-medium hover:bg-[#002244] transition-colors duration-200 text-sm shadow-sm"
                >
                  Export to PDF
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg shadow p-6 mb-6 border border-[#003366]/30">
                <p className="text-base text-[#003266] text-center mb-4">
                  With a health fund goal of{" "}
                  <span className="font-bold">₱{formatNumberWithCommas(goal.toFixed(0))}</span>
                  <br />
                  and monthly savings of{" "}
                  <span className="font-bold">₱{formatNumberWithCommas(monthly.toFixed(0))}</span>
                </p>

                <div className="flex justify-center">
                  <div className="w-80 py-6 text-center text-3xl font-bold border-2 border-[#003366] rounded-xl bg-white shadow-md">
                    {years} year{parseFloat(years) !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-gray-300">
                <Link to="/FNA/AppointmentForm">
                  <button className="border-2 border-[#003366] text-[#003366] px-6 py-2 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm">
                    Book Appointment
                  </button>
                </Link>
                <Link to="/FNA/OurServices">
                  <button className="border-2 border-[#003366] text-[#003366] px-6 py-2 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm">
                    View Services
                  </button>
                </Link>
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
          <div className="mb-6">
            <div className="relative">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#003366] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-4 px-2">
                {["Question 1", "Question 2", "Review"].map((label, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full mb-1.5 border-2 ${
                        currentStep > i + 1
                          ? "bg-[#003366] border-[#003366]"
                          : currentStep === i + 1
                          ? "bg-white border-[#003366]"
                          : "bg-gray-200 border-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
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

          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-[#003266]">HEALTH SERVICES</h1>
            </div>

            <div className="max-w-lg mx-auto space-y-8">
              {currentStep === 1 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-5">
                    How much do you need for your health fund?
                  </p>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden max-w-sm mx-auto">
                    <div className="bg-gray-100 px-5 flex items-center font-bold text-[#003266] border-r border-gray-300">
                      ₱
                    </div>
                    <input
                      type="text"
                      value={formatNumberWithCommas(healthQuestion1)}
                      onChange={(e) => setHealthQuestion1(e.target.value.replace(/,/g, ""))}
                      className="flex-grow p-3.5 text-center text-base focus:outline-none focus:border-[#003366]"
                      placeholder="Enter amount"
                      inputMode="numeric"
                    />
                  </div>
                  {errors.question1 && <p className="text-red-500 text-sm mt-3">{errors.question1}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-5">
                    How much are you willing to set aside monthly?
                  </p>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden max-w-sm mx-auto">
                    <div className="bg-gray-100 px-5 flex items-center font-bold text-[#003266] border-r border-gray-300">
                      ₱
                    </div>
                    <input
                      type="text"
                      value={formatNumberWithCommas(healthQuestion2)}
                      onChange={(e) => setHealthQuestion2(e.target.value.replace(/,/g, ""))}
                      className="flex-grow p-3.5 text-center text-base focus:outline-none focus:border-[#003366]"
                      placeholder="Enter monthly amount"
                      inputMode="numeric"
                    />
                  </div>
                  {errors.question2 && <p className="text-red-500 text-sm mt-3">{errors.question2}</p>}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-[#003366] rounded-lg p-6 text-center shadow-sm">
                    <p className="text-base text-[#003266] mb-4 font-medium">
                      Estimated Years to Reach Goal
                    </p>
                    <div className="text-3xl md:text-4xl font-bold text-[#003266] tabular-nums">
                      {displayYears.toFixed(2)} year{displayYears !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <label className="block text-sm font-bold text-[#003266] mb-3">
                        Health Fund Needed
                      </label>
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-5 flex items-center font-bold text-[#003266] border-r border-gray-300">
                          ₱
                        </div>
                        <input
                          type="text"
                          value={formatNumberWithCommas(healthQuestion1)}
                          onChange={(e) => setHealthQuestion1(e.target.value.replace(/,/g, ""))}
                          className="flex-grow p-3.5 text-center focus:outline-none focus:border-[#003366]"
                          placeholder="0"
                          inputMode="numeric"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <label className="block text-sm font-bold text-[#003266] mb-3">
                        Monthly Contribution
                      </label>
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-5 flex items-center font-bold text-[#003266] border-r border-gray-300">
                          ₱
                        </div>
                        <input
                          type="text"
                          value={formatNumberWithCommas(healthQuestion2)}
                          onChange={(e) => setHealthQuestion2(e.target.value.replace(/,/g, ""))}
                          className="flex-grow p-3.5 text-center focus:outline-none focus:border-[#003366]"
                          placeholder="0"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 text-center pt-2">
                    Edit values — result updates live
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-gray-300">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="border-2 border-[#003366] text-[#003366] px-6 py-2 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
              >
                Back
              </button>
            ) : (
              <Link
                to="/services/yes_services/LifeProHealth"
                className="border-2 border-[#003366] text-[#003366] px-6 py-2 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
              >
                Back
              </Link>
            )}

            <button
              onClick={handleNext}
              className="border-2 border-[#003366] bg-[#003366] text-white px-8 py-2 rounded-full font-medium hover:bg-[#002244] transition-colors duration-200 text-sm shadow-sm"
            >
              {currentStep === 3 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthServices;