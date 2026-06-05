package com.HomeHive.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_error.UserError;
import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.dao.FeedbackDao;
import com.HomeHive.dao.UserDao;
import com.HomeHive.entities.Feedback;
import com.HomeHive.entities.User;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class FeedbackServiceImpl implements FeedbackService{

	private final UserDao userDao;
	private final FeedbackDao feedbackDao;

	@Override
	public Feedback submitFeedback(Feedback feedback) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		
		User resident = userDao.findByEmail(email).orElseThrow(
				()-> new HomeHiveApiException(UserError.USER_NOT_FOUND.getMsg()));
		
		feedback.setResident(resident);
		return feedbackDao.save(feedback);
	}

	@Override
	public List<Feedback> getAllFeedbacks() {
		return feedbackDao.findAll();
	}

	@Override
	public List<Feedback> getFeedbackByCategory(String category) {
		return feedbackDao.findByCategory(category);
	}

	@Override
	public List<Feedback> getMyFeedbacks(Long residentId) {
		return feedbackDao.findByResidentId(residentId);
	}

}
