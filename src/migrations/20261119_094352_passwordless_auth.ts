import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "login_tokens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"token_hash" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"used_at" timestamp(3) with time zone,
  	"ip_hash" varchar,
  	"user_agent" varchar,
  	"redirect" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "google_subject" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "login_tokens_id" integer;
  CREATE UNIQUE INDEX "login_tokens_token_hash_idx" ON "login_tokens" USING btree ("token_hash");
  CREATE INDEX "login_tokens_email_idx" ON "login_tokens" USING btree ("email");
  CREATE INDEX "login_tokens_expires_at_idx" ON "login_tokens" USING btree ("expires_at");
  CREATE INDEX "login_tokens_ip_hash_idx" ON "login_tokens" USING btree ("ip_hash");
  CREATE INDEX "login_tokens_updated_at_idx" ON "login_tokens" USING btree ("updated_at");
  CREATE INDEX "login_tokens_created_at_idx" ON "login_tokens" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_login_tokens_fk" FOREIGN KEY ("login_tokens_id") REFERENCES "public"."login_tokens"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "users_google_subject_idx" ON "users" USING btree ("google_subject");
  CREATE INDEX "payload_locked_documents_rels_login_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("login_tokens_id");
  ALTER TABLE "users" DROP COLUMN "reset_password_token";
  ALTER TABLE "users" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "users" DROP COLUMN "salt";
  ALTER TABLE "users" DROP COLUMN "hash";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "users" DROP COLUMN "login_attempts";
  ALTER TABLE "users" DROP COLUMN "lock_until";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "login_tokens" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "login_tokens" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_login_tokens_fk";
  
  DROP INDEX "users_google_subject_idx";
  DROP INDEX "payload_locked_documents_rels_login_tokens_id_idx";
  ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "salt" varchar;
  ALTER TABLE "users" ADD COLUMN "hash" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "users" DROP COLUMN "google_subject";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "login_tokens_id";`)
}
