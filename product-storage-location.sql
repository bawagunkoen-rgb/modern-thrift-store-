-- Add an optional owner-only inventory location without rewriting existing products.
ALTER TABLE products ADD COLUMN IF NOT EXISTS storage_location_code text;
