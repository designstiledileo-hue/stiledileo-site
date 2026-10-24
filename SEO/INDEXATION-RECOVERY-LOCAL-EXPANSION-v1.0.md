# Indexation Recovery and Local Expansion v1.0

Date: 2026-10-23
Repository: /Users/vladyslavdementiev/Documents/GitHub/stiledileo-site
Branch: main
Status: LOCAL REVIEW CANDIDATE. No commit, push, deploy, paid launch or GSC submission.

## Executive Decision

Improve existing city pages before adding locations. Surrey and Langley have observable local-query impressions. Coquitlam already has a service page; two recent impressions are insufficient for a ranking/CTR conclusion. Three focused page improvements are implemented locally.

The reported CURRENT 19 excluded URLs cannot be identified from available historical exports. September 23 exports contain 24 examples, not 19. Connected GSC Search Analytics is now available, but the exposed connector fields do not provide URL Inspection/current Page indexing reasons. Present index status and Google's selected canonicals remain unverified.

Owner clarification, October 23: service coverage is ALL LOWER MAINLAND, including Abbotsford and Mission. Coverage is no longer an expansion blocker; no minimum project size or travel surcharge was supplied, and none is invented here.

Access recheck, October 23: connected GSC account and complete available field/option inventory were reverified. Search Analytics, Search Appearance and Sitemaps are exposed; Page indexing reasons, Google-selected canonical and URL Inspection fields are not. Native Chrome access was not approved; direct in-app browser access to search.google.com was also denied by the app permission gate. No alternative browser route or authentication workaround was attempted after that denial. The missing current exclusion list is an interface-access limitation, not evidence that the owner lacks GSC access. A manual export is optional if direct browser access can be enabled.

No canonical routing defect was found in the live sample. Historical exclusions include 16 clean aliases now redirecting correctly, one XML sitemap and seven canonical HTML pages. All seven canonical HTML pages received recent web impressions. That establishes visibility during the reporting period, not guaranteed indexing today.

## Sources and Data Scope

- Live HTTP sample: October 23, 2026; 43 requested URLs.
- Coverage: three local `https___stiledileo.com_-Coverage-Drilldown-2026-09-23*.zip` exports in Downloads. Eight redirect, seven alternate-canonical and nine crawled/not-indexed examples.
- Performance: Windsor-connected Search Console, account `https://stiledileo.com/`, 2026-09-22 through 2026-10-19 inclusive (28 days).
- Search type explicitly verified with the search_type dimension. Only WEB rows used below; image rows excluded.
- Returned page dataset: 68 web/image rows, including 42 web page rows. Query/page dataset: 423 web/image rows, including 205 web rows.
- No country/device filters. Do not sum URL-prefix and domain properties.
- Query anonymization/dimensional differences mean query/page totals need not equal page totals. Returned rows are not a complete disclosure of all user queries.
- Earlier performance exports have different date ranges; no growth claim is made from unlike windows.
- No Coquitlam, Abbotsford or Mission query appears in the returned WEB rows. Absence is insufficient evidence, not zero market demand.
- No Abbotsford or Mission HTML page exists in the current local inventory. None created.
- Connected GSC sitemap read, October 23: sitemap.xml has 51 submitted URLs, zero reported errors and zero warnings. Last downloaded: 2026-10-23T10:32:49.460Z; last submitted: 2026-09-21T04:59:47.411Z. These are sitemap-processing signals, not counts of indexed pages. The connector's deprecated indexed field was deliberately not used. A second returned row had a null path and zero totals; it is not treated as another sitemap.

## Baseline

WEB only, date range above. Data precedes these unpublished changes.

| Page | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| `/venetian-plaster-surrey.html` | 0 | 87 | 0.0% | 15.40 |
| `/venetian-plaster-langley.html` | 0 | 92 | 0.0% | 29.03 |
| `/venetian-plaster-coquitlam.html` | 0 | 2 | 0.0% | 3.00 |
| `/venetian-plaster-north-vancouver.html` | 0 | 106 | 0.0% | 67.71 |
| `/feature-wall-vancouver.html` | 0 | 86 | 0.0% | 6.92 |

