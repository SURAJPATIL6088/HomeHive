package com.HomeHive.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HomeHive.entities.Facility;
import com.HomeHive.enums.FacilityType;

@Repository
public interface FacilityDao extends JpaRepository<Facility, Long>{
	List<Facility> findByType(FacilityType type);
	
	List<Facility> findByIsAvailableTrue();
	
	List<Facility> findByTypeAndIsAvailableTrue(FacilityType type);
	
	List<Facility> findByIsAvailable(boolean isAvailable);
}
