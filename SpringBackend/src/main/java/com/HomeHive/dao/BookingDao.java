package com.HomeHive.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HomeHive.entities.Booking;
import com.HomeHive.entities.Facility;
import com.HomeHive.entities.User;
import com.HomeHive.enums.BookingStatus;

@Repository
public interface BookingDao extends JpaRepository<Booking, Long>{
    List<Booking> findByResident(User resident);
    List<Booking> findByFacility(Facility facility);
    List<Booking> findByStatus(BookingStatus status);
    
    @Query("select b from Booking b where b.facility = :facility and b.bookingDate = :date " +
           "and b.status in ('CONFIRMED', 'PENDING', 'ACCEPTED') " +
           "and ((b.startTime <= :startTime and b.endTime > :startTime) " +
           "or (b.startTime < :endTime and b.endTime >= :endTime) " +
           "or (b.startTime >= :startTime and b.endTime <= :endTime))")
    List<Booking> findConflictingBookings(@Param("facility") Facility facility,
                                        @Param("date") LocalDate date,
                                        @Param("startTime") LocalTime startTime,
                                        @Param("endTime") LocalTime endTime);
    
    @Query("select b from Booking b where b.resident = :resident order by b.bookingDate desc, b.startTime desc")
    List<Booking> findByResidentOrderByDateDesc(@Param("resident") User resident);
    
    // Find accepted bookings for payment processing
    List<Booking> findByResidentAndStatus(User resident, BookingStatus status);
    
    // Find bookings by status for admin dashboard
    @Query("select b from Booking b where b.status = :status order by b.createdOn desc")
    List<Booking> findByStatusOrderByCreatedOnDesc(@Param("status") BookingStatus status);
    
    // Find all bookings for admin dashboard with ordering
    @Query("select b from Booking b order by b.createdOn desc")
    List<Booking> findAllOrderByCreatedOnDesc();
    
    // Find bookings with payments for accountant view
    @Query("select b from Booking b where b.payment is not null order by b.createdOn desc")
    List<Booking> findBookingsWithPayments();
}
