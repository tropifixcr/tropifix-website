# TropiFix brand book

Source of truth for every TropiFix surface. Tokens live in `tokens.json` and `tokens.css`. Logos are in `../Logos/`, service icons in `../Icons/`.

TropiFix connects homeowners, property managers and hotels with trusted local trade pros: plumbing, electrical, AC, pools and more. We start in Guanacaste, Costa Rica, but the brand is not tied to one region. It should feel like a neighbor who knows every good tradesperson in town: warm, local, quick and dependable.

**Who we talk to:** absentee expat owners, local residents, property managers and hotels. Many of them are not on site, so every message has to be clear enough to act on from far away.

## Voice: the friendly local expert

We sound like someone who lives here, knows the trades and picks up the phone.

- **Warm, not cute.** Friendly and plain. Light humor is fine. Puns and "pura vida" slogans are not.
- **Specific, not salesy.** Name the trade, the area and the next step. "A pool tech in Tamarindo can come Thursday" beats "Top-quality service solutions."
- **Calm about problems.** A leak or a power cut is stressful, so reassure and give the next step. Never use alarm words or fake urgency.
- **"We" and "you".** TropiFix is "we". The customer is "you". Pros are "pros" or "technicians", never "vendors" or "resources".
- **Sentence case** for headings, buttons and menus: "Request a fix", not "Request A Fix".
- **Numbers and places are real.** Use real zone names (Tamarindo–Las Catalinas, Coco–Papagayo), real times ("within 24 hours") and colones or dollars as the customer would see them.
- **No emoji on the site.** In WhatsApp and Instagram, use one at most when it adds warmth. Never use one in a heading.

| Instead of | Write |
| --- | --- |
| Submit your service request | Tell us what needs fixing |
| Our network of vetted vendors | Local pros we've checked and know |
| Don't wait! Book now! | We'll reply on WhatsApp within the hour |
| Leverage our solutions | We'll find the right person for the job |

**Example copy**

- Hero: "Local pros for every fix, from leaky taps to new AC."
- Hero (Spanish): "Profesionales locales para cada arreglo, desde una fuga hasta un aire acondicionado nuevo."
- Request button: "Request a fix"
- WhatsApp first reply: "Hi Ana, thanks for reaching out. Can you send a photo of the leak and your area? We'll match you with a plumber today."
- Empty owner: "Not in Costa Rica right now? Send us photos and we'll handle it while you're away."

## Language

The site is English first, with a full Spanish version. Write each language natively, never as a word-for-word translation. Keep the brand name "TropiFix" and service names consistent in both languages (see Services).

- **Spanish uses "usted"**, the polite Costa Rican default, everywhere: site, WhatsApp, forms and social. Never use "tú" or "vos". Example: "Envíenos una foto y le conseguimos un profesional hoy."

## Tagline

**"Local pros for every fix."** / **"Profesionales locales para cada arreglo."**

Use it under the logo in the site footer, on social profiles, at the end of the job done post, and in email signatures. Don't change its wording.

## Color

- **Sand replaces white.** Every background that would otherwise be white uses `sand`: pages, side areas, modals, emails and social templates. Cards and alternating sections use `sand-deep`. Pure white appears only as `on-teal` text.
- **Teal leads.** Use `teal` for the header or footer band, primary buttons and links. Use `teal-deep` for headings on sand.
- **Coral is the spark.** Use `coral` for the one main action on a screen ("Request a fix") and for small highlights. Coral is a fill, never text on sand. For coral text use `coral-text`, on sand only.
- **Text colors:** `ink` for body text, `ink-muted` for captions and field borders, `on-teal` on teal surfaces, `ink` on coral.
- **Proportions:** roughly 70% sand, 20% teal and 10% coral. If coral appears more than twice on a screen, it stops meaning "act here".
- **Focus ring:** 2px solid `teal-deep` with a 2px `sand` gap on every surface, including on teal bands, where the sand gap carries it.

## Typography

