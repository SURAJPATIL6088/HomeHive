import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  deactivateUser,
  grantUserRole,
} from "../Services/UserService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGrantRoleModal, setShowGrantRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ROLE_RESIDENT":
        return "bg-success";
      case "ROLE_ACCOUNTANT":
        return "bg-primary";
      case "ROLE_ADMIN":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this user?"))
      return;
    try {
      await deactivateUser(userId);
      fetchUsers();
    } catch (err) {
      setError("Failed to deactivate user");
    }
  };

  const openGrantRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowGrantRoleModal(true);
  };

  const handleGrantRole = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newRole) return;
    try {
      await grantUserRole(selectedUser.id, newRole);
      setShowGrantRoleModal(false);
      setSelectedUser(null);
      setNewRole("");
      fetchUsers();
    } catch (err) {
      setError("Failed to grant role");
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="mb-4">
          <h2 className="mb-0">User Management</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card border-0 shadow-sm">
          {loading ? (
            <div className="card-body text-center py-4">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-semibold text-uppercase small text-muted">
                      NAME
                    </th>
                    <th className="fw-semibold text-uppercase small text-muted">
                      EMAIL
                    </th>
                    <th className="fw-semibold text-uppercase small text-muted">
                      ROLE
                    </th>
                    <th className="fw-semibold text-uppercase small text-muted">
                      FLAT
                    </th>
                    <th className="fw-semibold text-uppercase small text-muted">
                      MOBILE
                    </th>
                    <th className="fw-semibold text-uppercase small text-muted">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="align-middle">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="align-middle text-muted">{user.email}</td>
                      <td className="align-middle">
                        <span
                          className={`badge ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role.replace("ROLE_", "")}
                        </span>
                      </td>
                      <td className="align-middle">{user.flatNo || "-"}</td>
                      <td className="align-middle">{user.mobileNo || "-"}</td>
                      <td className="align-middle">
                        <div className="d-flex gap-2">
                          {user.role !== "ROLE_ADMIN" && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeactivate(user.id)}
                            >
                              Deactivate
                            </button>
                          )}
                          {user.role !== "ROLE_ADMIN" && (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openGrantRoleModal(user)}
                            >
                              Grant Role
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showGrantRoleModal && selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Grant Role to {selectedUser.firstName} {selectedUser.lastName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowGrantRoleModal(false)}
                ></button>
              </div>
              <form onSubmit={handleGrantRole}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      required
                    >
                      <option value="ROLE_RESIDENT">Resident</option>
                      <option value="ROLE_ACCOUNTANT">Accountant</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setShowGrantRoleModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Grant Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserManagement;
