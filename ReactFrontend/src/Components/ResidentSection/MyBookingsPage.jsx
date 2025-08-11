import React, { useEffect, useState } from 'react';
import { getMyBookings, getAcceptedBookings } from '../Services/BookingService';
import BookingPaymentService from '../Services/BookingPaymentService';
import config from '../../config/config';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const [allBookingsRes, acceptedBookingsRes] = await Promise.all([
        getMyBookings(),
        getAcceptedBookings()
      ]);
      setBookings(allBookingsRes.data);
      setAcceptedBookings(acceptedBookingsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = () => {
    return 'bg-secondary';
  };

  const handlePayment = async (booking) => {
    try {
      setPaymentProcessing(booking.id);
      
      const scriptLoaded = await BookingPaymentService.loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment system');
        return;
      }

      const paymentData = await BookingPaymentService.createBookingPaymentOrder(booking.id);
      
      const options = {
        key: config.razorpay.keyId,
        amount: paymentData.amount * 100,
        currency: 'INR',
        name: 'HomeHive',
        description: `Payment for ${booking.facility.name} booking`,
        order_id: paymentData.razorpayOrderId,
        handler: async function (response) {
          try {
            await BookingPaymentService.verifyBookingPayment({
              paymentId: paymentData.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            alert('Payment successful! Your booking is confirmed.');
            loadBookings();
          } catch (error) {
            alert('Payment verification failed', error);
          }
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(null);
          }
        },
        prefill: {
          name: 'Resident Name',
          email: 'resident@example.com'
        },
        theme: {
          color: '#007bff'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      alert('Payment initiation failed: ' + error.message);
    } finally {
      setPaymentProcessing(null);
    }
  };

  const renderBookingTable = (bookingsData, showPaymentButton = false) => (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Booking #</th>
            <th>Facility</th>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Purpose</th>
            {showPaymentButton && <th>Action</th>}
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
                  <strong>{booking.facility?.name || '-'}</strong>
                  <br />
                  <small className="text-muted">{booking.facility?.type}</small>
                </div>
              </td>
              <td>{booking.bookingDate}</td>
              <td>
                <small>
                  {booking.startTime} - {booking.endTime}
                </small>
              </td>
              <td>
                <strong>₹{booking.totalAmount}</strong>
              </td>
              <td>
                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <small>{booking.purpose || '-'}</small>
              </td>
              {showPaymentButton && (
                <td>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handlePayment(booking)}
                    disabled={paymentProcessing === booking.id}
                  >
                    {paymentProcessing === booking.id ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-credit-card me-1"></i>
                        Pay Now
                      </>
                    )}
                  </button>
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
        <h1 className="h3 mb-0 text-dark">My Bookings</h1>
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={loadBookings}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-1"></i>
          Refresh
        </button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <i className="fas fa-calendar-alt me-2"></i>
            All Bookings
            <span className="badge bg-secondary ms-2">{bookings.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <i className="fas fa-credit-card me-2"></i>
            Ready for Payment
            <span className="badge bg-info ms-2">{acceptedBookings.length}</span>
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
          {activeTab === 'all' && (
            <>
              <div className="mb-3">
                <h5 className="text-muted">All Booking Requests</h5>
                <p className="text-muted small">Track the status of all your facility booking requests</p>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No bookings found</h5>
                  <p className="text-muted">Start by booking a facility from the Facility Booking page.</p>
                </div>
              ) : (
                renderBookingTable(bookings)
              )}
            </>
          )}

          {activeTab === 'payment' && (
            <>
              <div className="mb-3">
                <h5 className="text-success">Accepted Bookings - Ready for Payment</h5>
                <p className="text-muted small">
                  These bookings have been approved by the admin. Complete the payment to confirm your booking.
                </p>
              </div>
              {acceptedBookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-check-circle fa-3x text-info mb-3"></i>
                  <h5 className="text-muted">No approved bookings for payment</h5>
                  <p className="text-muted">Once admin approves your booking requests, they will appear here for payment.</p>
                </div>
              ) : (
                <>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Payment Instructions:</strong> Click "Pay Now" to complete the payment and confirm your booking.
                  </div>
                  {renderBookingTable(acceptedBookings, true)}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookingsPage;