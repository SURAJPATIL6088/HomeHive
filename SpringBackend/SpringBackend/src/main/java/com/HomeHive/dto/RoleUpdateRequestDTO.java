package com.HomeHive.dto;

import com.HomeHive.entities.UserRole;

import lombok.Getter;
import lombok.Setter;

public class RoleUpdateRequestDTO {
	private UserRole role;
	
    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
