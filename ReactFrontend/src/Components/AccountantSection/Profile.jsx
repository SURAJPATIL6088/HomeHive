import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../Services/UserService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8080/users/profile", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(res.data);
    } catch (err) {
      setError("Failed to load profile");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <div className="d-flex flex-column align-items-center mb-4">
                <div
                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: 80, height: 80 }}
                >
                  <i className="fas fa-user fa-3x text-white"></i>
                </div>
                <h3 className="mb-0 text-dark">
                  {loading
                    ? "Loading..."
                    : profile
                    ? `${profile.firstName} ${profile.lastName}`
                    : "User Profile"}
                </h3>
                <span className="badge bg-secondary text-uppercase mt-2">
                  {profile?.role ? profile.role.replace("ROLE_", "") : ""}
                </span>
              </div>
              {error && (
                <div className="alert alert-danger text-center py-2">
                  {error}
                </div>
              )}
              {!loading && profile && (
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-muted">Email:</span>
                    <span className="text-dark">{profile.email}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-muted">Flat No:</span>
                    <span className="text-dark">{profile.flatNo || "-"}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-muted">Mobile No:</span>
                    <span className="text-dark">{profile.mobileNo || "-"}</span>
                  </li>
                </ul>
              )}
              {!loading && !profile && !error && (
                <div className="alert alert-warning text-center py-2">
                  No profile data found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
