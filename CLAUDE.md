# WRI Staff Comms — Claude Code Instructions

> Read this file at the start of every session before touching any code.

---

## Project Overview

- **Product:** Staff Communication Tool — restaurant team coordination
- **URL:** https://staff.wireach.tools
- **Repo:** withinreachintl-coder/wri-staff-comms (branch: main)
- **Stack:** Next.js 14.1.0, Supabase, Tailwind CSS, TypeScript, Vercel
- **Stripe:** $29/mo, 14-day free trial
- **Target user:** Restaurant owners replacing WhatsApp group chats
- **Sister product:** Daily Ops Checklist at ops.wireach.tools — this product must look like family

---

## Current State

- Infrastructure only — no features built yet
- Supabase schema exists (5 tables — see below)
- Landing page exists but needs full redesign to match WRI brand
- No auth flow built yet
- No announcement or shift swap features built yet

---

## Design Direction — Non-Negotiable

This product is part of the WRI Tools suite alongside Daily Ops Checklist.
Both products must feel like they came from the same kitchen.
A user of Daily Ops who visits Staff Comms should immediately recognize the brand.

### Aesthetic: Warm Utilitarian — Same as Daily Ops

Same dark, confident, amber-lit feel. Built for busy restaurant operators.
- Dark backgrounds (#1C1917 primary, #141210 deep)
- Amber accent (#D97706) — used sparingly, never overused
- Warm off-white text (#F5F0E8) — never pure white
- Muted warm grays for secondary text (#A89880, #6B5B4E)
- NO light blue backgrounds — ever
- NO purple accents — ever
- NO emoji icons in the UI — use SVG icons only
- NO generic card-on-white-background layouts

### Typography Rules — Identical to Daily Ops

- **Display / Headings:** Playfair Display (serif) — import from Google Fonts
- **Body / UI:** DM Sans — import from Google Fonts
- NEVER use: Inter, Roboto, Arial, system-ui as the primary font
- Heading weight: 700 for hero, 500 for section heads
- Body weight: 300 for paragraphs, 400 for UI labels, 500 for emphasis

### Color System — Shared with Daily Ops

```css
--color-bg-primary: #1C1917;
--color-bg-deep: #141210;
--color-bg-surface: #FAFAF9;
--color-bg-card-dark: rgba(255,255,255,0.04);
--color-accent: #D97706;
--color-accent-hover: #B45309;
--color-accent-muted: rgba(217,119,6,0.15);
--color-text-primary-dark: #F5F0E8;
--color-text-secondary-dark: #A89880;
--color-text-muted-dark: #6B5B4E;
--color-text-primary-light: #1C1917;
--color-text-secondary-light: #78716C;
--color-border-dark: rgba(255,255,255,0.08);
--color-border-light: #E8E3DC;
```

### Component Rules

- Border radius: 4px for buttons/badges, 8px for cards and containers
- Borders: 1px solid with low-opacity — never heavy outlines
- No drop shadows — use border and background contrast instead
- No purple gradients — ever
- No blue primary buttons — amber only for primary CTAs
- Primary button: `background: #D97706; color: #1C1917; border-radius: 4px;`
- Ghost button: `background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #F5F0E8;`

### Landing Page Must Include

- Same nav style as Daily Ops (dark bar, logo left, CTA button right)
- Hero headline using Playfair Display — speaks to the pain of WhatsApp chaos
- Amber CTA button — "Start 14-Day Free Trial"
- Feature highlights: Announcements, Shift Swaps, Read Receipts
- Pricing: $29/mo, 14-day free trial, no credit card
- Footer note: "Part of the WiReach Tools suite" linking to wireach.tools

---

## Code Rules

### TypeScript
- Always handle null explicitly with ternary operators — NOT short-circuit evaluation
- Never use `!` non-null assertions on values that could realistically be null

### Supabase
- Always get org_id from the authenticated user session — never hardcode UUIDs
- Pattern: `supabase.auth.getUser()` → look up org from users/organizations table
- Supabase client: always import from `@/lib/supabase`
- Every page must have a root layout (`app/layout.tsx`)

### Before Every Push
1. Audit ALL imports across all files in `app/` — confirm every module exists
2. Check `package.json` has every dependency that is imported
3. Run `npm run build` locally and confirm it passes before pushing
4. Never push a build you haven't verified locally

---

## Database Tables (Supabase — wri-restaurant-ops project)

| Table | Purpose |
|---|---|
| `organizations` | Org records |
| `users` | User profiles |
| `announcements` | Manager broadcasts to staff |
| `announcement_reads` | Read receipt tracking per user |
| `shift_swaps` | Staff requests, claims, manager approval |

---

## Environment Variables (add to Vercel before first deploy)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`

Use the same Supabase project as wri-restaurant-ops.

---

## Build Priority Order

1. Landing page redesign — match WRI brand (do this first)
2. Auth flow — magic link via Supabase + Resend
3. Announcements feature — create, broadcast, read receipts
4. Shift swap feature — request, claim, manager approve
5. Manager dashboard — see all staff, read rates, pending swaps

---

## Deployment

- Vercel auto-deploys on every push to `main`
- Custom domain: staff.wireach.tools (already configured in Vercel)
- Check vercel.com after pushing to confirm a build triggered

---

## What Success Looks Like

A restaurant owner who uses Daily Ops Checklist should see Staff Comms and think:
*"This is from the same people — I already trust this."*

Not: *"This looks like a completely different product."*
