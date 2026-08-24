# Desktop Layout Expansion — Design

## Context

Bloom Studio was scoped mobile-only per `design/DESIGN.md` ("scope: mobile-only, no desktop breakpoint required") and `AGENTS.md` explicitly excluded "any desktop-specific layout" from phase 1. The user has asked to expand scope to include a desktop-optimized layout, while keeping mobile as the primary target — most bookings are expected to come from a smartphone, so mobile ships first (Parts 1–8, unchanged) and desktop is added as a follow-on phase rather than blended into the mobile-first build.

This is architectural: it changes a locked design contract, adds a new responsive dimension to every homepage/chat component, and introduces a second host (a floating widget) for the AI concierge UI. It does not change the AI concierge's backend behavior, the config data model, or any Part 1–8 scope — only how the existing UI reflows and how the chat surface is presented at wide viewports.

## Decisions

1. **Breakpoint**: one additional breakpoint, Tailwind's default `lg:` (1024px). No tablet-specific tier — below 1024px, the existing mobile layout applies unchanged. Chosen for simplicity: two tiers (mobile, desktop) cover the stated need without a three-way responsive matrix to design and test.
2. **Layout philosophy**: desktop drops the mobile "phone frame floating on a page background" metaphor and becomes a standard full-width responsive marketing site — horizontal nav, multi-column sections — using the same DESIGN.md color/type/radius/shadow tokens as the shared brand language. (Rejected: scaling the mobile card up. It reads as an under-built desktop experience on a large monitor and doesn't match how a real salon site should look on a laptop.)
3. **Desktop container**: centered, `max-width: 1200px`, with responsive horizontal padding.
4. **Chat surface on desktop**: the `ChatFAB` opens a persistent, fixed bottom-right panel (~400px wide) that overlays the current page in place — no navigation away from the homepage, similar to a typical booking-concierge widget. `/chat` continues to exist as a plain full-page fallback route (used by mobile, and available as a direct/shareable link on desktop). The panel and the route render the *same* chat UI components; only the host container differs. (Rejected: full-page takeover identical to mobile — feels like a mobile page stretched onto a desktop screen and contradicts the point of building a desktop-specific experience.)
5. **Component architecture**: no parallel desktop-only components. Every Part 4/6 component gains `lg:`-prefixed Tailwind variants in place, plus one new component — a desktop chat widget host — that wraps the existing chat UI in a fixed-position panel. This keeps one source of truth per section instead of two components drifting apart.
6. **Sequencing**: Parts 1–8 (mobile MVP, including the working AI concierge end-to-end) ship first, exactly as already planned in `docs/PLAN.md`. Desktop is two new phases appended after Part 8:
   - **Part 9 — Desktop homepage layout**: header/nav, hero, services, reviews, find-us, footer.
   - **Part 10 — Desktop AI concierge widget**: the floating bottom-right chat panel, reusing Part 6's chat UI.

## Section-by-section desktop treatment (Part 9)

| Section | Mobile (unchanged) | Desktop (`lg:`) |
|---|---|---|
| Header | Salon name + hamburger → full-screen nav overlay | Salon name + inline nav links + phone + Book Now, no hamburger |
| Hero | Image stacked above H1/copy/CTAs | Two columns: copy + CTAs beside the hero `ImageSlot` |
| Services | 2-column grid | 4-column grid (all 4 services in one row) |
| Availability strip | Full-width tinted bar | Same content, wider bar within the 1200px container |
| Reviews | Horizontal scroll-snap carousel | Static 3-column grid, no scrolling |
| Find us | Map placeholder stacked above address/hours | Two columns: map beside address/hours |
| Footer | Small centered text line | Same content, wider |

`ImageSlot` and the Part 3 primitives (`Button`, `PulsingDot`, `StarRating`, `SectionHeading`) need no changes — none of them hardcode the 430px constraint; that lives in each page section's container, which is exactly what Part 9 edits.

## Chat widget architecture (Part 10)

- A new `DesktopChatWidget` component, rendered only at `lg:` and up, mounted once in the root layout (or homepage) alongside the existing mobile `ChatFAB`/`ChatPreviewSheet`.
- `ChatFAB`'s click behavior branches on viewport: below `lg:`, unchanged (opens the mobile preview sheet / links to `/chat`); at `lg:` and up, toggles `DesktopChatWidget` open/closed in place.
- `DesktopChatWidget` renders the same `ChatThread`, `MessageBubble`, `QuickReplyChips`, `BookingConfirmationCard`, and `HandoffForm` components Part 6 builds for `/chat` — those components must not assume a full-viewport host (no `100vh`/full-screen-only sizing), so they drop cleanly into a fixed ~400×600px panel.
- No backend changes: the widget calls the same `/api/chat` route Part 5 builds.

## Docs affected

- `design/DESIGN.md`: replace the mobile-only scope/non-goal with a new "Desktop layout" section documenting the breakpoint, container width, and per-section treatment above.
- `AGENTS.md`: remove "any desktop-specific layout" from Limitations; note the `lg:` breakpoint in Technical Decisions and Design System.
- `docs/PLAN.md`: append Part 9 and Part 10 (Tasks/Tests/Success criteria, same format as existing parts); update "Current implementation status" to Parts 1–10.
- Jira: two new issues, SCRUM-15 (Part 9) and SCRUM-16 (Part 10).

## Out of scope

- Tablet-specific breakpoint.
- Any change to the booking/notification backend, config schema, or rate limiting.
- Redesigning mobile — mobile stays exactly as scoped in Parts 1–8.
