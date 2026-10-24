# Focused Growth Release Verification v1.0

Date: 2026-10-24, America/Vancouver.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`.
Branch: `main`; reviewed HEAD: `1d08f11ab1684ccb6b4d3577f301c2397c167f4c`.
Mode: verification only. No implementation change, staging, commit, push or deployment.

## 1. Scope and Decision

**HOLD: one known exact-case repository validation defect prevents an all-green release gate.** The changed Vancouver page, normal build and applicable offline tests pass. No new customer-facing defect was found in the reviewed candidate.

The current pending implementation consists of:
- Vancouver service-accuracy cleanup, governed by `SEO/VANCOUVER-SERVICE-ACCURACY-CLEANUP-RC1.md`.
- Image-validator reliability repair, governed by `SEO/IMAGE-VALIDATOR-RELIABILITY-RC1.md`.

The city/discovery/Abbotsford package is already in HEAD, not an additional uncommitted production patch. Its routes and sitemap relationships were regression-checked, not rewritten or added to the proposed commit. Mission expansion remains a recommendation, not an implemented page or coverage change.

This narrow interpretation of the combined release keeps the five analysis-only reports below outside the proposed commit. No staged changes exist. This report proposes an explicit manifest; it does not claim a commit was created or that all untracked files are release-approved.

## 2. Change Review

| File | Pending change reviewed | Scope result |
| --- | --- | --- |
| `venetian-plaster-vancouver.html` | 10 insertions / 14 deletions: remove bathroom positioning/referrals; use authenticated West Vancouver Marmorino detail image | Only customer-facing modified file |
| `scripts/seo-validate.js` | 47 insertions / 20 deletions: resolve CDN sources, inspect local paths/case, responsive and inline background sources, distinguish unsupported remote checks | Offline tooling only |
| `scripts/seo-reference-utils.cjs` | New source-resolution helper | Required by the validator; not loaded by production pages |
| `scripts/test-seo-validator.cjs` | New 25-test offline regression suite | Required regression coverage; temporary fixtures outside repository |
| `SEO/VANCOUVER-SERVICE-ACCURACY-CLEANUP-RC1.md` | Existing untracked implementation/provenance report | Supporting release documentation |
| `SEO/IMAGE-VALIDATOR-RELIABILITY-RC1.md` | Existing untracked validator report, including real remaining defect | Supporting release documentation |
| `SEO/FOCUSED-GROWTH-RELEASE-VERIFICATION-v1.0.md` | This new verification report | Only file created during this review |

### Content and Image Accuracy

- PASS for the changed page: no bathroom/shower/wet-room promotion or bathroom referrals remain. The microcement reference retains its selected-dry-interior, after-review qualification.
- PASS for new claims: no project narrative, location, price, review, guarantee or specialist capability was invented. The two existing project-evidence cards are byte-identical to HEAD.
- The replacement source is the existing `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-detail-01.jpg`, corroborated by the project case-study report and current case-study gallery. Its alt text correctly identifies West Vancouver and light Marmorino, not a Vancouver-city installation.
- No asset bytes, geometry, styling, header, script block, title or H1 changed. The metadata change is limited to removing bathroom positioning from the description and matching OG description.
- No sitemap, routing, shared analytics, privacy, contact form or project-photo handling source changed.
- The only anchor changes are removal of the two bathroom referrals; the remaining anchor sequence and contact/pricing/project relationships are preserved.

This confirms the approved delta, not a new whole-site service/capability audit. Historical bathroom pages and unrelated legacy image descriptions remain outside this review; it would be inaccurate to claim that every production page has now been rewritten or independently authenticated.

## 3. Validation Summary

| Gate | Fresh result |
| --- | --- |
| Normal project build | **BUILD PASSED**: `npx --offline netlify build --offline`, exit 0; five functions and one edge function bundled using Netlify Build 37.3.3 |
| Build interpretation | Existing static publish configuration, no package build script; normal Netlify packaging completed locally. Offline mode does not certify a future remote CI run or external provider credentials |
| Full applicable offline tests | 162 tests: 161 passed, 0 failed, 1 skipped |
| Skipped test | Existing friendly-route HTTP integration test, because `ADVISOR_ROUTE_QA_BASE` was deliberately unset. Static route contracts ran; representative real local router checks were also performed below |
| Analytics syntax | `node --check scripts/analytics.js`: PASS; analytics source unchanged |
| Validator/helper/test syntax | All three `node --check` commands PASS |
| SEO validator | **FAIL, exit 1**: one actual filename-case inconsistency on an unchanged blog background, not 146 CDN false positives |
| Source resolution | 457 per-page local CDN source/variant references resolved; no missing-source result reported in the current run |
| Target-page local assets and references | 87 exact-case local references checked, zero missing |
| Internal destination HTTP | All 30 distinct target-page local anchor pathname destinations return direct HTTP 200 in the Netlify preview |
| Focused HTML checks | PASS: closing order, permitted content, duplicate IDs, quoted attributes, valid IDs and void-element rules |
| H1 / canonical / OG / robots | One unchanged H1; one unchanged `.html` canonical; matching unchanged OG URL; `index, follow` |
| JSON-LD | N/A on changed Vancouver page: zero blocks before/after; no schema introduced. Existing repository JSON-LD checks reported no error |
| Protected implementation | Inline styles/scripts, header, title, H1, existing project block and protected metadata verified unchanged against HEAD |
| Diff whitespace | `git diff --check`: PASS |

The validator's 25 new regressions include actual CLI fixtures that fail for missing local/CDN sources and case mismatches. It does not blindly whitelist the CDN endpoint. Remote/nested-CDN runtime checks are explicitly unsupported, not passed; none were reported in the current repository run. Live CDN transformation behaviour, broad remote-image availability and dynamic provider content are not certified by offline source existence.

## 4. Canonical, Sitemap and Routing Checks

The local static XML, the static path inventory in `netlify/functions/opinly-sitemap.mts`, and the fresh public `/sitemap.xml` all contain the same **52 unique canonical URLs**. Abbotsford occurs once; `/car.html` is excluded. All 52 public targets returned direct HTTP 200, matching declared canonical and no blocking robots directives in this check.

The function remains the public sitemap handler, including its existing dynamic-blog extension/fallback behaviour. Equality of the observed 52 entries does not establish successful ingestion of future provider articles or Google indexing.

Fresh checks through the existing Netlify preview at `http://localhost:4198`:

