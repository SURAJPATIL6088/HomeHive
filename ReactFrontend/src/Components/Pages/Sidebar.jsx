import React from 'react';

function Sidebar({ currentPage, setCurrentPage }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', active: currentPage === 'dashboard' },
    { id: 'notices', label: 'Notices & Events', icon: 'fas fa-bell', active: currentPage === 'notices' },
    { id: 'users', label: 'User Management', icon: 'fas fa-users', active: currentPage === 'users' },
    { id: 'bookings', label: 'Booking Management', icon: 'fas fa-calendar-check', active: currentPage === 'bookings' },
    { id: 'complaints', label: 'All Complaints', icon: 'fas fa-exclamation-circle', active: currentPage === 'complaints' },
    { id: 'facilities', label: 'Facilities', icon: 'fas fa-building', active: currentPage === 'facilities' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-cog', active: currentPage === 'profile' }
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
  };

  return (
    <div className="d-flex flex-column" style={{ 
      width: "250px", 
      minWidth: "250px",
      maxWidth: "250px",
      minHeight: "100vh", 
      backgroundColor: "#2c3e50", 
      color: "white",
      flexShrink: 0
    }}>
      <div className="p-3 border-bottom border-secondary">
        <h4 className="mb-0 d-flex align-items-center gap-2">
          <span>🏠</span>
          <span>HomeHive</span>
        </h4>
      </div>
      
      <nav className="flex-grow-1 p-2">
        <ul className="list-unstyled">
          {navigationItems.map((item) => (
            <li key={item.id} className="mb-1">
              <button 
                className={`btn w-100 text-start d-flex align-items-center gap-3 py-2 px-3 border-0 rounded ${
                  item.active 
                    ? 'btn-primary' 
                    : 'text-light'
                }`}
                onClick={() => handleNavigation(item.id)}
                style={{
                  backgroundColor: item.active ? '#007bff' : 'transparent',
                  color: item.active ? 'white' : '#adb5bd',
                  textDecoration: 'none'
                }}
              >
                <i className={`${item.icon} fa-fw`}></i>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      

      <div className="p-3 border-top border-secondary text-center">
        <small className="text-muted ">Support@HomeHive.com</small>
      </div>
    </div>
  );
}

export default Sidebar;
