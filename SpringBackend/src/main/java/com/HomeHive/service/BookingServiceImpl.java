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
        
        SimpleMailMessage message = new SimpleMailMessage();
        String body = bookingEmailNotification.buildBookingEmail(currentUser, facility, bookingDate, startTime, endTime, totalAmount, purpose);
        String subject = "New Facility Booking Request";
        
        // System.out.println("mobile : "+currentUser.getMobileNo());
        ///System.out.println("email : "+currentUser.getEmail());
        //System.out.println("username : "+currentUser.getUsername());
        message.setFrom(currentUser.getEmail());
        message.setTo("suraj97394878@gmail.com");
        message.setSubject(subject);      
        message.setText(body);      
        javaMailSender.send(message);
        
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
}
