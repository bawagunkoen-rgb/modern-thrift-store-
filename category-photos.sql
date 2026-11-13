BEGIN;
-- Populate only unset category photos. Owner-selected photos are never overwritten.
UPDATE categories c SET image_url = COALESCE(
  (SELECT p.image_url FROM products p WHERE p.category_id = c.id AND p.deleted_at IS NULL
    AND (p.image_url LIKE '/api/media/%' OR p.image_url LIKE 'https://%')
    ORDER BY p.created_at DESC LIMIT 1),
  CASE c.icon
    WHEN 'trousers' THEN '/images/categories/trousers.jpg'
    WHEN 'pants' THEN '/images/categories/pants.jpg'
    WHEN 'sneakers' THEN '/images/categories/sneakers.jpg'
    WHEN 'tshirt' THEN '/images/categories/cotton-tshirt.jpg'
    WHEN 'polo' THEN '/images/categories/cotton-tshirt.jpg'
    WHEN 'dress-shirt' THEN '/images/categories/dress-shirt.jpg'
    WHEN 'shirt' THEN '/images/categories/dress-shirt.jpg'
    WHEN 'dress-pants' THEN '/images/categories/dress-pants.jpg'
    WHEN 'golf' THEN '/images/categories/golf.jpg'
  END
) WHERE c.image_url IS NULL;
COMMIT;
