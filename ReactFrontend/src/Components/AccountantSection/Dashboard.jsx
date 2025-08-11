import React, { useContext } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import NoticesEvents from "./NoticesEvents";
import BillManagement from "./BillManagement";
import PaymentHistory from "./payment";
import Logout from "../Logout";
import Profile from "./Profile";
import { getAllPayments } from "../Services/PaymentService";
import { AuthContext } from "../Context/AuthContext";
import TotalBillCard from "../Stats_Cards/TotalBillCard";
import PaymentReceived from "../Stats_Cards/PaymentReceived";
import PendingPaymentCard from "../Stats_Cards/PendingPaymentCard";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    if (path === "accountant" || path === "") return "dashboard";
    return path;
  };

  const handleNavigation = (page) => {
    if (page === "dashboard") {
      navigate("/accountant");
    } else {
      navigate(`/accountant/${page}`);
    }
  };

  const currentPage = getCurrentPage();

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      {/* Sidebar */}
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

        {/* Navigation */}
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
                  currentPage === "bills" ? "btn-primary" : "text-light"
                }`}
                onClick={() => handleNavigation("bills")}
                style={{
                  backgroundColor:
                    currentPage === "bills" ? "#007bff" : "transparent",
                  color: currentPage === "bills" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-file-alt fa-fw"></i>
                <span>Bill Management</span>
              </button>
            </li>
            <li className="mb-1">
              <button
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  currentPage === "payment-history"
                    ? "btn-primary"
                    : "text-light"
                }`}
                onClick={() => handleNavigation("payment-history")}
                style={{
                  backgroundColor:
                    currentPage === "payment-history"
                      ? "#007bff"
                      : "transparent",
                  color:
                    currentPage === "payment-history" ? "white" : "#adb5bd",
                  textDecoration: "none",
                }}
              >
                <i className="fas fa-calendar-alt fa-fw"></i>
                <span>Payment History</span>
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
                <i className="fas fa-calendar-alt fa-fw"></i>
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

      {/* Main Content */}
      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h1 className="h2 text-dark mb-1">
                      Welcome back,{" "}
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Accountant"}
                      !
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
                  <TotalBillCard />
                  <PaymentReceived />
                  <PendingPaymentCard />
                </div>

                {/* Recent Notices */}
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-dark">Recent Notices</h5>
                    <button
                      className="btn btn-link p-0 text-primary"
                      onClick={() => handleNavigation("notices")}
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
            }
          />
          <Route path="notices" element={<NoticesEvents />} />
          <Route path="bills" element={<BillManagement />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
