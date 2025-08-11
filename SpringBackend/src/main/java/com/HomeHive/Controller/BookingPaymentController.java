package com.HomeHive.Controller;

import com.HomeHive.entities.Payment;
import com.HomeHive.service.BookingPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking-payments")
@RequiredArgsConstructor
public class BookingPaymentController {

    private final BookingPaymentService bookingPaymentService;

    @PostMapping("/create-order/{bookingId}")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> createBookingPaymentOrder(@PathVariable Long bookingId) {
        try {
            Payment payment = bookingPaymentService.createBookingPaymentOrder(bookingId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating payment order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> verifyBookingPayment(
            @RequestParam Long paymentId,
            @RequestParam String razorpay_order_id,
            @RequestParam String razorpay_payment_id,
            @RequestParam String razorpay_signature) {
        
        try {
            Payment payment = bookingPaymentService.verifyAndProcessBookingPayment(
                    paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
            
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment verification failed: " + e.getMessage());
        }
    }

    @PostMapping("/failure")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> handleBookingPaymentFailure(
            @RequestParam Long paymentId,
            @RequestParam String reason) {
        
        try {
            Payment payment = bookingPaymentService.handleBookingPaymentFailure(paymentId, reason);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error handling payment failure: " + e.getMessage());
        }
    }
}
