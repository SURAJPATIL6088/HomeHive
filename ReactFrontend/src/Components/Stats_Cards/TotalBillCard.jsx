import React, { useState, useEffect, useContext } from "react";
import BillService from "../Services/BillService";
import TotalBillCard from "./TotalBillCard";

const TotalBillCards = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const billsData = await BillService.getAllBills();
        setBills(billsData);
      } catch (err) {
        alert("Failed to fetch dashboard data", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateStats = () => {
    const totalBills = bills.length;
    return { totalBills };
  };

  const { totalBills } = calculateStats();

  return (
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-2 text-uppercase small fw-bold">
                TOTAL BILLS GENERATED
              </p>
              <h3 className="text-dark mb-0">{totalBills}</h3>
            </div>
            <div className="text-dark">
              <i className="fas fa-file-alt fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalBillCards;
