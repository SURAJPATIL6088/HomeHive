package com.HomeHive.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HomeHive.entities.Feedback;

@Repository
public interface FeedbackDao extends JpaRepository<Feedback, Long>{
    List<Feedback> findByResidentId(Long residentId);
    List<Feedback> findByCategory(String category);
}
