import { pgTable, text, serial, numeric, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("package"),
  imageUrl: text("image_url"),
  collection: text("collection").notNull().default("Summer Collection"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brandsTable = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  categoryId: serial("category_id").notNull().references(() => categoriesTable.id),
  brandId: serial("brand_id").notNull().references(() => brandsTable.id),
  size: text("size"),
  condition: text("condition").notNull().default("good"),
  inStock: boolean("in_stock").notNull().default(true),
  stockQuantity: integer("stock_quantity").notNull().default(1),
  images: text("images").array().notNull().default([]),
  storageLocationCode: text("storage_location_code"),
  featured: boolean("featured").notNull().default(false),
  chestInches: numeric("chest_inches", { precision: 6, scale: 2 }),
  lengthInches: numeric("length_inches", { precision: 6, scale: 2 }),
  sleeveInches: numeric("sleeve_inches", { precision: 6, scale: 2 }),
  waistInches: numeric("waist_inches", { precision: 6, scale: 2 }),
  flashDropEndsAt: timestamp("flash_drop_ends_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true, createdAt: true });
export const insertBrandSchema = createInsertSchema(brandsTable).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categoriesTable.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brandsTable.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
