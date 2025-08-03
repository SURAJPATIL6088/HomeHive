package com.HomeHive.service;

import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_error.NoticeError;
import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.dto.CreateNoticeDTO;
import com.HomeHive.entities.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NotificationService {

	private final JavaMailSender javaMailSender;


	public void sendNotifications(List<User>users, CreateNoticeDTO notice) {
		for(User user : users) {
			// System.out.println("Loop User Details : "+user.getEmail()+", "+notice.getTitle()+", "+notice.getContent());
			sendEmail(user.getEmail(), notice.getTitle(), notice.getContent());
		}
	}
	
	private void sendEmail(String to, String title, String content) {
		try {
			// System.out.println("User Details : "+to+", "+title+", "+content);
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(to);
			message.setSubject(title);
			message.setText(content);
			javaMailSender.send(message);
			
		} catch (Exception e) {
			throw new HomeHiveApiException(NoticeError.NOTIFICATION_ERROR.getMsg());
		}
	}
}
