# Confirmed Indexation Repairs RC1

Date: 2026-10-24, America/Vancouver.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`.
Branch: `main`.
Reviewed HEAD: `1d08f11ab1684ccb6b4d3577f301c2397c167f4c`, together with the existing uncommitted Vancouver cleanup.
Fresh live verification completed: `2026-10-24T18:41:37.005Z`.

## 1. Decision

**READY FOR HUMAN REVIEW — NO APPROVED PRODUCTION INDEXATION REPAIR REQUIRED.**

The approved queue in `SEO/CURRENT-GSC-EXCLUSION-DIAGNOSIS-v1.0.md` identifies missing current GSC evidence, conditional investigation and a separate validator limitation; it does not establish a production canonicalization defect to repair automatically. Fresh repository and production checks do not establish one either.

No production file was changed during this sprint. Only this report was created. No indexing request, sitemap submission, content merge, new page, metadata rewrite, commit, push or deployment occurred.

Two validation limitations are explicitly retained rather than reported as passes: the existing Image CDN validator parser failures and one newly identified repository filename-case mismatch on a blog background. The latter is not currently a reproduced live asset failure and is not an individually approved repair in the queue.

## 2. Starting State and Preservation

Pre-existing changes:

```text
 M venetian-plaster-vancouver.html
?? SEO/CURRENT-GSC-EXCLUSION-DIAGNOSIS-v1.0.md
?? SEO/VANCOUVER-SERVICE-ACCURACY-CLEANUP-RC1.md
```

The Vancouver cleanup belongs to the preceding, separately authorized sprint. Its current bytes, both existing untracked reports and every other tracked/non-ignored untracked file were hashed before validation and checked afterwards. None was changed by this sprint. Repository diff statistics still show that earlier HTML cleanup, not a new indexation repair.

No worktree, branch or repository copy was created. Applicable instruction locations were checked previously and the current root/SEO locations rechecked; no AGENTS.md was found. No credentials, browser sessions or denied GSC interfaces were accessed.

## 3. Approved Queue Assessment

| Queue item | Current verification | Smallest justified action | Production files changed |
| --- | --- | --- | --- |
| Current reported 19 exclusions and individual inspection | Current URL/reason list and Google-selected canonicals remain unavailable through the documented connector; historical examples are not substituted | Obtain current evidence before choosing a repair | None |
| Incorrect robots directive | All 52 sitemap destinations permit indexing in inspected meta/header directives; robots.txt permits crawling | No change | None |
| Inconsistent/broken canonical | All 52 local documents and live sitemap destinations have one matching self-canonical; live OG URLs also match | No change | None |
| Unintended clean duplicate 200 | All 51 sitemap HTML clean aliases return one 301 then canonical HTML 200 | Preserve redirects | None |
| Redirect loop or avoidable chain | No loop, temporary redirect or multi-hop chain in the tested canonical alias set | No change | None |
| Sitemap inconsistency | Local XML and public function-served XML contain the same 52 unique canonical URLs | No change | None |
| North Vancouver contextual discovery | Existing canonical page is linked twice from the Vancouver owner; no orphan or broken destination. Current excluded status is not established | Do not add an arbitrary link solely to increase count; retain conditional investigation | None |
| Vancouver accepted-service cleanup | Already implemented and pending review from the preceding sprint | Preserve the existing uncommitted change exactly; do not reapply | None during this sprint |
| Image CDN validator parsing | Stock validator reports 146 confirmed parser false positives; all underlying files resolve locally with exact case | Separate tooling-only fix with regression cases; not an indexation routing repair | None |

There is no implemented-repair ledger because no individually verified and approved production indexation defect satisfied the gate. The table records evidence, smallest action and affected-file outcome rather than inventing a repair to fill the sprint.

## 4. Canonicals, Redirects and Query Preservation

Fresh GET checks covered all 52 public sitemap destinations and all 51 corresponding clean HTML aliases, together with historical examples, robots, utilities and deliberate unknown-route controls.

| Representative request | Observed result |
| --- | --- |
| `/venetian-plaster-vancouver` | 301 -> `/venetian-plaster-vancouver.html` -> 200 |
| `/fireplace-wall-vancouver` | 301 -> `/fireplace-wall-vancouver.html` -> 200 |
| `/marmorino-vancouver` | 301 -> `/marmorino-vancouver.html` -> 200 |
| `/projects` | 301 -> `/projects.html` -> 200 |
| `/venetian-plaster-north-vancouver` | 301 -> canonical HTML -> 200 |
| `/venetian-plaster-abbotsford` | 301 -> canonical HTML -> 200 |
| `/venetian-plaster-surrey?utm_source=diagnosis&utm_campaign=canonical_check` | One 301 to the HTML path, both parameters preserved; final 200, query-free canonical |
| `/__gsc_diagnosis_unknown__` | 404, expected control |
| `/__gsc_diagnosis_unknown__.html` | 404, expected control |

The root remains `/`, not a forced `index.html` canonical. No URL-convention change was necessary. The 16 historical extensionless exclusion examples still redirect directly to working canonical targets; this does not identify the current reported 19 URLs.

Repeated GETs for homepage, Vancouver plaster, Fireplace, Marmorino, Cost and North Vancouver produced no network or 5xx error. The main batch comprises 111 URL checks plus 12 repeats, 175 response hops. These are point-in-time checks from one environment, not an uptime or Googlebot-reachability guarantee.

## 5. Sitemap and Noindex

Both `sitemap.xml` and `netlify/functions/opinly-sitemap.mts` were inspected. The public function owns `/sitemap.xml`, includes the existing Abbotsford static-path addition and retains its provider routes/static fallback behaviour. The regression suite verifies function static-inventory parity with local XML.

- Local sitemap: 52 unique entries, valid existing documents, matching canonicals, no meta noindex.
- Live sitemap: 52 unique entries, same URL set, every destination direct 200 with matching canonical/OG URL and no inspected meta/header noindex restriction.
- Live robots.txt: 200, crawl allowance and correct sitemap declaration.
- `/car.html`: 200, self-canonical, `noindex, follow`, absent from both sitemaps.
- `/thank-you.html`: 200, self-canonical, `noindex, follow`, absent from both sitemaps.

No sitemap or robots file/function was edited. Sitemap processing counts are not indexed-page counts, and HTTP 200 does not prove Google indexing.

## 6. Internal Links and Images

### Internal Links

Root-document graph scan: 994 same-origin anchor references across 54 root HTML documents. No missing local path destination or clean link to an existing canonical HTML document was found in this scope. The two fewer references than the preceding diagnosis reflect the pending Vancouver cleanup's two bathroom-referral removals, not changes during this sprint.

This is path/discovery validation; it does not certify every fragment, external URL, API endpoint or dynamic-provider article. No footer links, site-wide city links or additional discovery blocks were added.

### Image Checks

Independent media scan covered 698 image/srcset/poster/inline-background source references, resolving to 80 distinct local sources across the root HTML inventory. It checks filename case explicitly rather than relying on macOS case-insensitive existence checks.

One repository mismatch was found:

| Field | Finding |
| --- | --- |
| Referencing file | `blog.html:707` |
| Reference | Inline CSS `background-image:url('/images/Fire-place-vancouver1.png')` |
| Expected source by reference | `images/Fire-place-vancouver1.png` |
| Actual repository file | `images/Fire-Place-vancouver1.png` |
| Current lowercase-path public response | HTTP 200, `image/png`, 2,035,934 bytes |
| Correct-case public response | HTTP 200, `image/png`, 2,035,934 bytes |
| Identity check | Both downloaded responses and the existing repository PNG have identical SHA-256 `4c096ef795a64bfd6f30846cade85ee67a5f332e1bf4ae36f7f09666384d7479` |
| Confirmed cause | Repository reference differs in `Place` capitalization; exact production resolution mechanism was not established |
| Potential smallest fix | Change only `Fire-place-vancouver1.png` to `Fire-Place-vancouver1.png` in that one background reference |
| Applied now? | No: unrelated blog reference is not an individually approved repair in this queue, and a production failure is not reproduced |
| Follow-up regression | After specific approval, exact-case source scan plus public GET and visual card check; preserve the surrounding card/link/copy |

This is a real repository consistency finding, not proof of a current 404 or cause of any GSC exclusion. It should not be concealed as a full image-validation pass. The media scan found no other missing/exact-case source issue within its documented scope; linked stylesheet internals and runtime-generated/provider media are outside that source scan.

Additionally, 36 selected public image-CDN/background URLs used by the current Vancouver page, North Vancouver and car utility were fetched: all returned 200 with image content types and nonempty bodies. This includes the existing authenticated replacement intro source in the pending Vancouver cleanup; it does not imply that cleanup has been deployed.

## 7. Dynamic Blog Preservation

`netlify/functions/opinly-blog.mts` remains unchanged and declares `/blog/*` as its route. The sitemap function's dynamic route mapping remains unchanged.

Fresh live controls:

- `/blog`: 301 to `/blog.html`.
- `/blog.html`: 200.
- `/blog/__indexation_repair_unknown_article__`: 404 with `Article not found`, an expected deliberately nonexistent article.

No published provider-article URL was identified from the available evidence, so a real published dynamic-article 200 is NOT claimed. The negative-route response and unchanged handler establish narrower evidence only. No provider credentials were inspected and no blog renderer/provider repair was attempted.

## 8. Build and Regression Results

| Check | Result |
| --- | --- |
| Normal Netlify build, `build --offline` | PASS: five functions and one edge function bundled; no deployment |
| `node --check scripts/analytics.js` | PASS |
| SEO-foundation and measurement suites | PASS: 118 tests, zero failures |
| Local sitemap/canonical/indexability | PASS: 52 documents, zero inconsistencies |
| Live sitemap/canonical/OG/indexability | PASS: 52 direct-200 destinations |
| Canonical alias redirects | PASS: 51 one-hop permanent redirects |
| UTM preservation | PASS: both tested values retained, canonical query-free |
| Unknown clean and HTML controls | PASS: expected 404 |
| Utility noindex preservation | PASS: car and thank-you excluded from sitemaps |
| Internal path scan | PASS within root-HTML scope: 994 references |
| Independent local image scan | FINDING: one deferred filename-case mismatch; other checked sources resolve |
| Selected live images | PASS: 36 image responses, plus both blog-case variants separately verified |
| `node scripts/seo-validate.js` | FAIL: 146 existing CDN-path parsing findings; independent decoding/exact-case checks found no missing source among those 146 |
| Published dynamic article | NOT VERIFIED: no actual published URL available; negative-route control passes |
| Input-file preservation | PASS: all pre-existing tracked and non-ignored untracked file hashes unchanged |
| New production changes | None |

No validator findings were suppressed, no script was rewritten to turn a failing check green, and no raw parser error was presented as proof of a broken production image.

## 9. Files, Evidence and Remaining Inputs

Created during this sprint:

- `SEO/CONFIRMED-INDEXATION-REPAIRS-RC1.md`.

Modified production files during this sprint: **none**.

Temporary raw evidence: `/private/tmp/stiledileo-confirmed-indexation-repairs-rc1/`, including the input hashes, live URL results, sitemap/robots snapshots, media checks, additional blog/image responses, build/test/validator logs and source-decoding results. Temporary QA scripts and snapshots were not added to the repository.

Remaining inputs/actions:

1. Current GSC Page Indexing reason groups/example URLs and report date, then URL Inspection for important canonical targets actually excluded. No password, token or credential export is required. The current 19 remain unidentified rather than replaced with historical examples.
2. Specific approval for the one-reference blog background case correction if desired. It is a repository-hardening task, not an established production indexing fix.
3. Separate tooling-only approval/scope for the Image CDN parser fix with positive and negative regression cases.
4. Human review of the existing Vancouver cleanup; it remains uncommitted and was not broadened here.

No fresh GSC field discovery or dataset was requested during this repair-only turn. The access limitation is inherited explicitly from the same-day diagnosis, not presented as a new inspection verdict.

**READY FOR HUMAN REVIEW — NO APPROVED PRODUCTION INDEXATION REPAIR REQUIRED.**

Do not interpret this scoped result as confirmation that all pages are indexed, that the current 19 exclusions are explained, or that the entire website validation suite is clean. No commit, push or deployment performed.
