import { Link } from "react-router-dom";
import { useEffect } from "react";

import education from "../../../assets/images/education.jpg";
import savings from "../../../assets/images/savings.jpg";
import retirement from "../../../assets/images/retirement.jpg";

const services = [
  {
    title: "EDUCATION",
    desc: "To plan for your children's education.",
    image: education,
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

export default function SavEdRe() {

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

      {/* Cards - Centered for 3 items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Empty div for left spacing on large screens */}
        <div className="hidden lg:block"></div>
        
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
        
        {/* Empty div for right spacing on large screens */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}