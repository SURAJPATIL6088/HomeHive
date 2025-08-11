import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPayments, getPaymentById } from "../Services/PaymentService";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data);
      console.log(data);
    } catch (err) {
      alert("Failed to fetch payments");
    }
  };

  const handleViewDetails = async (paymentId) => {
    try {
      const payment = await getPaymentById(paymentId);
      setSelectedPayment(payment);
      console.log(payment);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch payment details");
    }
  };

  const handleBack = () => {
    navigate("/accountant");
  };

  return (
    <div className="container-fluid p-4">
      <button
        className="btn btn-link text-muted p-0 mb-3 d-flex align-items-center gap-2"
        onClick={handleBack}
        style={{ textDecoration: "none" }}
      >
        <i className="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>

      <div className="mb-4">
        <h1 className="h2 text-dark mb-1">Payments</h1>
        <p className="text-muted mb-0">Payment History</p>
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
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="text-dark">
                    {payment.bill?.description || payment.billType || "Facility Booking"}
                  </td>
                  <td className="text-dark">₹{payment.amount}</td>
                  <td className="text-dark">{payment.bill?.dueDate || "None"}</td>
                  <td>
                    <span
                      className={`badge ${
                        payment.status === "PENDING"
                          ? "bg-warning"
                          : payment.status === "SUCCESS"
                          ? "bg-success"
                          : payment.status === "FAILED"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      title="View Details"
                      onClick={() => handleViewDetails(payment.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Transaction ID:</strong>{" "}
                  {selectedPayment.transactionId}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{selectedPayment.amount}
                </p>
                <p>
                  <strong>Status:</strong> {selectedPayment.status}
                </p>
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {selectedPayment.paymentDate || "-"}
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {selectedPayment.paymentMethod || "-"}
                </p>
                <p>
                  <strong>Resident:</strong>{" "}
                  {selectedPayment.resident?.firstName}{" "}
                  {selectedPayment.resident?.lastName} (
                  {selectedPayment.resident?.email})
                </p>
                <p>
                  <strong>Bill Description:</strong>{" "}
                  {selectedPayment.bill?.description || "-"}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {selectedPayment.bill?.dueDate || "-"}
                </p>
                <p>
                  <strong>Failure Reason:</strong>{" "}
                  {selectedPayment.failureReason || "-"}
                </p>
                {/* Add more fields as needed */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
