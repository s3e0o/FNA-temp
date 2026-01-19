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
    link: "/services/savings-investments/Education",
  },
  {
    title: "SAVINGS",
    desc: "To maximize the potential of your savings.",
    image: savings,
    link: "/services/savings-investments/Savings",
  },
  {
    title: "RETIREMENT",
    desc: "To maintain your lifestyle after retirement.",
    image: retirement,
    link: "/services/savings-investments/Retirement",
  },
];

export default function SavEdRe() {
  useEffect(() => {
    document.title = "Savings, Education & Retirement | Financial Needs Analysis";
  }, []);

  return (
    <div className="px-12 py-20">
      {/* Back */}
      <Link
        to="/FNA/door"
        className="relative inline-block text-[#395998] font-medium mb-5 mt-10
                   after:content-[''] after:absolute after:left-0 after:-bottom-1
                   after:w-0 after:h-[2.5px] after:bg-[#F4B43C]
                   after:transition-all after:duration-300
                   hover:after:w-full"
      >
        ← Back to Choose Your Door
      </Link>

      {/* Title */}
      <h1 className="text-center text-4xl font-semibold text-[#3b5aa9] mb-16">
        Our Services
      </h1>

      {/* Cards - Centered for 3 items */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative h-[420px] w-full max-w-[260px] rounded-xl overflow-hidden shadow-xl
                       group cursor-pointer transition-all duration-300 ease-out
                       hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Image */}
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300
                         group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Text */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-black/60 p-6
                         h-[175px] transition-all duration-300
                         group-hover:h-[190px]"
            >
              <h3 className="text-xl font-semibold mb-2 tracking-wide text-white">
                {service.title}
              </h3>

              <p className="text-sm font-light leading-relaxed text-gray-200">
                {service.desc}
              </p>

              {/* Take the test (without link) */}
              <Link
                to={service.link}
                className="mt-4 text-sm font-medium text-white flex items-center gap-1
                           opacity-0 translate-y-2 transition-all duration-300
                           group-hover:opacity-100 group-hover:translate-y-0
                           cursor-default"
              >
                Take the test →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
