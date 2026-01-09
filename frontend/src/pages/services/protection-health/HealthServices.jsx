import React, { useState } from "react";
import { Link } from "react-router-dom";

function HealthServices() {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthQuestion1, setHealthQuestion1] = useState("");
  const [healthQuestion2, setHealthQuestion2] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateInputs = () => {
    const newErrors = {};
    if (!healthQuestion1.trim()) {
      newErrors.question1 = "Please enter an amount for your health fund.";
    }
    if (!healthQuestion2.trim()) {
      newErrors.question2 = "Please enter a monthly amount.";
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

  if (submitted) {
  
    return (
      <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
        <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8 bg-white">
          <h1 className="text-3xl font-Axiforma text-[#003266] text-center mb-8">HEALTH</h1>
          <p className="text-lg text-[#003266] text-center">
            Here are your results.
            <br />
            Health Fund Amount: ₱{healthQuestion1}
            <br />
            Monthly Contribution: ₱{healthQuestion2}
          </p>
          <div className="text-center mt-8">
            <Link to="/services" className="bg-[#003266] text-white px-10 py-3 rounded-md font-medium text-lg">
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
      document.title = "Financial Needs Analysis | Health Services";
    }, []);

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
            <div className="absolute left-0 right-0 top-6 h-[2px] bg-[#8FA6BF]" />

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
              <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed">
                How much do you need for your health fund 
                (i.e. an amount that you are comfortable with in case of serious illness)?
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
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed">
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
                  <p className="text-lg text-[#003266]"><strong>Question 1:</strong> How much do you need for your health fund?</p>
                  <p className="text-lg text-[#003266]">Answer: ₱{healthQuestion1}</p>
                </div>
                <div>
                  <p className="text-lg text-[#003266]"><strong>Question 2:</strong> How much are you willing to set aside monthly?</p>
                  <p className="text-lg text-[#003266]">Answer: ₱{healthQuestion2}</p>
                </div>
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
              ← Previous
            </button>
          ) : (
            <Link
              to="/services/protection-health"
              className="relative px-1 py-3 text-lg font-light text-[#003266] transition duration-300 after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-[#F4B43C] after:transition-all after:duration-300 hover:after:w-16"
            >
              ← Back
            </Link>
          )}

          <button
            onClick={handleNext}
            className="bg-[#003266] text-white px-10 py-3 rounded-md font-medium text-lg transition-all duration-200 border-2 border-transparent hover:border-[#003266] hover:bg-white hover:text-[#003266] hover:-translate-y-0.5 hover:shadow-lg"
          >
            {currentStep === 3 ?  "See Results" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthServices;