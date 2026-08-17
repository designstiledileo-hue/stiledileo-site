# STILE DI LEO - MARMORINO ROUTING HOTFIX v1.0

Repository: /Users/vladyslavdementiev/Documents/GitHub/stiledileo-site
Branch: main

## Findings

The canonical repository does not contain `marmorino-vancouver.html`.

Checked:

- Current working tree: no `marmorino-vancouver.html` file.
- `rg --files`: no Marmorino HTML page.
- Git history for `*marmorino*`: only `images/car-marmorino.jpg` is present.
- Git history for `marmorino-vancouver`: found prior internal-link text, but no historical page file to restore.

## Routing Cause

`netlify.toml` contains a catch-all homepage rewrite before the clean-URL `.html` redirect:

- `/*` -> `/index.html` with status `200`
- then `/*` -> `/:splat.html` with status `301`

Because the homepage rewrite appears first, unknown URLs such as `/marmorino-vancouver` can render the homepage. Because `marmorino-vancouver.html` does not exist, the `.html` URL cannot return an actual Marmorino page.

## Inspected

- `netlify.toml`: catch-all homepage fallback masks missing pages before clean-URL redirect.
- `_redirects`: no `_redirects` file present.
- Redirect/rewrite rules: no Marmorino-specific redirect exists.
- Canonical tags: no Marmorino page exists, so no self-canonical can be verified.
- Sitemap: no `https://stiledileo.com/marmorino-vancouver.html` entry exists.
- Internal links: current `car.html` routes the Marmorino card to `/venetian-plaster-vancouver.html`; historical commit `815f562` linked it to `/marmorino-vancouver.html`.

## Blocker

The requested expected behavior requires an actual canonical page at:

`/marmorino-vancouver.html`

That page is not present in the repository and cannot be restored from git history. Creating a new Marmorino service page would be new content/page creation, not a routing-only hotfix.

## Status

Blocked pending approved Marmorino page source/content or explicit approval to create a new canonical Marmorino page.
