package com.HomeHive.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import com.HomeHive.enums.BookingStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true, exclude = {"resident", "facility"})
public class Booking extends BaseEntity{
    @Column(unique = true, nullable = false)
    private String bookingNumber;
    
    @Column(nullable = false)
    private LocalDate bookingDate;
    
    @Column(nullable = false)
    private LocalTime startTime;
    
    @Column(nullable = false)
    private LocalTime endTime;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(nullable = false)
    private BigDecimal totalAmount;
    
    private String purpose;
    
    private String cancellationReason;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resident_id", nullable = false)
    private User resident;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;
}
