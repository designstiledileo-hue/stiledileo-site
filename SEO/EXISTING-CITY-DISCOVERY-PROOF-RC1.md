# Existing City Discovery and Project Connection - RC1

Prepared: 2026-10-23, America/Vancouver
Scope: Prompt 2 in `SEO/NEXT-IMPROVEMENTS-PROMPT-PLAN-v1.0.md`.
Repository: `/Users/vladyslavdementiev/Documents/GitHub/stiledileo-site`
Branch: `main`
Starting HEAD: `d23ccce` (`Update venetian-plaster-surrey.html`).
Starting working tree: clean. Earlier city drafts and CTR work were already present in the repository; none was reverted or recreated.
Release state: local human-review candidate only. No staging, commit, push, deployment or GSC submission.

## 1. Decision

Coquitlam already has a service page and an accurately labelled regional-project link. Its discovery problem did not justify another city owner or a page rewrite. Add one contextual route from the feature-wall application page.

West Vancouver already has an authenticated local fireplace card. Do not add a second card or gallery. Improve the surrounding language, remove unverified location claims from unrelated image descriptions, and connect the case study back to ongoing local services.

The selected footprint was stated before editing: `feature-wall-vancouver.html`, `venetian-plaster-west-vancouver.html`, and `west-vancouver-fireplace-transformation.html`, plus this report. Coquitlam itself and the Vancouver material owner were inspected but left unchanged.

## 2. Incoming Link Recount

Method: inspect `<a href>` links across root HTML documents, resolve same-site destinations, exclude target self-links, and count distinct source documents separately from repeated anchors. Includes navigation/related links when present; this is not a backlink count, PageRank calculation, or complete dynamic-blog graph.

| Target | Before source pages | After source pages | Before anchors | After anchors |
| --- | ---: | ---: | ---: | ---: |
| `/venetian-plaster-coquitlam.html` | 1 | 2 | 2 | 3 |
| `/venetian-plaster-west-vancouver.html` | 2 | 3 | 3 | 4 |
| `/west-vancouver-fireplace-transformation.html` | 11 | 11 | 16 | 16 |

Coquitlam sources before: `venetian-plaster-vancouver.html`. Added: `feature-wall-vancouver.html`.

West Vancouver city sources before: `venetian-plaster-vancouver.html` and `venetian-plaster-north-vancouver.html`. Added: `west-vancouver-fireplace-transformation.html`.

The West Vancouver case already receives links from the homepage, Projects, Fireplace, Marmorino, Feature Walls, Vancouver plaster, the Coquitlam and West Vancouver city pages, Brookswood, the black-plaster page, and the fireplace-surround page. No further incoming case-study links were necessary.

## 3. Exact Link Changes

| Source | Destination | Exact new anchor | Placement and visitor purpose |
| --- | --- | --- | --- |
| `/feature-wall-vancouver.html` | `/venetian-plaster-coquitlam.html` | Coquitlam plaster service | Existing Feature Walls and Fireplace Compositions section; directs a Coquitlam visitor to local service/intake details |
| `/west-vancouver-fireplace-transformation.html` | `/venetian-plaster-west-vancouver.html` | decorative plaster service in West Vancouver | Existing Planning Notes section; distinguishes the completed fireplace from services for another wall or room |

Added surrounding sentences:

> Planning a wall in Coquitlam? Our Coquitlam plaster service explains what photographs and surface details to prepare for a consultation.

> Planning another wall or room nearby? Explore our decorative plaster service in West Vancouver.

No existing links were removed, retargeted or renamed. New destinations use direct canonical `.html` paths. Neither new link is in a footer, site-wide navigation, hidden block or keyword list. Each conditional source page received link-only work: its original prose is otherwise unchanged.

Preserved West Vancouver city-to-case links:
- Project image: `/west-vancouver-fireplace-transformation.html`, accessible name `View the West Vancouver fireplace project`.
- Project caption: same destination, `View the project and preparation →`.

Preserved Coquitlam-to-case link: `dark-tile fireplace transformation in West Vancouver`. Its paragraph still says the example is elsewhere in the Lower Mainland, not a completed Coquitlam installation.

## 4. West Vancouver Editorial Corrections

Changed only selected paragraphs and one H2 within the existing structure:
- Opening now starts with a fireplace/wall and the photographs useful for discussing texture, colour and sheen, rather than assumptions that local homes must look expensive.
- Second opening paragraph describes the hand-applied service and keeps the existing material/planning link.
- Existing project-card introduction now identifies dark large-format tile, light Marmorino, the frontal view, the piano/room context and texture under directional light.
- Replaced `Why Venetian Plaster Suits West Vancouver` with `Choosing Texture and Sheen`; its paragraph gives practical room/photo comparison guidance instead of generalizing local taste.

