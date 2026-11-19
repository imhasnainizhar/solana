# One-product storefront sections — proposals

> Status: **proposal** (nothing here is implemented yet). Written 2026-11-19 against Payload **3.94.0** (latest stable; v4 is at `4.0.0-beta.10`, per <https://github.com/payloadcms/payload/releases>).
> Scope: new Payload **blocks** for the `solana` storefront, aimed at premium **single-product** brands. The visual reference is sabi.com (big quiet type, warm cream surfaces, tall rounded media tiles, numbered "01 / 02 / 03" rows, press quotes, waitlist). We copy the *feel*, never their assets or copy.

These blocks extend the base set in the brief (Hero collage, Collection, Featured Product, Slideshow, Steps, Press, Newsletter/Waitlist, Rich text). Every block below:

- is a Payload `Block` in the `pages.layout` blocks field, so it works with Live Preview and drafts (<https://payloadcms.com/docs/live-preview/overview>, <https://payloadcms.com/docs/versions/drafts>);
- uses the theme's CSS variables (radius, palette, density) from the `Theme` global and has no hard-coded colours;
- shares one **`sectionSettings`** group (defined once below) so admins get the same controls everywhere;
- honours `prefers-reduced-motion`. All motion is progressive enhancement: the block has to read correctly with no JS and no animation. MDN says the same about scroll-driven animations (<https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations>).

## Shared conventions

### `sectionSettings` group (on every block)

```ts
// schema sketch, not final code
{ name: 'sectionSettings', type: 'group', fields: [
  { name: 'anchorId', type: 'text' },                       // for in-page nav / chapters
  { name: 'surface', type: 'select', options: ['cream','sand','stone','ink','transparent'] },
  { name: 'spacing', type: 'select', options: ['compact','default','airy'] },
  { name: 'width', type: 'select', options: ['contained','wide','full-bleed'] },
  { name: 'motion', type: 'select', options: ['inherit','subtle','none'] }, // overrides Theme.motion
  { name: 'hideOn', type: 'select', hasMany: true, options: ['mobile','desktop'] },
]}
```

### Product binding

Most blocks point at the store's hero product with `product: relationship → products` (the plugin's Products collection, <https://payloadcms.com/docs/ecommerce/plugin>). In a one-product store the block falls back to `SiteSettings.primaryProduct` when that field is empty, so admins rarely have to set it.

### Media

- Images go through `next/image` with explicit `sizes`. Video uses `<video playsinline muted loop preload="none">` with a poster frame.
- Large uploads (video, `.glb`, frame sequences) are stored in Vercel Blob. Vercel caps server uploads at **4.5 MB**, so the Blob adapter must enable `clientUploads: true` (<https://payloadcms.com/docs/upload/storage-adapters>). Known `clientUploads` bugs to watch: <https://github.com/payloadcms/payload/issues/17823>, <https://github.com/payloadcms/payload/issues/19482>.

### Analytics hooks

Each CTA can emit a Vercel Web Analytics custom event (`track('cta_click', { block, label })`). Custom events need a Pro or Enterprise plan (<https://vercel.com/docs/analytics/custom-events>), so `track` must stay a no-op when they are unavailable.

### Complexity / priority legend

- **S**: about 1 day. **M**: 2–4 days. **L**: 1–2 weeks (incl. admin UX, a11y, tests).
- **P0**: ship in v1. **P1**: fast follow. **P2**: later / optional.

---

## 1. Scroll Story (pinned product narrative)

- **Purpose / conversion goal:** turn the one product into a short film the visitor controls by scrolling. It works like a premium product launch page and should lift time-on-page and scroll depth to the buy CTA.
- **Layout & motion:** a full-viewport stage stays pinned (`position: sticky`) while 3–6 "beats" scroll past. Each beat swaps or cross-fades the stage media and reveals a short headline and body copy (large sans, sabi-style). Progress is shown as a hairline at the stage edge. Motion runs on CSS scroll-driven animations (`animation-timeline: view()`) where supported, with an IntersectionObserver fallback.
- **Payload fields:**
  ```ts
  { slug: 'scrollStory', fields: [
    product?, sectionSettings,
    { name: 'stageAspect', type: 'select', options: ['16:9','4:5','1:1','full'] },
    { name: 'beats', type: 'array', minRows: 2, maxRows: 8, fields: [
      { name: 'eyebrow', type: 'text' },            // "01"
      { name: 'headline', type: 'text', required: true },
      { name: 'body', type: 'textarea' },
      { name: 'media', type: 'upload', relationTo: 'media' }, // image or short video
      { name: 'align', type: 'select', options: ['left','right','center'] },
    ]},
    { name: 'cta', type: 'group', fields: [label, link /* or 'addToCart' */] },
  ]}
  ```
- **Mobile:** pinning is turned off. Beats stack as full-width cards with the media above the text, and only the progress hairline remains.
- **Performance / a11y:** only the first beat's media loads eagerly; the rest load lazily one beat ahead. Headlines are real `h2`/`h3` in DOM order. With reduced motion, beats render as a static list. No scroll-jacking: native scroll is never intercepted.
- **Complexity:** M. **Priority:** P0.

## 2. Frame-Sequence Scrubber ("the product turns as you scroll")

- **Purpose:** the Apple-style hero where the product rotates, opens or assembles as you scroll. It conveys craftsmanship without a 3D pipeline.
- **Layout & motion:** a pinned canvas draws frame *n* of an image sequence (60–180 WebP/AVIF frames) mapped to scroll progress. Optional caption chips fade in at configured frame ranges.
- **Payload fields:**
  ```ts
  { slug: 'frameSequence', fields: [
    sectionSettings,
    { name: 'frames', type: 'upload', relationTo: 'media', hasMany: true }, // ordered
    // OR a zip uploaded once and expanded by a job into Blob (see notes)
    { name: 'scrollLength', type: 'number', defaultValue: 300 }, // vh
    { name: 'captions', type: 'array', fields: [
      { name: 'fromFrame', type: 'number' }, { name: 'toFrame', type: 'number' },
      { name: 'text', type: 'text' }, { name: 'position', type: 'select', options: ['tl','tr','bl','br','center'] },
    ]},
    { name: 'poster', type: 'upload', relationTo: 'media', required: true },
    { name: 'fallbackVideo', type: 'upload', relationTo: 'media' },
  ]}
  ```
- **Mobile:** uses half the frames (every second one) at a smaller resolution, or plays `fallbackVideo` once in view.
- **Performance / a11y:** decode frames with `createImageBitmap` in a worker. Load progressively: keyframes first, then fill in. The canvas carries `role="img"` with an `aria-label` built from the captions. Reduced motion shows the poster only. The total weight budget is about 3 MB on mobile, enforced by an admin warning.
- **Complexity:** L (the frame pipeline and admin uploader are most of the work). **Priority:** P1.

## 3. 3D / 360° Viewer

- **Purpose:** let buyers inspect the object, which reduces "what does it really look like" returns. AR "view in your room" on supported phones.
- **Layout & motion:** a large rounded tile shows `<model-viewer>` (Google's Apache-2.0 web component for 3D and AR, <https://github.com/google/model-viewer>). Optional hotspots open small material notes. A colorway switcher swaps materials or variants. For brands without 3D assets, a 360° mode spins through 24–72 photos on drag.
- **Payload fields:**
  ```ts
  { slug: 'productViewer', fields: [
    product?, sectionSettings,
    { name: 'mode', type: 'radio', options: ['model3d','spin360'] },
    { name: 'model', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { in: ['model/gltf-binary'] } } },
    { name: 'iosModel', type: 'upload', relationTo: 'media' },   // .usdz for Quick Look
    { name: 'spinFrames', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'poster', type: 'upload', relationTo: 'media', required: true },
    { name: 'enableAR', type: 'checkbox' },
    { name: 'autoRotate', type: 'checkbox', defaultValue: true },
    { name: 'hotspots', type: 'array', fields: [
      { name: 'label', type: 'text' }, { name: 'body', type: 'textarea' },
      { name: 'position', type: 'text' },   // "x y z" for 3D, or "%x %y @frame" for 360
    ]},
  ]}
  ```
- **Mobile:** the poster shows first; the model loads only after tap-to-interact, which avoids accidental scroll capture. The AR button appears only when the device supports it.
- **Performance / a11y:** dynamic-import the web component (it is client-only) and load it only on interaction or once the tile is near the viewport. Draco/meshopt-compressed GLB under about 5 MB, stored in Blob (needs `clientUploads`, see above). Hotspots are focusable buttons. Provide `alt` text, and provide static image alternatives for screen-reader users.
- **Complexity:** M (3D), plus S for the 360 mode. **Priority:** P1.

## 4. Anatomy / Material Breakdown with Hotspots ("exploded view")

- **Purpose:** justify the premium price by showing what it is made of: layers, ingredients, components, sourcing.
- **Layout & motion:** a large still (or exploded render) carries numbered pins. Hovering or focusing a pin highlights a matching row in a side list ("01 Merino shell — 18.5µm, mulesing-free"). On scroll the exploded layers can drift apart slightly (CSS `translate` keyed to `view()`). An "Ingredients" variant shows a grid of ingredient cards with percentage bars.
- **Payload fields:**
  ```ts
  { slug: 'anatomy', fields: [
    product?, sectionSettings, heading, intro,
    { name: 'variant', type: 'select', options: ['hotspots','layers','ingredients'] },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'layers', type: 'array', fields: [ { name: 'image', type: 'upload', relationTo: 'media' }, { name: 'offset', type: 'number' } ] },
    { name: 'parts', type: 'array', fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'detail', type: 'textarea' },
      { name: 'x', type: 'number', min: 0, max: 100 }, { name: 'y', type: 'number', min: 0, max: 100 },
      { name: 'percent', type: 'number' },          // ingredients mode
      { name: 'icon', type: 'upload', relationTo: 'media' },
    ]},
  ]}
  ```
  Admin nicety: a custom field component that lets the admin click on the image to set `x`/`y`.
- **Mobile:** pins stay, but the list becomes a horizontal snap carousel under the image, and tapping a pin scrolls to its card.
- **Performance / a11y:** pins are `<button aria-describedby>` elements. The list is the real content and the pins are an enhancement, so the list is always in the DOM.
- **Complexity:** M. **Priority:** P0.

## 5. How It Works — numbered steps (sabi-style)

*(Extends the brief's base "Steps" block with media and a sticky layout.)*

- **Purpose:** explain the product or science in three calm steps; this is sabi's signature rhythm.
- **Layout & motion:** "01 / 02 / 03 — Step" rows. The left column stays sticky with a large numeral and title; the right column scrolls each step's media. Numerals count up and the hairline divider draws in.
- **Payload fields:** `steps[]: { number?, title, body (richText), media, caption }`, `layout: 'rows'|'sticky-split'|'cards'`, `showNumerals: checkbox`.
- **Mobile:** single column with numeral, title, media, then body.
- **Performance / a11y:** uses an ordered list (`<ol>`) so assistive tech announces the step count.
- **Complexity:** S. **Priority:** P0.

## 6. Sticky Buy Bar

- **Purpose:** keep the purchase one tap away during long storytelling pages. This is the highest-leverage conversion element for a one-product store.
- **Layout & motion:** once the primary Add-to-Cart scrolls out of view, a detached rounded pill slides up from the bottom (desktop: bottom centre). It shows a thumbnail, name, selected variant, price, and an Add / Buy now button. On mobile it sits above the dock. It hides again while the footer or the cart drawer is visible.
- **Payload fields:** this is mostly a **global** toggle in `SiteSettings.buyBar` (`enabled`, `showOn: pages[]`, `ctaMode: 'addToCart'|'buyNow'|'waitlist'`, `showExpressPay: checkbox`), plus an optional `buyBarOverride` block to change copy per page.
- **Behaviour:** variant selection is shared with the PDP state, using the cart via `useCart()` from the plugin's frontend utilities (<https://payloadcms.com/docs/ecommerce/frontend>). With `showExpressPay` on, the Stripe Express Checkout Element (Apple Pay / Google Pay / Link) renders inline (<https://docs.stripe.com/elements/express-checkout-element>). This depends on the checkout work in ROADMAP P0.
- **Mobile:** full-width bar merged with the bottom dock (the dock collapses to a compact state). It respects the `env(safe-area-inset-bottom)` inset.
- **Performance / a11y:** `role="region" aria-label="Purchase"`. Focus order is not changed. The bar does not cover focused elements (`scroll-padding-bottom`). Avoid layout shift by reserving the bar's height only while it is shown.
- **Complexity:** M. **Priority:** P0.

## 7. Colorway / Variant Theater

- **Purpose:** make choosing a variant feel like an experience, with full-bleed imagery per colorway. This drives attachment and fewer "wrong colour" returns.
- **Layout & motion:** a large hero image cross-fades (or uses a View Transitions API morph) when a swatch is picked. Swatches are large circles or material chips with names ("Oat", "Fog", "Ink"). The background tint follows the variant's accent colour. Stock state shows per swatch.
- **Payload fields:**
  ```ts
  { slug: 'variantTheater', fields: [
    product, sectionSettings, heading,
    { name: 'variantType', type: 'relationship', relationTo: 'variantTypes' }, // plugin collection
    { name: 'looks', type: 'array', fields: [
      { name: 'option', type: 'relationship', relationTo: 'variantOptions' },
      { name: 'swatch', type: 'upload', relationTo: 'media' },
      { name: 'swatchColor', type: 'text' },        // hex fallback
      { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
      { name: 'tint', type: 'text' },
      { name: 'story', type: 'textarea' },
    ]},
    { name: 'linkToBuy', type: 'checkbox', defaultValue: true }, // selecting sets PDP variant
  ]}
  ```
  It uses the plugin's variant types and options collections (<https://payloadcms.com/docs/ecommerce/plugin>).
- **Mobile:** the image becomes a swipe carousel and the swatches a sticky row under it.
- **Performance / a11y:** swatches form a `radiogroup` with names, never colour alone. Preload the next colorway's first image on hover or focus.
- **Complexity:** M. **Priority:** P0.

## 8. Before / After Slider

- **Purpose:** show the result (skin, hair, space, posture, sound) or "old way vs new way" in one gesture.
- **Layout & motion:** two aligned images with a draggable divider. Optional autoplay "wipe" when the block enters view (once only). Labels sit in the corners.
- **Payload fields:** `pairs[]: { before (upload), after (upload), beforeLabel, afterLabel, caption, disclaimer }`, `orientation: 'horizontal'|'vertical'`, `startPosition: number`.
- **Mobile:** vertical orientation is the default. The drag handle is at least 44×44 px, and multiple pairs swipe as a carousel.
- **Performance / a11y:** the divider is an `<input type="range">` styled over the images, which gives keyboard and screen-reader support for free. Reduced motion skips the autoplay wipe. Show a `disclaimer` for regulated claims (e.g. cosmetics).
- **Complexity:** S. **Priority:** P1.

## 9. Comparison — "vs alternatives / vs the old way"

- **Purpose:** handle the "why this and not X" objection directly with a confident, minimal table.
- **Layout & motion:** columns for **Us** (highlighted, raised card) and 1–3 alternatives ("Typical brand", "Doing nothing"). Rows are attributes using check, cross, or short text. An optional "cost over 2 years" row adds a small bar visual.
- **Payload fields:**
  ```ts
  { slug: 'comparison', fields: [
    sectionSettings, heading, intro,
    { name: 'columns', type: 'array', maxRows: 4, fields: [ { name: 'label', type: 'text' }, { name: 'isUs', type: 'checkbox' }, { name: 'image', type: 'upload', relationTo: 'media' } ] },
    { name: 'rows', type: 'array', fields: [
      { name: 'attribute', type: 'text' },
      { name: 'values', type: 'array', fields: [ { name: 'kind', type: 'select', options: ['yes','no','partial','text'] }, { name: 'text', type: 'text' } ] },
    ]},
    { name: 'footnote', type: 'richText' },
  ]}
  ```
- **Mobile:** the "Us" column stays pinned on the left and the other columns scroll horizontally; or, as a toggle, each alternative becomes an "Us vs X" card pair.
- **Performance / a11y:** a real `<table>` with `<th scope>`. Icons have text equivalents ("Yes", "No").
- **Complexity:** S. **Priority:** P1.

## 10. Spec Sheet

- **Purpose:** satisfy detail-oriented buyers (dimensions, weight, materials, battery, care, compliance) without cluttering the story.
- **Layout & motion:** a two-column definition list in groups ("Dimensions", "Materials", "Care"), with a downloadable PDF and an optional line-art dimension drawing. Groups beyond the first collapse into an accordion.
- **Payload fields:** `groups[]: { title, items[]: { label, value, unit? } }`, `drawing: upload`, `downloads[]: { label, file }`. It can also read from structured `product.specs` fields so the same data feeds JSON-LD `additionalProperty`.
- **Mobile:** one column, every group as an accordion.
- **Performance / a11y:** use `<dl>` semantics. Accordions use `<details>/<summary>` (no JS).
- **Complexity:** S. **Priority:** P0.

## 11. In the Box

- **Purpose:** set expectations and add perceived value (unboxing).
- **Layout & motion:** a flat-lay hero image with each item labelled, or a grid of item cards ("1× Aura One", "USB-C cable", "Travel pouch"). Items gently stagger in.
- **Payload fields:** `image: upload`, `items[]: { name, quantity, image, note }`, `layout: 'flatlay'|'grid'`.
- **Mobile:** a 2-column grid.
- **Performance / a11y:** a list with quantities in text.
- **Complexity:** S. **Priority:** P1.

## 12. Social-Proof Wall (reviews + UGC + press)

- **Purpose:** borrowed trust. For a single product, *density* of proof matters more than catalogue breadth.
- **Layout & motion:** a masonry wall (echoing the sabi hero collage) that mixes review cards (stars, quote, name, verified badge), UGC photos and short videos, and press logos with pull quotes. It slowly auto-scrolls as two columns moving at different speeds, pauses on hover, and can be filtered by tags ("comfort", "battery").
- **Payload fields:**
  ```ts
  { slug: 'proofWall', fields: [
    product?, sectionSettings, heading,
    { name: 'source', type: 'select', options: ['manual','reviewsCollection','mixed'] },
    { name: 'items', type: 'array', fields: [
      { name: 'kind', type: 'select', options: ['review','ugc','press','tweet'] },
      { name: 'quote', type: 'textarea' }, { name: 'author', type: 'text' },
      { name: 'rating', type: 'number', min: 1, max: 5 },
      { name: 'media', type: 'upload', relationTo: 'media' },
      { name: 'outlet', type: 'relationship', relationTo: 'pressOutlets' },
      { name: 'url', type: 'text' }, { name: 'verified', type: 'checkbox' },
    ]},
    { name: 'showAggregate', type: 'checkbox' },     // "4.8 · 1,204 reviews"
    { name: 'autoScroll', type: 'checkbox' },
  ]}
  ```
  `reviewsCollection` refers to the Reviews collection proposed in ROADMAP. Payload's ecommerce maintainer has said reviews "should 100% be an external thing, at least for now" (<https://github.com/payloadcms/payload/discussions/14239>).
- **Mobile:** a single column with "Show more", and auto-scroll turned off.
- **Performance / a11y:** auto-scroll needs a visible pause control (WCAG 2.2.2) and must stop under reduced motion. Lazy-load UGC videos. Show aggregate rating only when it is backed by real review data, because it feeds JSON-LD `aggregateRating` (<https://developers.google.com/search/docs/appearance/structured-data/product-snippet>).
- **Complexity:** M. **Priority:** P0 for the manual source, P1 for the reviews collection.

## 13. Video Hero with Chapters

- **Purpose:** a cinematic first impression, plus chapters that let a visitor jump to "How it fits" or "Charging".
- **Layout & motion:** a full-bleed muted looping teaser carries a large headline (sabi "Just Think." scale). "Watch the film" opens the full video with a chapter rail; chapters are clickable timestamps with thumbnails and the active chapter is highlighted.
- **Payload fields:** `teaser: upload (video)`, `poster: upload`, `fullVideo: upload | externalUrl (Mux/YouTube)`, `captionsVtt: upload`, `chapters[]: { title, start (seconds), thumb }`, `headline`, `subhead`, `cta`.
- **Mobile:** the poster plus a play button (no autoplay on cellular via the `Save-Data` / `navigator.connection` heuristic). Chapters become a horizontal chip row.
- **Performance / a11y:** the poster is the LCP element, served via `next/image` with `priority`. Captions are required (admin validation warns when missing). Provide a pause button for the looping teaser (WCAG 2.2.2). Large video files go to Blob via `clientUploads`, or are hosted externally.
- **Complexity:** M. **Priority:** P1.

## 14. Usage Timeline ("Day 1 → Week 2 → Month 3")

- **Purpose:** set realistic expectations of results over time, which reduces refunds and builds subscription intent.
- **Layout & motion:** a horizontal timeline whose line draws as you scroll, with milestone cards (time label, what you'll notice, optional image or stat).
- **Payload fields:** `milestones[]: { when, title, body, media?, stat? }`, `orientation: 'horizontal'|'vertical'`, `disclaimer`.
- **Mobile:** vertical, with the line on the left.
- **Performance / a11y:** an ordered list. The animated line is decorative (`aria-hidden`).
- **Complexity:** S. **Priority:** P2.

## 15. Founder Story / Manifesto

- **Purpose:** the human "why", which is premium brands' strongest differentiator.
- **Layout & motion:** large serif or sans manifesto text that reveals line by line (opacity tied to `view()` timeline), next to a portrait in a tall rounded tile. Optional signature image and a short "Read the full story" link.
- **Payload fields:** `kicker`, `manifesto: richText`, `portrait: upload`, `signature: upload`, `name`, `role`, `link`, `style: 'manifesto'|'letter'|'quote'`.
- **Mobile:** portrait on top, text below.
- **Performance / a11y:** the line-reveal must not hide text from screen readers. Animate opacity from 0.25, never 0, and don't use `aria-hidden`.
- **Complexity:** S. **Priority:** P1.

## 16. FAQ + Guarantee

- **Purpose:** clear the last objections right before the buy CTA, with the risk-reversal promise (e.g. "100-night trial", "2-year warranty") shown prominently.
- **Layout & motion:** on the left, a guarantee "seal" card (icon, headline, terms link); on the right, an accordion FAQ grouped by topic.
- **Payload fields:** `guarantee: { icon, headline, body, termsPage (relationship → pages) }`, `faqs: relationship → faqs (hasMany)` *or* inline `items[]: { question, answer: richText, topic }`. A shared `faqs` collection lets the same answers appear on PDP, checkout and support pages.
- **Mobile:** guarantee first, then the accordion.
- **Performance / a11y:** `<details>/<summary>`. Emits `FAQPage` JSON-LD only for genuine FAQs.
- **Complexity:** S. **Priority:** P0.

## 17. Trust Strip (shipping / returns / payment)

- **Purpose:** a compact reassurance row near price and CTAs: "Free shipping over $X · 30-day returns · Secure checkout · Ships in 48h".
- **Layout & motion:** 3–5 icon and label pairs in one hairline-bordered row, with an optional ticker on narrow screens. Shipping thresholds and countries come from the shipping settings (ROADMAP P0) so the copy never goes stale.
- **Payload fields:** `items[]: { icon, label, detail?, link? }`, `source: 'manual'|'auto'` (auto builds items from `ShippingSettings`/`ReturnsPolicy` globals), `showPaymentIcons: checkbox`.
- **Mobile:** a 2×2 grid or a marquee (pausable).
- **Performance / a11y:** SVG icons with `aria-hidden` and the text label carries the meaning.
- **Complexity:** S. **Priority:** P0.

## 18. Launch / Drop / Waitlist (countdown)

- **Purpose:** pre-launch and restock hype. It captures emails before inventory exists and converts at drop time. Extends the brief's Newsletter/Waitlist block.
- **Layout & motion:** a large countdown (DD:HH:MM:SS in tabular numerals) over product imagery, with an email/phone capture. At `launchAt` the block turns into a Buy CTA automatically (ISR revalidation or client-side switch). Optional "X people waiting" counter and a "Notify me when back in stock" mode.
- **Payload fields:**
  ```ts
  { slug: 'launch', fields: [
    product?, sectionSettings, heading, body, media,
    { name: 'mode', type: 'select', options: ['countdown','waitlist','backInStock'] },
    { name: 'launchAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'afterLaunch', type: 'select', options: ['showBuy','hideBlock','showMessage'] },
    { name: 'list', type: 'text' },                 // audience/tag for the waitlist
    { name: 'consentText', type: 'richText' },      // GDPR consent copy
    { name: 'showWaitingCount', type: 'checkbox' },
  ]}
  ```
  Submissions go to a `waitlist` collection, or to the form-builder plugin's `form-submissions`, which can also send email on submit (<https://payloadcms.com/docs/plugins/form-builder>). A scheduled job emails the list at launch. Payload jobs on Vercel need Vercel Cron calling `/api/payload-jobs/run` (<https://payloadcms.com/docs/jobs-queue/queues>), and Hobby plans only allow daily cron (<https://vercel.com/docs/cron-jobs/usage-and-pricing>).
- **Mobile:** a compact countdown with the form directly below it.
- **Performance / a11y:** the countdown is `aria-live="off"` with a static "Launches 3 Dec, 18:00 CET" text alternative, so screen readers aren't spammed every second. Rate-limit the endpoint (see ROADMAP security).
- **Complexity:** M. **Priority:** P0 (the waitlist mode is core to the sabi reference).

## 19. Bundle / Subscription Selector

- **Purpose:** raise AOV with "1 / 2 / 3-pack" or "One-time vs Subscribe & save 15%", the classic one-product pattern.
- **Layout & motion:** stacked selectable cards showing price per unit, savings badge, and a "Most popular" ribbon. The price animates (tween) when the selection changes, and the selection drives the main buy CTA.
- **Payload fields:**
  ```ts
  { slug: 'offerSelector', fields: [
    product, sectionSettings,
    { name: 'offers', type: 'array', fields: [
      { name: 'label', type: 'text' },              // "2-pack"
      { name: 'variant', type: 'relationship', relationTo: 'variants' },
      { name: 'quantity', type: 'number', defaultValue: 1 },
      { name: 'discount', type: 'relationship', relationTo: 'discounts' },  // ROADMAP P1
      { name: 'purchaseType', type: 'select', options: ['oneTime','subscription'] },
      { name: 'interval', type: 'select', options: ['month','2months','quarter'] },
      { name: 'badge', type: 'text' }, { name: 'highlight', type: 'checkbox' },
    ]},
  ]}
  ```
- **Dependencies:** discounts and subscriptions are **not** in the ecommerce plugin. The docs say shipping, taxes and subscriptions must be implemented yourself (<https://payloadcms.com/docs/ecommerce/overview>), and the plugin's Stripe adapter charges `cart.subtotal` with no adjustment hook yet (<https://github.com/payloadcms/payload/issues/15784>). So v1 ships **bundles only**, as quantity × variant price or as dedicated bundle variants; the subscription option waits for ROADMAP work.
- **Mobile:** full-width stacked cards.
- **Performance / a11y:** a `radiogroup`. Savings are stated in text ("Save $24"), not colour alone.
- **Complexity:** M (bundles), L (subscriptions). **Priority:** P1.

## 20. Size / Fit Finder

- **Purpose:** cut size-related returns, the biggest return driver for wearables and apparel.
- **Layout & motion:** an inline "Find your size" link opens a side drawer (same component as the cart drawer). It offers either a size table with unit toggle (cm/in) or a 2–4 question quiz ("Head circumference?", "Fit preference?") that recommends a variant and can apply it.
- **Payload fields:** `mode: 'table'|'quiz'|'both'`, `table: { columns[], rows[] }`, `questions[]: { prompt, type: 'choice'|'number', options[]: { label, weight per variant } }`, `measureGuide: { image, steps[] }`, `variantType: relationship → variantTypes`.
- **Mobile:** a full-height bottom sheet.
- **Performance / a11y:** the drawer is a focus-trapped dialog with Esc to close. The table has a caption and scope headers. The quiz result is announced through `aria-live="polite"`.
- **Complexity:** M. **Priority:** P2 (P1 for apparel templates).

## 21. Sustainability / Provenance Map

- **Purpose:** show where materials come from and who makes the product, for the ethics-driven premium buyer.
- **Layout & motion:** a minimal monochrome SVG world map (no tile server) with pins for each origin (farm, mill, factory, warehouse). Dashed paths draw between pins in supply-chain order. Clicking a pin opens a card with a photo, partner name and certification. Optional impact stats row (CO₂ per unit, % recycled).
- **Payload fields:** `stops[]: { name, role: 'material'|'manufacture'|'assembly'|'fulfilment', lat, lng, country, image, body, certifications[] }`, `stats[]: { value, unit, label, source }`, `mapStyle: 'dots'|'outline'`.
- **Mobile:** the map shrinks to a header illustration and the stops become a vertical list in order.
- **Performance / a11y:** inline SVG with no map library. The stops list is the accessible primary content and the map is decorative. Each stat needs a cited `source` (greenwashing risk).
- **Complexity:** M. **Priority:** P2.

## 22. Science / Proof Points (stat band)

- **Purpose:** credible numbers ("93% felt calmer in 14 days*") paired with study citations. This suits sabi-like science-led products.
- **Layout & motion:** 2–4 giant numerals that count up once in view, each with a short label and a footnote marker. Footnotes are listed beneath, linking to studies or PDFs.
- **Payload fields:** `stats[]: { value, suffix, label, footnote }`, `footnotes[]: { marker, text, link }`, `methodologyPage: relationship`.
- **Mobile:** stacked.
- **Performance / a11y:** the final number is present in the DOM from the start and only the visual counts up. Reduced motion disables the count.
- **Complexity:** S. **Priority:** P1.

## 23. Inline PDP Hero ("buy box" block)

- **Purpose:** in one-product stores the home page *is* the product page. This block puts a complete buy box (gallery, title, rating, price, variant picker, quantity, Add to cart, express pay, trust strip) anywhere on any page.
- **Layout & motion:** on desktop, a sticky gallery on the left (tall rounded tiles in a vertical snap) and the buy box on the right; on mobile, the gallery carousel sits above. It is the anchor the Sticky Buy Bar (#6) observes.
- **Payload fields:** `product`, `galleryStyle: 'stack'|'carousel'|'grid'`, `showRating`, `showExpressPay`, `showTrustStrip`, `accordions[]: { title, body | specSheetRef | faqRef }`.
- **Dependencies:** cart and checkout via the plugin's `EcommerceProvider` and hooks (<https://payloadcms.com/docs/ecommerce/frontend>). Express pay via Stripe Express Checkout Element (<https://docs.stripe.com/elements/express-checkout-element>), which needs domain registration for Apple Pay.
- **Performance / a11y:** the first gallery image is LCP (`priority`). The variant picker is a `radiogroup` and the price is announced on change. Product JSON-LD is emitted here (see ROADMAP SEO).
- **Complexity:** M. **Priority:** P0.

---

## Summary table

| # | Section | Goal | Complexity | Priority |
|---|---|---|---|---|
| 1 | Scroll Story | narrative / engagement | M | P0 |
| 2 | Frame-Sequence Scrubber | wow / craft | L | P1 |
| 3 | 3D / 360° Viewer | inspection, fewer returns | M | P1 |
| 4 | Anatomy / Materials hotspots | justify price | M | P0 |
| 5 | How It Works (01/02/03) | explain | S | P0 |
| 6 | Sticky Buy Bar | conversion | M | P0 |
| 7 | Colorway Theater | variant choice | M | P0 |
| 8 | Before / After | prove result | S | P1 |
| 9 | Comparison | objection handling | S | P1 |
| 10 | Spec Sheet | detail buyers, SEO | S | P0 |
| 11 | In the Box | expectations | S | P1 |
| 12 | Social-Proof Wall | trust | M | P0 (manual) |
| 13 | Video Hero + Chapters | first impression | M | P1 |
| 14 | Usage Timeline | expectations / retention | S | P2 |
| 15 | Founder / Manifesto | brand | S | P1 |
| 16 | FAQ + Guarantee | risk reversal | S | P0 |
| 17 | Trust Strip | reassurance | S | P0 |
| 18 | Launch / Drop / Waitlist | pre-launch capture | M | P0 |
| 19 | Bundle / Subscription Selector | AOV | M / L | P1 |
| 20 | Size / Fit Finder | fewer returns | M | P2 |
| 21 | Provenance Map | ethics | M | P2 |
| 22 | Science Stat Band | credibility | S | P1 |
| 23 | Inline PDP Hero (buy box) | conversion | M | P0 |

## Recommended v1 set

Ship these **10 blocks** (plus the brief's base blocks: Hero collage, Featured Product, Collection, Slideshow, Press, Newsletter, Rich text):

1. **Inline PDP Hero / buy box** (#23): the page has to sell.
2. **Sticky Buy Bar** (#6): the cheapest conversion lift.
3. **How It Works 01/02/03** (#5): the core of the sabi look.
4. **Scroll Story** (#1): the "premium" feel, built on native CSS with no heavy libraries.
5. **Anatomy / Materials** (#4): justifies the price.
6. **Colorway Theater** (#7): built on the plugin's variants.
7. **Social-Proof Wall (manual source)** (#12): reuses the Press block's data.
8. **FAQ + Guarantee** (#16).
9. **Trust Strip** (#17): in v1, copy is manual until shipping settings exist.
10. **Launch / Waitlist with countdown** (#18): pre-launch stores have nothing to sell yet.

The **v1.1 fast follow** is Spec Sheet (#10, if it isn't folded into the buy-box accordions), Before/After, Comparison, In the Box, Founder, Science stats, then 3D viewer and Video Hero. **Frame sequence, subscriptions, fit finder and provenance map** wait until the ROADMAP P0/P1 commerce work (adjustable totals, discounts, subscriptions) has landed.

### Engineering notes for the whole set

- Build one tiny motion utility (`useInView`, CSS `@supports (animation-timeline: view())` with an IO fallback) and one `Drawer` primitive (shared with the cart drawer and fit finder). Don't add GSAP or three.js to the base bundle.
- Each block's React component is a Server Component by default. Only interactive islands (`'use client'`) hydrate.
- Each block has a seed fixture so `pnpm seed` produces a complete demo page for "Aura One".
- Lighthouse budget per block on mobile: no CLS contribution, ≤ 50 KB JS (gzipped), and lazy media below the fold.

## Sources

- Payload ecommerce overview (no shipping, tax, subscriptions): <https://payloadcms.com/docs/ecommerce/overview>
- Payload ecommerce plugin options (variants, inventory, currencies): <https://payloadcms.com/docs/ecommerce/plugin>
- Payload ecommerce frontend hooks: <https://payloadcms.com/docs/ecommerce/frontend>
- Payload storage adapters, Vercel Blob `clientUploads` / 4.5 MB: <https://payloadcms.com/docs/upload/storage-adapters>
- Payload Live Preview: <https://payloadcms.com/docs/live-preview/overview>
- Payload drafts / scheduled publish: <https://payloadcms.com/docs/versions/drafts>
- Payload jobs on Vercel: <https://payloadcms.com/docs/jobs-queue/queues>
- Payload form-builder plugin: <https://payloadcms.com/docs/plugins/form-builder>
- Ecommerce RFC (reviews external, etc.): <https://github.com/payloadcms/payload/discussions/14239>
- Stripe adapter amount hardcoded to subtotal: <https://github.com/payloadcms/payload/issues/15784>
- Vercel Blob `clientUploads` issues: <https://github.com/payloadcms/payload/issues/17823>, <https://github.com/payloadcms/payload/issues/19482>
- Payload releases (3.94.0 / 4.0.0-beta.10): <https://github.com/payloadcms/payload/releases>
- `<model-viewer>`: <https://github.com/google/model-viewer>
- MDN scroll-driven animations: <https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations>
- Stripe Express Checkout Element: <https://docs.stripe.com/elements/express-checkout-element>
- Google Product structured data: <https://developers.google.com/search/docs/appearance/structured-data/product-snippet>
- Vercel Web Analytics custom events: <https://vercel.com/docs/analytics/custom-events>
- Vercel Cron limits: <https://vercel.com/docs/cron-jobs/usage-and-pricing>
