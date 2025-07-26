package com.HomeHive.Controller;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HomeHive.dto.AuthResponse;
import com.HomeHive.dto.userSignUpDTO;
import com.HomeHive.dto.userSignInDTO;
import com.HomeHive.security.JwtUtils;
import com.HomeHive.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class UserController {
	private final AuthenticationManager authenticationManager;
	private final UserService userService;
	private final JwtUtils jwtUtils;
	
	@PostMapping("/sign-in")
	public ResponseEntity<?>userSignIn(@RequestBody @Valid userSignInDTO dto){
		System.out.println("in sign in "+dto);
		
		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
		Authentication successAuth = authenticationManager.authenticate(authToken);
		
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new AuthResponse("Successful User Login..", jwtUtils.generateJwtToken(successAuth)));
	}
	
	// register new residant
	@PostMapping("/sign-up")
	public ResponseEntity<?>userSignUp(@RequestBody @Valid userSignUpDTO dto){
		System.out.println("in sign up "+dto);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(userService.registerNewResidant(dto));
	}
}
