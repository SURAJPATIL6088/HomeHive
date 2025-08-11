import React, { useState, useRef, useEffect, useContext } from "react";
import Stats from "./Stats.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import UserManagement from "./UserManagement.jsx";
import Complaints from "./Complaints.jsx";
import Facilities from "./Facilities.jsx";
import Profile from "./Profile.jsx";
import BookingManagement from "./BookingManagement.jsx";
import Logout from "../Logout.jsx";

import Sidebar from "../Pages/Sidebar.jsx";
import Notices from "../Pages/Notices.jsx";
import NoticesPage from "../Pages/NoticesPage.jsx";
import { AuthContext } from "../Context/AuthContext.jsx";

function Dashboard() {
  const [showFabMenu, setShowFabMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  const fabRef = useRef(null);
  const fabMenuRef = useRef(null);

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fabRef.current &&
        !fabRef.current.contains(event.target) &&
        fabMenuRef.current &&
        !fabMenuRef.current.contains(event.target)
      ) {
        setShowFabMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddNotice = () => {
    navigate("/admin/notices");
    setShowFabMenu(false);
  };

  const getCurrentPage = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "notices":
        return "notices";
      case "users":
        return "users";
      case "bookings":
        return "bookings";
      case "complaints":
        return "complaints";
      case "facilities":
        return "facilities";
      case "profile":
        return "profile";
      default:
        return "dashboard";
    }
  };

  const isDashboardHome =
    location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Sidebar
        currentPage={getCurrentPage()}
        setCurrentPage={(page) =>
          navigate(`/admin/${page === "dashboard" ? "" : page}`)
        }
      />

      <main className="flex-grow-1">
        <div className="container-fluid p-4">
          {isDashboardHome && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0 text-dark">Welcome back, {loading ? 'Loading...' : (user ? `${user.firstName} ${user.lastName}` : 'Admin User')}!</h2>
              <div className="btn btn-outline-danger d-flex align-items-center gap-2">
                <Logout/>
              </div>
            </div>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Stats />
                  <div className="position-relative">
                    <Notices />
                    {/* Floating Action Button */}
                    <div className="position-fixed" style={{ bottom: "30px", right: "30px", zIndex: 1050 }}>
                      <div className="dropup">
                        <button
                          className="btn btn-primary btn-lg rounded-circle shadow"
                          onClick={() => setShowFabMenu(!showFabMenu)}
                          ref={fabRef}
                          style={{ width: "60px", height: "60px" }}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                        {showFabMenu && (
                          <div className="dropdown-menu show position-absolute bottom-100 end-0 mb-2" ref={fabMenuRef}>
                            <button
                              className="dropdown-item d-flex align-items-center gap-2"
                              onClick={handleAddNotice}
                            >
                              <i className="fas fa-bullhorn text-primary"></i>
                              Add Notice/Event
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
