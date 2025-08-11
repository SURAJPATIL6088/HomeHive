import React from 'react';
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-dark text-white">
        <div className="container py-5">
          <div className="row g-5">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center mb-3">
                <div
                  style={{
                    width: "35px",
                    height: "35px",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px"
                  }}
                >
                  H
                </div>
                <span className="ms-3 fs-4 fw-bold">HomeHive</span>
              </div>
  
              
              {/* Contact Info */}
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2 text-white">
                  <i className="bi bi-geo-alt me-3" style={{ fontSize: "1.1rem", color: "#3B82F6" }}></i>
                  <span>456 Community Plaza, Mumbai, Maharashtra 400001</span>
                </div>
                <div className="d-flex align-items-center mb-2 text-white">
                  <i className="bi bi-telephone me-3" style={{ fontSize: "1.1rem", color: "#3B82F6" }}></i>
                  <span>022-345-6789</span>
                </div>
                <div className="d-flex align-items-center text-white">
                  <i className="bi bi-envelope me-3" style={{ fontSize: "1.1rem", color: "#3B82F6" }}></i>
                  <span>homehivesupport@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="fw-semibold mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <a href="/" className="footer-link">Home</a>
                </li>
                <li className="mb-3">
                  <a href="/about" className="footer-link">About Us</a>
                </li>
                <li className="mb-3">
                  <a href="/contact" className="footer-link">Contact</a>
                </li>
                <li className="mb-3">
                  <a href="/feedback" className="footer-link">Feedback</a>
                </li>
                <li className="mb-3">
                  <a href="/login" className="footer-link">Login</a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-lg-3 col-md-6">
              <h5 className="fw-semibold mb-4">Our Services</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <a href="/society-app" className="footer-link">Society Application</a>
                </li>
                <li className="mb-3">
                  <a href="/facility-booking" className="footer-link">Facility Booking</a>
                </li>
                <li className="mb-3">
                  <a href="/maintenance-requests" className="footer-link">Maintenance Requests</a>
                </li>
                <li className="mb-3">
                  <a href="/community-events" className="footer-link">Community Events</a>
                </li>
                <li className="mb-3">
                  <a href="/security-app" className="footer-link">Security Application</a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="col-lg-3 col-md-6">
              <h5 className="fw-semibold mb-4">Legal</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
                </li>
                <li className="mb-3">
                  <a href="/terms-of-service" className="footer-link">Terms of Service</a>
                </li>
                <li className="mb-3">
                  <a href="/cookie-policy" className="footer-link">Cookie Policy</a>
                </li>
                <li className="mb-3">
                  <a href="/disclaimer" className="footer-link">Disclaimer</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <hr className="my-4" style={{ borderColor: "#374151" }} />
          <div className="row align-items-center">
            <div className="col-md-8">
              <p className="text-white mb-0">
                © {currentYear} HomeHive. All rights reserved.
              </p>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-md-end justify-content-start gap-3">
                {/* Social Media Icons using Bootstrap Icons */}
                <a href="https://facebook.com/homehive" className="social-icon" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://twitter.com/homehive" className="social-icon" aria-label="Twitter">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="https://instagram.com/homehive" className="social-icon" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://linkedin.com/company/homehive" className="social-icon" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;