import React, { useState, useEffect } from "react";
import PaymentService from "../Services/PaymentService";

const PendingDues = () => {
  const [pendingDues, setPendingDues] = useState(0);
  const [pendingDueDays, setPendingDueDays] = useState(null);

  useEffect(() => {
    PaymentService.getMyPayments().then((payments) => {
      const unpaid = payments.filter(
        (p) => p.status !== "SUCCESS" && p.status !== "PAID"
      );
      setPendingDues(unpaid.reduce((sum, p) => sum + (p.amount || 0), 0));
      if (unpaid.length > 0 && unpaid[0].bill?.dueDate) {
        const dueDate = new Date(unpaid[0].bill.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        setPendingDueDays(diffDays);
      }
    });
  }, []);
  return (
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-2 text-uppercase small fw-bold">
                PENDING DUES
              </p>
              <h3 className="text-dark mb-0">
                ₹{pendingDues.toLocaleString()}
              </h3>
              {pendingDueDays !== null && (
                <p className="text-danger mb-0 small">
                  Due in {pendingDueDays} days
                </p>
              )}
            </div>
            <div className="text-danger">
              <i className="fas fa-rupee-sign fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingDues;
