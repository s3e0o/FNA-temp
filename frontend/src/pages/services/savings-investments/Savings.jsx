import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Savings() {
  const [currentStep, setCurrentStep] = useState(1);
  const [savingsGoal, setSavingsGoal] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const [editGoal, setEditGoal] = useState(false);
  const [editMonthly, setEditMonthly] = useState(false);

  const resultRef = useRef(null);

  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  const [appointmentErrors, setAppointmentErrors] = useState({});

  useEffect(() => {
    document.title = "Financial Needs Analysis | Savings";
  }, []);


  const validateInputs = () => {
    const newErrors = {};
    if (!savingsGoal || isNaN(parseFloat(savingsGoal))) {
      newErrors.goal = "Please enter a valid savings goal.";
    }
    if (
      !monthlySavings ||
      isNaN(parseFloat(monthlySavings)) ||
      parseFloat(monthlySavings) === 0
    ) {
      newErrors.monthly = "Please enter a valid monthly amount greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateInputs()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (editGoal || editMonthly) {
        alert("Please click Done before submitting.");
        return;
      }
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };


  const computeResult = () => {
    const A = parseFloat(savingsGoal);
    const B = parseFloat(monthlySavings);
    if (B === 0) return 0;
    return (A / (12 * B)).toFixed(2);
  };


  const handleImportPDF = async () => {
    if (!resultRef.current) return;

    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Savings-Planning-Result.pdf");
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
      setAppointmentData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
      });
    }
  };


  if (submitted) {
    const result = computeResult();

    if (showAppointmentForm) {
      return (
        <div className="min-h-auto bg-gray-100 pt-32 px-4 pb-16">
          <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
            <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">
              Appointment Form
            </h1>

            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              {["name", "email", "phone", "date", "time"].map((field) => (
                <div key={field}>
                  <label className="block text-lg text-[#003266] mb-2">
                    {field.toUpperCase()}
                  </label>
                  <input
                    type={field}
                    name={field}
                    value={appointmentData[field]}
                    onChange={handleAppointmentChange}
                    className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 text-lg"
                  />
                  {appointmentErrors[field] && (
                    <p className="text-red-500 mt-1">
                      {appointmentErrors[field]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#003266] text-white px-6 py-3 rounded-md"
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
      <div className="min-h-auto bg-gray-100 pt-32 px-4 pb-16">
        <div
          ref={resultRef}
          className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white relative"
        >
          <button
            onClick={handleImportPDF}
            className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md text-sm"
          >
            Import to PDF
          </button>

          <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-6">
            SAVINGS
          </h1>

          <p className="text-lg text-[#003266] text-center mt-6">
            This represents the number of years to reach your savings goal.
          </p>

          <div className="flex justify-center mb-14">
            <div className="w-80 py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
              {result} year/s
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <button
              onClick={handleBookAppointment}
              className="bg-[#003266] text-white px-6 py-3 rounded-md"
            >
              Book an Appointment
            </button>
            <button className="bg-[#003266] text-white px-6 py-3 rounded-md">
              View Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-auto bg-gray-100 pt-32 px-4 pb-16">
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
        <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">
          SAVINGS
        </h1>

        <div className="flex justify-center mb-10">
          <div className="relative flex items-center w-[540px]">
            <div className="absolute left-10 right-1 top-6 h-[2px] bg-[#8FA6BF]" />

            {[1, 2, 3].map((n) => (
              <React.Fragment key={n}>
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full ${
                      currentStep >= n ? "bg-[#003266]" : "bg-[#B7C5D6]"
                    } flex items-center justify-center`}
                  >
                    <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center text-lg">
                      {n}
                    </div>
                  </div>
                  <span
                    className={`text-sm mt-2 ${
                      currentStep >= n
                        ? "text-[#003266]"
                        : "text-[#8FA6BF]"
                    }`}
                  >
                    {n === 3 ? "Review" : `Question ${n}`}
                  </span>
                </div>
                {n !== 3 && <div className="flex-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form className="space-y-8">
          {currentStep === 1 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">
                How much is your total savings goal?
              </p>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="w-80 p-3 border rounded-lg"
              />
              {errors.goal && <p className="text-red-500">{errors.goal}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">
                How much can you save monthly?
              </p>
              <input
                type="number"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(e.target.value)}
                className="w-80 p-3 border rounded-lg"
              />
              {errors.monthly && <p className="text-red-500">{errors.monthly}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl text-[#003266] mb-8">Review Your Answers</h2>

              <div>
                <p className="text-lg">
                  Savings Goal:{" "}
                  {editGoal ? (
                    <span className="flex justify-center gap-2">
                      <input
                        type="number"
                        value={savingsGoal}
                        onChange={(e) => setSavingsGoal(e.target.value)}
                        className="w-40 p-2 border rounded"
                      />
                      <button
                        onClick={() => setEditGoal(false)}
                        className="px-4 bg-[#003266] text-white rounded"
                      >
                        Done
                      </button>
                    </span>
                  ) : (
                    <span>
                      <u>₱{savingsGoal}</u>{" "}
                      <button
                        onClick={() => setEditGoal(true)}
                        className="ml-2 underline text-sm"
                      >
                        Edit
                      </button>
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-lg">
                  Monthly Savings:{" "}
                  {editMonthly ? (
                    <span className="flex justify-center gap-2">
                      <input
                        type="number"
                        value={monthlySavings}
                        onChange={(e) => setMonthlySavings(e.target.value)}
                        className="w-40 p-2 border rounded"
                      />
                      <button
                        onClick={() => setEditMonthly(false)}
                        className="px-4 bg-[#003266] text-white rounded"
                      >
                        Done
                      </button>
                    </span>
                  ) : (
                    <span>
                      <u>₱{monthlySavings}</u>{" "}
                      <button
                        onClick={() => setEditMonthly(true)}
                        className="ml-2 underline text-sm"
                      >
                        Edit
                      </button>
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </form>

        <div className="mt-10 flex justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="bg-[#003266] text-white px-10 py-3 rounded-md"
            >
              Previous
            </button>
          ) : (
            <Link to="/services/savings-investments" className="text-[#003266]">
              Back
            </Link>
          )}

          <button
            onClick={handleNext}
            className="bg-[#003266] text-white px-10 py-3 rounded-md"
          >
            {currentStep === 3 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Savings;
