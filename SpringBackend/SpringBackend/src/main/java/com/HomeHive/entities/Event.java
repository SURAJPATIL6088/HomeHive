package com.HomeHive.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Event extends BaseEntity{
	@Column(nullable = false)
	private String title;
	
	@Column(nullable = false, length = 150)
	private String content;
	
	@Column(nullable = false)
	private LocalDateTime eventDate;
	
	private String venue;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by", nullable = false)
	private User createdBy;
}
