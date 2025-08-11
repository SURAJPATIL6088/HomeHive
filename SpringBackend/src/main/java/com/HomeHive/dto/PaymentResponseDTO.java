package com.HomeHive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    
    private String orderId;
    private String key;
    private Double amount;
    private String currency;
    private String name;
    private String description;
    private String image;
    private String theme;
    private String prefillName;
    private String prefillEmail;
    private String prefillContact;
    private String callbackUrl;
}
