import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../Services/UserService';
import { getAllComplaints } from '../Services/ComplaintService';
import { getAllFacilities } from '../Services/FacilityService';

function Stats() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeComplaints, setActiveComplaints] = useState(0);
  const [totalFacilities, setTotalFacilities] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersRes = await getAllUsers();
      setTotalUsers(usersRes.data.length);

      const complaintsRes = await getAllComplaints();
      const active = complaintsRes.data.filter(
        c => c.status !== 'RESOLVED' && c.status !== 'CLOSED'
      ).length;
      setActiveComplaints(active);

      // Facilities
      const facilitiesRes = await getAllFacilities();
      setTotalFacilities(facilitiesRes.data.length);
    } catch (err) {
      console.log("something went wrong "+err);
    }
  };

  return (
    <div className="row mb-4">
      {/* Total Users */}
      <div className="col-md-4 mb-3">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-subtitle mb-2 text-muted">Total Users</h6>
              <h2 className="card-title mb-0 fw-bold text-primary">{totalUsers}</h2>
            </div>
            <div className="text-primary" style={{ fontSize: '2.5rem', opacity: 0.7 }}>
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Complaints */}
      <div className="col-md-4 mb-3">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-subtitle mb-2 text-muted">Active Complaints</h6>
              <h2 className="card-title mb-0 fw-bold text-warning">{activeComplaints}</h2>
            </div>
            <div className="text-warning" style={{ fontSize: '2.5rem', opacity: 0.7 }}>
              <i className="fas fa-exclamation-circle"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Facilities */}
      <div className="col-md-4 mb-3">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-subtitle mb-2 text-muted">Facilities</h6>
              <h2 className="card-title mb-0 fw-bold text-success">{totalFacilities}</h2>
            </div>
            <div className="text-success" style={{ fontSize: '2.5rem', opacity: 0.7 }}>
              <i className="fas fa-building"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
