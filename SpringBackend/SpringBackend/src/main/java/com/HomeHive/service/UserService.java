package com.HomeHive.service;

import com.HomeHive.dto.UserResponseDTO;
import com.HomeHive.dto.UserSignInDTO;
import com.HomeHive.dto.UserSignUpDTO;

public interface UserService {
	UserResponseDTO registerNewResidant(UserSignUpDTO dto);
}
