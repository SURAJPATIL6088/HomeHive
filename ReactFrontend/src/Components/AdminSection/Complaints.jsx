import React, { useState } from 'react';

function Complaints() {
  const [showAddComplaintModal, setShowAddComplaintModal] = useState(false);

  const complaints = [
    {
      id: 1,
      flat: "A-101",
      type: "Plumbing",
      description: "Leaky faucet in kitchen",
      status: "PENDING",
      date: "2024-07-20"
    },
    {
      id: 2,
      flat: "B-205",
      type: "Electricity",
      description: "Power outage in corridor",
      status: "IN PROGRESS",
      date: "2024-07-18"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-pending';
      case 'IN PROGRESS':
        return 'status-in-progress';
      case 'RESOLVED':
        return 'status-resolved';
      default:
        return 'status-default';
    }
  };

  return (
    <>
      <div className="complaints-page">
        <div className="complaints-header">
          <h1>All Complaints</h1>
          <button className="add-complaint-btn" onClick={() => setShowAddComplaintModal(true)}>
            <i className="fas fa-plus"></i>
            <span>Add Complaint</span>
          </button>
        </div>
        
        <div className="complaints-table-container">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>FLAT</th>
                <th>TYPE</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className="complaint-flat">{complaint.flat}</td>
                  <td className="complaint-type">{complaint.type}</td>
                  <td className="complaint-description">{complaint.description}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="complaint-date">{complaint.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddComplaintModal && (
        <div className="modal-overlay" onClick={() => setShowAddComplaintModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Complaint</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Flat</label>
                <input type="text" className="form-control" placeholder="Enter flat number" />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="form-control">
                  <option>Select Type</option>
                  <option>Plumbing</option>
                  <option>Electricity</option>
                  <option>HVAC</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows="4" placeholder="Enter complaint description"></textarea>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowAddComplaintModal(false)}>
                Cancel
              </button>
              <button className="btn-add-complaint">
                Add Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Complaints; 