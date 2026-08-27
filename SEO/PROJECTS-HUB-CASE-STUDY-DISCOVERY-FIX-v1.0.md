# Projects Hub & Case-Study Discovery Fix v1.0

## 1. Current Architecture
- Homepage featured block now showcases the Brookswood fireplace transformation with an interactive before/after comparison.
- Homepage project section surfaces three real case studies, but primary navigation still pointed to the in-page `#projects` section.
- Blog navigation and footer also pointed to `/#projects` rather than a durable portfolio destination.
- Real case-study pages existed but did not provide a clear route back to a central projects hub.
- No dedicated `projects.html` page existed before this sprint.

## 2. Root Cause
Project discovery was split between a homepage section and individual case-study URLs. Users could view cards from the homepage, but there was no permanent portfolio hub for navigation, sitemap discovery, or reciprocal case-study browsing.

## 3. Chosen Architecture
Create `/projects.html` as the stable Projects hub and keep the homepage project section as a preview/entry point.

## 4. Final Projects Hub URL
`https://stiledileo.com/projects.html`

## 5. Projects Hub Role
A curated discovery page for verified Stile di Leo case studies, supporting commercial service pages without replacing them.

## 6. Projects Included
1. Brookswood Fireplace Transformation
2. West Vancouver Fireplace Transformation
3. Hand-Sculpted Architectural Stone Feature

## 7. Project Order
- Brookswood is first because it is the strongest current homepage proof asset and has a clear before/after transformation story.
- West Vancouver follows as a refined Marmorino fireplace project.
- Sculpted Stone follows as a distinct custom architectural feature case study.

## 8. Homepage Integration
- Desktop Projects navigation now points to `/projects.html`.
- Hero `View Projects` CTA now points to `/projects.html`.
- Mobile hero Projects link now points to `/projects.html`.
- Featured block `View All Projects` now points to `/projects.html`.
- Existing homepage project section remains in place as a preview.

## 9. Homepage Featured Project
The existing Brookswood interactive before/after slider was preserved. No slider rebuild was performed.

## 10. Case-Study Discovery Links
Each approved case-study page now includes Projects in visible navigation and breadcrumbs:
- `/west-vancouver-fireplace-transformation.html`
- `/brookswood-langley-fireplace-transformation.html`
- `/custom-architectural-rock-installation.html`

## 11. Case-Study Breadcrumb Schema
Breadcrumb JSON-LD was updated so Projects appears between Home and the relevant service cluster.

## 12. Blog Navigation
`blog.html` Projects navigation and footer link now point to `/projects.html`.

## 13. Footer / Navigation Handling
Global shared footer code was not present. Only the affected static page links were updated.

## 14. Sitemap
Added canonical sitemap entry:
`https://stiledileo.com/projects.html`

Lastmod: `2026-08-27`

## 15. Projects Hub SEO
- One title.
- One meta description.
- One H1.
- One canonical.
- One matching `og:url`.
- Robots: `index, follow`.
- JSON-LD includes WebPage, BreadcrumbList, and Organization.

## 16. Internal-Link Map
- Homepage → Projects hub.
- Blog → Projects hub.
- Projects hub → Brookswood case study.
- Projects hub → West Vancouver case study.
- Projects hub → Sculpted Stone case study.
- Projects hub → Fireplace, Marmorino, Feature Wall service pages.
- Case studies → Projects hub.
- Case studies → relevant service owner pages.

## 17. CTA Architecture
Projects hub CTA: `Have a wall or fireplace in mind?` with `Send Project Photos` and phone action.

## 18. Design Scope
No site redesign was performed. The new Projects page uses the existing dark, restrained Stile di Leo visual language.

## 19. Project Card Model
Each card includes:
- real project image;
- project title;
- location/material context where verified;
- concise transformation line;
- visible `View Project` action.

## 20. Accessibility
- Projects hub uses semantic headings.
- Project cards have descriptive aria labels.
- Images include descriptive alt text.
- Touch targets use existing large button/card patterns.

## 21. Validation Results
- `node --check scripts/analytics.js`: passed.
- `node scripts/seo-validate.js`: passed for 48 HTML files and 46 sitemap URLs.
- Scoped internal link/image validation for affected files: passed.
- JSON-LD parsing for Projects and case-study pages: passed.
- Sitemap XML validation: 46 URLs, 46 unique URLs, Projects hub present.
- Local HTTP check for `/projects.html`: HTTP 200, 13,926 bytes.

## 22. Browser QA
- Local HTTP preview confirmed `/projects.html` returns 200.
- Headless Chrome viewport screenshots were attempted, but local Chrome hung once and macOS lacked GNU `timeout` for safe timed retries.
- Source-level responsive rules were verified for desktop and mobile breakpoints.
- No rendered browser defect was confirmed.

## 23. Known Non-Blocking Warnings
Repository SEO validator reports 88 non-blocking image dimension opportunities across the site. This sprint did not alter global image-dimension policy.

## 24. Files Changed
- `projects.html`
- `index.html`
- `blog.html`
- `west-vancouver-fireplace-transformation.html`
- `brookswood-langley-fireplace-transformation.html`
- `custom-architectural-rock-installation.html`
- `sitemap.xml`
- `SEO/PROJECTS-HUB-CASE-STUDY-DISCOVERY-FIX-v1.0.md`

## 25. Deployment Status
Not pushed. Not deployed. Ready for human review.
