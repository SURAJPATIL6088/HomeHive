package com.HomeHive.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HomeHive.custom_exceptions.HomeHiveResourceNotFoundException;
import com.HomeHive.dao.FacilityDao;
import com.HomeHive.entities.Facility;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacilityServiceImpl implements FacilityService {
    private final FacilityDao facilityDao;

    @Override
    public List<Facility> getAllAvailableFacilities() {
        return facilityDao.findByIsAvailable(true);
    }

    @Override
    public Facility getFacilityById(Long facilityId) {
        return facilityDao.findById(facilityId)
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("Facility not found with ID: " + facilityId));
    }

	@Override
	public Facility createFacility(Facility facility) {
		return facilityDao.save(facility);
	}

	@Override
	public Facility updateFacility(Long facilityId, Facility updatedFacility) {
	    Facility existing = facilityDao.findById(facilityId)
	            .orElseThrow(() -> new HomeHiveResourceNotFoundException("Facility not found with ID: " + facilityId));
	    
	    existing.setName(updatedFacility.getName());
	    existing.setType(updatedFacility.getType());
	    existing.setDescription(updatedFacility.getDescription());
	    existing.setCapacity(updatedFacility.getCapacity());
	    existing.setHourlyRate(updatedFacility.getHourlyRate());
	    existing.setOpenTime(updatedFacility.getOpenTime());
	    existing.setCloseTime(updatedFacility.getCloseTime());
	    existing.setIsAvailable(updatedFacility.getIsAvailable());

	    return facilityDao.save(existing);
	}

	@Override
	public void deleteFacility(Long facilityId) {
	    Facility facility = facilityDao.findById(facilityId)
	            .orElseThrow(() -> new HomeHiveResourceNotFoundException("Facility not found with ID: " + facilityId));
	    
	    facilityDao.delete(facility);
	}
}
