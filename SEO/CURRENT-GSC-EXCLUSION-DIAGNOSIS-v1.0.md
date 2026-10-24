# Current GSC Exclusion Diagnosis v1.0

Date: 2026-10-24 (America/Vancouver). Live evidence captured: 2026-10-24T18:23:23.259Z.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`.
Branch: `main`. Reviewed revision: `1d08f11ab1684ccb6b4d3577f301c2397c167f4c`.
Mode: diagnosis only. Only this Markdown report was created; no production file, GSC state, sitemap submission, deployment or authentication setting changed.

## 1. Executive Summary

**GSC EXCLUSION DIAGNOSIS LIMITED BY DATA ACCESS**

- VERIFIED FACT: authorized Windsor Search Console access works for Search Analytics and Sitemaps. Current field/option discovery does not expose Page Indexing exclusion reasons or URL Inspection. The Google API has a separate inspection service, but this connected tool does not expose it.
- UNAVAILABLE EVIDENCE: the current reported 19 URLs, their report update date, current reasons, current Google-selected canonical and inspection results. Their identities and total cannot be independently confirmed here.
- VERIFIED FACT: the three September exports contain 24 unique historical examples: 8 redirects, 7 alternate-canonical examples and 9 crawled/not-indexed examples. They are NOT the current 19-URL list.
- VERIFIED FACT: 16 of those 24 historical URLs are now one-hop permanent aliases with final HTML 200 responses; 7 are canonical HTML documents; 1 is sitemap XML. Do not subtract 16 from 19 or extrapolate this composition to the current report.
- VERIFIED FACT: all 52 public sitemap entries return 200 directly, have one matching canonical and no inspected meta/header noindex restriction. Local and live sitemap sets match. No unintended independent-200 clean variant was observed among the 51 sitemap HTML aliases.
- VERIFIED FACT: all 7 historical canonical HTML examples received WEB impressions in September 24–October 21. This demonstrates visibility during that window, not present index inclusion.
- INFERENCE: historic aliases are consistent with older pre-normalization observations. Their exact GSC history and removal timing are not proven by HTTP checks.
- RECOMMENDATION: obtain current indexing reasons/inspection evidence before any repair, merge or request for indexing. No production canonicalization repair is justified by this evidence.

## 2. Dataset and Access Limitations

| Dataset | Property | Date / update scope | Dimensions and filters | Rows / limits | Source |
| --- | --- | --- | --- | --- | --- |
| Current reported exclusions | User-reported Stile di Leo; exact selected GSC property not independently confirmed | Current report date unavailable | Reason / affected URL list unavailable | 19 reported; 0 current rows retrieved | Owner report, not replaced with history |
| Historical Page Indexing exports | https://stiledileo.com/ inferred from export filenames and URLs; Metadata.csv does not separately identify property | Exported Sep 23; chart Jun 29–Sep 20, 2026; row crawl dates vary | All known pages; separate reason per ZIP; URL + last crawled | 8 + 7 + 9 = 24 unique examples; source row cap not stated | Three local September ZIPs, read directly |
| Current-window performance | https://stiledileo.com/ only | 2026-09-24 through 2026-10-21 inclusive; fetched this sprint, cache freshness not exposed for these rows | page × search_type; clicks, impressions, ctr, position; no country/device/query filter; WEB filtered after retrieval | 68 returned = 42 WEB + 26 IMAGE; upstream cap/truncation not exposed | Windsor get_data; include_fresh_data left default false |
| Earlier-window performance cross-check | https://stiledileo.com/ only | 2026-09-22 through 2026-10-19 | Same grain and filters as above; not pooled or used to claim growth | 68 returned; upstream row limits unknown | Windsor get_data |
| Rejected aggregated sitemap query | https://stiledileo.com/ | Requested Sep 24–Oct 21 | path, last_downloaded, last_submitted, submitted, errors, warnings | 2 rows, one null path; submitted=102 is NOT an accepted inventory count | Windsor multi-day response |
| Accepted sitemap snapshot | https://stiledileo.com/ | Single requested date Oct 23; data_fetched_at 2026-10-24T18:22:06 (UTC per field definition) | account_id + path + timestamps + submitted/errors/warnings + data_fetched_at disables aggregation | 1 row; submitted 51, errors 0, warnings 0 | Windsor non-aggregated snapshot |
| Repository and production checks | https://stiledileo.com/ | Oct 24 live sample | 54 root HTML documents; 52 sitemap destinations; clean aliases; utility pages; robots; unknown controls | 111 initial URL checks + 12 repeat checks; 175 HTTP response hops | Read-only filesystem scan and GET requests |

### Capability and privacy boundary

Fresh connector discovery lists two separate accessible properties: `https://stiledileo.com/` and `sc-domain:stiledileo.com`. Only the URL-prefix property was queried. Never combine their totals. Available tables are Search Analytics, Search Appearance and Sitemaps; the only exposed connector option is include_fresh_data. No Google index verdict, current exclusion reason, Google-selected canonical or current Page Indexing list is returned by the discovered fields. The deprecated sitemap indexed field was not requested or used.

