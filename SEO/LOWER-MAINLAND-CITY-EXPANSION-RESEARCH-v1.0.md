# Lower Mainland City Expansion: Audit and Research v1.0

Research date: 2026-10-23
Mode: ANALYSIS ONLY. No new production pages, content edits, schema edits, profile updates, commit, push or deployment.
Repository: /Users/vladyslavdementiev/Documents/GitHub/stiledileo-site

## 1. Executive Decision

There is a genuine geographic coverage opportunity, but the evidence does not support creating a page for every city immediately.

Recommended order:
1. Recover clicks from existing Langley and Surrey query visibility.
2. Improve discovery and evidence on existing Coquitlam and West Vancouver pages; do not create second city owners.
3. Prepare Abbotsford as the first missing-city pilot after human approval.
4. Prepare Mission as the next, lower-confidence pilot, with its own useful brief.
5. Keep other cities in a measured expansion queue rather than publishing a city-by-service grid.

Owner-confirmed service coverage is ALL LOWER MAINLAND. Abbotsford/Mission coverage is no longer a blocker. Local completed projects are helpful but not mandatory for truthfully offering a service; photographs must retain their actual locations. Lack of GSC impressions for a currently missing page must not become an impossible prerequisite for building it.

No evidence establishes that the business is losing every customer from cities without pages. Existing service pages, the Business Profile and referrals may reach them. Missing geographic relevance can still cost opportunities; its financial size is not quantified.

## 2. Methods and Limits

### Connected first-party data

- GSC URL-prefix property: https://stiledileo.com/. Period: 2026-07-22 through 2026-10-19 inclusive, 90 days.
- GSC page dataset: 95 rows across search types; 58 WEB rows used.
- GSC query/page dataset: 847 rows across search types; 306 WEB rows used.
- WEB only throughout GSC tables; image search excluded. No country/device filter.
- Query/page rows and page totals are different reporting grains. Do not reconcile them by silently summing or treating anonymized queries as zero.
- GA4: Stile Di Leo property, same 90-day dates. All channels; approximate visitor geolocation, not verified project locations.
- Google Business Profile: current connected Stile di Leo location metadata. Read only.
- Google Ads Keyword Planner: read-only ideas/metrics for three separate city targets. No campaign, budget, bids or ads created.

The GSC connector does not expose current Page indexing exclusions or URL Inspection. Browser permission was denied in the preceding access check; no attempt was made to bypass it. This report does NOT claim to have identified the reported current 19 exclusions. HTTP 200, a self-canonical, historical impressions and sitemap inclusion do not prove present-day indexing.

### Public research

A dated, non-personalized web-search sample plus direct inspection of first-party business/service pages. This is not a geo-located Google rank tracker, complete competitor census or proof of a specific Maps position. Some searches returned irrelevant Australian Abbotsford, US Vancouver, general "mission" statements and product/repair results; those were excluded from BC customer-demand conclusions.

### Repository and live checks

Audited current root-HTML inventory, seven non-Vancouver city owners, main owner pages, city inlinks, image claims and contact paths. Eight existing city/service-owner URLs returned live 200, index/follow and self-canonicals. Proposed Abbotsford/Mission paths returned 404, as expected for pages that do not yet exist. No fix is needed for an uncreated candidate URL.

Local Surrey, Langley and Coquitlam drafts already existed before this research. Those prior changes were preserved, not newly implemented here. Raw live HTML may differ from repository HTML due to build/CDN transformations; byte inequality alone is not a content-deployment finding.

## 3. Current City Coverage and Performance

| City / role | Existing URL | Clicks | Impressions | CTR | Average position |
| --- | --- | ---: | ---: | ---: | ---: |
| Vancouver | `/venetian-plaster-vancouver.html` | 5 | 1562 | 0.32% | 36.01 |
| Surrey | `/venetian-plaster-surrey.html` | 3 | 386 | 0.78% | 31.26 |
| Langley | `/venetian-plaster-langley.html` | 1 | 211 | 0.47% | 18.33 |
| Coquitlam | `/venetian-plaster-coquitlam.html` | 0 | 3 | 0.00% | 4.33 |
| Burnaby | `/venetian-plaster-burnaby.html` | 0 | 37 | 0.00% | 18.38 |
| Richmond | `/venetian-plaster-richmond.html` | No returned row | - | - | - |
| North Vancouver | `/venetian-plaster-north-vancouver.html` | 0 | 141 | 0.00% | 71.15 |
| West Vancouver | `/venetian-plaster-west-vancouver.html` | 0 | 64 | 0.00% | 77.14 |
| Surrey feature wall | `/feature-wall-surrey.html` | 0 | 6 | 0.00% | 16.33 |

