import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/CFS Logo.png';
import '../index.css';

const navLink =
  "relative px-5 py-3 text-lg font-light text-white transition duration-300 " +
  "hover:text-[#F4B43C] cursor-pointer " +                  
  "after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] " +
  "after:w-0 after:-translate-x-1/2 after:bg-[#F4B43C] " +
  "after:transition-all after:duration-300 " +
  "hover:after:w-10";

export default function Navbar() {
  return (
    <header className="header-font fixed top-0 left-0 right-0 w-full bg-[#003266] z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4.5 px-6 pl-[3px]">
        
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src={logo}
            alt="Caelum Financial Solutions Logo"
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/about" className={navLink}>
            About Caelum
          </Link>

          <Link to="/services" className={navLink}>
            Services
          </Link>

          <Link to="/careers" className={navLink}>
            Careers
          </Link>

          <div className="relative group">
            <Link to="/tools" className={navLink}>
              Tools
            </Link>

            <div
              className="
                absolute left-1/2 top-full mt-3 w-80 -translate-x-1/2 
                rounded-md bg-gray-200/95 backdrop-blur-md shadow-xl
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300 pt-2 pb-2 divide-y divide-gray-300/50
              "
            >
              <Link
                to="/tools/income-simulator"
                className="block px-8 py-3.5 text-center text-gray-800 hover:bg-[#003266] hover:text-white transition-colors cursor-pointer"
              >
                Income Simulator Tracker
              </Link>

              <Link
                to="/"
                className="block px-8 py-3.5 text-center text-gray-800 hover:bg-[#003266] hover:text-white transition-colors cursor-pointer"
              >
                Financial Needs Analysis
              </Link>

              <Link
                to="/tools/pipe"
                className="block px-8 py-3.5 text-center text-gray-800 hover:bg-[#003266] hover:text-white transition-colors cursor-pointer"
              >
                Pipe
              </Link>
            </div>
          </div>

          <Link to="/login" className={navLink + " login-btn"}>Log in</Link>
        </div>
      </nav>
    </header>
  );
}