No browser access to GSC was attempted: earlier app/browser permission denial was respected. No alternative browser, cookies, credential files, tokens or direct authenticated API workaround were used. No profile, account permission or external state was changed.

### Data quality

The multi-day sitemap query returned submitted=102 and a null-path row. A non-aggregated single-date read returned 51 for the real sitemap, with last download `2026-10-23T10:32:49.460Z` and last submission `2026-09-21T04:59:47.411Z`. Do not sum sitemap snapshots over time, use the null row as another sitemap, or call either submitted count an indexed count. Current public XML contains 52 URLs. Snapshot age, caching and processing timing can explain the difference, but its exact cause is UNVERIFIED; it is not evidence that Abbotsford is excluded.

Performance rows are not an exclusion list or complete query disclosure. Query/page totals and page totals may differ. Zero/missing performance rows do not establish non-indexing. The returned WEB page-grain sum is 9 clicks / 2,407 impressions; it is not asserted to equal the property chart total. IMAGE rows were kept out of all WEB tables. No uplift is inferred from the overlapping windows or from changes released after this reporting window.

### Exact historical sources

- `/Users/vladyslavdementiev/Downloads/https___stiledileo.com_-Coverage-Drilldown-2026-09-23 (1).zip`
- `/Users/vladyslavdementiev/Downloads/https___stiledileo.com_-Coverage-Drilldown-2026-09-23 (2).zip`
- `/Users/vladyslavdementiev/Downloads/https___stiledileo.com_-Coverage-Drilldown-2026-09-23.zip`

Each ZIP's Metadata.csv, Chart.csv and Table.csv was read directly. July/August exports exist but were not combined with September or represented as current. No more recent coverage export was found in the inspected Downloads inventory.

## 3. Complete Available Exclusion Matrix — Historical Only

All paths below expand to `https://stiledileo.com` plus the path. Canonicals are those declared by the final live document, not Google's selected canonical. Historical reasons/crawl dates are not current GSC verdicts. Discovery counts are current root-HTML incoming links to the final destination, excluding self-links; header/related links can be included and counts do not measure authority or guarantee crawling.

