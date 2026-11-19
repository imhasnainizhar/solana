# solana — Roadmap

> Written 2026-11-19. Baseline: **Payload 3.94.0** (latest stable) with `@payloadcms/plugin-ecommerce` 3.94.0. **Payload 4.0.0-beta.10** is in pre-release (<https://github.com/payloadcms/payload/releases>). The ecommerce plugin is still labelled **Beta**: "may have breaking changes in future releases" (<https://payloadcms.com/docs/ecommerce/overview>).
> Goal: an open-source, **Vercel-only** (Vercel + Neon via Marketplace + Vercel Blob), premium **one-product** store template on Next.js + Payload 3. Customer and admin login is **Google OAuth or email magic link only**.

**Legend.** Priority: **P0** = required for a store that can legally take money; **P1** = expected of a "premium" template; **P2** = nice to have. Effort: **S** ≤ 2 days, **M** 3–7 days, **L** 2–4 weeks (one dev, incl. tests).

---

# PART 1 — Must-implement for the goal

## Summary

| # | Feature | Prio | Effort | Payload gives us |
|---|---|---|---|---|
| 1 | Checkout & payments (Stripe) | P0 | L | PaymentIntents adapter, carts, transactions, orders |
| 2 | Adjustable order totals (shipping/tax/discount pipeline) | P0 | M | nothing; amount hardcoded to `cart.subtotal` |
| 3 | Shipping rates & zones | P0 | M | address fields + `supportedCountries` only |
| 4 | Tax (Stripe Tax) | P0 | M | nothing |
| 5 | Orders & fulfilment states | P0 | M | `status`: processing/completed/cancelled/refunded |
| 6 | Webhooks, reconciliation, refunds | P0 | M | optional webhook map |
| 7 | Inventory | P0 | S | basic counter, decrement on order |
| 8 | Transactional email | P0 | M | Resend/Nodemailer adapters, `sendEmail` |
| 9 | Auth: Google + magic link, no passwords | P0 | L | `disableLocalStrategy` + custom strategies |
| 10 | Guest checkout & order lookup | P0 | S | guest carts (+ template pattern) |
| 11 | Vercel one-click deploy (Neon + Blob + env) | P0 | M | reference button in `with-vercel-website` |
| 12 | Migrations strategy on Vercel | P0 | S | `payload migrate` in build |
| 13 | Legal pages + checkout consent | P0 | S | pages/blocks |
| 14 | Security & rate limiting | P0 | M | access control |
| 15 | SEO (meta, sitemap, OG, JSON-LD) | P1 | M | plugin-seo (meta fields only) |
| 16 | Analytics (Vercel) | P1 | S | — |
| 17 | Multi-theme & build mode | P1 | L | Live Preview, drafts |
| 18 | Preview / drafts / scheduled publish | P1 | S | drafts, autosave, `schedulePublish` |
| 19 | Image & media optimisation | P1 | S | image sizes, Blob adapter |
| 20 | Discounts / coupons | P1 | M | nothing |
| 21 | Cookie consent | P1 | S | — |
| 22 | Reviews | P1 | M | nothing (maintainer: "external") |
| 23 | Abandoned cart & back-in-stock | P1 | M | jobs queue, carts |
| 24 | Backups & export | P1 | S | Neon PITR, import-export plugin |
| 25 | Tests & CI | P1 | M | template e2e (reported broken) |
| 26 | Multi-currency | P2 | S | per-currency price fields |
| 27 | i18n / localisation | P2 | M | content localisation + admin i18n |
| 28 | Search | P2 | S | plugin-search |
| 29 | Subscriptions | P2 | L | nothing |

---

## P0 — the store can legally take money

### 1. Checkout & payments (Stripe) — P0 · L

**What Payload provides**
- The ecommerce plugin ships a Stripe adapter built on **PaymentIntents**. `initiatePayment` creates a PaymentIntent and returns a `clientSecret`; `confirmOrder` validates the payment and calls `finalizeOrder`. Endpoints are `/api/payments/stripe/initiate`, `/confirm-order` and `/webhooks`. Confirmation is idempotent per transaction (<https://payloadcms.com/docs/ecommerce/payments>).
- Stripe is "the only gateway currently supported"; others must implement `PaymentAdapter` (<https://payloadcms.com/docs/ecommerce/overview>).
- Frontend: `EcommerceProvider`, `useCart`, `usePayments`, `useAddresses`, `useCurrency` (<https://payloadcms.com/docs/ecommerce/frontend>).
- The docs say nothing about Stripe Checkout (hosted) or Apple Pay / Google Pay. Because the adapter returns a PaymentIntent `clientSecret`, the frontend is **Stripe Elements**.
- Open correctness bugs to track:
  - variant items skip stock/price validation (<https://github.com/payloadcms/payload/issues/17866>, <https://github.com/payloadcms/payload/issues/18339>)
  - a second `initiatePayment` for the same cart fails (<https://github.com/payloadcms/payload/issues/16453>)
  - Stripe metadata exceeds 500 chars (<https://github.com/payloadcms/payload/issues/19017>, <https://github.com/payloadcms/payload/issues/19055>)
  - API-key users are treated as customers (<https://github.com/payloadcms/payload/issues/16377>)
  - an earlier bug where `confirmOrder` didn't verify PaymentIntent status is closed (<https://github.com/payloadcms/payload/issues/15862>)

**What we must build**
- A single-page, one-product checkout: contact → shipping address (Stripe Address Element) → shipping method → **Payment Element**, plus **Express Checkout Element** for Apple Pay, Google Pay and Link.
  - The Payment Element shows wallets "when possible" (<https://docs.stripe.com/payments/payment-element>).
  - Express Checkout needs **domain registration** in sandbox and live (<https://docs.stripe.com/elements/express-checkout-element>).
  - We must automate domain registration for the store's Vercel domain, or document it.
- **Decision record: Elements + PaymentIntents (plugin) vs Stripe Checkout Sessions.** Stripe now *recommends* Checkout Sessions with the Payment Element, because Sessions include tax, discounts, shipping and subscriptions out of the box. With PaymentIntents "you … build all checkout logic yourself" (<https://docs.stripe.com/payments/payment-element>).
  - **Recommendation:** stay on the plugin's PaymentIntents adapter for v1, so orders, carts and inventory stay inside Payload, and add the totals pipeline (#2).
  - Evaluate a **Checkout Sessions adapter** as an upstream contribution (Part 2, U3).
- Pin and patch: carry local patches (`pnpm patch`) for the bugs above until upstream merges land.

**Effort:** L.

### 2. Adjustable order totals (shipping + tax + discount pipeline) — P0 · M

**What Payload provides:** nothing. The Stripe adapter "hardcodes the PaymentIntent amount to `cart.subtotal`" (<https://github.com/payloadcms/payload/issues/15784>, open).
- A client-supplied `amount` override PR was **closed** by the maintainer because it trusts client input; a hooks-based follow-up was promised (<https://github.com/payloadcms/payload/pull/15954>).
- Community PR **#16313 "add support for payment hooks"** is open. It proposes a three-hook pipeline for "taxes, shipping, discounts, gift cards" (<https://github.com/payloadcms/payload/pull/16313>).
- The ecommerce RFC lists a "pricing calculation hook" as a candidate (<https://github.com/payloadcms/payload/discussions/14239>).

**What we must build:** a server-side `computeTotals(cart, address, shippingMethod, discountCode)`, run as `subtotal → discounts → shipping → tax → total`. The adjustments are persisted on the transaction and order (`adjustments[]`, `shippingTotal`, `taxTotal`, `discountTotal`, `total`).
- Short term: wrap or override the Stripe adapter's `initiatePayment` with our own adapter (the `PaymentAdapter` interface allows this).
- Long term: switch to the upstream hooks once merged (Part 2, U1).

**Effort:** M.

### 3. Shipping rates & zones — P0 · M

**What Payload provides:**
- An addresses collection with `supportedCountries` (<https://payloadcms.com/docs/ecommerce/plugin>), and `initiatePayment` receives `shippingAddress` (<https://payloadcms.com/docs/ecommerce/payments>).
- Shipping is explicitly "not supported natively" (<https://payloadcms.com/docs/ecommerce/overview>), and the RFC lists shipping only as a pre-emptive idea (<https://github.com/payloadcms/payload/discussions/14239>).

**What we must build:**
- A `ShippingSettings` global with **zones** (country lists) → **rates** (flat, free-over-threshold, weight-tier), processing time and carrier label.
- Product weight and dimensions fields.
- Selection in checkout, an amount fed into #2, and a feed into the Trust Strip block.
- Live carrier rates (EasyPost/Shippo) stay out of v1 and are a later adapter.

**Effort:** M.

### 4. Tax — P0 · M

**What Payload provides:** nothing ("shipping, taxes, and subscriptions … implement yourself", <https://payloadcms.com/docs/ecommerce/overview>). The maintainer said "I'll come up with a pattern … so we can support any system" (<https://github.com/payloadcms/payload/discussions/14239>).

**What we must build:**
- A `TaxProvider` interface with two implementations:
  - `none/inclusive` (EU-style VAT-inclusive pricing; we only show the breakdown)
  - **Stripe Tax** via the standalone **Tax Calculations API** (`/v1/tax/calculations`), with `shipping_cost`, `tax_behavior: inclusive|exclusive`, product `tax_code`, then a **Tax Transaction** recorded after payment (<https://docs.stripe.com/tax/custom>)
- Stripe returns **zero tax where the merchant has no registration** (same page), which the admin docs must explain.
- Store `taxCode` on products.

**Effort:** M.

### 5. Orders & fulfilment states — P0 · M

**What Payload provides:** an Orders collection with `items`, `shippingAddress`, `customer`, `customerEmail`, `transactions`, `amount`, `currency` and `status ∈ {processing, completed, cancelled, refunded}`. It has **no fulfilment, tracking or carrier fields** (<https://github.com/payloadcms/payload/blob/main/packages/plugin-ecommerce/src/collections/orders/createOrdersCollection.ts>).

**What we must build:**
- A separate `fulfilmentStatus` (`unfulfilled → packed → shipped → delivered → returned`), `trackingNumber`, `carrier`, `trackingUrl`, `shippedAt`, internal notes and a timeline/audit array, all via `ordersCollectionOverride`.
- Admin list views (filters, "to ship today"), packing-slip print view, and a "Mark shipped" action that sends the shipping email (#8).
- Partial refunds through Stripe that set `refunded` or partial state.

**Effort:** M.

### 6. Webhooks, reconciliation, refunds — P0 · M

**What Payload provides:**
- Webhooks are optional and "not used for core functionality"; you can map event types to handlers.
- Without DB transactions "a crash can leave a transaction stuck in `processing` … reconcile manually" (<https://payloadcms.com/docs/ecommerce/payments>).

**What we must build:**
- Handlers for `payment_intent.succeeded` (finalise the order server-side when the browser never called `confirm-order`), `payment_intent.payment_failed`, `charge.refunded` and `charge.dispute.created`.
- A reconciliation **job** that sweeps stale `processing` transactions. It runs via Vercel Cron → `/api/payload-jobs/run` (<https://payloadcms.com/docs/jobs-queue/queues>); note Hobby cron runs only once a day (<https://vercel.com/docs/cron-jobs/usage-and-pricing>).
- Webhook signature verification and idempotency keys.

**Effort:** M.

### 7. Inventory — P0 · S

**What Payload provides:**
- An inventory field (default `inventory`) that "decrements when an order is placed", with no reservations (<https://payloadcms.com/docs/ecommerce/plugin>).
- Open bugs:
  - `inventory.fieldName` is ignored (<https://github.com/payloadcms/payload/issues/18288>)
  - inventory defaults to 0, so untracked products can't be bought (<https://github.com/payloadcms/payload/issues/19616>; fix PR open: <https://github.com/payloadcms/payload/pull/19715>)
  - the stock `$inc` leaves versions stale (<https://github.com/payloadcms/payload/issues/16503>)

**What we must build:**
- A `trackInventory` toggle per product/variant, low-stock admin badge, sold-out state in the buy box, and "back in stock" capture (#23).
- **Soft reservation** during checkout (cart-hold TTL) is P1 and aimed at drops, so a 200-unit launch doesn't oversell.

**Effort:** S (P0 part), M with reservations.

### 8. Transactional email — P0 · M

**What Payload provides:**
- `@payloadcms/email-resend` (recommended for serverless/Vercel) and `@payloadcms/email-nodemailer`.
- Built-in sends cover only auth mails (verify / forgot password); custom mail uses `payload.sendEmail` (<https://payloadcms.com/docs/email/overview>).
- No order emails in the plugin docs (<https://payloadcms.com/docs/ecommerce/advanced>).
- The ecommerce *template* sends a guest confirmation email (<https://github.com/payloadcms/payload/tree/main/templates/ecommerce>).

**What we must build:**
- React Email templates themed from the `Theme` global:
  - magic-link sign-in
  - order confirmation (with guest lookup link)
  - shipped (with tracking)
  - refund issued
  - waitlist / launch / back in stock
  - abandoned cart
  - admin "new order" notification
- Sends are queued as jobs with retries. Resend is the default; SMTP is the fallback. Sender-domain setup goes in the README.

**Effort:** M.

### 9. Auth: Google OAuth + email magic link, no passwords — P0 · L

**What Payload provides:**
- `disableLocalStrategy` and custom `strategies` on auth collections. A strategy's `authenticate({ headers, payload, req, canSetHeaders })` returns `{ user, responseHeaders? }` (<https://payloadcms.com/docs/authentication/overview>, <https://payloadcms.com/docs/authentication/custom-strategies>).
- **No built-in OAuth, social login or magic link.** SSO is an Enterprise feature; the maintainer pointed users to "an official enterprise SSO plugin" (<https://github.com/payloadcms/payload/discussions/1555>).
- The passwordless discussion was "closed as complete" with a pointer to custom strategies (<https://github.com/payloadcms/payload/discussions/751>).
- The request for a Local API "log user in without password" has **no maintainer response** since 2023. Community workarounds sign JWTs themselves; a 2026 reply notes newer helpers `addSessionToUser`, `getFieldsToSign`, `jwtSign` (<https://github.com/payloadcms/payload/discussions/2895>).
- Another thread suggests `generatePayloadCookie` for custom OAuth handlers (<https://github.com/payloadcms/payload/discussions/16564>).
- v4 betas change auth: refresh tokens (breaking), session fields, cookie prefix (<https://github.com/payloadcms/payload/releases>). Whatever we build must isolate those internals.

**Community options** (versions per `npm view`, 2026-11-19):

| Package | What it does | Fits our need? |
|---|---|---|
| `payload-oauth2` 1.0.21, peer `payload ^3` | generic OAuth2, tested with Google/Zitadel/Apple (<https://github.com/WilsonLe/payload-oauth2>) | Google only, no magic link |
| `payload-auth-plugin` 0.7.13 | OAuth/OIDC/passkeys, 311★ (<https://github.com/authsmith/payload-auth-plugin>) | magic link not documented on the repo page |
| `payload-authjs` 0.10.2 | Auth.js v5 bridge, beta; Auth.js now under Better Auth so a stable v5 is uncertain (<https://github.com/CrawlerCode/payload-authjs>) | depends on Auth.js future |

**What we must build (recommendation): our own small, auditable `auth-passwordless` module.**
- **Magic link**
  - Collection `login-tokens`: SHA-256 hashed token, `email`, `expiresAt` (15 min), `usedAt`, `ip`, `ua`, `redirect`.
  - `POST /api/auth/magic-link`: always replies 200 (no account enumeration), is rate-limited, and sends the email.
  - `GET /api/auth/magic-link/verify`: single use, then find-or-create user, issue the Payload session cookie, redirect.
- **Google**
  - OIDC Authorization Code + PKCE, `state`/`nonce` in a signed short-lived cookie.
  - Verify the ID token (`aud`, `iss`, `email_verified`).
  - Link by verified email and store `googleSub`.
- **Collections**
  - `users` (admins) and `customers` both get `disableLocalStrategy: true` plus our strategy. Admin sign-in is allowed only for emails in an `ADMIN_EMAILS` allow-list or with `role=admin`.
  - Custom admin login view: "Continue with Google" / "Email me a link".
- **Dev escape hatch:** `AUTH_DEV_LOGIN=1`, allowed only when `NODE_ENV !== 'production'`, prints the magic link to the console.
- After login, call the ecommerce `onLogin()` to merge guest carts (<https://payloadcms.com/docs/ecommerce/frontend>).
- Upstream path: Part 2, U5/U6.

**Effort:** L.

### 10. Guest checkout & order lookup — P0 · S

**What Payload provides:**
- Guest carts (`allowGuestCarts`, default `true`) with a cart secret (<https://payloadcms.com/docs/ecommerce/plugin>, <https://payloadcms.com/docs/ecommerce/frontend>).
- `initiatePayment` and `confirmOrder` accept `customerEmail`.
- The template adds an order `accessToken` and a `/find-order` page keyed by email + order ID (<https://github.com/payloadcms/payload/tree/main/templates/ecommerce>).
- A past template bug blocked guests from the cart and checkout (closed, <https://github.com/payloadcms/payload/issues/14645>).

**What we must build:**
- Port the template's guest-token pattern.
- After a guest purchase, offer "Create account": a magic link to the same email that claims past orders.

**Effort:** S.

### 11. Vercel one-click deploy (Neon + Blob + env provisioning) — P0 · M

**What Vercel/Payload provide:**
- The Deploy Button `stores` param accepts `{type:"blob", access, envVarPrefix}` and `{type:"integration", integrationSlug, productSlug, protocol}` (<https://vercel.com/docs/deploy-button/source>).
- Payload's `with-vercel-website` template already ships a button with `build-command=pnpm run ci`, `stores=[{type:"integration",productSlug:"neon"},{type:"blob"}]` and `env=PAYLOAD_SECRET,CRON_SECRET,PREVIEW_SECRET` (<https://github.com/payloadcms/payload/tree/main/templates/with-vercel-website>).
- The Vercel-managed Neon integration injects `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `PG*` and legacy `POSTGRES_*` variables, and can create a **Neon branch per preview deployment** (<https://neon.com/docs/guides/vercel-managed-integration>).
- The ecommerce RFC says the Payload team "will not commit to support Vercel and Cloudflare 1-click templates" during beta (<https://github.com/payloadcms/payload/discussions/14239>), so **this is ours to build**.

**What we must build:**
- A README button with Neon + Blob stores and `env=PAYLOAD_SECRET,CRON_SECRET,PREVIEW_SECRET,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_WEBHOOK_SECRET,RESEND_API_KEY,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,ADMIN_EMAILS` plus `envDescription` / `envLink`.
- DB URL resolution order: `DATABASE_URI` → `DATABASE_URL` → `POSTGRES_URL`.
- Blob enabled only if `BLOB_READ_WRITE_TOKEN` is set.
- A **first-run setup wizard** at `/admin` (no users yet): claim the admin email, seed demo content, run the Stripe webhook-endpoint creation through the API, register the Apple Pay domain, and show a checklist of missing env vars.
- A `vercel.json` cron entry for jobs.

**Effort:** M.

### 12. Migrations strategy on Vercel — P0 · S

**What Payload provides:**
- Recommended: `"ci": "payload migrate && pnpm build"` as the Vercel build command, so failed migrations reject the deploy.
- `prodMigrations` (run at startup) "may slow down serverless cold starts … only for long-running servers".
- Don't mix dev `push` with migrations (<https://payloadcms.com/docs/database/migrations>).
- Community pain: builds hanging on the "you've run Payload in dev mode" prompt when the dev DB was used (<https://github.com/payloadcms/payload/discussions/11980>).

**What we must build:**
- Commit migrations. Use the `ci` script with migrations running on `DATABASE_URL_UNPOOLED`.
- Preview deploys migrate their own Neon branch, never prod.
- A CI check that fails if the schema changed without a migration (`payload migrate:create --skip-empty` dry run).
- Docs: "never point `pnpm dev` at production".

**Effort:** S.

### 13. Legal pages + checkout consent — P0 · S

**What Payload provides:** pages and blocks. No legal templates.

**What we must build:**
- Seeded **Privacy, Terms, Refund/Returns, Shipping, Imprint** pages (clearly marked placeholder text, "consult a lawyer").
- A `LegalSettings` global linking them, so the footer, checkout and emails reference the same pages.
- A checkout "I agree to Terms" checkbox, stored with a timestamp on the order.

**Effort:** S.

### 14. Security & rate limiting — P0 · M

**What Payload/Vercel provide:**
- Payload access control, and the plugin's required access functions (`isAdmin`, `isDocumentOwner`, …) (<https://payloadcms.com/docs/ecommerce/plugin>).
- Vercel **WAF rate limiting is available on all plans**: Hobby gets 1 rule per project, fixed window, keyed by IP/JA4. An SDK covers custom keys (<https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting>).

**What we must build:**
- App-level limits, stored in Postgres to avoid an extra service:
  - per-email and per-IP limits on magic-link requests, waitlist sign-ups and `initiatePayment`
  - one WAF rule documented for `/api/*`
- Plus:
  - CSP and security headers
  - CSRF / same-site cookies
  - webhook signature checks
  - `ADMIN_EMAILS` allow-list
  - `PAYLOAD_SECRET` length check at boot
  - dependency audit in CI

**Effort:** M.

---

## P1 — premium template expectations

### 15. SEO — P1 · M

**What Payload provides:** plugin-seo adds `meta.title/description/image`, generators and a SERP preview. It does **not** generate sitemaps, OG images or JSON-LD (<https://payloadcms.com/docs/plugins/seo>). There is also an open plugin-seo 3.90 auto-generate 403 regression (<https://github.com/payloadcms/payload/issues/18311>). The redirects plugin stores redirects, and the frontend must apply them (<https://payloadcms.com/docs/plugins/redirects>).

**What we must build:**
- `app/sitemap.ts` and `robots.ts`.
- Generated OG images via `opengraph-image.tsx` + `next/og` `ImageResponse` that use theme fonts and colours (<https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image>).
- **Product JSON-LD** with `offers` (price, currency, availability) and `aggregateRating` only when backed by reviews (<https://developers.google.com/search/docs/appearance/structured-data/product-snippet>). Merchant-listing fields: return policy and shipping details from #3 / #13.
- `Organization` and `FAQPage` markup, plus redirects middleware.

**Effort:** M.

### 16. Analytics — P1 · S

**What Vercel provides:**
- **Speed Insights** is on all plans, free tier with the Real Experience Score; Plus unlocks all Core Web Vitals (<https://vercel.com/docs/speed-insights>).
- **Web Analytics custom events** (`track()` client and server) need **Pro/Enterprise** (<https://vercel.com/docs/analytics/custom-events>).

**What we must build:**
- `<Analytics/>` and `<SpeedInsights/>` in the root layout.
- A typed `track()` wrapper that is a no-op on Hobby, with a funnel: `view_product → add_to_cart → begin_checkout → purchase` (purchase tracked server-side in the webhook).
- An optional GA4/Meta pixel slot, loaded only after cookie consent (#21).

**Effort:** S.

### 17. Multi-theme & build mode — P1 · L

**What Payload provides:**
- **Live Preview**: an iframe in admin, `postMessage` updates, breakpoints, and a `url` function (<https://payloadcms.com/docs/live-preview/overview>).
- **Click-to-edit / visual editing is not in OSS core.** The Vercel Content Link integration is **enterprise-only** and needs `@payloadcms/plugin-csm` with a sales API key (<https://payloadcms.com/docs/integrations/vercel-visual-editing>). The community asked for "Click to edit in Live preview" (<https://github.com/payloadcms/payload/discussions/7916>).

**What we must build:**
- `Theme` global: preset select (Sabi Cream, Midnight, Stone, Sage, …), token overrides (palette, radius, font pairs, density, button style, motion level) → CSS variables at `:root`.
- Theme preview inside Live Preview.
- Storefront "Build mode" toolbar for logged-in admins: draft toggle, "Edit this section" deep links into `/admin/collections/pages/:id#field-layout.N`, and a section outline.
- A home-grown click-to-edit: `data-payload-path` attributes plus a `postMessage` to an admin custom component that focuses the field. This is the community approach in #7916; see Part 2, U9.

**Effort:** L.

### 18. Preview / drafts / scheduled publish — P1 · S

**What Payload provides:** drafts, autosave and `schedulePublish` (which requires jobs to be running) (<https://payloadcms.com/docs/versions/drafts>).

**What we must build:**
- Next.js draft mode route guarded by `PREVIEW_SECRET`.
- `revalidateTag` on publish.
- Schedule jobs via Vercel Cron. Document the Hobby once-per-day precision (<https://vercel.com/docs/cron-jobs/usage-and-pricing>).

**Effort:** S.

### 19. Image & media optimisation — P1 · S

**What Payload provides:** the Vercel Blob adapter (`clientUploads`, `cacheControlMaxAge`, `addRandomSuffix`). It notes the 4.5 MB server-upload limit (<https://payloadcms.com/docs/upload/storage-adapters>). Known issues: <https://github.com/payloadcms/payload/issues/17823>, <https://github.com/payloadcms/payload/issues/19482>, and closed 0-byte WebP bug <https://github.com/payloadcms/payload/issues/18333>. The template image `sizes` bug is <https://github.com/payloadcms/payload/issues/16751>.

**What we must build:**
- `next/image` with Blob `remotePatterns`, correct `sizes`, AVIF/WebP.
- Blur placeholders generated at upload.
- Focal point usage.
- Video posters.
- Upload-size warnings per block.

**Effort:** S.

### 20. Discounts / coupons — P1 · M

**What Payload provides:** nothing. Discount codes and gift cards are RFC ideas (<https://github.com/payloadcms/payload/discussions/14239>).

**What we must build:**
- A `discounts` collection: code or automatic, % / fixed / free-shipping, min subtotal, starts/ends, usage limits (global and per customer), first-order only.
- Applied server-side in the #2 pipeline and recorded on the order.
- A URL-param auto-apply (`?code=LAUNCH10`) for drop campaigns.

**Effort:** M.

### 21. Cookie consent — P1 · S

**What Payload provides:** nothing.

**What we must build:**
- A minimal theme-aware banner, with categories (necessary / analytics / marketing) stored in a cookie.
- A `ConsentGate` wrapper for third-party scripts.
- Copy in a `ConsentSettings` global.
- Vercel Analytics is cookieless, but anything else is gated.

**Effort:** S.

### 22. Reviews — P1 · M

**What Payload provides:** nothing. The maintainer said reviews "should 100% be an external thing, at least for now" (<https://github.com/payloadcms/payload/discussions/14239>).

**What we must build:**
- A `reviews` collection: rating, title, body, media, `verifiedPurchase` derived from orders, moderation status.
- A post-delivery review-request email job.
- Aggregates cached on the product.
- Feeds the Proof Wall block and JSON-LD.

**Effort:** M.

### 23. Abandoned cart & back-in-stock — P1 · M

**What Payload provides:** carts in the DB and a jobs queue.

**What we must build:**
- Capture the email early in checkout, with consent.
- A job finds carts idle for more than N hours that have an email and no order, and sends a reminder (optionally with a discount from #20).
- Back-in-stock and waitlist notifications triggered by inventory hooks.
- On Hobby, cron runs daily only, so document the latency.

**Effort:** M.

### 24. Backups & export — P1 · S

**What's available:**
- Neon **instant restore / PITR** for root branches within the plan's history window (<https://neon.com/docs/introduction/branch-restore>).
- Payload **import-export plugin**: CSV/JSON export and import via the jobs queue (<https://payloadcms.com/docs/plugins/import-export>).

**What we must build:**
- Documentation for the restore drill.
- A weekly cron job that exports orders/customers as JSON into a **private** Blob store.
- An "Export orders CSV" admin button.

**Effort:** S.

### 25. Tests & CI — P1 · M

**What Payload provides:** the ecommerce template has e2e tests, reported as failing (<https://github.com/payloadcms/payload/issues/14708>).

**What we must build:**
- GitHub Actions running lint, typecheck, `pnpm build` against a Postgres service, and migration drift check.
- Vitest for totals/discount/tax/shipping math.
- Playwright on a seeded DB covering add-to-cart → Stripe test card checkout → order → webhook replay (Stripe CLI), magic-link login (dev mailbox), and build-mode smoke tests.
- Lighthouse CI budget on the home page.

**Effort:** M.

---

## P2 — later

### 26. Multi-currency — P2 · S

**What Payload provides:** `supportedCurrencies` (USD/EUR/GBP built in) adds a price field per currency. Enabling one may need a migration, and the gateway must support it (<https://payloadcms.com/docs/ecommerce/plugin>). The template is USD-only by default (<https://github.com/payloadcms/payload/tree/main/templates/ecommerce>).

**What we must build:**
- A currency switcher, plus geo default via Vercel's `x-vercel-ip-country` header.
- Per-currency shipping rates and tax behaviour.
- Use explicit prices; Stripe Adaptive Pricing is Checkout-Sessions-only (<https://docs.stripe.com/payments/payment-element>).

**Effort:** S.

### 27. i18n / localisation — P2 · M

**What Payload provides:**
- Content localisation with `locales`, `defaultLocale`, fallback and `localized: true` per field.
- Toggling `localized` on existing fields loses data; per-locale publish status is experimental (<https://payloadcms.com/docs/configuration/localization>).
- Plugin i18n bug: user overrides are overwritten (<https://github.com/payloadcms/payload/issues/16502>).

**What we must build:**
- `[locale]` routing, `hreflang`, a localised email set and localised legal pages.
- **Decide at v1 which fields are `localized`, to avoid a later data migration.**

**Effort:** M.

### 28. Search — P2 · S

**What Payload provides:** plugin-search syncs a `search` collection in your own DB, with priority ordering and no external engine (<https://payloadcms.com/docs/plugins/search>). A Postgres search bug exists in the template (<https://github.com/payloadcms/payload/issues/16314>).

**What we must build:** a command-palette search over pages, FAQs and product (small catalogue), opened from the mobile dock's Search button.

**Effort:** S.

### 29. Subscriptions — P2 · L

**What Payload provides:** nothing in the ecommerce plugin; it is "arguably one of the more important patterns" in the RFC (<https://github.com/payloadcms/payload/discussions/14239>). `@payloadcms/plugin-stripe` can sync collections to Stripe and handle webhooks such as `customer.subscription.updated` (<https://payloadcms.com/docs/plugins/stripe>).

**What we must build:**
- Stripe Billing subscriptions for refills/consumables, with customer-portal links in the account area.
- Likely via a Checkout Sessions adapter (U3).

**Effort:** L.

---

# PART 2 — Contribute upstream to Payload

These are gaps where a fix **in Payload or its ecosystem** would make our template simpler *and* help everyone building commerce on Payload.

**Ground rules:**
- Open an issue or RFC comment first, linking the evidence below.
- Ship as a standalone package when core isn't ready.
- Keep PRs small: a community thread from 2026 notes slow review of outside PRs, and maintainers replied they "highly value community contributions" and remain committed to reviewing them (<https://github.com/payloadcms/payload/discussions/17055>).

🧩 = we can ship it **as a standalone plugin/package first**, then propose upstreaming.

## Summary

| ID | Gap | Shape | Standalone first? |
|---|---|---|---|
| U1 | Server-side pricing/adjustment hooks in plugin-ecommerce | PR to `plugin-ecommerce` (review/advance #16313) | — (core) |
| U2 | Shipping & tax adapter interfaces + Stripe Tax adapter | plugin-ecommerce adapters | 🧩 |
| U3 | Stripe **Checkout Sessions** / Express Checkout adapter | new `PaymentAdapter` | 🧩 |
| U4 | Discounts / gift cards collection | plugin-ecommerce feature | 🧩 |
| U5 | Official `payload.login`-without-password / session-issuing Local API | PR to core auth | — (core) |
| U6 | Passwordless (magic link) + OIDC (Google) auth strategies | `@payloadcms/plugin-auth-*` | 🧩 |
| U7 | Order lifecycle: fulfilment fields, order emails, inventory reservations | plugin-ecommerce | 🧩 (partly) |
| U8 | Vercel-native deploy: Deploy Button for ecommerce template, migrations-on-build defaults, Blob `clientUploads` fixes | templates + storage adapter PRs | — |
| U9 | Open-source click-to-edit for Live Preview | admin + `@payloadcms/live-preview-react` | 🧩 |
| U10 | Theme-able templates (design tokens global) | template/plugin | 🧩 |
| U11 | Correctness fixes already filed against plugin-ecommerce | small PRs | — |

---

### U1. Pricing / adjustment hooks in plugin-ecommerce

- **Gap:** the Stripe adapter charges `cart.subtotal`, and nothing lets you add shipping, tax or discounts (<https://github.com/payloadcms/payload/issues/15784>). The client-amount PR was rejected for trusting the client, and the maintainer wants a hooks pattern (<https://github.com/payloadcms/payload/pull/15954>).
- **Evidence:**
  - Open PR **#16313 "add support for payment hooks"**: a three-hook pipeline for "taxes, shipping, discounts, gift cards" (<https://github.com/payloadcms/payload/pull/16313>)
  - RFC item "pricing calculation hook" (<https://github.com/payloadcms/payload/discussions/14239>)
- **Why it helps us:** removes our forked adapter (Part 1 #2), and shipping, tax and discounts become plug-ins.
- **Why it helps the community:** every real store needs it; it is the #1 blocker in the RFC comments.
- **Contribution shape:**
  - review and test #16313 against Postgres
  - add adapter-agnostic `beforeInitiatePayment` / `calculateTotals` hooks plus a persisted `adjustments` array on transactions/orders
  - docs and tests
  - **Core PR.**

### U2. Shipping & tax adapter interfaces (+ Stripe Tax adapter) 🧩

- **Gap:** "Shipping, taxes … implement yourself" (<https://payloadcms.com/docs/ecommerce/overview>). The RFC proposes a "shipping adapter for third-party services" and Stripe Tax for taxes (<https://github.com/payloadcms/payload/discussions/14239>).
- **Why it helps us:** Part 1 #3/#4 become config instead of code.
- **Why it helps the community:** a standard interface lets others publish EasyPost, Shippo or TaxJar adapters.
- **Contribution shape:**
  - `ShippingAdapter { getRates(cart, address) }` and `TaxAdapter { calculate(cart, address, shipping), commit(order) }` built on U1
  - first implementations: `flatRateShipping` (zones) and `stripeTax` (Tax Calculations + Transactions API, <https://docs.stripe.com/tax/custom>)
- **Standalone first** as `@solana/payload-ecommerce-shipping` and `-stripe-tax` packages, then propose upstream.

### U3. Stripe Checkout Sessions / Express Checkout adapter 🧩

- **Gap:** the only adapter is PaymentIntents-based (<https://payloadcms.com/docs/ecommerce/payments>). Stripe now recommends Checkout Sessions with the Payment Element, which brings built-in tax, discounts, shipping, subscriptions and Adaptive Pricing (<https://docs.stripe.com/payments/payment-element>).
- **Evidence:** the RFC community asks for "Stripe Checkout shipping rates" and subscriptions (<https://github.com/payloadcms/payload/discussions/14239>).
- **Why it helps us and the community:** a one-product brand gets tax, shipping, promo codes and subscriptions from Stripe with almost no custom code.
- **Contribution shape:**
  - a new `stripeCheckoutAdapter()` implementing `PaymentAdapter` with `ui_mode: 'elements'` or hosted mode
  - order finalisation from `checkout.session.completed`
  - client adapter for the Express Checkout Element
- **Standalone package first.**

### U4. Discounts & gift cards 🧩

- **Gap / evidence:** discount codes, gift cards and bundles are RFC candidates with no timeline (<https://github.com/payloadcms/payload/discussions/14239>).
- **Shape:** a `createDiscountsCollection()` in the plugin's style (code/automatic, %, fixed, free shipping, limits) that plugs into U1. **Standalone first.**

### U5. Session-issuing Local API (login without password)

- **Gap:** there is no supported way for custom endpoints (OAuth callback, magic-link verify) to create a Payload session.
  - Feature request #2895 (2023, 24 upvotes) has no maintainer reply; workarounds hand-roll JWT signing, and later replies mention `addSessionToUser`, `getFieldsToSign`, `jwtSign` (<https://github.com/payloadcms/payload/discussions/2895>).
  - Same question in 2026 (<https://github.com/payloadcms/payload/discussions/16564>).
  - Custom-strategy docs don't cover setting cookies or sessions (<https://payloadcms.com/docs/authentication/custom-strategies>).
  - v4 betas are changing sessions and refresh tokens (<https://github.com/payloadcms/payload/releases>), so hand-rolled code will break.
- **Why it helps us:** Part 1 #9 stops depending on internals.
- **Why it helps the community:** every OAuth/SSO/magic-link plugin needs exactly this.
- **Contribution shape:** a **core PR** adding `payload.auth.createSession({ collection, user, req })`, which returns `{ token, cookie, exp }` and respects `useSessions`, refresh tokens and the cookie prefix. Docs and tests too. Target v4, with a backport to v3.

### U6. First-party passwordless + OIDC auth plugins 🧩

- **Gap:**
  - Core has no OAuth, social login or magic link (<https://payloadcms.com/docs/authentication/overview>).
  - Passwordless was closed as "complete" by pointing to custom strategies (<https://github.com/payloadcms/payload/discussions/751>).
  - OIDC/SSO is pushed to the Enterprise SSO plugin (<https://github.com/payloadcms/payload/discussions/1555>).
  - The community fills the gap with several plugins of varied scope and maintenance (<https://github.com/WilsonLe/payload-oauth2>, <https://github.com/authsmith/payload-auth-plugin>, <https://github.com/CrawlerCode/payload-authjs>).
  - Payload already ships an OAuth **server** in the MCP plugin (v4 beta.8, <https://github.com/payloadcms/payload/releases>), so the primitives are there.
- **Why it helps us and the community:** passwordless + Google is the default for modern DTC stores and SaaS admins, and needs no password-reset support load.
- **Contribution shape:** `payload-plugin-passwordless`, containing:
  - a magic-link strategy: hashed single-use tokens, rate limiting, email template hook
  - a generic OIDC strategy (Google preset, PKCE, account linking by verified email)
  - an admin login view override
  - an option to fully hide password UI
- Built on U5. **Ship standalone from our repo first, battle-test in solana, then offer upstream** or keep it as a well-maintained community plugin.

### U7. Order lifecycle: fulfilment, emails, reservations 🧩 (partly)

- **Gap:**
  - The orders `status` has only `processing | completed | cancelled | refunded`, with no fulfilment or tracking fields (<https://github.com/payloadcms/payload/blob/main/packages/plugin-ecommerce/src/collections/orders/createOrdersCollection.ts>).
  - The docs mention no order emails (<https://payloadcms.com/docs/ecommerce/advanced>, <https://payloadcms.com/docs/email/overview>).
  - Inventory has no reservations and decrements at order (<https://payloadcms.com/docs/ecommerce/plugin>).
- **Shape:**
  - **Core PR:** an optional `fulfillment` group (status, carrier, tracking, shippedAt) behind a flag.
  - **Core PR:** `orders.emails` hooks (`onOrderCreated`, `onFulfilled`, `onRefunded`) that call `payload.sendEmail`.
  - **Standalone:** an `inventoryReservations` collection with TTL and a cleanup job.

### U8. Vercel-native deploy improvements

- **Gap / evidence:**
  - The ecommerce team won't commit to Vercel 1-click templates during beta (<https://github.com/payloadcms/payload/discussions/14239>), though the website template already has a Neon + Blob button (<https://github.com/payloadcms/payload/tree/main/templates/with-vercel-website>).
  - Migration confusion on Vercel (<https://github.com/payloadcms/payload/discussions/11980>).
  - Blob `clientUploads` bugs (<https://github.com/payloadcms/payload/issues/17823>, <https://github.com/payloadcms/payload/issues/19482>).
  - Neon preview branching exists but templates don't document it (<https://neon.com/docs/guides/vercel-managed-integration>).
- **Shape (PRs):**
  1. a Deploy Button + `ci` build script for `templates/ecommerce`, mirroring with-vercel-website
  2. a docs page "Payload on Vercel: Neon preview branches + migrations on build" (`DATABASE_URL_UNPOOLED` for migrations)
  3. fixes for #17823 / #19482 in `@payloadcms/storage-vercel-blob`
  4. env-var fallback (`DATABASE_URL` / `POSTGRES_URL`) in `db-vercel-postgres` docs

### U9. Open-source click-to-edit for Live Preview 🧩

- **Gap:** Live Preview has no click-to-edit (<https://payloadcms.com/docs/live-preview/overview>). Vercel Content Link is enterprise-only (<https://payloadcms.com/docs/integrations/vercel-visual-editing>). The request "Add a 'Click to edit' feature in Live preview" has community +1s and a described `data-*`/`postMessage` approach (<https://github.com/payloadcms/payload/discussions/7916>).
- **Why it helps us:** this *is* our "build mode" (Part 1 #17).
- **Shape:** a tiny frontend helper (`editAttrs(path)` → `data-payload-field`) plus an admin custom component listening for `postMessage` to focus or scroll to the field. Ship as `payload-plugin-click-to-edit`, then propose it to `@payloadcms/live-preview-react` while respecting that Payload sells an enterprise visual editor. **Standalone first.**

### U10. Theme-able templates (design-token global) 🧩

- **Gap:** Payload templates have no theme presets. Our `Theme` global (presets → CSS variables, consumed by Tailwind v4 `@theme`) is generic. The evidence here is weak: no specific upstream issue was found. Only a discussion titled "Improvement Ideas For Payload Web Template" surfaced (<https://github.com/payloadcms/payload/discussions/18706>, title only via the GitHub API).
- **Shape:** `payload-plugin-design-tokens` (global, admin colour/radius/font pickers, live preview, CSS-variable emitter). Offer it as an *example* to the website/ecommerce templates. **Standalone.**

### U11. Correctness fixes in plugin-ecommerce (low-hanging, high-value)

Review, test and push these existing community PRs (or write fixes) for bugs we will hit in production:

| Issue | Fix PR |
|---|---|
| Variant cart items skip stock/price validation (<https://github.com/payloadcms/payload/issues/17866>, <https://github.com/payloadcms/payload/issues/18339>) | <https://github.com/payloadcms/payload/pull/17868>, <https://github.com/payloadcms/payload/pull/18347> |
| `inventory.fieldName` ignored (<https://github.com/payloadcms/payload/issues/18288>) | <https://github.com/payloadcms/payload/pull/18290> |
| Untracked inventory defaults to 0 (<https://github.com/payloadcms/payload/issues/19616>) | <https://github.com/payloadcms/payload/pull/19715> |
| Stripe metadata limit (<https://github.com/payloadcms/payload/issues/19017>) | <https://github.com/payloadcms/payload/pull/19025>, <https://github.com/payloadcms/payload/pull/19665> |
| Non-customer users treated as customers (<https://github.com/payloadcms/payload/issues/16377>) | <https://github.com/payloadcms/payload/pull/18124> |

**Shape:** add tests reproducing each bug on Postgres, then comment results on the PRs.

---

## Suggested sequencing

1. **Sprint 1 (P0 core):** #12 migrations, #11 deploy button + setup wizard, #9 auth (magic link first, then Google), #8 email (magic link mail).
2. **Sprint 2 (money):** #1 checkout, #2 totals pipeline, #3 shipping, #4 Stripe Tax, #6 webhooks, #7 inventory, #10 guest checkout, #5 fulfilment, #13 legal, #14 security.
3. **Sprint 3 (premium):** #17 themes/build mode, #15 SEO, #16 analytics, #18 preview, #19 media, #20 discounts, #21 consent.
4. **Sprint 4:** #22 reviews, #23 abandoned cart, #24 backups, #25 CI hardening; P2 as demand dictates.
5. **Upstream in parallel:** U11 (cheap, immediate), then U1 + U5 (core enablers), then extract U6 / U2 / U9 from our code as standalone plugins.

---

## Sources

**Payload docs**
- Ecommerce overview: <https://payloadcms.com/docs/ecommerce/overview>
- Ecommerce plugin options: <https://payloadcms.com/docs/ecommerce/plugin>
- Ecommerce payments (Stripe adapter): <https://payloadcms.com/docs/ecommerce/payments>
- Ecommerce advanced: <https://payloadcms.com/docs/ecommerce/advanced>
- Ecommerce frontend: <https://payloadcms.com/docs/ecommerce/frontend>
- Authentication overview: <https://payloadcms.com/docs/authentication/overview>
- Custom strategies: <https://payloadcms.com/docs/authentication/custom-strategies>
- Email: <https://payloadcms.com/docs/email/overview>
- Storage adapters: <https://payloadcms.com/docs/upload/storage-adapters>
- Migrations: <https://payloadcms.com/docs/database/migrations>
- Jobs queue: <https://payloadcms.com/docs/jobs-queue/queues>
- Live Preview: <https://payloadcms.com/docs/live-preview/overview>
- Vercel Content Link (enterprise): <https://payloadcms.com/docs/integrations/vercel-visual-editing>
- Drafts: <https://payloadcms.com/docs/versions/drafts>
- Localization: <https://payloadcms.com/docs/configuration/localization>
- Plugins: SEO <https://payloadcms.com/docs/plugins/seo> · Search <https://payloadcms.com/docs/plugins/search> · Redirects <https://payloadcms.com/docs/plugins/redirects> · Import-export <https://payloadcms.com/docs/plugins/import-export> · Form builder <https://payloadcms.com/docs/plugins/form-builder> · Stripe <https://payloadcms.com/docs/plugins/stripe>

**Payload GitHub**
- Releases: <https://github.com/payloadcms/payload/releases>
- Ecommerce template: <https://github.com/payloadcms/payload/tree/main/templates/ecommerce>
- with-vercel-website template: <https://github.com/payloadcms/payload/tree/main/templates/with-vercel-website>
- Orders collection source: <https://github.com/payloadcms/payload/blob/main/packages/plugin-ecommerce/src/collections/orders/createOrdersCollection.ts>
- Discussions: [#14239](https://github.com/payloadcms/payload/discussions/14239) · [#2895](https://github.com/payloadcms/payload/discussions/2895) · [#751](https://github.com/payloadcms/payload/discussions/751) · [#1555](https://github.com/payloadcms/payload/discussions/1555) · [#16564](https://github.com/payloadcms/payload/discussions/16564) · [#11980](https://github.com/payloadcms/payload/discussions/11980) · [#7916](https://github.com/payloadcms/payload/discussions/7916) · [#17055](https://github.com/payloadcms/payload/discussions/17055) · [#18706](https://github.com/payloadcms/payload/discussions/18706)
- Issues: [#15784](https://github.com/payloadcms/payload/issues/15784) · [#15862](https://github.com/payloadcms/payload/issues/15862) · [#16377](https://github.com/payloadcms/payload/issues/16377) · [#16453](https://github.com/payloadcms/payload/issues/16453) · [#16502](https://github.com/payloadcms/payload/issues/16502) · [#16503](https://github.com/payloadcms/payload/issues/16503) · [#16314](https://github.com/payloadcms/payload/issues/16314) · [#16751](https://github.com/payloadcms/payload/issues/16751) · [#14645](https://github.com/payloadcms/payload/issues/14645) · [#14708](https://github.com/payloadcms/payload/issues/14708) · [#17823](https://github.com/payloadcms/payload/issues/17823) · [#17866](https://github.com/payloadcms/payload/issues/17866) · [#18288](https://github.com/payloadcms/payload/issues/18288) · [#18311](https://github.com/payloadcms/payload/issues/18311) · [#18333](https://github.com/payloadcms/payload/issues/18333) · [#18339](https://github.com/payloadcms/payload/issues/18339) · [#19017](https://github.com/payloadcms/payload/issues/19017) · [#19055](https://github.com/payloadcms/payload/issues/19055) · [#19482](https://github.com/payloadcms/payload/issues/19482) · [#19616](https://github.com/payloadcms/payload/issues/19616)
- PRs: [#15954](https://github.com/payloadcms/payload/pull/15954) · [#16313](https://github.com/payloadcms/payload/pull/16313) · [#17868](https://github.com/payloadcms/payload/pull/17868) · [#18124](https://github.com/payloadcms/payload/pull/18124) · [#18290](https://github.com/payloadcms/payload/pull/18290) · [#18347](https://github.com/payloadcms/payload/pull/18347) · [#19025](https://github.com/payloadcms/payload/pull/19025) · [#19665](https://github.com/payloadcms/payload/pull/19665) · [#19715](https://github.com/payloadcms/payload/pull/19715)

**Community auth plugins**
- <https://github.com/WilsonLe/payload-oauth2> (fork: <https://github.com/omnimaxxing/payload-oauth2>)
- <https://github.com/authsmith/payload-auth-plugin>
- <https://github.com/CrawlerCode/payload-authjs>
- Package versions and peer deps from `npm view` on 2026-11-19.

**Vercel / Neon**
- Deploy Button source params: <https://vercel.com/docs/deploy-button/source>
- Cron limits: <https://vercel.com/docs/cron-jobs/usage-and-pricing>
- WAF rate limiting: <https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting>
- Speed Insights: <https://vercel.com/docs/speed-insights>
- Web Analytics custom events: <https://vercel.com/docs/analytics/custom-events>
- Neon Vercel-managed integration: <https://neon.com/docs/guides/vercel-managed-integration>
- Neon instant restore: <https://neon.com/docs/introduction/branch-restore>

**Stripe / web standards**
- Payment Element: <https://docs.stripe.com/payments/payment-element>
- Express Checkout Element: <https://docs.stripe.com/elements/express-checkout-element>
- Stripe Tax standalone APIs: <https://docs.stripe.com/tax/custom>
- Next.js OG images: <https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image>
- Google Product structured data: <https://developers.google.com/search/docs/appearance/structured-data/product-snippet>
