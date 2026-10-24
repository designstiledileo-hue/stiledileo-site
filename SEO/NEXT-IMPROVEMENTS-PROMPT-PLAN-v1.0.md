# Stile di Leo - Next Improvements Prompt Plan v1.0

Prepared: 2026-10-23
Mode of this document: PLANNING ONLY. This document does not authorize execution, publishing or deployment.
Objective: increase qualified fireplace/decorative-wall inquiries from the Lower Mainland, not page count.

## How to Use This Plan

Run one numbered prompt at a time, only when the owner requests it. Read the shared operating brief first. Each sprint stops at its stated review gate. Do not execute later prompts automatically.

Default implementation sequence:
1. Existing city CTR recovery.
2. Existing-page discovery and project connections.
3. Abbotsford brief approval.
4. Abbotsford local implementation.
5. Release review for the selected batch.
6. Human-authorized release, followed by measurement.

Parallel, independent work:
- Current GSC exclusion diagnosis: Prompt 5.
- Business Profile/distribution drafts: Prompt 6.
- Mission brief: Prompt 7, after the Abbotsford brief establishes the ownership model.

Prompt 8 is the release gate, not permission to push.
Prompt 9 runs after a real release date and sufficient new data exist.
Mission implementation is a separately authorized follow-up, never an automatic city-name substitution.

## Shared Operating Brief - Applies to Every Prompt

Repository:
`/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`

Use this repository only. Confirm branch and working-tree state; main is the expected branch, not permission to switch branches unsafely. Do not create duplicate repositories, temporary branches or worktrees.

Read:
- `SEO/LOWER-MAINLAND-CITY-EXPANSION-RESEARCH-v1.0.md`
- `SEO/INDEXATION-RECOVERY-LOCAL-EXPANSION-v1.0.md`
- Relevant existing RC reports, page sources, analytics and navigation before editing.

Preserve existing uncommitted work:
- Surrey, Langley and Coquitlam local improvements.
- Existing research/indexation reports.
- Acquisition report and `marketing/local-acquisition-v1/` drafts.
- Any other user changes discovered during preflight.

Record before/after status and the starting diff. Merge with existing work; never overwrite newer content with a template or previous copy. Stop if unexplained concurrent changes appear. Do not stage, commit, push or deploy unless a separate user instruction explicitly authorizes that action. A push to connected main can auto-deploy, so it is not a harmless review step.

### Confirmed Business Facts

- Service coverage: ALL LOWER MAINLAND, including Abbotsford and Mission.
- No minimum project value, travel surcharge, turnaround guarantee or advertising budget has been supplied.
- Sellable scope: fireplace transformations, feature walls, Venetian plaster, Marmorino and decorative plaster. Microcement/specialty applications only where accepted and evidenced.
- Do not market bathrooms, showers, Tadelakt, countertops, exterior stucco repair, gas servicing or chimney repair.
- No invented offices, local customers, prices, reviews, insurance credentials, project dates or material ratings.
- No universal demolition-free or heat-safe claims. Suitability depends on the actual installation.
- Preserve approved visual system and premium editorial voice. No redesign or broad owner-page rewrite.

### Ownership

Keep:
- `/venetian-plaster-vancouver.html`: material/service owner.
- `/marmorino-vancouver.html`: Marmorino owner.
- `/fireplace-wall-vancouver.html`: fireplace application owner.
- `/feature-wall-vancouver.html`: feature-wall application owner.
- `/venetian-plaster-cost-vancouver.html`: pricing owner.
- `/projects.html`: central portfolio.
- Existing case studies: evidence of specific completed work.

City pages establish truthful availability and local hiring relevance. They must not reproduce entire material, application and pricing pages.

Candidate new owners, not yet created:
- `/venetian-plaster-abbotsford.html`
- `/venetian-plaster-mission.html`

Do not create city-by-material-by-application grids or duplicate Coquitlam/Surrey/Langley owners.

### Evidence