| Request | Result |
| --- | --- |
| `/venetian-plaster-vancouver?utm_source=release_qa&utm_medium=offline` | One 301 to canonical `.html`, then 200; both query parameters preserved; declared canonical excludes the query |
| Clean Fireplace, Marmorino, Projects and Abbotsford paths | One 301 each to the established `.html` destination, then 200 |
| `/blog` | One 301 to `/blog.html`, then 200 |
| `/blog.html` | 200 |
| `/car.html` | 200; approved `noindex, follow` retained |
| Header CSS and shared analytics JS | 200 |
| Selected West Vancouver source photograph | 200 |
| Unknown clean and `.html` test URLs | 404; no fallback to a commercial page |

There were no redirect loops, avoidable chains or accidental URL convention changes in the representative checks. Dynamic `/blog/*` handler source is unchanged; no fresh provider-article integration certification is claimed.

Public sitemap/target reads are observations of current production, **not post-deployment verification of the uncommitted Vancouver cleanup**. No authorized deployment occurred in this review.

## 5. Rendered QA and Contact Workflow

The only affected rendered page is `/venetian-plaster-vancouver.html`. Validator scripts and Markdown reports are not new customer-facing pages. The exact current working-tree HTML was served through the existing Netlify CLI environment, including Image CDN handling, not `file://` or a static server pretending to emulate redirects.

Fresh headless Chrome renders scrolled the whole page at each viewport, decoded below-fold images, checked fonts/resources and captured hero, intro, full-page and final-action screenshots. Representative desktop/mobile screenshots were visually inspected; no new clipping, collision or hierarchy regression was found in the changed layout. Existing generous spacing, imagery frames and navigation remain unchanged.

| Viewport | Horizontal overflow | Broken source images | Font failures | Console/page errors | HTTP resource failures | Contact handoffs | Observed layout-shift sum |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| 1440px | 0px | 0 | 0 | 0 | 0 | 3/3 PASS | 0.003178 |
| 390px | 0px | 0 | 0 | 0 | 0 | 3/3 PASS | 0 |
| 375px | 0px | 0 | 0 | 0 | 0 | 3/3 PASS | 0 |

All nine keyboard-activated handoffs passed: shared-header and hero photo actions open the existing `/#estimate` dialog; the final consultation CTA reaches `/#contact`, whose photo action opens the same dialog. The photo input is visible and initial landing path / QA UTM context survives the same-tab handoff. Tested controls are at least 44px tall.

