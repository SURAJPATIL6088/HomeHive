import React, { useState, useEffect } from "react";
import BillService from "../Services/BillService";
import { getAllUsers } from "../Services/UserService";

const BillTable = () => {
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);

  useEffect(() => {
    fetchBills();
    fetchUsers();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await BillService.getAllBills();
      setBills(res);
      console.log(res);
    } catch (err) {
      alert("Failed to fetch bills");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      console.log("API users:", res.data); // Now logs the array
      setUsers(res.data.filter((u) => u.role === "ROLE_RESIDENT"));
    } catch (err) {
      setUsers([]);
    }
  };

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-muted fw-bold small">Resident</th>
                <th className="text-muted fw-bold small">Bill Number</th>
                <th className="text-muted fw-bold small">Amount</th>
                <th className="text-muted fw-bold small">Due Date</th>
                <th className="text-muted fw-bold small">Penalty</th>
                <th className="text-muted fw-bold small">Status</th>
                <th className="text-muted fw-bold small">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    No bills found.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="text-dark">
                      {bill.resident?.firstName +
                        " " +
                        bill.resident?.lastName || bill.resident?.username}
                    </td>
                    <td className="text-dark">{bill.billNumber}</td>
                    <td className="text-dark">₹{bill.totalAmount}</td>
                    <td className="text-dark">{bill.dueDate}</td>
                    <td className="text-dark">₹{bill.penaltyAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          bill.payment
                            ? "bg-success"
                            : new Date(bill.dueDate) < new Date()
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {bill.payment
                          ? "PAID"
                          : new Date(bill.dueDate) < new Date()
                          ? "OVERDUE"
                          : "PENDING"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-outline-success btn-sm"
                          title="View Details"
                          onClick={() => {
                            setSelectedBill(bill);
                            setShowBillModal(true);
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBillModal && selectedBill && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowBillModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bill Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBillModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Bill Number:</strong> {selectedBill.billNumber}
                </p>
                <p>
                  <strong>Bill Date:</strong> {selectedBill.billDate}
                </p>
                <p>
                  <strong>Due Date:</strong> {selectedBill.dueDate}
                </p>
                <p>
                  <strong>Resident:</strong> {selectedBill.resident?.firstName}{" "}
                  {selectedBill.resident?.lastName} (Flat:{" "}
                  {selectedBill.resident?.flatNo})
                </p>
                <p>
                  <strong>Type:</strong> {selectedBill.type || "Maintenance"}
                </p>
                <p>
                  <strong>Description:</strong> {selectedBill.description}
                </p>
                <p>
                  <strong>Maintenance Amount:</strong> ₹
                  {selectedBill.maintenanceAmount}
                </p>
                <p>
                  <strong>Penalty Amount:</strong> ₹{selectedBill.penaltyAmount}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{selectedBill.totalAmount}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`badge ms-2 ${
                      selectedBill.payment
                        ? "bg-success"
                        : new Date(selectedBill.dueDate) < new Date()
                        ? "bg-danger"
                        : "bg-warning"
                    }`}
                  >
                    {selectedBill.payment
                      ? "PAID"
                      : new Date(selectedBill.dueDate) < new Date()
                      ? "OVERDUE"
                      : "PENDING"}
                  </span>
                </p>
                <p>
                  <strong>Generated By:</strong>{" "}
                  {selectedBill.generatedBy?.firstName}{" "}
                  {selectedBill.generatedBy?.lastName}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBillModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillTable;
