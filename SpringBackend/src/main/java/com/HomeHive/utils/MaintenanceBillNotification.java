package com.HomeHive.utils;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Component;

import com.HomeHive.entities.User;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class MaintenanceBillNotification {

    public String buildBillEmail(User resident, String billNumber, LocalDate billDate, LocalDate dueDate,
                                 BigDecimal maintenanceAmount, BigDecimal penaltyAmount, BigDecimal totalAmount,
                                 String description) {
        return "Dear " + resident.getFirstName() + " " + resident.getLastName() + ",\n\n"
                + "A new maintenance bill has been generated for your flat.\n\n"
                + "Bill Number: " + billNumber + "\n"
                + "Bill Date: " + billDate + "\n"
                + "Due Date: " + dueDate + "\n"
                + "Maintenance Amount: ₹" + maintenanceAmount + "\n"
                + "Penalty Amount: ₹" + penaltyAmount + "\n"
                + "Total Amount: ₹" + totalAmount + "\n"
                + "Description: " + description + "\n\n"
                + "Please make the payment before the due date to avoid penalties.\n\n"
                + "Regards,\nHomeHive Accounts Team";
    }
}
