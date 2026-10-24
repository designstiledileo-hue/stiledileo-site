# Existing City CTR Recovery - RC1

Prepared: 2026-10-23, America/Vancouver
Version: city-ctr-rc1
Status: READY FOR HUMAN REVIEW. Local changes only; not committed, pushed or deployed.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`
Branch: `main`

## 1. Decision and Scope

Start with existing Langley and Surrey visibility, rather than create a new city page first. Connected GSC data identifies meaningful impressions and no clicks on two locally relevant queries, especially Langley near average position 4. This is an opportunity, not proof that metadata caused the missing clicks or a promise of new leads.

This sprint changes exactly four metadata lines: one title and one description on each page. No opening-copy adjustment was necessary. Existing customer-language improvements, photographs, project references, links and photo-inquiry CTAs remain untouched.

The broader working tree was already dirty. Before editing, 303 existing tracked/untracked files were fingerprinted and both target pages were copied to `/private/tmp/stiledileo-city-ctr-rc1/before/`. Comparison is against those starting drafts, not against HEAD: the HEAD diff also includes earlier approved-in-progress city work.

## 2. Receiving URLs and Intent

| Page | Primary intent | Secondary intent | Ownership preserved |
| --- | --- | --- | --- |
| https://stiledileo.com/venetian-plaster-langley.html | Hire a decorative-plaster specialist serving Langley | See a completed local fireplace and discuss the proposed wall/finish | Local service page; Brookswood remains the specific project story |
| https://stiledileo.com/venetian-plaster-surrey.html | Hire a specialist for hand-applied plaster surfaces in Surrey | Understand texture, sheen and fireplace suitability before contacting | Local plaster service; `/feature-wall-surrey.html` remains the broader focal-wall planning page |

These are installation/consultation pages, not stores, ordinary drywall repair services or fireplace-appliance servicing pages. The selected metadata communicates this positively through custom finishes, hand application, project photography and consultation. No negative-keyword list or new SEO block was added to either page.

## 3. Baseline and Ownership Evidence

Source: connected Windsor.ai `searchconsole` connector, URL-prefix property `https://stiledileo.com/` only. Do not combine with `sc-domain:stiledileo.com`.

Window: 2026-07-22 through 2026-10-19 inclusive, 90 days. Re-read on 2026-10-23. Dimensions: `search_type`, `query`, `page`; measures: clicks, impressions, CTR, position. Response contained 847 rows across search types; analysis below uses the 306 WEB rows only. No country or device filter was applied.

| Query | Receiving URL path | Clicks | Impressions | CTR | Average position |
| --- | --- | ---: | ---: | ---: | ---: |
| wall plaster langley | /venetian-plaster-langley.html | 0 | 85 | 0% | 4.18 |
| wall plaster langley | /venetian-plaster-surrey.html | 0 | 18 | 0% | 38.78 |
| wall plaster surrey | /venetian-plaster-surrey.html | 0 | 87 | 0% | 9.09 |
| wall plaster surrey | /venetian-plaster-langley.html | 0 | 5 | 0% | 15.60 |
| wall plaster surrey | / | 0 | 5 | 0% | 1.00 |
| wall plaster surrey | /feature-wall-surrey.html | 0 | 2 | 0% | 40.00 |
| venetian plaster surrey | /venetian-plaster-surrey.html | 1 | 1 | 100% | 6.00 |
| venetian plaster surrey | / | 0 | 2 | 0% | 6.00 |

Langley is the stronger immediate CTR hypothesis. Surrey has a combined relevance/ranking and CTR opportunity nearer the bottom of page one on this query; it is not equivalent to position 4. Neither average position is a stable local rank for every user. The one-impression click and five-impression homepage result are too small to identify winners. Cross-city appearances do not establish harmful cannibalization, so no merging, redirects or ownership changes were made.

These query-by-page rows are not whole-page totals and must not be summed into site totals. Query anonymization, filtering and connector/export limits can prevent reconciliation. An explicit source row limit was not available in the response. Current Google-selected canonicals and the reported 19 indexing exclusions were not reverified by URL Inspection; this sprint makes no new indexation claim.

## 4. Public Search Intent Check

Sampled public results for `wall plaster Langley BC`, `wall plaster Surrey BC`, related Venetian plaster language and site-specific searches. Results mixed local finish installers, general wall/drywall services and supply/product sources. This supports clearer service qualification, not a claim about search volume or a reproducible geo-specific Google ranking.

