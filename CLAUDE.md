# TropiFix

A rent-a-site lead business for trade services in Guanacaste, Costa Rica. TropiFix builds very simple single-category websites (for example, one for AC and HVAC), gets each one to rank in Google and in AI answers, and rents each site to one local provider for a monthly fee. Planning phase; no category site is built yet. The first three, launched together, are AC and HVAC (guanacasteac.com), pest control (guanacastebugcontrol.com) and roofing (guanacasteroofing.com), covering Tamarindo – Las Catalinas plus Coco – Papagayo (plan in the project brief, see below). Domain owned: tropifixcr.com.

This direction was set on 13 October 2026. It replaces the earlier plan of one marketplace site covering every trade, with TropiFix following up on each lead.

Read the project brief, `../tropifix-planning/project-context.md`, for the business model, zones, services and decisions. It lives in the private repo `tropifixcr/tropifix-planning`, cloned next to this folder; pull it before starting work. If it is missing, ask Loic or JP to clone it rather than working without it. Read `brand/BRAND.md` before any design, copy or visual work.

## The model in short

1. **Build:** one simple site per service category, per area (the area is the service range of the provider who rents it).
2. **Rank:** first page of Google for that category in the area, and cited in AI answers (AEO). Ranking is the test of whether a site works.
3. **Prove:** the site collects leads through a request form and a phone number. Loic uses those leads to approach providers.
4. **Trial:** a provider receives the site's leads for about a week.
5. **Rent:** the provider pays a monthly fee, and the form and phone number go straight to them. TropiFix does no lead tracking, follow-up or customer feedback.
6. **Swap:** a provider who stops paying is removed, and the site is rented to the next one.

## What is in this repo: a reference, not the base

The Astro site in `src/` is the earlier single-site marketplace build. It is kept as a reference.

- Do not extend or rework it unless Loic asks.
- New category sites start from scratch. Reuse the information in the existing category pages and data (`src/data/services*.ts`, `src/i18n/`), not the pages themselves.
- The lead follow-up process designed on 13 October 2026 (pro accepts or declines, customer confirms contact, backup pros) is also reference only. It is summarised in the project brief.

## Folder map

- `brand/BRAND.md`: the brand book (voice, color, type, logo, photo, icon and shape rules). Source of truth.
- `brand/tokens.css` and `brand/tokens.json`: design tokens. Import the CSS or map the JSON into the site's theme. Do not hardcode hex values.
- `brand/social-templates.html` and `.md`: Instagram and Facebook layouts.
- `Logos/`: `tropifix-transparent.png` (on sand), `tropifix-white.png` (on teal and dark photos), `tropifix-teal.png` (solid teal block), `tropifix-icon.png` (square: favicon, avatar). Use as supplied. Never redraw, recolor or stretch.
- `Icons/`: 21 service icons (Lucide, teal SVG), named after the services.
- `../tropifix-planning/` (private repo `tropifixcr/tropifix-planning`, not in this folder): the project brief `project-context.md` and `Partner Outreach/`. When a decision changes, update the brief there, then commit and push so the other person gets it.
- `docs/`: `go-live-domain-checklist.md`, `phone-test-checklist.md`, `image-inventory.md`. All three were written for the reference site.
- `src/`: the reference Astro site. Copy lives in `src/i18n/` and `src/data/`; settings in `src/data/settings.ts` and `site.config.mjs`.

## Non-negotiable brand rules

These apply to anything that carries the TropiFix name, including tropifixcr.com. The category sites do not: each stands alone under its own name (Guanacaste AC, Guanacaste Bug Control, Guanacaste Roofing) with no TropiFix branding, and gets its own look so the three do not read as copies (decided 16 October 2026). The standing rules below apply to every site. tropifixcr.com will become a separate TropiFix site that links to the three.

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

## Standing rules for every site, page, post and image

**Mobile first.** Build for the phone, then scale up. Check 360px, 390px, 768px and desktop, portrait and landscape: no sideways scroll, no cut-off or overlapping text. Tap targets at least 44×44px. Body and form text at least 16px. Correct `type` and `autocomplete` on fields. Animate only transform and opacity, and respect `prefers-reduced-motion`. Targets: LCP under 2.5s, INP under 200ms, CLS under 0.1, Lighthouse 90+ on mobile.

