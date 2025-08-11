import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/resident', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/resident/notices', icon: 'fas fa-bell', label: 'Notices & Events' },
    { path: '/resident/payments', icon: 'fas fa-credit-card', label: 'Payments' },
    { path: '/resident/complaints', icon: 'fas fa-exclamation-circle', label: 'Complaints' },
    { path: '/resident/facility-booking', icon: 'fas fa-calendar-check', label: 'Facility Booking' },
    { path: '/resident/my-booking', icon: 'fas fa-calendar-check', label: 'My Booking' }
  ];

  return (
    <div className="bg-dark text-white vh-100 p-3 position-fixed" style={{ width: '260px', zIndex: 1000 }}>
      <div className="d-flex align-items-center mb-4">
        <i className="fas fa-home text-primary me-3 fs-4"></i>
        <span className="fs-4 fw-bold">HomeHive</span>
      </div>
      <nav>
        <ul className="nav flex-column">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item mb-1">
              <Link
                to={item.path}
                className={`nav-link text-white d-flex align-items-center p-3 rounded ${
                  location.pathname === item.path 
                    ? 'bg-primary' 
                    : 'text-white-50 hover-bg-secondary'
                }`}
                style={{
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                <i className={`${item.icon} me-3`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;