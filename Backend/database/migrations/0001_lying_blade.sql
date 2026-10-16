CREATE TABLE "admin_audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"result" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"homepage_order" integer DEFAULT 0 NOT NULL,
	"draft_slug" text NOT NULL,
	"published_slug" text,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_published_at" timestamp with time zone,
	"published_updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "content_redirect" (
	"id" text PRIMARY KEY NOT NULL,
	"from_path" text NOT NULL,
	"to_path" text NOT NULL,
	"http_status" integer DEFAULT 301 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_redirect_from_path_unique" UNIQUE("from_path")
);
--> statement-breakpoint
CREATE TABLE "media_asset" (
	"id" text PRIMARY KEY NOT NULL,
	"storage_kind" text NOT NULL,
	"object_key" text NOT NULL,
	"mime" text NOT NULL,
	"byte_size" integer,
	"width" integer,
	"height" integer,
	"alt" text DEFAULT '' NOT NULL,
	"decorative" boolean DEFAULT false NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_project" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"draft_slug" text NOT NULL,
	"published_slug" text,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_published_at" timestamp with time zone,
	"published_updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "section_setting" (
	"key" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"draft_slug" text NOT NULL,
	"published_slug" text,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_published_at" timestamp with time zone,
	"published_updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "subservice" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"draft_slug" text NOT NULL,
	"published_slug" text,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_published_at" timestamp with time zone,
	"published_updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "subservice" ADD CONSTRAINT "subservice_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_post_draft_slug_uidx" ON "blog_post" USING btree ("draft_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_post_published_slug_uidx" ON "blog_post" USING btree ("published_slug");--> statement-breakpoint
CREATE INDEX "blog_post_status_homepage_idx" ON "blog_post" USING btree ("status","homepage_order");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_draft_slug_uidx" ON "portfolio_project" USING btree ("draft_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_published_slug_uidx" ON "portfolio_project" USING btree ("published_slug");--> statement-breakpoint
CREATE INDEX "portfolio_status_sort_idx" ON "portfolio_project" USING btree ("status","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "service_draft_slug_uidx" ON "service" USING btree ("draft_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "service_published_slug_uidx" ON "service" USING btree ("published_slug");--> statement-breakpoint
CREATE INDEX "service_status_sort_idx" ON "service" USING btree ("status","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "subservice_parent_draft_slug_uidx" ON "subservice" USING btree ("service_id","draft_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "subservice_parent_published_slug_uidx" ON "subservice" USING btree ("service_id","published_slug");--> statement-breakpoint
CREATE INDEX "subservice_service_id_idx" ON "subservice" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "subservice_status_sort_idx" ON "subservice" USING btree ("status","sort_order");