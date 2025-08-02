package com.HomeHive.dto;

import com.HomeHive.enums.UserRole;

public class RoleUpdateRequestDTO {
	private UserRole role;
	
    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