Langley's overall position 29.03 is mainly a ranking constraint, but the local query below is closer to page one. Surrey has a concrete existing visibility opportunity. Coquitlam's position 3 from two impressions is not a proven top-three result. North Vancouver at 67.71 is not simply a title problem; it was not rewritten.

Feature Wall Vancouver's 86 impressions at position 6.92 with no clicks merits a separate query-level snippet/intent review before assuming more city URLs will generate traffic.

### Local Query Ownership

| Query | Receiving page | Clicks | Impressions | Average position |
| --- | --- | ---: | ---: | ---: |
| wall plaster langley | `/venetian-plaster-langley.html` | 0 | 19 | 7.42 |
| wall plaster langley | `/venetian-plaster-surrey.html` | 0 | 3 | 30.67 |
| wall plaster surrey | `/` | 0 | 5 | 1.00 |
| wall plaster surrey | `/feature-wall-surrey.html` | 0 | 2 | 40.00 |
| wall plaster surrey | `/venetian-plaster-langley.html` | 0 | 5 | 15.60 |
| wall plaster surrey | `/venetian-plaster-surrey.html` | 0 | 22 | 12.45 |

All listed query rows have zero clicks/0% CTR. Langley and Surrey are the principal observed recipients of their respective local phrases. Small competing samples do not justify merging or redirecting legitimate pages. These figures are not geo-filtered local demand estimates.

## Historical Exclusion Map

Recent impressions refer to the canonical target, not historical URL index status. Publisher canonical tags do not reveal Google's chosen canonical.

| Historical URL | September export reason | Live HTTP chain | Classification / next action |
| --- | --- | --- | --- |
| `/brookswood-langley-fireplace-transformation` | Page with redirect | 301 > 200 | Expected alias; canonical target has 4 recent impressions |
| `/venetian-plaster-vancouver` | Page with redirect | 301 > 200 | Expected alias; canonical target has 382 recent impressions |
| `/fireplace-wall-vancouver` | Page with redirect | 301 > 200 | Expected alias; canonical target has 56 recent impressions |
| `/venetian-plaster-condo-vancouver` | Page with redirect | 301 > 200 | Expected alias; canonical target has 91 recent impressions |
| `/venetian-plaster-surrey` | Page with redirect | 301 > 200 | Expected alias; canonical target has 87 recent impressions |
| `/feature-wall-ideas-vancouver` | Page with redirect | 301 > 200 | Expected alias; canonical target has 30 recent impressions |
| `/venetian-plaster-entryway-vancouver` | Page with redirect | 301 > 200 | Expected alias; canonical target has unavailable recent impressions |
| `/blog-staging-vs-design` | Page with redirect | 301 > 200 | Expected alias; canonical target has unavailable recent impressions |
| `/custom-architectural-rock-installation` | Alternate page with proper canonical tag | 301 > 200 | Expected alias; canonical target has unavailable recent impressions |
| `/feature-wall-vancouver` | Alternate page with proper canonical tag | 301 > 200 | Expected alias; canonical target has 86 recent impressions |
| `/venetian-plaster-cost-vancouver` | Alternate page with proper canonical tag | 301 > 200 | Expected alias; canonical target has 200 recent impressions |
| `/venetian-plaster-burnaby` | Alternate page with proper canonical tag | 301 > 200 | Expected alias; canonical target has 35 recent impressions |
| `/venetian-plaster-bathroom-vancouver` | Alternate page with proper canonical tag | 301 > 200 | Expected alias; canonical target has 74 recent impressions |
| `/venetian-plaster-vs-drywall-vancouver` | Alternate page with proper canonical tag | 301 > 200 | Expected alias; canonical target has 37 recent impressions |
| `/venetian-plaster-langley` | Alternate page with proper canonical tag | 301 > 200 | Expected alias; canonical target has 92 recent impressions |
| `/feature-wall-surrey.html` | Crawled - currently not indexed | 200 | Canonical HTML; 4 recent impressions; inspect present status |
| `/black-venetian-plaster-wall-vancouver.html` | Crawled - currently not indexed | 200 | Canonical HTML; 9 recent impressions; inspect present status |
| `/blog.html` | Crawled - currently not indexed | 200 | Canonical HTML; 110 recent impressions; inspect present status |
| `/microcement-vancouver` | Crawled - currently not indexed | 301 > 200 | Expected alias; canonical target has 38 recent impressions |
| `/venetian-plaster-durability-vancouver.html` | Crawled - currently not indexed | 200 | Canonical HTML; 11 recent impressions; inspect present status |
| `/venetian-plaster-maintenance-vancouver.html` | Crawled - currently not indexed | 200 | Canonical HTML; 10 recent impressions; inspect present status |
| `/venetian-plaster-north-vancouver.html` | Crawled - currently not indexed | 200 | Canonical HTML; 106 recent impressions; inspect present status |
| `/venetian-plaster-bathroom-vancouver.html` | Crawled - currently not indexed | 200 | Canonical HTML; 74 recent impressions; inspect present status |
| `/sitemap.xml` | Crawled - currently not indexed | 200 | XML, not a webpage-indexing target |

