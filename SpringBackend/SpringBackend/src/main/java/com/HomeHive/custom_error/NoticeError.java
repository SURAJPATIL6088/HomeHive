package com.HomeHive.custom_error;

import lombok.Getter;

@Getter
public enum NoticeError {
	NOTICE_NOT_FOUND("Notice not found!!"),
	DELETE_NOTICE("Notice deleted Successfully"),
	CREATE_NOTICE("New Notice Added");
	
	private final String msg;
	
	private NoticeError(String msg) {
		this.msg = msg;
	}
}
