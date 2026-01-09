import { Link } from "react-router-dom";
import { useEffect } from "react";

import life from "../../../assets/images/life-protection.jpg";
import education from "../../../assets/images/education.jpg";
import health from "../../../assets/images/health.jpg";
import savings from "../../../assets/images/savings.jpg";
import retirement from "../../../assets/images/retirement.jpg";

const services = [
  {
    title: "LIFE PROTECTION",
    desc: "To protect your family’s quality of life in case of uncertainties.",
    image: life,
  },
  {
    title: "EDUCATION",
    desc: "To plan for your children’s education.",
    image: education,
  },
  {
    title: "HEALTH",
    desc: "To safeguard yourself from financial burden caused by serious illness.",
    image: health,
  },
  {
    title: "SAVINGS",
    desc: "To maximize the potential of your savings.",
    image: savings,
  },
  {
    title: "RETIREMENT",
    desc: "To maintain your lifestyle after retirement.",
    image: retirement,
  },
];


export default function OurServices() {

  useEffect(() => {
    document.title = "Financial Needs Analysis | Our Services";
  }, []);

  return (
    <div className="px-12 py-20">
      {/* Back */}
      <Link
        to="/"
        className="text-blue-700 font-medium mb-10 inline-block"
      >
        ← Back
      </Link>

      {/* Title */}
      <h1 className="text-center text-4xl font-semibold text-[#3b5aa9] mb-16">
        Our Services
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative h-[420px] rounded-xl overflow-hidden shadow-xl group cursor-pointer"
          >
            {/* Image */}
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Text */}
            <div className="absolute bottom-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-2 tracking-wide">
                {service.title}
              </h3>
              <p className="text-sm font-light leading-relaxed">
                {service.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
