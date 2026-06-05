package com.HomeHive.entities;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.HomeHive.enums.FacilityType;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(callSuper = true, exclude = {"bookings"})
public class Facility extends BaseEntity{
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityType type;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    private BigDecimal hourlyRate;
    
    @Column(nullable = false)
    private LocalTime openTime;
    
    @Column(nullable = false)
    private LocalTime closeTime;
    
    private Boolean isAvailable = true;
    
    @OneToMany(mappedBy = "facility", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();
}
