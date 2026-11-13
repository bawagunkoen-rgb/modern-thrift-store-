import { pgTable, serial, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bannersTable = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url").notNull().default("/collection"),
  active: boolean("active").notNull().default(true),
  position: integer("position").notNull().default(0),
});
export const storeSettingsTable = pgTable("store_settings", {
  id: integer("id").primaryKey(),
  whatsappNumber: text("whatsapp_number").notNull().default(""),
  instagramUrl: text("instagram_url").notNull().default(""),
  tiktokUrl: text("tiktok_url").notNull().default(""),
  bankInstructions: text("bank_instructions").notNull().default(""),
  shippingFee: integer("shipping_fee").notNull().default(250),
  googleAnalyticsMeasurementId: text("google_analytics_measurement_id").notNull().default(""),
});
export const subscribersTable = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const abandonedCartsTable = pgTable("abandoned_carts", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  customerName: text("customer_name").notNull().default(""),
  customerPhone: text("customer_phone").notNull(),
  city: text("city").notNull().default(""),
  customerAddress: text("customer_address").notNull().default(""),
  items: jsonb("items").notNull().default([]),
  recovered: boolean("recovered").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const insertBannerSchema = createInsertSchema(bannersTable).omit({ id: true });
export const insertSubscriberSchema = createInsertSchema(subscribersTable).omit({ id: true, createdAt: true });
export const insertAbandonedCartSchema = createInsertSchema(abandonedCartsTable).omit({ id: true, updatedAt: true });
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type InsertAbandonedCart = z.infer<typeof insertAbandonedCartSchema>;
