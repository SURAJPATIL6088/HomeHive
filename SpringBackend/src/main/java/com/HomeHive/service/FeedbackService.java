package com.HomeHive.service;

import java.util.List;
import com.HomeHive.entities.Feedback;

public interface FeedbackService {
	Feedback submitFeedback(Feedback feedback);
	
	List<Feedback> getAllFeedbacks();
	
	List<Feedback> getFeedbackByCategory(String category);
	
	List<Feedback> getMyFeedbacks(Long residentId);
}