Primary-source context: [Cadoro Plaster](https://cadoroplaster.com/) and its [Langley contact information](https://cadoroplaster.com/pages/contact-us) demonstrate a local product-supply alternative to hiring an installer. [Shape of Paint's Langley service page](https://shapeofpaint.com/langley) demonstrates service-provider intent in the same broad category. These are intent observations, not competitor performance measurements.

The Surrey page appeared in the public search sample with its old source title. Exact Google-selected title links/descriptions on a Canadian mobile SERP were not captured. The Langley site-specific search did not reliably surface the exact page; that is not evidence of non-indexation.

Google recommends concise descriptive titles and page-specific descriptions, but can generate different title links and query-specific snippets. See [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link) and [snippet guidance](https://developers.google.com/search/docs/appearance/snippet), checked 2026-10-23. Character counts below are descriptive, not guaranteed display limits.

## 5. Langley Metadata

URL: https://stiledileo.com/venetian-plaster-langley.html

Previous local/live title:
`Venetian Plaster Langley BC | Custom Walls for New Builds & Family Homes | Stile di Leo`

Selected title, 59 displayed characters:
`Venetian Plaster Langley | Custom Fireplace & Wall Finishes`

Previous local/live description:
`Custom Venetian plaster in Langley BC for new builds, family homes, fireplace walls, and statement interiors with a refined handcrafted finish.`

Selected description, 156 characters:
`Custom plaster walls and fireplace finishes in Langley. See our Brookswood Marmorino transformation, then send a project photo to discuss the possibilities.`

Rationale: replaces the long new-build/family-home framing with concrete surfaces relevant to the existing page and its actual Brookswood example. It preserves Venetian plaster/local hiring intent, makes the local project useful, and offers a realistic next step without promising a quote from a photograph. Marmorino is supported by the linked project, not an invented material specification.

Unchanged H1: `Venetian Plaster Langley BC`.
Unchanged canonical and OG URL: `https://stiledileo.com/venetian-plaster-langley.html`.
Unchanged robots: `index, follow`.

## 6. Surrey Metadata

URL: https://stiledileo.com/venetian-plaster-surrey.html

Previous local/live title:
`Venetian Plaster Surrey BC | Custom Decorative Walls for Modern Homes | Stile di Leo`

Selected title, 52 characters:
`Venetian Plaster Surrey | Hand-Applied Wall Finishes`

Previous local/live description:
`Custom Venetian plaster in Surrey BC for feature walls, fireplace walls, and modern homes that need a softer, more architectural luxury finish.`

Selected description, 159 characters:
`Stile di Leo creates hand-applied plaster walls and fireplace finishes in Surrey. Explore texture and sheen options, then send a photo to discuss your project.`

Rationale: replaces abstract luxury adjectives with the installed craft, tangible selection factors and a clear contact path. Keeps this page's plaster-service role distinct from feature-wall planning. Does not claim an authenticated Surrey installation: the nearby Brookswood link remains explicitly Langley in the unchanged body.

Unchanged H1: `Venetian Plaster Surrey BC`.
Unchanged canonical and OG URL: `https://stiledileo.com/venetian-plaster-surrey.html`.
Unchanged robots: `index, follow`.

## 7. Exact Implementation and Preserved Work

Modified in this sprint:
- `venetian-plaster-langley.html`: title and description only.
- `venetian-plaster-surrey.html`: title and description only.

Created in this sprint:
- `SEO/EXISTING-CITY-CTR-RECOVERY-RC1.md`: this report.

Each target file is byte-identical to its starting draft after stripping only its title and description tags. H1, canonical, OG URL, robots, scripts, CSS, visible copy, images and every internal link are unchanged. The Langley title ampersand is properly serialized as `&amp;` in HTML.

Preserved: uncommitted Coquitlam changes; earlier Langley/Surrey customer-language, project and inquiry work; indexation/local-expansion/acquisition reports; prompt plan; and all `marketing/local-acquisition-v1/` drafts. No staging, commits, remote writes, profile changes, advertising expenditure or deployment.

Before/after diff summary against this sprint's snapshots: two replacements per page, four lines removed and four added in total. No body changes in this sprint. Do not describe a later combined deployment of the prior body improvements and these metadata changes as an isolated metadata experiment.

## 8. Validation

| Check | Result |
| --- | --- |
| Normal Netlify local build | PASS: `netlify build --offline`, production context, five functions and one edge function packaged; no deployment |
| `node --check scripts/analytics.js` | PASS |
| Measurement-environment and SEO-foundation test suites | PASS: 111 tests, zero failures |
| Stock `node scripts/seo-validate.js` | FAIL: 143 pre-existing Image CDN reference-parser warnings; after log is byte-identical to the before log |
| Independent checks of those 143 warnings | PASS: all are `/.netlify/images` references; each decoded source exists with exact case; zero missing source files |
| Targeted HTML validation | PASS on both pages: closing order, permitted content, duplicate IDs, attribute quoting, ID validity and void-element content checks |
| Canonical/indexability/OG/H1 | PASS: one H1, one unchanged self-canonical, unchanged OG URL and `index, follow` on each |
| Metadata | PASS: one non-empty title and description per page; intentional replacements only |
| Target-page internal links/fragments/assets | PASS: Surrey 36 reference checks / 13 image-reference checks; Langley 27 / 4; includes responsive source variants and CSS image sources |
| Browser internal-link requests | PASS: every distinct root-relative destination on each target returns local HTTP 200 |
| Sitemap | PASS: 51 unique existing documents, matching canonicals, no noindex entries; campaign car page excluded; sitemap unchanged |
| JSON-LD / inline JavaScript | No structured data added; existing inline executable scripts parse successfully |
| `git diff --check` | PASS |
| Scope preservation | PASS: only the two approved existing HTML files changed against the 303-file starting fingerprint; this report is the sole new repository file |

The stock validator failure is explicitly not a PASS. Its parser limitation predates this sprint and was not changed because validator maintenance is outside this scope. No substantive missing source or broken link was found on the two target pages.

## 9. Render and Contact QA

Preview URLs:
- http://127.0.0.1:4197/venetian-plaster-langley.html
- http://127.0.0.1:4197/venetian-plaster-surrey.html

The existing local preview serves canonical-repository files and simulates Netlify Image CDN transforms using Sharp. It does not emulate Netlify routing/functions; these local checks are not a fresh production-CDN or redirect certification. Existing production targets were separately fetched before edits: both HTTP 200, with title, description, H1, canonical and OG URL matching the initial metadata recorded above.

| Page | Width | Overflow | Broken images | Console/page errors | Inquiry handoff |
| --- | ---: | ---: | ---: | ---: | --- |
| Langley | 1440 | 0px | 0 | 0 | PASS |
| Langley | 390 | 0px | 0 | 0 | PASS |
| Langley | 375 | 0px | 0 | 0 | PASS |
| Surrey | 1440 | 0px | 0 | 0 | PASS |
| Surrey | 390 | 0px | 0 | 0 | PASS |
| Surrey | 375 | 0px | 0 | 0 | PASS |

Full-page, hero and final-CTA screenshots were captured and reviewed. No clipped text, overlapping controls, missing image alt attributes, font-loading errors or visible development placeholders were found. Langley's portrait Brookswood photograph retains its proportions; Surrey's existing gallery stacks without overflow. The different established page layouts were preserved, not harmonized or redesigned.

Both in-content photo CTAs on each page were activated at each width (12 handoffs). All opened the existing homepage estimate modal at `/#estimate` with its photo input visible. Keyboard focus plus Enter activation was separately tested on each page at 390px. Minimum tested in-content CTA height: Langley 52.8px, Surrey 48.3px. This is a focused accessibility check, not full WCAG certification.

No form was submitted. Google analytics/tag endpoints were stubbed in the test browser to prevent test traffic from reaching production measurement. Some contact-handoff/back-navigation tests cancelled the homepage background video request with `net::ERR_ABORTED`; these are navigation cancellations, not missing resources or target-page console errors. No HTTP error responses occurred.

Screenshots, local ephemeral QA artifacts:
- `/private/tmp/stiledileo-city-ctr-rc1/screenshots/comparison-1440.png`
- `/private/tmp/stiledileo-city-ctr-rc1/screenshots/comparison-390.png`
- `/private/tmp/stiledileo-city-ctr-rc1/screenshots/comparison-375.png`
- Individual hero/full/final images: `/private/tmp/stiledileo-city-ctr-rc1/screenshots/venetian-plaster-{langley,surrey}.html-{1440,390,375}-{hero,full,final}.png` (filename pattern, not one file).

Raw logs and before snapshots are in `/private/tmp/stiledileo-city-ctr-rc1/`; these temporary QA files were not added to the repository.

## 10. Measurement and Remaining Limitations

Release date: NOT SET. No production improvement or CTR uplift is claimed yet.

After a separately approved release, record its timestamp and the full released footprint, then compare WEB query-by-page rows for these two owners over comparable windows. Keep country/device filters consistent if introduced; check average-position shifts and query mix before attributing a CTR change to the new presentation. Track qualified photo inquiries using existing analytics and owner-side lead qualification, not clicks alone.

A 2-3 week directional review may be useful, but these low volumes may need longer observation. Google can recrawl later and choose different titles/snippets. Do not repeatedly change metadata before sufficient new evidence exists. No budget, lead forecast, fixed response time, quote guarantee or minimum project size was invented.

GSC URL Inspection / current 19 exclusions remain unverified and are a separate diagnosis. No promise that metadata changes alone fix excluded pages. No indexation, ranking, conversion or sales outcome has yet been measured for this version.

No blocking defect found for human review. Stop after Prompt 1; discovery/internal-link changes, new city briefs and release remain separately authorized steps.

EXISTING CITY CTR RECOVERY READY FOR HUMAN REVIEW
