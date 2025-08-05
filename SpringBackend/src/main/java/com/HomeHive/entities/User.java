package com.HomeHive.entities;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.HomeHive.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User extends BaseEntity implements UserDetails
{
	@Column(name="First Name", length=35)
	private String firstName;
	
	@Column(name="Last Name", length=35)
	private String lastName;
	
	@Column(unique = true)
	private String email;
	
	private int flatNo;
	
	@Column(name="Mobile Number", length=10)
	private String mobileNo;
	
	@Column(nullable = false)
	private String password;
	
	@Enumerated(EnumType.STRING)
	private UserRole role = UserRole.ROLE_RESIDENT;
	
    /*@OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Flat> flats = new ArrayList<>();*/
	
	/*@OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Notice> notices = new ArrayList<> ();
	*/
	
	@JsonIgnore
    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();
    
	@JsonIgnore
	@OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Complaint> complaints = new ArrayList<> ();
	
	@OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Event> events = new ArrayList<> ();
	
	@JsonIgnore
	@OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Feedback> feedbacks;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(this.role.name()));
	}

	@Override
	public String getUsername() {
		return email;
	}
}
