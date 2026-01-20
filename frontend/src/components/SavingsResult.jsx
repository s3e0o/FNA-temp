// src/components/SavingsResult.js
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SavingsResult = ({
  savingsGoal,
  targetYears,
  currentCost,
  futureValueNeeded,
  monthlySavings,
  onBack,
  onViewRecommendations
}) => {
  const resultRef = useRef();

  const handleExportPDF = async () => {
    const canvas = await html2canvas(resultRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 20;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, width, height);
    pdf.save("Savings-FNA-Result.pdf");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)' }}>
      <div ref={resultRef} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md text-[#003266] font-sans">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">SAVINGS</h1>
          <div className="w-16 h-1 bg-[#003266] mx-auto mt-2"></div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700">Goal:</p>
            <p className="font-medium">{savingsGoal || "—"} </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">Target Year:</p>
            <p className="font-medium">{targetYears} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">Current Cost:</p>
            <p className="font-medium">₱{currentCost.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700">Future Value Needed (4% inflation):</p>
            <p className="text-lg font-bold text-[#003266]">
              ₱{futureValueNeeded.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">Monthly Savings Required (6% return):</p>
            <p className="text-lg font-bold text-[#003266]">
              ₱{monthlySavings.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          *Results are for reference only and not financial advice.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-lg mx-auto mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-[#003266] text-white px-6 py-3 rounded-md"
        >
          Back
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-[#003266] text-white px-6 py-3 rounded-md"
        >
          Export PDF
        </button>
        <button
          onClick={onViewRecommendations}
          className="bg-[#003266] text-white px-6 py-3 rounded-md"
        >
          View Recommendations
        </button>
      </div>
    </div>
  );
};

export default SavingsResult;