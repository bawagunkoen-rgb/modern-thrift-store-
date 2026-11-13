-- Add an optional sleeve measurement without rewriting existing product records.
ALTER TABLE products ADD COLUMN IF NOT EXISTS sleeve_inches numeric(6,2);
