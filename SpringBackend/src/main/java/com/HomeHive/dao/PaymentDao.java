package com.HomeHive.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.HomeHive.entities.Payment;
import com.HomeHive.entities.User;
import com.HomeHive.enums.PaymentStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentDao extends JpaRepository<Payment, Long> {
    
    List<Payment> findByResident(User resident);
    
    List<Payment> findByResidentAndStatus(User resident, PaymentStatus status);
    
    Optional<Payment> findByBillId(Long billId);
    
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    @Query("SELECT p FROM Payment p WHERE p.resident.id = :residentId AND p.status = :status")
    List<Payment> findByResidentIdAndStatus(@Param("residentId") Long residentId, @Param("status") PaymentStatus status);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") PaymentStatus status);
}
