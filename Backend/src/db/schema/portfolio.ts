import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const portfolioProject = pgTable(
  "portfolio_project",
  {
    id: text("id").primaryKey(),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    draftSlug: text("draft_slug").notNull(),
    publishedSlug: text("published_slug"),
    draftDoc: jsonb("draft_doc").notNull(),
    publishedDoc: jsonb("published_doc"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    firstPublishedAt: timestamp("first_published_at", { withTimezone: true }),
    publishedUpdatedAt: timestamp("published_updated_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("portfolio_draft_slug_uidx").on(t.draftSlug),
    uniqueIndex("portfolio_published_slug_uidx").on(t.publishedSlug),
    index("portfolio_status_sort_idx").on(t.status, t.sortOrder),
  ],
);
