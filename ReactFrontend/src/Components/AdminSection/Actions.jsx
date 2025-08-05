import React, { useState } from 'react';

function Actions() {
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  return (
    <>
      <div className="homehive-actions-card">
        <h3>Quick Actions</h3>
        <div className="actions-buttons">
          <button className="action-btn add-notice" onClick={() => setShowAddNoticeModal(true)}>
            <i className="fas fa-plus"></i>
            <span>Add Notice</span>
          </button>
          <button className="action-btn manage-users" onClick={() => setShowAddUserModal(true)}>
            <i className="fas fa-users"></i>
            <span>Manage Users</span>
          </button>
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

      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add User</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="Enter name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="form-control">
                  <option>Select Role</option>
                  <option>Admin</option>
                  <option>Resident</option>
                  <option>Accountant</option>
                </select>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowAddUserModal(false)}>
                Cancel
              </button>
              <button className="btn-add-user">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Actions; 