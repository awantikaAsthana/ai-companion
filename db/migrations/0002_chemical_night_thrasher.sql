CREATE TYPE "public"."character_visibility" AS ENUM('private', 'public');--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "creator_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "personality" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "interests" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "communication_style" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "relationship_dynamic" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "visibility" character_visibility DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "characters_creator_id_idx" ON "characters" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "characters_visibility_published_idx" ON "characters" USING btree ("visibility","is_published");