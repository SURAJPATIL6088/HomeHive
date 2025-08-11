import React, {useEffect, useState} from "react";
import { getMyComplaints } from "../Services/ComplaintService";

const CompaintCard = () => {
    const [openComplaints, setOpenComplaints] = useState(0);

    useEffect(()=>{
        getMyComplaints().then((res) => {
          const complaints = res.data;
          setOpenComplaints(
            complaints.filter((c) => c.status !== "RESOLVED").length
          );
        });
    }, []);

  return (
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-2 text-uppercase small fw-bold">
                OPEN COMPLAINTS
              </p>
              <h3 className="text-dark mb-0">{openComplaints}</h3>
              <p className="text-warning mb-0 small">
                {openComplaints > 0 ? "In progress" : "No open complaints"}
              </p>
            </div>
            <div className="text-warning">
              <i className="fas fa-exclamation-circle fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaintCard;
