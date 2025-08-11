import React, { useState, useEffect } from "react";
import BillService from "../Services/BillService";

const PendingPaymentCard = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const billsData = await BillService.getAllBills();
        setBills(billsData);
      } catch (err) {
        alert("Failed to fetch dashboard data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateStats = () => {
    const pendingPayments = bills.filter(
      (bill) =>
        !bill.payment ||
        (bill.payment &&
          bill.payment.status !== "SUCCESS" &&
          bill.payment.status !== "PAID")
    ).length;

    return {pendingPayments };
  };

  const { pendingPayments } = calculateStats();

  return (
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-2 text-uppercase small fw-bold">
                PENDING PAYMENTS
              </p>
              <h3 className="text-dark mb-0">{pendingPayments}</h3>
            </div>
            <div className="text-warning">
              <i className="fas fa-exclamation-triangle fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPaymentCard;
