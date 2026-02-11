import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RetirementResultPDF from "../../../components/pdf/RetirementResultPDF.jsx";

const Retirement = () => {
  const [step, setStep] = useState(1);
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [yearsAfter, setYearsAfter] = useState(""); // "10" .. "15"

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);

  const [appointment, setAppointment] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const resultRef = useRef(null);

  // ─── Calculation Logic (unchanged) ──────────────────────────────────────
  const getMultiplier = (postYears, untilYears) => {
    const row = Math.min(Math.max(Math.round(postYears), 10), 15);
    const col = Math.min(Math.max(Math.round(untilYears), 1), 20);

    const table = {
      10: [1.2486,1.2986,1.3505,1.4045,1.4607,1.5192,1.5799,1.6431,1.7088,1.7772,1.8483,1.9222,1.9991,2.0791,2.1622,2.2487,2.3387,2.4322,2.5295,2.6307],
      11: [1.2751,1.3261,1.3791,1.4343,1.4917,1.5513,1.6134,1.6779,1.7450,1.8148,1.8874,1.9629,2.0414,2.1231,2.2080,2.2963,2.3882,2.4837,2.5831,2.6864],
      12: [1.3022,1.3543,1.4085,1.4648,1.5234,1.5844,1.6477,1.7137,1.7822,1.8535,1.9276,2.0047,2.0849,2.1683,2.2551,2.3453,2.4391,2.5366,2.6381,2.7436],
      13: [1.3301,1.3834,1.4387,1.4962,1.5561,1.6183,1.6831,1.7504,1.8204,1.8932,1.9689,2.0477,2.1296,2.2148,2.3034,2.3955,2.4913,2.5910,2.6946,2.8024],
      14: [1.3588,1.4132,1.4697,1.5285,1.5896,1.6532,1.7194,1.7881,1.8596,1.9340,2.0114,2.0919,2.1755,2.2625,2.3530,2.4472,2.2451,2.6469,2.7527,2.8628],
      15: [1.3883,1.4438,1.5016,1.5617,1.6241,1.6891,1.7566,1.8269,1.9000,1.9760,2.0550,2.1372,2.2227,2.3116,2.4041,2.5003,2.6003,2.7043,2.8124,2.9249],
    };

    return table[row]?.[col - 1] ?? 1;
  };

  const yearsToRetirement = useMemo(() => {
    const c = Number(currentAge);
    const r = Number(retirementAge);
    return r > c && !isNaN(c) && !isNaN(r) ? r - c : 0;
  }, [currentAge, retirementAge]);

  const multiplier = useMemo(() => {
    if (!yearsAfter || !yearsToRetirement) return 0;
    return getMultiplier(Number(yearsAfter), yearsToRetirement);
  }, [yearsAfter, yearsToRetirement]);

  const totalNeeded = useMemo(() => {
    const income = Number(monthlyIncome);
    const yrs = Number(yearsAfter);
    if (isNaN(income) || isNaN(yrs)) return 0;
    return income * 12 * yrs * multiplier;
  }, [monthlyIncome, yearsAfter, multiplier]);

  const monthlySave = useMemo(() => {
    if (yearsToRetirement <= 0 || totalNeeded <= 0) return 0;
    const r = 0.06 / 12;
    const n = yearsToRetirement * 12;
    return (totalNeeded * r) / (Math.pow(1 + r, n) - 1);
  }, [totalNeeded, yearsToRetirement]);

  // Animation values
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayMonthly, setDisplayMonthly] = useState(0);

  // Animate when in review step and values change
  useEffect(() => {
    if (step !== 5) return;

    const animate = (start, end, duration, setter) => {
      if (Math.abs(end - start) < 1) {
        setter(end);
        return;
      }

      let startTime = null;
      const stepAnim = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const t = Math.min((timestamp - startTime) / duration, 1);
        // easeOutQuad
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const value = Math.round(start + (end - start) * eased);
        setter(value);
        if (t < 1) requestAnimationFrame(stepAnim);
        else setter(end);
      };
      requestAnimationFrame(stepAnim);
    };

    animate(displayTotal, Math.round(totalNeeded), 1400, setDisplayTotal);
    animate(displayMonthly, Math.round(monthlySave), 1600, setDisplayMonthly);
  }, [step, totalNeeded, monthlySave]);

  // ─── Validation ─────────────────────────────────────────────────────────
  const validate = () => {
    const err = {};

    if (step === 1) {
      const a = Number(currentAge);
      if (!currentAge.trim() || isNaN(a) || a < 18 || a > 99 || !Number.isInteger(a)) {
        err.age = "Please enter a valid age (18–99)";
      }
    }

    if (step === 2) {
      const a = Number(retirementAge);
      const c = Number(currentAge);
      if (!retirementAge.trim() || isNaN(a) || a <= c || a > 99 || !Number.isInteger(a)) {
        err.retirement = "Retirement age must be > current age and ≤ 99";
      }
    }

    if (step === 3) {
      const inc = Number(monthlyIncome);
      if (!monthlyIncome.trim() || isNaN(inc) || inc <= 0) {
        err.income = "Please enter a valid monthly income";
      }
    }

    if (step === 4) {
      if (!["10", "11", "12", "13", "14", "15"].includes(yearsAfter)) {
        err.years = "Please select years in retirement";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (validate()) {
      if (step < 5) setStep(step + 1);
      else setSubmitted(true);
    }
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  // ─── PDF Export ─────────────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 10;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 5, 5, width, height);
    pdf.save("Retirement-Plan.pdf");
  };

  // ─── Appointment ────────────────────────────────────────────────────────
  const openAppointment = () => setShowAppointment(true);

  const handleApptChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const submitAppointment = (e) => {
    e.preventDefault();
    if (!appointment.name.trim()) return alert("Name is required");
    if (!appointment.email.includes("@")) return alert("Valid email required");
    if (!appointment.phone.trim()) return alert("Phone required");
    if (!appointment.date || !appointment.time) return alert("Date & time required");

    alert("Appointment booked successfully!");
    setShowAppointment(false);
    setAppointment({ name: "", email: "", phone: "", date: "", time: "" });
  };

  const formatCurrency = (value) => {
    if (isNaN(value) || value == null) return "0.00";
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
  };

  if (submitted) {
    if (showAppointment) {
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
              <form onSubmit={submitAppointment} className="space-y-4 max-w-lg mx-auto">
                {["name", "email", "phone", "date", "time"].map((f) => (
                  <div key={f}>
                    <label className="block text-[#003266] font-semibold mb-1.5 capitalize text-sm">
                      {f.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={
                        f === "email"
                          ? "email"
                          : f === "phone"
                          ? "tel"
                          : f === "date"
                          ? "date"
                          : f === "time"
                          ? "time"
                          : "text"
                      }
                      name={f}
                      value={appointment[f]}
                      onChange={handleApptChange}
                      className="w-full p-2.5 border border-gray-300 rounded text-center focus:outline-none focus:border-[#003266]"
                    />
                  </div>
                ))}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAppointment(false)}
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
        <RetirementResultPDF
          ref={resultRef}
          currentAge={Number(currentAge)}
          retirementAge={Number(retirementAge)}
          monthlyIncome={Number(monthlyIncome)}
          yearsAfterRetirement={Number(yearsAfter)}
          yearsUntilRetirement={yearsToRetirement}
          totalRetirementFundNeeded={totalNeeded}
          multiplier={multiplier}
          monthlySavings={monthlySave}
        />

        <div
          className="min-h-auto pt-32 px-4 pb-16"
          style={{
            backgroundImage: `url("/background.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-2xl mx-auto">
            <Link
              to="/FNA/door"
              className="relative inline-block text-[#395998] font-medium mb-4 ml-4 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[1.5px] after:bg-[#F4B43C] after:transition-all after:duration-300 hover:after:w-full text-sm"
            >
              ← Back to Doors
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-5">
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-[#003266] mb-3">
                  RETIREMENT RESULT
                </h1>
                <button
                  onClick={exportPDF}
                  className="border-2 border-[#003366] text-[#003366] px-4 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
                >
                  Export to PDF
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
                <p className="text-base text-[#003266] text-center mb-5">
                  Total retirement fund needed:
                </p>

                <div className="flex justify-center mb-6">
                  <div className="w-64 py-5 text-center text-2xl font-bold border border-[#003266] rounded-lg bg-blue-50">
                    ₱{formatCurrency(totalNeeded)}
                  </div>
                </div>

                <div className="space-y-4 mb-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2 text-center">
                        Years until Retirement
                      </h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        {yearsToRetirement} years
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-2 text-center">
                        Monthly Savings Needed
                      </h3>
                      <div className="text-base font-bold text-[#003266] text-center">
                        ₱{formatCurrency(monthlySave)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <h3 className="text-sm font-bold text-[#003266] mb-3 text-center">
                      Key Inputs
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#003266] font-semibold">
                          Current Age:
                        </span>
                        <span className="text-sm font-bold text-[#003266]">
                          {currentAge} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#003266] font-semibold">
                          Retirement Age:
                        </span>
                        <span className="text-sm font-bold text-[#003266]">
                          {retirementAge} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#003266] font-semibold">
                          Desired Monthly Income:
                        </span>
                        <span className="text-sm font-bold text-[#003266]">
                          ₱{formatCurrency(Number(monthlyIncome))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#003266] font-semibold">
                          Years in Retirement:
                        </span>
                        <span className="text-sm font-bold text-[#003266]">
                          {yearsAfter} years
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  <button
                    onClick={openAppointment}
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
          <div className="mb-5">
            <div className="relative">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#003366] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((step - 1) / 4) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {["Question 1", "Question 2", "Question 3", "Question 4", "Review"].map(
                  (label, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full mb-1.5 ${
                          step > i + 1
                            ? "bg-[#003366]"
                            : step === i + 1
                            ? "bg-[#003366]"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          step >= i + 1 ? "text-[#003266]" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 mb-5 border border-gray-200">
            <div className="text-center mb-5">
              <h1 className="text-xl font-bold text-[#003266] mb-2">
                RETIREMENT
              </h1>
            </div>

            <div className="max-w-lg mx-auto">
              {step === 1 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    How old are you now?
                  </p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter age"
                      min="18"
                      max="99"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      YEARS
                    </div>
                  </div>
                  {errors.age && (
                    <p className="text-red-500 text-sm mb-4">{errors.age}</p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    At what age do you plan to retire?
                  </p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <input
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(e.target.value)}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter age"
                      min={Number(currentAge) + 1 || 19}
                      max="99"
                    />
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                      YEARS OLD
                    </div>
                  </div>
                  {errors.retirement && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.retirement}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    What is your current monthly income?
                  </p>
                  <div className="flex border border-gray-300 rounded overflow-hidden max-w-xs mx-auto mb-4">
                    <div className="bg-gray-100 px-4 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-sm">
                      ₱
                    </div>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="flex-grow p-2.5 text-center text-base focus:outline-none"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                    />
                  </div>
                  {errors.income && (
                    <p className="text-red-500 text-sm mb-4">{errors.income}</p>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="text-center">
                  <p className="text-base text-[#003266] mb-4">
                    How many years do you want this income to last after retirement?
                  </p>
                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                    {[10, 11, 12, 13, 14, 15].map((y) => (
                      <button
                        key={y}
                        onClick={() => setYearsAfter(String(y))}
                        className={`py-3 rounded-lg font-medium transition-all text-sm ${
                          yearsAfter === String(y)
                            ? "bg-[#003366] text-white shadow-md"
                            : "bg-gray-100 hover:bg-gray-200 text-[#003266]"
                        }`}
                      >
                        {y} yrs
                      </button>
                    ))}
                  </div>
                  {errors.years && (
                    <p className="text-red-500 text-sm mt-4">{errors.years}</p>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-[#003266] text-center mb-4">
                    Review & Edit Your Answers
                  </h2>

                  {/* Live Result Preview with animation */}
                  <div className="bg-blue-50 border border-[#003266] rounded-lg p-5 mb-6 text-center shadow-sm">
                    <p className="text-base text-[#003266] mb-4">
                      Estimated Results (updates live):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Total Fund Needed
                        </div>
                        <div className="text-2xl font-bold text-[#003366] tabular-nums">
                          ₱{displayTotal.toLocaleString("en-PH")}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Monthly Savings Needed
                        </div>
                        <div className="text-2xl font-bold text-[#003366] tabular-nums">
                          ₱{displayMonthly.toLocaleString("en-PH")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-[#003266] mb-2">
                          Current Age
                        </h3>
                        <div className="flex border border-gray-300 rounded overflow-hidden">
                          <input
                            type="number"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(e.target.value)}
                            className="flex-grow p-2.5 text-center text-sm focus:outline-none"
                            min="18"
                            max="99"
                          />
                          <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                            YEARS
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="text-sm font-bold text-[#003266] mb-2">
                          Retirement Age
                        </h3>
                        <div className="flex border border-gray-300 rounded overflow-hidden">
                          <input
                            type="number"
                            value={retirementAge}
                            onChange={(e) => setRetirementAge(e.target.value)}
                            className="flex-grow p-2.5 text-center text-sm focus:outline-none"
                            min={Number(currentAge) + 1 || 19}
                            max="99"
                          />
                          <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-l border-gray-300 text-sm">
                            YEARS
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                      <h3 className="text-sm font-bold text-[#003266] mb-3 text-center">
                        Other Inputs
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#003266] font-semibold w-2/5 text-right pr-3">
                            Monthly Income:
                          </span>
                          <div className="flex border border-gray-300 rounded overflow-hidden w-3/5">
                            <div className="bg-gray-100 px-3 flex items-center justify-center font-bold text-[#003266] border-r border-gray-300 text-sm">
                              ₱
                            </div>
                            <input
                              type="number"
                              value={monthlyIncome}
                              onChange={(e) => setMonthlyIncome(e.target.value)}
                              className="flex-grow p-2 text-center text-sm focus:outline-none"
                              step="0.01"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#003266] font-semibold w-2/5 text-right pr-3">
                            Years in Retirement:
                          </span>
                          <div className="flex flex-wrap gap-2 w-3/5 justify-end">
                            {[10, 11, 12, 13, 14, 15].map((y) => (
                              <button
                                key={y}
                                onClick={() => setYearsAfter(String(y))}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                                  yearsAfter === String(y)
                                    ? "bg-[#003366] text-white shadow"
                                    : "bg-gray-100 hover:bg-gray-200 text-[#003266]"
                                }`}
                              >
                                {y} yrs
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-300">
            {step > 1 ? (
              <button
                onClick={back}
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
              onClick={next}
              className="border-2 border-[#003366] text-[#003366] px-6 py-1.5 rounded-full font-medium hover:bg-[#003366] hover:text-white transition-colors duration-200 text-sm"
            >
              {step === 5 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retirement;