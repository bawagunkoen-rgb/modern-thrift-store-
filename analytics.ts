import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const visitorSessionsTable = pgTable(
  "visitor_sessions",
  {
    visitorId: text("visitor_id").primaryKey(),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("visitor_sessions_last_seen_at_idx").on(table.lastSeenAt)],
);

export const visitorPageViewsTable = pgTable(
  "visitor_page_views",
  {
    id: serial("id").primaryKey(),
    visitorId: text("visitor_id").notNull(),
    pagePath: text("page_path").notNull(),
    visitedAt: timestamp("visited_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("visitor_page_views_visited_at_idx").on(table.visitedAt),
    index("visitor_page_views_path_visited_at_idx").on(table.pagePath, table.visitedAt),
  ],
);