Research baseline, GSC WEB, July 22-October 19, 2026:
- wall plaster langley -> Langley owner: 85 impressions, position 4.18, zero clicks.
- wall plaster surrey -> Surrey owner: 87 impressions, position 9.09, zero clicks.
- Abbotsford/Mission demand evidence is limited; do not promise large traffic.
- Planner estimates are rounded and include close variants; null is not zero.
- Mediterranean style is an accessible visual description, not a proven replacement keyword.
- GBP currently returns Abbotsford among service areas, but not Mission.
- The current 19 GSC exclusions remain unverified.

Refresh material evidence if old by execution time. Keep query/page/search-type/date dimensions separate. Never call impressions leads or tracked lead events sales.

### Project Media

Use only authenticated project media referenced by existing approved case studies:
- Brookswood, Langley: dated brick to San Marco Marmorino Antico, with botanical detailing.
- West Vancouver: dark large-format tile to light Marmorino.

Verify each exact file path against the current repository. Preserve actual city labels. Do not claim these are Abbotsford or Mission installations. Exclude unapproved gold-vein versions, duplicate crops that add nothing, stock/generated substitutes and ambiguous assets whose provenance is unverified. No image generation or geometry alteration.

### Shared Acceptance Checks for Implementation

Capture baseline, then run relevant checks:
- Normal project Netlify build; never deploy merely to test.
- `node --check scripts/analytics.js` when relevant.
- `node --test scripts/test-measurement-environment.cjs scripts/test-seo-foundation.cjs`.
- `node scripts/seo-validate.js`.
- Targeted HTML, canonical, OG URL, sitemap, internal-link, image/source-case and JSON-LD checks.
- Render full pages at 1440, 390 and 375 pixels.
- Test contact actions, keyboard access, touch targets, overflow, images and console.
- `git diff --check`, final diff and exact file footprint.

The stock SEO validator currently misclassifies Netlify Image CDN URLs as missing local files. Reproduce the baseline; independently unwrap source URLs and check exact filenames/served responses. Do not label the validator PASS when it fails. Distinguish existing tool limitations from new substantive defects.

Browser, auth or build environment restrictions are not page defects. Record the precise unverified gate; do not claim a render/build passed without evidence. Do not bypass denied browser access, inspect stored credentials or fabricate URL Inspection results.

No real lead submissions, production analytics pollution, external messages or profile mutations during testing.

---

## Prompt 1 - Existing City CTR Recovery

### Purpose

Turn existing local search visibility into better-qualified visits without changing page ownership.

### Ready-to-Run Prompt

TASK: STILE DI LEO - EXISTING CITY CTR RECOVERY v1.0

Apply the shared operating brief in:
`SEO/NEXT-IMPROVEMENTS-PROMPT-PLAN-v1.0.md`

Work on these existing pages only:
- `venetian-plaster-langley.html`
- `venetian-plaster-surrey.html`

Read `feature-wall-surrey.html` for ownership context; do not edit it in this sprint.

Before editing:
1. Inspect existing uncommitted improvements and preserve them.
2. Record current local/live title, description, H1 and canonical.
3. Use available connected GSC query/page data to confirm receiving URLs and date window.
4. Inspect public search-result intent/snippets where available. Do not confuse a non-localized search sample with a user's exact SERP.
5. Record what remains unverified rather than postponing every useful improvement.

Implement:
- One clear title and description per page that preserve decorative-plaster installation and local intent.
- Explain fireplace/feature-wall outcomes naturally; do not cram every service into both metadata fields.
- Qualify against ordinary drywall repair, retail supplies and appliance servicing.
- Keep H1 and canonical unchanged unless an independently confirmed defect requires escalation.
- Preserve the prepared customer-language, project references and direct photo inquiry.
- Only tighten the opening if it conflicts with the selected metadata or repeats itself.
- Use Mediterranean-style language only when it genuinely explains a pictured aesthetic.
- No additional keyword sections, fake urgency, unverified free estimates or price claims.
- Do not change shared analytics or add trackers.

Choose one metadata version, not an automatic rotation. Record the rationale and release version so later comparisons remain interpretable.

Validate both pages and contact handoff at all three viewports. A metadata/content change is not an isolated causal CTR experiment; document both if both changed.

