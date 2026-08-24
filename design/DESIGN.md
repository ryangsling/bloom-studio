---
name: bloom-studio-design-system
version: 1.0.0
source: Bloom_Studio_dc.html (Claude Design prototype, 2 screens)
status: locked
scope: mobile-first, with a desktop-optimized layout at the lg breakpoint (see "Desktop layout" section)

color:
  background_page: "#E8E1D6"
  background_surface: "#FBF6F1"
  background_surface_alt: "#F4E9E2"
  background_image_placeholder: "#ECE1D6"
  background_image_placeholder_alt: "#E6D9CC"
  text_primary: "#2B2622"
  text_secondary: "#6B6157"
  text_muted: "#8A7F72"
  text_faint: "#948A7C"
  text_placeholder: "#A9997F"
  border_hairline: "rgba(43,38,34,.08)"
  border_hairline_light: "rgba(43,38,34,.06)"
  border_input: "rgba(43,38,34,.15)"
  border_input_focus_ring: "rgba(43,38,34,.1)"
  accent_default: "#C1592E"
  accent_options: ["#C1592E", "#A8722F", "#B2451F", "#8C5A3C"]
  accent_on_color: "#FFFDFB"
  secondary_button_bg: "#F3E6C6"
  secondary_button_text: "#5B4A1E"
  secondary_button_border: "#C79A3E"
  status_online_dot: "#6E8B5C"
  overlay_scrim: "rgba(43,38,34,.4)"

typography:
  font_display:
    family: "Newsreader"
    source: "Google Fonts, weights 400;500;600 roman + 400;500 italic"
    usage: "headings, salon name, prices, booking confirmation title, review quotes"
    style_note: "always italic at weight 500 for h1/h2/salon-name; roman for prices"
  font_body:
    family: "Karla"
    source: "Google Fonts, weights 400;500;600;700"
    usage: "body copy, buttons, labels, nav, chat messages, UI chrome"

type_scale:
  h1_hero: "italic 500 32px/1.15 Newsreader"
  h2_section: "italic 500 22px/1 Newsreader"
  salon_name_header: "italic 500 22px/1.01em Newsreader"
  nav_menu_item: "500 26px/1 Newsreader"
  body: "400 15px/1.6 Karla"
  body_small: "400 13px/1.6 Karla"
  label_bold: "600 14px/1.3 Karla"
  price: "600 15px/1 Newsreader"
  duration_caption: "400 12px/1 Karla"
  eyebrow_label: "600 11px/1 Karla, letter-spacing .14em, uppercase"
  chat_message: "400 13.5-14px/1.5-1.55 Karla"
  button_label: "600 15px Karla"
  micro_caption: "500 11.5px/1 Karla, letter-spacing .04em"

spacing_scale: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 26, 28, 36, 56, 64]

radius_scale:
  small: "8px"
  medium: "10px"
  large: "12-14px"
  card: "14px"
  panel: "20px"
  pill: "20px full"
  circle: "50%"

shadow:
  card_elevation: "0 24px 60px -24px rgba(43,38,34,.4), 0 1px 0 rgba(43,38,34,.06)"
  chat_bubble_fab: "0 10px 24px -8px rgba(43,38,34,.5)"
  chat_panel_slideup: "0 -12px 30px -12px rgba(43,38,34,.3)"

layout:
  frame_width: "430px, max-width 100%"
  chat_screen_height: "820px fixed"
  chat_sheet_height: "78% of frame, slides up from bottom"
  viewport_target: "mobile-first; desktop-optimized layout added at the lg breakpoint"
  grid_services: "2-column grid, 12px gap (mobile); 4-column at lg"
  desktop_breakpoint: "1024px (Tailwind lg:) — single added tier, no tablet-specific breakpoint"
  desktop_container_max_width: "1200px, centered, responsive horizontal padding"
  desktop_chat_widget: "fixed bottom-right panel, ~400px wide, ~600px tall, overlays the page in place"

motion:
  pulse_ring: "scale 1→2, opacity .55→0, 2-2.4s ease-out infinite — used on availability dot and chat FAB"
  typing_dot: "opacity/translateY bounce, 1.2s infinite, staggered .15s per dot — 3-dot typing indicator"
  slide_up: "translateY 100%→0, .25s ease-out — chat sheet entrance"
---

# Bloom Studio Design System

Locked visual reference extracted from the Claude Design prototype (`Bloom_Studio_dc.html`). This documents what the two prototype screens actually specify. Treat all values above as final for phase 1, don't restyle during the build, only implement.

## Screens in scope

1. **Homepage** — hero, popular services grid, availability strip, reviews carousel, find-us/hours block, persistent chat FAB, slide-up chat preview sheet.
2. **AI Receptionist Conversation** — full-screen chat thread, quick-reply chips, booking confirmation card, human-handoff form.

Nothing beyond these two is specified here. Booking deposit flow, waitlist, owner dashboard, and rebooking automation are explicitly out of scope for this design system.

## Layout & structure

- Below the `lg` breakpoint (1024px): single mobile card frame, 430px wide (max-width 100%), rounded 20px, floated on a warm neutral page background (`#E8E1D6`) with generous 56/16px page padding. The frame itself is the "phone screen."
- At `lg` and up: see "Desktop layout" below — the card-frame metaphor is dropped in favor of a standard full-width responsive layout in a 1200px container, using the same tokens.
- Vertical rhythm inside the mobile frame is section-based: each content block (hero, services, availability, reviews, find-us) has its own padding block rather than a shared container gutter, keep this per-section padding pattern rather than converting to a single global gutter.

