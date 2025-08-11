import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { bookFacility } from '../Services/BookingService';
import BookingModal from './BookingModal';

const FacilityBookingPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8080/facilities/all-facilities')
      .then(res => {
        setFacilities(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load facilities');
        setLoading(false);
      });
  }, []);

  const handleBookNow = (facility) => {
    setSelectedFacility(facility);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const response = await bookFacility({
        facilityId: selectedFacility.id,
        bookingDate: bookingData.bookingDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        purpose: bookingData.purpose
      });
      
      setShowBookingModal(false);
      
      alert("Booking request submitted successfully!");
      
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.message || err.message ));
    }
  };

  return (
    <div className="p-4">
      <h1 className="h3 mb-4 text-dark">Facility Booking</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <div className="row g-4">
          {facilities.map(facility => (
            <div key={facility.id} className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h5 className="card-title text-dark mb-2">{facility.name} - {facility.type}</h5>
                      <p className="text-muted small mb-1">
                        <i className="fas fa-users me-2"></i>
                        Capacity: {facility.capacity}
                      </p>
                      <p className="text-muted small mb-2">
                        <i className="fas fa-rupee-sign me-2"></i>
                        ₹{facility.hourlyRate} per hour
                      </p>
                      {facility.description && (
                        <p className="text-muted small">{facility.description}</p>
                      )}
                    </div>
                    <button className="btn btn-primary ms-3" onClick={() => handleBookNow(facility)}>
                      <i className="fas fa-calendar-plus me-2"></i>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {facilities.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No facilities available</h5>
          <p className="text-muted">Please contact the admin for facility information.</p>
        </div>
      )}

      {showBookingModal && selectedFacility && (
        <BookingModal
          facility={selectedFacility}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default FacilityBookingPage;