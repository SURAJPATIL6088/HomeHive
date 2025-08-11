import React, {useState, useEffect} from "react";
import { getMyBookings } from "../Services/BookingService";

const BookingCard = () => {
  const [upcomingBookings, setUpcomingBookings] = useState(0);

  useEffect(() => {
    getMyBookings().then((res) => {
      const bookings = res.data;
      const now = new Date();
      console.log(bookings);
      const upcoming = bookings.filter(
        (b) => new Date(b.bookingDate) >= now && b.status === "CONFIRMED"
      );
      setUpcomingBookings(upcoming.length);
    });
  }, []);

  return (
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-2 text-uppercase small fw-bold">
                UPCOMING BOOKINGS
              </p>
              <h3 className="text-dark mb-0">{upcomingBookings}</h3>
              <p className="text-success mb-0 small">
                {upcomingBookings > 0 ? "This week" : "No upcoming bookings"}
              </p>
            </div>
            <div className="text-primary">
              <i className="fas fa-calendar fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
