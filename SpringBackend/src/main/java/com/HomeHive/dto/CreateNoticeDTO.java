package com.HomeHive.dto;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNoticeDTO {
	@NotBlank(message = "Title is required")
	private String title;
	
	@NotBlank(message = "Description is required")	
	private String content;
	
	@NotNull(message = "Must have Expiration Date")
	private LocalDateTime validUntil;
	
	@CreatedDate
	@Column(updatable = false)
	private LocalDateTime createdAt = LocalDateTime.now();
	
	@Column(nullable = false)
	private Boolean isActive = true;
}
