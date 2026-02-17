import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const FNAHomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home Page | Financial Needs Analysis";
  }, []);

  return (
    <>
      <Navbar />

      <main className="fna-page">
        <div className="fna-card text-center min-h-auto pt-32 px-4 top-0 pb-16">
          <h2>Good Day!</h2>
          <p>Have you figured out your financial needs?</p>

          <div className="fna-actions flex gap-4 justify-center">
            <button
              onClick={() => navigate("/FNA/door")}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Yes
            </button>

            <button
              onClick={() => navigate("/FNA/OurServices")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              No
            </button>
          </div>
        </div>
      </main>

    </>
  );
};

export default FNAHomePage;
