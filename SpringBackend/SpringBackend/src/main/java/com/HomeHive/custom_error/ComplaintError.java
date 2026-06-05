package com.HomeHive.custom_error;

import lombok.Getter;

@Getter
public enum ComplaintError {
	RESIDENT_ACCESS("Only residents can view their complaints"),
	NOT_FOUND("Complaint not found");
	
	private final String msg;
	
	private ComplaintError(String msg) {
		this.msg = msg;
	}
}
