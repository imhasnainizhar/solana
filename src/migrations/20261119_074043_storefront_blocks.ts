import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_sabi_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_sabi_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_sabi_hero_height" AS ENUM('screen', 'tall');
  CREATE TYPE "public"."enum_pages_blocks_product_intro_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_product_intro_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_product_intro_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_steps_number_style" AS ENUM('padded', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_steps_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_featured_product_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_featured_product_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_slides_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_slides_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_slides_scheme" AS ENUM('light', 'dark', 'cream', 'ink');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_slides_position" AS ENUM('top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_slides_position_mobile" AS ENUM('top', 'middle', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_slides_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_transition" AS ENUM('fade', 'slide', 'rise', 'wipe');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_controls" AS ENUM('default', 'progress-text', 'arrows-play', 'dots', 'bars');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_progress_style" AS ENUM('position', 'timer');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_counter_style" AS ENUM('slash', 'divider');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_arrow_style" AS ENUM('chevron', 'long');
  CREATE TYPE "public"."enum_pages_blocks_slideshow_container" AS ENUM('full', 'inset');
  CREATE TYPE "public"."enum_pages_blocks_collection_source" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_collection_display" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_collection_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_collection_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_collection_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_press_style" AS ENUM('cards', 'quotes');
  CREATE TYPE "public"."enum_pages_blocks_press_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_layout" AS ENUM('minimal', 'card');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_sabi_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_sabi_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_sabi_hero_height" AS ENUM('screen', 'tall');
  CREATE TYPE "public"."enum__pages_v_blocks_product_intro_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_product_intro_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_product_intro_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_number_style" AS ENUM('padded', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_steps_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_product_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_featured_product_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_slides_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_slides_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_slides_scheme" AS ENUM('light', 'dark', 'cream', 'ink');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_slides_position" AS ENUM('top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_slides_position_mobile" AS ENUM('top', 'middle', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_slides_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_transition" AS ENUM('fade', 'slide', 'rise', 'wipe');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_controls" AS ENUM('default', 'progress-text', 'arrows-play', 'dots', 'bars');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_progress_style" AS ENUM('position', 'timer');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_counter_style" AS ENUM('slash', 'divider');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_arrow_style" AS ENUM('chevron', 'long');
  CREATE TYPE "public"."enum__pages_v_blocks_slideshow_container" AS ENUM('full', 'inset');
  CREATE TYPE "public"."enum__pages_v_blocks_collection_source" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_collection_display" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_collection_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_collection_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_collection_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_press_style" AS ENUM('cards', 'quotes');
  CREATE TYPE "public"."enum__pages_v_blocks_press_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_layout" AS ENUM('minimal', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_background" AS ENUM('cream', 'sand', 'stone', 'dark');
  CREATE TYPE "public"."enum_header_nav_items_groups_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_featured_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_kind" AS ENUM('link', 'mega');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_blocks_sabi_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_sabi_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_sabi_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_sabi_hero_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_sabi_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar DEFAULT 'Just Breathe.',
  	"subheading" varchar,
  	"columns_desktop" numeric DEFAULT 6,
  	"columns_mobile" numeric DEFAULT 3,
  	"height" "enum_pages_blocks_sabi_hero_height" DEFAULT 'tall',
  	"overlay" numeric DEFAULT 55,
  	"parallax" numeric DEFAULT 35,
  	"drift" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_intro_callouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "pages_blocks_product_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Aura One',
  	"watermark" varchar,
  	"promise" varchar DEFAULT 'A calm, considered object that helps you think clearly — anywhere.',
  	"secondary" varchar,
  	"image_id" integer,
  	"tagline" varchar,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_product_intro_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_product_intro_link_appearance" DEFAULT 'default',
  	"background" "enum_pages_blocks_product_intro_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The Science
  Behind Calm
  Focus',
  	"intro" varchar,
  	"number_style" "enum_pages_blocks_steps_number_style" DEFAULT 'padded',
  	"background" "enum_pages_blocks_steps_background" DEFAULT 'sand',
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_product_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_featured_product" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"eyebrow" varchar DEFAULT 'Now shipping',
  	"heading" varchar,
  	"description" varchar,
  	"image_position" "enum_pages_blocks_featured_product_image_position" DEFAULT 'left',
  	"button_label" varchar DEFAULT 'Add to cart',
  	"background" "enum_pages_blocks_featured_product_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_slideshow_slides_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_slideshow_slides_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_slideshow_slides_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_slideshow_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_mobile_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"label" varchar,
  	"scheme" "enum_pages_blocks_slideshow_slides_scheme" DEFAULT 'light',
  	"position" "enum_pages_blocks_slideshow_slides_position" DEFAULT 'bottom-left',
  	"position_mobile" "enum_pages_blocks_slideshow_slides_position_mobile" DEFAULT 'bottom',
  	"alignment" "enum_pages_blocks_slideshow_slides_alignment" DEFAULT 'left',
  	"overlay" numeric DEFAULT 25
  );
  
  CREATE TABLE "pages_blocks_slideshow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"transition" "enum_pages_blocks_slideshow_transition" DEFAULT 'fade',
  	"autoplay" boolean DEFAULT true,
  	"interval" numeric DEFAULT 5,
  	"pause_on_hover" boolean DEFAULT true,
  	"swipe" boolean DEFAULT true,
  	"controls" "enum_pages_blocks_slideshow_controls" DEFAULT 'default',
  	"progress_style" "enum_pages_blocks_slideshow_progress_style" DEFAULT 'timer',
  	"counter_style" "enum_pages_blocks_slideshow_counter_style" DEFAULT 'divider',
  	"arrow_style" "enum_pages_blocks_slideshow_arrow_style" DEFAULT 'chevron',
  	"container" "enum_pages_blocks_slideshow_container" DEFAULT 'inset',
  	"height_desktop" numeric DEFAULT 88,
  	"height_mobile" numeric DEFAULT 80,
  	"radius" numeric DEFAULT 24,
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Complete the set',
  	"intro" varchar,
  	"source" "enum_pages_blocks_collection_source" DEFAULT 'latest',
  	"category_id" integer,
  	"display" "enum_pages_blocks_collection_display" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_collection_columns" DEFAULT '3',
  	"limit" numeric DEFAULT 6,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_collection_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"background" "enum_pages_blocks_collection_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_press_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"publication" varchar,
  	"date" timestamp(3) with time zone,
  	"quote" varchar,
  	"url" varchar,
  	"image_id" integer,
  	"logo_id" integer
  );
  
  CREATE TABLE "pages_blocks_press" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'In the Press',
  	"style" "enum_pages_blocks_press_style" DEFAULT 'cards',
  	"background" "enum_pages_blocks_press_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Join the waitlist to be the first to try Aura One.',
  	"body" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_label" varchar DEFAULT 'Join waitlist',
  	"source" varchar DEFAULT 'waitlist',
  	"success_message" varchar DEFAULT 'You''re on the list. We''ll be in touch.',
  	"layout" "enum_pages_blocks_newsletter_layout" DEFAULT 'minimal',
  	"background" "enum_pages_blocks_newsletter_background" DEFAULT 'stone',
  	"anchor" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sabi_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_sabi_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_sabi_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sabi_hero_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sabi_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar DEFAULT 'Just Breathe.',
  	"subheading" varchar,
  	"columns_desktop" numeric DEFAULT 6,
  	"columns_mobile" numeric DEFAULT 3,
  	"height" "enum__pages_v_blocks_sabi_hero_height" DEFAULT 'tall',
  	"overlay" numeric DEFAULT 55,
  	"parallax" numeric DEFAULT 35,
  	"drift" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_intro_callouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Aura One',
  	"watermark" varchar,
  	"promise" varchar DEFAULT 'A calm, considered object that helps you think clearly — anywhere.',
  	"secondary" varchar,
  	"image_id" integer,
  	"tagline" varchar,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_product_intro_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_product_intro_link_appearance" DEFAULT 'default',
  	"background" "enum__pages_v_blocks_product_intro_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The Science
  Behind Calm
  Focus',
  	"intro" varchar,
  	"number_style" "enum__pages_v_blocks_steps_number_style" DEFAULT 'padded',
  	"background" "enum__pages_v_blocks_steps_background" DEFAULT 'sand',
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_product_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_product" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"eyebrow" varchar DEFAULT 'Now shipping',
  	"heading" varchar,
  	"description" varchar,
  	"image_position" "enum__pages_v_blocks_featured_product_image_position" DEFAULT 'left',
  	"button_label" varchar DEFAULT 'Add to cart',
  	"background" "enum__pages_v_blocks_featured_product_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_slideshow_slides_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_slideshow_slides_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_slideshow_slides_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_slideshow_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_mobile_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"label" varchar,
  	"scheme" "enum__pages_v_blocks_slideshow_slides_scheme" DEFAULT 'light',
  	"position" "enum__pages_v_blocks_slideshow_slides_position" DEFAULT 'bottom-left',
  	"position_mobile" "enum__pages_v_blocks_slideshow_slides_position_mobile" DEFAULT 'bottom',
  	"alignment" "enum__pages_v_blocks_slideshow_slides_alignment" DEFAULT 'left',
  	"overlay" numeric DEFAULT 25,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_slideshow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"transition" "enum__pages_v_blocks_slideshow_transition" DEFAULT 'fade',
  	"autoplay" boolean DEFAULT true,
  	"interval" numeric DEFAULT 5,
  	"pause_on_hover" boolean DEFAULT true,
  	"swipe" boolean DEFAULT true,
  	"controls" "enum__pages_v_blocks_slideshow_controls" DEFAULT 'default',
  	"progress_style" "enum__pages_v_blocks_slideshow_progress_style" DEFAULT 'timer',
  	"counter_style" "enum__pages_v_blocks_slideshow_counter_style" DEFAULT 'divider',
  	"arrow_style" "enum__pages_v_blocks_slideshow_arrow_style" DEFAULT 'chevron',
  	"container" "enum__pages_v_blocks_slideshow_container" DEFAULT 'inset',
  	"height_desktop" numeric DEFAULT 88,
  	"height_mobile" numeric DEFAULT 80,
  	"radius" numeric DEFAULT 24,
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_collection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Complete the set',
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_collection_source" DEFAULT 'latest',
  	"category_id" integer,
  	"display" "enum__pages_v_blocks_collection_display" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_collection_columns" DEFAULT '3',
  	"limit" numeric DEFAULT 6,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_collection_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"background" "enum__pages_v_blocks_collection_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_press_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"publication" varchar,
  	"date" timestamp(3) with time zone,
  	"quote" varchar,
  	"url" varchar,
  	"image_id" integer,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_press" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'In the Press',
  	"style" "enum__pages_v_blocks_press_style" DEFAULT 'cards',
  	"background" "enum__pages_v_blocks_press_background" DEFAULT 'cream',
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Join the waitlist to be the first to try Aura One.',
  	"body" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_label" varchar DEFAULT 'Join waitlist',
  	"source" varchar DEFAULT 'waitlist',
  	"success_message" varchar DEFAULT 'You''re on the list. We''ll be in touch.',
  	"layout" "enum__pages_v_blocks_newsletter_layout" DEFAULT 'minimal',
  	"background" "enum__pages_v_blocks_newsletter_background" DEFAULT 'stone',
  	"anchor" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_groups_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "header_nav_items_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "header_nav_items_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar,
  	"caption" varchar,
  	"link_type" "enum_header_nav_items_featured_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  ALTER TABLE "footer_nav_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_nav_items" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscribers_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN "kind" "enum_header_nav_items_kind" DEFAULT 'link';
  ALTER TABLE "header_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "footer" ADD COLUMN "tagline" varchar DEFAULT 'Designed for focus. Made in small batches.';
  ALTER TABLE "footer" ADD COLUMN "legal" varchar;
  ALTER TABLE "footer" ADD COLUMN "show_wordmark" boolean DEFAULT true;
  ALTER TABLE "footer_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "pages_blocks_sabi_hero_links" ADD CONSTRAINT "pages_blocks_sabi_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sabi_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sabi_hero_tiles" ADD CONSTRAINT "pages_blocks_sabi_hero_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_sabi_hero_tiles" ADD CONSTRAINT "pages_blocks_sabi_hero_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_sabi_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_sabi_hero" ADD CONSTRAINT "pages_blocks_sabi_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_intro_callouts" ADD CONSTRAINT "pages_blocks_product_intro_callouts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_intro_callouts" ADD CONSTRAINT "pages_blocks_product_intro_callouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_intro" ADD CONSTRAINT "pages_blocks_product_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_intro" ADD CONSTRAINT "pages_blocks_product_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_steps" ADD CONSTRAINT "pages_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_product_highlights" ADD CONSTRAINT "pages_blocks_featured_product_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_featured_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_product" ADD CONSTRAINT "pages_blocks_featured_product_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_product" ADD CONSTRAINT "pages_blocks_featured_product_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_slideshow_slides_links" ADD CONSTRAINT "pages_blocks_slideshow_slides_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_slideshow_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_slideshow_slides" ADD CONSTRAINT "pages_blocks_slideshow_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_slideshow_slides" ADD CONSTRAINT "pages_blocks_slideshow_slides_image_mobile_id_media_id_fk" FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_slideshow_slides" ADD CONSTRAINT "pages_blocks_slideshow_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_slideshow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_slideshow" ADD CONSTRAINT "pages_blocks_slideshow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_collection" ADD CONSTRAINT "pages_blocks_collection_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_collection" ADD CONSTRAINT "pages_blocks_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_items" ADD CONSTRAINT "pages_blocks_press_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_items" ADD CONSTRAINT "pages_blocks_press_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_press_items" ADD CONSTRAINT "pages_blocks_press_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_press"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_press" ADD CONSTRAINT "pages_blocks_press_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sabi_hero_links" ADD CONSTRAINT "_pages_v_blocks_sabi_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sabi_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sabi_hero_tiles" ADD CONSTRAINT "_pages_v_blocks_sabi_hero_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sabi_hero_tiles" ADD CONSTRAINT "_pages_v_blocks_sabi_hero_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_sabi_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sabi_hero" ADD CONSTRAINT "_pages_v_blocks_sabi_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_intro_callouts" ADD CONSTRAINT "_pages_v_blocks_product_intro_callouts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_intro_callouts" ADD CONSTRAINT "_pages_v_blocks_product_intro_callouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_intro" ADD CONSTRAINT "_pages_v_blocks_product_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_intro" ADD CONSTRAINT "_pages_v_blocks_product_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_steps" ADD CONSTRAINT "_pages_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_product_highlights" ADD CONSTRAINT "_pages_v_blocks_featured_product_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_featured_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_product" ADD CONSTRAINT "_pages_v_blocks_featured_product_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_product" ADD CONSTRAINT "_pages_v_blocks_featured_product_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slideshow_slides_links" ADD CONSTRAINT "_pages_v_blocks_slideshow_slides_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_slideshow_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slideshow_slides" ADD CONSTRAINT "_pages_v_blocks_slideshow_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slideshow_slides" ADD CONSTRAINT "_pages_v_blocks_slideshow_slides_image_mobile_id_media_id_fk" FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slideshow_slides" ADD CONSTRAINT "_pages_v_blocks_slideshow_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_slideshow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slideshow" ADD CONSTRAINT "_pages_v_blocks_slideshow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_collection" ADD CONSTRAINT "_pages_v_blocks_collection_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_collection" ADD CONSTRAINT "_pages_v_blocks_collection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_press_items" ADD CONSTRAINT "_pages_v_blocks_press_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_press_items" ADD CONSTRAINT "_pages_v_blocks_press_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_press_items" ADD CONSTRAINT "_pages_v_blocks_press_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_press"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_press" ADD CONSTRAINT "_pages_v_blocks_press_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_groups_links" ADD CONSTRAINT "header_nav_items_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_groups" ADD CONSTRAINT "header_nav_items_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_featured" ADD CONSTRAINT "header_nav_items_featured_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items_featured" ADD CONSTRAINT "header_nav_items_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_sabi_hero_links_order_idx" ON "pages_blocks_sabi_hero_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_sabi_hero_links_parent_id_idx" ON "pages_blocks_sabi_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sabi_hero_tiles_order_idx" ON "pages_blocks_sabi_hero_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_sabi_hero_tiles_parent_id_idx" ON "pages_blocks_sabi_hero_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sabi_hero_tiles_image_idx" ON "pages_blocks_sabi_hero_tiles" USING btree ("image_id");
  CREATE INDEX "pages_blocks_sabi_hero_order_idx" ON "pages_blocks_sabi_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_sabi_hero_parent_id_idx" ON "pages_blocks_sabi_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sabi_hero_path_idx" ON "pages_blocks_sabi_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_intro_callouts_order_idx" ON "pages_blocks_product_intro_callouts" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_intro_callouts_parent_id_idx" ON "pages_blocks_product_intro_callouts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_intro_callouts_image_idx" ON "pages_blocks_product_intro_callouts" USING btree ("image_id");
  CREATE INDEX "pages_blocks_product_intro_order_idx" ON "pages_blocks_product_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_intro_parent_id_idx" ON "pages_blocks_product_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_intro_path_idx" ON "pages_blocks_product_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_intro_image_idx" ON "pages_blocks_product_intro" USING btree ("image_id");
  CREATE INDEX "pages_blocks_steps_steps_order_idx" ON "pages_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_steps_parent_id_idx" ON "pages_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_product_highlights_order_idx" ON "pages_blocks_featured_product_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_product_highlights_parent_id_idx" ON "pages_blocks_featured_product_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_product_order_idx" ON "pages_blocks_featured_product" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_product_parent_id_idx" ON "pages_blocks_featured_product" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_product_path_idx" ON "pages_blocks_featured_product" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_product_product_idx" ON "pages_blocks_featured_product" USING btree ("product_id");
  CREATE INDEX "pages_blocks_slideshow_slides_links_order_idx" ON "pages_blocks_slideshow_slides_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_slideshow_slides_links_parent_id_idx" ON "pages_blocks_slideshow_slides_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_slideshow_slides_order_idx" ON "pages_blocks_slideshow_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_slideshow_slides_parent_id_idx" ON "pages_blocks_slideshow_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_slideshow_slides_image_idx" ON "pages_blocks_slideshow_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_slideshow_slides_image_mobile_idx" ON "pages_blocks_slideshow_slides" USING btree ("image_mobile_id");
  CREATE INDEX "pages_blocks_slideshow_order_idx" ON "pages_blocks_slideshow" USING btree ("_order");
  CREATE INDEX "pages_blocks_slideshow_parent_id_idx" ON "pages_blocks_slideshow" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_slideshow_path_idx" ON "pages_blocks_slideshow" USING btree ("_path");
  CREATE INDEX "pages_blocks_collection_order_idx" ON "pages_blocks_collection" USING btree ("_order");
  CREATE INDEX "pages_blocks_collection_parent_id_idx" ON "pages_blocks_collection" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_collection_path_idx" ON "pages_blocks_collection" USING btree ("_path");
  CREATE INDEX "pages_blocks_collection_category_idx" ON "pages_blocks_collection" USING btree ("category_id");
  CREATE INDEX "pages_blocks_press_items_order_idx" ON "pages_blocks_press_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_press_items_parent_id_idx" ON "pages_blocks_press_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_press_items_image_idx" ON "pages_blocks_press_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_press_items_logo_idx" ON "pages_blocks_press_items" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_press_order_idx" ON "pages_blocks_press" USING btree ("_order");
  CREATE INDEX "pages_blocks_press_parent_id_idx" ON "pages_blocks_press" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_press_path_idx" ON "pages_blocks_press" USING btree ("_path");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_sabi_hero_links_order_idx" ON "_pages_v_blocks_sabi_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sabi_hero_links_parent_id_idx" ON "_pages_v_blocks_sabi_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sabi_hero_tiles_order_idx" ON "_pages_v_blocks_sabi_hero_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sabi_hero_tiles_parent_id_idx" ON "_pages_v_blocks_sabi_hero_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sabi_hero_tiles_image_idx" ON "_pages_v_blocks_sabi_hero_tiles" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_sabi_hero_order_idx" ON "_pages_v_blocks_sabi_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sabi_hero_parent_id_idx" ON "_pages_v_blocks_sabi_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sabi_hero_path_idx" ON "_pages_v_blocks_sabi_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_intro_callouts_order_idx" ON "_pages_v_blocks_product_intro_callouts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_intro_callouts_parent_id_idx" ON "_pages_v_blocks_product_intro_callouts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_intro_callouts_image_idx" ON "_pages_v_blocks_product_intro_callouts" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_product_intro_order_idx" ON "_pages_v_blocks_product_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_intro_parent_id_idx" ON "_pages_v_blocks_product_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_intro_path_idx" ON "_pages_v_blocks_product_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_intro_image_idx" ON "_pages_v_blocks_product_intro" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_steps_steps_order_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_steps_parent_id_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_product_highlights_order_idx" ON "_pages_v_blocks_featured_product_highlights" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_product_highlights_parent_id_idx" ON "_pages_v_blocks_featured_product_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_product_order_idx" ON "_pages_v_blocks_featured_product" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_product_parent_id_idx" ON "_pages_v_blocks_featured_product" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_product_path_idx" ON "_pages_v_blocks_featured_product" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_product_product_idx" ON "_pages_v_blocks_featured_product" USING btree ("product_id");
  CREATE INDEX "_pages_v_blocks_slideshow_slides_links_order_idx" ON "_pages_v_blocks_slideshow_slides_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_slideshow_slides_links_parent_id_idx" ON "_pages_v_blocks_slideshow_slides_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_slideshow_slides_order_idx" ON "_pages_v_blocks_slideshow_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_slideshow_slides_parent_id_idx" ON "_pages_v_blocks_slideshow_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_slideshow_slides_image_idx" ON "_pages_v_blocks_slideshow_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_slideshow_slides_image_mobile_idx" ON "_pages_v_blocks_slideshow_slides" USING btree ("image_mobile_id");
  CREATE INDEX "_pages_v_blocks_slideshow_order_idx" ON "_pages_v_blocks_slideshow" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_slideshow_parent_id_idx" ON "_pages_v_blocks_slideshow" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_slideshow_path_idx" ON "_pages_v_blocks_slideshow" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_collection_order_idx" ON "_pages_v_blocks_collection" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_collection_parent_id_idx" ON "_pages_v_blocks_collection" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_collection_path_idx" ON "_pages_v_blocks_collection" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_collection_category_idx" ON "_pages_v_blocks_collection" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_press_items_order_idx" ON "_pages_v_blocks_press_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_press_items_parent_id_idx" ON "_pages_v_blocks_press_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_press_items_image_idx" ON "_pages_v_blocks_press_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_press_items_logo_idx" ON "_pages_v_blocks_press_items" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_press_order_idx" ON "_pages_v_blocks_press" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_press_parent_id_idx" ON "_pages_v_blocks_press" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_press_path_idx" ON "_pages_v_blocks_press" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "header_nav_items_groups_links_order_idx" ON "header_nav_items_groups_links" USING btree ("_order");
  CREATE INDEX "header_nav_items_groups_links_parent_id_idx" ON "header_nav_items_groups_links" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_groups_order_idx" ON "header_nav_items_groups" USING btree ("_order");
  CREATE INDEX "header_nav_items_groups_parent_id_idx" ON "header_nav_items_groups" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_featured_order_idx" ON "header_nav_items_featured" USING btree ("_order");
  CREATE INDEX "header_nav_items_featured_parent_id_idx" ON "header_nav_items_featured" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_featured_image_idx" ON "header_nav_items_featured" USING btree ("image_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "header_rels_products_id_idx" ON "header_rels" USING btree ("products_id");
  CREATE INDEX "footer_rels_products_id_idx" ON "footer_rels" USING btree ("products_id");
  DROP TYPE "public"."enum_footer_nav_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_sabi_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_sabi_hero_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_sabi_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_product_intro_callouts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_product_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_featured_product_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_featured_product" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_slideshow_slides_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_slideshow_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_slideshow" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_press_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_press" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_newsletter" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_sabi_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_sabi_hero_tiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_sabi_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_product_intro_callouts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_product_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featured_product_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featured_product" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_slideshow_slides_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_slideshow_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_slideshow" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_collection" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_press_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_press" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_newsletter" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "subscribers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_groups_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_featured" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_sabi_hero_links" CASCADE;
  DROP TABLE "pages_blocks_sabi_hero_tiles" CASCADE;
  DROP TABLE "pages_blocks_sabi_hero" CASCADE;
  DROP TABLE "pages_blocks_product_intro_callouts" CASCADE;
  DROP TABLE "pages_blocks_product_intro" CASCADE;
  DROP TABLE "pages_blocks_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_featured_product_highlights" CASCADE;
  DROP TABLE "pages_blocks_featured_product" CASCADE;
  DROP TABLE "pages_blocks_slideshow_slides_links" CASCADE;
  DROP TABLE "pages_blocks_slideshow_slides" CASCADE;
  DROP TABLE "pages_blocks_slideshow" CASCADE;
  DROP TABLE "pages_blocks_collection" CASCADE;
  DROP TABLE "pages_blocks_press_items" CASCADE;
  DROP TABLE "pages_blocks_press" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_sabi_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_sabi_hero_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_sabi_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_product_intro_callouts" CASCADE;
  DROP TABLE "_pages_v_blocks_product_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_product_highlights" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_product" CASCADE;
  DROP TABLE "_pages_v_blocks_slideshow_slides_links" CASCADE;
  DROP TABLE "_pages_v_blocks_slideshow_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_slideshow" CASCADE;
  DROP TABLE "_pages_v_blocks_collection" CASCADE;
  DROP TABLE "_pages_v_blocks_press_items" CASCADE;
  DROP TABLE "_pages_v_blocks_press" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "header_nav_items_groups_links" CASCADE;
  DROP TABLE "header_nav_items_groups" CASCADE;
  DROP TABLE "header_nav_items_featured" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscribers_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_products_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_products_fk";
  
  DROP INDEX "payload_locked_documents_rels_subscribers_id_idx";
  DROP INDEX "header_rels_products_id_idx";
  DROP INDEX "footer_rels_products_id_idx";
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscribers_id";
  ALTER TABLE "header_nav_items" DROP COLUMN "kind";
  ALTER TABLE "header_rels" DROP COLUMN "products_id";
  ALTER TABLE "footer" DROP COLUMN "tagline";
  ALTER TABLE "footer" DROP COLUMN "legal";
  ALTER TABLE "footer" DROP COLUMN "show_wordmark";
  ALTER TABLE "footer_rels" DROP COLUMN "products_id";
  DROP TYPE "public"."enum_pages_blocks_sabi_hero_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_sabi_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_sabi_hero_height";
  DROP TYPE "public"."enum_pages_blocks_product_intro_link_type";
  DROP TYPE "public"."enum_pages_blocks_product_intro_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_product_intro_background";
  DROP TYPE "public"."enum_pages_blocks_steps_number_style";
  DROP TYPE "public"."enum_pages_blocks_steps_background";
  DROP TYPE "public"."enum_pages_blocks_featured_product_image_position";
  DROP TYPE "public"."enum_pages_blocks_featured_product_background";
  DROP TYPE "public"."enum_pages_blocks_slideshow_slides_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_slideshow_slides_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_slideshow_slides_scheme";
  DROP TYPE "public"."enum_pages_blocks_slideshow_slides_position";
  DROP TYPE "public"."enum_pages_blocks_slideshow_slides_position_mobile";
  DROP TYPE "public"."enum_pages_blocks_slideshow_slides_alignment";
  DROP TYPE "public"."enum_pages_blocks_slideshow_transition";
  DROP TYPE "public"."enum_pages_blocks_slideshow_controls";
  DROP TYPE "public"."enum_pages_blocks_slideshow_progress_style";
  DROP TYPE "public"."enum_pages_blocks_slideshow_counter_style";
  DROP TYPE "public"."enum_pages_blocks_slideshow_arrow_style";
  DROP TYPE "public"."enum_pages_blocks_slideshow_container";
  DROP TYPE "public"."enum_pages_blocks_collection_source";
  DROP TYPE "public"."enum_pages_blocks_collection_display";
  DROP TYPE "public"."enum_pages_blocks_collection_columns";
  DROP TYPE "public"."enum_pages_blocks_collection_link_type";
  DROP TYPE "public"."enum_pages_blocks_collection_background";
  DROP TYPE "public"."enum_pages_blocks_press_style";
  DROP TYPE "public"."enum_pages_blocks_press_background";
  DROP TYPE "public"."enum_pages_blocks_newsletter_layout";
  DROP TYPE "public"."enum_pages_blocks_newsletter_background";
  DROP TYPE "public"."enum__pages_v_blocks_sabi_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_sabi_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_sabi_hero_height";
  DROP TYPE "public"."enum__pages_v_blocks_product_intro_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_product_intro_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_product_intro_background";
  DROP TYPE "public"."enum__pages_v_blocks_steps_number_style";
  DROP TYPE "public"."enum__pages_v_blocks_steps_background";
  DROP TYPE "public"."enum__pages_v_blocks_featured_product_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_featured_product_background";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_slides_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_slides_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_slides_scheme";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_slides_position";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_slides_position_mobile";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_slides_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_transition";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_controls";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_progress_style";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_counter_style";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_arrow_style";
  DROP TYPE "public"."enum__pages_v_blocks_slideshow_container";
  DROP TYPE "public"."enum__pages_v_blocks_collection_source";
  DROP TYPE "public"."enum__pages_v_blocks_collection_display";
  DROP TYPE "public"."enum__pages_v_blocks_collection_columns";
  DROP TYPE "public"."enum__pages_v_blocks_collection_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_collection_background";
  DROP TYPE "public"."enum__pages_v_blocks_press_style";
  DROP TYPE "public"."enum__pages_v_blocks_press_background";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_layout";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_background";
  DROP TYPE "public"."enum_header_nav_items_groups_links_link_type";
  DROP TYPE "public"."enum_header_nav_items_featured_link_type";
  DROP TYPE "public"."enum_header_nav_items_kind";
  DROP TYPE "public"."enum_footer_columns_links_link_type";`)
}