Do not request indexing for clean redirect aliases or sitemap.xml as a content page. Submit a sitemap through GSC's Sitemaps interface, not webpage URL Inspection. Intentional noindex utilities also should not be forced into search.

## Live Routing

All 43 requested URLs reached HTTP 200 without recorded fetch errors. Seventeen clean routes (16 historical aliases plus Coquitlam) used one direct 301. No 302, chain or loop observed.

| Requested clean URL | Initial status | Final URL | Final status |
| --- | ---: | --- | ---: |
| `/blog-staging-vs-design` | 301 | `/blog-staging-vs-design.html` | 200 |
| `/brookswood-langley-fireplace-transformation` | 301 | `/brookswood-langley-fireplace-transformation.html` | 200 |
| `/custom-architectural-rock-installation` | 301 | `/custom-architectural-rock-installation.html` | 200 |
| `/feature-wall-ideas-vancouver` | 301 | `/feature-wall-ideas-vancouver.html` | 200 |
| `/feature-wall-vancouver` | 301 | `/feature-wall-vancouver.html` | 200 |
| `/fireplace-wall-vancouver` | 301 | `/fireplace-wall-vancouver.html` | 200 |
| `/microcement-vancouver` | 301 | `/microcement-vancouver.html` | 200 |
| `/venetian-plaster-bathroom-vancouver` | 301 | `/venetian-plaster-bathroom-vancouver.html` | 200 |
| `/venetian-plaster-burnaby` | 301 | `/venetian-plaster-burnaby.html` | 200 |
| `/venetian-plaster-condo-vancouver` | 301 | `/venetian-plaster-condo-vancouver.html` | 200 |
| `/venetian-plaster-coquitlam` | 301 | `/venetian-plaster-coquitlam.html` | 200 |
| `/venetian-plaster-cost-vancouver` | 301 | `/venetian-plaster-cost-vancouver.html` | 200 |
| `/venetian-plaster-entryway-vancouver` | 301 | `/venetian-plaster-entryway-vancouver.html` | 200 |
| `/venetian-plaster-langley` | 301 | `/venetian-plaster-langley.html` | 200 |
| `/venetian-plaster-surrey` | 301 | `/venetian-plaster-surrey.html` | 200 |
| `/venetian-plaster-vancouver` | 301 | `/venetian-plaster-vancouver.html` | 200 |
| `/venetian-plaster-vs-drywall-vancouver` | 301 | `/venetian-plaster-vs-drywall-vancouver.html` | 200 |

Twenty-four directly tested canonical HTML URLs returned 200 and self-canonicals. This includes car.html, which correctly retains noindex,follow. Other tested canonical HTML pages declared index,follow. Robots and sitemap returned 200.

Local/live sitemap URL sets match: 51 unique canonical entries. Every local sitemap entry has an existing HTML document, matching canonical and no noindex; car.html is excluded. No routing, sitemap or robots changes needed.

Not all 51 sitemap URLs were fetched live this sprint. Snapshot checks are not continuous availability monitoring. HTTP 200 and index,follow do not guarantee indexing.

## Implemented Page Improvements

### Surrey

