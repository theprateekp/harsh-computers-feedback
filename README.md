# Harsh Computers Feedback Hub

A responsive customer feedback and Google review companion for **Harsh Computers Laptop And Mobile Hub** in Pune. The app gives the shop a customer-facing landing page, a private feedback survey, sentiment and NPS reporting, CSV export, and a print-ready QR card that opens the shop's Google Maps profile.

## Verified shop profile

The app uses the public Google Maps listing supplied for this project as its source of truth:

- **Business:** Harsh Computers Laptop And Mobile Hub
- **Local name:** हर्ष कंप्यूटर्स लैपटॉप एंड मोबाइल हब
- **Category:** Computer repair service
- **Public rating:** 4.9/5 from 25 Google reviews at the time of research
- **Phone:** +91 98606 05025
- **Address:** Khajina bihir chowk, Shop no. 8 Radha Krishna hights, 1435, Tilak Rd, Sadashiv Peth, Pune, Maharashtra 411030, India
- **Hours:** Monday–Saturday, 10:00 AM–8:30 PM; Sunday closed
- **Google Maps:** https://maps.app.goo.gl/3WySPp64HW2M3nwk8
- **Published website:** https://sites.google.com/view/harshcomputerspune/home.vdrh04y7gnvi

Because Google listing details can change, the rating and hours are intentionally stored in one shared business profile module (`shared/business.ts`) so they can be updated in one place.

## Product flows

### Public customer experience

The root route is a mobile-first landing page with the shop profile, service categories, contact links, current Google rating, hours, and a private feedback form. The form captures a 1–5 rating, a 0–10 recommendation score, service type, response tags, optional comment, optional contact details, and a follow-up request. A `source` query parameter supports attribution from future channels; the QR campaign uses `?source=google-qr` when desired.

### Owner dashboard

The protected `/dashboard` route provides the shop owner with response count, average private rating, NPS, follow-up count, seven-day response rhythm, sentiment mix, NPS breakdown, response tags, service mix, latest feedback, and a live refresh every ten seconds. The `/dashboard/feedback` route points to the same response workspace for a clear navigation path.

### Google review QR

The protected `/dashboard/qr` route renders a counter-ready QR card. The code links directly to the verified Google Maps short URL, not to a fabricated review form or an unverified business page. The page includes a print action and practical placement guidance. An honest review is always requested; the app does not incentivize or gate Google reviews.

### Export

The owner can download all feedback rows as a CSV from the dashboard. The export includes timestamps, customer fields, rating, NPS score, service type, sentiment, tags, comment, source, follow-up flag, and status.

## Technical stack

- React 19, Vite, TypeScript, Tailwind CSS
- Express + tRPC 11 for typed server procedures
- Drizzle ORM with MySQL/TiDB
- Manus OAuth for protected owner routes
- Vitest for unit tests
- Recharts-compatible dashboard-ready component system and Lucide icons

## Local development

```bash
pnpm install
pnpm dev
```

The scaffold expects the managed environment variables supplied by WebDev for the database, Manus OAuth, and built-in services. Do not commit `.env` files or credentials.

Useful commands:

```bash
pnpm check      # TypeScript
pnpm test       # Vitest
pnpm build      # Production client + server build
pnpm format     # Prettier
```

## Database

The `feedback` table is defined in `drizzle/schema.ts` and includes the analysis fields used by the dashboard. For schema changes, generate a migration with:

```bash
pnpm drizzle-kit generate
```

Review the generated SQL before applying it through the WebDev database workflow. The initial feedback table migration is checked into `drizzle/0001_young_sleeper.sql`.

## Sentiment and NPS behavior

Sentiment is intentionally deterministic and transparent: low ratings or negative language become negative; positive language or high ratings become positive; middle-of-the-road responses become neutral. NPS uses standard buckets: scores 9–10 are promoters, 7–8 passives, and 0–6 detractors. The score displayed in the dashboard is `(promoters - detractors) / total × 100`, rounded to a whole number.

## Important privacy and review notes

The private survey is separate from Google reviews. Customer comments remain in the shop dashboard and are not posted publicly. The Google button and QR route open Google's own listing so customers choose whether to post a public review. The shop should use the data responsibly, protect contact details, and follow Google's review policies.

## Routes

| Route | Purpose |
|---|---|
| `/` | Public shop landing page and feedback form |
| `/dashboard` | Protected owner reporting overview |
| `/dashboard/feedback` | Protected response workspace entry point |
| `/dashboard/qr` | Protected printable Google review QR card |

## Source attribution

Business details were researched from the Google Maps listing supplied in the project brief on 17 September 2026. The app does not claim that Google ratings are synchronized automatically; the displayed public rating is the verified snapshot used for this build.
