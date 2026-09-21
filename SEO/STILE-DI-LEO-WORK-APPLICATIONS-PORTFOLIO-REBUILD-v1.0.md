# Selected Work & Applications — implementation v1.0

## Safety and scope

Starting main and fetched origin/main: `e3d55f17709baf6ef01495c63e2af541af8420aa`.
Clean working tree; ahead 0 / behind 0. No unpublished commits at task start.
All existing history preserved. One new portfolio commit; normal push only.

## Architecture and truthfulness

Previous destination: three completed-project cards under Projects. New destination: editorial Selected Work followed by a distinct Applications & Finish Directions panel. Physical page, canonical and routing remain `/projects.html`; no work.html or new redirects.

Verified Selected Work: Brookswood fireplace (lead portrait), West Vancouver fireplace (approved light Marmorino imagery), White Rock custom plaster range hood (real completed project linked to range-hood page), hand-sculpted architectural stone (dry interior, relief/moss/lighting only). All photographs reused; no invented project provenance or new media.

Applications: Marmorino for Retail Interiors is explicitly **Application · Commercial Interiors**, never a completed client project. Existing optimized retail WebP and approved supporting line retained. Three restrained text cards link to Venetian Plaster, Marmorino and Feature Walls. Secondary text links cover fireplace finishes and microcement for selected dry interior walls. No shower/bath positioning or Tadelakt.

## Navigation and homepage

Portfolio navigation and relevant breadcrumbs say Work. Homepage desktop/mobile links say Work; hero says View Selected Work; featured cross-link says Explore the Work. Only four homepage link labels changed. Brookswood, retail feature, range-hood discovery, comparison slider, forms and analytics remain intact. Case study changes are portfolio navigation/breadcrumb labels only; no case study rewrites.

## SEO, assets and analytics

Title/description/H1 now describe selected work and applications. CollectionPage schema reflects the collection; existing factual organization data and primary image retained. No client/project claims added to schema. Canonical remains https://stiledileo.com/projects.html. Sitemap and Netlify routing untouched. Existing project_photo tracking reused for collection destinations; analytics source unchanged. Explicit image dimensions, priority lead image and lazy-loaded lower imagery; no duplicated image binaries.

## Discoverability after implementation

YES = clear on-page destination; LIMITED = indirect path or low prominence; NO = absent. Navigation offers Work/Finishes rather than individual named service menu entries, so offer-level navigation remains LIMITED. All eight have a path through Work.

| Offer | Homepage | Primary/mobile navigation | Work |
|---|---|---|---|
| Venetian Plaster | LIMITED | LIMITED | YES |
| Marmorino | LIMITED | LIMITED | YES |
| Fireplace Transformations | YES | LIMITED | YES |
| Feature Walls | LIMITED | LIMITED | YES |
| Plaster Range Hoods | YES | LIMITED | YES |
| Microcement | NO | LIMITED | LIMITED |
| Sculpted / Architectural Stone | YES | LIMITED | YES |
| Marmorino Retail / Commercial | YES | LIMITED | YES |

Microcement is deliberately a secondary dry-interior link, not a dominant card. No broader discovery redesign performed.

## QA completed before commit

- Playwright Chrome at 375, 390 and 1440 px: four verified works, separate applications, images decoded, correct H1/canonical, local destination links 200, no horizontal overflow or JavaScript exceptions.
- Rendered full-page screenshots inspected at desktop and mobile: clear hierarchy, intact image framing, readable text, distinct applications and accessible CTA.
- Existing range-hood discovery regression at all three widths: Finishes link, hood destination, retail feature, photo-intake modal, keyboard comparison slider and show-more textures PASS.
- `node --check scripts/analytics.js`: PASS.
- `node scripts/seo-validate.js`: PASS, 50 HTML files / 48 sitemap URLs. Same 88 historical nonblocking dimension warnings; no new errors.
- `npx netlify build --offline`: PASS; existing functions and edge function bundled. No hosting configuration changed.
- `git diff --check`: PASS. Full source/diff reviewed; all changes limited to portfolio, navigation and this report.
- Temporary QA scripts/screenshots and Netlify local build artifacts excluded from commit. No Finder metadata, supplied PNG originals or unrelated files added.

## Exact changed files

- projects.html
- index.html
- blog.html
- brookswood-langley-fireplace-transformation.html
- west-vancouver-fireplace-transformation.html
- custom-architectural-rock-installation.html
- plaster-range-hood-vancouver.html
- marmorino-retail-interiors.html
- marmorino-vancouver.html
- fireplace-wall-vancouver.html
- SEO/STILE-DI-LEO-WORK-APPLICATIONS-PORTFOLIO-REBUILD-v1.0.md

## Release verification

Production checks follow the normal GitHub main → existing Netlify deployment: projects.html and homepage, existing clean redirect, card destinations, all five reused portfolio images, mobile/desktop navigation and preserved homepage interactions. Actual post-push outcome is reported in the task handoff, not assumed here.

## Remaining recommendations

No blocking changes identified. Historical image-dimension opportunities and broader offer-level navigation may be considered separately; neither is part of this rebuild.
