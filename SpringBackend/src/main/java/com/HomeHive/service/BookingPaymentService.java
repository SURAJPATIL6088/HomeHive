package com.HomeHive.service;

import com.HomeHive.entities.Booking;
import com.HomeHive.entities.Payment;

/**
 * Service interface for handling facility booking payments
 */
public interface BookingPaymentService {
    
    /**
     * Create a Razorpay order for facility booking payment
     * @param bookingId The booking ID to create payment for
     * @return Payment entity with Razorpay order details
     */
    Payment createBookingPaymentOrder(Long bookingId);
    
    /**
     * Verify and process booking payment
     * @param paymentId The payment ID
     * @param razorpayOrderId Razorpay order ID
     * @param razorpayPaymentId Razorpay payment ID
     * @param razorpaySignature Razorpay signature for verification
     * @return Updated payment entity
     */
    Payment verifyAndProcessBookingPayment(Long paymentId, String razorpayOrderId, 
                                          String razorpayPaymentId, String razorpaySignature);
    
    /**
     * Update booking status to CONFIRMED after successful payment
     * @param booking The booking to confirm
     * @return Updated booking entity
     */
    Booking confirmBookingAfterPayment(Booking booking);
    
    /**
     * Handle payment failure for booking
     * @param paymentId The failed payment ID
     * @param failureReason Reason for payment failure
     * @return Updated payment entity
     */
    Payment handleBookingPaymentFailure(Long paymentId, String failureReason);
}