| URL | Page purpose | GSC reason (Sep only) | Last crawled (Sep export) | Current HTTP | Redirect target | Declared final canonical | Indexability | Public sitemap | Internal discovery | Business importance | Exclusion assessment | Recommended action | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /custom-architectural-rock-installation | Project case study | Alternate page with proper canonical tag (historical) | 2026-08-28 | 301 > 200 | /custom-architectural-rock-installation.html | /custom-architectural-rock-installation.html | Alias redirects; target allows indexing | Target only | 3 source pages / 4 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /feature-wall-vancouver | Service owner | Alternate page with proper canonical tag (historical) | 2026-08-18 | 301 > 200 | /feature-wall-vancouver.html | /feature-wall-vancouver.html | Alias redirects; target allows indexing | Target only | 42 source pages / 72 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-cost-vancouver | Pricing | Alternate page with proper canonical tag (historical) | 2026-08-18 | 301 > 200 | /venetian-plaster-cost-vancouver.html | /venetian-plaster-cost-vancouver.html | Alias redirects; target allows indexing | Target only | 42 source pages / 90 anchors | High (accepted scope only) | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-burnaby | City service | Alternate page with proper canonical tag (historical) | 2026-06-12 | 301 > 200 | /venetian-plaster-burnaby.html | /venetian-plaster-burnaby.html | Alias redirects; target allows indexing | Target only | 4 source pages / 4 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-bathroom-vancouver | Legacy bathroom content; not accepted acquisition service | Alternate page with proper canonical tag (historical) | 2026-05-31 | 301 > 200 | /venetian-plaster-bathroom-vancouver.html | /venetian-plaster-bathroom-vancouver.html | Alias redirects; target allows indexing | Target only | 5 source pages / 8 anchors | Do not promote | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-vs-drywall-vancouver | Comparison | Alternate page with proper canonical tag (historical) | 2026-05-30 | 301 > 200 | /venetian-plaster-vs-drywall-vancouver.html | /venetian-plaster-vs-drywall-vancouver.html | Alias redirects; target allows indexing | Target only | 4 source pages / 4 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-langley | City service | Alternate page with proper canonical tag (historical) | 2026-05-09 | 301 > 200 | /venetian-plaster-langley.html | /venetian-plaster-langley.html | Alias redirects; target allows indexing | Target only | 4 source pages / 5 anchors | High (accepted scope only) | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /feature-wall-surrey.html | Local application service | Crawled - currently not indexed (historical) | 2026-09-10 | 200 | None | /feature-wall-surrey.html | Allows indexing; current Google state unknown | Exact URL | 5 source pages / 6 anchors | High (accepted scope only) | Unresolved historical status; no blocking HTTP defect | Obtain current URL Inspection before repair | High live / historical only for GSC |
| /black-venetian-plaster-wall-vancouver.html | Colour/application service | Crawled - currently not indexed (historical) | 2026-07-22 | 200 | None | /black-venetian-plaster-wall-vancouver.html | Allows indexing; current Google state unknown | Exact URL | 3 source pages / 3 anchors | Supporting | Unresolved historical status; no blocking HTTP defect | Obtain current URL Inspection before repair | High live / historical only for GSC |
| /blog.html | Article index | Crawled - currently not indexed (historical) | 2026-07-01 | 200 | None | /blog.html | Allows indexing; current Google state unknown | Exact URL | 8 source pages / 9 anchors | Supporting | Unresolved historical status; no blocking HTTP defect | Obtain current URL Inspection before repair | High live / historical only for GSC |
| /microcement-vancouver | Service owner | Crawled - currently not indexed (historical) | 2026-05-09 | 301 > 200 | /microcement-vancouver.html | /microcement-vancouver.html | Alias redirects; target allows indexing | Target only | 8 source pages / 12 anchors | High (accepted scope only) | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-durability-vancouver.html | Buyer guide | Crawled - currently not indexed (historical) | 2026-04-23 | 200 | None | /venetian-plaster-durability-vancouver.html | Allows indexing; current Google state unknown | Exact URL | 7 source pages / 9 anchors | Supporting | Unresolved historical status; no blocking HTTP defect | Obtain current URL Inspection before repair | High live / historical only for GSC |
| /venetian-plaster-maintenance-vancouver.html | Buyer guide | Crawled - currently not indexed (historical) | 2026-04-23 | 200 | None | /venetian-plaster-maintenance-vancouver.html | Allows indexing; current Google state unknown | Exact URL | 6 source pages / 7 anchors | Supporting | Unresolved historical status; no blocking HTTP defect | Obtain current URL Inspection before repair | High live / historical only for GSC |
| /venetian-plaster-north-vancouver.html | City service | Crawled - currently not indexed (historical) | 2026-04-23 | 200 | None | /venetian-plaster-north-vancouver.html | Allows indexing; current Google state unknown | Exact URL | 1 source pages / 2 anchors | High (accepted scope only) | Unresolved historical status; no blocking HTTP defect | Obtain current URL Inspection before repair | High live / historical only for GSC |
| /venetian-plaster-bathroom-vancouver.html | Legacy bathroom content; not accepted acquisition service | Crawled - currently not indexed (historical) | 2026-04-15 | 200 | None | /venetian-plaster-bathroom-vancouver.html | Allows indexing; current Google state unknown | Exact URL | 5 source pages / 8 anchors | Do not promote | Unresolved historical status; no blocking HTTP defect | Business-scope review, not index-growth target | High live / historical only for GSC |
| /sitemap.xml | Discovery XML | Crawled - currently not indexed (historical) | 2026-04-12 | 200 | None | N/A | XML | No | robots.txt declaration | Discovery, not ranking page | Expected non-webpage exclusion | No webpage-indexing request | High live / historical only for GSC |
| /brookswood-langley-fireplace-transformation | City service | Page with redirect (historical) | 2026-09-15 | 301 > 200 | /brookswood-langley-fireplace-transformation.html | /brookswood-langley-fireplace-transformation.html | Alias redirects; target allows indexing | Target only | 13 source pages / 22 anchors | High (accepted scope only) | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-vancouver | Service owner | Page with redirect (historical) | 2026-09-06 | 301 > 200 | /venetian-plaster-vancouver.html | /venetian-plaster-vancouver.html | Alias redirects; target allows indexing | Target only | 47 source pages / 109 anchors | High (accepted scope only) | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /fireplace-wall-vancouver | Service owner | Page with redirect (historical) | 2026-09-02 | 301 > 200 | /fireplace-wall-vancouver.html | /fireplace-wall-vancouver.html | Alias redirects; target allows indexing | Target only | 50 source pages / 111 anchors | High (accepted scope only) | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-condo-vancouver | Application guide | Page with redirect (historical) | 2026-08-13 | 301 > 200 | /venetian-plaster-condo-vancouver.html | /venetian-plaster-condo-vancouver.html | Alias redirects; target allows indexing | Target only | 8 source pages / 14 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-surrey | City service | Page with redirect (historical) | 2026-07-30 | 301 > 200 | /venetian-plaster-surrey.html | /venetian-plaster-surrey.html | Alias redirects; target allows indexing | Target only | 4 source pages / 5 anchors | High (accepted scope only) | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /feature-wall-ideas-vancouver | Buyer guide | Page with redirect (historical) | 2026-07-29 | 301 > 200 | /feature-wall-ideas-vancouver.html | /feature-wall-ideas-vancouver.html | Alias redirects; target allows indexing | Target only | 12 source pages / 20 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /venetian-plaster-entryway-vancouver | Application guide | Page with redirect (historical) | 2026-07-15 | 301 > 200 | /venetian-plaster-entryway-vancouver.html | /venetian-plaster-entryway-vancouver.html | Alias redirects; target allows indexing | Target only | 4 source pages / 6 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |
| /blog-staging-vs-design | Article | Page with redirect (historical) | 2026-06-23 | 301 > 200 | /blog-staging-vs-design.html | /blog-staging-vs-design.html | Alias redirects; target allows indexing | Target only | 1 source pages / 1 anchors | Supporting | Expected alias exclusion | Keep direct 301; inspect target only if needed | High live / historical only for GSC |

