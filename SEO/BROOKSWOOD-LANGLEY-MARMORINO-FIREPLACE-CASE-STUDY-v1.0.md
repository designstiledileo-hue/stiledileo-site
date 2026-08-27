# Brookswood Langley Marmorino Fireplace Case Study v1.0

## 1. Project Evidence

Verified project facts used publicly:

- Location: Brookswood, Langley, British Columbia
- Project type: residential fireplace transformation
- Original condition: dated brick fireplace surface
- Preparation/process facts documented in repository: mesh, base coat, primer, leveling / substrate preparation
- Final finish: San Marco Marmorino Antico
- Approximate project duration: about 7 days
- Publication permission: previously documented as approved

Unverified or not used publicly:

- Exact project price
- Exact square footage
- Client name or quote
- Exact project dates
- Structural reconstruction details
- Exact number of coats
- Heat ratings or direct flame suitability claims

## 2. Asset Status

Asset directory:

`images/projects/brookswood-fireplace/`

Minimum publication evidence is present:

- At least one verified BEFORE image: yes
- At least one strong verified AFTER image: yes
- Additional finished imagery: yes
- Process imagery: yes, HEIC originals converted to web-safe JPG derivatives
- Video: no verified MP4 file present

## 3. URL

Chosen URL:

`/brookswood-langley-fireplace-transformation.html`

Reason:

- Consistent with existing flat case-study URL convention used by `/west-vancouver-fireplace-transformation.html`
- Includes both Brookswood and Langley local proof without creating unnecessary directory complexity
- Supports fireplace and Marmorino owner pages without replacing them

## 4. Search Role

This is a project proof page, not a service owner page.

It supports:

- `/fireplace-wall-vancouver.html`
- `/marmorino-vancouver.html`
- `/venetian-plaster-langley.html`

It should not replace the existing owner pages for fireplace transformations, Marmorino, or Venetian plaster.

## 5. Page Architecture

Final sequence:

1. Hero
2. Static Before / After comparison
3. Project story
4. Project details / what changed
5. Preparation and process
6. Finished gallery
7. Marmorino material context
8. Planning notes
9. Fireplace-specific CTA

## 6. Before / After

Implementation decision:

Static Before / After comparison.

Reason:

The before and after images are both verified and strong, but they are not aligned closely enough in camera position, framing, and final geometry for an honest draggable overlay. A static side-by-side comparison preserves authenticity without digitally forcing alignment.

Slider pairing not used:

- BEFORE: `stile-di-leo-brookswood-marmorino-fireplace-before-01.jpg`
- AFTER: `stile-di-leo-brookswood-marmorino-fireplace-after-hero-01.jpg`

## 7. Process Section

Process image order:

1. `stile-di-leo-brookswood-marmorino-fireplace-before-01.jpg` — original brick fireplace
2. `stile-di-leo-brookswood-marmorino-fireplace-process-01.jpg` — prepared surface during substrate/leveling stage
3. `stile-di-leo-brookswood-marmorino-fireplace-process-03.jpg` — intermediate preparation before final finish

Process wording is intentionally concise and avoids exposing proprietary details or presenting the page as a DIY tutorial.

## 8. Gallery

Gallery order:

1. `stile-di-leo-brookswood-marmorino-fireplace-after-hero-01.jpg` — full finished fireplace
2. `stile-di-leo-brookswood-marmorino-fireplace-after-detail-01.JPG` — close botanical relief and texture detail
3. `stile-di-leo-brookswood-marmorino-fireplace-process-05.jpg` — late-stage finish work before completed presentation

## 9. Video

Video status:

No verified Brookswood MP4 file was present in the project directory at implementation time.

Decision:

No public video section was added. Missing video is not a publication blocker because sufficient before/after/process/finished imagery exists.

## 10. Material Context

The page explains Marmorino only in relation to this project:

- replaces joint-heavy brick pattern with a lighter mineral surface
- supports a refined fireplace transformation
- links to the Marmorino owner page for broader material planning

No unsupported material performance, heat rating, or direct flame claims were made.

## 11. Internal Linking

Case study links to:

- `/fireplace-wall-vancouver.html`
- `/marmorino-vancouver.html`
- `/venetian-plaster-langley.html`
- `/#contact`
- `tel:+16047732298`

Contextual links added from:

- `/fireplace-wall-vancouver.html`
- `/marmorino-vancouver.html`
- `/venetian-plaster-langley.html`

## 12. Analytics

Updated `scripts/analytics.js` service context map:

- `/brookswood-langley-fireplace-transformation.html`: `fireplace`

Existing `data-track="send_photo"` and existing analytics event conventions are reused.

No PII is collected by the page script.

## 13. Structured Data

Structured data added:

