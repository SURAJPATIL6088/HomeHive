package com.HomeHive.custom_exceptions;

public class HomeHiveResourceNotFoundException extends RuntimeException{
	public HomeHiveResourceNotFoundException(String msg) {
		super(msg);
	}
}
