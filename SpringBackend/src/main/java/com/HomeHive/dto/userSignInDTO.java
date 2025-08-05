package com.HomeHive.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserSignInDTO {
	@NotBlank(message = "Email name is required")
	private String email;
	
	@NotBlank(message = "Password is required")
	private String password;
}
