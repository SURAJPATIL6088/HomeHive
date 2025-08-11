import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import NoticesPage from "./NoticesPage";
import PaymentsPage from "./PaymentsPage";
import ComplaintsPage from "./ComplaintsPage";
import FacilityBookingPage from "./FacilityBookingPage";
import ComplaintModal from "./ComplaintModal";
import Logout from "../Logout.jsx";
import MyBookingsPage from "./MyBookingsPage.jsx";
import Profile from "./Profile.jsx";
import PaymentService from "../Services/PaymentService";
import CompaintCard from "../Stats_Cards/CompaintCard";
import { AuthContext } from "../Context/AuthContext";
import BookingCard from "../Stats_Cards/BookingCard";
import PendingDues from "../Stats_Cards/PendingDues";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 text-dark mb-1">
            Welcome back,{" "}
            {user ? `${user.firstName} ${user.lastName}` : "Resident"}!
          </h1>
          <p className="text-muted mb-0">
            Here's what's happening in your society today.
          </p>
        </div>
        <div className="btn btn-outline-danger d-flex align-items-center gap-2">
          <Logout />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <PendingDues />
        <CompaintCard />
        <BookingCard />
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-dark">Recent Notices</h5>
          <button
            className="btn btn-link p-0 text-primary"
            onClick={() => navigate("/resident/notices")}
          >
            View All
          </button>
        </div>
        <div className="card-body">
          <div className="mb-3 pb-3 border-bottom">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="text-dark mb-2">Society Meeting</h6>
                <p className="text-muted mb-2">
                  Monthly society meeting on 15th Aug
                </p>
                <span className="badge bg-primary">NOTICE</span>
              </div>
              <small className="text-muted">2024-08-01</small>
            </div>
          </div>

          <div className="mb-0">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="text-dark mb-2">Holi Celebration</h6>
                <p className="text-muted mb-2">
                  Join us for Holi celebration in the clubhouse
                </p>
                <span className="badge bg-warning">EVENT</span>
              </div>
              <small className="text-muted">2024-08-05</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResidentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    if (path === "resident" || path === "") return "dashboard";
    return path;
  };

  const handleNavigation = (page) => {
    if (page === "dashboard") {
      navigate("/resident");
    } else {
      navigate(`/resident/${page}`);
    }
  };

  const currentPage = getCurrentPage();

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="d-flex flex-column"
        style={{
          width: "250px",
          minWidth: "250px",
          maxWidth: "250px",
          minHeight: "100vh",
          backgroundColor: "#2c3e50",
          color: "white",
          flexShrink: 0,
        }}
      >
        <div className="p-3 border-bottom border-secondary">
          <h4 className="mb-0 d-flex align-items-center gap-2">
            <span>🏠</span>
            <span>HomeHive</span>
          </h4>
        </div>

        <nav className="flex-grow-1 p-2">
          <ul className="list-unstyled">
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "dashboard" ? "btn-primary" : "text-light"
                }`}
                onClick={() => handleNavigation("dashboard")}
                style={{
                  backgroundColor:
                    currentPage === "dashboard" ? "#007bff" : "transparent",
                  color: currentPage === "dashboard" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-home fa-fw"></i>
                <span>Dashboard</span>
              </button>
            </li>
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "notices" ? "btn-primary" : "text-light"
                }`}
                onClick={() => handleNavigation("notices")}
                style={{
                  backgroundColor:
                    currentPage === "notices" ? "#007bff" : "transparent",
                  color: currentPage === "notices" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-bell fa-fw"></i>
                <span>Notices & Events</span>
              </button>
            </li>
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "payments" ? "btn-primary" : "text-light"
                }`}
                onClick={() => handleNavigation("payments")}
                style={{
                  backgroundColor:
                    currentPage === "payments" ? "#007bff" : "transparent",
                  color: currentPage === "payments" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-credit-card fa-fw"></i>
                <span>Payments</span>
              </button>
            </li>
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "complaints" ? "btn-primary" : "text-light"
                }`}
                onClick={() => handleNavigation("complaints")}
                style={{
                  backgroundColor:
                    currentPage === "complaints" ? "#007bff" : "transparent",
                  color: currentPage === "complaints" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-exclamation-circle fa-fw"></i>
                <span>Complaints</span>
              </button>
            </li>
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "facility-booking"
                    ? "btn-primary"
                    : "text-light"
                }`}
                onClick={() => handleNavigation("facility-booking")}
                style={{
                  backgroundColor:
                    currentPage === "facility-booking"
                      ? "#007bff"
                      : "transparent",
                  color:
                    currentPage === "facility-booking" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-calendar-check fa-fw"></i>
                <span>Facility Booking</span>
              </button>
            </li>
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "my-booking" ? "btn-primary" : "text-light"
                }`}
                onClick={() => handleNavigation("my-booking")}
                style={{
                  backgroundColor:
                    currentPage === "my-booking" ? "#007bff" : "transparent",
                  color: currentPage === "my-booking" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-calendar-check fa-fw"></i>
                <span>My Booking</span>
              </button>
            </li>
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "profile" ? "btn-primary" : "text-light"
                }`}
                onClick={() => handleNavigation("profile")}
                style={{
                  backgroundColor:
                    currentPage === "profile" ? "#007bff" : "transparent",
                  color: currentPage === "profile" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-calendar-check fa-fw"></i>
                <span>Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-top border-secondary text-center">
          <small className="text-muted">Support@HomeHive.com</small>
        </div>
      </div>

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route
            path="/complaints"
            element={
              <ComplaintsPage setShowComplaintModal={setShowComplaintModal} />
            }
          />
          <Route path="/facility-booking" element={<FacilityBookingPage />} />
          <Route path="/my-booking" element={<MyBookingsPage />} />{" "}
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {showComplaintModal && (
          <ComplaintModal
            onClose={() => setShowComplaintModal(false)}
            onSubmit={(complaint) => {
              console.log("New complaint:", complaint);
              setShowComplaintModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default ResidentDashboard;
