import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const resultRef = useRef(null);

  useEffect(() => {
    document.title = "Financial Needs Analysis | Health";
  }, []);

  const validateInputs = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!healthQuestion1.trim() || isNaN(parseFloat(healthQuestion1)) || parseFloat(healthQuestion1) <= 0) {
        newErrors.question1 = "Please enter a valid amount for your health fund.";
      }
    }
    if (currentStep === 2) {
      if (!healthQuestion2.trim() || isNaN(parseFloat(healthQuestion2)) || parseFloat(healthQuestion2) <= 0) {
        newErrors.question2 = "Please enter a valid monthly amount greater than 0.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateInputs()) {
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

  const computeResult = () => {
    const A = parseFloat(healthQuestion1);
    const B = parseFloat(healthQuestion2);
    if (B === 0) return 0;
    return (A / (12 * B)).toFixed(2);
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

          <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-6">HEALTH</h1>

          <p className="text-lg text-[#003266] text-center mt-6">
            This represents the number of years to reach your health fund goal.
          </p>

          <div className="flex justify-center mb-14 mt-6">
            <div className="w-80 py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
              {result} year/s
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <button onClick={handleBookAppointment} className="bg-[#003266] text-white px-6 py-3 rounded-md">Book an Appointment</button>
            <button className="bg-[#003266] text-white px-6 py-3 rounded-md">View Recommendations</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
        <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">HEALTH</h1>

        <div className="flex justify-center mb-10">
          <div className="relative flex items-center w-[540px]">
            <div className="absolute left-10 right-1 top-6 h-[2px] bg-[#8FA6BF]" />
            {[1,2,3].map(n => (
              <React.Fragment key={n}>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${currentStep >= n ? "bg-[#003266]" : "bg-[#B7C5D6]"} flex items-center justify-center`}>
                    <div className="w-10 h-10 rounded-full border-3 border-white text-[#F4B43C] flex items-center justify-center text-lg">{n}</div>
                  </div>
                  <span className={`text-sm mt-2 ${currentStep >= n ? "text-[#003266]" : "text-[#8FA6BF]"}`}>
                    {n===1?"Question 1":n===2?"Question 2":"Review"}
                  </span>
                </div>
                {n!==3 && <div className="flex-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form className="space-y-8">
          {currentStep === 1 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">How much do you need for your health fund (i.e. an amount that you are comfortable with in case of serious illness)?</p>
              <input 
                type="number" 
                value={healthQuestion1} 
                onChange={(e)=>setHealthQuestion1(e.target.value)} 
                className="w-80 p-3 border rounded-lg text-center" 
                placeholder="Enter amount"
              />
              {errors.question1 && <p className="text-red-500 mt-2">{errors.question1}</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">How much are you willing to set aside monthly for your health fund?</p>
              <input 
                type="number" 
                value={healthQuestion2} 
                onChange={(e)=>setHealthQuestion2(e.target.value)} 
                className="w-80 p-3 border rounded-lg text-center" 
                placeholder="Enter monthly amount"
              />
              {errors.question2 && <p className="text-red-500 mt-2">{errors.question2}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <p className="text-lg text-[#003266] mb-4 font-semibold">Review Your Inputs</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border p-4 rounded">
                  <span>Health Fund Needed:</span>
                  <input 
                    type="number" 
                    value={healthQuestion1} 
                    onChange={(e)=>setHealthQuestion1(e.target.value)} 
                    className="border rounded px-2 py-1 w-32 text-center" 
                  />
                </div>
                <div className="flex justify-between items-center border p-4 rounded">
                  <span>Monthly Contribution:</span>
                  <input 
                    type="number" 
                    value={healthQuestion2} 
                    onChange={(e)=>setHealthQuestion2(e.target.value)} 
                    className="border rounded px-2 py-1 w-32 text-center" 
                  />
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
            <Link to="/services/protection-health" className="text-[#003266]">Back</Link>
          )}

          <button onClick={handleNext} className="bg-[#003266] text-white px-10 py-3 rounded-md">{currentStep===3?"Submit":"Next"}</button>
        </div>
      </div>
    </div>
  );
}

export default HealthServices;