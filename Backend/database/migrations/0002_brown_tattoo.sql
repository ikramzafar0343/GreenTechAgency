CREATE TABLE "enquiry" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text DEFAULT 'contact' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"phone" text,
	"service" text,
	"message" text NOT NULL,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faq_item" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_document" (
	"key" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stat_metric" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonial" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"draft_doc" jsonb NOT NULL,
	"published_doc" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "enquiry_created_at_idx" ON "enquiry" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "faq_item_status_sort_idx" ON "faq_item" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "stat_metric_status_sort_idx" ON "stat_metric" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "testimonial_status_sort_idx" ON "testimonial" USING btree ("status","sort_order");