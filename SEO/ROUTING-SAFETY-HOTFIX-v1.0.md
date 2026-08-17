# STILE DI LEO - ROUTING SAFETY HOTFIX v1.0

Repository: /Users/vladyslavdementiev/Documents/GitHub/stiledileo-site
Branch: main

## Scope

Routing-only safety hotfix for `netlify.toml`.

No content pages were redesigned or rewritten. No `marmorino-vancouver.html` page was created.

## Redirect / Rewrite Rules Inspected

Existing legitimate rules preserved:

- `/admin/*` -> `/admin/:splat` with status `200`
- `/admin` -> `/admin/index.html` with status `200`
- `/venetian-plaster-cost-per-sq-ft-vancouver` -> `/venetian-plaster-cost-per-sq-ft-vancouver.html` with status `301`
- `/venetian-plaster-durability-vancouver` -> `/venetian-plaster-durability-vancouver.html` with status `301`
- `/venetian-plaster-maintenance-vancouver` -> `/venetian-plaster-maintenance-vancouver.html` with status `301`
- `/*` -> `/:splat.html` with status `301` for non-`.html` paths

## Change Made

Removed the homepage catch-all rewrite:

- `/*` -> `/index.html` with status `200`

## Reason

The homepage catch-all appeared before the clean-URL `.html` redirect and could cause unknown URLs to render the homepage with a `200` response.

After this hotfix, unknown URLs are no longer intentionally rewritten to `/index.html`.

## Expected Behavior

- `/venetian-plaster-vancouver` -> `301` -> `/venetian-plaster-vancouver.html`
- `/venetian-plaster-vancouver.html` -> `200`
- `/definitely-not-a-real-page` -> not homepage; clean redirect target does not exist and should resolve to not-found behavior
- `/marmorino-vancouver` -> not homepage; clean redirect target does not exist and should resolve to not-found behavior
- `/marmorino-vancouver.html` -> not homepage; file does not exist and should resolve to not-found behavior

## Validation

- SEO validator: passed.
- Internal-link validation: passed.
- Broken-link validation: passed.
- Broken-image validation: passed.
- Sitemap validation: passed.
- Canonical validation: passed.
- Clean URL simulation: existing HTML pages redirect to `.html` targets.
- Missing URL simulation: nonexistent paths do not resolve to homepage.
- Redirect loop check: passed.

## Files Changed

- `netlify.toml`
- `SEO/ROUTING-SAFETY-HOTFIX-v1.0.md`
