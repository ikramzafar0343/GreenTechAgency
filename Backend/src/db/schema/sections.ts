import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const sectionSetting = pgTable("section_setting", {
  key: text("key").primaryKey(),
  version: integer("version").notNull().default(1),
  visible: boolean("visible").notNull().default(true),
  draftDoc: jsonb("draft_doc").notNull(),
  publishedDoc: jsonb("published_doc"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
