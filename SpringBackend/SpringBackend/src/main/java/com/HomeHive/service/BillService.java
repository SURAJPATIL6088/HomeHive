package com.HomeHive.service;

import java.math.BigDecimal;
import java.util.List;

import com.HomeHive.entities.Bill;

public interface BillService {
	Bill generateBill(Long residentId, BigDecimal maintenanceAmount, String description);
	
	List<Bill> getResidentBills();
	
	List<Bill> getAllBills();
	
	void applyPenaltyOnOverdueBills();
	
	String generateBillNumber();
	
	Bill getBillById(Long billId);
	
	List<Bill> getOverdueBills();
}
