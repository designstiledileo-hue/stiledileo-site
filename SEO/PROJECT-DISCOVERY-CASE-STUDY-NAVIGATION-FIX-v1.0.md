# Project Discovery & Case-Study Navigation Fix v1.0

## 1. Current Navigation Problem

The homepage navigation already linked to `#projects`, and the hero button `View Projects` also pointed to the same homepage section. However, the Projects section was mostly a curated visual portfolio grid with image-led tiles. The real case-study pages existed in the repository, but a normal visitor could not reliably discover them from the homepage Projects journey.

## 2. Root Cause

- `Projects` linked to the homepage section `#projects`.
- The section used project-style image tiles, but most did not link to real case-study pages.
- Real case-study URLs were discoverable mainly through direct URL, sitemap, or scattered contextual service-page links.
- Mobile users could see project visuals, but not all proof pages were obvious as tappable case studies.
- There was no central proof module clearly communicating real project pages.

## 3. Chosen Architecture

Option C was selected:

Use the existing homepage `#projects` section as the main project-preview proof hub.

Reason:

- Existing navigation already points to `#projects`.
- No new projects page was necessary for the current number of approved case studies.
- This avoids creating extra architecture before there are enough real case studies for a dedicated portfolio page.
- The normal journey is now: Home → Projects → Real Case Studies → Service Page / CTA.

## 4. Homepage Changes

Changed the homepage Projects section from a broad curated image grid into a real project proof module.

Updated section framing:

- Eyebrow: `Real Project Proof`
- Heading: `Completed transformations with project details`
- Supporting copy: `A focused set of real Stile di Leo projects showing fireplace transformations, Marmorino finishes, and sculptural feature surfaces across the Lower Mainland.`

Added visible linked case-study cards with `View Project` labels.

Removed the prior large set of generic/non-case-study project tiles from the homepage Projects section.

## 5. Projects Page / Hub Changes

No dedicated Projects page was created.

Reason:

The existing homepage section is sufficient as the current proof hub. A dedicated `/projects.html` or `/portfolio.html` page may become appropriate after more approved case studies are available.

## 6. Exact Project List

Included real case-study pages:

1. Brookswood Fireplace Transformation
2. West Vancouver Fireplace Transformation
3. Hand-Sculpted Architectural Stone Feature

Excluded from homepage case-study cards:

- Generic fireplace/finish image tiles without approved case-study pages
- Unverified project names/locations
- Decorative image-only portfolio items

## 7. Exact Card Copy

### Brookswood Fireplace Transformation

Location / finish:

`Brookswood, Langley BC / Marmorino`

Summary:

`Dated brick prepared and transformed into a light San Marco Marmorino Antico fireplace.`

CTA:

`View Project`

Destination:

`/brookswood-langley-fireplace-transformation.html`

### West Vancouver Fireplace Transformation

Location / finish:

`West Vancouver, BC / Marmorino`

Summary:

`Dark large-format tile transformed into a lighter seamless Marmorino fireplace finish.`

CTA:

`View Project`

Destination:

`/west-vancouver-fireplace-transformation.html`

### Hand-Sculpted Architectural Stone Feature

Location / finish:

`Custom Interior Feature / Sculptural Surface`

Summary:

`Hand-shaped relief, integrated moss, and ambient lighting for a custom interior feature.`

CTA:

`View Project`

Destination:

`/custom-architectural-rock-installation.html`

## 8. Exact Destinations

- `/brookswood-langley-fireplace-transformation.html`
- `/west-vancouver-fireplace-transformation.html`
- `/custom-architectural-rock-installation.html`
- `#contact` for project-photo CTA

## 9. Internal-Link Graph

Current graph after fix:

Homepage:

- `/#projects` exposes all three real case-study cards.
- Each case-study card links directly to its project page.

Case studies:

- Brookswood links to `/fireplace-wall-vancouver.html`, `/marmorino-vancouver.html`, `/venetian-plaster-langley.html`, and `/#contact`.
- West Vancouver links to `/fireplace-wall-vancouver.html`, `/marmorino-vancouver.html`, and `/#contact`.
- Sculpted stone links to `/feature-wall-vancouver.html` and `/#contact`.

Service pages:

- `/fireplace-wall-vancouver.html` links to West Vancouver and Brookswood proof.
- `/marmorino-vancouver.html` links to West Vancouver and Brookswood proof.
- `/venetian-plaster-langley.html` links to Brookswood proof.
- `/feature-wall-vancouver.html` links to sculptural feature proof.

## 10. Navigation Changes

No navigation URL change was required.

Existing homepage navigation remains:

- Desktop nav `Projects` → `#projects`
- Hero `View Projects` → `#projects`
- Mobile/hero project path remains the same homepage anchor destination

The destination now contains real linked case-study cards instead of image-only portfolio tiles.

## 11. Analytics Changes

Updated homepage project cards with:

`data-track="project_photo"`

Updated `scripts/analytics.js` so `data-track="project_photo"` maps to the existing event:

`project_photo_click`

No new analytics event semantics were created.

## 12. Files Changed

Modified:

- `index.html`
- `scripts/analytics.js`

Created:

- `SEO/PROJECT-DISCOVERY-CASE-STUDY-NAVIGATION-FIX-v1.0.md`

Existing pending case-study files remain part of the broader local working tree and were not pushed/deployed in this sprint.

## 13. Validation

Commands run:

- `node --check scripts/analytics.js`
- `node scripts/seo-validate.js`

Result:

- SEO validation passed for 47 HTML files and 45 sitemap URLs.
- Remaining validator warning: 89 non-blocking image dimension opportunities.

Project destination checks:

- `/brookswood-langley-fireplace-transformation.html` → local HTTP 200
- `/west-vancouver-fireplace-transformation.html` → local HTTP 200
- `/custom-architectural-rock-installation.html` → local HTTP 200

## 14. Desktop QA

1440px homepage `#projects` QA:

- Projects section visible: yes
- Linked project card count: 3
- Visible linked project card count: 3
- Visible `View Project` count: 3
- Broken images: 0
- Horizontal overflow: no
- Console errors: 0

## 15. Mobile QA

390px homepage `#projects` QA:

- Projects section visible: yes
- Linked project card count: 3
- Visible linked project card count: 3
- Visible `View Project` count: 3
- Broken images: 0
- Horizontal overflow: no
- Console errors: 0

375px homepage `#projects` QA:

- Projects section visible: yes
- Linked project card count: 3
- Visible linked project card count: 3
- Visible `View Project` count: 3
- Broken images: 0
- Horizontal overflow: no
- Console errors: 0

## 16. Projects Intentionally Excluded

Excluded:

- Black Marble Fireplace
- Golden Veins Wall
- Spa-Inspired Plaster
- Black Vein Fireplace
- Architectural Fireplace Wall
- White Marble Fireplace
- Soft Grey Marble Wall
- Blue Vein Marble Wall
- Decorative Ceiling

Reason:

These may be valid portfolio visuals, but they do not currently have approved case-study pages with public project proof. The repair sprint prioritizes real project case studies over generic image tiles.

## 17. Deployment Status

Local implementation only.

No push to GitHub.

No Netlify deployment triggered.
