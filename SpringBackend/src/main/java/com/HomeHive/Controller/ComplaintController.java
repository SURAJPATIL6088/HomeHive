package com.HomeHive.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HomeHive.entities.Complaint;
import com.HomeHive.service.ComplaintService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/complaints")
public class ComplaintController {
	private final ComplaintService complaintService;
	
	@PostMapping("/raise-complaint")
	@PreAuthorize("hasRole('RESIDENT')")
	public ResponseEntity<?> raiseComplaint(@RequestBody @Valid Complaint request){
		Complaint complaint = complaintService.raiseComplaint(request);
		return ResponseEntity.ok(complaint);
	}
	
	@GetMapping("/my-complaints")
	@PreAuthorize("hasRole('RESIDENT')")
	public ResponseEntity<?> getMyComplaints(){
		List<Complaint>complaints = complaintService.getMyComplaints();
		return ResponseEntity.ok(complaints);
	}
	
	@GetMapping("/all-complaints")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllComplaints(){
		List<Complaint>complaints = complaintService.getAllComplaints();
		return ResponseEntity.ok(complaints);
	}
	
    @PutMapping("/{complaintId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable Long complaintId,
                                                          @Valid @RequestBody Complaint request) {
        Complaint complaint = complaintService.updateComplaintStatus(
                complaintId, 
                request.getStatus(), 
                request.getAdminResponse()
        );
        return ResponseEntity.ok(complaint);
    }
}
