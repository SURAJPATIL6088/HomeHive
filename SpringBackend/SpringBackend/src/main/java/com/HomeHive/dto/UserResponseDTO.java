package com.HomeHive.dto;

import com.HomeHive.entities.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
	@JsonProperty(access = Access.READ_ONLY)
	private Long id;
	private String firstName;
	
	private String lastName;

	private String email;
	
	private String flatNo;
	
	private UserRole role;
}
