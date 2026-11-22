# Solana

An open-source, full-stack e-commerce store template for **small premium brands with a minimal catalog** — with a special focus on **one-product stores**. Everything (app, database, media storage) can be provisioned on **Vercel alone**.

> Status: phases 1–4 done — scaffold, sabi-style storefront, themes + build mode, and passwordless auth (Google + email magic link). Commerce hardening (see `docs/ROADMAP.md`) is next.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict)
- **Payload CMS 3** running inside the Next.js app (admin at `/admin`, REST at `/api`, GraphQL at `/api/graphql`)
- **@payloadcms/plugin-ecommerce** — products, variants, variant types/options, carts, addresses, orders, transactions, Stripe payments
- **Postgres** via `@payloadcms/db-postgres` (works with Vercel Postgres / Neon)
- **Vercel Blob** via `@payloadcms/storage-vercel-blob` (enabled only when `BLOB_READ_WRITE_TOKEN` is set)
- **Tailwind CSS v4**, shadcn/ui primitives, **Bun** (package manager / script runner; the app itself runs on Node)

Based on the official [Payload ecommerce template](https://github.com/payloadcms/payload/tree/main/templates/ecommerce).

### Data model (current)

| Collections | Globals |
| --- | --- |
| Users (roles: `admin`, `customer`), Media, Pages (block layout), Categories, Products, Variants, Variant Types, Variant Options, Carts, Addresses, Orders, Transactions, Forms, Form Submissions | Header, Footer, Theme (placeholder) |

## Local development

Requirements: Node 22/24+, Bun 1.4+, a local Postgres.

```bash
cp .env.example .env          # then edit values (PAYLOAD_SECRET, DATABASE_URI, …)
bun install
bun run dev                   # http://localhost:3000, admin at /admin
```

In development Payload pushes schema changes to the database automatically. Useful scripts:

| Script | What it does |
| --- | --- |
| `bun run dev` | Start Next.js + Payload in dev mode |
| `bun run build` / `bun run start` | Production build / serve |
| `bun run generate:types` | Regenerate `src/payload-types.ts` |
| `bun run generate:importmap` | Regenerate the admin import map |
| `bun run migrate:create <name>` | Create a Postgres migration from schema changes |
| `bun run migrate` | Run pending migrations |
| `bun run ci` | `payload migrate` then `bun run build` (use as Vercel build command) |
| `bun run lint` | ESLint |

Sign-in is passwordless (see [Authentication](#authentication)). Admins are bootstrapped from `ADMIN_EMAILS`; locally, with no SMTP configured, sign-in links are printed to the server console.

## Environment variables

All variables are documented in [`.env.example`](./.env.example). Key ones:

- `PAYLOAD_SECRET` — long random string.
- `DATABASE_URI` — Postgres connection string (falls back to `POSTGRES_URL`, then `DATABASE_URL`, which the Vercel Neon integration injects).
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token; when absent, uploads are stored on disk in `public/media` (local only).
- `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`, Stripe keys.
- `ADMIN_EMAILS`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, `SMTP_*` / `EMAIL_FROM` — see [Authentication](#authentication).

Never commit `.env` files — only `.env.example` is tracked.

## Authentication

Accounts are **passwordless**. Customers and admins use the same two methods: **Continue with Google** or **Email me a sign-in link**. There are no password fields, password login, or forgot/reset-password endpoints. The `users` collection sets Payload's `disableLocalStrategy: true`, so Payload doesn't add the hash/salt columns or the `/login`, `/forgot-password` and `/reset-password` operations. Your first sign-in creates your account.

### How it works (and why not a plugin)

Payload 3 has no built-in OAuth or magic-link login. Its supported extension point is [custom auth strategies](https://payloadcms.com/docs/authentication/custom-strategies). The community plugins each cover only part of what we need: `payload-oauth2` does OAuth only, `payload-auth-plugin` has no magic links, and `payload-authjs` depends on Auth.js v5, whose future is uncertain. So `src/auth/` is a small module you can audit yourself:

- **Sessions are standard Payload sessions.** On sign-in we call Payload's own `addSessionToUser`, `getFieldsToSign`, `jwtSign` and `generatePayloadCookie`, which set the usual `payload-token` cookie with a `sid`. The custom `passwordless` strategy (`src/auth/strategy.ts`) verifies that JWT and checks that the session still exists. Payload's `/api/users/me`, `/refresh-token` and `/logout` keep working unchanged, and an `afterLogout` hook revokes the session. Only `session.ts` and `strategy.ts` touch Payload internals.
- **Magic link.** `POST /api/auth/magic-link {email, redirect?}` creates a 32-byte random token. Only its SHA-256 hash is stored in the hidden `login-tokens` collection, and it expires after 15 minutes. The endpoint always returns the same response, so it doesn't reveal whether an account exists. It is rate-limited to 3 requests per email and 10 per (hashed) IP every 15 minutes. The limit is stored in the database, so it works on serverless. `GET /auth/verify?token=…` consumes the token with one atomic `UPDATE … WHERE used_at IS NULL AND expires_at > now()`. It then finds or creates the user, sets the session cookie and redirects to the requested page, or to `/admin` for admins and `/account` for customers.
- **Google.** `GET /api/auth/google` uses the Authorization Code flow with PKCE (S256), `state` and `nonce`, built with [Arctic](https://arcticjs.dev). The state lives in a short-lived httpOnly cookie. `GET /api/auth/google/callback` verifies the ID token against Google's JWKS with `jose` (signature, `iss`, `aud`, `exp`, `nonce`) and requires `email_verified`. It then finds or creates the user by email and links Google's stable `sub` as `googleSubject`.
- **Roles.** New users get `customer`. Anyone whose email is listed in `ADMIN_EMAILS` gets `admin` when they sign in. Nobody is ever demoted automatically, so after bootstrap you manage roles in the admin panel. A user's email can only be changed by an admin, because the email is the account's identity.
- **Admin panel.** With the local strategy disabled, Payload hides its email/password form. `admin.components.beforeLogin` (`src/components/BeforeLogin`) renders the passwordless UI in its place.

### Google Cloud setup

1. In [Google Cloud console](https://console.cloud.google.com/), go to **APIs & Services → OAuth consent screen**. Choose *External*, add the app name and support email, and add the scopes `openid`, `email` and `profile`. Publish the app; while it's in *Testing*, only listed test users can sign in.
2. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID** and choose *Web application*.
   - **Authorized JavaScript origins:** `http://localhost:3000` and `https://<your-domain>` (or `https://<project>.vercel.app`).
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/google/callback` and `https://<your-domain>/api/auth/google/callback`. Add one for each production or preview domain you use.
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. The redirect URI is built from `NEXT_PUBLIC_SERVER_URL`, so set that to the exact public origin, with no trailing slash. The Google button only appears when both keys are set.

### Email (magic links)

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `EMAIL_FROM`. These are passed to Payload's nodemailer adapter, so any SMTP provider works.

- **Resend:** host `smtp.resend.com`, port `465` (or `587`), user `resend`, password = your API key. `EMAIL_FROM` must be on a domain you have verified in Resend.
- **Postmark / SES / Mailgun / Gmail SMTP:** use the provider's SMTP host and credentials.

**When no SMTP is configured:**

- **Development:** each sign-in link is printed to the server console (`[auth] Magic link for … : http://…/auth/verify?token=…`).
- **Production:** nothing is sent and an error is logged. To get in before email is set up, set `AUTH_LOG_MAGIC_LINKS=true` temporarily so the link is printed to your Vercel logs. Remove it afterwards.

Note: some corporate mail scanners open links before the user does. Because each link works only once, such a scanner can use up the link. If that happens, request a new link or use Google.

## Deploying to Vercel (to be expanded)

1. Import the repo into Vercel.
2. Add **Neon Postgres** from the Vercel Marketplace (Storage tab) — this injects `POSTGRES_URL` / `DATABASE_URL`.
3. Add a **Vercel Blob** store — this injects `BLOB_READ_WRITE_TOKEN`.
4. Set `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL`, the Stripe keys, `ADMIN_EMAILS`, SMTP settings and (optionally) the Google OAuth keys.
5. Set the build command to `bun run ci` so migrations run before each build.
6. Deploy, open `/admin`, and sign in with an address listed in `ADMIN_EMAILS`. That account gets the admin role.

When you change collections/fields, run `bun run migrate:create <name>` locally and commit the generated file in `src/migrations/`.

## License

[Apache-2.0](./LICENSE)
