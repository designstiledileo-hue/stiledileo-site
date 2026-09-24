# Leo final asset integration — local owner review

Starting/current HEAD: `721dd4b13238629336501b50f750b882cb803d87`.
Earlier interaction work was already committed by the owner before this continuation.
No history was rewritten. No routing, backend, credentials, content or deployment changes.

## Approved assets and optimized runtime copies

Exact sources: `/Users/vladyslavdementiev/Downloads/leo-state-pack/`.
All canvases are 1122 × 1402 RGBA. Bounds below are x/y/width/height,
including every alpha > 0 pixel. Source alpha range is 0–255 in every file.

| State | Alpha bounds | Bottom / centre X | Source bytes | Original lossless WebP bytes |
|---|---|---|---:|---:|
| hide | 0 / 0 / 1093 / 1371 | 1371 / 546.5 | 2,449,926 | 1,608,402 |
| peek | 0 / 19 / 1122 / 1383 | 1402 / 561 | 1,596,302 | 1,058,838 |
| react | 0 / 0 / 1102 / 1385 | 1385 / 551 | 2,091,121 | 1,350,558 |
| inspect | 0 / 0 / 1122 / 1402 | 1402 / 561 | 2,486,035 | 1,638,990 |

Runtime location: `images/leo-advisor/leo-{state}.webp`.
The table above preserves the pre-optimization baseline. The full-resolution lossless
runtime pack has now been replaced by the following production-sized derivatives.

| State | Master dimensions | Master PNG bytes | Old runtime bytes | New dimensions | New bytes | Runtime reduction |
|---|---|---:|---:|---|---:|---:|
| hide | 1122×1402 | 2,449,926 | 1,608,402 | 512×640 | 120,960 | 92.48% |
| peek | 1122×1402 | 1,596,302 | 1,058,838 | 512×640 | 81,594 | 92.29% |
| react | 1122×1402 | 2,091,121 | 1,350,558 | 512×640 | 102,786 | 92.39% |
| inspect | 1122×1402 | 2,486,035 | 1,638,990 | 512×640 | 121,666 | 92.58% |

OLD TOTAL RUNTIME SIZE: **5,656,788 bytes**.  
NEW TOTAL RUNTIME SIZE: **427,006 bytes (427 KB decimal)**.  
TOTAL REDUCTION: **92.45%**.

Whole-canvas proportional LANCZOS downsampling to width 512 (height rounded to 640),
WebP quality 88, method 6, alpha quality 100. Alpha decodes identically to the resized
RGBA source; RGB is intentionally lossy. No crop, alpha cleanup, defringing,
recolouring, sharpening, shadows or regeneration.
The asset manifest records source/runtime SHA-256 and geometry. Original PNGs stay untouched.

Quality 88/91/94 were compared: complete pack sizes 427,006 / 473,876 / 535,590 bytes.
The master and all candidates were rendered at the existing CSS size in a 1440px
browser viewport at 100% zoom, on the real dark homepage, at DPR 1 and DPR 2.
Eyes, face, ears, whiskers, chest fur, paws, edge alpha, colour and realism remain
effectively indistinguishable in normal use. Quality 88 was the smallest tested
acceptable version; 640px and AVIF were not needed. Fine high-frequency differences
at raw device-pixel inspection do not warrant the larger transfer at ~210 CSS px.
Comparison evidence: `/private/tmp/leo-optimization/comparison.html`.
No JS, CSS, state mapping, timers, calibration or Advisor changes in this optimization pass.
Re-measuring the resized dense-alpha bounds in existing CSS coordinates gives a
maximum 0.80px horizontal-centre difference and 0.163px paw-bottom difference.
These threshold/resampling differences produce no observed anchor jump; calibration
is unchanged. The existing explicit CSS image dimensions preserve the logical master
coordinate system regardless of the downloaded image resolution.

## Central calibration

