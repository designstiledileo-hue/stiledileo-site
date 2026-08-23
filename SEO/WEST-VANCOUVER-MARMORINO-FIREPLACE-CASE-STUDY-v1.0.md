# West Vancouver Marmorino Fireplace Case Study v1.0

## 1. Verified Project Facts

- Business: Stile di Leo
- Location: West Vancouver, British Columbia
- Project type: residential fireplace transformation
- Original condition: dark large-format tiled fireplace
- Final finish: light Marmorino decorative plaster
- Public story: dark tile to light Marmorino fireplace transformation
- Excluded story: no gold-vein version is shown or mentioned

## 2. Assets Selected

All selected assets come from the approved West Vancouver project asset set and were normalized into:

`images/projects/west-vancouver-fireplace/`

Selected assets:

- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-before-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-hero-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-front-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-detail-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-video-01.mp4`

## 3. Assets Excluded

- No gold-vein assets were used.
- No unrelated fireplace images were used.
- No stock imagery was used.
- No AI-generated or AI-altered project imagery was used.
- `.DS_Store` files and malformed ingest folders were not referenced by the page.

## 4. Chosen URL

`/west-vancouver-fireplace-transformation.html`

Rationale: the repository uses root-level static `.html` URLs for production pages. The chosen URL is descriptive, stable, and supports the project-proof role without competing directly with the fireplace or Marmorino owner pages.

## 5. Search Role

This page is a project-proof case study. It supports, but does not replace:

- `/fireplace-wall-vancouver.html`
- `/marmorino-vancouver.html`
- `/venetian-plaster-vancouver.html`

Natural concepts supported:

- West Vancouver fireplace transformation
- Marmorino fireplace
- tile fireplace transformation
- decorative plaster fireplace
- seamless fireplace finish

## 6. Page Architecture

Final page sequence:

1. Sticky brand header
2. Hero with finished project proof image
3. Interactive Before / After comparison
4. Project story
5. Factual change summary
6. Finished project gallery
7. Marmorino context section
8. Real project video section
9. Planning notes
10. Fireplace-specific CTA

## 7. Before / After Implementation

The comparison slider uses:

- Before image: `stile-di-leo-west-vancouver-marmorino-fireplace-before-01.jpg`
- After image: `stile-di-leo-west-vancouver-marmorino-fireplace-after-front-01.jpg`

Implementation details:

- Vanilla JavaScript only
- Mouse/pointer interaction where supported
- Keyboard arrow support
- ARIA slider attributes
- Visible BEFORE / AFTER labels
- Static `<noscript>` fallback with before and after figures

## 8. Gallery Implementation

Gallery order:

1. After hero/context image
2. After front image
3. After detail/side texture image

The gallery is intentionally concise and focuses on craft plus interior context rather than becoming a generic portfolio grid.

## 9. Video Implementation

Video included:

`images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-video-01.mp4`

Verified metadata:

- 720 × 1280
- 19.512 seconds

Implementation:

- Native `<video>` element
- Controls enabled
- `playsinline`
- `preload="metadata"`
- Poster image from the finished front view
- No autoplay with sound

## 10. Internal Linking

Links from the case study:

- `/fireplace-wall-vancouver.html`
- `/marmorino-vancouver.html`
- `/#contact`
- `tel:+16047732298`

Contextual links added to owner pages:

- `fireplace-wall-vancouver.html` links to `/west-vancouver-fireplace-transformation.html`
- `marmorino-vancouver.html` links to `/west-vancouver-fireplace-transformation.html`

## 11. Structured Data

Added factual JSON-LD only:

- `WebPage`
- `BreadcrumbList`
- `Organization`
- `ImageObject` as the primary page image

No fabricated review, aggregate rating, customer name, price, project date, address, geo coordinates, awards, or unverifiable construction details were added.

## 12. Analytics

The page follows the existing GROWTH-002 pattern:

- GA4 loader uses the existing measurement ID
- Shared `/scripts/analytics.js` remains the event layer
- CTA links use existing `data-track` conventions
- The case-study path was added to `serviceByPath` as `fireplace`
- Before/after interaction sends `before_after_interaction` through `window.StileAnalytics` when available

No PII is collected by the case-study script.

## 13. Performance Treatment

- Hero/fetchpriority image is preloaded and not lazy-loaded.
- Below-fold gallery images use `loading="lazy"`.
- Image width/height attributes are present.
- Video uses metadata preload only.
- No third-party slider library was added.
- CSS and JavaScript are page-local and minimal.

## 14. Files Changed

Created:

- `west-vancouver-fireplace-transformation.html`
- `SEO/WEST-VANCOUVER-MARMORINO-FIREPLACE-CASE-STUDY-v1.0.md`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-before-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-hero-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-front-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-detail-01.jpg`
- `images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-video-01.mp4`

Updated:

- `fireplace-wall-vancouver.html`
- `marmorino-vancouver.html`
- `scripts/analytics.js`
- `sitemap.xml`

## 15. Validation Results

Repository validation:

- `node --check scripts/analytics.js`: passed
- `node scripts/seo-validate.js`: passed for 45 HTML files and 43 sitemap URLs
- Targeted one-H1 check: passed
- Targeted canonical check: passed
- Targeted robots check: passed
- Targeted OG URL check: passed
- Targeted sitemap check: passed
- Targeted local-reference check: passed

Non-blocking validator output:

- 100 image dimension opportunities reported sitewide by the existing validator. These are warnings, not blocking errors.

## 16. Screenshots / Render QA

HTTP preview URL used:

`http://127.0.0.1:4177/west-vancouver-fireplace-transformation.html`

Desktop 1440 px:

- No horizontal overflow
- One H1
- Hero visible
- Before/after component visible
- CTA visible
- Video present

Mobile 390 px:

- No horizontal overflow
- One H1
- Hero visible
- Before/after component visible at 352 × 440
- CTA visible
- Video present

Mobile 375 px:

- No horizontal overflow
- One H1
- Hero visible
- Before/after component visible at 344 × 430
- CTA visible
- Video present

Full-page image QA:

- All referenced project images loaded successfully after scrolling.
- Natural dimensions were returned for all project images.

Slider QA:

- Keyboard interaction passed.
- Slider ARIA value changed from 50 to 55 on ArrowRight.
- Clip path updated accordingly.

Console QA:

- No console errors found after rendered page and slider QA.

## 17. Remaining Human Inputs

- Human review should confirm the before/after pairing is visually credible enough despite different original camera framing.
- Human review should confirm whether the temporary malformed ingest directory with a leading space should be removed in a later cleanup.

## 18. Final Editorial Patch

Applied final editorial corrections:

- Removed visible “Proof Before Copy” text.
- Replaced “What remains factual” with “Project Details”.
- Added exact visible project details: West Vancouver, residential fireplace transformation, dark large-format tile, light Marmorino.
- Removed unsupported “lime-based” wording from the visible page.
- Tightened the project story to verified facts only.
- Confirmed `after-detail-02` is not used in the visible gallery.

## 19. Deployment Status

Not deployed.

No push to main was performed.

No Netlify deployment was triggered.
