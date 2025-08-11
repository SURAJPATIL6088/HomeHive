# Payment and Booking Data Fetching Issues - Solution Guide

## Issue Analysis

### Primary Problem
**Error**: `More than one row with the given identifier was found: 13, for class: com.HomeHive.entities.Payment`

### Root Causes Identified

1. **Entity Relationship Mapping Mismatch** ⚠️
   - **Payment entity** had `@ManyToOne` relationships with Bill and Booking
   - **Bill and Booking entities** had `@OneToOne` relationships with Payment
   - This caused Hibernate to create inconsistent mappings leading to duplicate entries

2. **Missing Duplicate Prevention Logic**
   - BookingPaymentService didn't check for existing payments before creating new ones
   - Only BillPaymentService (RazorpayService) had duplicate prevention checks

3. **Cascade Operations Issues**
   - The relationship mismatch could cause cascade operations to create unintended duplicates

## Solutions Implemented

### 1. Fixed Entity Relationship Mappings ✅

**File**: `src/main/java/com/HomeHive/entities/Payment.java`

**Change**: Updated Payment entity relationships from `@ManyToOne` to `@OneToOne`

```java
// BEFORE (Incorrect)
@ManyToOne
@JoinColumn(name = "bill_id")
@JsonIgnore
private Bill bill;

@ManyToOne
@JoinColumn(name = "booking_id")
@JsonIgnore
private Booking booking;

// AFTER (Correct)
@OneToOne
@JoinColumn(name = "bill_id")
@JsonIgnore
private Bill bill;

@OneToOne
@JoinColumn(name = "booking_id")
@JsonIgnore
private Booking booking;
```

**Why this fixes the issue**:
- Ensures consistent 1:1 relationship mapping between Payment-Bill and Payment-Booking
- Prevents Hibernate from creating duplicate entries during cascade operations
- Aligns with the business logic where each Bill/Booking has exactly one Payment

### 2. Added Duplicate Payment Prevention ✅

**File**: `src/main/java/com/HomeHive/service/BookingPaymentServiceImpl.java`

**Change**: Added check for existing payment before creating new booking payment

```java
// Check if payment already exists for this booking
if (booking.getPayment() != null) {
    throw new RuntimeException("Payment already exists for this booking");
}
```

### 3. Database Cleanup Script ✅

**File**: `cleanup_duplicate_payments.sql`

Created a comprehensive SQL script to:
- Identify duplicate Payment entries with ID 13
- Backup existing data
- Remove duplicates while preserving valid records
- Reset auto-increment values
- Verify cleanup completion

## Implementation Steps

### Step 1: Apply Code Changes
The entity relationship fix and duplicate prevention logic have been implemented.

### Step 2: Database Cleanup
Execute the cleanup script to resolve existing duplicate data:

```bash
# Connect to MySQL and run the cleanup script
mysql -u root -p homeHive < cleanup_duplicate_payments.sql
```

### Step 3: Restart Application
After cleaning up the database, restart the Spring Boot application to ensure:
- New entity mappings take effect
- Hibernate recreates proper relationships
- Connection pool is refreshed

### Step 4: Verify Fix
1. Test payment creation for bills - should work without duplicates
2. Test payment creation for bookings - should work without duplicates
3. Test fetching payments data for all roles (Resident, Admin, Accountant)
4. Verify no more "More than one row" errors occur

## Prevention Measures

### 1. Consistent Entity Relationships
- Ensure all entity relationships are consistently mapped
- Use `@OneToOne` for true 1:1 relationships
- Use `@ManyToOne`/`@OneToMany` only for actual many-to-one relationships

### 2. Duplicate Prevention Checks
- Always check for existing related entities before creating new ones
- Implement validation at service layer
- Use database constraints where appropriate

### 3. Proper Transaction Management
- Use `@Transactional` appropriately
- Consider transaction isolation levels for concurrent operations
- Implement retry logic for concurrent modification scenarios

## Testing Checklist

- [ ] Bill payment creation works without errors
- [ ] Booking payment creation works without errors
- [ ] Resident can fetch their payments
- [ ] Admin can fetch all payments
- [ ] Accountant can fetch payment statistics
- [ ] No duplicate Payment entries are created
- [ ] All existing payments are accessible
- [ ] Payment status updates work correctly

## Additional Recommendations

### 1. Add Unique Constraints
Consider adding database unique constraints to prevent duplicates:

```sql
-- Prevent multiple payments for same bill
ALTER TABLE payment ADD CONSTRAINT uk_payment_bill UNIQUE (bill_id);

-- Prevent multiple payments for same booking  
ALTER TABLE payment ADD CONSTRAINT uk_payment_booking UNIQUE (booking_id);
```

### 2. Implement Better Error Handling
Replace generic `RuntimeException` with specific custom exceptions:

```java
// Instead of: throw new RuntimeException("Payment already exists for this booking");
// Use: throw new PaymentAlreadyExistsException("Payment already exists for booking ID: " + bookingId);
```

### 3. Add Logging
Enhance logging in payment services for better debugging:

```java
log.info("Creating payment for booking ID: {}", bookingId);
log.warn("Duplicate payment attempt for booking ID: {}", bookingId);
```

This comprehensive solution addresses the root cause of the duplicate Payment ID error and implements preventive measures to avoid similar issues in the future.
