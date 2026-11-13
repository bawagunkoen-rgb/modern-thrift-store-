-- Additive and idempotent: never truncate or replace existing product/order records.
BEGIN;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS collection text NOT NULL DEFAULT 'Summer Collection';
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS chest_inches numeric(6,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS length_inches numeric(6,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS flash_drop_ends_at timestamp;
ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at timestamp;
UPDATE products SET stock_quantity = 0 WHERE in_stock = false AND stock_quantity > 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cod';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal numeric(10,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee numeric(10,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_reserved boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_unique ON orders(idempotency_key);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_idempotency_key_unique') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_idempotency_key_unique UNIQUE USING INDEX orders_idempotency_key_unique;
  END IF;
END $$;
CREATE TABLE IF NOT EXISTS banners (
  id serial PRIMARY KEY, title text NOT NULL, subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL, link_url text NOT NULL DEFAULT '/collection',
  active boolean NOT NULL DEFAULT true, position integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY, whatsapp_number text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '', tiktok_url text NOT NULL DEFAULT '',
  bank_instructions text NOT NULL DEFAULT '', shipping_fee integer NOT NULL DEFAULT 250
);
CREATE TABLE IF NOT EXISTS subscribers (
  id serial PRIMARY KEY, email text NOT NULL UNIQUE, created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id serial PRIMARY KEY, token text NOT NULL UNIQUE, customer_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL, city text NOT NULL DEFAULT '', customer_address text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]', recovered boolean NOT NULL DEFAULT false,
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_catalog_idx ON products(deleted_at, category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS abandoned_carts_recent_idx ON abandoned_carts(recovered, updated_at DESC);
INSERT INTO store_settings(id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO categories(name, icon, image_url, collection)
SELECT 'Winter Collection', 'winter', '/images/categories/winter.jpg', 'Winter Collection'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Winter Collection');
INSERT INTO categories(name, icon, image_url, collection)
SELECT 'Accessories & Streetwear', 'accessories', '/images/categories/sneakers.jpg', 'Accessories & Streetwear'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories & Streetwear');
UPDATE categories SET collection = 'Accessories & Streetwear' WHERE icon = 'sneakers' AND collection = 'Summer Collection';
INSERT INTO banners(title, subtitle, image_url, link_url, position)
SELECT 'WINTER FINDS. MODERN PRICES.', 'Authentic pre-loved pieces. A new season, a second story.',
 '/images/categories/winter.jpg', '/collection?collection=Winter%20Collection', 0
WHERE NOT EXISTS (SELECT 1 FROM banners);
INSERT INTO banners(title, subtitle, image_url, link_url, position)
SELECT 'THE WEEKLY DROP', 'Discover the latest arrivals before they are gone.',
 '/images/categories/golf.jpg', '/collection?sort=newest', 1
WHERE NOT EXISTS (SELECT 1 FROM banners WHERE title = 'THE WEEKLY DROP');
COMMIT;