The `calibration` map in `scripts/leo-interaction.js` is the sole per-state geometry map.
Extremely faint alpha extends beyond the visible paws, especially in PEEK. Alpha ≥128
is used only to measure a stable dense silhouette anchor, never to discard pixels.

| State | Dense bounds L/T/R/B | Scale | translateX | translateY | All-alpha CSS width |
|---|---|---:|---:|---:|---:|
| hide | 34/16/1073/1364 | .19 | 9.835 | 20.84 | 207.67 |
| peek | 42/314/1095/1321 | .19 | 6.985 | 29.01 | 213.18 |
| react | 47/16/1082/1345 | .19 | 7.745 | 24.45 | 209.38 |
| inspect | 12/11/1110/1370 | .19 | 8.41 | 19.7 | 213.18 |

Every dense silhouette centre is host X=115; every paw bottom is host Y=280.
The host is 230 × 300 CSS px, retaining the entire source alpha bounds.
No pose-specific anatomy scaling: all four share .19. Intrinsic differences between
the close PEEK pose and seated poses remain part of the approved artwork.

At 1440px, visible widths are approximately 197–209px for the dense silhouette,
208–213px including faint edges. The paw baseline sits 8px above the launcher.
The host aligns to the launcher's right edge. With the panel open, it moves into
the adjacent 230px lane, 12px left of the panel, paws aligned to the panel bottom.
The character does not cover panel text, photo, input or buttons.

Collision protection suppresses the effect if a visible action/project image occupies
the character lane. In particular, the homepage hero can suppress the intro; it is
not forced over project photography. Review screenshots use the real homepage's
lower consultation area, where the decorative background has a clear peripheral lane.

## Experience and timings

- PEEK: once per tab, nine-second eligible idle delay after asset readiness; 600ms
  entrance from 10px below, 1,400ms hold, then retreat. No repeat loop.
- REACT: intentional launcher activation opens the existing Advisor synchronously,
  independently of asset readiness. Raised-paw welcome runs in parallel, 180ms entry,
  1,200ms visible window, then retreat. Existing restrained hover/cooldown remains.
- INSPECT: only the existing `photo-sent` hook after fetch is initiated; never file
  selection. 180ms entry, maximum 2,400ms window. Existing loading UI remains truthful
  even after Leo disappears. Response/error/close/clear immediately interrupts him.
- Pose swaps: one image element, 90ms fade to zero, source swap to decoded image,
  90ms fade back. No simultaneous faces. No bounce or scale pulse.
- Natural retreat: 180ms swap to `hide`, then 220ms downward 12px fade; host becomes
  hidden and exits the top layer. `hide` is never a permanent visible idle state.
- Mobile 375/390 and reduced-motion: static Ask Leo; no character downloads or motion.
- All four images decode during idle loading before any display. Load failure inserts
  no broken image and cannot block the Advisor. No Rive/Lottie/video/library dependency.
- Decorative host is inert, aria-hidden, pointer-events:none. A manual popover allows
  it to sit outside the modal's clipping region without acquiring focus or inputs.

## Visual assessment and QA

Actual browser screenshots inspected for PEEK, REACT, INSPECT, hide pose, fully hidden
state and mobile. Existing fine fringe is not distracting at the final rendered size
on the site's dark background. It is unchanged; owner visual approval remains pending.

Validation:

- Existing instrumented Leo suite: 29 grouped checks passed (storage, once-per-tab,
  cancellation, hover cooldown, duplicate initialization, collision, reduced motion,
  mobile, missing script/asset, photo/error/close/clear).
- Actual-art QA: chronological A–F, immediate opening, one image, source photo request,
  natural retreat, no broken image, unchanged page/CTA/launcher geometry, replay
  suppression, mobile/reduced-motion suppression, missing-asset fallback.
- Advisor browser regression: 375/390/1440, photo preprocessing, editable inquiry and
  photo handoff, lead_source, safe internal links, analytics without content leakage,
  storage-denied fallback, no accidental real lead submission.
