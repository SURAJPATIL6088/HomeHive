package com.HomeHive.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HomeHive.custom_error.UserError;
import com.HomeHive.dto.AuthResponse;
import com.HomeHive.dto.RoleUpdateRequestDTO;
import com.HomeHive.dto.UserSignUpDTO;
import com.HomeHive.entities.User;
import com.HomeHive.dto.UserSignInDTO;
import com.HomeHive.security.JwtUtils;
import com.HomeHive.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
	private final AuthenticationManager authenticationManager;
	private final UserService userService;
	private final JwtUtils jwtUtils;

	@PostMapping("/auth/signin")
	public ResponseEntity<?> userSignIn(@RequestBody UserSignInDTO dto) {
		// System.out.println("in sign in "+dto);

		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dto.getEmail(),
				dto.getPassword());
		Authentication successAuth = authenticationManager.authenticate(authToken);

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new AuthResponse(UserError.SUCCESS_AUTH.getMsg(), jwtUtils.generateJwtToken(successAuth)));
	}

	// register new residant
	@PostMapping("/auth/signup")
	public ResponseEntity<?> userSignUp(@RequestBody UserSignUpDTO dto) {
		// System.out.println("in sign up "+dto);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(userService.registerNewResidant(dto));
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getCurrentUser() {
		User currentUser = userService.getCurrentUser();
		return ResponseEntity.ok(currentUser);
	}

	@GetMapping("/all")
	@PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userService.getAllUsers();
		return ResponseEntity.ok(users);
	}

	@PutMapping("/{userId}/role")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> grantRole(@PathVariable Long userId, @RequestBody RoleUpdateRequestDTO role) {
		// role.setRole(role.getRole());
		User user = userService.grantRole(userId, role.getRole());
		return ResponseEntity.ok(user);
	}

	@DeleteMapping("/admin/{userId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
		userService.deactivateUser(userId);
		return ResponseEntity.ok().build();
	}
}