Create:
`SEO/EXISTING-CITY-CTR-RECOVERY-RC1.md`

Include current/proposed metadata, primary intent, exact edits, preserved prior work, before/after diff, source/date baseline, validation, screenshots and limitations.

Return:
EXISTING CITY CTR RECOVERY READY FOR HUMAN REVIEW
or
EXISTING CITY CTR RECOVERY BLOCKED
List genuine blockers only. Do not push or deploy. Stop.

### Gate

Owner reviews snippets and rendered pages before release. Success now means credible, intent-consistent improvements and no regressions, not a promised CTR.

---

## Prompt 2 - Coquitlam Discovery and West Vancouver Project Connection

### Purpose

Strengthen existing destinations instead of creating replacement pages for weak discovery.

### Ready-to-Run Prompt

TASK: STILE DI LEO - EXISTING CITY DISCOVERY AND PROJECT CONNECTION v1.0

Apply the shared operating brief.

Primary pages:
- `venetian-plaster-coquitlam.html`
- `venetian-plaster-west-vancouver.html`

Conditional link-only sources:
- `feature-wall-vancouver.html`
- `venetian-plaster-vancouver.html`
- `west-vancouver-fireplace-transformation.html`

Do not rewrite these source pages or alter their metadata. Select only the source genuinely useful to a visitor; list the selected footprint before editing.

Tasks:
1. Recount distinct incoming source pages, not just repeated anchors.
2. Preserve the existing Coquitlam draft and current canonical.
3. Identify one additional natural Coquitlam discovery path if one exists. Prefer relevant service-area/application context, not a new footer list.
4. If no natural opportunity exists, report it; do not force a link for a numerical target.
5. Strengthen West Vancouver's existing relationship with its authenticated project, using concise factual observations instead of generic luxury/housing assumptions.
6. If a city-specific image claim is unverified, remove the location claim, not the image by default.
7. Preserve the distinction between ongoing local service and one completed case.
8. Keep photograph locations explicit; do not turn a West Vancouver project into Coquitlam proof.
9. Use existing photo/contact infrastructure. No extra gallery dump or duplicate primary CTA block.

Do not create a new page, add site-wide links or change shared design.

Create:
`SEO/EXISTING-CITY-DISCOVERY-PROOF-RC1.md`

Return exact incoming/outgoing link changes, anchor text, proof used, pages edited, any unchanged weak links and complete validation.

End:
CITY DISCOVERY AND PROJECT CONNECTION READY FOR HUMAN REVIEW
or
CITY DISCOVERY AND PROJECT CONNECTION BLOCKED

No commit, push or deployment. Stop.

---

## Prompt 3 - Abbotsford Editorial and Ownership Brief

### Purpose

Approve a useful, distinct new page before generating HTML.

### Ready-to-Run Prompt

TASK: STILE DI LEO - ABBOTSFORD SERVICE-AREA PAGE BRIEF v1.0

Apply the shared operating brief.
Mode: research synthesis and editorial brief only. Do not create HTML or modify production files.

Proposed canonical:
`https://stiledileo.com/venetian-plaster-abbotsford.html`

Verify that no existing production owner now serves this exact role. If it exists, recommend improving it rather than duplicating it.

Prepare:
1. Primary intent: hiring a decorative-plaster specialist serving Abbotsford.
2. Secondary intent: assessing a fireplace or focal-wall transformation.
3. What this page adds beyond the Vancouver owner and Langley page.
4. Exact proposed title, description, H1 and section sequence.
5. Full draft public copy, with source notes kept separate.
6. Asset manifest: exact paths, source project, verified city/material, role, dimensions and optimization plan.
7. Inbound/outbound link plan with the customer purpose of each link.
8. FAQ questions grounded in actual intake needs; no invented local preferences.
9. CTA plan using the existing photo workflow, at most three primary conversion moments.
10. Claims allowed, claims excluded and any real missing input.

Preferred journey:
Transformation image and local availability -> applications -> authentic regional example -> preparation/scope -> pricing factors -> simple process -> FAQ -> photo inquiry.

