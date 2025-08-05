package com.HomeHive.entities;

import com.HomeHive.enums.ComplaintStatus;
import com.HomeHive.enums.ComplaintType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Complaint extends BaseEntity{
	@Column(nullable = false)
	private String title;
	
	@Column(nullable = false)
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ComplaintType type;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ComplaintStatus status = ComplaintStatus.OPEN;

	private String adminResponse;	

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "resident_id")
	private User resident; 
}