- Added hero photo action; final action now opens the same established /#estimate workflow.
- Replaced assumed city tastes/housing claims with reference-image, texture, lighting and scope decisions.
- Removed “broader / targeted service page” editorial language.
- Added qualified fireplace assessment language; no promise that every installation can be resurfaced.
- Retained the existing Brookswood, Langley project reference with its actual location.
- Removed unsupported Surrey provenance from three existing image alt descriptions.
- Preserved layout, existing material images, navigation, metadata, H1, URL and scripts.

### Langley

- Replaced city/housing stereotypes with customer project guidance.
- Replaced the generic image labelled as a Langley home with the verified Brookswood fireplace photograph.
- Added a caption link to the Brookswood case study; retained the existing story link.
- Full image geometry preserved. Responsive Image CDN variants, explicit source dimensions, eager loading and a narrowly scoped proportional figure style; no new image asset.
- Merged repetitive “Why it fits / Modern homes” explanations and removed “New Builds Need Material Character.”
- Retained documented Brookswood preparation/project facts and local consultation planning.
- Revised three FAQs around construction scheduling, intake details and individual fireplace suitability.
- Added early/final photo links; no second contact system.
- Metadata, H1, URL, navigation and scripts unchanged.

### Coquitlam

- Added early/final photo actions using existing button styling.
- Replaced housing stereotypes with substrate, access and budget planning.
- Linked the West Vancouver tile-to-Marmorino project as an example elsewhere in the Lower Mainland, not a Coquitlam installation.
- Removed unsupported Coquitlam provenance from three existing image alt descriptions.
- Kept layout, images, navigation, metadata, H1, URL and scripts unchanged.

Mediterranean-style language appears once per page as a possible visual preference, not a replacement material name or an assertion about Canadian search demand.

Approximate visible-text counts (includes navigation/image alternatives, excludes script/style): Surrey 585 -> 609; Langley 778 -> 727; Coquitlam 390 -> 438. Not body-only editorial counts.

## Link and Proof Boundaries

New Langley caption -> Brookswood case study.
Existing Langley/Surrey project-story links -> Brookswood retained.
New Coquitlam project reference -> West Vancouver case study.
All three early/final actions -> /#estimate.
Existing service/pricing references retained; several exact-title anchors made more natural.

No hidden links, footer additions, city keyword lists or site-wide changes. Coquitlam still has few inbound sources (one root-HTML source page in the inspected inventory); do not fix this with irrelevant city cross-links. A later genuine service-area/navigation opportunity or Coquitlam project would be more appropriate.

Legacy material imagery remains on Surrey/Coquitlam. Its local project provenance is unverified, so alt text must not imply work completed there. Authenticated project evidence is in the linked case studies. No local project, client, office or review invented.

## Abbotsford / Mission Gate

Service coverage is now owner-confirmed across all Lower Mainland, including both cities. No new city page created in this sprint. Remaining decisions:
1. Distinct local usefulness beyond replacing the city name in a generic service description.
2. Qualified inquiry/query/prospect evidence supporting a separate destination.
3. Project-specific scheduling and scope; do not publish minimums or travel charges without a supplied business policy.

A local project is helpful but not universally mandatory for a legitimate service-area page. Evidence from elsewhere must be accurately labelled. Coverage is confirmed; incremental standalone page value remains to be established.

Do not create an office/GBP location or promote showers, bathrooms, Tadelakt, countertops or unsupported applications. Advertising budget remains unassigned.

