package com.HomeHive.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HomeHive.entities.Feedback;
import com.HomeHive.service.FeedbackService;
import com.HomeHive.service.UserService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/feedback")
@AllArgsConstructor
public class FeedbackController {
    
    private final FeedbackService feedbackService;
    private final UserService userService;
    
    @PostMapping("/post-feedback")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback request) {
        Feedback feedback = feedbackService.submitFeedback(request);
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/my-feedback")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> getMyFeedback() {
        Long residentId = userService.getCurrentUser().getId();
    	List<Feedback> feedback = feedbackService.getMyFeedbacks(residentId);
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/all-feedback")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllFeedback() {
        List<Feedback> feedback = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedback);
    }
    
    @GetMapping("/by-category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFeedbackByCategory(@PathVariable String category) {
        List<Feedback> feedback = feedbackService.getFeedbackByCategory(category);
        return ResponseEntity.ok(feedback);
    }
}
