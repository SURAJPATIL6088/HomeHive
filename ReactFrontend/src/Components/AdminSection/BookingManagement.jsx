import React, { useEffect, useState } from 'react';
import { 
  getAllBookingsForAdmin, 
  getPendingBookings, 
  acceptBookingRequest, 
  rejectBookingRequest 
} from '../Services/BookingService';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminComments, setAdminComments] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const [allBookingsRes, pendingBookingsRes] = await Promise.all([
        getAllBookingsForAdmin(),
        getPendingBookings()
      ]);
      setBookings(allBookingsRes.data);
      setPendingBookings(pendingBookingsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning';
      case 'ACCEPTED': return 'bg-info';
      case 'CONFIRMED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'CANCELLED': return 'bg-secondary';
      case 'COMPLETED': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const handleAcceptBooking = async (booking) => {
    try {
      setActionLoading(booking.id);
      await acceptBookingRequest(booking.id, adminComments);
      alert('Booking accepted successfully! Email notification sent to resident.');
      loadBookings();
      setAdminComments('');
    } catch (error) {
      alert('Failed to accept booking: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(selectedBooking.id);
      await rejectBookingRequest(selectedBooking.id, rejectionReason);
      alert('Booking rejected successfully! Email notification sent to resident.');
      loadBookings();
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedBooking(null);
    } catch (error) {
      alert('Failed to reject booking: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const renderBookingTable = (bookingsData, showActions = false) => (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Booking #</th>
            <th>Resident</th>
            <th>Facility</th>
            <th>Date & Time</th>
            <th>Amount</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Submitted</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookingsData.map(booking => (
            <tr key={booking.id}>
              <td>
                <small className="text-muted">{booking.bookingNumber}</small>
              </td>
              <td>
                <div>
                  <strong>{booking.resident?.firstName} {booking.resident?.lastName}</strong>
                  <br />
                  <small className="text-muted">{booking.resident?.email}</small>
                </div>
              </td>
              <td>
                <div>
                  <strong>{booking.facility?.name}</strong>
                  <br />
                  <small className="text-muted">Capacity: {booking.facility?.capacity}</small>
                </div>
              </td>
              <td>
                <div>
                  <strong>{booking.bookingDate}</strong>
                  <br />
                  <small className="text-muted">{booking.startTime} - {booking.endTime}</small>
                </div>
              </td>
              <td>
                <strong>₹{booking.totalAmount}</strong>
              </td>
              <td>
                <small>{booking.purpose || '-'}</small>
              </td>
              <td>
                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <small className="text-muted">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </small>
              </td>
              {showActions && (
                <td>
                  <div className="btn-group" role="group">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleAcceptBooking(booking)}
                      disabled={actionLoading === booking.id}
                      title="Accept Booking"
                    >
                      {actionLoading === booking.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-check"></i>
                      )}
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => openRejectModal(booking)}
                      disabled={actionLoading === booking.id}
                      title="Reject Booking"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-dark">Booking Management</h1>
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={loadBookings}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-1"></i>
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <i className="fas fa-clock me-2"></i>
            Pending Requests
            <span className="badge bg-warning ms-2">{pendingBookings.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <i className="fas fa-list me-2"></i>
            All Bookings
            <span className="badge bg-secondary ms-2">{bookings.length}</span>
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading bookings...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      ) : (
        <>
          {activeTab === 'pending' && (
            <>
              <div className="mb-3">
                <h5 className="text-warning">Pending Booking Requests</h5>
                <p className="text-muted small">
                  Review and approve/reject facility booking requests from residents
                </p>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No pending booking requests</h5>
                  <p className="text-muted">All booking requests have been processed.</p>
                </div>
              ) : (
                renderBookingTable(pendingBookings, true)
              )}
            </>
          )}

          {activeTab === 'all' && (
            <>
              <div className="mb-3">
                <h5 className="text-muted">All Booking Records</h5>
                <p className="text-muted small">Complete history of facility booking requests</p>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No bookings found</h5>
                </div>
              ) : (
                renderBookingTable(bookings)
              )}
            </>
          )}
        </>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Booking Request</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Booking Details:</strong>
                  <div className="mt-2">
                    <p className="mb-1">
                      <strong>Resident:</strong> {selectedBooking?.resident?.firstName} {selectedBooking?.resident?.lastName}
                    </p>
                    <p className="mb-1">
                      <strong>Facility:</strong> {selectedBooking?.facility?.name}
                    </p>
                    <p className="mb-1">
                      <strong>Date:</strong> {selectedBooking?.bookingDate}
                    </p>
                    <p className="mb-1">
                      <strong>Time:</strong> {selectedBooking?.startTime} - {selectedBooking?.endTime}
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <strong>Reason for Rejection *</strong>
                  </label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Please provide a reason for rejecting this booking request..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                  <small className="text-muted">
                    This reason will be sent to the resident via email.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleRejectBooking}
                  disabled={!rejectionReason.trim() || actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-1"></i>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times me-1"></i>
                      Reject Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement;
