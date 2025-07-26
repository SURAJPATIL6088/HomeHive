package com.HomeHive.service;

import com.HomeHive.dto.UserResponseDTO;
import com.HomeHive.dto.userSignInDTO;
import com.HomeHive.dto.userSignUpDTO;

public interface UserService {
	UserResponseDTO registerNewResidant(userSignUpDTO dto);
}
