import React from 'react';

function Notices() {
  const notices = [
    {
      id: 1,
      title: 'Society Meeting',
      description: 'Monthly society meeting on 15th Aug',
      date: '2024-08-01'
    },
    {
      id: 2,
      title: 'Holi Celebration',
      description: 'Join us for Holi celebration in the clubhouse',
      date: '2024-08-05'
    }
  ];

  return (
    <div className="homehive-notices-card">
      <h3>Recent Notices</h3>
      <div className="notices-list">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-item">
            <div className="notice-content">
              <div className="notice-title">{notice.title}</div>
              <div className="notice-description">{notice.description}</div>
            </div>
            <div className="notice-date">{notice.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notices; 