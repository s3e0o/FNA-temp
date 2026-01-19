import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/cfs-logo.png";

const options = [
  "Bills and expenses take it all",
  "I save whatever’s left at month end",
  "I manually transfer some to savings",
  "Automatic transfer to savings happens immediately",
];

const Q1 = () => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.title = "Savings Habits | Financial Needs Analysis";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#dfeaf5] via-white to-[#f5f7fa] flex flex-col">
      
      {/* Header */}
      <header className="px-8 pt-6">
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="Caelum Insight"
            className="h-10"
          />
          <span className="text-sm text-gray-500">1 of 10</span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-[10%] bg-blue-500"></div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="corp-q w-full max-w-3xl">
          
          <p className="text-sm text-gray-400 font-light mb-1">
            Savings Habits
          </p>
          <p className="text-sm text-blue-500 font-light italic mb-2">
            Let’s understand your saving reflexes
          </p>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
            When you receive your paycheck, what happens first?
          </h1>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelected(index)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border transition-all
                  ${
                    selected === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
              >
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center
                    ${
                      selected === index
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                >
                  {selected === index && (
                    <div className="h-3 w-3 bg-blue-500 rounded-full" />
                  )}
                </div>
                <span className="text-gray-800 text-left">
                  {option}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Link
              to="/FNA"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Previous
            </Link>

            <Link
              to="/FNA/Q2"
              className={`px-6 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2
                ${
                  selected === null
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              Continue →
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Q1;
