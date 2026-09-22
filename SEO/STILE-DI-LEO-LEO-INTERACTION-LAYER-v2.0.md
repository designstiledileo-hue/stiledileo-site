# Leo Interaction Layer v2.0 — local owner review

## Status and scope

INTERACTION INTEGRATION READY

FINAL VISIBLE LEO ASSET NOT YET PROVIDED

Starting branch: `main`. Starting HEAD: `a7b4d13e1b0c26eced51ac2d9ee8321ee34b85b4`.
No commit, push or deployment was performed for this task. Production continues to show
the existing **Ask about your project** Finish Advisor; it does not display Leo.
The local owner-review version uses **Ask Leo**, retaining the panel's explicit AI label.

The production friendly endpoint returned HTTP 200 with a substantive structured answer
before editing. The backend, prompts, pricing, knowledge, routing, analytics implementation,
attribution, image processing and form submission behavior were not changed.

### Existing unrelated working-tree difference

`netlify.toml` already had an uncommitted removal of the six-line Advisor rewrite at task
start. This difference belongs to existing owner work, is outside this task, and has been
preserved exactly. It is not part of the Leo change list. It should not accidentally be
included in a future Leo release. No unrelated defect was repaired.

## Asset audit

LEO PRODUCTION ASSET: **NO**.

Repository media inventory, character/mascot/approval references, and animation-format
searches found no approved Leo illustration or animation. No `.riv`, `.lottie`, character
Lottie JSON, animated character WebP/AVIF, transparent character video, or character sprite
sequence was identified. The existing WebP files are retail-interior photographs. Existing
MP4s are project, craft/process and marketing footage. Existing business imagery and branding
are not Leo character assets.

Actual format, dimensions, file size, supported motions, transparency and responsive asset
suitability: **not applicable — no final asset**. No cat artwork, emoji, logo animation,
stock character, placeholder drawing, decoder or animation library has been added.

## Architecture

The Advisor creates its fully functional native dialog first. It loads the small optional
`leo-interaction.js` asynchronously afterward. A failed script request leaves the Advisor
usable. There is no wait before opening: `showModal()` executes before the visual hook in
the same click handler. Existing focus, Escape and event tracking remain in place.

Two separate state concepts:

- Panel: `OPEN` / `CLOSED`, read from the existing dialog.
- Visual: `HIDDEN` / `PEEK` / `REACT` / `INSPECT`.

Cooldown, timeout, cancellation, availability and destruction flags are independent of
visual states. `window.StileLeo.init(root, adapter)` is guarded by a WeakMap; repeated calls
return the existing controller. Repeated script execution also has a guard. `destroy()`
clears timers, disconnects the observer, removes listeners through AbortController, destroys
the adapter and removes its optional host. Reinitialization does not repeat an introduction.

### Small visual adapter contract

The default adapter has `ready: false` and no-op lifecycle methods. **It creates no character
element, no empty visible container, and schedules no autonomous animation.**

A future approved asset adapter may provide:

```js
{
  ready: true,
  showPeek(host),
  showReact(host),
  showInspect(host),
  hide(),
  destroy()
}
```

Playback methods must begin synchronously and return `true` only when real playback begins.
An absent method, false result or thrown exception leaves the visual hidden. Asset loading
and format selection belong to the eventual asset integration, outside the panel-opening
path. The final adapter should be supplied at initialization once ready. No format has been
selected. This contract is not a claim that artwork, expressions or playback exist.

## Session and interruption behavior

An available adapter may schedule one nine-second introductory delay. It requires visible,
focused desktop context, no conflicting UI, enough clear space and optional storage access.
The session marker `stile_leo_intro_seen = true` is written synchronously at the playback
start boundary, before invoking the ready adapter. A failed start also consumes that attempt
conservatively, while emitting no analytics event. A storage write failure prevents playback.
Navigation and reload in the same tab cannot replay a successful introduction. A new tab
session/browser context is independently eligible. No adapter means no marker is written.

Read/write storage failure disables autonomous behavior for the runtime. Cancellation never
reschedules an interrupted introduction. An unstarted cancelled delay does not claim that a
peek was shown; it is suppressed for the remaining runtime. The successful-start marker
persists across pages. There is no retry loop.

Open Advisor, open inquiry/blocking dialog, typing, window blur, hidden document, pagehide,
reduced motion, insufficient space, destroy or component removal cancel motion. Native
dialogs, visible ARIA modal elements, the current inquiry modal and an optional
`data-leo-blocking-overlay` marker are detected. No currently separate cookie modal or
hamburger overlay was found on the audited homepage; its mobile navigation uses existing
links. Future nonsemantic blocking UI can use that explicit marker.