No form was submitted, no phone/email action was dispatched, no advisor request was sent and no production conversion was intentionally fired. Analytics/ad-vendor browser requests were stubbed; existing local measurement guards remained active. These checks verify the contact destination and intake UI, not downstream email delivery, CRM qualification or actual production analytics ingestion. A hidden, initially sourceless photo-preview image is not a broken loaded project asset.

Screenshots and machine-readable QA results: `/private/tmp/stiledileo-focused-growth-release/`. Local layout-shift observations are not field Core Web Vitals certification. Previously released city pages are not falsely described as newly re-rendered in this pending-change review.

## 6. Remaining Blocker

**One genuine repository exact-case validation failure remains, on an unchanged file outside the approved implementation footprint.**

```text
blog.html:707
Referenced: /images/Fire-place-vancouver1.png
Actual:     /images/Fire-Place-vancouver1.png
```

The smallest repair is a single background-reference case correction. It was not made: this request is release verification of the approved combined set, not authorization to alter an additional production page. Do not weaken the validator or omit this finding to obtain a green result.

The immediately preceding validator sprint checked both live case variants: HTTP 200 with identical image bytes. That is dated same-day evidence, not a fresh case-variant fetch in this review. The finding is a repository exact-case/portability defect, not a reproduced production image outage. It is not caused by the Vancouver cleanup or validator source-resolution repair; the reliable validator now exposes it.

To clear the all-green gate: obtain approval for that one-reference correction, extend the manifest to include `blog.html`, then rerun the validator and scoped checks. Do not stage or commit the current candidate as though that gate already passed.

No other candidate-specific content, layout, build, contact, canonical or sitemap blocker was found. No environment blocker prevented the normal local build. Missing post-deployment verification is a future release step, not evidence that deployment failed.

## 7. Exact Proposed Commit Footprint

**Seven files, proposal only; not staged or committed:**

```text
venetian-plaster-vancouver.html
scripts/seo-validate.js
scripts/seo-reference-utils.cjs
scripts/test-seo-validator.cjs
SEO/VANCOUVER-SERVICE-ACCURACY-CLEANUP-RC1.md
SEO/IMAGE-VALIDATOR-RELIABILITY-RC1.md
SEO/FOCUSED-GROWTH-RELEASE-VERIFICATION-v1.0.md
```

No other file belongs in this current proposed commit. `blog.html` is explicitly NOT included until its separate correction is authorized. A later approved correction would change this manifest; it is not silently counted here.

Existing untracked analysis documents excluded and preserved:

```text
SEO/CONFIRMED-INDEXATION-REPAIRS-RC1.md
SEO/CURRENT-GSC-EXCLUSION-DIAGNOSIS-v1.0.md
SEO/LOCAL-DISCOVERY-REFERRAL-EXECUTION-PACK-v1.0.md
SEO/MISSION-CITY-EXPANSION-DECISION-v1.0.md
SEO/QUALIFIED-INQUIRY-BASELINE-v1.0.md
```

No city, homepage, project, asset, schema, route, sitemap, analytics or provider function file is newly changed by the pending release outside the manifest. The image is already tracked; it must not be recopied or unnecessarily recommitted. Verification fingerprints cover all 318 pre-existing tracked/nonignored untracked files; this review changes none of them and adds only this report. Build outputs remain ignored local artifacts, not additions to the proposed commit.

## 8. After Explicit Deployment Authorization

No commit, push or deploy was requested or performed here. If the corrected candidate is later approved and deployed:

1. Record the exact commit, deploy ID, published timestamp and manifest; confirm a ready/published build, not just a successful push.
2. Fetch the live Vancouver canonical page and compare the corrected service descriptions and authenticated intro asset with the approved candidate. Check one H1, unchanged canonical/OG URL, indexability and intended metadata.
3. Fetch live source and selected CDN image variants, CSS and JS; check resource and browser-console results at 1440/390/375px.
4. Recheck clean-to-HTML normalization, query preservation, existing blog/car behaviour, unknown-route 404s and no redirect loops/chains.
5. Reconcile the actual public sitemap with approved static/function inventories and check inclusion/exclusion rules.
6. Exercise the live contact destinations and photo-intake UI without submitting a test lead or firing unnecessary conversions. Keep successful submission, qualified inquiry and sale distinct.

A deployment, HTTP 200 or sitemap entry does **not** prove Google indexing, ranking improvement or additional sales. Those require separate GSC and qualified-inquiry observation over comparable, sufficiently informative windows.

## Final Status

HOLD - ONE EXACT-CASE VALIDATION CORRECTION REQUIRES APPROVAL
