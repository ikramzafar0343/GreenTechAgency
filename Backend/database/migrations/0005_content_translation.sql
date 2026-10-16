CREATE TABLE IF NOT EXISTS "content_translation" (
  "id" text PRIMARY KEY NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" text NOT NULL,
  "locale" text NOT NULL,
  "slug" text,
  "doc" jsonb NOT NULL,
  "publication_status" text DEFAULT 'draft' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "content_translation_entity_locale_uidx"
  ON "content_translation" ("entity_type", "entity_id", "locale");

CREATE INDEX IF NOT EXISTS "content_translation_locale_status_idx"
  ON "content_translation" ("locale", "publication_status");

CREATE INDEX IF NOT EXISTS "content_translation_entity_idx"
  ON "content_translation" ("entity_type", "entity_id");
