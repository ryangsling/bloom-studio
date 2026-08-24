# The Bloom Studio App

## Business Requirements

This project is building a production demo/flagship salon website for Incodet (a web agency), showcasing an AI booking concierge for UK hair & beauty salons, designed to be re-skinned as a template for future salon clients. Key features:
- Mobile-first marketing homepage (hero, services, availability, reviews, hours) driving direct bookings with no marketplace commission
- An AI concierge chat (OpenRouter-backed, tool-calling only) that answers strictly from the salon's own config data
- Structured booking capture that notifies the owner by email and Telegram
- A human hand-off flow for anything out of scope, uncertain, or safety-sensitive
- A single config file driving all salon-specific content, so the same components can be re-skinned for a different salon client

## Limitations

Phase 1 only. Not building: booking deposit flow, waitlist, owner dashboard, rebooking automation, or SMS/WhatsApp notifications. Mobile ships first (Parts 1–8); a desktop-optimized layout (Parts 9–10, one added breakpoint at `lg:`/1024px, no tablet tier) follows once the mobile AI concierge works end-to-end — see `docs/superpowers/specs/2026-08-24-desktop-layout-expansion-design.md`. No database — salon content is static config, and chat/booking state is ephemeral per session (notifications are fire-and-forget, not persisted). Rate limiting is an in-memory, single-instance counter, not a shared external store — acceptable for demo-scale traffic, but it resets on cold start and isn't shared across concurrent serverless instances; upgrading to a shared store (e.g. Redis) is a future enhancement, not phase 1 scope.

## Technical Decisions

- Frontend framework: Next.js (App Router), TypeScript
- Backend: Next.js Route Handlers (`app/api/*`) — no separate backend service
- Styling: Tailwind CSS, theme tokens mapped 1:1 from `design/DESIGN.md`
- Responsive strategy: mobile layout by default, one added breakpoint at `lg:` (1024px) for desktop — no tablet-specific tier
- Fonts: `next/font/google` — Newsreader (display) + Karla (body/UI)
- Packaging / deployment: Vercel, target domain `bloom.incodet.com` (DNS handled separately)
- Package manager: npm
- AI integration: OpenRouter Chat Completions API, primary/fallback models set via `OPENROUTER_MODEL_PRIMARY`/`OPENROUTER_MODEL_FALLBACK` (currently `nvidia/nemotron-3-super-120b-a12b:free` / `z-ai/glm-5.2:free` — verified against OpenRouter's live endpoints API, not just its model list, since a `:free` model can still be listed with zero active provider endpoints; free models rotate without notice, so re-verify before swapping either one); OpenAI-compatible tool/function calling for `capture_booking` and `request_handoff`
- Email notifications: Resend (free tier)
- Secondary notification: Telegram Bot API (plain `fetch`, no SDK)
- Rate limiting: in-memory counter keyed by session cookie + IP (see Limitations)
- Database: none for phase 1
- Images: `next/image` wrapped in a custom `ImageSlot` component (production counterpart of the `image-slot.js` pattern), Unsplash stock placeholders with required attribution, swappable via config

## Starting Point

Greenfield Next.js app. Existing repo assets are references, not code to ship as-is:
- `design/DESIGN.md` — locked design tokens and component inventory (implement, don't reinterpret)
- `bloom-boilerplate/Bloom Studio.dc.html` — structural/behavioral prototype markup (Claude Design format, not production code)
- `bloom-boilerplate/image-slot.js` — droppable-image pattern reference for the production `ImageSlot` component; this file itself depends on the Claude Design canvas runtime and is not imported into the app

## Design System

Reference: design/DESIGN.md (full spec)

- Palette: `#E8E1D6`/`#FBF6F1`/`#F4E9E2` backgrounds, `#2B2622`/`#6B6157`/`#8A7F72` text, accent `#C1592E` (one of a 4-color option set, configurable per salon)
- Type: Newsreader (italic, weight 500, for headings/salon name/prices) for display, Karla for body, buttons, nav, and chat
- Signature element: the pulsing accent-colored ring on the availability dot and chat FAB (`motion.pulse_ring`)
- Constraints: mobile-first (430px frame) with one added desktop breakpoint at `lg:`/1024px (1200px container, no tablet tier), no dark mode, every DESIGN.md token is final — implement, don't restyle
- Motion: the slide-up sheet entrance (`translateY 100%→0`, .25s ease-out) is the one motion idea to reuse consistently across the nav overlay, chat preview sheet, and full chat screen

## Coding Standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever
4. When hitting issues, always identify root cause before trying a fix. Do not guess. Prove with evidence, then fix the root cause.

## Working Documentation

All documents for planning and executing this project will be in the docs/ directory.
Please review the docs/PLAN.md document before proceeding.