"No returned row" is NOT an assertion of zero demand or non-indexation.

Additional historical clean-URL rows are deliberately separate: Burnaby clean had 10 impressions, Vancouver clean 10, and other aliases also appear in the 90-day dataset. Do not merge them into current canonical performance or infer a present redirect defect from historical data. Recent live alias routing was verified separately in the foundation report.

### Highest-value city-query evidence

| Query | Receiving page | Clicks | Impressions | CTR | Average position |
| --- | --- | ---: | ---: | ---: | ---: |
| venetian plaster surrey | `/venetian-plaster-surrey.html` | 1 | 1 | 100.00% | 6.00 |
| venetian plaster surrey | `/` | 0 | 2 | 0.00% | 6.00 |
| wall plaster langley | `/venetian-plaster-langley.html` | 0 | 85 | 0.00% | 4.18 |
| wall plaster langley | `/venetian-plaster-surrey.html` | 0 | 18 | 0.00% | 38.78 |
| wall plaster surrey | `/` | 0 | 5 | 0.00% | 1.00 |
| wall plaster surrey | `/feature-wall-surrey.html` | 0 | 2 | 0.00% | 40.00 |
| wall plaster surrey | `/venetian-plaster-langley.html` | 0 | 5 | 0.00% | 15.60 |
| wall plaster surrey | `/venetian-plaster-surrey.html` | 0 | 87 | 0.00% | 9.09 |

Conclusions:
- "wall plaster langley": 85 impressions at 4.18 with no clicks on the intended city page. This is the strongest observed local CTR/intent opportunity, not a request for another Langley page.
- "wall plaster surrey": 87 impressions at 9.09 with no clicks on its intended city page. Useful opportunity, but less prominent than Langley's query.
- Surrey also received one click from one impression for "venetian plaster surrey." That tiny row cannot establish conversion performance.
- Langley/Surrey cross-appearances are possible overlap, not proof that one materially steals the other's clicks. No merge or redirect recommended.
- No returned WEB query mentions Abbotsford, Mission or Coquitlam. Missing query evidence is not market-volume evidence.
- Overall city-page positions can be much worse than a specific local query because page totals include other intents.

Recent 28-day context from the foundation report: Langley's local query had 19 impressions at 7.42; Surrey's had 22 at 12.45. These windows overlap with the 90-day period, so this report does not call the difference a measured ranking decline.

## 4. Existing-Page Quality and Discovery Audit

Counts below are root-HTML editorial anchor counts, not backlinks, PageRank or all dynamic/template links.

| City owner | Distinct incoming HTML pages | Incoming anchors | Links to audited project cases | Photo-form links | Contact-section links | City-claiming image alts |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| surrey | 4 | 5 | 1 | 3 | 0 | 0 |
| langley | 4 | 5 | 2 | 3 | 0 | 1 |
| coquitlam | 1 | 2 | 1 | 3 | 0 | 0 |
| burnaby | 4 | 4 | 0 | 1 | 1 | 3 |
| richmond | 1 | 2 | 0 | 1 | 1 | 3 |
| north vancouver | 1 | 2 | 0 | 1 | 1 | 3 |
| west vancouver | 2 | 3 | 2 | 1 | 1 | 4 |

### Langley

Best local proof: the Brookswood brick-to-Marmorino project, including actual before/after and preparation. Current local draft connects that proof to the service and inquiry journey.

Main remaining research recommendation: review the live search snippet for the local phrase and the first-screen answer to a general "wall plaster" search. It could include drywall/repair seekers, so qualify decorative installation rather than chasing all plaster demand. Retain one Langley owner for City/Township intent; do not build duplicates for administrative variants without a different user need.

### Surrey

Broad plaster owner and feature-wall owner both exist. Keep them separate by material/service consultation versus selecting/executing a focal wall. Preserve the existing Brookswood reference as a Langley project, not Surrey proof.

The blog currently presents some city service pages with article-style navigation. A later navigation correction should identify them as services, not imply that an inquiry requires reading articles.

### Coquitlam

Already exists and is in sitemap. Only one distinct root-HTML page links to it; two links from that page do not equal two independent sources.

