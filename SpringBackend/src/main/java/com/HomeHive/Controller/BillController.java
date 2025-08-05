package com.HomeHive.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.HomeHive.dto.BillCreateRequestDTO;
import com.HomeHive.entities.Bill;
import com.HomeHive.service.BillService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
public class BillController {
    
    private final BillService billService;
    
    @GetMapping("/my-bills")
    @PreAuthorize("hasRole('RESIDENT')")
    public ResponseEntity<?> getMyBills() {
        List<Bill> bills = billService.getResidentBills();
        return ResponseEntity.ok(bills);
    }
    
    @GetMapping("/{billId}")
    public ResponseEntity<?> getBillById(@PathVariable Long billId) {
        Bill bill = billService.getBillById(billId);
        return ResponseEntity.ok(bill);
    }
    
    @PostMapping("/generate")
    @PreAuthorize("hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<?> generateBill(@Valid @RequestBody BillCreateRequestDTO request) {
        Bill bill = billService.generateBill(
                request.getResidentId(),
                request.getMaintenanceAmount(),
                request.getDescription()
        );
        return ResponseEntity.ok(bill);
    }
    
    @GetMapping("/all-bills")
    @PreAuthorize("hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllBills() {
        List<Bill> bills = billService.getAllBills();
        return ResponseEntity.ok(bills);
    }
    
    @PostMapping("/apply-penalties")
    @PreAuthorize("hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<?> applyPenaltyOnOverdueBills() {
        billService.applyPenaltyOnOverdueBills();
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ACCOUNTANT') or hasRole('ADMIN')")
    public ResponseEntity<?> getOverdueBills() {
        List<Bill> bills = billService.getOverdueBills();
        return ResponseEntity.ok(bills);
    }
}