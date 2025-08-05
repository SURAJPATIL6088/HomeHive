package com.HomeHive.utils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.stereotype.Component;

import com.HomeHive.entities.Facility;
import com.HomeHive.entities.User;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class BookingEmailNotification {
	public String buildBookingEmail(User user, Facility facility, LocalDate bookingDate,
	            LocalTime startTime, LocalTime endTime, BigDecimal totalAmount, String purpose) {
		return "Hello Admin,\n\n"
		+ "A new facility booking has been made by: " + user.getFirstName() + " " + user.getLastName() + "\n"
		+ "Facility: " + facility.getName() + "\n"
		+ "Date: " + bookingDate + "\n"
		+ "Time: " + startTime + " to " + endTime + "\n"
		+ "Total Amount: ₹" + totalAmount + "\n"
		+ "Purpose: " + purpose + "\n\n"
		+ "Please review and confirm the booking.\n\n"
		+ "Regards,\nHomeHive System";	
	}
}

