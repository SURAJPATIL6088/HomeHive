package com.HomeHive.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.HomeHive.dao.UserDao;
import com.HomeHive.entities.User;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class CustomUserDetailsServiceImpl implements UserDetailsService {
	//depcy  - user dao
	private final UserDao userDao;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user=userDao.findByEmail(email)
				.orElseThrow(() -> 
				new UsernameNotFoundException("Invalid email ....."));
		//=> partial auth - email exists
		return user;
	}

}
