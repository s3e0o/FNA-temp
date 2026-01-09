import React, { useState } from "react";
import { Link } from "react-router-dom";

function HealthServices() {
  const [healthQuestion1, setHealthQuestion1] = useState("");
  const [healthQuestion2, setHealthQuestion2] = useState("");

  useEffect(() => {
      document.title = "Financial Needs Analysis | Health Services";
    }, []);

  return (
    <div className="min-h-auto bg-gray-100 pt-32 px-4 top-0 pb-16">
      <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-8
                bg-[url('/src/assets/images/short-cfs-b.png')]
                bg-cover bg-center
                bg-white/80 bg-blend-lighten">

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-Axiforma text-[#003266]">
            Health 
          </h1>
          {/* <p className="mt-2 text-gray-600">
            Help us understand your health coverage needs
          </p> */}
        </header>
        <div className="flex items-center justify-center mb-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-sm text-blue-700 mt-2">Question 1</span>
          </div>

          {/* Line */}
          <div className="w-32 h-1 bg-blue-300 mx-4" />

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-sm text-blue-400 mt-2">Question 2</span>
          </div>
        </div>

        <form className="space-y-8">
          <div>
            {/* <h2 className="text-lg font-Axiforma Light text-[#395998] mb-2">
              Question 1
            </h2> */}
            <p className="text-lg text-[#003266] max-w-2xl mx-auto mb-8 leading-relaxed">
              How much do you need for your health fund (i.e. an amount that you are
              comfortable with in case of serious illness)?
            </p>

              <div className="flex justify-center mb-14">
          <div className="relative w-80">
             <input
              type="number"
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-lg">
              ₱
            </span>
          </div>
        </div>
        </div>

               {/* <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Question 2
            </h2>
            <p className="text-gray-600 mb-3">
              Any pre-existing medical conditions?
            </p>
            <input
              type="text"
              value={healthQuestion2}
              onChange={(e) => setHealthQuestion2(e.target.value)}
              placeholder="Enter details"
              className="w-full rounded-md border border-gray-300 px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-[#003266]"
            />
          </div> */}


          <button
            type="submit"
            className="w-full bg-[#003266] text-white py-3 rounded-md
                       font-medium text-lg transition
                       hover:bg-[#00264d]"
          >
            Analyze Health Coverage
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/services/protection-health"
            className="text-[#003266] hover:underline"
          >
            ← Back to Protection & Health Services
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HealthServices;
