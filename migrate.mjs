import pg from "pg";
import { readFile } from "node:fs/promises";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const client = await pool.connect();
try {
  await client.query("SELECT pg_advisory_lock(8128401)");
  await client.query("CREATE TABLE IF NOT EXISTS app_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  for (const [version, filename] of [
    ["modern-store-additive", "modern-store.sql"],
    ["modern-store-category-photos", "category-photos.sql"],
    ["product-storage-location", "product-storage-location.sql"],
    ["product-sleeve-measurement", "product-sleeve-measurement.sql"],
    ["product-waist-measurement", "product-waist-measurement.sql"],
    ["order-customer-email", "order-customer-email.sql"],
    ["admin-push-subscriptions", "admin-push-subscriptions.sql"],
  ]) {
    const { rows } = await client.query("SELECT version FROM app_migrations WHERE version = $1", [version]);
    if (!rows.length) {
      await client.query(await readFile(new URL(`./migrations/${filename}`, import.meta.url), "utf8"));
      await client.query("INSERT INTO app_migrations(version) VALUES ($1)", [version]);
      process.stdout.write("Applied additive store migration; existing records preserved.\n");
    }
  }
} finally {
  await client.query("SELECT pg_advisory_unlock(8128401)");
  client.release();
  await pool.end();
}
