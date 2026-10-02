# TropiFix

Marketplace and lead funnel connecting property owners, managers and hotels in Guanacaste, Costa Rica with local trade pros. Planning phase; the website is the first thing to build. Domain: tropifixcr.com.

Read `docs/project-context.md` for the business model, zones, services and decisions. Read `brand/BRAND.md` before any design, copy or visual work.

## Folder map

- `brand/BRAND.md`: the brand book (voice, color, type, logo, photo, icon and shape rules). Source of truth.
- `brand/tokens.css` and `brand/tokens.json`: design tokens. Import the CSS or map the JSON into the site's theme. Do not hardcode hex values.
- `brand/social-templates.html` and `.md`: Instagram and Facebook layouts.
- `Logos/`: `tropifix-transparent.png` (on sand), `tropifix-white.png` (on teal and dark photos), `tropifix-teal.png` (solid teal block), `tropifix-icon.png` (square: favicon, avatar). Use as supplied. Never redraw, recolor or stretch.
- `Icons/`: 21 service icons (Lucide, teal SVG), named after the services.
- `docs/project-context.md`: the project brief (kept out of the public repo).
- `docs/`: `go-live-domain-checklist.md`, `phone-test-checklist.md`, `image-inventory.md`.
- `src/`: the Astro site. Copy lives in `src/i18n/` and `src/data/`; settings in `src/data/settings.ts` and `site.config.mjs`.

## Non-negotiable brand rules

1. **Sand replaces white.** Every background that would be white is `--sand` (#F6F1E7). Cards and alternating sections use `--sand-deep`. Never a pure white background. Sand is not part of the logo.
2. **Colors:** teal #026265 leads, coral #F77051 is the accent (fills only, one main action per screen; never coral text on sand, use `--coral-text` #B4452B). Text is `--ink` #173332. See `brand/tokens.css` for the rest.
3. **Fonts:** Poppins (600/700) for headings, Nunito Sans for body text. Sentence case everywhere.
4. **Voice:** friendly local expert. Warm, plain and specific. No hype words, no fake urgency.
5. **Languages:** English first, full Spanish version. Spanish uses "usted". Write each language natively.
6. **Emoji:** none on the site. At most one in a WhatsApp or Instagram message.
7. **Tagline:** "Local pros for every fix." / "Profesionales locales para cada arreglo."
8. **Logo on photos:** use the white logo over a calm, darker area, or put the logo on a teal band. Never put the transparent (teal) logo on teal, coral or photos.
9. **Photos:** real local Guanacaste photos. No stock-model smiles. Placeholders must be clearly marked.
10. **Shapes:** soft corners (radius 6, 12, pill for buttons), no drop shadows, no colored left-border cards.
11. **Accessibility:** text at least 4.5:1 contrast, visible focus ring (2px `--teal-deep`), the site must work on a phone first.

## Standing rules for every page, post and image

**Mobile first.** Build for the phone, then scale up. Check 360px, 390px, 768px and desktop, portrait and landscape: no sideways scroll, no cut-off or overlapping text. Tap targets at least 44×44px. Body and form text at least 16px. Correct `type` and `autocomplete` on fields. Animate only transform and opacity, and respect `prefers-reduced-motion`. Targets: LCP under 2.5s, INP under 200ms, CLS under 0.1, Lighthouse 90+ on mobile.

**SEO on every page.** Use `src/layouts/Base.astro`, which requires a title (under 60 characters), a description (under 160), and the page's address in both languages. Every page needs one H1, a logical heading order, alt text on images, a Spanish twin under `/es/` written natively, and an entry in `src/pages/sitemap.xml.ts`. Service pages come from `src/data/services*.ts`, never hand-copied files. Add JSON-LD where it applies (`src/data/schema.ts`). Use the Zone 1 town names naturally; no keyword stuffing. `npm run build` fails if any of this is missing.

**Higgsfield cost approval.** All images and video are made with Higgsfield, never another generator or stock site. Before generating anything: show a table (asset, where it goes, prompt, model, size, video length, cost in credits from Higgsfield's own quote), the batch total and the current balance, then wait for Loic's OK. Run exactly that list. Any retry, model change or extra asset needs a new OK. Show Loic every generated image and wait for his approval or edit request before putting it on the site or rendering a video from it. Afterwards report credits spent and update `docs/image-inventory.md`. Generated images are placeholders for the hero and share image only, and never show a fake job, person, customer or brand.

**How changes ship.** Work on a branch, open a pull request, let Netlify build the preview and the tests run. Loic merges; Claude never merges to `main`. Test form submissions use `?test` and are never sent by automated tests.

**Facts.** Ask before writing prices, response times, zone dates, number of pros or guarantees. Confirmed so far: free for the customer; a pro makes contact within 4 hours in Zone 1.

**Placeholders.** List any still unfilled at the end of every session: `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_CONTACT_EMAIL`, `PUBLIC_LEGAL_ENTITY_NAME`, the GA4 ID, the privacy retention period.

## Working style

- Stage-appropriate and lean: the project is at the planning stage and the team is two people part-time. Build the simplest thing that works; do not add infrastructure the lead funnel does not need yet.
- Loic wants blunt, honest advice, not cheerleading. Say when something is a bad idea.
- Ask before replacing copy that states facts about the business (prices, zones, response times).
- The site's primary job is the request form: a visitor describes a problem, adds photos and their area, and the lead goes to the central WhatsApp number and the lead agent. Everything else supports that.

## Skills available in this folder

- `impeccable` (in `.claude/skills/`): design commands such as `/impeccable init`, `audit`, `critique`, `polish`. Run `/impeccable init` first and point it at `brand/BRAND.md` so PRODUCT.md and DESIGN.md carry these brand rules. If Impeccable's defaults conflict with the brand book, the brand book wins.
- `design-taste-frontend`, if saved to the Claude account: an anti-template frontend skill. Where it conflicts with the brand book (it discourages cream backgrounds and Lucide icons, and expects dark mode), the brand book wins. Light only for now.

## Who

- Loic Hervot: brand, website, domain, contractor outreach, WhatsApp edge cases.
- JP (partner): content and SEO, lead agent, WhatsApp automation.
