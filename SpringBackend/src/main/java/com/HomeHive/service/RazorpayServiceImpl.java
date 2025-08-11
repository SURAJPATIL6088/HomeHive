package com.HomeHive.service;

import com.HomeHive.custom_exceptions.HomeHiveApiException;
import com.HomeHive.custom_exceptions.HomeHiveResourceNotFoundException;
import com.HomeHive.dao.BillDao;
import com.HomeHive.dao.PaymentDao;
import com.HomeHive.dao.UserDao;
import com.HomeHive.dto.PaymentOrderRequestDTO;
import com.HomeHive.dto.PaymentResponseDTO;
import com.HomeHive.dto.PaymentVerificationDTO;
import com.HomeHive.entities.Bill;
import com.HomeHive.entities.Payment;
import com.HomeHive.entities.User;
import com.HomeHive.enums.PaymentStatus;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    @Value("${app.company.name:HomeHive}")
    private String companyName;

    private final PaymentDao paymentDao;
    private final BillDao billDao;
    private final UserDao userDao;

    @Override
    public PaymentResponseDTO createOrder(PaymentOrderRequestDTO request) {
        try {
            // Initialize Razorpay client
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            // Get the current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userDao.findByEmail(auth.getName())
                    .orElseThrow(() -> new HomeHiveResourceNotFoundException("User", "email", auth.getName()));

            // Get the bill
            Bill bill = billDao.findById(request.getBillId())
                    .orElseThrow(() -> new HomeHiveResourceNotFoundException("Bill", "id", request.getBillId()));

            // Verify that the bill belongs to the current user
            if (!bill.getResident().getId().equals(currentUser.getId())) {
                throw new HomeHiveApiException("Access denied: Bill does not belong to current user");
            }

            // Check if payment already exists for this bill
            if (paymentDao.findByBillId(request.getBillId()).isPresent()) {
                throw new HomeHiveApiException("Payment already exists for this bill");
            }

            // Create order with Razorpay
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100); // amount in paise
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 10));

            Order order = razorpayClient.orders.create(orderRequest);

            // Create payment record in database
            Payment payment = new Payment();
            payment.setTransactionId(order.get("receipt"));
            payment.setAmount(BigDecimal.valueOf(request.getAmount()));
            payment.setStatus(PaymentStatus.PENDING);
            payment.setPaymentMethod("RAZORPAY");
            payment.setRazorpayOrderId(order.get("id"));
            payment.setResident(currentUser);
            payment.setBill(bill);

            paymentDao.save(payment);

            // Return payment response for frontend
            return PaymentResponseDTO.builder()
                    .orderId(order.get("id"))
                    .key(razorpayKeyId)
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .name(companyName)
                    .description(request.getDescription() != null ? request.getDescription() : "Payment for Bill #" + bill.getBillNumber())
                    .prefillName(currentUser.getFirstName() + " " + currentUser.getLastName())
                    .prefillEmail(currentUser.getEmail())
                    .prefillContact(currentUser.getPhoneNumber())
                    .theme("#007bff")
                    .callbackUrl("/api/payments/callback")
                    .build();

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw new HomeHiveApiException("Failed to create payment order: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error creating payment order", e);
            throw new HomeHiveApiException("Failed to create payment order: " + e.getMessage());
        }
    }

    @Override
    public Payment verifyPayment(PaymentVerificationDTO verificationDTO) {
        try {
            // Find payment by Razorpay order ID
            Payment payment = paymentDao.findByRazorpayOrderId(verificationDTO.getRazorpayOrderId())
                    .orElseThrow(() -> new HomeHiveResourceNotFoundException("Payment", "razorpayOrderId", verificationDTO.getRazorpayOrderId()));

            // Verify signature
            boolean isSignatureValid = verifySignature(
                    verificationDTO.getRazorpayOrderId(),
                    verificationDTO.getRazorpayPaymentId(),
                    verificationDTO.getRazorpaySignature()
            );

            if (!isSignatureValid) {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setFailureReason("Invalid payment signature");
                paymentDao.save(payment);
                throw new HomeHiveApiException("Payment verification failed: Invalid signature");
            }

            // Update payment details
            payment.setRazorpayPaymentId(verificationDTO.getRazorpayPaymentId());
            payment.setRazorpaySignature(verificationDTO.getRazorpaySignature());
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            payment.setGatewayTransactionId(verificationDTO.getRazorpayPaymentId());

            return paymentDao.save(payment);

        } catch (Exception e) {
            log.error("Error verifying payment", e);
            throw new HomeHiveApiException("Payment verification failed: " + e.getMessage());
        }
    }

    @Override
    public Payment capturePayment(String paymentId, Double amount) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject captureRequest = new JSONObject();
            captureRequest.put("amount", amount * 100); // amount in paise
            
            com.razorpay.Payment payment = razorpayClient.payments.capture(paymentId, captureRequest);
            
            // Update local payment record
            Payment localPayment = paymentDao.findByRazorpayPaymentId(paymentId)
                    .orElseThrow(() -> new HomeHiveResourceNotFoundException("Payment", "razorpayPaymentId", paymentId));
            
            localPayment.setStatus(PaymentStatus.SUCCESS);
            localPayment.setPaymentDate(LocalDateTime.now());
            
            return paymentDao.save(localPayment);
            
        } catch (RazorpayException e) {
            log.error("Error capturing payment", e);
            throw new HomeHiveApiException("Failed to capture payment: " + e.getMessage());
        }
    }

    @Override
    public String getPaymentDetails(String paymentId) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            com.razorpay.Payment payment = razorpayClient.payments.fetch(paymentId);
            return payment.toString();
        } catch (RazorpayException e) {
            log.error("Error fetching payment details", e);
            throw new HomeHiveApiException("Failed to fetch payment details: " + e.getMessage());
        }
    }

    @Override
    public String refundPayment(String paymentId, Double amount) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", amount * 100); // amount in paise
            refundRequest.put("speed", "normal");
            
            com.razorpay.Payment payment = razorpayClient.payments.fetch(paymentId);
            com.razorpay.Refund refund = payment.createRefund(refundRequest);
            
            // Update local payment record
            Payment localPayment = paymentDao.findByRazorpayPaymentId(paymentId)
                    .orElseThrow(() -> new HomeHiveResourceNotFoundException("Payment", "razorpayPaymentId", paymentId));
            
            localPayment.setStatus(PaymentStatus.REFUNDED);
            paymentDao.save(localPayment);
            
            return refund.get("id");
            
        } catch (RazorpayException e) {
            log.error("Error processing refund", e);
            throw new HomeHiveApiException("Failed to process refund: " + e.getMessage());
        }
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            String secret = razorpayKeySecret;
            
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            
            byte[] digest = mac.doFinal(payload.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            
            return sb.toString().equals(signature);
            
        } catch (Exception e) {
            log.error("Error verifying signature", e);
            return false;
        }
    }
}
