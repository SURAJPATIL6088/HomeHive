import React, { useState, useRef, useEffect } from 'react';
import Stats from './Stats';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import UserManagement from './UserManagement';
import Complaints from './Complaints';
import Facilities from './Facilities';
import Settings from './Settings';
import './Dashboard.css';
import actionIcon from '../../assets/action.png';

import Sidebar from '../Layouts/Sidebar';
import Notices from '../Layouts/Notices';
import Header from '../Layouts/Header';
import NoticesPage from '../Layouts/NoticesPage';


function Dashboard() {
  const [showFabMenu, setShowFabMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fabRef = useRef(null);
  const fabMenuRef = useRef(null);

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fabRef.current &&
        !fabRef.current.contains(event.target) &&
        fabMenuRef.current &&
        !fabMenuRef.current.contains(event.target)
      ) {
        setShowFabMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddNotice = () => {
    setShowFabMenu(false);
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
    setShowFabMenu(false);
  };

  const getCurrentPage = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'notices': return 'notices';
      case 'users': return 'users';
      case 'complaints': return 'complaints';
      case 'facilities': return 'facilities';
      case 'settings': return 'settings';
      default: return 'dashboard';
    }
  };

  const isDashboardHome = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <div className="homehive-dashboard">
      <Sidebar
        currentPage={getCurrentPage()}
        setCurrentPage={page => navigate(`/admin/${page === 'dashboard' ? '' : page}`)}
      />

      <main className="homehive-main">
        {isDashboardHome && (
          <div
            className="dashboard-topbar"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '2rem',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '2rem' }}>Welcome back, Admin User!</h2>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Admin</span>
              </div>
              <i className="fas fa-sign-out-alt logout-icon"></i>
            </div>
          </div>
        )}

        <Header currentPage={getCurrentPage()} />

        <Routes>
          <Route
            path="/"
            element={
              <div className="homehive-content">
                <Stats />
                <div className="homehive-bottom-section" style={{ position: 'relative' }}>
                  <Notices />
                  <div className="fab-container">
                    <button
                      className="fab"
                      onClick={() => setShowFabMenu(!showFabMenu)}
                      ref={fabRef}
                    >
                      <img src={actionIcon} alt="Action" style={{ width: 22, height: 22 }} />
                    </button>
                    {showFabMenu && (
                      <div className="fab-menu" ref={fabMenuRef}>
                        <button className="fab-action add-notice" onClick={handleAddNotice}>
                          <i className="fas fa-bullhorn"></i>
                          Add Notice
                        </button>
                        <button className="fab-action manage-users" onClick={handleManageUsers}>
                          <i className="fas fa-user-astronaut"></i>
                          Add User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            }
          />
          <Route path="notices" element={<NoticesPage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
