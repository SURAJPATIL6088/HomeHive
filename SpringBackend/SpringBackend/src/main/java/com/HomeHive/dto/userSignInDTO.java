package com.HomeHive.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class userSignInDTO {
	@NotBlank
	private String email;
	
	@NotBlank
	private String password;
}
