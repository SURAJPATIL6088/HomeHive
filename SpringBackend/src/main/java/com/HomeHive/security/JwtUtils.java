package com.HomeHive.security;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.HomeHive.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component //to declare spring bean
@Slf4j
public class JwtUtils {
//inject the props in JWT Utils class for creating n validation of JWT
	/*
	 * @Value => injection of a value (<constr-arg name n value : xml tags) arg - Spring
	 * expression Lang - SpEL
	 */
	@Value("${SECRET_KEY}") 
	private String jwtSecret;

	@Value("${EXP_TIMEOUT}")
	private int jwtExpirationMs;

	private SecretKey key;

	@PostConstruct
	public void init() {
		log.info("Key {} Exp Time {}",jwtSecret,jwtExpirationMs);
		//create secret key instance form its builder - Keys
		key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
	}

	// authentication
	public String generateJwtToken(Authentication authentication) {
		log.info("generate jwt token " + authentication);
		User userPrincipal = (User) authentication.getPrincipal();
		return Jwts.builder() 
				.subject((userPrincipal.getUsername())) // setting subject part of the token
				.issuedAt(new Date())// Sets the JWT Claims iat (issued at) value of current date
				.expiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.claim("authorities", 
						getAuthoritiesInString(userPrincipal.getAuthorities()))

				.signWith(key, Jwts.SIG.HS256) 
				.compact();
	}

	// this method will be invoked by our custom JWT filter
	public String getUserNameFromJwtToken(Claims claims) {
		return claims.getSubject();
	}

	// this method will be invoked by our custom JWT filter
	public Claims validateJwtToken(String jwtToken) {
		Claims claims = Jwts.parser()

				.verifyWith(key)
				.build()
				.parseSignedClaims(jwtToken) 
				.getPayload();

		return claims;
	}

	private List<String> getAuthoritiesInString(Collection<? extends GrantedAuthority> authorities) {
		return authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
	}

	// authorities n store it in auth token
	public List<GrantedAuthority> getAuthoritiesFromClaims(Claims claims) {

		List<String> authorityNamesFromJwt = (List<String>) claims.get("authorities");
		List<GrantedAuthority> authorities = authorityNamesFromJwt.stream().map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());

		authorities.forEach(System.out::println);
		return authorities;
	}

	
	public Authentication populateAuthenticationTokenFromJWT(String jwt) {

		Claims payloadClaims = validateJwtToken(jwt);

		String email = getUserNameFromJwtToken(payloadClaims);
		List<GrantedAuthority> authorities = getAuthoritiesFromClaims(payloadClaims);
			// add user name/email , null:password granted authorities in Authentication object
		UsernamePasswordAuthenticationToken token = 
				new UsernamePasswordAuthenticationToken(email, null, authorities);

		System.out.println("is authenticated " + token.isAuthenticated());// true
		return token;

	}

}
