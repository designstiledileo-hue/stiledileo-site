# Abbotsford Service-Area Pilot RC1

Implementation started: 2026-10-23. Final local checks: 2026-10-24, America/Vancouver.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`, branch `main`.
Authority: owner approved `SEO/ABBOTSFORD-SERVICE-AREA-BRIEF-v1.0.md`; Prompt 4 in the Next Improvements plan defines the implementation scope.

## 1. Current Decision

Page implementation, local rendered QA and the sitemap repair are complete. The owner explicitly approved the single canonical-path addition to `netlify/functions/opinly-sitemap.mts` on 2026-10-24. That line and a focused regression check are now implemented; no local release blockers remain.

The previously confirmed mismatch was real: the XML contained 52 documents while the function served 51 without Abbotsford. After repair, the actual Netlify emulator serves 52 unique canonical entries, including Abbotsford exactly once. All 52 targets return HTTP 200 without redirects, match their declared canonical and have no noindex directive. Production verification remains a post-deployment gate, not an unresolved local implementation defect.

No agent commit, push or deployment was invoked. The repository state advanced through commits outside this run between implementation and continuation: resumed HEAD was `2e189ae`, with the initial page, route, classification and XML already committed. Read-only live checks now find the page at HTTP 200; therefore this report does not misleadingly claim that all page content remains unpublished. The final tests/source-link correction/report are local work at this review gate.

## 2. Exact Page Identity

URL: `https://stiledileo.com/venetian-plaster-abbotsford.html`

Title: `Venetian Plaster Abbotsford | Custom Walls & Fireplaces`

Meta description: `Hand-applied Venetian plaster and Marmorino for Abbotsford walls and fireplaces. View completed projects and send a photo to discuss your finish.`

H1: `Custom Plaster Walls & Fireplaces in Abbotsford`

One self-canonical and matching OG URL; robots `index, follow`. Title, description and H1 match the approved brief exactly after HTML entity decoding. No other page's metadata changed.

Role: local availability and hiring for installed decorative plaster; not a replacement fireplace/material/pricing owner. The page does not claim an Abbotsford office, installation, testimonial or local-only finish system.

Public copy: all 778 approved words retained, including captions and CTA labels, excluding shared navigation. An automated regression compares normalized rendered-main text with the approved Markdown. The complete copy is reproduced at the end of this report.

## 3. Page and Contact Architecture

Sequence: transformation hero -> applications -> regional completed work -> finish selection -> surface review -> pricing factors -> process -> four FAQs -> final photo inquiry.

Uses the established Cormorant Garamond/Montserrat typography, dark/gold palette and shared `/styles/site-navigation.css` header. Approximately 3.2 KB of page-scoped inline CSS arranges the portrait hero, constrained reading column, project figures and final CTA; no global stylesheet was changed. No animation, slider, library or new lead form was introduced.

Three primary photo links total: shared header, hero and final CTA. Each uses the existing `/#estimate` destination and `data-track="send_photo"`. The existing phone number is retained as a secondary contact option. Pricing and project links are editorial navigation, not new conversion cards.

On mobile, the full portrait appears directly after the H1 and before the longer supporting paragraph. Its 340px contained height preserves the entire fireplace, hearth and botanical detail rather than manufacturing a landscape crop. Desktop uses the same image at 560px height. No repeated finished hero or gallery dump.

## 4. Image Manifest

| Role | Exact repository path | Source dimensions | Attribution / handling |
| --- | --- | --- | --- |
| Hero | `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-after-hero-01.jpg` | 1284 x 2469 | Brookswood, Langley; San Marco Marmorino Antico; eager/high priority; responsive widths 400/640/800/1040 |
| Before figure | `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-before-01.jpg` | 1284 x 1703 | Same Brookswood project; original brick; lazy; widths 400/640/800 |
| Contrasting completed figure | `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-front-01.jpg` | 1280 x 1271 | West Vancouver; light Marmorino; lazy; widths 400/640/800 |

