package com.HomeHive.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill extends BaseEntity {
    
    @Column(unique = true, nullable = false)
    private String billNumber;
    
    @Column(nullable = false)
    private LocalDate billDate;
    
    @Column(nullable = false)
    private LocalDate dueDate;
    
    @Column(nullable = false)
    private BigDecimal maintenanceAmount;
    
    private BigDecimal penaltyAmount = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private BigDecimal totalAmount;
    
    private String description;
    
    /*@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flat_id", nullable = false)
    private Flat flat;*/
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private User resident;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "generated_by", nullable = false)
    private User generatedBy; // Accountant
    
    @OneToOne(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;
}