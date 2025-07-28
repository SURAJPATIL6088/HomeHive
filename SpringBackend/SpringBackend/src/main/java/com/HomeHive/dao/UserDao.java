package com.HomeHive.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HomeHive.entities.User;

public interface UserDao extends JpaRepository<User, Long>{
	// get details by email
	Optional<User> findByEmail(String email);
	
	// check exist or not
	Boolean existsByEmail(String email);
	
	// find user by email and pwd
	Optional<User> findByEmailAndPassword(String email, String password);

	List<User>findByIsActiveTrue();
}
