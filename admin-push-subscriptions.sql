-- Additive: stores owner browser endpoints for background order alerts.
CREATE TABLE IF NOT EXISTS admin_push_subscriptions (
  id serial PRIMARY KEY,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamp(6) without time zone NOT NULL DEFAULT now()
);
