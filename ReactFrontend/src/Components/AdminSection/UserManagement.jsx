import React, { useState } from 'react';

function UserManagement() {
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "resident@homehive.com",
      role: "RESIDENT",
      flat: "A-101"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "accountant@homehive.com",
      role: "ACCOUNTANT",
      flat: "-"
    },
    {
      id: 3,
      name: "Admin User",
      email: "admin@homehive.com",
      role: "ADMIN",
      flat: "-"
    }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'RESIDENT':
        return 'role-resident';
      case 'ACCOUNTANT':
        return 'role-accountant';
      case 'ADMIN':
        return 'role-admin';
      default:
        return 'role-default';
    }
  };

  return (
    <>
      <div className="user-management-page">
        <div className="user-management-header">
          <h1>User Management</h1>
          <button className="add-user-btn" onClick={() => setShowAddUserModal(true)}>
            <i className="fas fa-plus"></i>
            <span>Add User</span>
          </button>
        </div>
        
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>FLAT</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className={`role-badge ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="user-flat">{user.flat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default UserManagement; 