Desktop pointer entry can trigger one short reaction, with a 20-second cooldown. Touch does
not depend on hover. Motion is never driven frame-by-frame by pointer movement. Interaction
with the launcher cancels a scheduled autonomous introduction.

## Photo request hook

Selecting or preparing a photo emits no inspection hook. Calling the existing `fetch()`
with a photo request emits `photo-sent` immediately after dispatch; response parsing and
loading remain unchanged. At most one 2.4-second inspection is allowed. Settling, error,
clear/cancel or panel close hides it. It never loops for the response duration. No image,
message, response or customer details are passed to the visual layer.

## Layout, accessibility and reduced motion

- Character visuals are suppressed at all widths below 768px, including 375 and 390.
  Those layouts keep the static Ask Leo button and current photo CTA separation.
- A potential desktop host is at most 144 × 160 CSS pixels, above the launcher for
  peek/reaction or to the left of the dialog for inspection. Offscreen placement, intersections
  with visible controls or image/video elements suppress playback. Resize/scroll rechecks space.
- Host is fixed, out of document flow, `inert`, `aria-hidden="true"` and
  `pointer-events: none`, including descendants. It cannot receive focus or clicks.
- The existing safe-area bottom placement is retained; desktop right inset also respects the
  safe-area value. Fixed controls were checked geometrically and visually, not only by inset.
- Reduced motion suppresses every character interaction and cancels an active one. The same
  static button operates the same Advisor. No decorative screen-reader announcements exist.
- The established fixed launcher can pass over scrolling page copy, as it already did before
  this task. No additional mobile character area is introduced; character suppression is
  deliberately conservative. Real asset collision and framing review remains outstanding.

## Performance and analytics

No artwork request, preload, Rive/Lottie dependency or continuous animation loop exists.
The controller is roughly 8 KB uncompressed. Visual placement reserves no document space.
After an asset is approved, load it in a post-load idle phase or intentional interaction,
then supply the ready adapter. Do not delay panel opening while loading it.

The only new permitted event is `leo_peek_shown`, through the unchanged site analytics
helper. It fires only when the autonomous ready-adapter call confirms playback began.
There are no new hover, reaction, inspect or per-frame analytics events. Without an asset,
there is no `leo_peek_shown` event. All existing Finish Advisor events remain unchanged.

## Actual QA results

### Rendered real pages — no-op production fallback

Chrome/Playwright screenshots were generated and visually inspected at 375, 390 and
1440 × 900. Each passed launcher/photo CTA separation, clickable target, immediate panel
opening, inquiry modal behavior, no horizontal overflow and zero page JavaScript errors.
Observed post-load CLS over the 9.5-second observation window was 0 at each width. This is
a bounded local observation, not a field Core Web Vitals certification.

Screenshots: `/private/tmp/leo-home-{375,390,1440}.png` and
`/private/tmp/leo-open-{375,390,1440}.png` (local QA only; not committed).
Machine-readable results: `/private/tmp/leo-rendered-qa.json`.

The local versions and exact production URLs were checked:

- https://stiledileo.com/
- https://stiledileo.com/projects.html
- https://stiledileo.com/fireplace-wall-vancouver.html
- https://stiledileo.com/marmorino-vancouver.html
- https://stiledileo.com/plaster-range-hood-vancouver.html
- https://stiledileo.com/marmorino-retail-interiors.html

Production pages returned 200 and retained the original launcher. Local versions showed
Ask Leo. Neither displayed a character.

### Instrumented adapter — interaction behavior, not asset approval

`scripts/qa-leo-interaction.cjs`: **29 grouped browser checks passed**.
Tests use a temporary in-memory browser fixture and an instrumented adapter; they do not
ship a fake character or claim real animation quality. Browser clock and synthetic
visibility/blur events exercise deterministic interruption timing.

Verified: fresh-session start; session marker already set at playback start; same-tab next
page/reload suppression; new-context eligibility; blocked storage; missing artwork; failed
script loading; reduced motion; scheduled and active cancellation; typing; other modal;
destroy/reinitialize; duplicate script initialization; desktop cooldown; throwing adapter;
mobile suppression; desktop control collision; selected-photo no inspect; dispatched-photo
single inspect; error, close and clear interruption; decoration cannot intercept pointers.

Results: `/private/tmp/leo-interaction-qa.json`.

### Existing Advisor and site regression

- Existing Advisor browser suite passed at 375/390/1440: image preprocessing, safe DOM,
  long replies, failure paths, optional storage, focus/Escape, editable handoff, no automatic
  submission, attribution, analytics without conversation contents and allowed page coverage.
  Its provider replies/form receipt are mocked and remain classified as structural checks.
