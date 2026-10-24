# Qualified Inquiry Baseline v1.0

Prepared: 2026-10-24, America/Vancouver.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`.
Branch: `main`; HEAD `1d08f11ab1684ccb6b4d3577f301c2397c167f4c`, plus pre-existing local Vancouver cleanup and three reports preserved unchanged.
Mode: analysis only. No tracking, metadata, website, lead-record, profile, ad or deployment change.

## 1. Executive Baseline

- VERIFIED FACT: the current production package was published at **2026-10-24 11:14:34.180 PDT**, according to Netlify published_at, not a Git/report date. It contains the city/discovery/Abbotsford work. This is a verified publication of that package, not proof it was the first deploy carrying every component.
- VERIFIED FACT: a full post-release reporting window does not exist yet. The additional Vancouver service-accuracy cleanup is uncommitted/local and must have its own future release marker if approved and published.
- VERIFIED FACT: baseline WEB page-grain GSC rows total 9 clicks / 2,407 impressions for September 24–October 21. The prior equal-length context window totals 13 / 2,598. These are returned page-table sums, not asserted property-chart totals and not a before/after assessment of the latest releases.
- VERIFIED FACT: GA4 production hostname reports 5 generate_lead occurrences. **Four are explicitly QA-labelled**. Only 1 remains after known-QA exclusion, and it is not independently verified as a genuine or qualified customer.
- VERIFIED FACT: both returned generate_lead key-event counts are in the explicitly QA-labelled cohort. The remaining non-QA-labelled signal has 0 returned key-event counts. Historical event_count and the connector's conversions/key-event metric are not interchangeable.
- UNAVAILABLE EVIDENCE: verified qualified inquiries, estimates sent, won jobs and won value for this cohort. The repository lead register contains examples, not actual leads; other scoreboards are empty/initialized templates. Do not call unknown outcomes zero sales.
- RECOMMENDATION: start the existing owner-operated lead register, reconcile the one non-QA-labelled signal privately and measure stable post-release periods before changing titles or expanding city pages.

## 2. Sources and Reporting Contract

| Dataset | Property / account | Window / snapshot | Dimensions | Returned rows / interpretation |
| --- | --- | --- | --- | --- |
| GSC page baseline | https://stiledileo.com/ | 2026-09-24–2026-10-21 | page × search_type | 68 returned; 42 WEB used; 26 IMAGE excluded |
| GSC page prior context | https://stiledileo.com/ | 2026-08-27–2026-09-23 | same page × search_type grain | 66 returned; 40 WEB used; not post-release |
| GSC query ownership | https://stiledileo.com/ | 2026-09-24–2026-10-21 | query × page × search_type | 423 returned; 209 WEB used |
| GSC daily completeness | https://stiledileo.com/ | 2026-09-24–2026-10-21 | date × search_type | 112 returned; WEB rows present on all 28 dates |
| GA4 account metadata | 529397389, Stile Di Leo | Read this sprint | account_id, account_name, measurement_id, property_timezone | 1 row; G-P7VJ8MQNKS; America/Vancouver |
| GA4 event inventory | 529397389 | 2026-09-24–2026-10-21 | event_name; then hostname × event_name | 16 / 36 rows; production and nonproduction kept separate |
| GA4 prior event inventory | 529397389 | 2026-08-27–2026-09-23 | hostname × event_name | 37 rows; context only, historical configuration differs |
| GA4 source/entry sessions | 529397389 | 2026-09-24–2026-10-21 | hostname × landing_page × session_source_medium × session_manual_campaign_name | 54 rows; aggregate source-only cross-check 16 rows |
| GA4 events by firing page / entry | 529397389 | 2026-09-24–2026-10-21 | hostname × page_path × event_name; separate hostname × landing_page × event_name | 139 / 138 rows; not a reconstructed visitor sequence |
| GA4 source-segmented funnel | 529397389 | 2026-09-24–2026-10-21 | hostname × session source/medium × session manual campaign × event name | 105 rows; explicit QA labels excluded analytically |
| GA4 source-segmented lead dates | 529397389 | 2026-09-24–2026-10-21 | date × host × landing × session source/medium × campaign × event name | Filter event_name=generate_lead; 4 rows, 5 event occurrences |
| GA4 entry-stage segments | 529397389 | 2026-09-24–2026-10-21 | host × landing × session source/medium × campaign × event name | 33 rows; filter exact six events documented below |
| GA4 lead key-event check | 529397389 | 2026-09-24–2026-10-21 | host × session source/medium × campaign × event name | 3 rows; generate_lead only; event_count and conversions kept distinct |
| Netlify production deploy | designbyleo / stiledileo.com | Published 2026-10-24T18:14:34.180Z | Read-only current project/deploy metadata | Current ready production deploy; no deployment triggered |
| Netlify form inventory | designbyleo / stiledileo.com | Cumulative inventory snapshot this sprint | Form name, fields, count and last submission only | 3 form definitions; no submission payload/customer details retrieved |
| Repository business records | Canonical repository | Current local snapshot | Lead register + three scoreboards + tracking source/history | Examples/templates only; not verified customer outcomes |

All analytical connector calls are read-only Windsor.ai calls. Account/field/option discovery preceded queries. No fresh-data option was enabled for GSC. No country or device filter was applied; these are not Canada-only demand estimates. Only the URL-prefix GSC property was used; the domain property was not combined with it. GSC daily data confirms all 28 baseline dates returned WEB observations. Exact upstream row caps, truncation and threshold/sampling metadata are not exposed by these responses; returned rows are not guaranteed an exhaustive inventory of queries/users.

GA4 production means hostname exactly stiledileo.com or www.stiledileo.com. Preview URLs and 127.0.0.1 appeared in historical reports and are excluded from the production baseline. Within production, exclude only these explicit QA signatures: source/medium `qa / internal_test` or `gate5_qa / controlled_test`, or campaigns `stile_growth_os_cta_check` or `gate5_20261003`. This is a reversible reporting filter, not deletion or a live GA4 configuration change. Direct and ChatGPT traffic are NOT blanket-excluded; their remaining authenticity is unverified.

The six-event entry-stage filter is project_photo_click, estimate_click, contact_form_start, generate_lead, phone_click and email_click. No raw form submissions, customer names, contact details, photos, conversation transcripts, individual GA identifiers or customer transaction data were retrieved. Netlify field definitions/counts are not submission contents.

## 3. Release Evidence and Comparison Windows

Current ready production deploy: `6adcf5766ec54e367618bff1`, site `a77348e3-558e-4e36-bd42-4c63bacd278f` / designbyleo. Context production, branch main, commit_ref `1d08f11ab1684ccb6b4d3577f301c2397c167f4c`. published_at `2026-10-24T18:14:34.180Z` = October 24, 11:14:34.180 Vancouver time. No deploy was started by this analysis.

### Repository Dates Are Not Release Dates

| Page | Latest file commit | Commit timestamp (local offset) | Release interpretation |
| --- | --- | --- | --- |
| /venetian-plaster-vancouver.html | f6c1f48 | 2026-10-24T11:02:09-07:00 | Published package plus additional local cleanup NOT deployed |
| /fireplace-wall-vancouver.html | 6acfe60 | 2026-10-17T10:45:33-07:00 | Present in verified current production package; first publication not established |
| /marmorino-vancouver.html | d64e908 | 2026-10-23T19:43:22-07:00 | Present in verified current production package; first publication not established |
| /feature-wall-vancouver.html | 81ad0dc | 2026-10-23T22:56:42-07:00 | Present in verified current production package; first publication not established |
| /venetian-plaster-langley.html | 8e432f0 | 2026-10-23T22:18:14-07:00 | Present in verified current production package; first publication not established |
| /venetian-plaster-surrey.html | d23ccce | 2026-10-23T22:18:17-07:00 | Present in verified current production package; first publication not established |
| /venetian-plaster-coquitlam.html | 0c03697 | 2026-10-23T22:18:12-07:00 | Present in verified current production package; first publication not established |
| /venetian-plaster-west-vancouver.html | 0d64675 | 2026-10-23T22:56:44-07:00 | Present in verified current production package; first publication not established |
| /venetian-plaster-abbotsford.html | 853c6f8 | 2026-10-23T23:13:35-07:00 | Present in verified current production package; first publication not established |
| /projects.html | 6acfe60 | 2026-10-17T10:45:33-07:00 | Present in verified current production package; first publication not established |
| /brookswood-langley-fireplace-transformation.html | 6acfe60 | 2026-10-17T10:45:33-07:00 | Present in verified current production package; first publication not established |
| /west-vancouver-fireplace-transformation.html | 4985a70 | 2026-10-23T22:56:38-07:00 | Present in verified current production package; first publication not established |
| /custom-architectural-rock-installation.html | 6acfe60 | 2026-10-17T10:45:33-07:00 | Present in verified current production package; first publication not established |
| /marmorino-retail-interiors.html | 6acfe60 | 2026-10-17T10:45:33-07:00 | Present in verified current production package; first publication not established |

Older case studies and service pages existed before their latest commit; this table does not claim launch dates. Exact initial publication/deployment history for those earlier versions was not obtained. Tracking guards and proof connections changed around the October 17 commit, and earlier content work also occurred during the baseline. The baseline is therefore an operational starting point, not a controlled experiment with an unchanged website.

### Fixed Windows

| Label | Dates inclusive | Length | Use |
| --- | --- | --- | --- |
| P0 — prior context | 2026-08-27–2026-09-23 | 28 days | Historical comparison only; not the old version of an experiment |
| B0 — frozen pre-release baseline | 2026-09-24–2026-10-21 | 28 days | GSC + GA4 baseline documented here |
| Rollout / processing gap | 2026-10-22–2026-10-24 | 3 days | Excluded from primary comparison; catches rollout and partial release day |
| S1 — early observation | 2026-10-25–2026-10-31 | 7 days | Tracking/discovery sanity only; no winner/loser declarations |
| A0 — first full post-package window | 2026-10-25–2026-11-21 | 28 days | Compare with B0 once dates are finalized/available; four of each weekday in each window |
| A1 — persistence check | 2026-11-22–2026-12-19 | 28 days | Use if low samples need more observation; do not pool changing versions blindly |
| Vancouver cleanup | Future publication timestamp TBD | Separate marker | Not part of the published version measured here; annotate any later release during A0 |

Retrieve A0 around November 25 only after confirming all requested dates are available/finalized; extend the wait if needed. Do not schedule an automation implicitly. GSC uses its Pacific reporting convention and GA4 property timezone is America/Vancouver; retain calendar dates and note timezone conventions rather than joining individual people across the tools. If another material content/tracking change is published, annotate it and re-establish a clean comparison instead of attributing everything to the city sprint. A matched 28-day comparison is descriptive, not a causal lift estimate; seasonality, distribution, query mix and ranking changes remain confounders.

## 4. GSC Page Baseline and Rank-Sensitive CTR

All rows below are WEB, same URL-prefix property and same page-grain schema. CTR is recalculated from clicks/impressions, not averaged from per-row percentages. NR means no returned row, not a proven zero or non-indexed URL. Positions are period averages, not a fixed current rank or a promise of page placement.

| URL | P0 clicks | P0 impressions | P0 CTR | P0 position | B0 clicks | B0 impressions | B0 CTR | B0 position | Interpretation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /venetian-plaster-vancouver.html | 1 | 598 | 0.17% | 33.73 | 0 | 401 | 0.00% | 36.34 | Primarily ranking/intent; 0 clicks at position 36.34 is not an isolated snippet problem |
| /fireplace-wall-vancouver.html | 1 | 89 | 1.12% | 44.29 | 1 | 59 | 1.69% | 38.61 | Primarily ranking/intent; separate fireplace-surround query evidence below |
| /marmorino-vancouver.html | 1 | 46 | 2.17% | 12.96 | 0 | 19 | 0.00% | 14.47 | Limited volume; page-two opportunity, no CTR verdict yet |
| /feature-wall-vancouver.html | 0 | 44 | 0.00% | 6.25 | 0 | 84 | 0.00% | 6.95 | HIGH review priority: page-one visibility, but query mix/ownership need inspection before metadata |
| /venetian-plaster-langley.html | 1 | 85 | 1.18% | 6.45 | 0 | 83 | 0.00% | 35.83 | Overall ranking problem; local-query CTR watch at position 7.88, only 16 impressions |
| /venetian-plaster-surrey.html | 0 | 160 | 0.00% | 29.66 | 0 | 74 | 0.00% | 15.72 | Page-two/ranking focus; evaluate recently changed metadata only after exposure |
| /venetian-plaster-coquitlam.html | NR | NR | NR | NR | 0 | 3 | 0.00% | 2.67 | INSUFFICIENT DATA: 3 impressions are not a proven top-three ranking |
| /venetian-plaster-west-vancouver.html | 0 | 1 | 0.00% | 35.00 | NR | NR | NR | NR | INSUFFICIENT DATA: no returned WEB row |
| /venetian-plaster-abbotsford.html | NR | NR | NR | NR | NR | NR | NR | NR | New after baseline; no returned row is not an indexing verdict |
| /projects.html | 0 | 2 | 0.00% | 3.50 | 0 | 12 | 0.00% | 27.00 | Portfolio-assisted conversion role; low-volume ranking sample |
| /brookswood-langley-fireplace-transformation.html | 0 | 1 | 0.00% | 2.00 | 0 | 4 | 0.00% | 6.25 | Proof-assisted conversion role; 4 impressions insufficient for SEO conclusions |
| /west-vancouver-fireplace-transformation.html | NR | NR | NR | NR | NR | NR | NR | NR | Proof-assisted conversion role; no returned WEB row |
| /custom-architectural-rock-installation.html | 0 | 1 | 0.00% | 8.00 | NR | NR | NR | NR | Proof-assisted conversion role; no returned WEB row |
| /marmorino-retail-interiors.html | NR | NR | NR | NR | 0 | 9 | 0.00% | 4.56 | Supplemental material proof; 9 impressions insufficient for CTR conclusion |
| /venetian-plaster-cost-vancouver.html | 4 | 356 | 1.12% | 30.34 | 1 | 210 | 0.48% | 38.70 | Supplemental decision owner; primarily ranking problem at position 38.70 |
| /venetian-plaster-fireplace-surround-vancouver.html | 1 | 39 | 2.56% | 5.51 | 0 | 22 | 0.00% | 4.86 | Supplemental query recipient; position 4.86 but only 22 impressions |
| /venetian-plaster-north-vancouver.html | NR | NR | NR | NR | 0 | 116 | 0.00% | 68.00 | Supplemental city control; primarily ranking problem, not another title rewrite |

The page-table totals changed 13 -> 9 clicks and 2,598 -> 2,407 impressions before the latest package. Do not describe that as failure or success of work released October 23–24. The unfiltered query mix includes product/DIY and unsupported-application searches; do not label every impression qualified local demand.

### CTR Opportunity Rules

- Position roughly 1–10, repeated relevant commercial impressions and few clicks: review query ownership, intent and the actual result before a focused snippet proposal. Feature Wall is the strongest current page-level review candidate, not an automatic title rewrite.
- Position 11–20: mixed ranking/intent opportunity; identify specific queries closer to page one before changing metadata.
- Position beyond 20: predominantly ranking/discovery/intent work, not evidence that a catchier title alone will recover clicks. This applies to the broad Vancouver and Fireplace page averages here.
- Samples under roughly 30 relevant impressions are directional only. A suggested planning gate of 50–100 qualified impressions over a stable 28–56-day period is not a statistical guarantee; use query/rank consistency and actual inquiry quality as well.
- Preserve the recent Langley/Surrey metadata long enough to gather comparable post-release evidence. Do not chase weekly title changes.

## 5. Query × Landing-Page Ownership

The query/page table is a separate grain from the page table above. It does not fully disclose anonymized queries, and multiple pages may receive impressions for one query. Do not add their impressions to page totals or treat the number of rows as a count of cannibalization defects.

| Query | Receiving URL | Clicks | Impressions | CTR | Average position | Ownership interpretation |
| --- | --- | --- | --- | --- | --- | --- |
| venetian plaster vancouver | /venetian-plaster-vancouver.html | 0 | 86 | 0.00% | 34.92 | Intended material owner; most observed impressions, weak rank |
| venetian plaster vancouver | / | 0 | 50 | 0.00% | 45.96 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-cost-vancouver.html | 0 | 46 | 0.00% | 66.26 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /blog.html | 0 | 37 | 0.00% | 14.81 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /feature-wall-vancouver.html | 0 | 37 | 0.00% | 2.78 | AMBIGUOUS: application page has stronger observed rank |
| venetian plaster vancouver | /venetian-plaster-bathroom-vancouver.html | 0 | 32 | 0.00% | 73.28 | Legacy overlap; do not market unsupported application |
| venetian plaster vancouver | /venetian-plaster-north-vancouver.html | 0 | 31 | 0.00% | 83.65 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-vs-paint-vancouver.html | 0 | 18 | 0.00% | 8.56 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-condo-vancouver.html | 0 | 15 | 0.00% | 71.67 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-surrey.html | 0 | 14 | 0.00% | 11.00 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-condo-ideas-vancouver.html | 0 | 13 | 0.00% | 16.85 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-bathroom-ideas-vancouver.html | 0 | 11 | 0.00% | 35.45 | Legacy overlap; do not market unsupported application |
| venetian plaster vancouver | /venetian-plaster-fireplace-ideas-vancouver.html | 0 | 11 | 0.00% | 26.73 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-burnaby.html | 0 | 10 | 0.00% | 24.60 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-langley.html | 0 | 9 | 0.00% | 19.00 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-pros-and-cons-vancouver.html | 0 | 6 | 0.00% | 74.67 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /black-venetian-plaster-wall-vancouver.html | 0 | 3 | 0.00% | 68.33 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-vs-microcement-vancouver.html | 0 | 2 | 0.00% | 34.50 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster vancouver | /venetian-plaster-maintenance-vancouver.html | 0 | 1 | 0.00% | 37.00 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /venetian-plaster-fireplace-surround-vancouver.html | 0 | 22 | 0.00% | 4.86 | Strongest observed relevant page-one recipient; small sample |
| plaster fireplace vancouver | /venetian-plaster-cost-vancouver.html | 0 | 17 | 0.00% | 42.18 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /fireplace-wall-vancouver.html | 1 | 16 | 6.25% | 48.63 | Intended broad commercial owner; one click, weak period rank |
| plaster fireplace vancouver | /venetian-plaster-fireplace-ideas-vancouver.html | 0 | 15 | 0.00% | 69.80 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /venetian-plaster-vancouver.html | 0 | 11 | 0.00% | 74.64 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /blog.html | 0 | 9 | 0.00% | 16.33 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /venetian-plaster-langley.html | 0 | 6 | 0.00% | 5.67 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /venetian-plaster-burnaby.html | 0 | 5 | 0.00% | 3.00 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /venetian-plaster-condo-vancouver.html | 0 | 4 | 0.00% | 19.00 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /venetian-plaster-north-vancouver.html | 0 | 4 | 0.00% | 85.75 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /feature-wall-tv-wall-vancouver.html | 0 | 3 | 0.00% | 20.33 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /projects.html | 0 | 3 | 0.00% | 96.67 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /venetian-plaster-pros-and-cons-vancouver.html | 0 | 3 | 0.00% | 21.00 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /blog-luxury-trends.html | 0 | 2 | 0.00% | 90.50 | Secondary visibility; not proof of harmful cannibalization |
| plaster fireplace vancouver | /feature-wall-vancouver.html | 0 | 1 | 0.00% | 35.00 | Secondary visibility; not proof of harmful cannibalization |
| wall plaster langley | /venetian-plaster-langley.html | 0 | 16 | 0.00% | 7.88 | CORRECT principal local recipient |
| wall plaster langley | /venetian-plaster-surrey.html | 0 | 3 | 0.00% | 30.67 | Secondary visibility; not proof of harmful cannibalization |
| wall plaster surrey | /venetian-plaster-surrey.html | 0 | 19 | 0.00% | 13.16 | CORRECT principal local recipient |
| wall plaster surrey | / | 0 | 7 | 0.00% | 1.00 | Secondary visibility; not proof of harmful cannibalization |
| wall plaster surrey | /venetian-plaster-langley.html | 0 | 5 | 0.00% | 15.60 | Secondary visibility; not proof of harmful cannibalization |
| wall plaster surrey | /feature-wall-surrey.html | 0 | 2 | 0.00% | 40.00 | Secondary visibility; not proof of harmful cannibalization |
| venetian plaster fireplace | /venetian-plaster-fireplace-ideas-vancouver.html | 0 | 3 | 0.00% | 30.00 | Informational fireplace-ideas recipient; too small to decide ownership |
| marmorino plaster vancouver | / | 0 | 15 | 0.00% | 49.67 | Broad fireplace overlap, weak rank |
| marmorino plaster vancouver | /fireplace-wall-vancouver.html | 0 | 13 | 0.00% | 70.38 | Broad fireplace overlap, weak rank |
| marmorino plaster vancouver | /venetian-plaster-vancouver.html | 0 | 13 | 0.00% | 25.38 | Broad fireplace overlap, weak rank |
| marmorino plaster vancouver | /marmorino-vancouver.html | 0 | 1 | 0.00% | 63.00 | Intended owner, only 1 returned impression |
| marmorino plaster vancouver | /venetian-plaster-surrey.html | 0 | 1 | 0.00% | 17.00 | Broad fireplace overlap, weak rank |

No exact returned WEB row was available for `marmorino vancouver`, `venetian plaster cost vancouver` or `feature wall vancouver` in this snapshot. This is insufficient data, not proof of zero searches. No query rows were returned for the Coquitlam, West Vancouver city, Abbotsford or primary case-study targets in this selected window, despite some page-level observations; do not invent a primary receiving query for them.

### Implications

1. Venetian Plaster Vancouver is the intended material owner and the largest observed recipient of its exact query, but Feature Wall receives 37 impressions at average position 2.78 while the material owner receives 86 at 34.92. That is an ownership ambiguity worth monitoring by date/device/country when enough data is available, not proof that Feature Wall should be redirected or rewritten into a second material owner.
2. For plaster fireplace vancouver, the fireplace-surround page receives 22 impressions at 4.86, while the broad Fireplace owner gets 16 at 48.63 and the one recorded click. The 90-day 127-impression historical figure is not reused as this 28-day row. Do not nominate the broad owner as the only observed ranking URL or call the surround page a proven revenue winner from 22 impressions.
3. Langley and Surrey are the principal observed recipients of their own local wall-plaster phrases. Small cross-city samples do not justify merges. The homepage's 7 Surrey-query impressions at position 1 do not justify making it the local owner.
4. Marmorino plaster vancouver appears on the Fireplace owner (13 impressions, position 70.38) and the Marmorino owner (1, position 63). Both are weak observations, not evidence of a successful top-ranking local Marmorino acquisition channel.
5. Supplier, where-to-buy, DIY, bathroom and out-of-market demand must not drive unsupported service positioning. Separate these query cohorts from accepted fireplace/feature-wall/decorative-service intent in the next review.

## 6. Existing Measurement Architecture

Current source is the authority where the older GROWTH-002 documentation differs.

### Collection and Attribution

- All 13 requested priority pages include the existing Google tag G-P7VJ8MQNKS and scripts/analytics.js. The retail Marmorino case was inspected as supplemental proof. No new analytics vendor or container is required.
- The shared tracker gates events/Ads setup to stiledileo.com/www production hosts. Existing tests also verify production-only page initialization. Historical nonproduction traffic still exists and cannot be erased retroactively by current guards.
- Same-tab sessionStorage key stile_acquisition_v1 retains initial_landing_path, first_referrer origin and first captured utm_source/medium/campaign/content. Hidden form fields receive those values at validated submission. These acquisition fields are deliberately not emitted as custom GA4 event data by this code.
- A known service page can update the retained service label during navigation. This is a last-known mapped page interest, not a customer's confirmed requested service. Coquitlam and West Vancouver city pages, Projects and several informational routes default to general when there is no previous mapped service; initial landing paths still remain distinct.
- GA4 standard landing page, session source/medium and manual-campaign dimensions are available through the connector. Aggregate page views and project-specific interaction events help navigation analysis, but do not reconstruct a person's ordered full journey.
- The shared custom event code does not send user-entered phone/email/name, project notes, filenames, images or advisor transcript to analytics. Those operational contact fields remain in the established submission system. Do not put PII in campaign URLs or new analytics dimensions; automatic page-location collection can contain a query string.

### Funnel Definitions — Do Not Collapse These Stages

| Stage | Current evidence / event | What it does NOT prove |
| --- | --- | --- |
| CTA click | project_photo_click, estimate_click, phone_click, email_click, SMS/WhatsApp if actually present | Dialog opened, message sent, real call, qualification or booking |
| Contact workflow opened | Actual DOM dialog state exists, but no dedicated estimate-modal-open event in current source | A CTA click is not a measured modal-open count |
| Form started | contact_form_start on first input/change per form/document; automatic form_start also observed | Not two separate visitors and not a submitted inquiry |
| Successful submission signal | generate_lead after Netlify POST response.ok, with non-personal submission_id/transaction_id and local duplicate protection | Not independently verified storage/delivery, spam screening, unique person or qualified project |
| Genuine inquiry | Owner validates received form/call/email/message, excludes tests/spam/duplicates | Not automatically qualified |
| Qualified inquiry | Owner confirms accepted service + workable Lower Mainland location + plausible scope and sufficient details | Not an estimate sent or a won project |
| Estimate sent | Actual estimate delivered; owner records date and amount | estimate_click is not estimate sent |
| Won project | Owner records actual acceptance/commitment and accepted value | A GA key event or form success is not revenue |

The form posts through the existing Netlify instant-estimate workflow. Accepted-request tracking is in a try/catch after success so analytics failure does not turn a received request into a retryable failure. Ads conversion and generate_lead use the same non-personal submission ID. In-memory duplicate protection is not a complete server-side unique-person/spam audit. No success request or test event was generated during this analysis.

### Semantic Gaps Confirmed in Current Code

- project_photo_click also fires on project-card links tagged data-track=project_photo. On the Vancouver owner these links navigate to Brookswood/West Vancouver case studies, not the photo form. The aggregate event therefore mixes exploration with contact intent.
- There is no dedicated contact-modal-open event. finish_advisor_open measures the separate advisor, not the intake form. Deep links can open intake without a preceding same-page click.
- contact_form_start and the observed automatic form_start overlap. Never add them or assume their equality proves a sequence/completion rate.
- Phone/email/SMS/WhatsApp handlers measure clicks only. No rows for these four click events were returned in B0 production data; that is not evidence of no offline contacts.
- Custom parameters such as service, cta_location and link_url are sent by code, but their registered GA4 custom-dimension status is not verified by the generic field inventory. Their absence from this connector is not proof they are absent in the GA4 interface.
- GROWTH-002's key-event recommendations are a historical proposal, not verified present property settings. The live key-event counts below demonstrate why event occurrences and key-event reports must be checked separately.

## 7. GA4 Baseline — Raw and Known-QA-Excluded

| Event | Production hostname occurrences | After explicit QA exclusion | Meaning |
| --- | --- | --- | --- |
| page_view | 207 | 165 | Views, not unique people or qualified visits |
| session_start | 142 | 125 | Session-start events; not the sessions metric denominator |
| project_photo_click | 26 | 15 | Mixed photo-intent/project-image navigation; not modal opens |
| estimate_click | 7 | 4 | Soft consultation/estimate intent, not a sent estimate |
| contact_form_start | 10 | 6 | Custom first input/change event; not form completion |
| form_start | 10 | 6 | Automatic/enhanced-measurement name; overlaps custom start, do not add |
| generate_lead | 5 | 1 | Submission-success signal; not verified customer or qualification |
| finish_advisor_open | 37 | 34 | Advisor opened, not contact form opened |
| finish_advisor_started | 4 | 4 | Advisor conversation started, not a lead |
| finish_advisor_photo_added | 3 | 3 | Advisor photo selection, not submitted contact |
| finish_advisor_lead_cta | 2 | 2 | Explicit handoff intent, not accepted inquiry |

Production-only phone_click, email_click, sms_click and whatsapp_click: no returned rows. Qualified-lead, quote-sent and won-project event rows are not present in the returned inventory and are not implemented as a full offline pipeline by this website. Unknown business outcomes are not filled with zero.

Before hostname filtering, page_view was 228 and project_photo_click 28; production hostname values are 207 and 26. Known-QA exclusion further reduces these to 165 and 15. Keep these universes labelled rather than moving between them silently. Session-start occurrences after known-QA exclusion are 125; that is not the separately queried sessions metric.

### Submission-Success Signals and Contamination

| Date (GA4 local) | GA session landing page | Session source / medium | Manual campaign | generate_lead occurrences | Treatment |
| --- | --- | --- | --- | --- | --- |
| 2026-09-30 | /fireplace-wall-vancouver.html | chatgpt.com / ai-assistant | (not set) | 1 | Not explicitly QA-labelled; authenticity/qualification unknown |
| 2026-10-03 | /fireplace-wall-vancouver.html | gate5_qa / controlled_test | gate5_20261003 | 1 | Explicit QA — exclude from customer baseline |
| 2026-10-13 | /venetian-plaster-vancouver.html | qa / internal_test | stile_growth_os_cta_check | 1 | Explicit QA — exclude from customer baseline |
| 2026-10-17 | /fireplace-wall-vancouver.html | qa / internal_test | stile_growth_os_cta_check | 2 | Explicit QA — exclude from customer baseline |

The only non-QA-labelled signal is September 30, a session landing on Fireplace Wall, attributed by GA4 to chatgpt.com / ai-assistant. This does not establish a genuine customer, an organic-Google lead, a qualified fireplace scope, a sent estimate or a sale. Its firing page is the homepage (/), because that is where the form submits. Do not incorrectly credit the homepage as its acquisition entry just because all five generate_lead events fire there.

| Cohort | generate_lead occurrences | Returned key-event count (connector conversions field) |
| --- | --- | --- |
| chatgpt.com / ai-assistant / (not set) | 1 | 0 |
| gate5_qa / controlled_test / gate5_20261003 | 1 | 0 |
| qa / internal_test / stile_growth_os_cta_check | 3 | 2 |

The discrepancy (5 event occurrences vs 2 key events; after known-QA exclusion 1 vs 0) requires a separate read-only key-event/counting/configuration review if that metric will be used for optimisation. Current/history of marking and counting settings were not obtained; do not guess why these differ. Nothing in this report changes Google Ads bidding or conversion actions.

### Acquisition Sources

| Session source / medium | Sessions in source-only report | Treatment |
| --- | --- | --- |
| (direct) / (none) | 74 | Retain; authenticity/customer qualification not independently established |
| chatgpt.com / ai-assistant | 26 | Retain; authenticity/customer qualification not independently established |
| google / organic | 17 | Retain; authenticity/customer qualification not independently established |
| qa / internal_test | 11 | Exclude explicitly tagged QA |
| gate5_qa / controlled_test | 6 | Exclude explicitly tagged QA |
| google / cpc | 3 | Retain; authenticity/customer qualification not independently established |
| facebook.com / referral | 2 | Retain; authenticity/customer qualification not independently established |
| (not set) | 1 | Retain; authenticity/customer qualification not independently established |
| ig / social | 1 | Retain; authenticity/customer qualification not independently established |
| instagram.com / referral | 1 | Retain; authenticity/customer qualification not independently established |
| m.facebook.com / referral | 1 | Retain; authenticity/customer qualification not independently established |

The source-only sessions metric sums to 143 on production, 126 after explicit QA exclusion. The separate landing-page breakdown also sums to 143/126 in this snapshot. Its different campaign split for ChatGPT and the 142 session_start event occurrences are not silently equated to sessions; these are different report grains/metrics. Session totals, page views and GSC clicks are not the same unit. The 17 Google/organic GA4 sessions must not be reconciled one-for-one to 9 GSC page-table clicks or called 17 new customers. No spend or paid-campaign performance was fetched; three google/cpc sessions do not authorize or prove an active advertising campaign.

### Entry-Page Context

| GA landing page | Production landing sessions | After explicit QA exclusion | Photo/navigation clicks in those sessions (QA excluded) | Form-start occurrences in those sessions (QA excluded) | Submission-success signals (QA excluded) |
| --- | --- | --- | --- | --- | --- |
| /venetian-plaster-vancouver.html | 10 | 6 | NR | NR | NR |
| /fireplace-wall-vancouver.html | 13 | 9 | 5 | 2 | 1 |
| /marmorino-vancouver.html | 2 | 2 | NR | NR | NR |
| /feature-wall-vancouver.html | 2 | 1 | NR | NR | NR |
| /venetian-plaster-langley.html | NR | NR | NR | NR | NR |
| /venetian-plaster-surrey.html | NR | NR | NR | NR | NR |
| /venetian-plaster-coquitlam.html | NR | NR | NR | NR | NR |
| /venetian-plaster-west-vancouver.html | NR | NR | NR | NR | NR |
| /venetian-plaster-abbotsford.html | NR | NR | NR | NR | NR |
| /projects.html | 4 | 4 | 2 | NR | NR |
| /brookswood-langley-fireplace-transformation.html | 8 | 8 | NR | NR | NR |
| /west-vancouver-fireplace-transformation.html | 1 | 1 | NR | NR | NR |
| /custom-architectural-rock-installation.html | 2 | 2 | 2 | 1 | NR |
| /marmorino-retail-interiors.html | 1 | 1 | NR | NR | NR |

NR means no returned matching row, not proof of no page visits or inquiries. These are session-entry cohorts, not event firing pages and not counts of leads per page. The one remaining Fireplace signal and its source are described above; all other genuine/qualified/estimate/win outcomes remain unverified. Project case studies can assist conversion after entry elsewhere; low organic impressions alone do not measure their value.

## 8. Form Inventory and Actual Business Outcomes

| Netlify form | Cumulative submissions | Last submission (UTC) | Interpretation |
| --- | --- | --- | --- |
| instant-estimate | 14 | 2026-10-17T22:55:51.379+00:00 | Current photo workflow; count includes unknown historical tests/spam/duplicates |
| visualization | 2 | 2026-04-11T01:56:33.906+00:00 | Legacy form definition; not evidence of current workflow volume |
| contact | 2 | 2026-03-28T18:56:53.118+00:00 | Legacy form definition; not evidence of current workflow volume |

The instant-estimate form's 14 cumulative submissions are NOT 14 qualified leads and do not belong automatically to B0. The snapshot's last submission is October 17, before the current production package. Without reading/reconciling individual receipts, the date-window count, authenticity, duplicate status and delivery/qualification outcomes are unavailable. No personal submission contents were retrieved. Do not add historical legacy-form counts to the GA4 events or use them as unique people.

Repository findings:

- SEO/STILE-DI-LEO-LEAD-REGISTER-v1.0.csv contains EXAMPLE-001 and EXAMPLE-002, explicitly marked not real leads. The example 6,500 quote is NOT revenue evidence.
- Lead-generation and revenue-growth scoreboards are header-only; the 30-day scoreboard has a Week 1 initialized row and blank later weeks. Initialized zeros are not an audited full-business sales ledger.
- Existing GROWTH-003 specifies manual qualification/revenue tracking, but no populated real-customer operating ledger or connected CRM dataset was identified in this scope. This does not prove the owner has no separate private records.

| Outcome | Verified B0 value | Needed evidence |
| --- | --- | --- |
| Genuine inquiries | UNAVAILABLE | Owner-confirmed real contacts, excluding tests/spam/duplicates across forms/calls/email/social |
| Qualified inquiries | UNAVAILABLE | Accepted service, location, scope and next-step assessment recorded for each genuine lead |
| Estimates sent / quoted value | UNAVAILABLE | Actual delivered estimates with dates, value and currency |
| Won projects / won value | UNAVAILABLE | Recorded acceptance/contract/deposit policy evidence and accepted project value |
| Source-to-sale conversion rate | NOT CALCULABLE | Reconciled lead IDs, channel evidence and outcomes; denominator with same cohort/scope |

## 9. Minimal Owner-Operated Lead Log Specification

Reuse `SEO/STILE-DI-LEO-LEAD-REGISTER-v1.0.csv` as the existing schema/reference. Do not introduce another CSV, CRM vendor or analytics platform in this sprint. Keep actual customer contact details and attachments in the private operational system, not a public repository or GA4. A private owner-operated copy can use the existing fields; the public example rows must never be imported as real business results.

| Field group | Existing fields / minimal use | Rule |
| --- | --- | --- |
| Identity | lead_id, date_received | One row per genuine project inquiry; use the form submission_id as the reference when available, otherwise an owner-generated non-personal ID; merge repeat contacts for the same inquiry |
| Acquisition | lead_source, source_detail, landing_page | Keep verified UTM/receipt evidence, customer-stated source and unknown distinct; never infer paid/organic solely from referrer |
| Fit | service_interest, application_subtype, city, contact_method | Actual requested service, not just the tracker's last page mapping; confirmed Lower Mainland project location |
| Qualification | qualified, qualification_reason | yes / no / unknown; service/location/plausible scope; no invented minimum budget or universal resurfacing promise |
| Progress | consultation_or_site_visit, quote_sent, status | new -> reviewing -> qualified/disqualified -> estimate_sent -> won/lost/on_hold; map estimate_sent consistently to existing quote_sent terminology |
| Value | quote_amount, won_project_value | Separate proposed and accepted value; record currency explicitly, preferably in the private sheet's documented amount format |
| Follow-up | lost_reason, notes | Short operational next step; no full transcripts, names, phone/email or full address in reporting exports |

Minimum process: register/verify each actual new inquiry; update qualification after review; update estimate and outcome when those occur. Keep initial source rather than overwriting it with a later website visit. Preserve UTM campaign/content and submission reference in the private operational record when present; use unknown when absent. If elapsed-stage reporting is needed, separately approve private fields estimate_sent_at and closed_at; do not fake historical timestamps or derive them from estimate_click.

Start reconciliation with the September 30 non-QA-labelled Fireplace signal and the Netlify receipt inventory, privately and without publishing customer details. Then add genuine phone/email/social/referral inquiries that analytics cannot validate. This is a specification only: no real lead row was created or classified by this sprint.

## 10. Attribution Capability Matrix

| Question | Current capability | Limitation / required caution |
| --- | --- | --- |
| Which page did a session enter? | GA4 landing_page; same-tab initial_landing_path hidden inquiry field | Cross-tab/device, blocked storage and different sessions can differ; no retroactive reconstruction guarantee |
| Source / medium? | GA4 session_source_medium; UTMs/referrer-origin retained for inquiry where available | Direct is not a known channel; customer-stated Maps/referral may require owner entry; no GSC-query-to-person join |
| Campaign / creative? | GA4 manual campaign; captured utm_source/medium/campaign/content in hidden inquiry context | Missing tags stay unknown; utm_term is not currently in the retained field list; do not add personal data |
| Subsequent service/project navigation? | Page views and some link/slider events; case destinations exist | No full ordered journey export in these aggregates; project-photo event currently mixes browsing with contact |
| Where was the successful form submitted? | generate_lead page_path /, service context and non-personal transaction ID | Firing page is not acquisition page; no verified offline business outcome |
| Which marketing source produced a sale? | Possible after private submission/lead-reference reconciliation | Not available from event counts alone; manual estimate/win recording absent |
| Were events configured as key? | Historical returned key-event metric available | Property settings/history not verified; counts differ and observed key events are QA-labelled |

## 11. Separately Scoped Measurement Improvements — Not Implemented

| Priority | Proposed separate task | Exact scope | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | Historical QA exclusion + owner lead reconciliation | Read-only reports and private owner operating log | Raw/excluded views retained; 4 explicit QA signals never counted as customers; remaining signal reconciled or labelled unknown |
| P1 | Split project exploration from photo-intake intent | scripts/analytics.js and only affected project-link data-track attributes after approval | Use a distinct project-navigation event; retain existing lead-success semantics; no double firing or expanded PII |
| P1 | Measure actual intake dialog opens | Existing index.html openEstimate successful-open path, after approval | One open event per actual open, including deep links; does not fire on blocked/duplicate-open attempts or count as lead |
| P1 | Verify key-event/Ads configuration | Read-only GA4/Ads settings review first | Document current configuration/counting and source differences; no automatic marking/bidding changes |
| P2 | Complete service classification for current city owners | Only serviceByPath entries for Coquitlam and West Vancouver if approved | Correct mapped service without changing URLs or data collection; landing attribution unchanged |
| P2 | Confirm custom-dimension availability and usable reporting | Existing service / CTA / navigation parameters only, after inventory | Avoid sending redundant acquisition data or high-cardinality/PII dimensions; no new analytics vendor |

Do not turn this queue into a tracking rewrite or enable QA traffic collection in production. Keep future tests offline/stubbed or on guarded previews as in current regression practice. Do not delete historical analytics or treat all AI/referral visits as tests.

## 12. Review Cadence and Page Decisions

- Weekly: owner reviews genuine contacts, qualification, next step, estimates and outcomes. Review newly available GSC dates and tracking anomalies; no routine title changes.
- Early check: S1 October 25–31, reviewed after processing, for serving/discovery and tracking sanity only. No low-sample ranking/CTR verdict.
- Primary review: A0 complete 28-day window, around November 25 after data checks. Compare B0 and A0 at the same property/search-type/grain and production/QA cohort definitions. Review relevant queries, not only aggregate CTR.
- Low-volume follow-up: A1 or a longer stable version window if relevant impressions and actual leads remain sparse. Report absolute changes and uncertainty before percentages.

| Decision | Evidence rule |
| --- | --- |
| KEEP | Stable eligible service page, accurate proof/claims and useful inquiry path; low traffic alone is not a deletion reason |
| REVISE SNIPPET | Repeated qualified query impressions near page one plus low CTR on a stable version; review actual SERP and ownership first; one focused hypothesis at a time |
| REVISE RANKING / DISCOVERY | Weak relevant rankings or verified discovery/indexing defect; do not call poor-rank CTR a title failure |
| REVIEW OWNERSHIP | Material meaningful overlap persists across comparable query/time/device contexts; diagnose intent before suggesting a merge or redirect |
| EXPAND EXISTING PAGE | Repeated accepted-service questions or qualified inquiries reveal a real missing decision section; use actual proof and retain owner roles |
| CREATE CITY / APPLICATION PAGE | Distinct commercially useful intent, accepted coverage/capability, honest proof and a natural journey; not merely missing city keyword rows |
| KEEP CASE STUDY | Supports decision-making and service-to-project-to-contact journey even with low standalone search impressions |
| DEFER | New page, missing rows or samples of 1–3 impressions; gather evidence instead of declaring a winner or failure |

Do not create unsupported bathrooms, showers, Tadelakt, countertop or speculative application pages. Mission remains a separate evidence/brief decision, not an automatic output of this baseline. Mediterranean styling may describe an aesthetic preference, but this dataset does not establish that it outranks the material/service language or authorizes a new broad style hub.

## 13. Validation, Sources and Deliverable Boundary

Current source inspection covered scripts/analytics.js, index.html success/modal/attribution handling, advisor tracking, priority-page tag inclusions, project interaction tags, Git history and GROWTH-002/003 plus current release/diagnosis reports. The two existing measurement/foundation suites were run: **118 tests passed, zero failures**. These tests did not generate live leads. git diff --check passed. All pre-existing file hashes were checked before final delivery; no production implementation or pre-existing report was changed.

Official interpretation references: [Google Search Console performance setup and metric grains](https://support.google.com/webmasters/answer/7576553) distinguishes page/property aggregations, CTR and period-average positions. [Google Analytics key events](https://support.google.com/analytics/answer/9267568) distinguishes event collection from marked business-important events; neither a configured key event nor its count establishes owner-confirmed qualification or revenue.

Temporary analytical evidence: `/private/tmp/stiledileo-qualified-inquiry-baseline/`, including source/metadata snapshots, release/form metadata restricted to nonpersonal fields, segmented connector data, query/page rows, input hashes and test logs. Those temporary files are not production source or a new customer database. The main figures, data contract, exclusions, release anchor and decision rules are preserved in this report.

Created repository file: **SEO/QUALIFIED-INQUIRY-BASELINE-v1.0.md** only. No raw customer data or actual lead records added to Git. No titles, tracking, key-event settings, source filters, budget, advertisements, profiles or pages changed. No commit, push, deploy, form submission or live test conversion.

**BASELINE ESTABLISHED — POST-RELEASE IMPACT AND QUALIFIED REVENUE NOT YET VERIFIED.**
