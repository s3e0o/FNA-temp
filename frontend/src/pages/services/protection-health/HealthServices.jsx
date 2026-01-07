import React, { useState } from "react";
import { Link } from "react-router-dom";

function HealthServices() {
  const [healthQuestion1, setHealthQuestion1] = useState("");
  const [healthQuestion2, setHealthQuestion2] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 pt-32 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-[#003266]">
            Health Services
          </h1>
          <p className="mt-2 text-gray-600">
            Help us understand your health coverage needs
          </p>
        </header>

        <form className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Question 1
            </h2>
            <p className="text-gray-600 mb-3">
              What is your current health insurance coverage?
            </p>
            <input
              type="text"
              value={healthQuestion1}
              onChange={(e) => setHealthQuestion1(e.target.value)}
              placeholder="Enter details"
              className="w-full rounded-md border border-gray-300 px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-[#003266]"
            />
          </div>

          <div>
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
          </div>

          <hr className="border-gray-200" />

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
