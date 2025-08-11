import React, { useState } from "react";
import { removeToken } from "./Services/UserService";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";

const Logout = () => {
  const { setIsAuthenticated, setRole, setEmail, setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleLogout = () => {
    try {
      // Clear token from localStorage
      removeToken();
      
      // Clear all authentication state
      setIsAuthenticated(false);
      setRole(null);
      setEmail("");
      setUser(null);
      
      // Navigate to login with success message
      navigate("/login", { replace: true });
      
      // Optional: Show success toast
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const confirmLogout = () => {
    if (window.confirm(`Are you sure you want to logout${user ? `, ${user.firstName}` : ''}?`)) {
      handleLogout();
    }
  };

  return (
    <button 
      onClick={confirmLogout}
      className="btn btn-link p-0 text-decoration-none border-0 bg-transparent d-flex align-items-center"
      style={{ color: 'inherit' }}
      title="Logout from HomeHive"
    >
      <i className="fas fa-sign-out-alt me-1"></i>
      Logout
    </button>
  );
};

export default Logout;
