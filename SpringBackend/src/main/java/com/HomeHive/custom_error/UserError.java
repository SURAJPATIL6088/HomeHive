package com.HomeHive.custom_error;

import lombok.Getter;

@Getter
public enum UserError {
	EMAIL_DUPLICATE("Duplicate email found!!"),
	EMAIL_INVALID("Invalid email..."),
	SUCCESS_AUTH("Successful user Login.."),
	USER_NOT_FOUND("User not found"),
	ADMIN_ACCESS_ONLY("Admin access required");
	
	private final String msg;
	
	UserError(String msg){
		this.msg = msg;
	}
	
	/*public String getMsg() {
		return msg;
	}*/
}
