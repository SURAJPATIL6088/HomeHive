package com.HomeHive.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.HomeHive.custom_exceptions.HomeHiveAccessDeniedException;
import com.HomeHive.custom_exceptions.HomeHiveResourceNotFoundException;
import com.HomeHive.dao.BillDao;
import com.HomeHive.entities.Bill;
import com.HomeHive.entities.User;
import com.HomeHive.enums.UserRole;
import com.HomeHive.utils.MaintenanceBillNotification;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class BillServiceImpl implements BillService{
	
    private final BillDao billDao;
    private final UserService userService;
    private final JavaMailSender javaMailSender;
    private final MaintenanceBillNotification maintenanceBillNotification;
    
	@Override
	public Bill generateBill(Long residentId, BigDecimal maintenanceAmount, String description) {
        userService.checkAccountantAndAdminAccess();
        
        User resident = userService.findById(residentId)
        		.orElseThrow(() -> new HomeHiveResourceNotFoundException("Resident not found"));

        if (resident.getRole() != UserRole.ROLE_RESIDENT) {
            throw new IllegalStateException("Bill can only be generated for a resident");
        }
        
        User currentUser = userService.getCurrentUser();
        
        Bill bill = Bill.builder()
                .billNumber(generateBillNumber())
                .billDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(30))
                .maintenanceAmount(maintenanceAmount)
                .penaltyAmount(BigDecimal.ZERO)
                .description(description)
                .resident(resident)
                .generatedBy(currentUser)
                .build();

        bill.setTotalAmount(bill.getMaintenanceAmount().add(bill.getPenaltyAmount()));

        Bill savedBill = billDao.save(bill);
        
        SimpleMailMessage message = new SimpleMailMessage();
        
        String body = maintenanceBillNotification.buildBillEmail(resident, bill.getBillNumber(), bill.getBillDate(), bill.getDueDate(),bill.getMaintenanceAmount(), bill.getPenaltyAmount(), bill.getTotalAmount(), bill.getDescription());
        String subject = "New Facility Booking Request";
        
        // System.out.println("mobile : "+currentUser.getMobileNo());
        ///System.out.println("email : "+currentUser.getEmail());
        //System.out.println("username : "+currentUser.getUsername());
        message.setTo(resident.getEmail());
        message.setSubject("Maintenance Bill Generated - " + bill.getBillNumber());      
        message.setText(body);      
        
        javaMailSender.send(message);

        return savedBill;
	}

	@Override
	public List<Bill> getResidentBills() {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ROLE_RESIDENT) {
            throw new HomeHiveAccessDeniedException("Only residents can view their bills");
        }
        return billDao.findByResident(currentUser);
	}

	@Override
	public List<Bill> getAllBills() {
		userService.checkAccountantAndAdminAccess();
        return billDao.findAll();
	}

	@Override
	public void applyPenaltyOnOverdueBills() {
        userService.checkAccountantAndAdminAccess();
        
        List<Bill> overdueBills = billDao.findOverdueBills(LocalDate.now());
        
        for (Bill bill : overdueBills) {
            BigDecimal penaltyAmount = bill.getTotalAmount().multiply(new BigDecimal("0.10"));
            bill.setPenaltyAmount(penaltyAmount);
            bill.setTotalAmount(bill.getTotalAmount().add(penaltyAmount));
            billDao.save(bill);
        }
	}

	@Override
	public String generateBillNumber() {
        return "BILL-" + LocalDate.now().getYear() + "-" + 
                String.format("%06d", System.currentTimeMillis() % 1000000);
	}

    @Override
    public Bill getBillById(Long billId) {
        return billDao.findById(billId)
            .orElseThrow(() -> new HomeHiveResourceNotFoundException("Bill not found with ID: " + billId));
    }

    @Override
    public List<Bill> getOverdueBills() {
        LocalDate today = LocalDate.now();
        return billDao.findByDueDateBefore(today);
    }

}
