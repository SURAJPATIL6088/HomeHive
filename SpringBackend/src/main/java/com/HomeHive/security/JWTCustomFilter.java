package com.HomeHive.security;

import java.io.IOException;

import org.hibernate.annotations.Comment;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;


@Component
@AllArgsConstructor
public class JWTCustomFilter extends OncePerRequestFilter{
	//verify JWT
	//depcy - JwtUtils
	private final JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(HttpServletRequest request, 
			HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		//1. Check for authorization req header
		String headerValue=request.getHeader("Authorization");
		//2. checking for not null n extract JWT
		if(headerValue != null && headerValue.startsWith("Bearer ")) {
			//3. => jwt - present , extract JWT
			String jwt=headerValue.substring(7);
			//4. verify the token using JWT utils class
			Authentication authentication = jwtUtils.populateAuthenticationTokenFromJWT(jwt);
			System.out.println("auth obj in filter "+authentication);
			//5. store this authentication object in spring sec ctx holder
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		//to continue with remaining filter chain sequence
		filterChain.doFilter(request, response);
		
	}

}
