import React from "react";
import Footer from "./Footer";
import "./About.css";

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Suraj Patil",
      role: "Full Stack Developer",
      image: "/Suraj.jpg",
      email: "surajpatil3941@gmail.com",
      github: "github.com/SURAJPATIL6088",
    },
    {
      id: 2,
      name: "Janhavi Nirmal",
      role: "Frontend Developer",
      image: "/janhavi.jpeg",
      email: "Gmail-janhavinirmal2003@gmail.com",
      github: "github.com/JanhaviNirmal",
    },
    {
      id: 3,
      name: "Aditya Mane",
      role: "DotNet Developer",
      initials: "AM",
      image: "/aditya.jpeg",
      email: "adityam1802@gmail.com",
      github: "github.com/adityamane",
    },
    {
      id: 4,
      name: "Sakshi Jadhav",
      role: "DotNet Developer",
      image: "/sakshi.jpeg",
      email: "sakshianiljadhav@gmail.com",
      github: "github.com/Sakshi2736",
    },
    {
      id: 5,
      name: "Rajnandini Kamble",
      role: "Frontend Developer",
      initials: "RK",
      image: "/rajnandini.jpg",
      email: "rajnandinikamble04@gmail.com",
      github: "github.com/nandini-kamble",
    },
  ];

  return (
    <>
      {/* Add Bootstrap CSS and JS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"
        defer
      ></script>
      {/* Add Bootstrap Icons CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css"
        rel="stylesheet"
      />

      <div>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent px-4 py-2 position-absolute w-100 z-3">
          <div className="container-fluid">
            <a
              className="navbar-brand d-flex align-items-center fw-bold fs-4 text-white gap-2"
              href="/"
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
                  fontSize: "18px",
                }}
              >
                H
              </div>
              <span>HomeHive</span>
            </a>
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
                    <a
                      href={item.path}
                      className={`nav-link fw-semibold px-3 py-2 nav-link-custom ${
                        item.path === "/about" ? "active" : ""
                      }`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Header with Hotel Background */}
        <section className="page-header">
          <div className="container text-center">
            <h1 className="display-4 fw-bold mb-3">Meet Our Team</h1>
            <p className="lead">
              The passionate people behind HomeHive Community
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row g-4">
              {/* First row - 3 members */}
              {teamMembers.slice(0, 3).map((member) => (
                <div className="col-12 col-md-4" key={member.id}>
                  <div className="card h-100 team-card">
                    <div className="card-body text-center p-4">
                      <div className="member-avatar">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML =
                                member.initials;
                            }}
                          />
                        ) : (
                          member.initials
                        )}
                      </div>
                      <h5 className="card-title fw-bold text-dark mb-2">
                        {member.name}
                      </h5>
                      <p className="text-primary fw-semibold mb-3 small">
                        {member.role}
                      </p>

                      {/* Social Links */}
                      <div className="social-links">
                        <a
                          href={`mailto:${member.email}`}
                          className="email-link"
                          title={`Email ${member.name}`}
                        >
                          <i className="bi bi-envelope"></i>
                          {member.email}
                        </a>
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-link"
                          title={`${member.name}'s GitHub`}
                        >
                          <i className="bi bi-github"></i>
                          {member.github}
                        </a>
                      </div>

                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "0.85rem", lineHeight: "1.5" }}
                      >
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Second row - 2 members, centered */}
            <div className="row g-4 justify-content-center mt-2">
              {teamMembers.slice(3, 5).map((member) => (
                <div className="col-12 col-md-4" key={member.id}>
                  <div className="card h-100 team-card">
                    <div className="card-body text-center p-4">
                      <div className="member-avatar">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML =
                                member.initials;
                            }}
                          />
                        ) : (
                          member.initials
                        )}
                      </div>
                      <h5 className="card-title fw-bold text-dark mb-2">
                        {member.name}
                      </h5>
                      <p className="text-primary fw-semibold mb-3 small">
                        {member.role}
                      </p>

                      {/* Social Links */}
                      <div className="social-links">
                        <a
                          href={`mailto:${member.email}`}
                          className="email-link"
                          title={`Email ${member.name}`}
                        >
                          <i className="bi bi-envelope"></i>
                          {member.email}
                        </a>
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-link"
                          title={`${member.name}'s GitHub`}
                        >
                          <i className="bi bi-github"></i>
                          {member.github}
                        </a>
                      </div>

                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "0.85rem", lineHeight: "1.5" }}
                      >
                        {member.description}
                      </p>
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

export default AboutUs;