## 4. Expected Exclusions Requiring No Action

- The 16 historical clean aliases currently redirect with exactly one 301 to the correct self-canonical HTML document. Keep them excluded as aliases; do not remove redirects to make their source URLs indexable. The seven former alternate-canonical examples now also redirect; their historical category is not a live duplicate-200 defect.
- `/sitemap.xml` is discovery XML, not a webpage-ranking target. Its historical crawled/not-indexed entry does not justify a webpage indexing request.
- `/car.html`: live 200, self-canonical, `noindex, follow`, absent from both sitemaps. Preserve its approved campaign-utility role.
- `/thank-you.html`: live 200, self-canonical, `noindex, follow`, absent from both sitemaps. Preserve utility exclusion.
- Deliberately unknown clean and HTML test routes both return 404. These are controls, not actual GSC exclusion records or broken business pages.

## 5. Confirmed Technical Defects

**No production routing, canonical, sitemap or indexability defect was confirmed in this scope.** No production repair was performed.

One independently verified repository-tooling issue remains: `node scripts/seo-validate.js` reports 146 failures caused by interpreting Netlify Image CDN transformation URLs as filesystem paths. Every one of the 146 underlying local sources was decoded and checked independently with exact filename case; zero source failures were found. Report the stock validator as FAIL, not PASS, and do not describe this output as 146 broken live images or a demonstrated cause of GSC exclusions. A separate tooling-only parser repair is appropriate; no validator source was changed here.

The Vancouver owner's legacy bathroom positioning and uncertain material-image provenance remain outside this indexing diagnosis. They were not rewritten and should not be presented as an explanation for the reported 19 exclusions.

## 6. Important Canonical Pages Needing Further Investigation

These seven are from the historical exports, not the missing current 19 list. All presently return 200 and allow indexing, appear in the 52-entry live sitemap and have incoming internal links.

