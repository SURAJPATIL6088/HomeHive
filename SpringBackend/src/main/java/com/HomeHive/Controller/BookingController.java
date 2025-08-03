package com.HomeHive.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HomeHive.dto.AvailabilityRequestDTO;
import com.HomeHive.dto.BookingCreateRequestDTO;
import com.HomeHive.dto.BookingStatusUpdateDTO;
import com.HomeHive.entities.Booking;
import com.HomeHive.entities.Facility;
import com.HomeHive.enums.BookingStatus;
import com.HomeHive.service.BookingService;
import com.HomeHive.service.FacilityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/add-booking")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> bookFacility(@Valid @RequestBody BookingCreateRequestDTO request) {
        Booking booking = bookingService.bookFacility(
                request.getFacilityId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getPurpose()
        );
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> getMyBookings() {
        List<Booking> bookings = bookingService.getMyBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PostMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(@Valid @RequestBody AvailabilityRequestDTO request) {
        boolean isAvailable = bookingService.isFacilityAvailable(
                request.getFacilityId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
        );
        return ResponseEntity.ok(isAvailable);
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long bookingId,
            @RequestBody BookingStatusUpdateDTO request) {
        
        Booking booking = bookingService.updateBookingStatus(bookingId, request.getStatus(), request.getReason());
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingBookings() {
        List<Booking> bookings = bookingService.getBookingsByStatus(BookingStatus.PENDING);
        return ResponseEntity.ok(bookings);
    }
}