**SEO and AEO on every page.** Ranking is what TropiFix sells, so this comes first on a category site. Every page needs a title (under 60 characters), a description (under 160), one H1, a logical heading order, alt text on images, a sitemap entry and JSON-LD where it applies. Answer the questions people actually ask, plainly, so search engines and AI answers can quote the page. Use the town names naturally; no keyword stuffing. On the reference site this is enforced by `src/layouts/Base.astro`, `src/pages/sitemap.xml.ts`, `src/data/schema.ts` and `npm run build`.

**Honest about who answers.** A category site must not pose as a company that does not exist. Say plainly that requests and calls go to a local partner provider, and get consent before a visitor's details are shared (Costa Rica's Ley 8968).

**Higgsfield cost approval.** All images and video are made with Higgsfield, never another generator or stock site. Before generating anything: show a table (asset, where it goes, prompt, model, size, video length, cost in credits from Higgsfield's own quote), the batch total and the current balance, then wait for Loic's OK. Run exactly that list. Any retry, model change or extra asset needs a new OK. Show Loic every generated image and wait for his approval or edit request before putting it on the site or rendering a video from it. Afterwards report credits spent and update `docs/image-inventory.md`. On the reference site, generated images are placeholders for the hero and share image only. On the category sites, Claude generates the images for the placeholders in JP's article docs (decided 16 October 2026); each batch still goes through this approval. Generated images may show equipment, parts, buildings and conditions, and never show a fake person, customer, finished job presented as real, or brand.

**How changes ship.** Work on a branch, open a pull request, let Netlify build the preview and the tests run. Loic merges; Claude never merges to `main`. Test form submissions use `?test` and are never sent by automated tests.

**Facts.** Ask before writing prices, response times, zone dates, number of providers or guarantees. Confirmed so far: free for the customer; the provider pays a monthly fee to rent the site; the first three sites are AC and HVAC, pest control and roofing, on guanacasteac.com, guanacastebugcontrol.com and guanacasteroofing.com. Not confirmed: the fee and the trial length. The "contact within 4 hours" promise belonged to the earlier model: do not put it on a category site.

**Placeholders.** The reference site still has unfilled values: `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_CONTACT_EMAIL`, `PUBLIC_LEGAL_ENTITY_NAME`, the GA4 ID, the privacy retention period. List them at the end of any session that touches the reference site. For a category site, list its own unfilled values at the end of every session.

## Working style

- Stage-appropriate and lean: the project is at the planning stage and the team is two people part-time. Build the simplest thing that works; do not add infrastructure a rented site does not need.
- Loic wants blunt, honest advice, not cheerleading. Say when something is a bad idea.
- Ask before replacing copy that states facts about the business (prices, zones, response times).
- A category site has one job: rank, then turn a visitor into a form request or a phone call. Everything else is cut.

## Skills available in this folder

- `impeccable` (in `.claude/skills/`): design commands such as `/impeccable init`, `audit`, `critique`, `polish`. Run `/impeccable init` first and point it at `brand/BRAND.md` so PRODUCT.md and DESIGN.md carry these brand rules. If Impeccable's defaults conflict with the brand book, the brand book wins.
- `design-taste-frontend`, if saved to the Claude account: an anti-template frontend skill. Where it conflicts with the brand book (it discourages cream backgrounds and Lucide icons, and expects dark mode), the brand book wins. Light only for now.

## Who

- Loic Hervot: brand, websites, domains, provider outreach and sales.
- JP (partner): content and SEO. He does not work in GitHub; Loic uploads everything. JP writes one Google Doc per article in the Drive folder `Tropifixcr`, in the site's subfolder: SEO data at the top, then the content, with image placeholders that Claude fills with Higgsfield images (cost approval first). The template is JP's (not final yet). When Loic asks, Claude reads the doc, builds the page in English and Spanish in `tropifixcr/guanacaste-sites`, and opens a pull request; Loic merges. Once the sites are live, JP gets Search Console access to plan articles from the data. Facts in the doc's "needs Loic's OK" part stay off the site until it says "Confirmed by Loic: yes". The lead agent and WhatsApp automation belonged to the earlier model and are on hold.