## Desktop layout (≥1024px, Tailwind `lg:`)

Added scope, design captured in `docs/superpowers/specs/2026-08-24-desktop-layout-expansion-design.md`. One additional breakpoint only — no tablet-specific tier, mobile layout applies unchanged below it. Every section below extends its existing mobile component with `lg:` variants; no parallel desktop-only components.

| Section | Mobile (unchanged) | Desktop (`lg:`) |
|---|---|---|
| Header | Salon name + hamburger → full-screen nav overlay | Salon name + inline nav links + phone + Book Now, no hamburger |
| Hero | Image stacked above H1/copy/CTAs | Two columns: copy + CTAs beside the hero `ImageSlot` |
| Services | 2-column grid | 4-column grid (all 4 services in one row) |
| Availability strip | Full-width tinted bar | Same content, wider bar within the 1200px container |
| Reviews | Horizontal scroll-snap carousel | Static 3-column grid, no scrolling |
| Find us | Map placeholder stacked above address/hours | Two columns: map beside address/hours |
| Footer | Small centered text line | Same content, wider |
| Chat | `ChatFAB` → slide-up preview sheet → `/chat` full-page route | `ChatFAB` → persistent fixed bottom-right panel (~400×600px) overlaying the page in place, rendering the same chat UI as `/chat` (kept as a fallback route) |

## Component inventory

| Component | Behavior |
|---|---|
| `Header` | Salon name (italic serif) + hamburger toggle, opens full-screen nav overlay with menu links, phone number, and a Book Now CTA |
| `ImageSlot` | Placeholder rect for hero photo and each service card photo; not a static gradient, an explicit droppable image region (see `image-slot.js`) |
| `Hero` | H1 + supporting paragraph + two CTAs side by side (primary "Book now" filled, secondary "Ask our salon assistant" outlined with 3-dot icon) |
| `TrustLine` | Single small text line under the CTAs: commission-free / book-direct messaging |
| `TrustIndicators` | Inline row: star rating, established year, "As seen on Instagram" |
| `ServiceCard` | Image slot + name + price (accent color, serif) + duration, 2-column grid, `sc-for` over a `services` list |
| `AvailabilityStrip` | Pulsing status dot + "Next available" text + inline Book link, in a tinted surface block |
| `ReviewCard` | Horizontally scrollable, snap-aligned, star row + italic quote + name/service attribution |
| `FindUs` | Map placeholder + address + hours table (day/time rows) |
| `ChatFAB` | Fixed circular button, bottom-right, pulsing ring, opens the chat sheet |
| `ChatPreviewSheet` | Slide-up panel (78% height) with a short message preview and a "Continue in full chat" CTA into Screen 2 |
| `ChatThread` (Screen 2) | Full-screen header (back arrow, avatar initials, name, online status) + scrollable message list |
| `MessageBubble` | Two variants: user (accent fill, right-aligned) and bot (surface fill, bordered, left-aligned) |
| `TypingIndicator` | 3-dot bounce animation, bot-side bubble |
| `QuickReplyChips` | Outlined pill buttons for slot selection, wraps to multiple rows |
| `BookingConfirmationCard` | Appears after slot selection: service + stylist, time/address, "Add to calendar" CTA |
| `HandoffPrompt` + `HandoffForm` | Underlined text link that reveals a name/phone capture form with a "Request a callback" CTA |
| `MessageInputBar` | Disabled-looking text field placeholder + circular send button (footer, both screens conceptually share this pattern on Screen 2) |

## Interaction / state notes

- Chat has two independent open states: a **preview sheet** on the homepage (contextual, partial height, teaser messages) and a **full conversation** on Screen 2 (navigated via anchor/route, not a modal). Both must exist, they are not the same component at different sizes.
- `showHandoffForm` and `bookingSelected` are independent boolean states that reveal additional content inline, not separate screens.
- Nav overlay, chat preview sheet, and chat full-screen all use the same slide/overlay visual language (scrim + rounded-top sheet or full-bleed overlay), keep this consistent if adding new overlays later.

## Content / data model

Every piece of salon-specific content is already externalized as named fields (see the prototype's props schema), the production data model should mirror this directly:

- **Salon**: `salonName`, `area`, `accent` (from the 4-color palette, or an exact brand hex), `established`, `rating`, `phone`, `addressLine1`, `postcode`
- **Services**: array of `{ name, price, duration }`, currently 4 items
- **Reviews**: array of `{ quote, name, service }`, currently 3 items
- **Hours**: array of `{ day, time }`, currently 4 rows (supports ranges like "Tue – Fri")
- **AI assistant demo content**: `chatServiceName`, `chatServicePrice`, `chatStylist`, `slot1`, `slot2`, `nextAvailable` — these drive the scripted example conversation and must stay consistent with the `services` list (the demo currently hardcodes Balayage/Priya as the example, not a random service)

## Explicit non-goals for this design system

- No tablet-specific breakpoint (mobile layout persists until the `lg` desktop breakpoint)
- No dark mode
- No component states beyond what's listed above (no loading skeletons, no error states specified, define these during build using the existing color/motion tokens, don't invent new ones)
- No real photography specified, all image regions are explicit placeholders pending real assets
