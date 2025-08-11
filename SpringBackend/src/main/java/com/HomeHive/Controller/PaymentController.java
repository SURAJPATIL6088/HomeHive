package com.HomeHive.Controller;

import com.HomeHive.dto.PaymentOrderRequestDTO;
import com.HomeHive.dto.PaymentResponseDTO;
import com.HomeHive.dto.PaymentStatsDTO;
import com.HomeHive.dto.PaymentVerificationDTO;
import com.HomeHive.entities.Payment;
import com.HomeHive.enums.PaymentStatus;
import com.HomeHive.service.PaymentService;
import com.HomeHive.service.RazorpayService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment Management", description = "APIs for managing payments and transactions")
public class PaymentController {

    private final PaymentService paymentService;
    private final RazorpayService razorpayService;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Create payment order", description = "Creates a new payment order with Razorpay for bill payment")
    public ResponseEntity<PaymentResponseDTO> createPaymentOrder(@Valid @RequestBody PaymentOrderRequestDTO request) {
        log.info("Creating payment order for bill ID: {}", request.getBillId());
        PaymentResponseDTO response = razorpayService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Verify payment", description = "Verifies payment signature and updates payment status")
    public ResponseEntity<Map<String, Object>> verifyPayment(@Valid @RequestBody PaymentVerificationDTO verificationDTO) {
        log.info("Verifying payment for order ID: {}", verificationDTO.getRazorpayOrderId());
        
        try {
            Payment payment = razorpayService.verifyPayment(verificationDTO);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment verified successfully",
                "payment", payment
            ));
        } catch (Exception e) {
            log.error("Payment verification failed", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Payment verification failed: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/my-payments")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Get resident payments", description = "Retrieves all payments for the current resident")
    public ResponseEntity<List<Payment>> getMyPayments() {
        List<Payment> payments = paymentService.getResidentPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/my-payments/status/{status}")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Get resident payments by status", description = "Retrieves payments filtered by status for current resident")
    public ResponseEntity<List<Payment>> getMyPaymentsByStatus(@PathVariable PaymentStatus status) {
        List<Payment> payments = paymentService.getResidentPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Get payment details", description = "Retrieves payment details by ID")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/bill/{billId}")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Get payment by bill", description = "Retrieves payment details for a specific bill")
    public ResponseEntity<Payment> getPaymentByBillId(@PathVariable Long billId) {
        try {
            Payment payment = paymentService.getPaymentByBillId(billId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Get all payments", description = "Retrieves all payments (admin/accountant only)")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Get payments by status", description = "Retrieves payments filtered by status (admin/accountant only)")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Get payment statistics", description = "Retrieves payment statistics (admin/accountant only)")
    public ResponseEntity<PaymentStatsDTO> getPaymentStats() {
        PaymentStatsDTO stats = paymentService.getPaymentStats();
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{paymentId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Update payment status", description = "Updates payment status (admin/accountant only)")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam PaymentStatus status,
            @RequestParam(required = false) String reason) {
        
        Payment updatedPayment = paymentService.updatePaymentStatus(paymentId, status, reason);
        return ResponseEntity.ok(updatedPayment);
    }

    @PostMapping("/capture/{paymentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Capture payment", description = "Captures a payment manually (admin/accountant only)")
    public ResponseEntity<Payment> capturePayment(
            @PathVariable String paymentId,
            @RequestParam Double amount) {
        
        Payment capturedPayment = razorpayService.capturePayment(paymentId, amount);
        return ResponseEntity.ok(capturedPayment);
    }

    @PostMapping("/refund/{paymentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Refund payment", description = "Processes a refund for a payment (admin/accountant only)")
    public ResponseEntity<Map<String, Object>> refundPayment(
            @PathVariable String paymentId,
            @RequestParam Double amount) {
        
        try {
            String refundId = razorpayService.refundPayment(paymentId, amount);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Refund processed successfully",
                "refundId", refundId
            ));
        } catch (Exception e) {
            log.error("Refund processing failed", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Refund processing failed: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/razorpay/details/{paymentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ACCOUNTANT')")
    @Operation(summary = "Get Razorpay payment details", description = "Retrieves payment details from Razorpay (admin/accountant only)")
    public ResponseEntity<String> getRazorpayPaymentDetails(@PathVariable String paymentId) {
        String paymentDetails = razorpayService.getPaymentDetails(paymentId);
        return ResponseEntity.ok(paymentDetails);
    }

    // Webhook endpoint for Razorpay notifications (if needed)
    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook", description = "Endpoint for receiving Razorpay webhook notifications")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload) {
        log.info("Received Razorpay webhook: {}", payload);
        // Handle webhook logic here if needed
        return ResponseEntity.ok("OK");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        log.error("Payment controller error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
            "success", false,
            "message", "An error occurred: " + e.getMessage()
        ));
    }
}
