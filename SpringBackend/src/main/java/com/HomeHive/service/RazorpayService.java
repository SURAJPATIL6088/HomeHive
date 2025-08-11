package com.HomeHive.service;

import com.HomeHive.dto.PaymentOrderRequestDTO;
import com.HomeHive.dto.PaymentResponseDTO;
import com.HomeHive.dto.PaymentVerificationDTO;
import com.HomeHive.entities.Payment;

public interface RazorpayService {
    
    /**
     * Create a new payment order with Razorpay
     */
    PaymentResponseDTO createOrder(PaymentOrderRequestDTO request);
    
    /**
     * Verify payment signature and update payment status
     */
    Payment verifyPayment(PaymentVerificationDTO verificationDTO);
    
    /**
     * Capture payment after successful verification
     */
    Payment capturePayment(String paymentId, Double amount);
    
    /**
     * Get payment details from Razorpay
     */
    String getPaymentDetails(String paymentId);
    
    /**
     * Refund a payment
     */
    String refundPayment(String paymentId, Double amount);
}
