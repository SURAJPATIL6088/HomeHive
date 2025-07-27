package com.HomeHive.custom_error;

import lombok.Getter;

@Getter
public enum UserError {
	EMAIL_DUPLICATE("Duplicate Email Found!!"),
	EMAIL_INVALID("Invalid email..."),
	SUCCESS_AUTH("Successful User Login..");
	
	private final String msg;
	
	UserError(String msg){
		this.msg = msg;
	}
	
	/*public String getMsg() {
		return msg;
	}*/
}