Local draft is clearer than its previous housing-stereotype copy, but still has little observed visibility. Review discovery through genuinely relevant service-area/navigation context and local project/distribution opportunities. Do not create another Coquitlam service owner to fix weak discovery.

### West Vancouver

Has authenticated local project proof and a case study, yet only 64 impressions at position 77.14 in the period. A high-quality project does not automatically transfer authority to the city owner.

The city page still relies on generic luxury/home stereotypes and several image alts whose local provenance is unverified. Refresh around the actual project and useful consultation details, rather than adding more "luxury" adjectives. Retain the distinction between an ongoing service page and a single completed-project story.

### North Vancouver

141 impressions at 71.15. This is mainly a ranking/relevance/discovery problem, not a page-one snippet problem. One incoming source and no audited project-case links are weaknesses. Do not invent a North Vancouver installation or describe every home as hillside/modern.

### Richmond

Exists, self-canonical, indexable and in sitemap, but no returned canonical WEB row. One incoming source, no audited project links and generic local image claims weaken confidence. Check actual URL Inspection before diagnosing exclusion, then improve local usefulness and discovery if appropriate.

### Burnaby

37 canonical impressions at 18.38 with no clicks. Four incoming sources, but no audited case-study links in the current page. Condo/access planning is a sensible application topic; it must not become an unsupported claim about what every Burnaby client wants.

### Shared findings

- Many pages reuse an application/"why it fits this city's homes"/scope/related/CTA template.
- The problem is repetitive editorial reasoning and unsupported local attribution, not a proven exact duplicate penalty.
- A simple city-normalized five-word-shingle check on Richmond/North/West Vancouver found roughly 7-12% literal overlap; this is NOT semantic similarity, a Google threshold or a cannibalization score.
- Do not reuse the generic city template for Abbotsford/Mission.
- Existing service-card/blog labels and natural service-area entry paths deserve attention before adding many more destinations.
- Older city pages have a header photo action, but their final CTA still goes to /#contact rather than directly opening /#estimate. Review consistency later; nothing changed in this audit.
- Remaining generic image alts must not assert project locations without a verified source.

## 5. Verified Business Profile Coverage

Current primary category: Plasterer.

Current returned service areas:
Delta, Surrey, Burnaby, Langley, Richmond, Coquitlam, Vancouver, Abbotsford, West Vancouver, New Westminster, North Vancouver.

Abbotsford is ALREADY represented. Mission is NOT in the returned list. Maple Ridge, Pitt Meadows, Port Moody, Port Coquitlam, White Rock and Chilliwack are also absent from that returned list, although owner-confirmed business coverage is broader. This is connected location metadata, not an independent check of published Maps visibility or pending profile edits.

Recommended future action: review accurate service-area additions in one approved profile update. Do not create new office locations or multiple profiles to simulate proximity.