| Canonical path | WEB clicks | WEB impressions | Average position | Discovery | Business interpretation |
| --- | --- | --- | --- | --- | --- |
| /feature-wall-surrey.html | 0 | 2 | 40 | 5 source pages / 6 anchors | Commercial application; inspect present status, do not infer from small sample |
| /black-venetian-plaster-wall-vancouver.html | 0 | 9 | 30.5556 | 3 source pages / 3 anchors | Commercial application; inspect present status, do not infer from small sample |
| /blog.html | 0 | 122 | 11.959 | 8 source pages / 9 anchors | Supporting intent; inspect before changes |
| /venetian-plaster-durability-vancouver.html | 0 | 12 | 26.1667 | 7 source pages / 9 anchors | Supporting intent; inspect before changes |
| /venetian-plaster-maintenance-vancouver.html | 0 | 13 | 48.8462 | 6 source pages / 7 anchors | Supporting intent; inspect before changes |
| /venetian-plaster-north-vancouver.html | 0 | 116 | 68 | 1 source pages / 2 anchors | High commercial priority; one incoming source, weak period ranking |
| /venetian-plaster-bathroom-vancouver.html | 0 | 80 | 55.5125 | 5 source pages / 8 anchors | Outside accepted acquisition scope; preserve pending separate content decision |

Prioritize North Vancouver, Surrey Feature Walls and Black Venetian Plaster for current inspection if they remain excluded. North Vancouver has only one incoming root-HTML source (two anchors from the Vancouver owner), but is not an orphan. Its period position 68 is primarily a ranking/visibility constraint, not proof that a snippet rewrite will recover clicks. Small samples on the other application pages do not justify automatic merges or new pages. Guides and the blog index are supporting rather than first-priority revenue owners.

The bathroom page is retained unchanged in this read-only sprint. Its 80 WEB impressions do not authorize promoting a service the business does not accept or requesting indexing solely for traffic. A separate service-accuracy decision is needed.

### Main commercial and discovery pages

| Canonical path | Clean route chain | HTML status | Final declared canonical | Meta robots | Sitemap | Incoming discovery |
| --- | --- | --- | --- | --- | --- | --- |
| / | Root 200 | 200 | / | index, follow | Yes | 53 source pages / 189 anchors |
| /venetian-plaster-vancouver.html | 301 > 200 | 200 | /venetian-plaster-vancouver.html | index, follow | Yes | 47 source pages / 109 anchors |
| /fireplace-wall-vancouver.html | 301 > 200 | 200 | /fireplace-wall-vancouver.html | index, follow | Yes | 50 source pages / 111 anchors |
| /marmorino-vancouver.html | 301 > 200 | 200 | /marmorino-vancouver.html | index, follow | Yes | 9 source pages / 15 anchors |
| /venetian-plaster-cost-vancouver.html | 301 > 200 | 200 | /venetian-plaster-cost-vancouver.html | index, follow | Yes | 42 source pages / 90 anchors |
| /feature-wall-vancouver.html | 301 > 200 | 200 | /feature-wall-vancouver.html | index, follow | Yes | 42 source pages / 72 anchors |
| /projects.html | 301 > 200 | 200 | /projects.html | index, follow | Yes | 48 source pages / 62 anchors |
| /venetian-plaster-surrey.html | 301 > 200 | 200 | /venetian-plaster-surrey.html | index, follow | Yes | 4 source pages / 5 anchors |
| /venetian-plaster-langley.html | 301 > 200 | 200 | /venetian-plaster-langley.html | index, follow | Yes | 4 source pages / 5 anchors |
| /venetian-plaster-coquitlam.html | 301 > 200 | 200 | /venetian-plaster-coquitlam.html | index, follow | Yes | 2 source pages / 3 anchors |
| /venetian-plaster-west-vancouver.html | 301 > 200 | 200 | /venetian-plaster-west-vancouver.html | index, follow | Yes | 3 source pages / 4 anchors |
| /venetian-plaster-abbotsford.html | 301 > 200 | 200 | /venetian-plaster-abbotsford.html | index, follow | Yes | 1 source pages / 1 anchors |

These are additional live controls, not pages known to be among the 19 exclusions. Abbotsford has one distinct incoming root-HTML source, the Vancouver material owner. It is findable and live; absent period GSC impressions do not establish an indexing defect for this recently released page.