- 16 existing server unit tests passed with simulated provider calls.
- Local offline Netlify Functions/Edge bundling passed. No deploy command used.
- Syntax and git diff whitespace checks passed.

No live paid OpenAI conversation checks were repeated. Mocked provider behavior is
SIMULATED / STRUCTURAL PASS, not a fresh provider-production certification.
The optional controller remains 11,501 uncompressed bytes. Optimized runtime images
total 427 KB. Mobile/reduced-motion checks verify zero character asset requests.
The prior broad regression/build results above belong to the integration pass;
only the relevant rendered Leo checks are rerun for runtime optimization.
Optimization regression: PASS for HIDDEN/PEEK/REACT/INSPECT/RETREAT at 1440px,
same-tab replay suppression, static 375/390, reduced motion, missing assets, immediate
Advisor opening, photo-send trigger, no console errors, no overflow, no broken flash,
and stable layout bounds. A–F screenshots and `qa.json` were recreated with optimized
files. No whole-site/backend audit was repeated.

CLS qualification: page/launcher/CTA rectangles do not move during Leo's appearance;
no measured layout-shift source is the Leo layer. The unchanged homepage has a CTA
`::after` sheen that animates `left`, producing nonzero browser layout-shift readings;
existing dialog content also shifts when photo/reply content changes. The QA JSON
includes raw flow totals and a Leo-disabled homepage control. Do not call the whole
page's measured CLS zero. No unrelated homepage animation was modified.
Pre-optimization browser run: observed pre-open CLS 0.06184, complete flow 0.29670, and
Leo-disabled homepage control 0.32964. Sources were the existing `::after` animation
and `sa-compose` content; zero Leo sources. Page/CTA/launcher geometry stayed stable
within a documented 0.25px tolerance for existing reveal-transform settling.
Optimized run: total flow reading 0.33325 versus Leo-disabled control 0.35389;
zero Leo shift sources. Existing sheen/dialog-content qualification still applies.

## Review evidence (outside Git)

Open `/private/tmp/leo-owner-review/index.html` for the chronological sequence.

1. `/private/tmp/leo-owner-review/A-launcher-only.png`
2. `/private/tmp/leo-owner-review/B-autonomous-peek.png`
3. `/private/tmp/leo-owner-review/C-react-advisor-open.png`
4. `/private/tmp/leo-owner-review/D-inspect-photo-submitted.png`
5. `/private/tmp/leo-owner-review/E1-retreat-transition.png`
6. `/private/tmp/leo-owner-review/E2-fully-hidden.png`
7. `/private/tmp/leo-owner-review/F-mobile-390.png`

Machine-readable rendered QA: `/private/tmp/leo-owner-review/qa.json`.
No screenshots were added to the repository. Temporary review files may be cleared
by the operating system; copy them outside the repository if long-term retention is needed.

## Exact local changes

This optimization pass changes only the four runtime WebPs, their asset manifest,
`scripts/prepare-leo-assets.py`, and this report. The list below describes the full
still-uncommitted integration accumulated before and during optimization.

Modified:

- `scripts/leo-interaction.js`
- `styles/finish-advisor.css`
- `scripts/qa-leo-interaction.cjs`
- `SEO/STILE-DI-LEO-LEO-INTERACTION-LAYER-v2.0.md` (historical-status notice)

Created:

- `images/leo-advisor/leo-hide.webp`
- `images/leo-advisor/leo-peek.webp`
- `images/leo-advisor/leo-react.webp`
- `images/leo-advisor/leo-inspect.webp`
- `images/leo-advisor/asset-manifest.json`
- `scripts/prepare-leo-assets.py`
- `scripts/qa-leo-assets.cjs`
- `SEO/LEO-FINAL-ASSET-REVIEW.md`

COMMIT: NOT CREATED  
PUSH: NOT PERFORMED  
DEPLOYMENT: NOT PERFORMED  
PRODUCTION: UNCHANGED by this task
