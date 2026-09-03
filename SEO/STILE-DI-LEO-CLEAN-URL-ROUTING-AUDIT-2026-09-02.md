# Stile di Leo — Clean URL / .HTML Routing Audit & Safe Fix

Date: 2026-09-02  
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`  
Production checked: `https://stiledileo.com/`

## A. Current Production Behavior

Production currently serves clean URL variants as independent HTTP `200` pages for static `.html` documents.

Representative production checks before the local fix:

| URL | HTTP Status | Redirects | Final URL | Canonical Found | Indexability |
|---|---:|---:|---|---|---|
| `/fireplace-wall-vancouver` | 200 | 0 | `/fireplace-wall-vancouver` | `/fireplace-wall-vancouver.html` | index, follow |
| `/fireplace-wall-vancouver.html` | 200 | 0 | `/fireplace-wall-vancouver.html` | `/fireplace-wall-vancouver.html` | index, follow |
| `/marmorino-vancouver` | 200 | 0 | `/marmorino-vancouver` | `/marmorino-vancouver.html` | index, follow |
| `/marmorino-vancouver.html` | 200 | 0 | `/marmorino-vancouver.html` | `/marmorino-vancouver.html` | index, follow |
| `/venetian-plaster-vancouver` | 200 | 0 | `/venetian-plaster-vancouver` | `/venetian-plaster-vancouver.html` | index, follow |
| `/venetian-plaster-vancouver.html` | 200 | 0 | `/venetian-plaster-vancouver.html` | `/venetian-plaster-vancouver.html` | index, follow |
| `/feature-wall-vancouver` | 200 | 0 | `/feature-wall-vancouver` | `/feature-wall-vancouver.html` | index, follow |
| `/feature-wall-vancouver.html` | 200 | 0 | `/feature-wall-vancouver.html` | `/feature-wall-vancouver.html` | index, follow |
| `/projects` | 200 | 0 | `/projects` | `/projects.html` | index, follow |
| `/projects.html` | 200 | 0 | `/projects.html` | `/projects.html` | index, follow |
| `/brookswood-langley-fireplace-transformation` | 200 | 0 | clean URL | `.html` canonical | index, follow |
| `/west-vancouver-fireplace-transformation` | 200 | 0 | clean URL | `.html` canonical | index, follow |
| `/venetian-plaster-surrey` | 200 | 0 | clean URL | `.html` canonical | index, follow |
| `/venetian-plaster-cost-vancouver` | 200 | 0 | clean URL | `.html` canonical | index, follow |

Body content duplicates the corresponding `.html` page while the canonical tag points to the `.html` URL.

## B. Intended Architecture

The authoritative URL convention remains `.html`.

Evidence:

- HTML canonical tags use `.html` for inspected static pages.
- `og:url` uses `.html` for inspected static pages.
- Static `sitemap.xml` contains canonical `.html` URLs only, plus homepage `/`.
- Internal links are normalized to `.html`: 520 `.html` links and 0 clean links to existing static HTML pages.

Expected behavior:

```text
/page-name -> 301 -> /page-name.html
/page-name.html -> 200
```

Homepage `/` remains unchanged.

## C. Root Cause

Root cause classification: **A. Netlify Pretty URLs / static-file shadowing plus incomplete redirect configuration**.

The previous `netlify.toml` included:

- A conflicting redirect from `/blog.html` to `/blog`, opposite to the current canonical `.html` strategy.
- A small set of clean-to-`.html` redirects without `force = true`.
- A broad catch-all redirect using `conditions = {Path = ["!*.html"]}`, which did not normalize existing static page clean URLs in production.

Netlify was serving extensionless clean URLs as `200` pages for corresponding `.html` files instead of applying the intended redirect.

A second source of clean URL exposure was found in the Opinly sitemap/blog functions:

- Production `/sitemap.xml` included `https://stiledileo.com/blog` while the repository static sitemap and `blog.html` canonical use `https://stiledileo.com/blog.html`.
- `opinly-blog.mts` intercepted `/blog`, preventing the static `/blog -> /blog.html` redirect during local Netlify preview.

## D. Severity

Severity: **P1 — duplicate 200 pages but canonicalized consistently**.

Reasoning:

- Clean and `.html` URLs are both indexable HTTP 200 responses.
- Canonicals are consistent and point to `.html`, so this is not a full canonical split.
- Google Search Console already reports clean URL variants, so the duplicate exposure is active.
- The site is small, so this is not primarily a crawl-budget crisis; the bigger issue is URL consolidation clarity and validation noise.

## E. Exact Fix Implemented Locally

Files changed:

- `netlify.toml`
- `netlify/functions/opinly-blog.mts`
- `netlify/functions/opinly-sitemap.mts`

Changes:

1. Replaced the non-working broad clean URL rule with explicit forced `301` redirects for every static `.html` URL currently listed in the sitemap.
2. Removed the conflicting `/blog.html -> /blog` direction and made `/blog -> /blog.html` canonical instead.
3. Added `force = true` to known clean URL redirects so Netlify Pretty URLs/static-file shadowing cannot serve the clean URL as `200`.
4. Updated `opinly-sitemap.mts` so the generated production sitemap includes `/blog.html` rather than clean `/blog` for the blog index.
5. Updated `opinly-blog.mts` so the dynamic blog function no longer owns `/blog`; it remains available for `/blog/*` dynamic post routes.
6. Updated the dynamic blog layout nav link from `/blog` to `/blog.html` to avoid reintroducing the clean blog index URL.

## F. Local Routing Validation Result

Validated with Netlify CLI local preview.

| Test | Result |
|---|---|
| `/fireplace-wall-vancouver` | 301 to `/fireplace-wall-vancouver.html` |
| `/fireplace-wall-vancouver.html` | 200 |
| `/marmorino-vancouver` | 301 to `/marmorino-vancouver.html` |
| `/marmorino-vancouver.html` | 200 |
| `/venetian-plaster-vancouver` | 301 to `/venetian-plaster-vancouver.html` |
| `/venetian-plaster-vancouver.html` | 200 |
| `/feature-wall-vancouver` | 301 to `/feature-wall-vancouver.html` |
| `/feature-wall-vancouver.html` | 200 |
| `/projects` | 301 to `/projects.html` |
| `/projects.html` | 200 |
| `/blog` | 301 to `/blog.html` |
| `/blog.html` | 200 |
| `/unknown-clean-url` | 404 |
| `/unknown-clean-url.html` | 404 |
| `/images/homepage/hero.jpg` | 200, unaffected |
| `/scripts/analytics.js` | 200, unaffected |
| `/car.html` | 200, unaffected |
| clean URL with query string | 301 to `.html`, query string preserved |

Examples:

```text
/venetian-plaster-vancouver?utm_source=test -> /venetian-plaster-vancouver.html?utm_source=test -> 200
/fireplace-wall-vancouver?x=1 -> /fireplace-wall-vancouver.html?x=1 -> 200
/blog?utm_campaign=qr -> /blog.html?utm_campaign=qr -> 200
```

## G. SEO Signal Validation

Representative pages verified:

| Page | Canonical | OG URL | Robots |
|---|---|---|---|
| `fireplace-wall-vancouver.html` | `.html` self-canonical | matches canonical | index, follow |
| `marmorino-vancouver.html` | `.html` self-canonical | matches canonical | index, follow |
| `venetian-plaster-vancouver.html` | `.html` self-canonical | matches canonical | index, follow |
| `feature-wall-vancouver.html` | `.html` self-canonical | matches canonical | index, follow |
| `projects.html` | `.html` self-canonical | matches canonical | index, follow |
| `brookswood-langley-fireplace-transformation.html` | `.html` self-canonical | matches canonical | index, follow |
| `west-vancouver-fireplace-transformation.html` | `.html` self-canonical | matches canonical | index, follow |
| `venetian-plaster-surrey.html` | `.html` self-canonical | matches canonical | index, follow |
| `venetian-plaster-cost-vancouver.html` | `.html` self-canonical | matches canonical | index, follow |

Internal-link audit:

- Clean internal links to existing static HTML pages: 0
- `.html` internal links: 520

Sitemap audit:

- Static sitemap URLs: 46
- Clean sitemap URLs in repository sitemap: 0
- Production sitemap before fix included clean `/blog` through the Opinly sitemap function; function source was corrected locally.

## H. Build / Validator Results

Commands run:

```text
npx netlify functions:build --src netlify/functions --functions /tmp/stiledileo-functions-build-1788373136
node --check scripts/analytics.js
node scripts/seo-validate.js
```

Results:

- Netlify functions built successfully locally.
- Analytics JS syntax check passed.
- SEO validation passed for 48 HTML files and 46 sitemap URLs.
- Remaining warnings: 88 non-blocking image dimension opportunities.

Local Netlify preview note:

- `/sitemap.xml` returns 502 in offline local preview because `OPINLY_API_KEY` is not configured locally.
- Production currently has the required key, as production `/sitemap.xml` returned XML during testing.
- The sitemap function source was corrected so the next production deploy should emit `.html` for the blog index instead of clean `/blog`.

## I. Deploy Recommendation

Deploy recommended after human review.

Expected post-deploy production behavior:

- Clean static URLs return one-hop `301` to `.html` canonical URLs.
- `.html` canonical URLs remain `200`.
- Assets remain `200` and unaffected.
- Unknown URLs remain `404`.
- Query strings are preserved through redirects.
- Production sitemap no longer emits clean `/blog` for the blog index.

After deployment, run a live validation in Google Search Console for previously reported clean URL variants.