## 7. Redirect, Sitemap, Discovery and Availability Validation

### Redirects

51 clean aliases corresponding to the sitemap's .html documents were tested live: each returned one 301 followed by HTML 200, with canonical and og:url matching the HTML destination. No loop, chain, temporary redirect or independently served clean 200 was observed in this set. The root is the root, not a missing .html alias.

Surrey UTM control: `/venetian-plaster-surrey?utm_source=diagnosis&utm_campaign=canonical_check` -> one 301 -> `/venetian-plaster-surrey.html?utm_source=diagnosis&utm_campaign=canonical_check` -> 200. The declared canonical remains the query-free HTML URL. Both parameters were preserved. This was an HTTP GET check, not a browser analytics session.

### Sitemap and robots

- Repository sitemap: 52 unique canonical URLs, each mapping to an existing document with one matching declared canonical and no meta noindex.
- Live function-served sitemap: 52 unique URLs, exact set parity with local XML, no duplicate variant, no utility noindex URL.
- All 52 live sitemap URLs: direct 200; one matching canonical; matching og:url; no inspected robots/googlebot meta or X-Robots-Tag noindex.
- The generated sitemap is served by `netlify/functions/opinly-sitemap.mts`, not solely the static XML. Current source includes the explicit Abbotsford static-path addition and a static fallback if provider lookup fails. Existing regression confirms function inventory/XML parity.
- `robots.txt`: live 200; User-agent * / Allow / and correct sitemap declaration. No observed blanket crawl block.
- No real published dynamic provider article was identified in the 52-entry sitemap or available page dataset. The static inventory checks do not certify Google indexing of unpublished/undiscovered dynamic content or the provider's health.

### Internal discovery

Scanned 996 same-origin anchor references across all 54 root HTML documents, including navigation and in-page links. Zero missing local path destinations and zero clean links to existing .html files were found by that scan. This is path/discovery validation, not a browser test of every fragment, JavaScript action, API route or external website. Administrative nested HTML and dynamic provider content are outside this root-document graph.

Representative useful relationships were inspected in source: Vancouver material owner -> existing city owners and Abbotsford; Surrey plaster -> Surrey feature-wall page; Feature Walls/Fireplace/Vancouver -> black plaster; care guides <-> durability/maintenance; project cases -> material owners. Related-list links are not automatically contextual body links, and many root pages omit a main wrapper, so discovery judgments are not based solely on a main-element heuristic. No new links, footer blocks or hidden anchors were added.

### Availability

123 URL-level checks including repeats, 175 response hops, zero network errors or 5xx. The only non-200 finals are the two deliberate unknown-route 404 controls. Homepage, Vancouver plaster, Fireplace, Marmorino, Cost and North Vancouver were each checked initially plus two repeat rounds; all remained 200. Repeat request latency ranged 0.055–0.146 seconds from this environment.

Classification for prior 504: **NOT REPRODUCIBLE IN THIS SAMPLE**. These short, single-environment GET samples do not establish long-term uptime, worldwide availability, Googlebot reachability or the exact cause of an older external timeout. No infrastructure change is warranted from these results.

### Repository validation

| Check | Result |
| --- | --- |
| Branch / initial working tree | main / clean; no pre-existing edits to preserve |
| Analytics syntax | PASS: node --check scripts/analytics.js |
| Foundation and measurement suites | PASS: 118 tests, 0 failures |
| Stock SEO validator | FAIL: 146 CDN-path parsing findings; independently verified source files all present |
| Local canonical + sitemap checks | PASS: all 52 destinations; 0 duplicate/missing/noindex/mismatched entries |
| Live canonical / OG / sitemap checks | PASS: all 52 public destinations |
| Canonical clean redirects | PASS: all 51 mapped HTML aliases; 1-hop 301 |
| Historical URL live checks | PASS: 16 aliases, 7 HTML documents, 1 XML; current GSC verdict unavailable |
| Noindex controls | PASS: car and thank-you retained and excluded from sitemap |
| Internal path checks | PASS within documented root-HTML scope; 996 references |
| GSC current 19 diagnosis | LIMITED: no current URL/reason/inspection data exposed |
| Build / rendered-browser QA | Not run: report-only diagnosis; no production implementation changed |
| Indexing submissions / deployment | None |

