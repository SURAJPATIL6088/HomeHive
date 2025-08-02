package com.HomeHive.service;

import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_error.ComplaintError;
import com.HomeHive.custom_exceptions.HomeHiveAccessDeniedException;
import com.HomeHive.custom_exceptions.HomeHiveResourceNotFoundException;
import com.HomeHive.dao.ComplaintDao;
import com.HomeHive.entities.Complaint;
import com.HomeHive.entities.User;
import com.HomeHive.enums.ComplaintStatus;
import com.HomeHive.enums.UserRole;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ComplaintServiceImpl implements ComplaintService{
	private final UserService userService;
	private final ComplaintDao complaintDao;
	private final JavaMailSender javaMailSender;
	
	@Override
	public Complaint raiseComplaint(Complaint complaint) {
		User currentRole = userService.getCurrentUser();
		if(currentRole.getRole() != UserRole.ROLE_RESIDENT) {
			throw new HomeHiveAccessDeniedException(ComplaintError.RESIDENT_ACCESS.getMsg());
		}
		
		complaint.getResident().setEmail(currentRole.getEmail());
		Complaint savedComplaint = complaintDao.save(complaint);
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		
		// mailMessage.setFrom(savedComplaint.getResident().getEmail());
		mailMessage.setTo("suraj97394878@gmail.com");
		mailMessage.setSubject("⚠️ New Complaint : "+complaint.getTitle()+" ⚠️");
		mailMessage.setText(complaint.getDescription());
		
		javaMailSender.send(mailMessage); 
		
		return savedComplaint;
	}
	
	@Override
	public List<Complaint> getMyComplaints() {
		User currentRole = userService.getCurrentUser();
		if(currentRole.getRole() != UserRole.ROLE_RESIDENT) {
			throw new HomeHiveAccessDeniedException(ComplaintError.RESIDENT_ACCESS.getMsg());
		}
		
		return complaintDao.findByResident(currentRole);
	}
	
	@Override
	public List<Complaint> getAllComplaints() {
		userService.checkAdminAccess();
		return complaintDao.findAll();
	}
	
	@Override
	public Complaint updateComplaintStatus(Long complaintId, ComplaintStatus status, String adminResponse) {
		
		userService.checkAdminAccess();
		
		Complaint complaint = complaintDao.findById(complaintId)
				.orElseThrow(
						()-> new HomeHiveResourceNotFoundException(ComplaintError.NOT_FOUND.getMsg()));
		
		complaint.setStatus(status);
		if(adminResponse != null) {
			complaint.setAdminResponse(adminResponse);
		}
		
		Complaint updatedComplaint = complaintDao.save(complaint);
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		
		mailMessage.setTo(complaint.getResident().getEmail());
		mailMessage.setSubject("Complaint Status Updated");
		mailMessage.setText("Your complaint #" + complaintId + " status has been updated to " + status);
		
		javaMailSender.send(mailMessage); 
		return updatedComplaint;
	}
	
	
}