A service-area list is not a guarantee of Maps ranking in each city. Google describes local results as depending on relevance, distance and prominence; website city pages do not remove the distance factor. [Google local ranking guidance](https://support.google.com/business/answer/7091). Service-area entries should be accurate and fit Google's profile limits. [Service-area guidance](https://support.google.com/business/answer/9157481).

Homepage schema already includes "Lower Mainland." Absence of every city name in areaServed is not a canonicalization defect or evidence that service is impossible there. Visible coverage information matters for customers; stuffing a schema list is not a substitute for relevance or proof.

## 6. City-Targeted Keyword Planner Research

Settings: English criterion 1000, Google Search only, separate city targeting. Geo IDs verified from Google's October 6 CSV:
- Abbotsford, BC: 1001861
- Mission, BC: 1001926
- Coquitlam, BC: 1001885

The connector defines avg_monthly_searches as a past-12-month average. The API request's July-October date parameters must NOT be presented as a 90-day volume calculation; exact constituent months were not returned.

Each pull returned 1,073 broad ideas, many irrelevant product/DIY/repair/wet-area phrases. Only selected eligible concepts are shown. The list length itself has no commercial significance.

| Generic query, searched within target city | Abbotsford | Mission | Coquitlam |
| --- | ---: | ---: | ---: |
| venetian plaster | 10 | 10 | 10 |
| marmorino | 10 | 0 | 10 |
| decorative plaster | 10 | 10 | 10 |
| plaster fireplace | 10 | 10 | 10 |
| fireplace refacing | 10 | 0 | 10 |
| fireplace transformation | 10 | Unavailable | 0 |
| plaster feature wall | Unavailable | Unavailable | 0 |
| mediterranean walls | 10 | Unavailable | Unavailable |
| textured wall finish | 10 | Unavailable | 10 |

These are the literal returned estimates, NOT customers per month:
- 10 is a rounded low-volume estimate, not ten qualified leads or a precise count.
- 0 is not proof nobody searches or could buy.
- Unavailable/null is missing data, not zero.
- Do not add close variants or overlapping ideas to manufacture a total market.
- Competition metrics refer to paid advertisers, not organic SEO difficulty.
- City targeting and a city typed into the query are different. All five explicit city-suffixed seeds per city returned unavailable estimates.
- General "fireplace refacing" can include stone, tile, reconstruction or appliance work outside Stile di Leo's scope.

Google explains rounding, close variants and selected location/network settings in [Keyword Planner metrics guidance](https://support.google.com/google-ads/answer/3022575). [Historical-metric API documentation](https://developers.google.com/google-ads/api/docs/keyword-planning/generate-historical-metrics) distinguishes ideas and estimates from forecasts.

### Mediterranean language

No Mediterranean-related query appears in the returned 90-day GSC WEB rows. Planner returned 10 for "mediterranean walls" in Abbotsford and unavailable in Mission/Coquitlam. This does NOT establish that Canadians search it more than Venetian plaster.

Recommendation: retain as an accessible style description beside visual examples, not the primary city keyword or a new page family. Keep clear distinctions between a design aesthetic, a material, and an installed application. Do not market exterior stucco or wallpaper just because a broad style query returns those results.

## 7. Public Search and Competitor Research

Observed examples are first-party service descriptions, not verified market shares, lead volumes, review authenticity or organic rankings.

| Source | What was actually observed | What Stile di Leo can learn |
| --- | --- | --- |
| [Abbotsford Paint specialty products](https://abbotsfordpaint.com/paints-and-finishes/other-paint-brands) | A local retailer lists Venetian plaster and Marmorino products | Local material availability/category presence; separate installation intent from shopping |
| [Abbotsford Paint contractor referrals](https://abbotsfordpaint.com/services/find-a-painter) | The business invites customers to call for contractor suggestions | Potential future referral conversation; no existing relationship assumed |
| [Love's Painting](https://www.lovespainting.co/) | Lists Venetian plaster among broad painting services and names Abbotsford in coverage | A specialist transformation offer can be clearer than a long general-trade list |
| [D John Gas Mission showroom](https://djohngas.ca/products/) | Fireplace supply/installation showroom in Mission | Appliance intent is distinct; potential finishing referral partner, not assumed partnership |
| [Pacific Living fireplace projects](https://pacificlivingcontracting.com/fireplace-projects/) | Location-labelled fireplace project stories in Coquitlam, Port Coquitlam and Port Moody | Competitors use project context, not only material descriptions |
| [House of Plaster / Polished Stucco](https://houseofplaster.ca/about) | Coquitlam material/tool/training business connected to a decorative-finish installation practice | Product, professional and installer intents coexist; clarify who the service is for |
| [Shape of Paint service guide](https://shapeofpaint.com/services/decorative-finishes) | Application-led service information and multiple city destinations | Natural service-to-city discovery is useful; copying the page count is not evidence of success |
| [Shape of Paint Coquitlam](https://shapeofpaint.com/coquitlam/decorative-finishes) and [Port Moody](https://shapeofpaint.com/port-moody/decorative-finishes) | Shared structure with localized text, process and project-range claims | Evaluate differentiation carefully; do not copy prices, neighborhood stereotypes, reviews or technical promises |

Other public results for Abbotsford/Mission skewed toward chimney/gas cleaning, repair and supply. This indicates mixed intent in the sampled results, not an "easy ranking gap." Do not target emergency repair or imply appliance servicing.

Some pages contained obvious template artifacts. No competitor project, review, price, timeline or technical claim is adopted as Stile di Leo evidence. Public first-party claims are evidence of positioning, not independently audited capability.

## 8. Customer and Conversion Evidence

GA4 same 90-day window, all channels:
- Surrey: 105 sessions / 28 active users.
- Vancouver: 43 sessions / 30 active users.
- Burnaby and North Vancouver: 2 sessions each.
- Chilliwack: 2 sessions despite no dedicated city owner.
- Langley and Langley Township: separate one-session rows.
- Richmond and New Westminster: one session each.
- No returned city row for Abbotsford, Mission or Coquitlam.

Geolocation is approximate. Internal/owner traffic filtering has not been verified; repeat sessions are not customers. Active users across cities must not be summed as unique people. Tiny or absent city rows do not establish customer loss or no local demand.

Tracked event totals:
- project_photo_click: 58
- estimate_click: 36
- contact_form_start: 23
- generate_lead: 7
- phone_click: 2

These are event counts, not a cohort funnel or unique qualified opportunities. Do NOT calculate 7/23 as a validated conversion rate, call seven events seven sales, or add click events to leads. No CRM, project-value or won-revenue evidence was reviewed.

The current shared code emits generate_lead through the accepted-form hook and retains initial_landing_path in same-tab inquiry context. That is suitable infrastructure to reuse, not a reason to install another tracker. Several city paths currently default to general service classification; any later mapping update should be minimal and separately approved.

Measurement recommendation for future city pages: retain landing URL, actual customer-supplied project city, service, qualification, estimate status and won/lost outcome in the existing private lead workflow. Keep personal details out of GA4. Judge cities by qualified projects and contribution after travel/preparation, not raw visitor geolocation.

## 9. City Opportunity and Decision Matrix

P0 = improve known opportunity first. P1 = next controlled expansion/discovery work. P2 = lower-confidence follow-up. P3 = watch/research, not a rejected market.

| City | Existing owner? | Evidence strength | Decision after this audit | Priority |
| --- | --- | --- | --- | --- |
| Vancouver | Yes | Strong existing visibility; broad owner role | Keep central material/application owners; no duplicate city page | P0 |
| Langley | Yes | 85 local-query impressions at 4.18; authenticated Brookswood proof | Improve existing query/snippet/proof journey; no new owner | P0 |
| Surrey | Yes, plus feature-wall page | 87 local-query impressions at 9.09; wider page visibility | Improve existing pages and maintain intent separation | P0 |
| Coquitlam | Yes | Three page impressions; public installer/retail competition | Improve discovery and existing page, not another owner | P1 |
| West Vancouver | Yes, plus project | Actual local case, weak city-page rankings | Strengthen existing city-to-project relationship | P1 |
| Abbotsford | No | Confirmed coverage, already in GBP, local product/service ecosystem; small planner estimates | First missing-city pilot; page brief eligible, no traffic guarantee | P1 |
| Mission | No | Confirmed coverage, local appliance ecosystem; weaker planner/query evidence | Second pilot with lower confidence and a distinct useful brief | P2 |
| Burnaby | Yes | 37 canonical impressions at 18.38 | Improve existing page/proof before another location page | P2 |
| North Vancouver | Yes | 141 impressions at 71.15; weak discovery/proof | Existing-page quality/ranking review, not CTR-only rewrite | P2 |
| Richmond | Yes | Live page/GBP coverage; no returned canonical WEB row | Inspect index status and improve existing discovery/usefulness | P2 |
| Delta | No | Already in GBP; broad competitor coverage sample | Represent coverage; research distinct page value next | P2 |
| New Westminster | No | Already in GBP; one GA4 session | Coverage/distribution first, not volume-based page approval | P2 |
| Port Moody | No | Public location-labelled competitor projects and city service pages | Conditional future brief; no measured Stile demand | P2 |
| Port Coquitlam | No | Public project ecosystem; distinct from Coquitlam | Conditional future brief; do not mislabel as Coquitlam | P2 |
| Maple Ridge | No | Coverage confirmed; no direct demand study in this sprint | Watch/research rather than bulk page | P3 |
| Pitt Meadows | No | Competitor coverage list only; no direct demand study | Watch/research | P3 |
| White Rock | No | Public competitor fireplace project; no Stile query evidence | Watch/project-partner research | P3 |
| Chilliwack | No | Two approximate all-channel sessions; public fireplace ecosystem | Watch/research; tiny sample does not justify an owner | P3 |

These priorities are editorial/business judgments, not predictive SEO scores or a wealth ranking. Remaining cities were not subjected to separate city-targeted Planner pulls; do not pretend equal research depth. Surrey neighborhoods such as South Surrey and the two Langley administrative areas should not automatically receive additional near-identical pages.

## 10. Proposed Ownership and Future Page Briefs

No final page copy or new metadata is written in this audit. Candidate URLs are proposals, not created or indexed documents.

### Abbotsford

Proposed path: /venetian-plaster-abbotsford.html
Reason: preserve the established city-owner convention, with customer-facing application language rather than a material glossary.

Primary intent: hire a specialist for decorative plaster walls in Abbotsford.
Secondary intent: assess fireplace transformation / feature-wall possibilities and request an estimate.
Primary proof: authenticated Brookswood project labelled Brookswood, Langley; West Vancouver as a contrasting tiled-fireplace example where useful.
Content brief: immediate transformation image; what can be assessed; installation-versus-product distinction; finish choices; realistic scope/pricing factors; assessment process; relevant completed work; concise FAQs; photo inquiry.
Exclusions: no Abbotsford project/address/review invented, no retail materials, no appliance installation/repair.
Inbound relationship: a genuinely useful service-area link from the existing Venetian-plaster owner and another relevant regional/applicational context, not a forced footer grid.
Outbound relationship: fireplace owner, Marmorino owner, relevant project and pricing/contact as useful.
Gate: coherent distinct brief, true coverage, real correctly labelled imagery, working inquiry/attribution. A pre-existing Abbotsford GSC query is NOT mandatory.
Recommendation: prepare first after approval; do not create separate Marmorino/feature-wall/fireplace/Mediterranean Abbotsford pages at launch.

### Mission

Proposed path: /venetian-plaster-mission.html
Primary intent: find an available decorative-plaster specialist serving Mission.
Secondary intent: distinguish updating the visible surround/wall from replacing or servicing the appliance.
Proof: the same authenticated regional portfolio can be used, but no Mission installation implied.
Content brief: independent project-intake and finishing-scope journey that is useful in its own right, not a Mission rewrite of the Abbotsford page. Shared necessary process facts can be concise and linked.
Business angle: regional finishing support for homeowners/designers and potentially fireplace contractors; no partnership invented.
Gate: if the proposed content differs only by city name, do not publish it yet. It must answer meaningful questions or document genuine evidence, not invent a "Mission homeowner personality."
Recommendation: lower-confidence second pilot, not a blanket rejection and not contingent on pretending zero/null means no customers.

### Existing Coquitlam

Keep /venetian-plaster-coquitlam.html.
Do not launch a duplicate "Coquitlam plaster walls" or "Mediterranean walls Coquitlam" page. Improve legitimate discovery, supported application information and inquiry usability within its established role.

### Regional relationship

Material owners explain the finish. Application owners explain the project. City owners establish availability and local hiring relevance. Case studies document a completed installation. Pricing remains on the established pricing page with concise scope context elsewhere.

Do not make every new city page repeat the full Venetian-plaster guide, full fireplace service page and full pricing article.

## 11. Research-Based Architecture

Stile di Leo
- Material/service owners: Venetian Plaster; Marmorino [KEEP]
- Application owners: Fireplace Transformations; Feature Walls [KEEP]
- Pricing owner [KEEP]
- Projects Hub and genuine case studies [KEEP]
- Service-area discovery in existing relevant navigation/content [IMPROVE LATER]
- Existing city owners:
  - Vancouver / Surrey / Langley [OPTIMIZE]
  - Coquitlam / West Vancouver [DISCOVERY + PROOF]
  - Burnaby / Richmond / North Vancouver [REFRESH AS EVIDENCE WARRANTS]
- Missing-city pilots, only after approval:
  - Abbotsford [FIRST BRIEF]
  - Mission [SECOND, LOWER CONFIDENCE]
- Other covered cities [WATCH / RESEARCH]

No extra "all cities" hub is required solely to justify more pages. No city-by-material-by-application grid.

## 12. Highest-ROI Queue, Analysis Only

| Priority | Future task | Target | Why |
| --- | --- | --- | --- |
| P0 | Inspect actual snippet/query intent for local phrase; retain decorative qualification | Existing Langley page | Best observed position + meaningful impressions + zero query clicks |
| P0 | Inspect Surrey local-query snippet and focal-wall ownership | Existing Surrey pages | Existing near-page-one visibility with no local-query clicks |
| P1 | Plan Coquitlam discovery from a genuinely relevant source | Existing Coquitlam owner | One independent incoming source; page already exists |
| P1 | Prepare Abbotsford editorial/ownership brief | Proposed Abbotsford page | Confirmed service area and relevant local ecosystem; manageable pilot |
| P1 | Review accurate GBP coverage additions, including Mission | Existing owned GBP | Actual metadata gap, not a new-office strategy |
| P1 | Replace assumptions with actual project context in future city refresh | West Vancouver owner | Authenticated local case is stronger than generic luxury claims |
| P2 | Prepare a distinct Mission brief and referral angle | Proposed Mission page | Coverage confirmed; query evidence weaker |
| P2 | Review remaining city image-location assertions | Burnaby/Richmond/North/West Vancouver | Preserve trust and avoid claiming unverified local installations |
| P2 | Label service destinations as services, not articles | Existing navigation/blog cards | Clearer route toward consultation |
| P2 | Review source/city-to-qualified-lead attribution | Existing private inquiry workflow | Visits and clicks do not establish revenue |

A later release can cover existing-page improvements and one city pilot without waiting for every unrelated historical exclusion to disappear. The current 19 exclusions still need authoritative inspection; they should not be treated as an excuse to create replacements for already-existing pages.

## 13. Publication Gates for Later Implementation

- Exact existing URL ownership checked; no duplicate city owner.
- All factual local claims sourced; no neighborhood wealth/housing stereotypes.
- Real portfolio with actual project locations; no fabricated city case studies.
- Distinct customer usefulness, not just swapped city names.
- Clear distinction from supply, DIY, gas repair, chimney services and unsupported applications.
- Existing contact/analytics system reused; no PII in analytics.
- Relevant incoming link and onward service/project journey planned before launch.
- Canonical .html convention, one H1 and appropriate sitemap inclusion.
- Responsive asset/performance/HTML/JSON-LD/link/browser checks performed during implementation, not claimed by this research.
- Post-launch evaluation over comparable windows. Consider a longer 60-90-day observation for sparse city data rather than declaring failure after a few days.
- Count qualified inquiries/estimates/wins, not only page count or impressions.
- No guaranteed ranking, CPL or project volume.

## 14. What Not to Do

- Do not create a second Coquitlam/Langley/Surrey owner.
- Do not mass-create 10-20 near-identical city pages.
- Do not infer affluent buyers from a city name or population alone.
- Do not equate no GSC row with no demand or current non-indexation.
- Do not equate Planner 10 with ten customers, or sum overlapping ideas.
- Do not treat low paid-ad competition as low SEO difficulty.
- Do not lead with generic "plaster repair" or appliance servicing.
- Do not advertise showers, bathrooms, Tadelakt, countertops or exterior stucco repair.
- Do not claim universal demolition-free resurfacing or unsupported heat suitability.
- Do not copy competitor prices, reviews, project dates, local claims or guarantees.
- Do not create fictitious offices or additional GBP profiles.
- Do not replace established Venetian/Marmorino ownership with speculative Mediterranean-style city pages.
- Do not call seven tracked accepted-form events seven verified customers/sales.
- Do not merge legitimate pages on small cross-query samples.

Google's [doorway-abuse policy](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse) is the boundary for geographic funnels, not a ban on useful service-area pages.

## 15. Deliverable and Safety Record

Only this research report was created:
SEO/LOWER-MAINLAND-CITY-EXPANSION-RESEARCH-v1.0.md

No production file was modified during this audit. Existing tracked patch checksum at start:
425346a56dde756fec3df5cdade24558529d072813d168442193d55dff8f479d
The same patch checksum must match on completion.

Existing uncommitted Surrey/Langley/Coquitlam changes, indexation report and acquisition drafts were preserved. No staging, commit, push, deploy, GBP edit, paid campaign or GSC submission.

Temporary read-only research artifacts:
- /private/tmp/city-expansion-inventory.json
- /private/tmp/city-expansion-live.json
- /private/tmp/google-geotargets-2026-10-06.csv
- /private/tmp/city-expansion-existing.patch

No Netlify build or browser render suite rerun: production code was not changed. Live HTTP and metadata checks support availability only, not current Google index membership.

## Final Recommendation

Next implementation sprint, after review:
EXISTING CITY CTR RECOVERY + ABBOTSFORD SERVICE-AREA PILOT

Targets:
- /venetian-plaster-langley.html
- /venetian-plaster-surrey.html
- /venetian-plaster-coquitlam.html (discovery, not another page)
- proposed /venetian-plaster-abbotsford.html

Mission remains the next separately briefed pilot, not an automatic copy. This combines a known opportunity to improve existing visibility with one measured geographic expansion instead of betting the plan on page count.

RESEARCH COMPLETE - AWAITING HUMAN REVIEW

