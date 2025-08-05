package com.HomeHive.service;

import java.util.List;
import java.util.Optional;

import com.HomeHive.dto.UserResponseDTO;
import com.HomeHive.dto.UserSignUpDTO;
import com.HomeHive.entities.User;
import com.HomeHive.enums.UserRole;

public interface UserService {
	UserResponseDTO registerNewResidant(UserSignUpDTO dto);

	User getCurrentUser();
	
	void checkAdminAccess();
	
	void checkAccountantAndAdminAccess();
	
	List<User>getAllUsers();
	
	User grantRole(Long userId, UserRole role);
	
	void deactivateUser(Long userId);
	
	Optional<User> findById(Long userId);
}
