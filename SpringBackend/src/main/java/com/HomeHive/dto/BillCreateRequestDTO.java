package com.HomeHive.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Getter
@Setter
public class BillCreateRequestDTO {
    
    @NotNull(message = "Resident ID is required")
    private Long residentId;
    
    @NotNull(message = "Maintenance amount is required")
    @DecimalMin(value = "0.0", message = "Maintenance amount must be positive")
    private BigDecimal maintenanceAmount;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}