[Google's doorway policy](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse) warns against substantially similar geographic funnels, not all useful service-area pages.

## Validation

| Check | Result |
| --- | --- |
| Netlify cached normal CLI build --offline | PASS; five functions and one edge function bundled; no deployment |
| node --check scripts/analytics.js | PASS |
| Measurement + SEO foundation tests | PASS: 111/111 |
| Targeted HTML structural validation | PASS: all three pages; close order, permitted content, IDs, quotes and void elements |
| Metadata, H1, scripts compared with HEAD | Unchanged; one H1 each |
| Internal links/fragments/images/inline CSS backgrounds | PASS: 98 local references; CDN source unwrapped and filename case checked |
| Sitemap document/canonical/noindex validation | PASS: 51 unique entries, campaign excluded |
| JSON-LD | No blocks on these city pages; none added/changed |
| git diff --check | PASS |
| Repository SEO validator | FAIL: 143 pre-existing Image CDN false-positive local-file reports; HEAD also reports 143 |
| Independent check of those 143 CDN source paths | All actual files present with exact case; no non-CDN error in that output |
| 1440 / 390 / 375 browser QA | PASS: all three pages, nine full-page renders |
| Overflow / broken images / page console exceptions | None |
| CTA handoff | Every early/final photo action opens existing estimate modal/photo input at all widths |
| CTA sizes | Existing buttons >=48px tall; Langley photo links >=52px |
| Font errors / missing image alt | None |
| Connected GSC sitemap processing | 51 submitted URLs; zero errors and warnings; fetched October 23 |
| Present-day GSC index state / Google canonical | NOT verified; connector does not expose it and browser permission was denied |

The stock validator was not altered just to produce green output. Its CDN parsing limitation remains a separate maintenance issue. Targeted HTML checks are not full conformance/WCAG certification.

Preview: http://127.0.0.1:4197/. Local server emulates Netlify image transforms from actual files, not platform routing/functions; live routing tested separately. GA vendor calls stubbed, production-host tracking guard preserved. No live lead submission.

Estimate-navigation tests cancel some homepage video downloads (net::ERR_ABORTED); these are navigation cancellations, not broken city-page assets. No HTTP 4xx/5xx or page-console errors appeared.

QA artifacts are temporary/local, not production files:
- /private/tmp/stiledileo-city-recovery-qa/results.json
- /private/tmp/stiledileo-city-recovery-qa/venetian-plaster-{surrey,langley,coquitlam}.html-{1440,390,375}-full.png
- /private/tmp/city-recovery-static.json
- /private/tmp/stiledileo-indexation-live.json
- /private/tmp/city-recovery-build.log
- /private/tmp/city-recovery-tests.log
- /private/tmp/city-recovery-seo.log
- /private/tmp/city-recovery-seo-head.log

Full-page desktop/mobile sequences visually reviewed. Responsive project photo, CTA spacing and text remain usable.

## Next Implementation Queue

P0: Read the CURRENT Page indexing report and URL Inspection directly once Search Console browser access is enabled. An export is an optional fallback, not a requirement placed on the owner when direct access works. Inspect important canonical exclusions for crawl date, present index state, Google-selected canonical, robots and rendered fetch. Classify expected exclusions separately from technical/content/discovery problems; do not assume performance history proves current status.

[Google's indexing report guidance](https://support.google.com/webmasters/answer/7440203) distinguishes expected exclusions from defects. [URL Inspection](https://support.google.com/webmasters/answer/9012289) is required for individual current-state decisions.

P1: Human-review these three pages. Only after approval, commit/deploy normally, verify live content and inspect the canonical city URLs. Request indexing once if appropriate; no submission made here. Record release date and compare equivalent 28-day WEB windows plus qualified photo inquiries.

P1: Separate CTR/query-ownership sprint for Feature Wall Vancouver (86 impressions, position 6.92, no clicks) and the local Langley query (19 impressions, position 7.42, no clicks). Confirm receiving queries/intent before metadata edits.

P2: With all-Lower-Mainland coverage confirmed, assess distinct Abbotsford/Mission page usefulness or geographically targeted distribution to existing application pages. Do not invent local projects, offices or a travel/minimum-scope policy.

## Changed Files / Release State

- venetian-plaster-surrey.html
- venetian-plaster-langley.html
- venetian-plaster-coquitlam.html
- SEO/INDEXATION-RECOVERY-LOCAL-EXPANSION-v1.0.md

No new production pages, canonical/routing changes, sitemap edit, shared-component changes, broad schema, paid activity or approved owner-page rewrite. Existing untracked acquisition report/drafts untouched and unstaged.

Remaining indexation gate: direct Search Console browser permission (or an optional current export) for exclusion/Inspection evidence. Service coverage is confirmed and no longer missing. Distinct city-page value still needs evaluation before creating new URLs.

