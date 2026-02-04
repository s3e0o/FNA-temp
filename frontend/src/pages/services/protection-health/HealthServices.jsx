import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import HealthResultPDF from "../../../components/pdf/HealthResultPDF.jsx"; // adjust path as needed

function HealthServices() {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthQuestion1, setHealthQuestion1] = useState("");
  const [healthQuestion2, setHealthQuestion2] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const resultRef = useRef(null);

  useEffect(() => {
    document.title = "Health | Financial Needs Analysis";
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

  if (submitted) {
    const result = computeResult();

    return (
      <>
      {/* === HIDDEN PDF TEMPLATE FOR EXPORT === */}
      <HealthResultPDF
        ref={resultRef}
        healthFundNeeded={parseFloat(healthQuestion1) || 0}
        monthlyContribution={parseFloat(healthQuestion2) || 0}
        yearsToGoal={parseFloat(computeResult())}
      />
      
        <div className="min-h-auto pt-32 px-4 pb-16" style={{ backgroundImage: `url("/background.jpg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <Link
              to="/FNA/door"
              className="relative inline-block text-[#395998] font-medium mb-5 ml-10
                          after:content-[''] after:absolute after:left-0 after:-bottom-1
                          after:w-0 after:h-[2.5px] after:bg-[#F4B43C]
                          after:transition-all after:duration-300
                          hover:after:w-full"
            >
              ← Back to Doors
            </Link>
          <div  className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white relative">
            
            <button onClick={handleExportPDF} className="absolute top-4 right-4 bg-[#003266] text-white px-4 py-2 rounded-md text-sm cursor-pointer">Export to PDF</button>

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
      </>
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
            <button onClick={handleBack} className="bg-[#003266] text-white px-10 py-3 rounded-md cursor-pointer">Previous</button>
          ) : (
            <Link to="/services/yes_services/LifeProHealth" className="text-[#003266] cursor-pointer">Back</Link>
          )}

          <button onClick={handleNext} className="bg-[#003266] text-white px-10 py-3 rounded-md cursor-pointer">{currentStep===3?"Submit":"Next"}</button>
        </div>
      </div>
    </div>
  );
}

export default HealthServices;