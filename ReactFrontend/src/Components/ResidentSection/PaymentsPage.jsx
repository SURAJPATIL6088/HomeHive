import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BillService from '../Services/BillService';
import PaymentModal from './PaymentModal';

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchMyBills();
  }, []);

  const fetchMyBills = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await BillService.getMyBills();
      setBills(response || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setError(error.message || 'Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/resident');
  };

  const handlePayment = (bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    fetchMyBills();
    alert('Payment successful! Your bill has been paid.');
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBill(null);
  };

  const getPaymentStatus = (bill) => {
    if (bill.payment) {
      return bill.payment.status;
    }
    return 'PENDING';
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'FAILED': return 'bg-danger';
      default: return 'bg-warning';
    }
  };

  return (
    <div className="container-fluid p-4">
      <button 
        className="btn btn-link text-muted p-0 mb-3 d-flex align-items-center gap-2"
        onClick={handleBack}
        style={{ textDecoration: 'none' }}
      >
        <i className="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>

      <div className="mb-4">
        <h1 className="h2 text-dark mb-0">Payments</h1>
        <p className="text-muted mb-0">Manage your dues and payment history</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-muted fw-bold small">BILL TYPE</th>
                <th className="text-muted fw-bold small">AMOUNT</th>
                <th className="text-muted fw-bold small">DUE DATE</th>
                <th className="text-muted fw-bold small">STATUS</th>
                <th className="text-muted fw-bold small">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading bills...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center text-danger py-5">
                    <i className="fas fa-exclamation-triangle fa-3x mb-3 d-block"></i>
                    <h5 className="text-danger">Error Loading Bills</h5>
                    <p className="text-muted">{error}</p>
                    <button className="btn btn-primary" onClick={fetchMyBills}>
                      <i className="fas fa-refresh me-2"></i>
                      Retry
                    </button>
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-5">
                    <i className="fas fa-file-invoice-dollar fa-3x mb-3 d-block"></i>
                    <h5 className="text-muted">No bills found</h5>
                    <p className="text-muted">All your dues are cleared!</p>
                  </td>
                </tr>
              ) : (
                bills.map(bill => {
                  const paymentStatus = getPaymentStatus(bill);
                  return (
                    <tr key={bill.id}>
                      <td className="text-dark">{bill.description || 'General Bill'}</td>
                      <td className="text-dark">₹{bill.totalAmount?.toLocaleString() || '0'}</td>
                      <td className="text-dark">
                        {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${getBadgeClass(paymentStatus)}`}>
                          {paymentStatus}
                        </span>
                      </td>
                      <td>
                        {paymentStatus !== 'SUCCESS' ? (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handlePayment(bill)}
                          >
                            <i className="fas fa-credit-card me-2"></i>
                            Pay Now
                          </button>
                        ) : (
                          <button className="btn btn-outline-success btn-sm" title="View Details">
                            <i className="fas fa-check me-2"></i>
                            Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPaymentModalOpen && selectedBill && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          bill={selectedBill}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
