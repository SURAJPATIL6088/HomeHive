package com.HomeHive.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HomeHive.entities.Facility;
import com.HomeHive.service.FacilityService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/facilities")
@AllArgsConstructor
public class FacilityController {
	private final FacilityService facilityService;
	
	@PostMapping("/add-facilities")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Facility> addFacility(@Valid @RequestBody Facility facility) {
	    Facility savedFacility = facilityService.createFacility(facility);
	    return ResponseEntity.ok(savedFacility);
	}

	@PutMapping("/{facilityId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Facility> updateFacility(@PathVariable Long facilityId, @RequestBody Facility updatedFacility) {
	    Facility facility = facilityService.updateFacility(facilityId, updatedFacility);
	    return ResponseEntity.ok(facility);
	}

	@DeleteMapping("/{facilityId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<String> deleteFacility(@PathVariable Long facilityId) {
	    facilityService.deleteFacility(facilityId);
	    return ResponseEntity.ok("Facility deleted successfully.");
	}
	
    @GetMapping("/all-facilities")
    public ResponseEntity<?> getAllFacilities() {
        List<Facility> facilities = facilityService.getAllAvailableFacilities();
        return ResponseEntity.ok(facilities);
    }
    
    @GetMapping("/{facilityId}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long facilityId) {
        Facility facility = facilityService.getFacilityById(facilityId);
        return ResponseEntity.ok(facility);
    }

}
