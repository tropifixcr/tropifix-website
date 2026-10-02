# Go-live checklist: connecting tropifixcr.com

Run this when the site is ready to leave `tropifixcr.netlify.app`. Until step 4 is done, search engines stay blocked.

## Before you start (launch blockers)

- [ ] Legal entity name set (`PUBLIC_LEGAL_ENTITY_NAME`) and shown on the privacy page.
- [ ] Retention period written on both privacy pages.
- [ ] Real WhatsApp number set (`PUBLIC_WHATSAPP_NUMBER`).
- [ ] Spanish copy reviewed by a native speaker.
- [ ] Service page copy reviewed by JP.
- [ ] At least the pros needed to honour "within 4 hours" in Zone 1 are signed.

## 1. Add the domain in Netlify

Netlify → project `tropifixcr` → Domain management → Add a domain → `tropifixcr.com`. Add `www.tropifixcr.com` as well and set `tropifixcr.com` (no www) as the primary domain.

## 2. Point DNS (choose one)

**Option A: Netlify DNS (simplest).** Netlify gives you four nameservers. At the registrar where you bought the domain, replace the nameservers with those four. Netlify then manages every DNS record.

**Option B: keep DNS at the registrar.** Add these records there:

| Type | Name | Value |
| --- | --- | --- |
| A (or ALIAS/ANAME if offered) | `@` | the load balancer address Netlify shows on the domain page |
| CNAME | `www` | `tropifixcr.netlify.app` |

Choose B if you already have other records at the registrar that you want to manage there.

Either way, changes can take from a few minutes to a day to spread.

## 3. HTTPS and redirects

- [ ] Netlify → Domain management → HTTPS: wait for the certificate, then check "Force HTTPS".
- [ ] `www.tropifixcr.com` redirects to `https://tropifixcr.com` (automatic once the primary domain is set).
- [ ] `tropifixcr.netlify.app` redirects to `https://tropifixcr.com` (automatic for the primary domain; open the old address to confirm).

## 4. Switch the site address (the one-line change)

- [ ] Netlify → Environment variables → add `SITE_URL` = `https://tropifixcr.com`.
- [ ] Deploys → Trigger deploy.
- [ ] Open `https://tropifixcr.com/robots.txt`: it must say `Allow: /` and list the sitemap.
- [ ] View the source of the home page: no `noindex` tag, and the canonical link starts with `https://tropifixcr.com`.

## 5. Google Search Console

- [ ] Add the property `tropifixcr.com` (domain property; verify with the DNS TXT record Google gives you).
- [ ] Sitemaps → submit `https://tropifixcr.com/sitemap.xml`.
- [ ] URL inspection → test the home page and one service page in each language.
- [ ] Run the home page and one service page through Google's Rich Results Test.

## 6. Email on the domain (later)

A domain email such as `hola@tropifixcr.com` needs MX records (plus SPF and DKIM TXT records) from the email provider. These live beside the website records and do not affect the site.

- With Netlify DNS: add them under Domain management → DNS records.
- With registrar DNS: add them at the registrar.
- Then update `PUBLIC_CONTACT_EMAIL` and the address in Forms → Form notifications.

## If something breaks

Netlify → Deploys → pick the last working deploy → "Publish deploy". This rolls the live site back in one click and does not touch the code.
