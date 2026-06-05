package com.HomeHive.custom_error;

import lombok.Getter;

@Getter
public enum BookingError {
	RESIDENT_ACCESS("Only residents can view their bookings"),
	NOT_FOUND("booking not found"),
	ONLY_RESIDENT_BOOKING_ACCESS("Only residents can book facilities"),
	FACILITY_NOT_FOUND("Facility not found"),
	FACILITY_NOT_AVAILABLE("Facility is not available for booking"),
	ALREADY_BOOKED("Time slot is already booked"),
	ADMIN_ACCESS("Only admins can view pending bookings");
	private final String msg;
	
	private BookingError(String msg) {
		this.msg = msg;
	}
}