- Real hosted provider exercised through the local changed frontend with a temporary QA
  forwarding route: text returned substantive fireplace advice; photo response described the
  curved hood, backsplash and wood shelving and preserved technical qualifications. No key
  was copied locally. Same-page photo handoff passed; `lead_source=finish_advisor` passed.
  No live inquiry was submitted. Backend behavior was not altered.
- Homepage navigation, comparison slider, texture controls, inquiry modal and Work cards,
  links, images and contact CTA passed the existing browser helpers at all three widths.
- 16 existing server contract tests passed. JS syntax and existing TypeScript checks passed.
- Netlify offline build passed (five Functions plus existing Edge Function).
- SEO validator passed: 50 HTML files / 48 sitemap URLs. The existing 88 image-dimension
  opportunities remain non-blocking historical warnings.
- Local projects/blog/Marmorino/hood redirects retained 301 to canonical `.html`; car page
  200 and missing page 404; production sitemap 200. Routing source was not edited.
- `git diff --check` passed. Final diff reviewed; no backend, knowledge, analytics or service
  page edits were introduced.

Reproduction (using an existing Playwright install and local server on port 8888):

```sh
PLAYWRIGHT_MODULE=/path/to/playwright node scripts/qa-leo-interaction.cjs
PLAYWRIGHT_MODULE=/path/to/playwright node scripts/qa-finish-advisor.cjs
node --test scripts/test-finish-advisor.mts
node --check scripts/leo-interaction.js
node --check scripts/finish-advisor.js
npx netlify build --offline
node scripts/seo-validate.js
git diff --check
```

## Final asset specification — owner approval required

The asset must be an owner-approved, refined Maine Coon-inspired character compatible with
the dark mineral and muted-gold site. This document requests asset capabilities only; it does
not commission or approve an illustration, license, animation format or runtime.

| Property | Requested delivery |
|---|---|
| Render size | Maximum 144 × 160 CSS px desktop; suggested source canvas 288 × 320 px for 2× raster delivery |
| Transparency | True alpha, clean edges, no opaque matte, no baked background |
| Bounding box | Character stays inside the reserved canvas; no off-canvas paw/tail motion |
| Anchor/origin | Bottom-center anchor; face oriented toward page content (left from the right-hand launcher) |
| Desktop | Same composition for above-button and left-of-panel placements; verify in browser with the final asset |
| Mobile | Static Ask Leo only in this version; optional future source should retain the same orientation and readable crop |
| Weight budget | Aim ≤350 KB per motion, ≤750 KB combined plus ≤40 KB static frame; choose format only after inspecting delivery |
| PEEK | One appearance, look, return; total ≤2.2 seconds |
| REACT | One restrained head/paw gesture and return; ≤1.2 seconds |
| INSPECT | One brief attentive look and return; ≤2.4 seconds |
| HIDE / RETURN | Normal return included in each motion; interruptions require immediate stop and hide, no delayed exit |
| Packaging/naming | Separate non-looping clips or actual named states: `PEEK`, `REACT`, `INSPECT`; `HIDE` if runtime supports it. Files may use `leo-peek`, `leo-react`, `leo-inspect`, `leo-static` with the chosen extension |
| Looping | None; playback must stop/reset without an indefinite idle loop |
| Static frame | Approved transparent resting frame supplied for asset verification/future fallback; reduced-motion mode here still shows only the launcher |

Rive, Lottie, transparent WebP/AVIF, sprites or alpha video can be evaluated only after the
real asset is available. Verify actual alpha, decode support, weight, scaling and playback
in supported browsers. No hypothetical animation dependency is installed now.

## Files and owner decision

Created:

- `scripts/leo-interaction.js`
- `scripts/qa-leo-interaction.cjs`
- `SEO/STILE-DI-LEO-LEO-INTERACTION-LAYER-v2.0.md`

Modified:

- `scripts/finish-advisor.js`: local Ask Leo text, minimal phase hooks, independent controller load.
- `styles/finish-advisor.css`: optional decorative host, pointer safety, mobile/reduced-motion
  suppression and desktop right safe-area inset.

Implemented: integration lifecycle, guarded initialization, session policy, cancellation,
cooldown, reduced motion, mobile suppression, conservative collision handling, photo hooks,
non-blocking local launcher and no-op adapter.

Not implemented: final character art, real expressions, real playback, format-specific
decoder, final asset loading implementation, final asset visual QA or production release.

Owner review is required for the local interaction behavior and Ask Leo name, delivery and
approval of the final visible asset, and a later release after that asset is integrated and
visually checked. Production currently displays no Leo. No release is authorized by this task.
