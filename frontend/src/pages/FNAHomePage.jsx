import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const FNAHomePage = () => {
  return (
    <>
      <Navbar />

      <main className="fna-page">
        <div className="fna-card text-center min-h-auto pt-32 px-4 top-0 pb-16">
          <h2>Hello, [Name]</h2>
          <p>Have you figured out your financial needs?</p>

          <div className="fna-actions">
            <button>Yes</button>
            <button>No</button>
          </div>
        </div>
      </main>

    </>
  );
};

export default FNAHomePage;
