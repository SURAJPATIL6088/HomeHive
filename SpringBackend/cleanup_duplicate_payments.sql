-- Cleanup script for duplicate Payment entries
-- This script will help identify and remove duplicate payments with same ID

-- Step 1: Check for duplicate payments with ID 13
SELECT * FROM homeHive.payment WHERE id = 13;

-- Step 2: If duplicates exist, backup the data first
CREATE TEMPORARY TABLE payment_backup_13 AS 
SELECT * FROM homeHive.payment WHERE id = 13;

-- Step 3: Check for related booking and bill dependencies
SELECT p.id, p.transaction_id, p.amount, p.status, b.id as booking_id, bill.id as bill_id 
FROM homeHive.payment p 
LEFT JOIN homeHive.booking b ON p.booking_id = b.id 
LEFT JOIN homeHive.bill bill ON p.bill_id = bill.id 
WHERE p.id = 13;

-- Step 4: Remove duplicate entries (keep only one record)
-- First, identify which record to keep (usually the one with most complete data)
DELETE FROM homeHive.payment 
WHERE id = 13 
AND transaction_id NOT IN (
    SELECT transaction_id FROM (
        SELECT transaction_id 
        FROM homeHive.payment 
        WHERE id = 13 
        ORDER BY created_on DESC 
        LIMIT 1
    ) AS keep_record
);

-- Step 5: Update auto-increment to prevent future conflicts
ALTER TABLE homeHive.payment AUTO_INCREMENT = (
    SELECT MAX(id) + 1 FROM homeHive.payment
);

-- Step 6: Verify cleanup
SELECT COUNT(*) as payment_count_13 FROM homeHive.payment WHERE id = 13;
SELECT MAX(id) as max_payment_id FROM homeHive.payment;