All use the existing Netlify Image CDN WebP convention, meaningful location-accurate alt text and source dimensions. `sizes` reflects the narrow contained hero rather than pretending it fills the viewport. The other figures are limited to 360px on desktop. No asset or derivative was created, moved or altered.

Excluded as approved: gold-vein variants, unverified/generic media, the Brookswood detail screenshot with phone-interface content, stock/generated substitutes and fabricated video. No before/after overlay: different camera framing is not digitally corrected. The deeper original/preparation media remain in the existing case studies.

## 5. Links

One inbound source selected: `/venetian-plaster-vancouver.html`, beside existing service-area planning.

New anchor: `decorative plaster service in Abbotsford`.

Source sentence: `Planning a surface in Abbotsford? Explore our decorative plaster service in Abbotsford, with completed examples from the Lower Mainland and details on starting your project.`

This slightly refines the brief's proposed anchor to avoid implying that the featured completed projects are located in Abbotsford. All existing source-page prose, media, metadata and other links are preserved. The conditional Langley source was not used: no second link was forced for a numerical target. No footer/site-wide links.

Body destinations retained from the approved draft:
- `/feature-wall-vancouver.html`: feature-wall planning guide.
- `/brookswood-langley-fireplace-transformation.html`: Brookswood project.
- `/west-vancouver-fireplace-transformation.html`: West Vancouver fireplace transformation.
- `/marmorino-vancouver.html`: Marmorino finishes.
- `/fireplace-wall-vancouver.html`: fireplace finish guide.
- `/venetian-plaster-cost-vancouver.html`: plaster pricing guide.
- `/#estimate`: Send a Project Photo.
- `tel:+16047732298`: Call Leo at +1 604 773 2298.

Shared header retains the main material, Fireplace, Projects and Pricing destinations. All local anchor destinations/fragments and image source variants were checked.

## 6. Structured Data and Tracking

One valid JSON-LD graph: WebPage and Service. The page references the existing website/organization identities; Service states decorative plaster walls/fireplace finishes and the supported city, Abbotsford, British Columbia. No local branch address, coordinates, ratings, reviews, offers, prices or project dates. Four FAQs are visible; no FAQ JSON-LD or rich-result claim was added.

The only shared-tracker change is one `serviceByPath` entry mapping `/venetian-plaster-abbotsford.html` to `venetian_plaster`. All other tracker bytes are unchanged against the implementation baseline. Existing production-host guards, Google tag, events, accepted-form-only `generate_lead`, Ads conversion hook and duplicate-submission protection remain unchanged.

Offline tests verify a photo click produces one `project_photo_click`, not a lead or a duplicate estimate event. Same-tab context carries the initial landing path, service and UTM values to the homepage. Browser tests independently verify this context after all photo handoffs. Hidden form fields are populated by the unchanged homepage submission handler, not on dialog opening; no actual form submission was performed.

## 7. Routing and Sitemap

Added one explicit forced 301 rule in `netlify.toml`:

```text
/venetian-plaster-abbotsford -> /venetian-plaster-abbotsford.html
```

All other redirect configuration is byte-identical to the baseline after removing this one block. No blog handler, car page, unknown-route policy or wildcard routing was changed.

Tested using the actual Netlify CLI development emulator at `http://localhost:4198`, not a basic static server presented as Netlify. It loaded the existing functions/edge function and handled local Image CDN GETs. `HEAD` on its image endpoint returns 405; browser GET image requests return 200. Page/routing checks do not depend on that HEAD response.

| Request | Local Netlify result |
| --- | --- |
| `/venetian-plaster-abbotsford` | One 301 -> canonical HTML 200 |
| Clean URL with `utm_source`, `utm_medium`, `utm_campaign` | One 301 -> 200, original query string preserved |
| `/venetian-plaster-abbotsford.html` | 200; self-canonical |
| `/venetian-plaster-vancouver`, `/fireplace-wall-vancouver`, `/projects` | One 301 each -> canonical 200 |
| `/blog` | One 301 -> `/blog.html` 200 |
| `/blog.html`, `/car.html` | 200 |
| Navigation CSS, shared analytics JS, favicon image | 200 |
| Unknown clean and unknown `.html` paths | 404 |
| `/sitemap.xml` | 200; 52 unique canonical entries, including Abbotsford exactly once: PASS |

