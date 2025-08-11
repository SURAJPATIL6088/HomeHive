import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveNotices } from '../Services/NoticeService';

const NoticesEvents = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await getActiveNotices();
      setNotices(res.data);
    } catch (err) {
      alert("Failed to fetch notices");
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/accountant');
  };

  return (
    <div className="container-fluid p-4">
      {/* Back Button */}
      <button 
        className="btn btn-link text-muted p-0 mb-3 d-flex align-items-center gap-2"
        onClick={handleBack}
        style={{ textDecoration: 'none' }}
      >
        <i className="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>

      <div className="mb-4">
        <h1 className="h2 text-dark mb-0">Notices & Events</h1>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center">Loading...</div>
        ) : notices.length === 0 ? (
          <div className="col-12 text-center">No notices/events found.</div>
        ) : (
          notices.map((notice) => (
            <div className="col-lg-6" key={notice.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="mb-3">
                    <span className={`badge ${notice.type === 'EVENT' ? 'bg-warning' : 'bg-primary'}`}>
                      {notice.type || 'NOTICE'}
                    </span>
                  </div>
                  <div>
                    <h5 className="card-title text-dark mb-3">{notice.title}</h5>
                    <p className="card-text text-muted mb-3">{notice.content}</p>
                    <small className="text-muted">{notice.validUntil ? notice.validUntil.slice(0, 10) : ''}</small>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticesEvents;
