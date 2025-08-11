package com.HomeHive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for payment statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatsDTO {
    
    private long totalPayments;
    private long successfulPayments;
    private long pendingPayments;
    private long failedPayments;
    private double totalAmount;
    private double successfulAmount;
    private double pendingAmount;
    
    // Constructor for basic stats without amounts
    public PaymentStatsDTO(long totalPayments, long successfulPayments, long pendingPayments, long failedPayments) {
        this.totalPayments = totalPayments;
        this.successfulPayments = successfulPayments;
        this.pendingPayments = pendingPayments;
        this.failedPayments = failedPayments;
        this.totalAmount = 0.0;
        this.successfulAmount = 0.0;
        this.pendingAmount = 0.0;
    }
}
