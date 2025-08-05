package com.HomeHive.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HomeHive.entities.Complaint;
import com.HomeHive.entities.User;
import com.HomeHive.enums.ComplaintStatus;
import com.HomeHive.enums.ComplaintType;

@Repository
public interface ComplaintDao extends JpaRepository<Complaint, Long>{
	List<Complaint>findByStatus(ComplaintStatus status);
	
	List<Complaint> findByType(ComplaintType type);
	
	@Query("Select c from Complaint c where c.resident = :resident")
	List<Complaint>findByResident(@Param("resident") User resident);
}
