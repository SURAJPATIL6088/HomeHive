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
      setNotices(res.data.slice(0, 3));
    } catch {
      setNotices([]);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 pb-0">
        <h5 className="card-title mb-0">Recent Notices</h5>
      </div>
      <div className="card-body">
        {notices.length === 0 ? (
          <div className="text-muted text-center py-3">No notices found.</div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id || notice._id} className="border-bottom py-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-light text-dark border">{notice.type || 'NOTICE'}</span>
                    <small className="text-muted">
                      {notice.validUntil
                        ? new Date(notice.validUntil).toLocaleDateString()
                        : notice.date || ''}
                    </small>
                  </div>
                  <h6 className="mb-1">{notice.title}</h6>
                  <p className="text-muted mb-0 small">
                    {(notice.content || notice.description)?.substring(0, 100)}
                    {(notice.content || notice.description)?.length > 100 && '...'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notices;
