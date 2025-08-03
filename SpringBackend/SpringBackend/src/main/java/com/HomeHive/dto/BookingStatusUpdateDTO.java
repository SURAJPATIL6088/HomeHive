package com.HomeHive.dto;

import com.HomeHive.enums.BookingStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingStatusUpdateDTO {
    private BookingStatus status;
    private String reason;
}
