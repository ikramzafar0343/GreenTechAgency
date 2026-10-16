import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const contentRedirect = pgTable("content_redirect", {
  id: text("id").primaryKey(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  httpStatus: integer("http_status").notNull().default(301),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
