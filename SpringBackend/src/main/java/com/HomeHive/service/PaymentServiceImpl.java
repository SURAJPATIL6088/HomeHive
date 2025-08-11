package com.HomeHive.service;

import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.custom_exceptions.HomeHiveResourceNotFoundException;
import com.HomeHive.dao.PaymentDao;
import com.HomeHive.dao.UserDao;
import com.HomeHive.dto.PaymentStatsDTO;
import com.HomeHive.entities.Payment;
import com.HomeHive.entities.User;
import com.HomeHive.enums.PaymentStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentDao paymentDao;
    private final UserDao userDao;

    @Override
    public List<Payment> getResidentPayments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDao.findByEmail(auth.getName())
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));
        
        return paymentDao.findByResident(currentUser);
    }

    @Override
    public List<Payment> getPaymentsByResident(User resident) {
        return paymentDao.findByResident(resident);
    }

    @Override
    public List<Payment> getResidentPaymentsByStatus(PaymentStatus status) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDao.findByEmail(auth.getName())
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));
        
        return paymentDao.findByResidentAndStatus(currentUser, status);
    }

    @Override
    public Payment getPaymentById(Long id) {
        Payment payment = paymentDao.findById(id)
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("Payment", "id", id));
        
        // Check if current user has access to this payment
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDao.findByEmail(auth.getName())
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));
        
        // Allow access if it's the resident's payment or if user is admin/accountant
        if (!payment.getResident().getId().equals(currentUser.getId()) && 
            !hasAdminOrAccountantRole(currentUser)) {
            throw new HomeHiveApiException("Access denied: You don't have permission to view this payment");
        }
        
        return payment;
    }

    @Override
    public Payment getPaymentByBillId(Long billId) {
        return paymentDao.findByBillId(billId)
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("Payment", "billId", billId));
    }

    @Override
    public List<Payment> getAllPayments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDao.findByEmail(auth.getName())
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));
        
        if (!hasAdminOrAccountantRole(currentUser)) {
            throw new HomeHiveApiException("Access denied: Admin or Accountant role required");
        }
        
        return paymentDao.findAll();
    }

    @Override
    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDao.findByEmail(auth.getName())
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));
        
        if (!hasAdminOrAccountantRole(currentUser)) {
            throw new HomeHiveApiException("Access denied: Admin or Accountant role required");
        }
        
        return paymentDao.findAll().stream()
                .filter(payment -> payment.getStatus().equals(status))
                .toList();
    }

    @Override
    public PaymentStatsDTO getPaymentStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDao.findByEmail(auth.getName())
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));
        
        if (!hasAdminOrAccountantRole(currentUser)) {
            throw new HomeHiveApiException("Access denied: Admin or Accountant role required");
        }
        
        long totalPayments = paymentDao.count();
        long successfulPayments = paymentDao.countByStatus(PaymentStatus.SUCCESS);
        long pendingPayments = paymentDao.countByStatus(PaymentStatus.PENDING);
        long failedPayments = paymentDao.countByStatus(PaymentStatus.FAILED);
        
        return new PaymentStatsDTO(totalPayments, successfulPayments, pendingPayments, failedPayments);
    }

    @Override
    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status, String reason) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userDao.findByEmail(auth.getName())
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));
        
        if (!hasAdminOrAccountantRole(currentUser)) {
            throw new HomeHiveApiException("Access denied: Admin or Accountant role required");
        }
        
        Payment payment = paymentDao.findById(paymentId)
                .orElseThrow(() -> new HomeHiveResourceNotFoundException("Payment", "id", paymentId));
        
        payment.setStatus(status);
        if (reason != null && !reason.trim().isEmpty()) {
            payment.setFailureReason(reason);
        }
        
        // Update payment date if status is changing to SUCCESS
        if (status == PaymentStatus.SUCCESS && payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        return paymentDao.save(payment);
    }

    private boolean hasAdminOrAccountantRole(User user) {
        return user.getRole().toString().equals("ADMIN") || user.getRole().toString().equals("ACCOUNTANT");
    }
}
