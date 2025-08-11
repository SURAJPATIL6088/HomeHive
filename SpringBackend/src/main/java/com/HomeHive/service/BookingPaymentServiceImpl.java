package com.HomeHive.service;

import com.HomeHive.dao.BookingDao;
import com.HomeHive.dao.PaymentDao;
import com.HomeHive.entities.Booking;
import com.HomeHive.entities.Payment;
import com.HomeHive.enums.BookingStatus;
import com.HomeHive.enums.PaymentStatus;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class BookingPaymentServiceImpl implements BookingPaymentService {

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    private final BookingDao bookingDao;
    private final PaymentDao paymentDao;

    public BookingPaymentServiceImpl(BookingDao bookingDao, PaymentDao paymentDao) {
        this.bookingDao = bookingDao;
        this.paymentDao = paymentDao;
    }

    @Override
    public Payment createBookingPaymentOrder(Long bookingId) {
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Booking must be accepted before payment");
        }
        
        // Check if payment already exists for this booking
        if (booking.getPayment() != null) {
            throw new RuntimeException("Payment already exists for this booking");
        }

        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", booking.getTotalAmount().multiply(new BigDecimal(100))); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_rcpt_" + booking.getId());

            Order order = razorpayClient.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setAmount(booking.getTotalAmount());
            payment.setStatus(PaymentStatus.PENDING);
            payment.setTransactionId(UUID.randomUUID().toString());
            payment.setPaymentMethod("Razorpay");
            payment.setResident(booking.getResident());
            payment.setBooking(booking);
            payment.setRazorpayOrderId(order.get("id"));

            return paymentDao.save(payment);

        } catch (RazorpayException e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @Override
    public Payment verifyAndProcessBookingPayment(Long paymentId, String razorpayOrderId,
                                                  String razorpayPaymentId, String razorpaySignature) {
        Payment payment = paymentDao.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        boolean isValid = verifySignature(razorpayOrderId + "|" + razorpayPaymentId, razorpaySignature);

        if (isValid) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(razorpaySignature);

            // Confirm booking after successful payment
            confirmBookingAfterPayment(payment.getBooking());

        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Signature validation failed");
        }

        return paymentDao.save(payment);
    }

    @Override
    public Booking confirmBookingAfterPayment(Booking booking) {
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingDao.save(booking);
    }

    @Override
    public Payment handleBookingPaymentFailure(Long paymentId, String failureReason) {
        Payment payment = paymentDao.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(failureReason);

        return paymentDao.save(payment);
    }

    private boolean verifySignature(String data, String signature) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString().equals(signature);

        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error verifying signature: " + e.getMessage());
        }
    }
}
