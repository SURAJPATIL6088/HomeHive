import React, { useState, useEffect } from "react";
import { getAllPayments } from "../Services/PaymentService";

const PaymentReceived = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const paymentsData = await getAllPayments();
        setPayments(paymentsData);
      } catch (err) {
        alert("Failed to fetch dashboard data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateStats = () => {
    const paymentsReceived = payments
      .filter(
        (payment) => payment.status === "SUCCESS" || payment.status === "PAID"
      )
      .reduce((total, payment) => total + (payment.amount || 0), 0);

    return { paymentsReceived };
  };

  const { paymentsReceived } = calculateStats();

  return (
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-2 text-uppercase small fw-bold">
                PAYMENTS RECEIVED
              </p>
              <h3 className="text-dark mb-0">
                ₹{paymentsReceived.toLocaleString()}
              </h3>
            </div>
            <div className="text-success">
              <i className="fas fa-rupee-sign fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceived;
