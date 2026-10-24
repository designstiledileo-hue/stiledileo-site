# Image Validator Reliability RC1

Prepared: 2026-10-24, America/Vancouver.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`; branch `main`.
Starting HEAD: `1d08f11ab1684ccb6b4d3577f301c2397c167f4c`.
Scope: offline validator/source-resolution tooling and regression tests only. No production content changes.

## 1. Verified Before State

The current validator was executed before editing; no historical count was assumed.

```text
node scripts/seo-validate.js
SEO validation failed: 146 issue(s)
Exit status: 1
```

All 146 diagnostics called `/.netlify/images?...` a broken local reference. The parser stripped the query and tried to find a physical `/.netlify/images` file. It never inspected the required source `url` parameter. HTML-escaped query separators, encoded source paths and transformation parameters were consequently not interpreted.

The two existing SEO/measurement suites passed all 118 tests before changes. A SHA-256 snapshot captured all 315 existing tracked and nonignored untracked files, including the pending Vancouver HTML cleanup and six untracked reports.

## 2. Fix Implemented

`scripts/seo-validate.js` now uses a small dependency-free CommonJS reference resolver:

- Recognizes the same-origin Netlify Image CDN endpoint instead of requiring a filesystem endpoint.
- Requires exactly one nonempty `url` source. Missing/empty/duplicate sources remain errors.
- Decodes HTML attribute entities before parsing query parameters with the URL API. Outer query encoding and source-path encoding are separate layers; literal percent sequences are not repeatedly decoded.
- Resolves local source paths independently of transformation parameters and strips the source's own query/fragment through URL parsing, not ad hoc splitting of the outer URL.
- Checks root-relative, document-relative and same-origin absolute references, including ordinary images.
- Walks actual directory entries to verify every component's exact case. Case-insensitive macOS lookup cannot conceal mismatched filenames/extensions; missing sources and invalid paths still fail.
- Checks that image sources are files, not merely existing directories. Malformed source encoding, unsupported source protocols and encoded paths escaping the repository fail safely.
- Separates external HTTP(S) sources from local assets. Remote availability is explicitly unsupported offline, not asserted as a successful check or mistaken for a missing local file. Nested CDN sources likewise require runtime verification.
- Checks `img`/`source` responsive candidates and `link` responsive preload candidates, plus HTML inline backgrounds. Inline style attributes and style-element CSS retain their different HTML entity-decoding rules.
- Retains canonical, sitemap, robots, H1, metadata, JSON-LD, local-link and image-attribute checks. Repeated processing of the same failing reference does not multiply identical diagnostics.

No library was installed. No production browser bundle includes the helper. The endpoint/source distinction follows [Netlify's Image CDN documentation](https://docs.netlify.com/build/image-cdn/overview/): `url` identifies the source; other query parameters control transformations. Netlify's remote-source configuration and actual transformation responses are separate runtime concerns, not filesystem checks.

## 3. Regression Coverage

New suite: `scripts/test-seo-validator.cjs`, 25 offline tests. Fixtures are created outside the repository and removed afterward. CLI integration cases execute the actual validator against isolated miniature sites, rather than testing only a disconnected helper.

| Required case | Result |
| --- | --- |
| Valid local CDN source | PASS; original asset inspected, no virtual endpoint lookup |
| Encoded local path | PASS; spaces and both encoding layers handled |
| Multiple transformation parameters | PASS; order and `&amp;`/numeric entity separators preserve source |
| Missing local source | PASS; helper detects missing file and actual CLI exits 1 |
| Case mismatch | PASS; filename, extension and directory case verified; actual CLI exits 1 |
| Remote image source | PASS; preserves remote query, reports unsupported runtime availability, no local-file false positive |
| Ordinary local image URL | PASS; root/document-relative and same-origin absolute paths checked |

Additional cases cover literal percent characters, source queries/fragments, missing/duplicate source parameters, malformed escapes, directory-only sources, protocol-relative remotes, lookalike hostnames, traversal, nested CDN sources, responsive data URLs/encoded commas, responsive-only failures, inline CSS failures/entity decoding, and preservation of unrelated canonical failures.

## 4. Results After Repair

```text
Image source checks: 457 local Image CDN reference(s) resolved to source paths.
SEO validation failed: 1 issue(s)
- blog.html: local reference case mismatch (actual /images/Fire-Place-vancouver1.png) /images/Fire-place-vancouver1.png
Exit status: 1
```

The 457 figure counts per-page source/variant references across checked contexts, not unique photographs or live HTTP requests. An independent reconciliation re-ran all 146 original failing reference strings through the new resolver: **146/146 resolve to existing exact-case source files**, with no original source failure hidden or whitelisted.

The final validator is intentionally **not reported as passing**. It correctly exposes one previously unchecked inline-background case inconsistency. No new missing local source was found among the checked references.

### Remaining Real Repository Failure

| Field | Finding |
| --- | --- |
| Reference | `blog.html:707`, inline `background-image` |
| Declared path | `/images/Fire-place-vancouver1.png` |
| Actual repository path | `images/Fire-Place-vancouver1.png` |
| Cause | `place` versus `Place`; local case-insensitive existence checks alone conceal the difference |
| Smallest future fix | Change that one reference to `/images/Fire-Place-vancouver1.png` |
| Action in this sprint | Reported only; production HTML and image bytes left unchanged as required |

Fresh read-only GET checks of both [declared-case](https://stiledileo.com/images/Fire-place-vancouver1.png) and [repository-case](https://stiledileo.com/images/Fire-Place-vancouver1.png) public paths returned HTTP 200, `image/png`, 2,035,934 bytes and identical SHA-256 hashes. Therefore this is a confirmed repository exact-case/portability defect, **not a confirmed current production 404**. The validator does not rely on today's hosting tolerance to approve incorrect case.

### Unsupported or Separately Scoped Checks

- Current repository run returned no remote-image or nested-CDN diagnostics. Regression fixtures prove those paths are labelled unsupported, not counted as runtime passes.
- Offline checks do not establish remote HTTP availability, remote allowlist correctness, live Image CDN transformation success, transformation-parameter value validity, caching behaviour or visual image quality.
- Inline CSS URL extraction and responsive-candidate extraction are scoped static checks, not full CSS/HTML standards validation. CSS escapes/import graphs, external stylesheet image references, JavaScript-generated image URLs and dynamic blog-provider content are not comprehensively crawled.
- Metadata images stored in attributes such as `og:image` content are not newly audited by this patch. Existing source/attribute checks are not a rendered browser test or proof of deployment inclusion.
- Inline `data:`/`blob:` media are not checked as filesystem assets. Their payloads/runtime lifetimes are outside the local-source check.

These limitations are separate from the genuine case failure above. No unsupported category was used to suppress a known missing source or case mismatch.

## 5. Validation Commands

| Command / check | Result |
| --- | --- |
| Existing SEO + measurement suites before editing | 118 passed, 0 failed |
| `node --test scripts/test-seo-validator.cjs` | 25 passed, 0 failed |
| `env -u ADVISOR_ROUTE_QA_BASE node --test scripts/test-*.cjs scripts/test-*.mts` | 162 tests: 161 passed, 0 failed, 1 skipped |
| Skipped test | Existing friendly-route HTTP integration test; no QA server URL supplied. Its offline route contracts ran; no provider/lead request sent |
| `node --check scripts/seo-validate.js` | PASS |
| `node --check scripts/seo-reference-utils.cjs` | PASS |
| `node --check scripts/test-seo-validator.cjs` | PASS |
| `node --check scripts/analytics.js` | PASS; source unchanged |
| `node scripts/seo-validate.js` | FAIL, exit 1, one genuine case inconsistency; all 146 original CDN false positives resolved |
| `git diff --check` | PASS |
| Production preservation | Existing HTML, imagery, styling, metadata, routing, sitemaps and analytics unchanged by this sprint |

No Netlify build, browser-layout certification or deployment was needed or claimed for this tooling-only change. The full offline suite exercises existing canonical/routing/measurement contracts. Live media checks above do not execute page analytics or submit inquiries.

## 6. Files and Review Status

Modified:
- `scripts/seo-validate.js`: source-aware validation and explicit unsupported-check reporting.

Created:
- `scripts/seo-reference-utils.cjs`: URL/source resolution, case-sensitive filesystem inspection, responsive and inline CSS URL extraction.
- `scripts/test-seo-validator.cjs`: 25 offline helper/actual-CLI regression tests.
- `SEO/IMAGE-VALIDATOR-RELIABILITY-RC1.md`: this report.

Unrelated pending changes remain untouched. In particular, `venetian-plaster-vancouver.html` was already modified before this run and is not part of the validator repair. No asset, filename or production reference was renamed or substituted.

Evidence: `/private/tmp/stiledileo-image-validator-rc1/`, including baseline/final validator logs, original failure reconciliation, before hashes, full test output, fresh case-variant HTTP results and preservation verification. These temporary files are not repository additions.

Status: validator reliability fix ready for human review. A separately approved one-reference HTML correction is needed for a completely green repository validator. No commit, push or deployment performed.
