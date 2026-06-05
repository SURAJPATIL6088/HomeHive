package com.HomeHive.service;

import java.util.List;

import com.HomeHive.entities.Facility;

public interface FacilityService{
    List<Facility> getAllAvailableFacilities();
    
    Facility getFacilityById(Long facilityId);

    Facility createFacility(Facility facility);

    Facility updateFacility(Long facilityId, Facility updatedFacility);

    void deleteFacility(Long facilityId);
}