Static `sitemap.xml`: 51 -> 52 unique canonical existing documents; original entries unchanged; car noindex utility excluded. The generated public sitemap does not read that XML list. The approved repair adds only `existing.push("/venetian-plaster-abbotsford.html");` to its own static inventory. Removing that line leaves the function byte-identical to its pre-repair source. No API key, network integration, dynamic article mapping, handler, cache policy or blog article logic changed. Both the API-success path and its fallback consume this same existing-path inventory.

Live read-only check before the repair on 2026-10-24: new HTML 200 with expected canonical; live sitemap 200/51 entries without the new URL. That corroborated the original finding. The fix has not been pushed or deployed by the agent, so the local PASS is not a claim that the public production sitemap has already changed. After authorized deployment, recheck the live sitemap, canonical HTML and clean redirect. No full production-wide browser or dynamic-article re-audit is claimed. Blog-rendering function source remains unchanged; fresh remote article-content retrieval was not part of this offline page sprint.

## 8. Validation Results

| Check | Result |
| --- | --- |
| Normal Netlify `build --offline` | PASS: five functions and one edge function bundled, no deployment |
| Analytics and test-file JavaScript syntax | PASS |
| Existing suites plus new regressions | PASS: 118 tests, zero failures; original baseline 111; includes the new generated-sitemap/static-XML inventory parity regression |
| Inventory assertions | Intentionally updated: 51 -> 52 marketing pages, 52 -> 53 measured pages; not disabled or made tautological |
| Approved copy and metadata | PASS: exact public copy/H1/title/description retained |
| Targeted HTML validation | PASS: closing order, permitted content, duplicate IDs, quoted attributes, valid IDs and void-element rules |
| Canonical/indexability/OG/H1 | PASS: one H1/self-canonical, correct OG URL, `index, follow` |
| JSON-LD | PASS: valid JSON and factual supported entities |
| Page reference/image source checks | PASS: 33 references, 13 image-source/variant checks, exact-case sources present |
| Vancouver source-page preservation | PASS: entire head, scripts, styles and media unchanged; only one contextual paragraph added/refined |
| Static sitemap validation | PASS: 52 unique canonical existing documents, no noindex entries |
| Served sitemap validation | PASS in actual Netlify emulator: 52 unique entries; Abbotsford once; every canonical target 200; no redirect/noindex entries |
| `node scripts/seo-validate.js` | FAIL: 146 Image CDN parser warnings, compared with 143 baseline warnings |
| Independent warning reconciliation | PASS: exactly three added warnings are the new page's three CDN image `src` URLs; all 146 decoded underlying sources exist with exact case; no other new failures |
| `git diff --check` | PASS |

Do not label the stock SEO validator PASS. Its known local-file parser does not understand `/.netlify/images`; this sprint did not change that unrelated validator. The served sitemap mismatch was a separate genuine defect and is now resolved locally by the approved function addition, not dismissed as a parser limitation. The final stock-validator output remains byte-identical to the pre-repair 146-warning output.

## 9. Rendered and Interaction QA

Six full-page renders: new Abbotsford page and changed Vancouver source page, each at 1440/390/375px. Hero/full/final screenshots captured; Abbotsford hero, full desktop page and mobile final CTA visually inspected. No text clipping, overlapping controls, horizontal overflow, missing image elements, font-load failures, console/page errors, HTTP resource failures or visible development text was found.

| Page | 1440px | 390px | 375px |
| --- | --- | --- | --- |
| Abbotsford | PASS | PASS | PASS |
| Vancouver source/link | PASS | PASS | PASS |

