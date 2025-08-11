package com.HomeHive.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.HomeHive.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true, exclude = { "resident" })
public class Payment extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String transactionId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private LocalDateTime paymentDate;

    private String paymentMethod;

    private String gatewayTransactionId;

    // Razorpay specific fields
    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private String failureReason;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resident_id", nullable = false)
    private User resident;

    @OneToOne
    @JoinColumn(name = "bill_id")
    @JsonIgnore
    private Bill bill;

    @OneToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;
}