Aim for concise useful copy, usually about 600-900 words, not a mandatory word-count target. Do not pad with neighborhood profiles or population/wealth claims.

Use application language before explaining material terminology. A warm Mediterranean aesthetic can be a secondary choice, not the entire positioning.

Do not invent an Abbotsford project, office, showroom or local testimonial. Correctly labelled regional work is acceptable. Do not require historical Abbotsford impressions as a prerequisite for a missing-page pilot.

Create:
`SEO/ABBOTSFORD-SERVICE-AREA-BRIEF-v1.0.md`

Return:
ABBOTSFORD BRIEF READY FOR APPROVAL
or
ABBOTSFORD BRIEF NEEDS REVISION

Do not implement the page. Stop for owner approval.

---

## Prompt 4 - Abbotsford Local Implementation

### Purpose

Build the approved brief as one production-quality, locally reviewable city page.

### Ready-to-Run Prompt

TASK: STILE DI LEO - ABBOTSFORD SERVICE-AREA PILOT RC1

Apply the shared operating brief.
Prerequisite: owner approval of `SEO/ABBOTSFORD-SERVICE-AREA-BRIEF-v1.0.md`.
If approval is absent, stop at the brief; do not assume this plan is approval.

Create only:
`venetian-plaster-abbotsford.html`

Preserve approved copy/ownership and existing brand components. Do not mechanically copy a city template.

Permitted supporting changes, only where necessary:
- `sitemap.xml`: one canonical entry, no duplicates.
- `netlify.toml`: one explicit permanent clean-to-.html rule in the existing convention.
- `scripts/analytics.js`: minimal service-path classification, no new vendor/event semantics.
- `scripts/test-seo-foundation.cjs`: intentional inventory/route expectations and relevant new regression coverage.
- `scripts/test-measurement-environment.cjs`: intentional measured-page inventory expectation.
- At most two already-approved contextual link source pages from the brief, link-level changes only.
- Reuse existing CSS/assets. A page-scoped stylesheet or optimized derivative is allowed only if necessary and documented; no global redesign.

Important existing test dependencies:
- Marketing-page count is currently hard-coded as 51.
- Measured-page count is currently hard-coded as 52.
- Recount before editing. If exactly one marketing/measured page is intentionally added and nothing else changes, update to 52 and 53 respectively.
- Never replace these assertions with tautologies, disable checks or change counts to conceal unintended pages.
- Add the city path to existing service classification if required; preserve production-host analytics guards and accepted-form-only generate_lead behavior.