- `WebPage`
- `BreadcrumbList`
- `Organization`

Structured data not added:

- Review
- AggregateRating
- customer identity
- project price
- street address
- geo coordinates
- exact project dates
- awards

## 14. Performance

Performance treatment:

- Hero image preloaded with `fetchpriority="high"`
- Below-fold images use `loading="lazy"`
- HEIC originals were preserved; web-safe JPG derivatives were created for browser delivery
- Process JPG derivatives resized to 1800px max width
- No third-party slider library added
- No video payload added because no verified Brookswood video exists

## 15. Files Changed

Created:

- `brookswood-langley-fireplace-transformation.html`
- `SEO/BROOKSWOOD-LANGLEY-MARMORINO-FIREPLACE-CASE-STUDY-v1.0.md`
- `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-before-02.jpg`
- `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-process-01.jpg`
- `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-process-02.jpg`
- `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-process-03.jpg`
- `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-process-04.jpg`
- `images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-process-05.jpg`

Modified:

- `scripts/analytics.js`
- `sitemap.xml`
- `fireplace-wall-vancouver.html`
- `marmorino-vancouver.html`
- `venetian-plaster-langley.html`

## 16. Validation

Commands run:

- `node --check scripts/analytics.js`
- `node scripts/seo-validate.js`

Result:

- SEO validation passed for 47 HTML files and 45 sitemap URLs
- Non-blocking warning remains: 100 image dimension opportunities from the existing validator

Page-specific checks:

- One H1: passed
- Self-canonical: passed
- OG URL: passed
- Robots index/follow: passed
- Sitemap entry: passed
- No West Vancouver or unrelated substitute project assets: passed
- No video section without verified video: passed

Browser QA:

- 1440px: no horizontal overflow, no broken images, CTA visible, process/gallery/before-after visible, no console errors
- 390px: no horizontal overflow, no broken images, CTA visible, process/gallery/before-after visible, no console errors
- 375px: no horizontal overflow, no broken images, CTA visible, process/gallery/before-after visible, no console errors

## 17. Human-Review Notes

Full public copy:

Hero:

Brookswood Fireplace Transformation

A dated brick fireplace was prepared and transformed into a lighter architectural focal point with San Marco Marmorino Antico.

Before / After:

The photographs show the real transformation without forced alignment: dated brick, then the completed light Marmorino fireplace.

Project Story:

The Brookswood fireplace began as a dated brick surface with a strong joint pattern and visual weight. The goal was to create a lighter focal point while keeping the fireplace as an architectural anchor in the room.

Before the final finish, the brick required preparation so the new surface could read as one continuous form. Project records document mesh, base coat, primer, leveling, and substrate preparation before the San Marco Marmorino Antico finish was completed.

The finished fireplace has a softer mineral surface, raised botanical detailing, and a brighter presence while preserving the original fireplace opening and overall focal-wall role.

Project Details:

Brookswood, Langley, British Columbia. Residential fireplace transformation. Original finish: dated brick. Final finish: San Marco Marmorino Antico. Approximate duration: 7 days.

What Changed:

The brick pattern was replaced by a quieter continuous plaster surface. The final fireplace became lighter and more refined without a generic painted-brick look. Hand-applied texture and raised botanical relief give the surface detail under light.

Preparation & Process:

This project included documented preparation before the decorative plaster finish. The photos below show real intermediate stages, not a tutorial or a simplified coating claim.

Finished Project Gallery:

The finished photography shows the completed surface from the full fireplace view through closer details of texture, botanical relief, and light.

Material Context:

Marmorino was appropriate for this project because the objective was to move away from exposed brick while keeping the fireplace substantial and architectural. The finish replaced the joint-heavy brick pattern with a lighter mineral surface and a more refined hand-finished character.

For broader material planning, the Marmorino Vancouver page explains where this decorative plaster direction fits within fireplace walls, feature surfaces, and refined residential interiors.

If your project starts with brick, tile, or another existing fireplace surface, suitability depends on the substrate, fireplace system, clearances, construction condition, and scope. The surface should be reviewed before a finish direction is confirmed.

Planning Notes:

Some existing fireplace surfaces can be transformed without rebuilding the entire wall, but the right approach depends on the current finish, the condition below it, the fireplace type, and the visual goal.

For broader fireplace planning, visit Fireplace Transformations Vancouver. For local plaster planning in the area, see Venetian Plaster Langley.

CTA:

Planning a fireplace transformation?

Send a photo of your existing fireplace, approximate dimensions, and your city. Stile di Leo can review the surface and discuss realistic finish directions.

## 18. Deployment Status

Local implementation only.

No push to GitHub.

No Netlify deployment triggered.

Remaining blockers:

None for human review. Optional future enhancement: add a verified Brookswood project video if supplied later.
