package com.HomeHive.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_error.UserError;
import com.HomeHive.custom_exceptions.HomeHiveAccessDeniedException;
import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.custom_exceptions.HomeHiveResourceNotFoundException;
import com.HomeHive.dao.UserDao;
import com.HomeHive.dto.UserResponseDTO;
import com.HomeHive.dto.UserSignInDTO;
import com.HomeHive.dto.UserSignUpDTO;
import com.HomeHive.entities.User;
import com.HomeHive.enums.UserRole;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{
	private final UserDao userDao;
	private final ModelMapper modelMapper; 
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public UserResponseDTO registerNewResidant(UserSignUpDTO dto) {
		if(userDao.existsByEmail(dto.getEmail())) {
			throw new HomeHiveApiException(UserError.EMAIL_DUPLICATE.getMsg());
		}
		
		// incomming req
		User userEntity = modelMapper.map(dto, User.class);
		// encrypt pwd
		userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
		//send dto to user
		return modelMapper.map(userDao.save(userEntity), UserResponseDTO.class);
	}
	
	@Override
	public User getCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return userDao.findByEmail(auth.getName())
				.orElseThrow(()->new 
						HomeHiveResourceNotFoundException(UserError.USER_NOT_FOUND.getMsg()));
	}
	
	@Override
	public void checkAdminAccess() {
		User currentUser = getCurrentUser();
		if(!currentUser.getRole().equals(UserRole.ROLE_ADMIN)) {
			throw new HomeHiveAccessDeniedException(UserError.ADMIN_ACCESS_ONLY.getMsg());
		}
	}
	
	@Override
	public List<User> getAllUsers(){
		checkAdminAccess();
		return userDao.findByIsActiveTrue();
	}
	
	@Override
	public User grantRole(Long userId, UserRole role) {
		checkAdminAccess();
		User user = userDao.findById(userId)
				.orElseThrow(()-> new HomeHiveResourceNotFoundException(UserError.USER_NOT_FOUND.getMsg()));
		
		user.setRole(role);
		return userDao.save(user);
	}
	
	@Override
	public void deactivateUser(Long userId) {
		checkAdminAccess();
		User user = userDao.findById(userId)
				.orElseThrow(()-> new HomeHiveResourceNotFoundException(UserError.USER_NOT_FOUND.getMsg()));
		
		user.setIsActive(false);
		userDao.save(user);
	}
}
