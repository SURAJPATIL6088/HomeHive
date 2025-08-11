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
      // Format validUntil for datetime-local input: YYYY-MM-DDTHH:MM
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
      // Convert validUntil to ISO string if present
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
      <div className="notices-page">
        <div className="notices-header">
          <h1>Notices & Events</h1>
          {isAdmin && (
            <button className="add-notice-btn" onClick={openAddModal}>
              <i className="fas fa-plus"></i>
              <span>Add Notice/Event</span>
            </button>
          )}
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="notices-grid">
            {notices.length === 0 && <div>No notices found.</div>}
            {notices.map((notice) => (
              <div
                key={notice.id || notice.noticeId || notice._id}
                className="notice-card"
              >
                <div
                  className="notice-label"
                  data-type={(notice.type || "notice").toLowerCase()}
                >
                  {notice.type || "NOTICE"}
                </div>
                <div className="notice-content">
                  <h3 className="notice-title">{notice.title}</h3>
                  <p className="notice-description">
                    {notice.content || notice.description}
                  </p>
                  <div className="notice-date">
                    {notice.validUntil
                      ? new Date(notice.validUntil).toLocaleString()
                      : notice.date}
                  </div>
                  <div className="notice-actions">
                    <button onClick={() => openViewModal(notice)}>
                      View
                    </button>
                    {isAdmin && (
                      <>
                        <button onClick={() => openEditModal(notice)}>
                          Edit
                        </button>
                        <button
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
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && modalMode !== "view" && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>
              {modalMode === "add" ? "Add Notice/Event" : "Edit Notice/Event"}
            </h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="NOTICE">Notice</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
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
              <div className="form-group">
                <label>Content</label>
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
              <div className="form-group">
                <label>Valid Until</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="validUntil"
                  value={form.validUntil}
                  onChange={handleFormChange}
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-publish">
                  {modalMode === "add" ? "Publish" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showModal && modalMode === "view" && selectedNotice && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Notice/Event Details</h2>
            <div className="form-group">
              <label>Type</label>
              <div>{selectedNotice.type || "NOTICE"}</div>
            </div>
            <div className="form-group">
              <label>Title</label>
              <div>{selectedNotice.title}</div>
            </div>
            <div className="form-group">
              <label>Content</label>
              <div>{selectedNotice.content || selectedNotice.description}</div>
            </div>
            <div className="form-group">
              <label>Valid Until</label>
              <div>
                {selectedNotice.validUntil
                  ? new Date(selectedNotice.validUntil).toLocaleString()
                  : "N/A"}
              </div>
            </div>
            <div className="modal-buttons">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoticesPage;