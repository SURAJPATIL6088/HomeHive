package com.HomeHive.custom_exceptions;

public class HomeHiveApiException extends RuntimeException{
	public HomeHiveApiException(String msg) {
		super(msg);
	}
}
