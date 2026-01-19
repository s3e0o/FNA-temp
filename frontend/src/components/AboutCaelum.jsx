// src/components/AboutCaelum.jsx
// React.js component – uses your existing project structure
// Header and Footer are NOT included

import React from "react";
import "../index.css";
// import CaelumLogo from "../assets/images/cfb-removebg-preview.png";

const AboutCaelum = () => {
  return (
    <main className="w-full">
     <section className="bg-white py-20 px-6">
  <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3 items-start">
    
    {/* ABOUT US */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <h2 className="text-4xl font-semibold mb-3 text-black">About Us</h2>
      <br></br>
      <p className="leading-relaxed text-gray-700">
        At Caelum Financial Solutions, our dedicated team thrives on client commitment and industry expertise, driving continuous growth and delivering comprehensive financial services with excellence.
      </p>
    </div>
{/* VISION */}
<div className="group relative h-full rounded-3xl p-[1px] 
  bg-gradient-to-br from-[#3d5fa0] via-[#0b3a6e] to-[#1e2f55]
  transition-all duration-500 hover:scale-[1.02]">

  <div className="relative h-full rounded-3xl bg-white/80 backdrop-blur-xl p-10 
    shadow-lg transition-all duration-500
    group-hover:shadow-[0_25px_60px_-15px_rgba(11,58,110,0.45)]">

    {/* Glow overlay */}
    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3d5fa0]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <h4 className="text-2xl font-semibold text-[#0b3a6e] mb-6 tracking-wide">
      Vision
    </h4>

    <p className="text-gray-600 leading-relaxed text-base">
      To establish a foundation and sustain a disruptive financial distribution channel
      that redefines client experiences — from transactional to relational — fostering
      an engaged and informed clientele through competent financial advisory.
    </p>
  </div>
</div>

{/* MISSION */}
<div className="group relative h-full rounded-3xl p-[1px] 
  bg-gradient-to-br from-[#3d5fa0] via-[#0b3a6e] to-[#1e2f55]
  transition-all duration-500 hover:scale-[1.02]">

  <div className="relative h-full rounded-3xl bg-white/80 backdrop-blur-xl p-10 
    shadow-lg transition-all duration-500
    group-hover:shadow-[0_25px_60px_-15px_rgba(11,58,110,0.45)]">

    {/* Glow overlay */}
    <div className="pointer-events-none absolute inset-0 rounded-3xl 
      bg-gradient-to-br from-[#3d5fa0]/10 to-transparent opacity-0 
      transition-opacity duration-500 group-hover:opacity-100" />

    <h4 className="text-2xl font-semibold text-[#0b3a6e] mb-6 tracking-wide">
      Mission
    </h4>

    <p className="text-gray-600 leading-relaxed text-base">
      To provide an environment that empowers individuals to transform
      their potential into measurable achievements.
    </p>
  </div>
</div>
  </div>
</section>
      {/* CONTACT SECTION */}
      <section className="bg-[#3d5fa0] py-20 px-6 text-white">
        <h3 className="text-center text-3xl font-semibold mb-12">Contact Us</h3>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-white text-black rounded-xl p-8">
            <h4 className="font-semibold mb-4">Our Location</h4>

            <div className="mb-4">
              <p className="font-medium">Caelum Agency Office</p>
              <p className="text-sm text-gray-600">
                The Upper Class Tower, Quezon Avenue cor. Scout Reyes St., Diliman,
                Quezon City, 1103 Metro Manila
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium">Head Office</p>
              <p className="text-sm text-gray-600">
                9th Floor, Allied Bank Center 6754 Ayala Avenue corner Legaspi
                Street, Makati City
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium">Alabang Agency Office</p>
              <p className="text-sm text-gray-600">
                789 Investment Road, Quezon City, Philippines
              </p>
            </div>

            <div className="mb-6">
              <p className="font-medium">Baguio Agency Office</p>
              <p className="text-sm text-gray-600">
                2F, Leonard Wood Terrace, 21 Leonard Wood Road, Barangay Cabinet
                Hill, Baguio City
              </p>
            </div>

            <p className="text-sm mb-1"><strong>Phone:</strong> +63 123 456 7890</p>
            <p className="text-sm mb-6"><strong>Email:</strong> gaming@caelumfinancials.onmicrosoft.com</p>
          </div>

          <div className="rounded-xl overflow-hidden">
            <iframe
              title="Caelum Map"
              className="w-full h-full min-h-[400px] border-0"
              loading="lazy"
              src="https://www.google.com/maps?q=J2PG%2BJ73%2C%20Quezon%20Avenue%20cor%2C%20Scout%20Reyes%20St%2C%20Diliman%2C%20Quezon%20City%2C%201103%20Metro%20Manila&output=embed"
            />
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 px-6 bg-white">
        <h3 className="text-center text-4xl font-bold text-[#0b3a6e] mb-14">
          Our Core Values
        </h3>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[ 
            { title: "Shared Responsibility", desc: "We work together, embracing collective ownership to achieve our goals." },
            { title: "Accountability", desc: "We take personal ownership of our actions and outcomes, delivering on our commitments." },
            { title: "Radical Transparency", desc: "We foster trust by being open and honest about decisions, challenges and progress." },
            { title: "Open Communication", desc: "We encourage clear, respectful and constructive dialogue across all levels of the organization." },
            { title: "Competency", desc: "We continuously strive for excellence ensuring we have the skills and knowledge to perform at our best." },
            { title: "Constant Improvement", desc: "We are committed to learning and evolving, always seeking ways to grow and enhance our work."},
            
          ].map((value, i) => (
            <div key={i} className="border rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
              <h4 className="font-semibold text-xl mb-3 text-[#0b3a6e]">{value.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE CAELUM */}
    <section className="py-24 px-6 bg-[#3d5fa0] text-white">
        <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-4xl font-bold mb-6">
            Why Choose Caelum?
            </h3>
    <p className="text-gray-200 mb-12 max-w-3xl mx-auto">
      We combine expertise, integrity, and a client-first mindset to deliver
      financial solutions that create lasting impact.
    </p>
    <div className="grid md:grid-cols-2 gap-8 text-left">
      {[
        "Certified and experienced financial advisors",
        "Client-focused, relationship-driven approach",
        "Comprehensive and customized financial solutions",
        "Transparent, ethical, and accountable practices",
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-4 bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/15 transition"
        >
          <span className="text-white text-xl">✔</span>
          <p className="leading-relaxed">{item}</p>
        </div>
      ))}
    </div>
  </div>
</section>
{/* CTA */}
<section className="bg-gray-50 py-24 px-6 text-center">
  <h3 className="text-4xl font-bold text-[#0b3a6e] mb-6">
    Let’s Build Your Financial Future
  </h3>

  <p className="mb-10 text-gray-600 max-w-2xl mx-auto">
    Take the first step toward financial security. Our trusted advisors are
    ready to guide you with personalized strategies aligned with your goals.
  </p>

  <button className="bg-[#3d5fa0] text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:opacity-90 transition">
    Make an Appointment
  </button>
</section>

    </main>
  );
};

export default AboutCaelum;
