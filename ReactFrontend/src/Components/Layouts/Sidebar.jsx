import React from 'react';

function Sidebar({ currentPage, setCurrentPage }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', active: currentPage === 'dashboard' },
    { id: 'notices', label: 'Notices & Events', icon: 'fas fa-bell', active: currentPage === 'notices' },
    { id: 'users', label: 'User Management', icon: 'fas fa-users', active: currentPage === 'users' },
    { id: 'complaints', label: 'All Complaints', icon: 'fas fa-exclamation-circle', active: currentPage === 'complaints' },
    { id: 'facilities', label: 'Facilities', icon: 'fas fa-building', active: currentPage === 'facilities' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', active: currentPage === 'settings' }
  ];

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
  };

  return (
    <div className="homehive-sidebar">
      <div className="sidebar-header">
        <h2>🏠 HomeHive</h2>
      </div>
      
      <nav className="sidebar-navigation">
        <ul>
          {navigationItems.map((item) => (
            <li key={item.id} className={item.active ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation(item.id); }}>
                <i className={item.icon}></i>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="made-with-claude">Support@HomeHive.com</div>
      </div>
    </div>
  );
}

export default Sidebar; 