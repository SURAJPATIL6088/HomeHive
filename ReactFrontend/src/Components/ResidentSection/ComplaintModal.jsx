import React, { useEffect, useState } from "react";
import { raiseComplaint } from "../Services/ComplaintService";
import { getUserProfile } from "../Services/UserService";

const ComplaintModal = ({ setShowComplaintModal, onClose, onSuccess }) => {
  const [isProfile, SetProfile] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    status: "OPEN",
    resident: { id: isProfile.id },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchResidentProfile() {
    try {
      const response = await getUserProfile();
      const resident = response.data;
      console.log(resident);
      SetProfile(resident);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  useEffect(() => {
    fetchResidentProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.type && formData.description) {
      setLoading(true);
      try {
        await raiseComplaint({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          status: formData.status,
          resident: { id: isProfile.id },
        });
        setLoading(false);
        setShowComplaintModal && setShowComplaintModal(false);
        onClose && onClose();
        onSuccess && onSuccess();
      } catch (err) {
        setLoading(false);
        setError("Failed to submit complaint");
      }
    }
  };

  const handleClose = () => {
    setShowComplaintModal && setShowComplaintModal(false);
    onClose && onClose();
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-exclamation-circle text-primary me-2"></i>
              Raise a Complaint
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label fw-semibold">Complaint Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select Type</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="ELECTRICITY">Electricity</option>
                  <option value="SECURITY">Security</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="Describe your complaint in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter complaint title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <i className="fas fa-paper-plane me-2"></i>
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
