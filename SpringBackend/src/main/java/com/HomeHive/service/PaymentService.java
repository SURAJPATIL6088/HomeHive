package com.HomeHive.service;

import com.HomeHive.dto.PaymentStatsDTO;
import com.HomeHive.entities.Payment;
import com.HomeHive.entities.User;
import com.HomeHive.enums.PaymentStatus;

import java.util.List;

public interface PaymentService {
    
    /**
     * Get all payments for the current resident
     */
    List<Payment> getResidentPayments();
    
    /**
     * Get all payments for a specific resident
     */
    List<Payment> getPaymentsByResident(User resident);
    
    /**
     * Get payments by status for current resident
     */
    List<Payment> getResidentPaymentsByStatus(PaymentStatus status);
    
    /**
     * Get payment by ID
     */
    Payment getPaymentById(Long id);
    
    /**
     * Get payment by bill ID
     */
    Payment getPaymentByBillId(Long billId);
    
    /**
     * Get all payments (admin/accountant only)
     */
    List<Payment> getAllPayments();
    
    /**
     * Get payments by status (admin/accountant only)
     */
    List<Payment> getPaymentsByStatus(PaymentStatus status);
    
    /**
     * Get payment statistics
     */
    PaymentStatsDTO getPaymentStats();
    
    /**
     * Update payment status
     */
    Payment updatePaymentStatus(Long paymentId, PaymentStatus status, String reason);
}