- Set headings in Poppins (`display` family): `display` for the hero, then `h1`, `h2` and `h3`. Use weight 600–700 only, in sentence case.
- Set all reading text in Nunito Sans (`body` family): `body` for paragraphs and form text, `body-strong` for emphasis and prices, `small` for captions and legal text.
- Keep paragraphs to about 65 characters wide. Never set body text in Poppins, because it tires the eye in long blog posts.
- Both are free Google Fonts and support all Spanish accents.

## Logo

Use the files in the Logos group exactly as supplied. Never redraw, recolor or stretch them.

| File | Use it on |
| --- | --- |
| `tropifix-transparent.png` | Sand or other light backgrounds: site header, invoices, documents. The default. |
| `tropifix-white.png` | Teal surfaces and dark or busy photos: hero images, the job done post, the request story. White letters, coral tools. |
| `tropifix-teal.png` | Where a solid teal block is wanted: social banners, the footer, signage. |
| `tropifix-icon.png` | Square spots: profile pictures, app icon, favicon, WhatsApp avatar. |

- **Clear space:** keep empty space on every side equal to the height of the crossed-tools "x".
- **Minimum size:** 120px wide for the wordmark and 32px for the icon. Below that, use the icon.
- **Don't** place the transparent logo on teal, coral or photos (its teal letters disappear), add shadows or outlines, or change the coral tools to another color.
- **On photos,** use `tropifix-white.png` over a darker, calm part of the image, such as sky, shade or a wall. If the area behind it is bright or busy, put the logo on a teal band instead.

## Photography

- Use real local photos: real Guanacaste homes, real pros at work, natural daylight. Avoid stock-model smiles and staged handshakes.
- Show hands and tools at work, finished results (a clear pool, a tidy panel) and the setting: palms, tile roofs, open-air living.
- Light should be warm and natural. Don't apply heavy filters, and don't tint photos teal or coral.
- Crop photos with `radius-md` corners. Get written permission before showing a pro's face, a client's property or a license plate.

## Iconography

Every service has one icon in the Icons group, from the open-source Lucide set: 2px line, rounded ends, drawn in `teal`. For a new service or UI need, pick another Lucide icon so the style stays the same, and never mix in another icon set.

- Show icons at 24px in lists and forms, and at 32–48px on service cards. Always pair an icon with the service name, never use it alone.
- Use `teal` icons on sand and `on-teal` icons on teal. Icons are never coral, except a single highlight on a social post.
- Never use emoji as icons.

## Shape and space

- Spacing comes from `space-2`, `space-4`, `space-6` and `space-12`. Sections are `space-12` apart, and phones keep a `space-4` side gutter.
- Corners are soft: `radius-md` for cards and photos, `radius-pill` for buttons, `radius-sm` for inputs and tags.
- Cards on sand use a `sand-deep` fill, with no drop shadows and no colored side borders.

## Services (official names)

Use these names everywhere, on the site, in forms and on WhatsApp:
Plumbing · Electrical · AC & HVAC · Landscaping & gardening · Handyman & carpentry · Painting · Locksmith · Appliance repair · Pool care · Pest control · Generators & backup power · Water systems · Roofing · Mold & humidity · Pressure washing · Tree trimming · Septic service · Solar · Wi-Fi & smart home · Security & property checks · Cleaning & turnovers

## Icons (technical)

One icon per service, all drawn in a single line style with a 2px stroke and rounded ends that echo the logo's tools. They're taken from the open-source Lucide set (ISC license, free for commercial use). Each file is drawn in `teal` (#026265) for use on `sand` and `sand-deep`. For icons on teal, use the same Lucide icon with its stroke set to `on-teal`. File names match the service names in the README.

## Logo files (technical)

The official TropiFix logo files. Use the transparent wordmark on sand or other light backgrounds, the white wordmark on teal or dark photos, the teal wordmark as a solid block, and the icon for square spots (avatars, app icon, favicon). The wordmark ink is `teal-deep` (white in the white version), the tools are `coral`, and the teal field is `teal`.
