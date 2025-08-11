-- Fix for Booking Status Column Size Issue
-- This script resolves the "Data truncated for column 'status'" error

USE homeHive;

-- Check current column definition
DESCRIBE booking;

-- Fix the status column size to accommodate all enum values
-- PENDING (7), ACCEPTED (8), REJECTED (8), CONFIRMED (9), CANCELLED (9), COMPLETED (9)
ALTER TABLE booking MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Verify the change
DESCRIBE booking;

-- Optional: Check existing data
SELECT DISTINCT status FROM booking;
