import React, { useEffect, useState } from 'react';
import { getActiveNotices } from '../Services/NoticeService';

function Notices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await getActiveNotices();
      setNotices(res.data);
    } catch {
      setNotices([]);
    }
  };

  return (
    <div className="homehive-notices-card">
      <h3>Recent Notices</h3>
      <div className="notices-list">
        {notices.length === 0 ? (
          <div className="notice-item">No notices found.</div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id || notice._id} className="notice-item">
              <div className="notice-content">
                <div className="notice-title">{notice.title}</div>
                <div className="notice-description">{notice.content || notice.description}</div>
              </div>
              <div className="notice-date">
                {notice.validUntil
                  ? new Date(notice.validUntil).toLocaleDateString()
                  : notice.date || ''}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notices;