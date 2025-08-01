package com.HomeHive.service;

import java.util.List;

import com.HomeHive.entities.Complaint;
import com.HomeHive.entities.ComplaintStatus;

public interface ComplaintService {
	Complaint raiseComplaint(Complaint complaint);
	
	List<Complaint> getMyComplaints();
	
	List<Complaint> getAllComplaints();
	
	Complaint updateComplaintStatus(Long complaintId, ComplaintStatus status, String adminResponse);
}
