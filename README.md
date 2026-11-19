# Solana

An open-source, full-stack e-commerce store template for **small premium brands with a minimal catalog** — with a special focus on **one-product stores**. Everything (app, database, media storage) can be provisioned on **Vercel alone**.

> Status: early scaffold (phase 1). The storefront still shows the stock Payload ecommerce demo UI; the premium storefront, block-based "build mode", theming and passwordless auth land in later phases.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict)
- **Payload CMS 3** running inside the Next.js app (admin at `/admin`, REST at `/api`, GraphQL at `/api/graphql`)
- **@payloadcms/plugin-ecommerce** — products, variants, variant types/options, carts, addresses, orders, transactions, Stripe payments
- **Postgres** via `@payloadcms/db-postgres` (works with Vercel Postgres / Neon)
- **Vercel Blob** via `@payloadcms/storage-vercel-blob` (enabled only when `BLOB_READ_WRITE_TOKEN` is set)
- **Tailwind CSS v4**, shadcn/ui primitives, **pnpm**

Based on the official [Payload ecommerce template](https://github.com/payloadcms/payload/tree/main/templates/ecommerce).

### Data model (current)

| Collections | Globals |
| --- | --- |
| Users (roles: `admin`, `customer`), Media, Pages (block layout), Categories, Products, Variants, Variant Types, Variant Options, Carts, Addresses, Orders, Transactions, Forms, Form Submissions | Header, Footer, Theme (placeholder) |

## Local development

Requirements: Node 22/24+, pnpm 10, a local Postgres.

```bash
cp .env.example .env          # then edit values (PAYLOAD_SECRET, DATABASE_URI, …)
pnpm install
pnpm dev                      # http://localhost:3000, admin at /admin
```

In development Payload pushes schema changes to the database automatically. Useful scripts:

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start Next.js + Payload in dev mode |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Regenerate the admin import map |
| `pnpm migrate:create <name>` | Create a Postgres migration from schema changes |
| `pnpm migrate` | Run pending migrations |
| `pnpm run ci` | `payload migrate` then `pnpm build` (use as Vercel build command) |
| `pnpm lint` | ESLint |

The first user created at `/admin` becomes an admin.

## Environment variables

All variables are documented in [`.env.example`](./.env.example). Key ones:

- `PAYLOAD_SECRET` — long random string.
- `DATABASE_URI` — Postgres connection string (falls back to `POSTGRES_URL`, then `DATABASE_URL`, which the Vercel Neon integration injects).
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token; when absent, uploads are stored on disk in `public/media` (local only).
- `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`, Stripe keys, and (planned) Google OAuth / SMTP magic-link settings.

Never commit `.env` files — only `.env.example` is tracked.

## Deploying to Vercel (to be expanded)

1. Import the repo into Vercel.
2. Add **Neon Postgres** from the Vercel Marketplace (Storage tab) — this injects `POSTGRES_URL` / `DATABASE_URL`.
3. Add a **Vercel Blob** store — this injects `BLOB_READ_WRITE_TOKEN`.
4. Set `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL` and the Stripe keys.
5. Set the build command to `pnpm run ci` so migrations run before each build.
6. Deploy, open `/admin` and create the first (admin) user.

When you change collections/fields, run `pnpm migrate:create <name>` locally and commit the generated file in `src/migrations/`.

## License

[Apache-2.0](./LICENSE)
