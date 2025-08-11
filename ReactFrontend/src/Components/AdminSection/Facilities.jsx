import React, { useEffect, useState } from "react";
import {
  getAllFacilities,
  addFacility,
  updateFacility,
  deleteFacility,
} from "../Services/FacilityService.js";

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState({
    name: "",
    type: "GYM",
    description: "",
    capacity: "",
    hourlyRate: "",
    openTime: "",
    closeTime: "",
    isAvailable: true,
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFacilities = async () => {
    try {
      const response = await getAllFacilities();
      setFacilities(response.data);
    } catch (error) {
      console.error("Failed to fetch facilities", error);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateFacility(editId, newFacility);
        setEditId(null);
      } else {
        await addFacility(newFacility);
      }
      setNewFacility({
        name: "",
        type: "GYM",
        description: "",
        capacity: "",
        hourlyRate: "",
        openTime: "",
        closeTime: "",
        isAvailable: true,
      });
      setShowForm(false);
      fetchFacilities();
    } catch (error) {
      console.error("Failed to submit facility", error);
    }
  };

  const handleEdit = (facility) => {
    setEditId(facility._id || facility.id);
    setNewFacility({ ...facility });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;
    try {
      await deleteFacility(id);
      fetchFacilities();
    } catch (error) {
      console.error("Failed to delete facility", error);
    }
  };

  const getFacilityIcon = (type) => {
    switch(type) {
      case 'GYM': return 'fas fa-dumbbell';
      case 'MULTIPURPOSE_HALL': return 'fas fa-building';
      case 'CLUBHOUSE': return 'fas fa-home';
      case 'GARDEN': return 'fas fa-leaf';
      case 'PARKING': return 'fas fa-parking';
      default: return 'fas fa-building';
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Add New Facility</h2>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2" 
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i>
          Add Facility
        </button>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">All Facilities</h3>
        <div className="row">
          {facilities.map((facility) => (
            <div key={facility._id || facility.id} className="col-12 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-primary" style={{ fontSize: '1.5rem' }}>
                        <i className={getFacilityIcon(facility.type)}></i>
                      </div>
                      <div>
                        <h5 className="mb-1">
                          {facility.name} 
                          <span className="badge bg-secondary ms-2">
                            {facility.type?.replace('_', ' ')}
                          </span>
                        </h5>
                        <p className="text-muted mb-1">₹{facility.hourlyRate}/hr</p>
                        <div className="small text-muted">
                          <span className="me-3">
                            <i className="fas fa-clock me-1"></i>
                            Open: {facility.openTime} - {facility.closeTime}
                          </span>
                          <span>
                            <i className="fas fa-users me-1"></i>
                            Capacity: {facility.capacity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm" 
                        onClick={() => handleEdit(facility)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        onClick={() => handleDelete(facility._id || facility.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {facilities.length === 0 && (
            <div className="col-12 text-center py-4 text-muted">
              No facilities found. Add your first facility!
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? "Edit Facility" : "Add New Facility"}
                </h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setNewFacility({
                    name: "",
                    type: "GYM",
                    description: "",
                    capacity: "",
                    hourlyRate: "",
                    openTime: "",
                    closeTime: "",
                    isAvailable: true,
                  });
                }}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter facility name"
                        value={newFacility.name}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        value={newFacility.type}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, type: e.target.value })
                        }
                      >
                        <option value="GYM">GYM</option>
                        <option value="CLUBHOUSE">CLUBHOUSE</option>
                        <option value="MULTIPURPOSE_HALL">MULTIPURPOSE HALL</option>
                        <option value="GARDEN">GARDEN</option>
                        <option value="PARKING">PARKING</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter description"
                      value={newFacility.description}
                      onChange={(e) =>
                        setNewFacility({ ...newFacility, description: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter capacity"
                        value={newFacility.capacity}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, capacity: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hourly Rate (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter hourly rate"
                        value={newFacility.hourlyRate}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, hourlyRate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Open Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={newFacility.openTime}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, openTime: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Close Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={newFacility.closeTime}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, closeTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isAvailable"
                      checked={newFacility.isAvailable}
                      onChange={(e) =>
                        setNewFacility({ ...newFacility, isAvailable: e.target.checked })
                      }
                    />
                    <label className="form-check-label" htmlFor="isAvailable">
                      Available
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                      setNewFacility({
                        name: "",
                        type: "GYM",
                        description: "",
                        capacity: "",
                        hourlyRate: "",
                        openTime: "",
                        closeTime: "",
                        isAvailable: true,
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Update" : "Add"} Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Facilities;