All nine Abbotsford photo-action handoffs passed using keyboard activation; dialog/photo input visible and initial landing/service/UTM context retained. Minimum tested photo-action height 44px including the shared header; page buttons are at least 48px. The new Vancouver inbound link passed keyboard activation at all three widths. No form, phone call or real lead was submitted. Third-party Google tag/analytics requests were stubbed in the QA browser; existing localhost guards also remain.

Observed initial layout-shift values for Abbotsford: about 0.0055 desktop, 0 at both mobile widths. These are individual local lab observations, not production Core Web Vitals certification. Below-fold figures are lazy-loaded and source proportions are preserved. No new executable page feature or third-party library. Some homepage video requests were cancelled during inquiry/back navigation; these were `net::ERR_ABORTED`, not HTTP failures or page errors.

QA artifacts: `/private/tmp/stiledileo-abbotsford-rc1/`, including `screenshots/results.json`, per-page hero/full/final PNGs, build/test/validator logs, route matrix and initial file fingerprints. These temporary files are not part of the repository footprint.

Follow-up repair evidence: `/private/tmp/stiledileo-abbotsford-rc1/sitemap-repair/` contains the pre-repair function snapshot, scope fingerprint, successful rebuild/118-test logs, unchanged validator output and `served-sitemap.json` with all 52 runtime HTTP/canonical results. No HTML, CSS or media changed during that follow-up; the six rendered checks and nine photo handoffs above remain applicable. Clean/HTML, UTM, existing blog/car/assets and unknown-route checks were rerun through the Netlify emulator after the repair.

## 10. Total Implementation Footprint and Limits

Created during this implementation:
- `venetian-plaster-abbotsford.html`.
- `SEO/ABBOTSFORD-SERVICE-AREA-RC1.md`.

Supporting files modified:
- `sitemap.xml`: one canonical entry.
- `netlify.toml`: one explicit permanent alias.
- `scripts/analytics.js`: one service-path classification.
- `scripts/test-seo-foundation.cjs`: intentional marketing count plus copy/sitemap/route/media regressions.
- `netlify/functions/opinly-sitemap.mts`: separately approved one-line canonical-path addition; no other function changes.
- `scripts/test-measurement-environment.cjs`: intentional measured count plus same-tab attribution/event regression.
- `venetian-plaster-vancouver.html`: one contextual service-area paragraph only.

Not changed: Langley/Surrey/Coquitlam/West Vancouver pages, owner-page metadata, homepage, Projects Hub, media files, shared styles, blog-rendering/other functions, other routing, approved brief, research or marketing drafts. Initial implementation fingerprint: 306 existing files; no unrelated file changes found. The follow-up repair snapshot confirms that only the sitemap function, its regression-test file and this report changed during the approved blocker resolution; all prior in-progress changes were preserved.

Local release blockers: none. The approved function addition, parity regression, rebuild, route checks and runtime sitemap validation have passed. No further content or design work is required for this review candidate. Stop for human review; do not commit, push or deploy from this sprint.

Other limitations, not publication blockers: no authenticated Abbotsford installation, no guaranteed ranking/traffic/lead uplift, no current 19-exclusion/Google-selected-canonical diagnosis, and no new campaign budget. Regional projects keep their true cities. No speculative services, local-office claims, invented prices or universal fireplace suitability claims were added.

## 11. Complete Public Copy

The following is the approved source copy, verified against the implemented main content; normal HTML structure/entity serialization and list presentation do not change its wording.

