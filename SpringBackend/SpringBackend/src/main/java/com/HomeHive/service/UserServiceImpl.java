package com.HomeHive.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_error.UserError;
import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.dao.UserDao;
import com.HomeHive.dto.UserResponseDTO;
import com.HomeHive.dto.UserSignInDTO;
import com.HomeHive.dto.UserSignUpDTO;
import com.HomeHive.entities.User;

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

}
