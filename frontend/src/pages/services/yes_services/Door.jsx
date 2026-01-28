import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Protection & Health
import health from "../../../assets/images/health.jpg";
import life from "../../../assets/images/life-protection.jpg";

// Savings & Investment
import education from "../../../assets/images/education.jpg";
import savings from "../../../assets/images/savings.jpg";
import retirement from "../../../assets/images/retirement.jpg";

const protectionImages = [life, health];
const savingsImages = [education, savings, retirement];

const Door = () => {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  useEffect(() => {
    document.title = "Door | Financial Needs Analysis";

    const leftTimer = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % protectionImages.length);
    }, 3500);

    const rightTimer = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % savingsImages.length);
    }, 3500);

    return () => {
      clearInterval(leftTimer);
      clearInterval(rightTimer);
    };
  }, []);

  return (
    <div className="pyd-body">
      <div className="text-left mb-10 mr-15">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a2e5c]">
          Choose Your Door
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          To help you make informed financial decisions <br />
          with clarity and confidence.
        </p>
      </div>

      <div className="pyd-doors">

        {/* ===== Protection & Health ===== */}
        <Link to="/services/yes_services/LifeProHealth" className="pyd-container">
          <div className="pyd-door-frame">
            {protectionImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`pyd-door-image ${
                  index === leftIndex ? "active" : ""
                }`}
                alt="Protection"
              />
            ))}
            <div className="pyd-door"></div>
          </div>
          <h3>Protection & Health</h3>
        </Link>

        {/* ===== Savings & Investment ===== */}
        <Link to="/services/yes_services/SavEdRe" className="pyd-container">
          <div className="pyd-door-frame savings">
            {savingsImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`pyd-door-image ${
                  index === rightIndex ? "active" : ""
                }`}
                alt="Savings"
              />
            ))}
            <div className="pyd-door"></div>
          </div>
          <h3>Savings & Investment</h3>
        </Link>

      </div>
    </div>
  );
};

export default Door;