```markdown
# Custom Plaster Walls & Fireplaces in Abbotsford

An existing fireplace or an unremarkable wall can become the feature that brings a room together. Stile di Leo creates hand-applied decorative finishes for homes in Abbotsford, with the texture, colour and sheen considered alongside the room.

[Send a Project Photo](/#estimate)

*Completed fireplace in Brookswood, Langley: San Marco Marmorino Antico with raised botanical detailing.*

## Start With the Surface You Want to Change

A fireplace surround, a living-room wall or an entrance can be enough. You do not need to refinish every wall or know the name of a plaster before starting the conversation.

Tell us what feels wrong with the existing surface: dark tile, prominent brick joints, a flat painted wall or a finish that no longer suits the room. We can discuss whether decorative plaster is an appropriate option. This is a custom finishing service, rather than a materials shop or ordinary drywall-repair service.

For a wall without a fireplace, our [feature-wall planning guide](/feature-wall-vancouver.html) helps you consider its position and the surrounding finishes.

## Completed Work in the Lower Mainland

In Brookswood, Langley, we transformed a dated brick fireplace with San Marco Marmorino Antico. The finished surface is lighter, with botanical detailing above the mantel. The [Brookswood project](/brookswood-langley-fireplace-transformation.html) includes the original brick, preparation and completed photographs.

*Before: the original brick fireplace in Brookswood, Langley.*

A separate [West Vancouver fireplace transformation](/west-vancouver-fireplace-transformation.html) shows dark large-format tile changed to light Marmorino. Its photographs show the surface from the front and in the room. These completed projects illustrate different starting points; neither is a specification for every fireplace.

*Completed light Marmorino fireplace in West Vancouver.*

## Plan the Finish Around Your Room

Venetian plaster and Marmorino offer different possibilities for texture and sheen. A warm Mediterranean-inspired wall, a quieter matte surface and a more polished effect are different directions, not one interchangeable look.

Bring a reference image and photographs of your room. We can consider the wall beside your flooring, cabinetry and furnishings, rather than choose from an isolated close-up. Explore [Marmorino finishes](/marmorino-vancouver.html) if you are drawn to the material used in the featured projects. Botanical detailing is a custom element, not a standard inclusion in every finish.

## What We Need to Review

Send one photograph of the whole surface, a close-up of its current condition, approximate width and height, and your Abbotsford location. Mention visible cracks, loose material or changes planned around the wall.

For a fireplace, include the opening, hearth, mantel and side returns, along with the model or installation details if available. Substrate condition, the fireplace system and required clearances need review before resurfacing is agreed. Decorative plaster is not a repair for an unsafe installation. Our [fireplace finish guide](/fireplace-wall-vancouver.html) explains the decisions involved.

For tall walls, include the ceiling height and access conditions. Designers and builders can share elevations and adjoining material selections.

## What Affects the Price

Wall area is only one factor. Surface preparation, corners, returns, working height and decorative detailing all affect the scope. A fireplace surround and a full-height wall may require different amounts of preparation and finishing.

Our [plaster pricing guide](/venetian-plaster-cost-vancouver.html) provides early budgeting context. Your estimate depends on the actual surface and agreed work; photographs start that assessment rather than guarantee a final price.

## How the Project Starts

1. **Share the surface.** Send photographs, approximate dimensions, your location and the look you have in mind.
2. **Review the approach.** Discuss finish options, preparation and what needs closer inspection before an estimate can be confirmed.
3. **Coordinate the work.** Agree the scope and schedule, including access, room protection and any related work by other trades.

## Frequently Asked Questions

### Do you accept projects in Abbotsford?

Yes. Stile di Leo serves Abbotsford as part of the Lower Mainland. Send your location and project details so we can discuss the scope and scheduling.

### Can my brick or tiled fireplace be refinished?

Some can, but suitability is individual. The existing surface, fireplace system, condition and clearances must be reviewed. Removal or other preparation may still be needed.

### Do I need to choose Venetian plaster or Marmorino first?

No. Start with the appearance you want and the surface you have. Reference photographs help us discuss an appropriate finish.

### Can you give a final quote from one photograph?

A photograph helps begin the review. Dimensions, surface details and sometimes an inspection are needed before the work and price can be confirmed.

## Tell Us About Your Abbotsford Project

Send a photo of the fireplace or wall, its approximate dimensions and a reference for the result you want. We will review the information and explain the next steps toward an estimate.

[Send a Project Photo](/#estimate)

Prefer to talk first? [Call Leo at +1 604 773 2298](tel:+16047732298).
```

ABBOTSFORD PILOT READY FOR HUMAN REVIEW
