import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Locale overlays for CMS entities. Canonical English remains on the entity
 * publishedDoc; non-default locales publish here with the same entity id.
 */
export const contentTranslation = pgTable(
  "content_translation",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    locale: text("locale").notNull(),
    slug: text("slug"),
    doc: jsonb("doc").notNull(),
    publicationStatus: text("publication_status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("content_translation_entity_locale_uidx").on(
      t.entityType,
      t.entityId,
      t.locale,
    ),
    index("content_translation_locale_status_idx").on(
      t.locale,
      t.publicationStatus,
    ),
    index("content_translation_entity_idx").on(t.entityType, t.entityId),
  ],
);

/** BCP 47 locales supported for public CMS + storefront. */
export const CONTENT_LOCALES = [
  "en",
  "ar",
  "es",
  "de",
  "fr",
  "fr-CA",
  "it",
  "pt-BR",
  "nl",
  "tr",
  "ur",
  "hi",
  "zh-CN",
  "ja",
  "ko",
  "ru",
  "id",
  "vi",
] as const;

export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export const CONTENT_ENTITY_TYPES = [
  "service",
  "subservice",
  "blog_post",
  "portfolio_project",
  "faq_item",
  "testimonial",
  "stat_metric",
  "site_document",
  "section_setting",
] as const;

export type ContentEntityType = (typeof CONTENT_ENTITY_TYPES)[number];
