import React from 'react'
import { Link } from 'react-router-dom'
import { BiLogoReact } from 'react-icons/bi'
import logo from '../assets/images/CFS Logo.png'  
import '../index.css'


const navLink =
  "relative px-5 py-3 text-lg font-light text-white transition duration-300 " +
  "hover:text-[#F4B43C] " +
  "after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] " +
  "after:w-0 after:-translate-x-1/2 after:bg-[#F4B43C] " +
  "after:transition-all after:duration-300 " +
  "after:bottom-2 " +
  "hover:after:w-10";
const Navbar = () => {
    return (
        <header className='header-font fixed top-0 w-full bg-[#003266] z-50 shadow-lg'>
            <nav className='max-w-7xl mx-auto flex items-center justify-between py-6 px-6 pl-[3px]'>
                <Link to="/" className='flex items-center gap-3 text-blue-400'>
                    <img
                        src={logo}
                        alt="Caelum Financial Solutions Logo"
                        className="h-15 w-auto"
                    />
                </Link>
                <div className="flex items-center gap-8">
                <Link to="/about" className={navLink}>About Caelum</Link>
            <div className="relative group">
                    <Link to="/services" className={navLink}>Services</Link>
                        <div className="absolute left-1/2 top-full mt-3 w-64 
                            -translate-x-1/2 rounded-md 
                            bg-gray-200/80 backdrop-blur-md shadow-lg
                            opacity-0 invisible group-hover:opacity-100 
                            group-hover:visible transition-all duration-300 ">
                    <Link to="/services/protection-health/HealthServices"className="block px-6 py-3 text-center text-gray-800 rounded-md
                            transition-colors duration-100 hover:bg-[#003266] hover:text-white">
                        Health
                    </Link>

                    <Link to="/services/savings-investments/Savings"className="block px-6 py-3 text-center text-gray-800 rounded-md
                            transition-colors duration-100 hover:bg-[#003266] hover:text-white">
                        Savings
                    </Link>

                    <Link to="/services/savings-investments/Education"className="block px-6 py-3 text-center text-gray-800 rounded-md
                            transition-colors duration-100 hover:bg-[#003266] hover:text-white">
                        Education
                    </Link>

                    <Link to="/services/savings-investment/Retirement"className="block px-6 py-3 text-center text-gray-800 rounded-md
                            transition-colors duration-100 hover:bg-[#003266] hover:text-white">
                        Retirement
                    </Link>

                    <Link to="/services/protection-health/LifeProtection"className="block px-6 py-3 text-center text-gray-800 rounded-md
                            transition-colors duration-100 hover:bg-[#003266] hover:text-white">
                        Life Protection
                    </Link>

            </div>
          </div>
                <Link to="/careers" className={navLink}>Careers</Link>
                <Link to="/tools" className={navLink}>Tools</Link>
                <Link to="/login" className={navLink + " login-btn"}>Log in</Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

