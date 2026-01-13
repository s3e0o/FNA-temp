import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import life from "../../../assets/images/life-protection.jpg";

export default function LifeProtectionDeets() {
  const [active, setActive] = useState(null); // null | "what" | "why"

  useEffect(() => {
    document.title = "Life Protection Service Details | Financial Needs Analysis";
  }, []);

  return (
    <div className="px-12 py-20">
      {/* Back */}
      <Link
        to="/FNA/OurServices"
        className="relative inline-block text-[#395998] font-medium mb-10 mt-10
                    after:content-[''] after:absolute after:left-0 after:-bottom-1
                    after:w-0 after:h-[2.5px] after:bg-[#F4B43C]
                    after:transition-all after:duration-300
                    hover:after:w-full"
        >
        ← Back to Our Services
        </Link>


      {/* OUTER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_60px] items-center gap-6">
        
        {/* LEFT ARROW */}
        <div className="hidden lg:flex justify-center">
          <Link
            to="/FNA/education"
            className="flex items-center justify-center w-12 h-12 rounded-full
                       bg-white shadow-lg text-[#0b3a6e] text-2xl font-bold
                       hover:bg-[#0b3a6e] hover:text-white transition-all"
          >
            ‹
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

            {/* IMAGE */}
            <div className="relative z-10 w-full h-[320px] lg:h-[360px]">
              <img
                src={life}
                alt="Life Protection"
                className="w-full h-full rounded-xl shadow-xl object-cover"
              />
            </div>

            {/* CARD ZONE */}
            <div className="relative min-h-[360px] mt-15">

            {/* MAIN CARD */}
            <div
                className={`relative z-20 bg-[#0b3a6e] text-white rounded-xl
                         p-8 lg:p-10 shadow-xl
                         lg:-ml-[20%] mt-8 lg:mt-0
                            transition-all duration-700 ease-in-out
                            origin-left
                            ${
                            active
                                ? "w-[70%] scale-[0.97] translate-x-0"
                                : "w-full scale-100 translate-x-0"
                            }`}
            >
                <h1 className="text-3xl font-semibold mb-3 transition-all duration-500 ease-in-out
                                  opacity-0 translate-y-2
                                  animate-[titleFade_0.5s_ease-in-out_forwards]">
                LIFE PROTECTION
                </h1>

                <p className="text-sm text-gray-200 mb-8 transition-all duration-500 ease-in-out
                                  opacity-0 translate-y-2
                                  animate-[titleFade_0.5s_ease-in-out_forwards]">
                To protect your family’s quality of life in case of uncertainties.
                </p>

                <div className="space-y-4">
                <button
                    onClick={() => setActive("what")}
                    className="w-full border border-white py-3 rounded-lg cursor-pointer
                            hover:bg-[#F4B43C] hover:text-white
                            transition-all"
                >
                    What is it?
                </button>

                <button
                    onClick={() => setActive("why")}
                    className="w-full border border-white py-3 rounded-lg cursor-pointer
                            hover:bg-[#F4B43C] hover:text-white
                            transition-all"
                >
                    Why it matters?
                </button>
                </div>
            </div>

            {/* SIDE INFO CARD */}
            {active && (
                <div
                    className="absolute top-0 right-0 w-[50%] mt-9 flex flex-col gap-4
                            transition-all duration-700 ease-in-out
                            translate-x-0 opacity-100"
                >

                {/* Info Card */}
                <div key={active} className="bg-[#0b3a6e] text-white rounded-xl p-8 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 transition-all duration-500 ease-in-out
                                  opacity-0 translate-y-2
                                  animate-[textFade_0.5s_ease-in-out_forwards]">
                    {active === "what" ? "What is it?" : "Why it matters?"}
                </h2>

                <p className="text-sm text-gray-200 leading-relaxed transition-all duration-500 ease-in-out
                                  opacity-0 translate-y-2
                                  animate-[textFade_0.5s_ease-in-out_forwards]">
                    {active === "what"
                    ? "A financial safety net that protects your family if something unexpected happens."
                    : "Life protection ensures your loved ones can maintain their lifestyle and financial security."}
                </p>
                </div>

                {/* Take the test (separate) */}
                <button
                className="w-full bg-[#0b3a6e] border border-[#003266] text-white py-3 rounded-lg shadow-lg
                            hover:bg-[#F4B43C] transition cursor-pointer"
                >
                Take the test
                </button>
            </div>
            )}

            </div>

          </div>
        </div>

        {/* RIGHT ARROW */}
        <div className="hidden lg:flex justify-center">
          <Link
            to="/FNA/health/details"
            className="flex items-center justify-center w-12 h-12 rounded-full
                       bg-white shadow-lg text-[#0b3a6e] text-2xl font-bold
                       hover:bg-[#0b3a6e] hover:text-white transition-all"
          >
            ›
          </Link>
        </div>
      </div>
    </div>
  );
}
