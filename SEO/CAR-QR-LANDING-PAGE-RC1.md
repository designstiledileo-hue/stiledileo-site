# Stile di Leo Car QR Landing Page RC1

## 1. Page Objective

`/car.html` is a permanent, mobile-first entry page for people who scan the vehicle QR code. It explains the visible result before introducing material terminology and moves visitors toward a photo-based project review.

## 2. Visitor Journey

1. Understand the transformation: ordinary fireplace or wall to architectural feature.
2. See real finished work in the hero.
3. See a real combined before/after transformation immediately below the hero.
4. Identify the relevant service: fireplace, feature wall, Venetian plaster, or Marmorino.
5. Review three real visual directions and how the studio works.
6. Send a project photo through the existing estimate flow, or use verified phone/email contact details.

## 3. Final Information Architecture

- Simplified brand bar with estimate action
- Transformation-led hero
- Before/after fireplace proof
- Four visual service cards
- Three selected project directions
- Four concise studio-practice points
- Three-step project-start process
- Primary conversion block with estimate, phone, and email
- Quiet path to the main Stile di Leo website

The visible content is 526 words and does not function as an SEO article.

## 4. Images and Projects Selected

- Hero: verified existing fireplace project image, optimized as `/images/car-fireplace-hero.jpg`.
- Before/after: `/images/homepage/fireplace-metamorphosis-before-after.jpg`, displayed in full without aggressive cropping.
- Fireplace service: optimized existing project image `/images/car-fireplace-card.jpg`.
- Feature wall: existing `/images/homepage/white-marble.jpg`.
- Venetian plaster: optimized existing project image `/images/car-venetian-plaster.jpg`.
- Marmorino/mineral direction: optimized existing image `/images/car-marmorino.jpg`.
- Selected projects: existing before/after, black-marble, and optimized soft-plaster imagery.

No stock or generated project imagery was introduced. City and material details were omitted where the repository did not verify them. No interactive comparison slider was added because the repository contains one combined before/after asset rather than two verified matching-angle source images.

## 5. CTA Architecture

- Hero primary: `Send Your Project Photo`
- Top bar: `Request an Estimate`
- Persistent mobile action: `Send Your Project Photo`
- Final primary: `Request an Estimate`
- Final alternatives: verified phone and email

Estimate actions use `/#estimate`, the existing Netlify photo-upload workflow. A minimal homepage enhancement now opens that workflow automatically when the page loads with the `#estimate` hash. No second form system was created.

## 6. Tracking Implementation

The page reuses GA4 property `G-P7VJ8MQNKS`.

- Standard GA4 page view distinguishes `/car.html` visits.
- `car_landing_action` tracks CTA interactions.
- `action_name` values: `estimate`, `send_photo`, `phone`, `email`, and `main_site`.
- `campaign_source` is set to `vehicle_qr` for these actions.

No new analytics vendor or privacy behaviour was introduced.

## 7. Indexing Decision

The page uses `noindex, follow` with a self-referencing canonical at `https://stiledileo.com/car.html` and is intentionally excluded from `sitemap.xml`.

Reason: this is a direct-response QR utility page whose concise content overlaps the commercial territory of the approved fireplace, Venetian plaster, and Marmorino pages. Indexing it would create avoidable search competition without improving the QR journey. Followable links still pass visitors and crawlers to the approved service pages.

`scripts/seo-validate.js` now records `car.html` as an intentional noindex page.

## 8. Performance Considerations

- Hero image is preloaded, 111 KB, and not lazy-loaded.
- Large project PNG files were converted into page-specific optimized JPEGs between 85 KB and 149 KB.
- Below-fold images use lazy loading.
- Image dimensions are present to reduce layout shift.
- CSS and JavaScript are local and minimal.
- No library, animation framework, slider library, or additional analytics package was added.
- Reduced-motion preference is respected.

## 9. Validation Results

