import React, { useEffect, useState } from 'react';
import { getMyComplaints } from '../Services/ComplaintService';
import ComplaintModal from './ComplaintModal';

const ComplaintsPage = ({ setShowComplaintModal }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchComplaints = () => {
    setLoading(true);
    getMyComplaints()
      .then(res => {
        setComplaints(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load complaints', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-dark">My Complaints</h1>
        <button
          onClick={() => setShowComplaintModal(true)}
          className="btn btn-primary d-flex align-items-center"
        >
          <i className="fas fa-plus me-2"></i>
          Raise Complaint
        </button>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-danger py-4">{error}</div>
            ) : (
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 text-muted small fw-bold text-uppercase">Type</th>
                    <th className="border-0 text-muted small fw-bold text-uppercase">Description</th>
                    <th className="border-0 text-muted small fw-bold text-uppercase">Status</th>
                    <th className="border-0 text-muted small fw-bold text-uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        <i className="fas fa-exclamation-circle fa-2x mb-3 d-block"></i>
                        No complaints filed yet
                      </td>
                    </tr>
                  ) : (
                    complaints.map(complaint => (
                      <tr key={complaint.id}>
                        <td className="py-3">{complaint.type}</td>
                        <td className="py-3">{complaint.description}</td>
                        <td className="py-3">
                          <span className={`badge ${complaint.status === 'PENDING' ? 'bg-warning' : 'bg-info'}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="py-3">{complaint.date || complaint.createdAt || ''}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <ComplaintModal
          setShowComplaintModal={setShowModal}
          onSuccess={fetchComplaints}
        />
      )}
    </div>
  );
};

export default ComplaintsPage;
