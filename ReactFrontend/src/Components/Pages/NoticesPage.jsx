import React, { useState, useEffect } from "react";
import {
  getActiveNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../Services/NoticeService";
import { isAdmin } from "../Services/UserService";

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "NOTICE",
    validUntil: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await getAllNotices() : await getActiveNotices();
      setNotices(res.data);
    } catch (err) {
      alert("Failed to fetch notices");
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setModalMode("add");
    setForm({
      title: "",
      content: "",
      type: "NOTICE",
      validUntil: "",
    });
    setShowModal(true);
    setSelectedNotice(null);
  };

  const openEditModal = (notice) => {
    setModalMode("edit");
    setForm({
      title: notice.title,
      content: notice.content,
      type: notice.type || "NOTICE",
      validUntil: notice.validUntil
        ? new Date(notice.validUntil).toISOString().slice(0, 16)
        : "",
    });
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const openViewModal = (notice) => {
    setModalMode("view");
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await deleteNotice(noticeId);
      fetchNotices();
    } catch (err) {
      alert("Failed to delete notice");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let validUntil = form.validUntil ? new Date(form.validUntil).toISOString() : null;
      if (modalMode === "add") {
        await createNotice({
          title: form.title,
          content: form.content,
          type: form.type,
          validUntil,
        });
      } else if (modalMode === "edit" && selectedNotice) {
        await updateNotice(
          selectedNotice.id || selectedNotice.noticeId || selectedNotice._id,
          {
            title: form.title,
            content: form.content,
            type: form.type,
            validUntil,
          }
        );
      }
      setShowModal(false);
      fetchNotices();
    } catch (err) {
      alert("Failed to save notice");
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Notices & Events</h2>
          {isAdmin && (
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAddModal}>
              <i className="fas fa-plus"></i>
              <span>Add Notice/Event</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="row">
            {notices.length === 0 ? (
              <div className="col-12 text-center py-4 text-muted">No notices found.</div>
            ) : (
              notices.map((notice) => (
                <div key={notice.id || notice.noticeId || notice._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white border-0 pb-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${
                          (notice.type || "NOTICE").toLowerCase() === "notice" ? "bg-primary" : "bg-success"
                        }`}>
                          {notice.type || "NOTICE"}
                        </span>
                        <small className="text-muted">
                          {notice.validUntil
                            ? new Date(notice.validUntil).toLocaleDateString()
                            : notice.date}
                        </small>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{notice.title}</h5>
                      <p className="card-text text-muted flex-grow-1">
                        {notice.content || notice.description}
                      </p>
                      <div className="mt-auto">
                        <div className="d-flex gap-2 flex-wrap">
                          <button 
                            className="btn btn-outline-secondary btn-sm" 
                            onClick={() => openViewModal(notice)}
                          >
                            View
                          </button>
                          {isAdmin && (
                            <>
                              <button 
                                className="btn btn-outline-primary btn-sm" 
                                onClick={() => openEditModal(notice)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleDelete(
                                    notice.id || notice.noticeId || notice._id
                                  )
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showModal && modalMode !== "view" && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "add" ? "Add Notice/Event" : "Edit Notice/Event"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="NOTICE">Notice</option>
                      <option value="EVENT">Event</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter title"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      name="content"
                      rows="4"
                      value={form.content}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter content"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Valid Until</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="validUntil"
                      value={form.validUntil}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === "add" ? "Publish" : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModal && modalMode === "view" && selectedNotice && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notice/Event Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Type</label>
                  <div>{selectedNotice.type || "NOTICE"}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Title</label>
                  <div>{selectedNotice.title}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Content</label>
                  <div>{selectedNotice.content || selectedNotice.description}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Valid Until</label>
                  <div>
                    {selectedNotice.validUntil
                      ? new Date(selectedNotice.validUntil).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
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
    </>
  );
}

export default NoticesPage;