The original project card, its photograph, caption, links, dimensions, responsive sources and analytics attribute remain unchanged. Existing surface-suitability cautions remain. No new material manufacturer, preparation method, duration, price, demolition promise, heat rating, customer motivation or review was invented.

Three existing images had unverified city claims. Kept the images; changed only their alt text:

| Asset | Previous alt | New alt |
| --- | --- | --- |
| `/images/venetianplaster4.png` | Venetian plaster wall in West Vancouver luxury home | Dark dining-room wall finish |
| `/images/Fire-place-vancouver2.png` | Fireplace wall in West Vancouver interior | Black marble-look fireplace surround |
| `/images/venetianplaster2.png` | Venetian plaster feature wall in West Vancouver | Warm neutral wall behind decorative vases |

The replacement descriptions reflect visible subjects without claiming location or authenticating unknown project provenance. These legacy illustrative images are not newly presented as completed-project evidence. No image was substituted or generated.

## 5. Authenticated Project Used

Existing project: residential fireplace, West Vancouver, BC; dark large-format tile changed to light Marmorino.

The city page retains this exact asset:
`images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-front-01.jpg` (1280 x 1271).

Its linked case study contains the original surface, finished frontal photograph, room/piano context, directional-light detail and project video. The page sources and selected images were inspected. No gold-vein version was introduced into this project. The unrelated pre-existing black marble-look gallery image was not relabelled as this project.

The service page describes availability and consultation. The case study remains evidence of one completed installation, not a universal technical specification. No Coquitlam project is claimed.

## 6. Journeys and Contact

Useful optional paths now include:

```text
Feature Walls -> Coquitlam service -> West Vancouver completed example
West Vancouver service <-> West Vancouver fireplace case
Each service/case -> existing photo/contact infrastructure
```

These are navigation options, not a required article-reading funnel. Coquitlam retains its hero/final direct photo CTAs; West Vancouver retains the shared-header photo CTA and final consultation CTA. The case retains its existing fireplace-specific CTA. No additional conversion block or primary CTA was added.

The existing West Vancouver city/case final CTAs go to `/#contact`, where Send Project Photo opens the existing estimate dialog. Coquitlam/Feature Walls final CTAs go directly to `/#estimate`. Both paths were tested; this sprint did not change their destinations, tracking or contact form.

## 7. Unchanged Weaknesses and Limits

- The Vancouver material page still links to Coquitlam twice using the same anchor in two existing contexts. These count as one source, not two. A duplicate link removal was not required for the new discovery path and was left out of scope.
- Existing related-page lists and generic legacy anchors remain. No site-wide anchor overhaul was performed.
- Some older marketing phrases remain outside the selected West Vancouver paragraphs. Metadata, hero, other application/scope sections and final CTA were not broadly rewritten.
- The new case-to-city option sits beside existing fireplace, Marmorino and Brookswood links. It is a short service-availability choice, not a new service hierarchy or an extra CTA card.
- Coquitlam still has limited authenticated local project evidence. Its regional example retains the correct West Vancouver location.
- Earlier GSC research supports improving discovery, but this sprint did not retrieve new performance data or verify current Google-selected canonicals/indexing exclusions. Local HTTP success and link counts do not establish indexation, rankings or future leads.

## 8. Validation

| Check | Result |
| --- | --- |
| Normal local Netlify build | PASS: cached CLI `build --offline`, production context, five functions and one edge function packaged; no deploy |
| `node --check scripts/analytics.js` | PASS |
| Measurement-environment and SEO-foundation suites | PASS: 111 tests, zero failures |
| `node scripts/seo-validate.js` | FAIL: 143 pre-existing Image CDN reference-parser warnings; before/after logs byte-identical |
| Independent source check for all 143 warnings | PASS: all decode to existing files with exact case; zero missing decoded sources |
| Focused HTML checks | PASS on four reviewed pages: closing order, permitted content, duplicate IDs, quoted attributes, valid IDs and void-element content |
| Metadata/head protection | PASS: entire `<head>`, title, description, canonical, OG URL, robots, styles and all script blocks unchanged on each reviewed page |
| H1 | PASS: one unchanged H1 per page |
| Media protection | PASS: image/video/source paths, responsive variants and loading attributes unchanged; only three approved image alts differ |
| Internal links/fragments/image sources | PASS: Coquitlam 35 references / 13 image references; West Vancouver city 43 / 19; Feature Walls 65 / 23; case study 61 / 39 |
| Browser internal destinations | PASS: all distinct root-relative link destinations on the four pages returned local HTTP 200 |
| JSON-LD and inline JS | PASS: existing JSON-LD parses and is unchanged; executable inline scripts parse; no schema added |
| Sitemap | PASS: 51 unique existing canonical documents, no noindex entries, car utility excluded; sitemap unchanged |
| `git diff --check` | PASS |
| Scope protection | Starting fingerprint of 304 files used; only the three declared production files changed; this report is the sole added repository file |

