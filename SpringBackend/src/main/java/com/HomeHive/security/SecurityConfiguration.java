package com.HomeHive.security;


import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.AllArgsConstructor;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class SecurityConfiguration {

    private final PasswordEncoder encoder;
    private final JWTCustomFilter jwtCustomFilter;

    @Bean
    SecurityFilterChain configureSecFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults()) 
            .csrf(csrf -> csrf.disable()) 
            .formLogin(form -> form.disable())
            .authorizeHttpRequests(request -> request
                .requestMatchers(
                    "/v*/api-docs/**", 
<<<<<<< HEAD:SpringBackend/src/main/java/com/HomeHive/security/SecurityConfiguration.java
                    "/auth/signup", 
                    "/auth/signin"
                ).permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/acc/**").hasRole("ACCOUNTANT")
=======
                    "/users/auth/**",
                    "/users/profile",
                    "/notices/getActive",
                    "/facilities/all-facilities"
                ).permitAll()
                .requestMatchers("/users/all/**", "/users/*/role", "/users/admin/**").hasRole("ADMIN")
                .requestMatchers("/notices/post-notice", "/notices/remove/**", "/notices/getAll").hasRole("ADMIN")
                .requestMatchers("/complaints/all-complaints", "/complaints/*/status").hasRole("ADMIN")
                .requestMatchers("/complaints/raise-complaint", "/complaints/my-complaints").hasRole("RESIDENT")
<<<<<<< HEAD:SpringBackend/src/main/java/com/HomeHive/security/SecurityConfiguration.java
>>>>>>> ef46388662d9cda486d97bbeb5ca17527fa1fb88:SpringBackend/SpringBackend/src/main/java/com/HomeHive/security/SecurityConfiguration.java
=======
                .requestMatchers("/feedback/all-feedback", "/feedback/by-category/**").hasRole("ADMIN")
                .requestMatchers("/feedback/my-feedback", "/feedback/post-feedback").hasRole("RESIDENT")
                .requestMatchers("/bookings/all", "/bookings/*/status", "/bookings/pending").hasRole("ADMIN")
                .requestMatchers("/bookings/add-booking", "/bookings/my-bookings").hasRole("RESIDENT")
                .requestMatchers("/facilities/add-facilities", "/facilities/**").hasRole("ADMIN")
>>>>>>> suraj:SpringBackend/SpringBackend/src/main/java/com/HomeHive/security/SecurityConfiguration.java
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtCustomFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); 
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*")); 
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

