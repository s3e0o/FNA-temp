import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [otherDream, setOtherDream] = useState("");

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

          <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-6">SAVINGS</h1>

          <p className="text-lg text-[#003266] text-center mt-6">
            This is the amount you need to make your dream of owning <strong>{dreams.join(", ")}</strong> a reality in <strong>{years}</strong> years.
          </p>

          <div className="flex justify-center mb-14 mt-6">
            <div className="w-80 py-4 text-center text-[#003266] text-2xl font-bold border rounded-lg shadow">
              ₱{result}
            </div>
          </div>

          <div className="mt-10 flex justify-between">
                     <Link to="/FNA/AppointmentForm">
                       <button className="bg-[#003266] text-white px-6 py-3 rounded-md cursor-pointer">
                         Book an Appointment
                       </button>
                     </Link>
         
                     <Link to="/FNA/OurServices">
                       <button className="bg-[#003266] text-white px-6 py-3 rounded-md cursor-pointer">
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
        <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">SAVINGS</h1>

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
    <p className="text-lg text-[#003266] mb-6 font-semibold">
      What are you saving for?
    </p>

    <div className="grid grid-cols-2 gap-4 w-80 mx-auto">
      {["House", "Car", "Business", "Other"].map(option => (
        <label
          key={option}
          className={`flex items-center bg-white border rounded-lg px-4 py-3 shadow cursor-pointer ${
            dreams[0] === option ? "border-[#003266]" : ""
          } ${option === "Other" ? "col-span-2" : ""}`}
        >
          <input
            type="radio"
            name="dream"
            checked={dreams[0] === option}
            onChange={() => setDreams([option])}
            className="mr-3 w-5 h-5 accent-[#003266]"
          />

          <span className="text-[#003266] mr-2">{option}</span>

          {option === "Other" && dreams[0] === "Other" && (
            <input
              type="text"
              placeholder="Please specify"
              value={otherDream}
              onChange={(e) => setOtherDream(e.target.value)}
              className="flex-1 border rounded px-2 py-1"
            />
          )}
        </label>
      ))}
    </div>

    {errors.dreams && <p className="text-red-500 mt-2">{errors.dreams}</p>}
  </div>
)}


          {currentStep === 2 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">In how many years do you want to fulfill your dream?</p>
              <input type="number" value={years} onChange={(e)=>setYears(e.target.value)} className="w-80 p-3 border rounded-lg" />
              {errors.years && <p className="text-red-500">{errors.years}</p>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <p className="text-lg text-[#003266] mb-8">What is the cost of realizing your dream now?</p>
              <input type="number" value={cost} onChange={(e)=>setCost(e.target.value)} className="w-80 p-3 border rounded-lg" />
              {errors.cost && <p className="text-red-500">{errors.cost}</p>}
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <p className="text-lg text-[#003266] mb-4 font-semibold">Review Your Inputs</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border p-4 rounded">
                  <span>Saving For:</span>
                  <input type="text" value={dreams.join(", ")} onChange={e=>setDreams(e.target.value.split(",").map(d=>d.trim()))} className="border rounded px-2 py-1" />
                </div>
                <div className="flex justify-between items-center border p-4 rounded">
                  <span>Years:</span>
                  <input type="number" value={years} onChange={(e)=>setYears(e.target.value)} className="border rounded px-2 py-1" />
                </div>
                <div className="flex justify-between items-center border p-4 rounded">
                  <span>Cost (₱):</span>
                  <input
                        type="text"
                        value={formatNumber(cost)}
                        onChange={(e) => setCost(parseNumber(e.target.value))}
                        className="w-80 p-3 border rounded-lg"
                      />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">You can edit any field before final submission.</p>
            </div>
          )}
        </form>

        <div className="mt-10 flex justify-between">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="bg-[#003266] text-white px-10 py-3 rounded-md cursor-pointer">Previous</button>
          ) : (
            <Link to="/services/yes_services/SavEdRe" className="text-[#003266] cursor-pointer">Back</Link>
          )}

          <button onClick={handleNext} className="bg-[#003266] text-white px-10 py-3 rounded-md cursor-pointer">{currentStep===4?"Submit":"Next"}</button>
        </div>
      </div>
    </div>
  );
}

export default Savings;
