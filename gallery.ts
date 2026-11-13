import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const galleryImagesTable = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  objectPath: text("object_path").notNull().unique(),
  name: text("name").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
