# SEO recovery: first implementation batch — 2026-10-13

## Evidence
GSC URL-prefix property https://stiledileo.com/, Windsor Search Analytics default report, no country/device filter. Comparable six-day periods: Sep 29–Oct 4 versus Oct 6–11; Oct 12 absent from finalized daily response. Clicks 3 → 1; impressions 273 → 213; impression-weighted position 16.31 → 23.43. Small sample, not proof of a lasting trend or of a specific ranking cause.

GA4 property 529397389 (Stile Di Leo), Sep 29–Oct 5 versus Oct 6–12: session channel totals 48 → 13. Direct 19 → 6; ChatGPT 15 → 3; organic search 5 → 2; paid search 3 → 0; organic social 2 → 0; unassigned 4 → 2. Explicit gate5_qa / controlled_test traffic exists in both periods. Do not label all Direct or ChatGPT traffic as tests. Current connector totals differ slightly from owner's earlier screenshot.

## Technical checks before changes
Four live .html service pages returned HTTP 200, self-canonical, no robots meta noindex or X-Robots-Tag. Clean /feature-wall-vancouver returned 301 to its .html URL. This checks serving, not Google's selected canonical or current URL Inspection status. URL Inspection remains outstanding; Windsor's exposed reporting fields do not provide it.

## Changes
- Feature Wall: documented Brookswood project link, practical wall-condition/lighting/dimension/budget checklist; CTA to existing /#estimate photo form.
- Venetian Plaster: real Brookswood and West Vancouver case-study links, preparation and planning guidance; removed one piece of internal SEO-oriented copy.
- Condo: building access/strata questions, protection and preparation guidance, sample/light planning; removed internal SEO-oriented copy.
- Fireplace: existing brick/tile suitability and enquiry details linked to documented Brookswood preparation.

No URL, canonical, redirect, pricing or tracking changes. No new case-study facts, testimonials or ranking guarantees. Existing published case studies provide project evidence.

## Validation and follow-up
Existing scripts/seo-validate.js passes for 51 HTML files and 49 sitemap URLs. Existing warning: 88 image dimension opportunities. git diff --check passes.

Next: URL Inspection for feature-wall-vancouver.html, venetian-plaster-condo-vancouver.html and venetian-plaster-vancouver.html; complete 28-day GSC baseline, including Canada/device breakdown; Google Business Profile inventory. Evaluate post-change data after recrawl; compare complete 28-day windows and retain low-count caveats. No recurring job has been scheduled.
