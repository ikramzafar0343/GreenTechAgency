import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const mediaAsset = pgTable("media_asset", {
  id: text("id").primaryKey(),
  storageKind: text("storage_kind").notNull(),
  objectKey: text("object_key").notNull(),
  mime: text("mime").notNull(),
  byteSize: integer("byte_size"),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt").notNull().default(""),
  decorative: boolean("decorative").notNull().default(false),
  visibility: text("visibility").notNull().default("private"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