The stock validator failure is not labelled PASS. Its existing CDN-parser limitation was independently checked, not silently fixed during this link/editorial sprint. Targeted HTML validation is not a claim of exhaustive W3C or WCAG certification.

## 9. Browser and Accessibility QA

Preview: `http://127.0.0.1:4197/`, serving this canonical repository. Existing temporary preview simulates Netlify Image CDN transforms using Sharp and real local sources; it does not emulate Netlify Functions/routing or certify production CDN behavior.

All four pages were rendered at 1440, 390 and 375 pixels, for 12 render checks. Full-page, hero and changed-section screenshots were captured. Primary city full-page layouts and changed sections were visually inspected, alongside the desktop conditional-source pages and mobile link contexts.

| Page | 1440px | 390px | 375px | Final contact path |
| --- | --- | --- | --- | --- |
| Coquitlam service | PASS | PASS | PASS | Existing photo dialog |
| West Vancouver service | PASS | PASS | PASS | Contact section -> existing photo dialog |
| Feature Walls | PASS | PASS | PASS | Existing photo dialog |
| West Vancouver case | PASS | PASS | PASS | Contact section -> existing photo dialog |

Every render: zero horizontal overflow, zero broken image elements, zero console/page errors, zero HTTP error responses, no font-loading failures, one H1, no missing image alt attributes and no visible development placeholders. Added copy wraps without clipping. The existing project card remains contained on mobile; existing gallery/media layouts are preserved. No CSS or JavaScript was added.

Tested final CTA heights: 48.3px on the city/application pages and 49px on the case. New contextual text links were focused and activated with Enter at all three widths. The combined test path Feature Walls -> Coquitlam -> West Vancouver case -> West Vancouver service -> Contact -> photo dialog passed at all three widths. Individual final contact handoffs also passed on every render.

No form was submitted and no PII was collected. Google tag/analytics vendor requests were stubbed in the test browser. Some media requests were cancelled with `net::ERR_ABORTED` during metadata loading/navigation, including the existing project video and homepage hero video; no corresponding HTTP failures or page-console errors occurred. Full video-playback certification and a new slider implementation audit were not part of this link-only case-study change; both implementations remain byte-identical.

Screenshots and logs are temporary local QA artifacts, not committed repository files:
- `/private/tmp/stiledileo-discovery-rc1/screenshots/cities-1440.png`
- `/private/tmp/stiledileo-discovery-rc1/screenshots/cities-390.png`
- `/private/tmp/stiledileo-discovery-rc1/screenshots/cities-375.png`
- `/private/tmp/stiledileo-discovery-rc1/screenshots/results.json`
- Individual files use the pattern `{page}.html-{1440,390,375}-{hero,full,change}.png` within that screenshots directory.
- Build, test, validator logs, exact link changes and starting snapshots: `/private/tmp/stiledileo-discovery-rc1/`.

## 10. Files and Review Gate

Modified:
- `feature-wall-vancouver.html`: one contextual paragraph/link only, three added source lines.
- `venetian-plaster-west-vancouver.html`: four selected paragraphs, one H2 and three neutral alt descriptions; eight source lines replaced.
- `west-vancouver-fireplace-transformation.html`: one contextual paragraph/link only, one added source line.

Created:
- `SEO/EXISTING-CITY-DISCOVERY-PROOF-RC1.md`.

Production diff: three files, 12 insertions and eight deletions. Coquitlam, Vancouver material owner, Langley, Surrey, homepage, Projects, shared CSS/JS, analytics, sitemap, assets, routing and existing research/marketing files remain unchanged.

No new page, service owner, city URL, photograph, schema block or tracker was created. No ranking/lead uplift is claimed before release and measurement. No blocking defect found for this human-review candidate. Stop after Prompt 2; Abbotsford briefing/implementation and release are separate steps.

CITY DISCOVERY AND PROJECT CONNECTION READY FOR HUMAN REVIEW
