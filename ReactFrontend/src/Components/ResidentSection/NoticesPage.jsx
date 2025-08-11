import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveNotices } from '../Services/NoticeService';

const NoticesPage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await getActiveNotices();
        setNotices(res.data);
      } catch (err) {
        setNotices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  const handleBack = () => {
    navigate('/resident');
  };

  return (
    <div className="container-fluid p-4">
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
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3"></div>
                <h5 className="text-muted">Loading notices...</h5>
              </div>
            </div>
          </div>
        ) : notices.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No notices available</h5>
                <p className="text-muted">Check back later for updates and announcements.</p>
              </div>
            </div>
          </div>
        ) : (
          notices.map(notice => (
            <div key={notice.id || notice.noticeId} className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="mb-3">
                    <span className={`badge bg-primary`}>
                      NOTICE
                    </span>
                  </div>
                  <div>
                    <h5 className="card-title text-dark mb-3">{notice.title}</h5>
                    <p className="card-text text-muted mb-3">{notice.content || notice.description}</p>
                    <small className="text-muted">{notice.validUntil ? notice.validUntil.split('T')[0] : notice.date}</small>
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

export default NoticesPage;