## 8. Prioritized Repair / Investigation Queue

| Priority | Task | Target | Type | Evidence gate / permitted next step |
| --- | --- | --- | --- | --- |
| P0 | Obtain current Page Indexing list and update date | Reported 19 URLs | Evidence | Current GSC reason-group exports or an explicitly authorized interface exposing the actual report; no workaround for denied browser access |
| P0 | Inspect important canonical targets that are actually excluded | Confirmed members of current report; historical seven are candidates, not assumed members | Evidence | Obtain index verdict, coverage reason, Google/user canonical, last crawl, fetch and crawl/index permission results |
| P1 | Repair only confirmed technical defect | Only URLs whose current evidence identifies a defect | Conditional repair | No such production defect found here; do not normalize correctly redirecting aliases again |
| P1 | Review limited North Vancouver discovery if exclusion persists | /venetian-plaster-north-vancouver.html | Conditional discovery review | Only 1 incoming source; add a useful link only if a genuine reader path exists, not to manufacture link count |
| P1 | Separate accepted-service accuracy cleanup | /venetian-plaster-vancouver.html | Separate approved content sprint | Does not require inventing an indexing diagnosis; preserve existing scope and project facts |
| P2 | Correct validator Image CDN parsing | scripts/seo-validate.js | Tooling-only repair | 146 confirmed parser false positives; keep genuine missing/case checks |
| Do not do | Index aliases/XML/utilities; merge real pages; create replacement city pages | Redirects, sitemap.xml, car.html, thank-you.html | No action | None justified by exclusion count alone |

No metadata tests, content rewrites, merges, page creation, canonical convention changes or GSC submissions were carried out. Any future repairs require a new scope grounded in actual current evidence.

## 9. Exact Missing Human Inputs / Authorized Access

The missing information is narrowly defined; no password, cookie, OAuth token or credential file is requested.

1. Current Page Indexing overview showing selected property, last report update date and reason-group counts explaining the reported 19.
2. Current exported example-URL tables for each relevant exclusion reason, retaining URL and last-crawled columns. A reason group's example table can be incomplete even when the count is small; if rows do not reconcile, record the limitation rather than fabricate the rest.
3. URL Inspection results for important canonical service targets actually in that list: current verdict/coverage, Google-selected canonical, user-declared canonical, last crawl, page fetch, robots/crawl permission and indexing permission. Historical seven and main commercial controls above are a prioritized candidate set, not a claim they are all excluded.

Either the owner can provide current exports/screenshots, or an explicitly authorized interface can expose these read-only results. Search Analytics is already connected and does not need reconnection. Do not retry the previously denied browser route or suggest handing over credentials. If the current count no longer equals 19, use the newly evidenced count/date rather than force agreement with an older number.

## 10. Sources, Artifacts and Change Boundary

Existing reports reviewed: `SEO/INDEXATION-RECOVERY-LOCAL-EXPANSION-v1.0.md`, `SEO/STILE-DI-LEO-CLEAN-URL-ROUTING-AUDIT-2026-09-02.md` and `SEO/LOCAL-GROWTH-COMBINED-RELEASE-RC1.md`. Older statements were rechecked against the current repository and production rather than copied as current facts.

Official interpretation references: [Google Page indexing report](https://support.google.com/webmasters/answer/7440203) distinguishes legitimate exclusions from important-page problems and recommends URL Inspection for individual status; example tables are not guaranteed exhaustive. [Search Console API reference](https://developers.google.com/webmaster-tools/v1/api_reference_index) documents URL Inspection separately from Search Analytics and Sitemaps. Google API capability does not mean this Windsor connector exposes that endpoint.

Temporary raw evidence: `/private/tmp/stiledileo-current-exclusion-diagnosis/` includes `gsc.json`, `results.json`, live sitemap/robots snapshots, HTTP/test/validator logs and decoded-source check results. Temporary files are not repository implementation or durable exports; key observations and every historical example are preserved in this report.

Repository deliverable: `SEO/CURRENT-GSC-EXCLUSION-DIAGNOSIS-v1.0.md` only. No production HTML, CSS, JS, routing, sitemap, schema, analytics, page content or asset modified. No commit, push, deployment, ad launch, outreach or indexing request.

**GSC EXCLUSION DIAGNOSIS LIMITED BY DATA ACCESS**
