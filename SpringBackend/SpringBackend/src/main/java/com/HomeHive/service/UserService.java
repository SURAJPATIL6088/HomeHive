package com.HomeHive.service;

import java.util.List;

import com.HomeHive.dto.UserResponseDTO;
import com.HomeHive.dto.UserSignInDTO;
import com.HomeHive.dto.UserSignUpDTO;
import com.HomeHive.entities.User;
import com.HomeHive.entities.UserRole;

public interface UserService {
	UserResponseDTO registerNewResidant(UserSignUpDTO dto);

	User getCurrentUser();
	
	void checkAdminAccess();
	
	List<User>getAllUsers();
	
	User grantRole(Long userId, UserRole role);
	
	void deactivateUser(Long userId);
}
