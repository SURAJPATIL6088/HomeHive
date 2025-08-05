package com.HomeHive.dao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HomeHive.entities.Notice;
import com.HomeHive.entities.User;

@Repository
public interface NoticeDao extends JpaRepository<Notice, Long>{
	
	List<Notice>findByCreatedBy(User createdBy);
	
	// only active notice
	@Query("Select n From Notice n Where n.isActive = true AND n.validUntil > :currentTime")
	List<Notice>findByActiveNotices(@Param("currentTime") LocalDateTime currentTime);
	
	// get all the notice
	@Query("Select n From Notice n")
	List<Notice>findAllNotices();
}
