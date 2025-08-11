import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BillService from "../Services/BillService";
import { getAllUsers } from "../Services/UserService";
import BillTable from "../Stats_Cards/BillTable";

const BillManagement = () => {
  const navigate = useNavigate();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [newBill, setNewBill] = useState({
    residentId: "",
    type: "Maintenance",
    maintenanceAmount: "",
    description: "",
  });
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
    } catch (err) {
      alert("Failed to fetch bills");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      // console.log("API users:", res.data);
      setUsers(res.data.filter((u) => u.role === "ROLE_RESIDENT"));
    } catch (err) {
      setUsers([]);
    }
  };

  const handleBack = () => {
    navigate("/accountant");
  };

  const handleGenerateBill = () => {
    setShowGenerateModal(true);
  };

  const handleSubmitBill = async () => {
    if (
      newBill.residentId &&
      newBill.maintenanceAmount &&
      newBill.description
    ) {
      try {
        await BillService.generateBill({
          residentId: Number(newBill.residentId), // ensure it's a number
          maintenanceAmount: Number(newBill.maintenanceAmount), // ensure it's a number
          description: newBill.description,
        });
        alert("New bill generated successfully!");
        setShowGenerateModal(false);
        setNewBill({
          residentId: "",
          type: "Maintenance",
          maintenanceAmount: "",
          description: "",
        });
        fetchBills();
      } catch (err) {
        alert("Failed to generate bill!");
      }
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Back Button */}
      <button
        className="btn btn-link text-muted p-0 mb-3 d-flex align-items-center gap-2"
        onClick={handleBack}
        style={{ textDecoration: "none" }}
      >
        <i className="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="h2 text-dark mb-1">Bill Management</h1>
          <p className="text-muted mb-0">
            Manage and generate bills for residents
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={handleGenerateBill}
          >
            <i className="fas fa-plus"></i>
            <span>Generate Bill</span>
          </button>
        </div>
      </div>

      <BillTable />

      {showGenerateModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowGenerateModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Generate New Bill</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowGenerateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Resident:</label>
                  <select
                    className="form-select"
                    value={newBill.residentId}
                    onChange={(e) =>
                      setNewBill({ ...newBill, residentId: e.target.value })
                    }
                  >
                    <option value="">Select Resident</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName
                          ? `${u.firstName} ${u.lastName} (Flat: ${u.flatNo})`
                          : u.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Bill Type:</label>
                  <select
                    className="form-select"
                    value={newBill.type}
                    onChange={(e) =>
                      setNewBill({ ...newBill, type: e.target.value })
                    }
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Water Bill">Water Bill</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Parking">Parking</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newBill.maintenanceAmount}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        maintenanceAmount: e.target.value,
                      })
                    }
                    placeholder="Enter amount"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newBill.description}
                    onChange={(e) =>
                      setNewBill({ ...newBill, description: e.target.value })
                    }
                    placeholder="Description"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGenerateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitBill}
                >
                  Generate Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillManagement;