- Preview URL attempted: `http://6a792b37db3b90ed0dabdd06--designbyleo.netlify.app/car.html`.
- Preview HTTP/browser result: blocked in this session. The Netlify project metadata is reachable and shows current deploy `6a792b37db3b90ed0dabdd06` as ready, but browser access to the deploy URL was denied by the browser security policy. The Netlify CLI status call also hung on network/account lookup, and the sandbox rejected local HTTP server binding with `PermissionError: [Errno 1] Operation not permitted`.
- Production deployment result: blocked by environment. The current approved local workspace state could not be uploaded because the cached Netlify CLI failed to reach `https://api.netlify.com` with `getaddrinfo ENOTFOUND api.netlify.com`. An initial `npx netlify deploy` attempt also failed before running because `registry.npmjs.org` DNS resolution is blocked. No production deployment was created from this session.
- Live production URL: `https://stiledileo.com/car.html` remains the intended permanent URL, but live verification could not be completed because deployment did not occur.
- Live HTTP status: not verified after this attempt because production deployment was blocked.
- Live asset loading result: not verified after this attempt because production deployment was blocked.
- Live CTA destination checks: not verified after this attempt because production deployment was blocked.
- Live console result: not verified after this attempt because production deployment was blocked.
- Live indexing configuration: source remains `noindex, follow`; sitemap exclusion remains confirmed locally.
- SEO validation: passed for 54 HTML files and 50 sitemap URLs.
- HTML validation: previously passed after telephone-label correction; the current `npx html-validate car.html` rerun could not complete because package resolution hung in the network-restricted environment.
- JSON-LD: not applicable; no new structured data was added to this noindex campaign page.
- Internal-link validation: passed; all local `.html` destinations exist.
- Image validation: passed; all nine page image references, including CSS background imagery, resolve locally.
- JavaScript syntax: both inline scripts parsed successfully.
- One H1: confirmed.
- Canonical: one self-reference confirmed.
- Robots: `noindex, follow` confirmed.
- Sitemap exclusion: confirmed.
- Visible placeholders/TODO text: none.
- CTA destinations: estimate hash, telephone, email, and main-site paths verified in source.
- Estimate integration: homepage hash-opening logic confirmed.
- Build result: **BUILD PASSED**. Netlify CLI 36.3.2 completed `netlify build --offline` in production context using the repository's `netlify.toml`. The offline flag disabled account-data retrieval only; this static project has no build command or runtime dependency requiring that account data.
- Desktop 1440 browser QA: blocked. No usable HTTP preview could be opened in the browser from this environment.
- Mobile 390 browser QA: blocked. No usable HTTP preview could be opened in the browser from this environment.
- Mobile 375 browser QA: blocked. No usable HTTP preview could be opened in the browser from this environment.
- Horizontal-overflow and console validation: source-level checks are clean, but rendered confirmation remains blocked until the page is available through an HTTP preview or production URL.
- CTA verification: source destinations are valid. `Send Project Photo` and `Request an Estimate` point to `/#estimate`; the homepage now opens the existing estimate flow for that hash. The telephone uses `tel:+16047732298`, email uses the verified studio address, `View Transformations` targets the existing `#transformations` section, and `Explore Stile di Leo` targets `/`. Rendered click-through verification remains part of the blocked browser gate.
- Indexing verification: `noindex, follow` is present, the canonical self-references `https://stiledileo.com/car.html`, and the URL is not in `sitemap.xml`.
- Defects found during this HTTP-preview QA pass: none in page source. The only blocker is preview/browser access.
- Defects corrected during this HTTP-preview QA pass: none. No page content or layout was changed.

## 10. Remaining Limitations

- Visual breakpoint, rendered CTA, and browser-console validation must be completed on an accessible Netlify preview or after an approved deployment.
- The before/after proof is a combined image rather than an interactive slider because separate verified source frames are unavailable.
- Final suitability and pricing still require project-specific review; the page deliberately makes no universal resurfacing or fireplace-safety promise.

## Production Readiness

The implementation and Netlify build are complete, but QR campaign approval remains blocked until the rendered browser gate can be performed on an HTTP preview or deployed URL.
