import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HealthServices() {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthQuestion1, setHealthQuestion1] = useState("");
  const [healthQuestion2, setHealthQuestion2] = useState("");
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

  const validateInputs = () => {
    const newErrors = {};
    if (!healthQuestion1.trim() || isNaN(parseFloat(healthQuestion1))) {
      newErrors.question1 = "Please enter a valid amount for your health fund.";
    }
    if (!healthQuestion2.trim() || isNaN(parseFloat(healthQuestion2)) || parseFloat(healthQuestion2) === 0) {
      newErrors.question2 = "Please enter a valid monthly amount greater than 0.";
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
    const A = parseFloat(healthQuestion1);
    const B = parseFloat(healthQuestion2);
    if (B === 0) return 0; 
    return (A / (12 * B)).toFixed(2); 
  };

  const handleImportPDF = () => {
    alert("PDF exported successfully!");
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
    if (!appointmentData.email.trim() || !/\S+@\S+\.\S+/.test(appointmentData.email)) newErrors.email = "Valid email is required.";
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
    if (showAppointmentForm) {
      return (
        <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
          <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
            <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">Appointment Form</h1>
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div>
                <label className="block text-lg text-[#003266] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={appointmentData.name}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter your full name"
                />
                {appointmentErrors.name && <p className="text-red-500 mt-1">{appointmentErrors.name}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={appointmentData.email}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter your email"
                />
                {appointmentErrors.email && <p className="text-red-500 mt-1">{appointmentErrors.email}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={appointmentData.phone}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter your phone number"
                />
                {appointmentErrors.phone && <p className="text-red-500 mt-1">{appointmentErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={appointmentData.date}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                {appointmentErrors.date && <p className="text-red-500 mt-1">{appointmentErrors.date}</p>}
              </div>
              <div>
                <label className="block text-lg text-[#003266] mb-2">Preferred Time</label>
                <input
                  type="time"
                  name="time"
                  value={appointmentData.time}
                  onChange={handleAppointmentChange}
                  className="w-full px-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                {appointmentErrors.time && <p className="text-red-500 mt-1">{appointmentErrors.time}</p>}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#003266] text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
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
      <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
        <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8
                bg-[url('/src/assets/images/short-cfs-b.png')]
                bg-cover bg-center
                bg-white/97 bg-blend-lighten max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white relative">
          <button
            onClick={handleImportPDF}
            className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#e0a32f] transition duration-200"
          >
            Import to PDF
          </button>
          
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-Axiforma text-[#003266]">
              HEALTH 
            </h1>
          </header>
          <p className="text-lg text-[#003266] text-center padding-6 mt-6">
            THANK YOU FOR YOUR INPUT
            {/* <br />
            Health Fund Amount (A): ₱{healthQuestion1}
            <br />
            Monthly Contribution (B): ₱{healthQuestion2}
            <br />*/}
             <br /> 
             </p>
             <p className="text-lg text-[#003266] text-center padding-4 mt-6">
            This represents the number of years to reach your health fund goal.
          </p>
            <div className="flex justify-center mb-14">
                <div className="w-10 pl-8 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg padding-6 mt-6 text-center text-[#003266] text-lg
                relative w-80">
            <strong>
              {result} year/s</strong>
             </div>
            </div>
          <div className="mt-10 flex items-center justify-between">
            <button
            onClick={handleBookAppointment}
              className="bg-[#003266] text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book an Appointment
            </button>
            <button
              className="bg-[#003266] text-white px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
            >
              View Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8
                bg-[url('/src/assets/images/short-cfs-b.png')]
                bg-cover bg-center
                bg-white/97 bg-blend-lighten ">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-Axiforma text-[#003266]">
            HEALTH 
          </h1>
        </header>
        <div className="flex justify-center mb-10">
          <div className="relative flex items-center w-[540px]"> 
            <div className="absolute left-10 right-1 top-6 h-[2px] bg-[#8FA6BF]" />

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${currentStep === 1 ? 'bg-[#003266]' : currentStep > 1 ? 'bg-[#003266]' : 'bg-[#B7C5D6]'} flex items-center justify-center`}>
                <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center font-Axiforma text-lg">
                  1
                </div>
              </div>
              <span className={`text-sm ${currentStep === 1 ? 'text-[#003266]' : currentStep > 1 ? 'text-[#003266]' : 'text-[#8FA6BF]'} mt-2 font-Axiforma`}>
                Question 1
              </span>
            </div>

            <div className="flex-1" />

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${currentStep === 2 ? 'bg-[#003266]' : currentStep > 2 ? 'bg-[#003266]' : 'bg-[#B7C5D6]'} flex items-center justify-center`}>
                <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center font-Axiforma text-lg">
                  2
                </div>
              </div>
              <span className={`text-sm ${currentStep === 2 ? 'text-[#003266]' : currentStep > 2 ? 'text-[#003266]' : 'text-[#8FA6BF]'} mt-2 font-Axiforma`}>
                Question 2
              </span>
            </div>

            <div className="flex-1" />

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${currentStep === 3 ? 'bg-[#003266]' : 'bg-[#B7C5D6]'} flex items-center justify-center`}>
                <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center font-Axiforma text-lg">
                  3
                </div>
              </div>
              <span className={`text-sm ${currentStep === 3 ? 'text-[#003266]' : 'text-[#8FA6BF]'} mt-2 font-Axiforma`}>
                Review
              </span>
            </div>
          </div>
        </div>

        <form className="space-y-8">
          {currentStep === 1 && (
            <div>
               <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed text-center">
                 <br />
                    How much do you need for your health fund
                  <br />
                    (i.e. an amount that you are comfortable with in case of serious illness)?
                  <br />
              </p>
              <div className="flex justify-center mb-14">
                <div className="relative w-80">
                  <input
                    type="number"
                    value={healthQuestion1}
                    onChange={(e) => setHealthQuestion1(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                </div>
              </div>
              {errors.question1 && <p className="text-red-500 text-center">{errors.question1}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed text-center">
                How much are you willing to set aside monthly for your health fund?
              </p>
              <div className="flex justify-center mb-14">
                <div className="relative w-80">
                  <input
                    type="number"
                    value={healthQuestion2}
                    onChange={(e) => setHealthQuestion2(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003266] text-lg">₱</span>
                </div>
              </div>
              {errors.question2 && <p className="text-red-500 text-center">{errors.question2}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-Axiforma text-[#003266] text-center mb-8">Review Your Answers</h2>
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <p className="text-lg text-[#003266]"><strong>Question 1:</strong> How much do you need for your health fund? <u>₱{healthQuestion1}</u></p>
                </div>
                <div>
                  <p className="text-lg text-[#003266]"><strong>Question 2:</strong> How much are you willing to set aside monthly? <u>₱{healthQuestion2}</u></p>
                </div>
                {/* <div>
                  <p className="text-lg text-[#003266]"><strong>Calculated Result (A ÷ (12 × B)):</strong> {computeResult()}</p>
                  <p className="text-sm text-[#8FA6BF]">This represents the estimated number of years to reach your health fund goal.</p>
                </div> */}
              </div>
            </div>
          )}
        </form>

        <div className="mt-10 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="bg-[#003266] text-white px-10 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
            >
               Previous
            </button>
          ) : (
            <Link
              to="/services/protection-health"
              className="relative px-6 py-1 text-lg font-light text-[#003266] transition duration-300 after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-[#F4B43C] after:transition-all after:duration-300 hover:after:w-16"
            >
               Back
            </Link>
          )}

          <button
            onClick={handleNext}
            className="bg-[#003266] text-white px-10 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
          >
            {currentStep === 3 ? "Submit" : "Next " }
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthServices;