package com.HomeHive.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HomeHive.entities.Bill;
import com.HomeHive.entities.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillDao extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBillNumber(String billNumber);
    List<Bill> findByGeneratedBy(User accountant);
    
    @Query("SELECT b FROM Bill b WHERE b.resident = :resident ORDER BY b.billDate DESC")
    List<Bill> findByResident(@Param("resident") User resident);
    
    @Query("SELECT b FROM Bill b WHERE b.dueDate < :currentDate AND b.id NOT IN " +
           "(SELECT p.bill.id FROM Payment p WHERE p.status = 'PAID')")
    List<Bill> findOverdueBills(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT b FROM Bill b WHERE b.billDate BETWEEN :startDate AND :endDate")
    List<Bill> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Bill> findByDueDateBefore(LocalDate date);
}