# Project Plan - Bloom Studio MVP

## Goal and approach

Build a production, config-driven demo salon website with an AI booking concierge:
1. A mobile-first Next.js homepage (hero, services, availability, reviews, hours, chat entry points) matching DESIGN.md exactly
2. A full AI concierge chat screen backed by OpenRouter, using tool-calling for booking capture and hand-off — never free-text claims
3. Email + Telegram notifications fired on a successful booking capture
4. A single salon config file so the whole site can be re-skinned for future clients
5. A desktop-optimized layout added once the mobile MVP works end-to-end (Parts 9–10) — most bookings are expected from a smartphone, so mobile ships first

Execution will proceed in gated phases. Part 1 is a hard gate: no implementation beyond planning until plan approval.

## Quality bar and testing policy

- Unit coverage target: **minimum 80%**, with emphasis on critical behavior, not metric gaming.
- Integration testing: robust API + frontend/backend flow coverage for core user journeys.
- E2E testing: at least one happy path plus selected failure-path checks for key flows.

## Current implementation status

- **Completed:** Parts 1–7 (planning, scaffolding, design system primitives, homepage, AI concierge backend + frontend, Vercel deployment — live at https://bloom.incodet.com)
- **Pending:** Part 8, plus Parts 9–10 (desktop layout, after the mobile MVP)

## Confirmed design decisions

- Hand-off is triggered by a structured `request_handoff` tool call (with a `reason` field), never by the model writing prose — mirrors `capture_booking`'s pattern of "structured action, not claimed text."
- Rate limiting is an in-memory, single-instance counter (session cookie + IP) for phase 1, not an external Redis-backed store — documented tradeoff in AGENTS.md Limitations.
- Chat is route-based for the full screen (`/chat`) and a separate overlay component for the homepage preview sheet — these are two distinct components per DESIGN.md's interaction notes, not one component at two sizes.
- The scripted opening exchange in the full chat is generated from `config.services[0]` at render time, never hardcoded to Balayage/Priya, so the demo stays coherent when re-skinned.
- Desktop (Parts 9–10) adds exactly one breakpoint (`lg:`/1024px, no tablet tier), drops the mobile "phone frame" metaphor for a standard full-width layout, and gives the AI concierge a persistent bottom-right widget on desktop instead of the mobile full-page `/chat` takeover — full rationale in `docs/superpowers/specs/2026-08-24-desktop-layout-expansion-design.md`.

## Part 1 - Planning and project baseline (hard gate)

**Status:** Pending

### Tasks

- [ ] Confirm requirements, technical constraints, and coding standards in root `AGENTS.md`
- [ ] Expand this plan with implementation checklists, tests, and success criteria for each phase
- [ ] Pause and wait for explicit user approval before starting implementation

### Tests

- [ ] Documentation quality check: all phases include actionable tasks, tests, and completion criteria

### Success criteria

- [ ] Plan is clear enough to execute phase-by-phase without ambiguity
- [ ] User explicitly approves plan before Part 2 starts

## Part 2 - Project scaffolding & config data model

**Status:** Pending

### Tasks

- [ ] Scaffold a Next.js (App Router, TypeScript) project with Tailwind CSS at the repo root
- [ ] Add Newsreader + Karla via `next/font/google` in the root layout
- [ ] Extend the Tailwind theme with DESIGN.md's color, radius, shadow, and spacing tokens
- [ ] Define TypeScript types for the salon config schema in `types/salon.ts`: `Salon`, `Service`, `Review`, `HoursRow`, `ChatDemoConfig`, `ImageAsset` (`src`, `alt`, `credit`, `creditHref`)
- [ ] Create `config/salon.json` with Bloom Studio's demo content: name, area, accent, established, rating, phone, address, postcode, 4 services, 3 reviews, 4 hours rows, and chat-demo fields (`chatStylist`, `slot1`, `slot2`, `nextAvailable`) that reference `services[0]` rather than duplicating it
- [ ] Source real Unsplash stock photo URLs for the hero and each service card, with required photographer credit + profile link, clearly marked as swappable placeholder content
- [ ] Create `.env.example` listing `OPENROUTER_API_KEY`, `OPENROUTER_MODEL_PRIMARY`, `OPENROUTER_MODEL_FALLBACK`, `RESEND_API_KEY`, `OWNER_EMAIL`, `EMAIL_FROM`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` with no real values

### Tests

- [ ] `npm run build` succeeds against the scaffolded app
- [ ] `npm run lint` and TypeScript type-check both pass
- [ ] `config/salon.json` type-checks against `types/salon.ts`

### Success criteria

- [ ] App builds and runs locally (`npm run dev`)
- [ ] `salon.json` contains every field DESIGN.md's content model requires, with chat-demo fields derived from `services[0]`
- [ ] `.env.example` lists every required variable with no real values committed

## Part 3 - Design system & shared UI primitives

**Status:** Pending

### Tasks

- [ ] Implement the `ImageSlot` component (`components/ImageSlot.tsx`): wraps `next/image`, accepts `src`/`alt`/`credit`/`creditHref`/`shape` (`rect`/`rounded`/`circle`/`pill`)/`fit`, shows a tinted placeholder background while loading, lazy loads, renders an Unsplash attribution overlay whenever `credit` is present
- [ ] Build shared primitives: `Button` (primary/secondary variants per DESIGN.md), `PulsingDot`, `StarRating`, `SectionHeading`
- [ ] Add the three motion keyframes (`pulseRing`, `typingDot`, `slideUp`) as global CSS matching DESIGN.md's motion spec exactly

### Tests

- [ ] Type-check + lint pass
- [ ] Manual visual check: render each primitive on a scratch page and compare against DESIGN.md's hex/type/radius values

### Success criteria

- [ ] `ImageSlot` renders a real Unsplash photo with correct attribution, lazy-loaded, with the correct corner treatment per shape
- [ ] All primitives visually match DESIGN.md's locked token values exactly

## Part 4 - Homepage build (Screen 1)

**Status:** Pending

### Tasks

- [ ] `Header` + full-screen nav overlay (menu links, phone, Book Now CTA)
- [ ] `Hero` (H1 + paragraph + two CTAs) using `ImageSlot` for the hero photo
- [ ] `TrustLine` + `TrustIndicators` row
- [ ] `ServicesGrid` + `ServiceCard` (2-column grid, `ImageSlot` per card, sourced from `config.services`)
- [ ] `AvailabilityStrip` (pulsing dot + `nextAvailable` + Book link routing to `/chat`)
- [ ] `ReviewsCarousel` (horizontal snap-scroll, sourced from `config.reviews`)
- [ ] `FindUs` (map placeholder + address + hours table from `config.hours`)
- [ ] `ChatFAB` (fixed pulsing button opening the preview sheet)
- [ ] `ChatPreviewSheet` (slide-up overlay with teaser messages built from `config.services[0]`, "Continue in full chat" linking to `/chat`)
- [ ] Assemble `app/page.tsx` from the above, entirely config-driven

### Tests

- [ ] Manual check at a 430px mobile viewport against `Bloom Studio.dc.html` and DESIGN.md, section by section
- [ ] Nav overlay and chat preview sheet open/close correctly
- [ ] Swap `config.services[0]`'s name and confirm the preview sheet teaser text updates accordingly

### Success criteria

- [ ] Homepage renders every Part-1-scoped section with no hardcoded salon name/services/reviews/hours in components
- [ ] Preview sheet and the future full chat route share the same slide/overlay visual language

## PAUSE 1 - Before Part 5 (External service accounts & environment)

The developer must:
1. Create an OpenRouter account at https://openrouter.ai and generate an API key at https://openrouter.ai/keys — use it for `OPENROUTER_API_KEY`
2. Create a Resend account at https://resend.com and generate an API key at https://resend.com/api-keys — use it for `RESEND_API_KEY`; for the phase-1 demo, the default `onboarding@resend.dev` sender identity works without domain verification, **but Resend's sandbox restricts recipients to the account's own signup email only** — set `OWNER_EMAIL` to that address for now, or verify a real sending domain at https://resend.com/domains (and set `EMAIL_FROM` to an address on it) to send to any recipient
3. Create a Telegram bot via BotFather (https://t.me/BotFather) using `/newbot`, and copy the bot token for `TELEGRAM_BOT_TOKEN`
4. Get the target Telegram chat id: send the new bot one message, then open `https://api.telegram.org/bot<token>/getUpdates` in a browser and read the `chat.id` field from the response — use it for `TELEGRAM_CHAT_ID`
5. Create a Vercel account at https://vercel.com if one doesn't already exist (needed for Part 7)
6. Create a `.env.local` file at the repo root with all six values above (this file is already covered by `.gitignore` — never commit it)

Confirm to the agent: "External accounts and .env.local are set up"

## Part 5 - AI concierge backend (OpenRouter + tools)

**Status:** Pending

### Tasks

- [ ] `lib/systemPrompt.ts`: builds a scoped system prompt from `config/salon.json` (services with prices/durations, hours) instructing the model to answer only from this data, never invent facts, redirect allergy/patch-test/safety questions to "check with a stylist in person," and never claim a booking succeeded in prose
- [ ] `lib/openrouter.ts`: OpenRouter client wrapper with an ordered model fallback chain (`OPENROUTER_MODEL_PRIMARY` then `OPENROUTER_MODEL_FALLBACK`), retrying the next model on rate-limit/5xx/model-removed responses
- [ ] Define the `capture_booking` tool schema (`name`, `phone`, `service`, `preferred_time`) and the `request_handoff` tool schema (`reason`)
- [ ] `app/api/chat/route.ts`: POST handler accepting message history, calling OpenRouter with the system prompt and both tools, returning the assistant's reply plus any tool call
- [ ] `lib/rateLimit.ts`: in-memory fixed-window counter keyed by a session cookie (set on first request) + IP fallback; returns HTTP 429 with a friendly "we're getting lots of interest, try again shortly" payload when exceeded
- [ ] `lib/email.ts`: `sendBookingEmail(details)` via Resend to `OWNER_EMAIL`
- [ ] `lib/telegram.ts`: `sendBookingTelegram(details)` via the Telegram Bot API `sendMessage` endpoint
- [ ] On a `capture_booking` tool call: fire the email and Telegram notifications concurrently, best-effort (log failures, never block the chat response on notification delivery)
- [ ] On a `request_handoff` tool call: return a flag the frontend uses to show the escalation message and reveal the hand-off form

### Tests

- [ ] Unit test: swapping `config/salon.json`'s services changes the referenced service name/price in the generated system prompt
- [ ] Unit test: simulating a primary-model 429/error causes the fallback model to be called
- [ ] Unit test: the (N+1)th request within the rate-limit window returns 429 with the friendly message
- [ ] Integration test: mock an OpenRouter response containing a `capture_booking` tool call and assert both notification senders are invoked with the correct structured fields
- [ ] Integration test: mock an OpenRouter response containing a `request_handoff` tool call and assert the hand-off flag is returned with no prose-only claim
- [ ] Manual test: ask an allergy/patch-test question and confirm hand-off triggers instead of a direct answer

### Success criteria

- [ ] The AI never returns a booking-confirmed claim without a corresponding `capture_booking` tool call in the same turn
- [ ] Out-of-scope, uncertain, or safety-sensitive questions always resolve to `request_handoff`, never a freelanced answer
- [ ] Hitting the rate limit shows the friendly degradation message, never a raw error

## Part 6 - AI concierge frontend (Screen 2)

**Status:** Pending

### Tasks

- [ ] `app/chat/page.tsx`: full chat screen (back arrow, avatar initials, online status, scrollable message list)
- [ ] `ChatThread` + `MessageBubble` (user/bot variants) + `TypingIndicator`
- [ ] `QuickReplyChips` wired to `config.slot1`/`slot2` plus a "See more times" option
- [ ] `BookingConfirmationCard` — rendered only from a successful `capture_booking` tool-call response, never speculatively
- [ ] `HandoffPrompt` (always-visible "Connect me to a real person" link) + `HandoffForm` (name/phone capture, "Request a callback"), auto-revealed when a `request_handoff` tool call fires
- [ ] `MessageInputBar` wired to `POST /api/chat`, appending the assistant reply and applying any tool-call side effects
- [ ] Seed the scripted opening exchange from `config.services[0]` dynamically (never hardcoded)

### Tests

- [ ] Manual E2E: open `/chat`, run the scripted opener against the demo config, confirm it references `services[0]`
- [ ] Manual E2E: pick a quick-reply slot and confirm `BookingConfirmationCard` shows the correct service/stylist/time/address
- [ ] Manual E2E: ask a safety/allergy question and confirm the hand-off copy and form auto-appear
- [ ] Manual E2E: trigger the rate limit via rapid messages and confirm the friendly degradation message appears with no visible error

### Success criteria

- [ ] Full chat screen visually matches DESIGN.md / the prototype's Screen 2 at mobile viewport
- [ ] `BookingConfirmationCard` only ever appears after a real `capture_booking` tool-call round-trip

## PAUSE 2 - Before Part 7 (Vercel deployment)

The developer must:
1. Install the Vercel CLI if not already present: `npm i -g vercel`
2. Run `vercel login` in the repo root and complete browser authentication
3. Run `vercel link` in the repo root to connect this project to a Vercel project
4. In the Vercel dashboard (https://vercel.com/dashboard) for this project, go to Settings → Environment Variables and add every variable from `.env.example` (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL_PRIMARY`, `OPENROUTER_MODEL_FALLBACK`, `RESEND_API_KEY`, `OWNER_EMAIL`, `EMAIL_FROM`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) for both Production and Preview environments

Confirm to the agent: "Vercel is linked and environment variables are set"

## Part 7 - Vercel deployment

**Status:** Done

### Tasks

- [x] Deploy with `vercel --prod` from the repo root
- [x] Verify the production build succeeds and note the assigned `*.vercel.app` URL — https://bloom-studio-three.vercel.app
- [x] Add `bloom.incodet.com` under Settings → Domains in the Vercel project. `incodet.com`'s DNS is already on Cloudflare (a separate Vercel account hosts the root domain), so this needed the Cloudflare MCP: added a `_vercel.incodet.com` TXT record to prove control of the subdomain independent of the root domain's Vercel account, then a `bloom.incodet.com` CNAME to Vercel's recommended target once verified — both added directly via the Cloudflare API, nothing else on the zone touched.

### Tests

- [x] Homepage and `/chat` both load correctly on the deployed URL
- [x] `/api/chat` responds correctly against the production environment variables

### Success criteria

- [x] Production deployment is live and reachable at the Vercel-assigned URL
- [x] `bloom.incodet.com` resolves over HTTPS to the production deployment (homepage, `/chat`, `/api/chat` all verified)

## Part 8 - End-to-end verification

**Status:** Pending

### Tasks

- [ ] Trigger a full test booking through the deployed chat: ask about `services[0]`, pick a quick-reply slot, let `capture_booking` fire
- [ ] Confirm the `BookingConfirmationCard` appears with the correct details
- [ ] Ask an allergy/patch-test question and confirm hand-off triggers correctly
- [ ] Rapidly send messages to confirm the rate-limit degradation message appears

### Tests

- [ ] `npm run build`, `npm run lint`, and the full test suite all pass with no errors
- [ ] No console errors during the manual test booking flow

### Success criteria

- [ ] End-to-end booking loop confirmed: chat → `capture_booking` tool call → notifications fired
- [ ] Every Phase 1 scope item from `AGENTS.md` is present and functioning on the production deployment

## PAUSE 3 - After Part 8 (Confirm notification delivery)

The developer must:
1. Check the inbox for the address set as `OWNER_EMAIL` for the booking notification email sent during the Part 8 test booking
2. Check the Telegram chat for `TELEGRAM_CHAT_ID` for the bot message sent during the same test booking

Confirm to the agent: "Email and Telegram notifications both arrived — end-to-end loop confirmed"

## Part 9 - Desktop homepage layout

**Status:** Pending

Design rationale: `docs/superpowers/specs/2026-08-24-desktop-layout-expansion-design.md`. One added breakpoint (Tailwind `lg:`, 1024px), no tablet tier. Extends the existing Part 4 components with `lg:` variants — no parallel desktop-only components.

### Tasks

- [ ] `Header`: add an `lg:` inline nav (menu links, phone, Book Now), hide the hamburger/full-screen overlay at `lg:` and up
- [ ] `Hero`: add an `lg:` two-column layout (copy + CTAs beside the hero `ImageSlot`), replacing the mobile stacked order
- [ ] `ServicesGrid`: `lg:` 4-column grid (all 4 services in one row)
- [ ] `AvailabilityStrip`: widen within the `lg:` 1200px container, same content
- [ ] `ReviewsCarousel`: `lg:` static 3-column grid, remove scroll-snap behavior at that breakpoint
- [ ] `FindUs`: `lg:` two-column layout (map beside address/hours)
- [ ] Footer: widen within the `lg:` container, same content
- [ ] Add the shared `lg:` 1200px centered container with responsive horizontal padding, used by every section above

### Tests

- [ ] Manual check at 1280px and 1440px viewports against the Desktop layout table in `design/DESIGN.md`
- [ ] Manual check at 1023px confirms the mobile layout is unaffected (breakpoint boundary)
- [ ] `npm run build` and `npm run lint` both pass

### Success criteria

- [ ] Every homepage section reflows correctly at `lg:` with no layout breakage between 1024px and common desktop widths (1280–1920px)
- [ ] No mobile behavior regressed below 1024px

## Part 10 - Desktop AI concierge widget

**Status:** Pending

### Tasks

- [ ] `DesktopChatWidget` component: fixed bottom-right panel (~400px wide, ~600px tall), rendered only at `lg:` and up
- [ ] `ChatFAB` click behavior branches by viewport: below `lg:` unchanged (mobile preview sheet / `/chat`); at `lg:` and up, toggles `DesktopChatWidget` open/closed in place
- [ ] Reuse Part 6's `ChatThread`, `MessageBubble`, `QuickReplyChips`, `BookingConfirmationCard`, and `HandoffForm` inside the widget — remove any full-viewport-only sizing assumption (e.g. `100vh`) from those components so they drop into the fixed panel cleanly
- [ ] `/chat` route remains as a plain fallback page, unchanged

### Tests

- [ ] Manual E2E at a desktop viewport: open the widget, run the scripted opener, pick a quick-reply slot, confirm `BookingConfirmationCard` renders correctly inside the fixed panel
- [ ] Manual E2E: confirm the widget calls the same `/api/chat` route as `/chat` (no backend duplication)
- [ ] Manual check: `/chat` still loads correctly as a standalone page on both mobile and desktop viewports

### Success criteria

- [ ] The full mobile booking loop (chat → `capture_booking` → email/Telegram notifications) also completes correctly through the desktop widget
- [ ] Opening/closing the widget never navigates away from the homepage

### PAUSE Block Format
copy-paste this pattern whenever a part needs a manual step:
```
PAUSE N - [Before/After] Part X ([Short label])
The developer must:
1. [Exact action with URL or file path]
2. [Exact action]
3. [Exact action]

Confirm to the agent: "[Short confirmation phrase]"
```
