package com.HomeHive.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.HomeHive.entities.Booking;
import com.HomeHive.enums.BookingStatus;

public interface BookingService {
	
	Booking bookFacility(Long facilityId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime, String purpose);
	
	List<Booking> getMyBookings();
	
	List<Booking> getAllBookings();
	
	Booking updateBookingStatus(Long bookingId, BookingStatus status, String reason);
	
	boolean isFacilityAvailable(Long facilityId, LocalDate date, LocalTime startTime, LocalTime endTime);
	
	String generateBookingNumber();
	
	List<Booking> getBookingsByStatus(BookingStatus status);
}
