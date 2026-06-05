package com.HomeHive.custom_exceptions;

public class HomeHiveAccessDeniedException extends RuntimeException{
	public HomeHiveAccessDeniedException(String msg) {
		super(msg);
	}
}
