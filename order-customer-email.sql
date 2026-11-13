-- Additive: existing orders remain unchanged; customer email is optional.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email text;
