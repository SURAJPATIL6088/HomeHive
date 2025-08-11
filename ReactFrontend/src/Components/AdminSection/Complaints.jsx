import React, { useState, useEffect } from 'react';
import { getAllComplaints, updateComplaintStatus } from "../Services/ComplaintService";

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminResponse: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    setLoading(true);
    setError('');
    getAllComplaints()
      .then(res => {
        setComplaints(res.data);
      })
      .catch(err => {
        setError('Error fetching complaints');
        console.error('Error fetching complaints:', err);
      })
      .finally(() => setLoading(false));
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'IN_PROGRESS':
        return 'bg-primary';
      case 'RESOLVED':
        return 'bg-success';
      case 'CLOSED':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  };

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusForm({
      status: complaint.status,
      adminResponse: complaint.adminResponse || ''
    });
    setShowStatusModal(true);
  };

  const openViewModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowViewModal(true);
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setStatusForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateComplaintStatus(selectedComplaint.id, {
        status: statusForm.status,
        adminResponse: statusForm.adminResponse
      });
      setShowStatusModal(false);
      setSelectedComplaint(null);
      setSuccess('Status updated successfully!');
      fetchComplaints();
    } catch (err) {
      setError('Error updating status');
      console.error('Error updating status:', err);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="mb-4">
          <h2 className="mb-0">All Complaints</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card border-0 shadow-sm">
          {loading ? (
            <div className="card-body text-center py-4">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-semibold text-uppercase small text-muted">FLAT</th>
                    <th className="fw-semibold text-uppercase small text-muted">USER</th>
                    <th className="fw-semibold text-uppercase small text-muted">TYPE</th>
                    <th className="fw-semibold text-uppercase small text-muted">TITLE</th>
                    <th className="fw-semibold text-uppercase small text-muted">STATUS</th>
                    <th className="fw-semibold text-uppercase small text-muted">DATE</th>
                    <th className="fw-semibold text-uppercase small text-muted">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">No complaints found.</td>
                    </tr>
                  ) : (
                    complaints.map((complaint) => (
                      <tr key={complaint.id}>
                        <td className="align-middle">{complaint.resident?.flatNo || '-'}</td>
                        <td className="align-middle text-muted">
                          {complaint.resident
                            ? `${complaint.resident.firstName} ${complaint.resident.lastName}`
                            : '-'}
                        </td>
                        <td className="align-middle">{complaint.type}</td>
                        <td className="align-middle">{complaint.title}</td>
                        
                        <td className="align-middle">
                          <span className={`badge ${getStatusBadgeColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="align-middle">
                          {complaint.createdAt
                            ? new Date(complaint.createdAt).toLocaleDateString()
                            : complaint.date || '-'}
                        </td>
                        <td className="align-middle">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => openViewModal(complaint)}
                            >
                              View
                            </button>
                            {(complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED') && (
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => openStatusModal(complaint)}
                              >
                                Change Status
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && selectedComplaint && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Complaint Status</h5>
                <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateStatus}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={statusForm.status}
                      onChange={handleStatusChange}
                      required
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Admin Response</label>
                    <textarea
                      name="adminResponse"
                      className="form-control"
                      rows="3"
                      placeholder="Enter response (optional)"
                      value={statusForm.adminResponse}
                      onChange={handleStatusChange}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowStatusModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedComplaint && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complaint Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">User</label>
                  <div>
                    {selectedComplaint.resident
                      ? `${selectedComplaint.resident.firstName} ${selectedComplaint.resident.lastName} (${selectedComplaint.resident.email})`
                      : '-'}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Flat</label>
                  <div>{selectedComplaint.resident?.flatNo || '-'}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Type</label>
                  <div>{selectedComplaint.type}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Title</label>
                  <div>{selectedComplaint.title}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <div>{selectedComplaint.description}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <div>
                    <span className={`badge ${getStatusBadgeColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Admin Response</label>
                  <div>{selectedComplaint.adminResponse || '-'}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Date</label>
                  <div>
                    {selectedComplaint.createdAt
                      ? new Date(selectedComplaint.createdAt).toLocaleString()
                      : selectedComplaint.date || '-'}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Complaints;
