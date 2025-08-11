import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import "./Dashboard.css";

const facilities = [
  {
    title: "Clubhouse",
    description: "A vibrant space with indoor games, a mini theater, and lounge areas. Perfect for hosting parties, meetings, and community events.",
    img: "./clubhouse.jpg",
  },
  {
    title: "Gym",
    description: "A modern fitness center with top-tier equipment and a yoga area. Includes trainer sessions and wellness workshops.",
    img: "./societygym2.jpg",
  },
  {
    title: "Swimming Pool",
    description: "A well-maintained pool with a kids’ section and lifeguard. Separate time slots for families and adults.",
    img: "./societygarden.jpg", 
  },
  {
    title: "Parking Area",
    description: "Secure and organized parking with RFID entry. Includes dedicated spots for visitors.",
    img: "./parking.jpg",
  },
 {
    title: "Security System",
    description: "Professional security staff with gated entry and intercom. Equipped with CCTV surveillance for safety.",
    img: "./security.jpg",
  },
   {
    title: "Kids Play Area",
    description: "Fun outdoor space with swings, slides, and climbing frames. Soft flooring ensures a safe play environment.",
    img: "./kidsplay.jpg",
  },
];

const Dashboard = () => {
  useEffect(() => {
    const carouselElement = document.querySelector('#carouselExample');
    
    if (carouselElement) {
      const items = carouselElement.querySelectorAll('.carousel-item');
      const indicators = carouselElement.querySelectorAll('.carousel-indicators button');
      let currentIndex = 0;
      
      const nextSlide = () => {
        items[currentIndex].classList.remove('active');
        indicators[currentIndex].classList.remove('active');
        
        currentIndex = (currentIndex + 1) % items.length;

        items[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
      };
      
      const autoSlideInterval = setInterval(nextSlide, 6000);
      
      carouselElement.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });
      
      let resumeInterval;
      carouselElement.addEventListener('mouseleave', () => {
        resumeInterval = setInterval(nextSlide, 5000);
      });
      
      return () => {
        clearInterval(autoSlideInterval);
        if (resumeInterval) {
          clearInterval(resumeInterval);
        }
      };
    }
  }, []);

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />

      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent px-4 py-2 position-absolute w-100 z-3">
          <div className="container-fluid">
            <NavLink
              className="navbar-brand d-flex align-items-center fw-bold fs-4 text-white gap-2"
              to="/"
            >
              <div
                style={{
                  width: "35px",
                  height: "35px",
                  backgroundColor: "#3b82f6",
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
              <span>HomeHive</span>
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav gap-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about" },
                  { name: "Contact", path: "/contact" },
                  { name: "Feedback", path: "/feedback" },
                  { name: "Login", path: "/login" },
                ].map((item) => (
                  <li className="nav-item" key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => {
                        const baseClasses = "nav-link fw-semibold px-3 py-2 nav-link-custom";
                        const activeClass = isActive ? "active" : "";
                        return `${baseClasses} ${activeClass}`;
                      }}
                      end={item.path === "/"}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? 'white' : 'transparent',
                        color: isActive ? '#333' : 'rgba(255, 255, 255, 0.7)',
                        boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
                      })}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div
          id="carouselExample"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="5000"
          data-bs-touch="true"
          data-bs-pause="hover"
          data-bs-wrap="true"
          style={{ height: "75vh", overflow: "hidden" }}
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="./society1.jpg"
                className="d-block w-100"
                alt="Slide 1"
                style={{ height: "75vh", objectFit: "cover" }}
              />
              <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                <div
                  className="p-4 rounded"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    maxWidth: "600px",
                  }}
                >
                  <h1 className="text-white fw-bold">
                   Building Better Neighborhoods, Together
                  </h1>
                  <p className="text-white">
                    Smart, secure & efficient living with HomeHive
                  </p>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="./society2.jpg"
                className="d-block w-100"
                alt="Slide 2"
                style={{ height: "75vh", objectFit: "cover" }}
              />
              <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                <div
                  className="p-4 rounded"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    maxWidth: "600px",
                  }}
                >
                  <h1 className="text-white fw-bold">
                    Comfortable Living, Seamlessly Managed
                  </h1>
                  <p className="text-white">
                    Enhance community life with easy tech
                  </p>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="./society5.jpg"
                className="d-block w-100"
                alt="Slide 3"
                style={{ height: "75vh", objectFit: "cover" }}
              />
              <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100">
                <div
                  className="p-4 rounded"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    maxWidth: "600px",
                  }}
                >
                  <h1 className="text-white fw-bold">
                    Premium Amenities & Facilities
                  </h1>
                  <p className="text-white">
                    World-class amenities for a luxurious lifestyle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center fw-bold mb-5">Society Facilities</h2>
            <div className="row gx-4 gy-5 justify-content-center">
              {facilities.map((facility, index) => (
                <div className="col-md-4 d-flex align-items-stretch" key={index}>
                  <div className="card shadow" style={{ width: "100%" }}>
                    <img
                      className="card-img-top"
                      src={facility.img}
                      alt={facility.title}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{facility.title}</h5>
                      <p className="card-text">{facility.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;