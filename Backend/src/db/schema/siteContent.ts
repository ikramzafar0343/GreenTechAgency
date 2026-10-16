import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

/** FAQ Q&A rows (public when status=published). */
export const faqItem = pgTable(
  "faq_item",
  {
    id: text("id").primaryKey(),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
    draftDoc: jsonb("draft_doc").notNull(),
    publishedDoc: jsonb("published_doc"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("faq_item_status_sort_idx").on(t.status, t.sortOrder)],
);

export const testimonial = pgTable(
  "testimonial",
  {
    id: text("id").primaryKey(),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    draftDoc: jsonb("draft_doc").notNull(),
    publishedDoc: jsonb("published_doc"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("testimonial_status_sort_idx").on(t.status, t.sortOrder)],
);

export const statMetric = pgTable(
  "stat_metric",
  {
    id: text("id").primaryKey(),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
    draftDoc: jsonb("draft_doc").notNull(),
    publishedDoc: jsonb("published_doc"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("stat_metric_status_sort_idx").on(t.status, t.sortOrder)],
);

/** Singleton site documents: footer, about (draft/published JSON). */
export const siteDocument = pgTable("site_document", {
  key: text("key").primaryKey(),
  version: integer("version").notNull().default(1),
  draftDoc: jsonb("draft_doc").notNull(),
  publishedDoc: jsonb("published_doc"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Contact / enquiry / callback submissions. */
export const enquiry = pgTable(
  "enquiry",
  {
    id: text("id").primaryKey(),
    kind: text("kind").notNull().default("contact"),
    status: text("status").notNull().default("new"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    phone: text("phone"),
    service: text("service"),
    message: text("message").notNull(),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("enquiry_created_at_idx").on(t.createdAt)],
);
