package com.HomeHive.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingActionRequestDTO {
    
    private String adminComments;
    
    @NotBlank(message = "Reason is required for rejection")
    private String rejectionReason;
}
