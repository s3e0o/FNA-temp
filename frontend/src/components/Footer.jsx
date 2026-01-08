import {FaLinkedin, FaInstagram, FaFacebook, FaTwitter, FaSpotify, FaYoutube} from "react-icons/fa";
import React from 'react';
import '../index.css';
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      {/* Divider */}
      <div className="footer-divider"></div>

      <footer className="footer">
        <div className="footer-container">

          {/* CONTACTS */}
          <div className="footer-column">
            <h4>CONTACTS</h4>
            <a
              href="https://maps.app.goo.gl/M7P7CEF7vAbK3ZES7"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Upper Class Tower Quezon Avenue,<br />
              Quezon City, Metro Manila
            </a>

            <a href="mailto:admin@caelumfinancialsolutions.com">
              admin@caelumfinancialsolutions.com
            </a>
            
            <a href="tel:09654654844">
              0965 465 4844
            </a>

            <div className="social-icons">
              <FaLinkedin />
              <FaInstagram />
              <FaFacebook />
              <FaTwitter />
              <FaSpotify />
              <FaYoutube />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h4>QUICK LINKS</h4>
            <a href="#">Financial Needs Analysis</a>
            <a href="#">Income Simulation Tracker</a>
          </div>

          {/* COPYRIGHT TEXT */}
          <div className="footer-column footer-text text">
            <h4>COPYRIGHT CAELUM 2025</h4>
            <p>
              This digital platform provides general information exclusively.
              No content herein constitutes personalized financial or investment
              counsel. Users should consult a qualified advisor for specific
              guidance. By accessing this site, users consent to our data
              collection practices as detailed in our Privacy Policy. All
              interactions, including those with our digital assistant, are
              logged for quality assurance and service improvement.
            </p>
          </div>

        </div>
      </footer>

      {/* Bottom Strip */}
      <div className="footer-bottom">
        © 2025 Caelum Financial Solutions. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