Routing:
- /venetian-plaster-abbotsford -> one 301 -> /venetian-plaster-abbotsford.html.
- Preserve query parameters.
- .html returns 200, self-canonical and correct og:url.
- Do not alter blog functions, dynamic /blog/* routing, car.html or unknown-route behavior.
- If platform routing cannot be faithfully tested locally, report that gate instead of treating a basic static server as Netlify.

Media:
- Use the approved authentic manifest and current responsive delivery convention.
- Correct project labels, width/height, meaningful alt, efficient source sizes.
- Hero/LCP not lazy-loaded; below-fold media lazy-loaded.
- No new slider merely to imitate a case study.

Structured data:
- Match the existing site architecture and business identity.
- Only factual Service/Breadcrumb/business references supported by visible content.
- FAQ JSON-LD only if it exactly matches visible FAQ.
- No fabricated local address, rating, review, geo coordinates, price or project date.

Contact:
- Reuse /#estimate and existing verified phone/email where appropriate.
- Test same-tab initial-landing context.
- No real test lead or duplicate event firing.

Create:
`SEO/ABBOTSFORD-SERVICE-AREA-RC1.md`

Report exact copy/metadata/H1/canonical, image manifest, schema, internal links, routing, sitemap count before/after, tests, renders, known tool limitations and full changed-file footprint.

Return:
ABBOTSFORD PILOT READY FOR HUMAN REVIEW
or
ABBOTSFORD PILOT BLOCKED

Do not commit, push or deploy. Stop.

---

## Prompt 5 - Current GSC Exclusion Resolution Map

### Purpose

Identify actual exclusion problems without guessing the current list or delaying all growth work.

### Ready-to-Run Prompt

TASK: STILE DI LEO - CURRENT GSC EXCLUSION RESOLUTION MAP v1.0

Apply the shared operating brief.
Mode: read-only investigation and remediation recommendations. No production changes or submissions.

Use connected account discovery and field discovery first. Read Search Console performance and sitemap data directly where available.

Read the current Page indexing report and URL Inspection only through an authorized interface. Previous browser access was denied. Do not retry a denied surface or use credential/session workarounds unless the user has explicitly re-enabled access. Do not claim the performance connector exposes URL Inspection.

If current exclusion access is unavailable:
- Record the exact access limitation.
- Continue useful performance/live URL analysis.
- Mark current index status and Google-selected canonical UNKNOWN.
- Do not substitute September's historical list for the current 19.
- A manual export is an optional fallback, not mandatory busywork if direct access becomes available.

When the actual report is accessible, record actual count/date even if it is no longer 19.

For every URL:
URL; exclusion reason; last crawl; Google-selected canonical; declared canonical; HTTP chain; sitemap presence; internal discovery; commercial role; evidence source/date; recommended action; priority.

Classify:
EXPECTED ALIAS
INTENTIONAL NOINDEX/UTILITY
CONFIRMED TECHNICAL DEFECT
CONTENT/DISCOVERY REVIEW
PENDING RECRAWL
INSUFFICIENT EVIDENCE

Do not request indexing of redirect aliases, campaign noindex pages or sitemap.xml as a content page.
Do not merge legitimate pages or rewrite content based on impressions alone.
Do not run broad routing repairs without reproducing a defect.

Create:
`SEO/CURRENT-GSC-EXCLUSION-RESOLUTION-MAP-v1.0.md`

Return confirmed findings separately from inferred/unknown findings, with a small exact implementation queue if needed.

End:
GSC EXCLUSION MAP VERIFIED
or
GSC EXCLUSION MAP PARTIALLY VERIFIED - ACCESS REQUIRED

No profile edits, indexing requests, commit or deployment. Stop.

---

## Prompt 6 - Business Profile and Local Distribution Draft Pack

### Purpose

Give pages a distribution plan without publishing unapproved claims or launching ads.

### Ready-to-Run Prompt

TASK: STILE DI LEO - LOCAL DISTRIBUTION AND PROFILE DRAFT PACK v1.0

Apply the shared operating brief.
Mode: read-only research and drafts only. No external write actions.

Inspect current connected Business Profile metadata before suggesting changes.
Coverage is owner-confirmed all Lower Mainland; Abbotsford already appears in the last returned list, Mission does not. Recheck current state; do not propose adding an already-present area.

Prepare:
1. Exact old/proposed service-area change list with factual rationale and account identity.
2. Profile-limit/eligibility check using current official guidance.
3. Two project-led GBP post drafts, authentic image mapping and valid destination.
4. Two Instagram/Facebook organic drafts using the same real project evidence.
5. Three individualized partner-introduction drafts based on real first-party prospects:
   - an Abbotsford decorating/material-referral business;
   - a Mission fireplace supplier/installer;
   - a relevant designer/builder.
6. One restrained homeowner follow-up template and one estimate follow-up template, without invented response-time promises.
7. A simple activity/lead scoreboard compatible with existing acquisition drafts; do not create a parallel CRM.

Use known draft packs first; improve or reference them rather than duplicating work. Verify whether a prospect is new and whether outreach is appropriate. Do not assume an existing partnership, endorsement or permission to contact.

Use existing accepted event names and UTM conventions. No personal details in UTMs or analytics. Any new city URL must be live 200 before a post/send uses it; otherwise use an existing relevant service/project page.

Do not publish posts, edit profile fields, send messages, add areas, request reviews, contact prospects or launch ads. Exact proposed external changes require separate owner approval.

Budget remains UNASSIGNED. Organic distribution is not blocked by that, but paid campaigns must not start.

Create:
`SEO/LOCAL-DISTRIBUTION-PROFILE-DRAFT-PACK-v1.0.md`
Reference existing marketing files; add only necessary clearly named drafts after checking for duplicates.

End:
LOCAL DISTRIBUTION PACK READY FOR APPROVAL
List each external action still requiring approval. Stop.

---

## Prompt 7 - Mission Distinctness and Editorial Brief

### Purpose

Plan the second city without publishing an Abbotsford clone.

### Ready-to-Run Prompt

TASK: STILE DI LEO - MISSION SERVICE-AREA DISTINCTNESS BRIEF v1.0

Apply the shared operating brief.
Mode: brief and copy only. Do not create HTML.

Candidate:
`/venetian-plaster-mission.html`

Read the approved Abbotsford brief/current implementation if available.
Do not use search-volume nulls as proof that Mission has no customers. Do not claim it has the same demand confidence as Langley/Surrey.

Prepare:
- Separate primary/secondary intent and useful customer journey.
- A comparison of proposed Mission and Abbotsford content by section.
- Specific reasons for retaining shared necessary facts versus creating unique explanation.
- Clear boundary between decorative surround/wall finishing and appliance servicing.
- Correctly labelled regional proof.
- Full public-copy draft, proposed metadata/H1, exact asset and link manifest.
- Truthful service availability without fictitious Mission office/project.
- Any genuine future proof/operational input needed; no invented neighborhood stereotypes.

If the page only changes a city name, return BRIEF NEEDS REVISION. Do not force differentiation by inventing services or client behavior.

Create:
`SEO/MISSION-SERVICE-AREA-BRIEF-v1.0.md`

Return:
MISSION BRIEF READY FOR APPROVAL
or
MISSION BRIEF NEEDS REVISION

No implementation, commit or deployment. Stop.

### Later Mission Implementation

Only after separate approval: use Prompt 4's implementation and validation requirements, substituting the approved Mission brief/path and a Mission-specific report. Recount tests/sitemap from the actual then-current state; do not blindly repeat Abbotsford's count increments. Confirm and explicitly whitelist Mission's exact link sources. Do not automatically run this follow-up after the brief.

---

## Prompt 8 - Combined Release Candidate Review

### Purpose

Review the actual combined state and produce a safe, focused release footprint.

### Ready-to-Run Prompt

TASK: STILE DI LEO - LOCAL GROWTH COMBINED RELEASE REVIEW v1.0

Apply the shared operating brief.
Mode: release review, not a new rewrite or deployment sprint.

Review ONLY completed/owner-approved scope:
- Existing Langley/Surrey changes.
- Coquitlam/West Vancouver link/proof changes, if approved.
- Abbotsford pilot, if approved.
- Mission only if separately implemented and approved.

Before starting, enumerate the exact candidate files and distinguish them from unrelated untracked work. Do not stage anything.

Check:
1. Each city has one clear owner and an independent useful purpose.
2. Regional project media retains actual locations; no fake local proof.
3. Core material/application/pricing pages preserve ownership.
4. Customer can reach contact without reading multiple articles.
5. No excessive repeated CTA blocks, SEO architecture language or template-city copy.
6. All planned new pages have natural discovery, not only a sitemap entry.
7. One H1, correct metadata/canonical/og:url, factual schema and no placeholders.
8. Netlify build, syntax, tests, HTML, links, images, sitemap and routing.
9. Full 1440/390/375 renders and keyboard/mobile contact interactions.
10. Clean URL direct 301, query preservation, .html 200.
11. Existing /blog, /blog.html, a real /blog/* route, /car.html, assets and unknown 404 routes remain correct.
12. Analytics production guards, accepted-lead-only behavior, deduplication and contact attribution.
13. No real test lead or live tracking contamination.
14. Existing validator limitations and environment-blocked checks clearly separated from genuine defects.

Make no changes if everything is good.
If a genuine defect appears, make the smallest correction within the approved footprint, explain it and rerun relevant checks. Stop for approval if a correction would broaden scope.

Create:
`SEO/LOCAL-GROWTH-COMBINED-RELEASE-RC1.md`

Include exact file list, rendered screenshots, test results, baseline limitations, proposed focused commit footprint and evidence still required.

Return:
APPROVED FOR OWNER-AUTHORIZED RELEASE
or
HOLD - RELEASE BLOCKERS REMAIN

Do not commit, push, deploy, publish profile changes or submit indexing. Stop.

A subsequent owner instruction must explicitly authorize the focused commit/push/release. Do not include unrelated marketing/research files just because they are untracked.

---

## Prompt 9 - Post-Release Performance and Revenue Review

### Purpose

Evaluate real outcomes without declaring success from page count, small samples or overlapping windows.

### Ready-to-Run Prompt

TASK: STILE DI LEO - LOCAL GROWTH POST-RELEASE REVIEW v1.0

Apply the shared operating brief.
Mode: read-only measurement and next-action recommendations.

Verify actual production release date, version and changed pages. Do not use the document creation date as the release date.

Fetch available connected GSC WEB data:
- Comparable non-overlapping 28-day before/after windows where available.
- Page and query/page dimensions separately.
- Same country/device scope.
- Position-sensitive CTR interpretation.
- Explicit list of missing, anonymized or insufficient rows.

If 28 post-release days are not available, give an early operational check, not a mature SEO verdict. Sparse new cities may need 60-90 days for a useful observation; do not wait indefinitely to fix a real technical failure.

Read GA4/GBP context without treating city geolocation as project location.
Use the existing private lead log if supplied/available:
customer-supplied project city; landing path/source; requested service; qualified/unqualified; estimate; won/lost; known project value.

Do not expose PII in public reports or analytics.
Do not interpret accepted-form event counts as verified sales.
Do not invent missing lead quality, cost or revenue.

For each city recommend exactly:
CONTINUE
REFINE EXISTING PAGE
IMPROVE DISTRIBUTION
TECHNICAL FOLLOW-UP
INSUFFICIENT DATA
DEFER FURTHER EXPANSION

Explain uncertainty and concurrent changes. Do not attribute causation to a title edit merely because clicks changed.

Create:
`SEO/LOCAL-GROWTH-POST-RELEASE-REVIEW-v1.0.md`

Return the next three actions ranked by qualified-project value, not raw national search volume.

Do not edit pages, change budgets, launch campaigns, send outreach or create recurring automations. Stop.

---

## Suggested Work Calendar

These are planning slots, not promised completion dates, automatic jobs or an advertising schedule.

| Period | Primary work | Parallel work | Gate |
| --- | --- | --- | --- |
| First work block | Prompt 1: existing CTR recovery | Prompt 5: accessible GSC diagnosis | Human review |
| Next work block | Prompt 2: discovery/proof | Prompt 6: draft distribution pack | Human review |
| Following block | Prompt 3: Abbotsford brief | Mission brief if capacity permits | Brief approval |
| After brief approval | Prompt 4: Abbotsford implementation | Finalize approved distribution drafts | Full local QA |
| Release block | Prompt 8: combined review | Owner reviews exact external actions | Separate release authorization |
| After real release | Live verification and approved distribution | Lead handling and private outcome logging | No false indexation claims |
| Around day 30 after release | Prompt 9, if data window is sufficient | Refine based on inquiry quality | Continue/refine decision |
| Days 60-90 if sparse | Reassess city pilots | Consider next city using real evidence | No automatic bulk expansion |

## Decisions Already Made

- All Lower Mainland coverage confirmed; do not ask the owner to reconfirm it for every sprint.
- Abbotsford is the first missing-city pilot, not a guaranteed high-volume market.
- Mission is next with lower confidence, not rejected because GSC lacks rows.
- Existing city improvements stay ahead of mass expansion.
- Advertising budget remains unassigned.
- No production work is authorized merely by generating this plan.

## Plan Creation Record

This planning task creates only:
`SEO/NEXT-IMPROVEMENTS-PROMPT-PLAN-v1.0.md`

It does not execute any sprint above. Existing production diffs and unrelated drafts must remain unchanged.

