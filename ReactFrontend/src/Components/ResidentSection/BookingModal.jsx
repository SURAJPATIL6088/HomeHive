import React, { useState } from 'react';

const BookingModal = ({ facility, onClose, onSubmit }) => {
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ bookingDate, startTime, endTime, purpose });
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Book {facility.name}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Start Time</label>
                <input type="time" className="form-control" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">End Time</label>
                <input type="time" className="form-control" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Purpose</label>
                <input type="text" className="form-control" value={purpose} onChange={e => setPurpose(e.target.value)} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Book</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;