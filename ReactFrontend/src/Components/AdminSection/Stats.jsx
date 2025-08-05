import React from 'react';

function Stats() {
  return (
    <div className="homehive-stats-section">
      <div className="stats-card total-users">
        <div className="stats-content">
          <div className="stats-info">
            <h3>Total Users</h3>
            <div className="stats-number">250</div>
          </div>
          <div className="stats-icon">
            <i className="fas fa-users"></i>
          </div>
        </div>
      </div>
      
      <div className="stats-card active-complaints">
        <div className="stats-content">
          <div className="stats-info">
            <h3>Active Complaints</h3>
            <div className="stats-number">12</div>
          </div>
          <div className="stats-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
        </div>
      </div>
      
      <div className="stats-card facilities">
        <div className="stats-content">
          <div className="stats-info">
            <h3>Facilities</h3>
            <div className="stats-number">8</div>
          </div>
          <div className="stats-icon">
            <i className="fas fa-building"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats; 