# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro static site on Netlify, plain CSS on `brand/tokens.css`, Netlify Forms for leads. No database, accounts or CMS. Decided with Loic on 2 October 2026.

## Users

- Absentee expat owners of homes in Guanacaste, often abroad and on a phone, who lack local trade contacts. The primary user.
- Local residents and self-managing owners.
- Property managers and hotels (secondary; they often have their own contacts).

Most arrive on a phone from Instagram, Facebook or Google with a specific problem: a leak, a dead AC, a green pool.

## Product Purpose

TropiFix connects a property owner with one local trade pro per trade, per zone. The website's one job is the request form: the visitor describes the problem, adds photos and their area, and the lead goes to TropiFix's central WhatsApp number and email. Success is a submitted request that gets answered.

## Positioning

One pro per trade per zone, with TropiFix following up with both sides to confirm contact happened. Free for the customer; the pro pays.

## Operating Context

- Zone 1 (live): Tamarindo to Las Catalinas, with every beach and town named. Papagayo–Coco next; Nosara–Sámara, Santa Teresa and Liberia planned.
- Requests from other zones are accepted with an honest confirmation and no response-time promise.
- WhatsApp is the main channel after the form.
- English first, full Spanish version under `/es/`, Spanish in "usted".

## Capabilities and Constraints

- 21 services with official names (see `brand/BRAND.md`), plus "Other / not sure".
- Response time: the pro contacts the customer within 4 hours (set in the pro's contract); TropiFix follows up with both.
- No pros signed yet. Do not describe the roster, vetting process, prices or guarantees until Loic confirms them.
- The site stays on `netlify.app`, blocked from search engines, until the real domain goes live.
- Costa Rica's Ley 8968 applies: consent before sharing a request with a provider. Legal entity not registered yet (launch blocker).

## Brand Commitments

`brand/BRAND.md` is the source of truth and wins over any Impeccable default: sand replaces white, teal leads, coral only for the one main action, Poppins headings and Nunito Sans body, sentence case, Lucide icons in teal, soft corners, no drop shadows, no emoji, light theme only. Logos in `Logos/` are used as supplied. Tagline: "Local pros for every fix." / "Profesionales locales para cada arreglo."

## Evidence on Hand

- Logos (`Logos/`) and 21 service icons (`Icons/`).
- No real photos, no testimonials, no completed jobs, no named pros. None may be invented. Generated images are limited to the hero and share image, and are listed in `docs/image-inventory.md` as placeholders.

## Product Principles

1. The request form comes first; everything else supports it.
2. Never promise what the business cannot deliver, especially outside Zone 1.
3. Clear enough to act on from far away, on a phone.
4. Lean: two people part-time run this.

## Accessibility & Inclusion

Text contrast at least 4.5:1, a visible 2px `--teal-deep` focus ring, full keyboard use of the form, 44px tap targets, and `prefers-reduced-motion` respected. Phone first.
