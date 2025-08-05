import React, { useState } from 'react';

function NoticesPage() {
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);

  const notices = [
    {
      id: 1,
      title: "Society Meeting",
      description: "Monthly society meeting on 15th Aug",
      date: "2024-08-01",
      type: "NOTICE"
    },
    {
      id: 2,
      title: "Holi Celebration",
      description: "Join us for Holi celebration in the clubhouse",
      date: "2024-08-05",
      type: "EVENT"
    }
  ];

  return (
    <>
      <div className="notices-page">
        <div className="notices-header">
          <h1>Notices & Events</h1>
          <button className="add-notice-btn" onClick={() => setShowAddNoticeModal(true)}>
            <i className="fas fa-plus"></i>
            <span>Add Notice</span>
          </button>
        </div>
        
        <div className="notices-grid">
          {notices.map((notice) => (
            <div key={notice.id} className="notice-card">
              <div className="notice-label" data-type={notice.type.toLowerCase()}>
                {notice.type}
              </div>
              <div className="notice-content">
                <h3 className="notice-title">{notice.title}</h3>
                <p className="notice-description">{notice.description}</p>
                <div className="notice-date">{notice.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddNoticeModal && (
        <div className="modal-overlay" onClick={() => setShowAddNoticeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Notice/Event</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Type</label>
                <select className="form-control">
                  <option>Notice</option>
                  <option>Event</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" placeholder="Enter title" />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea className="form-control" rows="4" placeholder="Enter content"></textarea>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowAddNoticeModal(false)}>
                Cancel
              </button>
              <button className="btn-publish">
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoticesPage; 