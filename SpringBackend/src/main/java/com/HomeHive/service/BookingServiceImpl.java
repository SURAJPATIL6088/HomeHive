package com.HomeHive.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_error.BookingError;
import com.HomeHive.custom_exceptions.HomeHiveAccessDeniedException;
import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.custom_exceptions.HomeHiveResourceNotFoundException;
import com.HomeHive.dao.BookingDao;
import com.HomeHive.dao.FacilityDao;
import com.HomeHive.entities.Booking;
import com.HomeHive.entities.Facility;
import com.HomeHive.entities.User;
import com.HomeHive.enums.BookingStatus;
import com.HomeHive.enums.UserRole;
import com.HomeHive.utils.BookingEmailNotification;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class BookingServiceImpl implements BookingService{

    private final BookingDao bookingDao;
    private final FacilityDao facilityDao;
    private final UserService userService;
    private final JavaMailSender javaMailSender;
    private final BookingEmailNotification bookingEmailNotification;
	
	@Override
	public Booking bookFacility(Long facilityId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime,
			String purpose) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ROLE_RESIDENT) {
            throw new HomeHiveAccessDeniedException(BookingError.ONLY_RESIDENT_BOOKING_ACCESS.getMsg());
        }
        
        Facility facility = facilityDao.findById(facilityId)
                .orElseThrow(() -> new HomeHiveResourceNotFoundException(BookingError.FACILITY_NOT_FOUND.getMsg()));
        
        if (!facility.getIsAvailable()) {
            throw new HomeHiveApiException(BookingError.FACILITY_NOT_AVAILABLE.getMsg());
        }
        
        List<Booking> conflictingBookings = bookingDao.findConflictingBookings(
                facility, bookingDate, startTime, endTime);
        
        if (!conflictingBookings.isEmpty()) {
            throw new HomeHiveApiException(BookingError.ALREADY_BOOKED.getMsg());
        }
        
        Duration duration = Duration.between(startTime, endTime);
        long hours = duration.toHours();
        if (duration.toMinutesPart() > 0) {
            hours++;
        }
        
        BigDecimal totalAmount = facility.getHourlyRate().multiply(BigDecimal.valueOf(hours));
        
        Booking booking = Booking.builder()
                .bookingNumber(generateBookingNumber())
                .bookingDate(bookingDate)
                .startTime(startTime)
                .endTime(endTime)
                .status(BookingStatus.PENDING)
                .totalAmount(totalAmount)
                .purpose(purpose)
                .facility(facility)
                .resident(currentUser)
                .build();
        
        Booking savedBooking = bookingDao.save(booking);
        
        // Notify admin of new booking request
        notifyAdminOfNewBooking(savedBooking);
        
        return savedBooking;
	}

	@Override
	public List<Booking> getMyBookings() {
		User currentUser = userService.getCurrentUser();
		
		if(currentUser.getRole() != UserRole.ROLE_RESIDENT) {
			throw new HomeHiveAccessDeniedException(BookingError.RESIDENT_ACCESS.getMsg());
		}
		
		return bookingDao.findByResidentOrderByDateDesc(currentUser);
	}

	@Override
	public List<Booking> getAllBookings() {
		userService.checkAdminAccess();
		return bookingDao.findAll();
	}

	@Override
	public Booking updateBookingStatus(Long bookingId, BookingStatus status, String reason) {
		userService.checkAdminAccess();
        
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new HomeHiveResourceNotFoundException(BookingError.NOT_FOUND.getMsg()));
        
        booking.setStatus(status);
        if (status == BookingStatus.CANCELLED && reason != null) {
            booking.setCancellationReason(reason);
        }
        
        Booking updatedBooking = bookingDao.save(booking);
        
        String body = "Your booking for " + booking.getFacility().getName() + 
                        " on " + booking.getBookingDate() + " has been " + status.toString().toLowerCase();

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        String subject = "Facility Status Updated";
        
        mailMessage.setTo(booking.getResident().getEmail());
        mailMessage.setSubject(subject);      
        mailMessage.setText(body);      
        javaMailSender.send(mailMessage);
        
        return updatedBooking;
	}

	@Override
	public boolean isFacilityAvailable(Long facilityId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        Facility facility = facilityDao.findById(facilityId)
                .orElseThrow(() -> new HomeHiveResourceNotFoundException(BookingError.FACILITY_NOT_FOUND.getMsg()));
        
        if (!facility.getIsAvailable()) {
            return false;
        }
        
        List<Booking> conflictingBookings = bookingDao.findConflictingBookings(
                facility, date, startTime, endTime);
        
        return conflictingBookings.isEmpty();
	}

	@Override
	public String generateBookingNumber() {
        return "BK-" + LocalDate.now().getYear() + "-" + 
                String.format("%06d", System.currentTimeMillis() % 1000000);
	}

	@Override
	public List<Booking> getBookingsByStatus(BookingStatus status) {
	    User currentUser = userService.getCurrentUser();
	    if (!currentUser.getRole().equals(UserRole.ROLE_ADMIN)) {
	        throw new HomeHiveAccessDeniedException(BookingError.ADMIN_ACCESS.getMsg());
	    }
	    return bookingDao.findByStatus(status);
	}
	
	// New workflow methods implementation
	@Override
	public List<Booking> getAllBookingsForAdmin() {
		userService.checkAdminAccess();
		return bookingDao.findAllOrderByCreatedOnDesc();
	}
	
	@Override
	public List<Booking> getPendingBookingsForAdmin() {
		userService.checkAdminAccess();
		return bookingDao.findByStatusOrderByCreatedOnDesc(BookingStatus.PENDING);
	}
	
	@Override
	public List<Booking> getAcceptedBookingsForResident() {
		User currentUser = userService.getCurrentUser();
		if (currentUser.getRole() != UserRole.ROLE_RESIDENT) {
			throw new HomeHiveAccessDeniedException(BookingError.RESIDENT_ACCESS.getMsg());
		}
		return bookingDao.findByResidentAndStatus(currentUser, BookingStatus.ACCEPTED);
	}
	
	@Override
	public List<Booking> getBookingsWithPaymentsForAccountant() {
		User currentUser = userService.getCurrentUser();
		if (!currentUser.getRole().equals(UserRole.ROLE_ACCOUNTANT)) {
			throw new HomeHiveAccessDeniedException("Only accountants can view payment transactions");
		}
		return bookingDao.findBookingsWithPayments();
	}
	
	@Override
	public Booking acceptBookingRequest(Long bookingId, String adminComments) {
		userService.checkAdminAccess();
		
		Booking booking = bookingDao.findById(bookingId)
			.orElseThrow(() -> new HomeHiveResourceNotFoundException(BookingError.NOT_FOUND.getMsg()));
		
		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new HomeHiveApiException("Only pending bookings can be accepted");
		}
		
		booking.setStatus(BookingStatus.ACCEPTED);
		Booking updatedBooking = bookingDao.save(booking);
		
		// Send email notification to resident
		notifyResidentOfStatusUpdate(updatedBooking, adminComments);
		
		return updatedBooking;
	}
	
	@Override
	public Booking rejectBookingRequest(Long bookingId, String rejectionReason) {
		userService.checkAdminAccess();
		
		Booking booking = bookingDao.findById(bookingId)
			.orElseThrow(() -> new HomeHiveResourceNotFoundException(BookingError.NOT_FOUND.getMsg()));
		
		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new HomeHiveApiException("Only pending bookings can be rejected");
		}
		
		booking.setStatus(BookingStatus.REJECTED);
		booking.setCancellationReason(rejectionReason);
		Booking updatedBooking = bookingDao.save(booking);
		
		// Send email notification to resident
		notifyResidentOfStatusUpdate(updatedBooking, rejectionReason);
		
		return updatedBooking;
	}
	
	@Override
	public void notifyAdminOfNewBooking(Booking booking) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			
			String subject = "New Facility Booking Request - " + booking.getBookingNumber();
			String body = String.format(
				"Dear Admin,\n\n" +
				"A new facility booking request has been submitted:\n\n" +
				"Booking Details:\n" +
				"- Booking Number: %s\n" +
				"- Resident: %s (%s)\n" +
				"- Facility: %s\n" +
				"- Date: %s\n" +
				"- Time: %s - %s\n" +
				"- Purpose: %s\n" +
				"- Total Amount: ₹%s\n\n" +
				"Please review and update the booking status in the admin dashboard.\n\n" +
				"Best regards,\n" +
				"HomeHive Management System",
				booking.getBookingNumber(),
				booking.getResident().getFirstName() + " " + booking.getResident().getLastName(),
				booking.getResident().getEmail(),
				booking.getFacility().getName(),
				booking.getBookingDate(),
				booking.getStartTime(),
				booking.getEndTime(),
				booking.getPurpose(),
				booking.getTotalAmount()
			);
			
			message.setFrom("noreply@homehive.com");
			message.setTo("admin@homehive.com"); // This should be configurable
			message.setSubject(subject);
			message.setText(body);
			
			javaMailSender.send(message);
		} catch (Exception e) {
			// Log error but don't fail the booking process
			System.err.println("Failed to send admin notification email: " + e.getMessage());
		}
	}
	
	@Override
	public void notifyResidentOfStatusUpdate(Booking booking, String adminComments) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			
			String statusText = booking.getStatus() == BookingStatus.ACCEPTED ? "ACCEPTED" : "REJECTED";
			String subject = "Facility Booking " + statusText +" - " + booking.getBookingNumber();
			
			String body;
			if (booking.getStatus() == BookingStatus.ACCEPTED) {
				body = String.format(
					"Dear %s,\n\n" +
					"Great news! Your facility booking request has been ACCEPTED.\n\n" +
					"Booking Details:\n" +
					"- Booking Number: %s\n" +
					"- Facility: %s\n" +
					"- Date: %s\n" +
					"- Time: %s - %s\n" +
					"- Total Amount: ₹%s\n\n" +
					"Next Steps: You can now proceed to make the payment through the resident portal.\n\n" +
					"%s\n\n" +
					"Best regards,\n" +
					"HomeHive Management",
					booking.getResident().getFirstName(),
					booking.getBookingNumber(),
					booking.getFacility().getName(),
					booking.getBookingDate(),
					booking.getStartTime(),
					booking.getEndTime(),
					booking.getTotalAmount(),
					adminComments != null ? "Admin Comments: " + adminComments : ""
				);
			} else {
				body = String.format(
					"Dear %s,\n\n" +
					"We regret to inform you that your facility booking request has been REJECTED.\n\n" +
					"Booking Details:\n" +
					"- Booking Number: %s\n" +
					"- Facility: %s\n" +
					"- Date: %s\n" +
					"- Time: %s - %s\n\n" +
					"Reason: %s\n\n" +
					"You can submit a new booking request if needed.\n\n" +
					"Best regards,\n" +
					"HomeHive Management",
					booking.getResident().getFirstName(),
					booking.getBookingNumber(),
					booking.getFacility().getName(),
					booking.getBookingDate(),
					booking.getStartTime(),
					booking.getEndTime(),
					adminComments != null ? adminComments : "No specific reason provided"
				);
			}
			
			message.setFrom("noreply@homehive.com");
			message.setTo(booking.getResident().getEmail());
			message.setSubject(subject);
			message.setText(body);
			
			javaMailSender.send(message);
		} catch (Exception e) {
			// Log error but don't fail the process
			System.err.println("Failed to send resident notification email: " + e.getMessage());
		}
	}
}
