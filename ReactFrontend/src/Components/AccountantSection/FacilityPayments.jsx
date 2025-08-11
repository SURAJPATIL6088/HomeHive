import React, { useEffect, useState } from 'react';
import { getBookingsWithPayments } from '../Services/BookingService';

const AccountantFacilityPayments = () => {
  const [bookingsWithPayments, setBookingsWithPayments] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadBookingsWithPayments();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookingsWithPayments, filterStatus, searchTerm]);

  const loadBookingsWithPayments = async () => {
    try {
      setLoading(true);
      const response = await getBookingsWithPayments();
      setBookingsWithPayments(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load facility payments');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookingsWithPayments;

    // Filter by payment status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => 
        booking.payment?.status === filterStatus.toUpperCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.resident?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.resident?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.resident?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.facility?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
    
    const revenue = filtered
      .filter(booking => booking.payment?.status === 'SUCCESS')
      .reduce((sum, booking) => sum + parseFloat(booking.totalAmount || 0), 0);
    setTotalRevenue(revenue);
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'FAILED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const csvHeaders = [
      'Booking Number',
      'Resident Name',
      'Resident Email',
      'Facility',
      'Booking Date',
      'Amount',
      'Payment Status',
      'Payment Date',
      'Transaction ID',
      'Razorpay Payment ID'
    ];

    const csvData = filteredBookings.map(booking => [
      booking.bookingNumber,
      `${booking.resident?.firstName} ${booking.resident?.lastName}`,
      booking.resident?.email,
      booking.facility?.name,
      booking.bookingDate,
      booking.totalAmount,
      booking.payment?.status || 'N/A',
      formatDate(booking.payment?.paymentDate),
      booking.payment?.transactionId || 'N/A',
      booking.payment?.razorpayPaymentId || 'N/A'
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facility_payments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-dark">Facility Payments</h1>
          <p className="text-muted mb-0">Manage and track facility booking payments</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-success btn-sm"
            onClick={exportToCSV}
            disabled={filteredBookings.length === 0}
          >
            <i className="fas fa-download me-1"></i>
            Export CSV
          </button>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={loadBookingsWithPayments}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Total Revenue</h5>
              <h3 className="text-success">₹{totalRevenue.toFixed(2)}</h3>
              <small className="text-muted">From successful payments</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body text-center">
              <h5 className="card-title text-info">Total Bookings</h5>
              <h3 className="text-info">{filteredBookings.length}</h3>
              <small className="text-muted">With payments</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <h5 className="card-title text-warning">Pending Payments</h5>
              <h3 className="text-warning">
                {filteredBookings.filter(b => b.payment?.status === 'PENDING').length}
              </h3>
              <small className="text-muted">Awaiting completion</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <h5 className="card-title text-danger">Failed Payments</h5>
              <h3 className="text-danger">
                {filteredBookings.filter(b => b.payment?.status === 'FAILED').length}
              </h3>
              <small className="text-muted">Need attention</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Filter by Payment Status</label>
          <select 
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Search</label>
          <input 
            type="text"
            className="form-control"
            placeholder="Search by resident name, facility, or booking number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading facility payments...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No facility payments found</h5>
          <p className="text-muted">
            {bookingsWithPayments.length === 0 
              ? "No facility bookings have been paid yet." 
              : "No payments match your current filters."
            }
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Booking Details</th>
                <th>Resident</th>
                <th>Facility</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Transaction Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <div>
                      <strong>{booking.bookingNumber}</strong>
                      <br />
                      <small className="text-muted">
                        {booking.bookingDate} | {booking.startTime} - {booking.endTime}
                      </small>
                    </div>
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
                      <small className="text-muted">
                        {booking.facility?.type} | Capacity: {booking.facility?.capacity}
                      </small>
                    </div>
                  </td>
                  <td>
                    <strong className="text-success">₹{booking.totalAmount}</strong>
                  </td>
                  <td>
                    <span className={`badge ${getPaymentStatusBadge(booking.payment?.status)}`}>
                      {booking.payment?.status || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <small>
                      {formatDate(booking.payment?.paymentDate)}
                    </small>
                  </td>
                  <td>
                    <div>
                      <small>
                        <strong>Transaction:</strong> {booking.payment?.transactionId || 'N/A'}
                        <br />
                        <strong>Razorpay:</strong> {booking.payment?.razorpayPaymentId || 'N/A'}
                        <br />
                        <strong>Method:</strong> {booking.payment?.paymentMethod || 'N/A'}
                      </small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountantFacilityPayments;
