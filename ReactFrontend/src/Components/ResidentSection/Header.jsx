import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../Services/UserService";

const Header = ({ setCurrentView }) => {
  const [userRole, setUserRoleState] = useState("");
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8080/users/profile', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(res.data.firstName + res.data.lastName);
      setUserRoleState(res.data.role);
    } catch (err) {
      setError('Failed to load profile');
    }
    setLoading(false);
  };

  console.log(profile);

  return (
    <div className="bg-white shadow-sm border-bottom p-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <i className="fas fa-home text-primary me-2 fs-5"></i>
        <span className="fw-semibold text-dark">HomeHive</span>
      </div>
      <div className="d-flex align-items-center">
        <span className="text-muted me-3">{profile}</span>
        <span className="badge bg-secondary me-3 text-capitalize">
          {profile}
        </span>
        <button
          onClick={() => setCurrentView("login")}
          className="btn btn-link text-primary p-0 text-decoration-none"
        >
          <i className="fas fa-sign-out-alt me-1"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
