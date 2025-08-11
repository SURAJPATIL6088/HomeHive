-- Fix payment table to allow null bill_id for booking payments
-- This allows payments to be created for bookings without requiring a bill

USE homeHive;

-- Make bill_id nullable in the payment table
ALTER TABLE payment MODIFY COLUMN bill_id BIGINT NULL;

-- Verify the change
DESCRIBE payment;
