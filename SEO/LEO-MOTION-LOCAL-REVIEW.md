# Leo real motion — local integration review

Status: ready for final rendered owner approval; NOT released.

Starting and current HEAD: `c9e658073d1f5a047b935ed8c61df542cdb59266` on `main`.
The pre-existing uncommitted static-artwork work was preserved.

## Approved runtime assets

These files are byte-identical copies of the owner-approved practical derivatives. No video was regenerated, rematted, cosmetically cleaned or re-encoded for the site.

| File under `images/leo-advisor/motion/` | Dimensions | Frames at 24 fps | Exact content duration | Bytes |
| --- | --- | --- | --- | --- |
| leo-peek.webm | 512 × 682 | 62 | 2.583333 s | 968,995 |
| leo-react.webm | 512 × 640 | 53 | 2.208333 s | 726,149 |
| leo-inspect.webm | 512 × 640 | 48 | 2.000000 s | 511,526 |
| leo-hide.webm | 512 × 640 | 65 | 2.708333 s | 498,414 |

Total: **2,705,084 bytes**. VP9 WebM with alpha. Container duration rounds upward to milliseconds for three files; frame counts preserve the approved intervals exactly. `manifest.json` records frame intervals, runtime checksums and original-source checksums. All eight checksum comparisons passed at final QA.

## Integrated behavior

- The existing controller, Advisor hooks, WeakMap ownership, session marker, collision checks and interruption handling remain in use. There is no parallel Leo controller.
- PEEK is scheduled once per tab after the existing nine-second delay, subject to focus, available space and UI collision checks. It is never looped. The session marker prevents navigation/reload replay.
- Advisor opening is synchronous and independent of decoding/playback. REACT runs alongside intentional opening; pointer hover only warms the asset rather than triggering a duplicate reaction.
- Photo selection alone does not trigger INSPECT. Actual photo request dispatch does. The existing loading UI remains authoritative. Response, error, Clear/cancel, close, tab hiding, blur and blocking UI terminate playback.
- INSPECT can continue into the approved HIDE clip. PEEK and REACT use their own playback plus a short downward/opacity exit. Interruption hides immediately; there are no lingering frames or looping invisible videos.
- A playback-time video error hides the visual without closing or blocking the Advisor. Revision guards prevent late decoding from restoring interrupted motion. A safety timeout also bounds a stalled visual.
- The decorative host and videos are aria-hidden, inert/non-focusable, and pointer-events:none. They do not intercept Advisor controls.
- Existing Advisor analytics remain intact. `leo_peek_shown` is emitted once only after a visual actually appears. No conversation, image, filename or per-frame telemetry is added.

## Placement and performance

At 1440 px, the calibrated maximum visible subject width is approximately 220 px PEEK, 212 px REACT, 202 px INSPECT and 201 px HIDE. Motion uses its own approved alpha-based geometry, not the static-artwork transforms. The 230 px decorative host sits above the closed launcher or 12 px beside the open Advisor, aligned to its lower boundary. A shallow site-colored UI boundary conceals the approved staging remnants; it is not a replacement video background.

PEEK alone is warmed during idle time on eligible desktops. REACT loads on engagement, INSPECT on dispatched photo request, HIDE as its upcoming retreat. All four are not critical preloads. At 375 px, 390 px and with reduced motion, no character media is requested: only the normal Ask Leo launcher is used.

Rendered QA found no Leo-attributed layout shifts, horizontal overflow, blocked actions or page JavaScript errors. This is not a new whole-site Core Web Vitals certification; existing non-Leo page animation shifts were not changed.

## Fallback and compatibility

Chrome's actual decoded pixels passed an alpha check before display, and the transparent clips were visually inspected over the real dark site. An unsupported or failing video path lazily uses the already-approved static artwork's optimized WebP derivatives; original PNG source artwork is preserved. If all Leo media fail, only the functional launcher/Advisor remains, without broken media icons.

Safari 27 is installed. Native WebDriver testing was attempted but is blocked because **Allow remote automation** is disabled. No browser settings were changed. V1 therefore deliberately selects static artwork on Safari, without requesting WebM or adding HEVC infrastructure. The Safari-policy branch was tested in Chrome using a Safari user agent; this is explicitly NOT native Safari certification.

The owner-accepted minor pale/soft fur and paw edges and fine-tip attenuation remain. At normal site scale, representative frames show no opaque/cyan video rectangle or exposed staging ledge. No further cosmetic cleanup was performed. Final aesthetic acceptance remains with the owner.

## QA results

- Actual integrated-site motion suite: **15 grouped checks PASS** (all four decoded-alpha paths, A–H chronology, lazy loading, mobile, reduced motion, static/media-failure fallbacks and eight interruption paths).
- Existing instrumented controller suite: **29 grouped checks PASS** (session behavior, idempotence, input interruption, collision protection and photo hooks).
- Final playback-error and mobile-launcher spot checks: **3 PASS**.
- Finish Advisor frontend regressions: **PASS at 375, 390 and 1440 px**; editable estimate/photo handoff, `lead_source`, internal links, analytics privacy, safe DOM and storage-denied behavior verified using simulated responses. No leads were submitted.
- Existing offline Advisor unit suite: **16/16 PASS**.
- JavaScript syntax checks and `git diff --check`: **PASS**.
- Runtime derivatives and original source MP4 checksum checks: **PASS**.
- No real OpenAI conversation QA was repeated; the backend was not modified.

## Exact task changes

Modified:

- `scripts/leo-interaction.js` — motion adapter within the existing controller; static fallback retained.
- `styles/finish-advisor.css` — motion viewport, video geometry and UI-boundary styles.
- `scripts/qa-leo-interaction.cjs` — failed-media assertion checks that no media is rendered; a harmless empty lazy host is allowed.

Created:

- `images/leo-advisor/motion/leo-peek.webm`
- `images/leo-advisor/motion/leo-react.webm`
- `images/leo-advisor/motion/leo-inspect.webm`
- `images/leo-advisor/motion/leo-hide.webm`
- `images/leo-advisor/motion/manifest.json`
- `scripts/qa-leo-motion.cjs`
- `SEO/LEO-MOTION-LOCAL-REVIEW.md`

The older dirty/untracked static-asset files and documentation are pre-existing owner work, not newly recreated by this integration. Backend, routing, production configuration and page content are unchanged.

## Owner review evidence (local only)

The recording is the real integrated repository site served at `http://127.0.0.1:8888/`, with only the provider response simulated for the photo request. It is not the earlier separate practical mockup.

- Review page: `/private/tmp/leo-motion-integration.hdPVII/index.html`
- Chronological recording: `/private/tmp/leo-motion-integration.hdPVII/LEO_INTEGRATED_OWNER_REVIEW.mp4` — 23.2 seconds, 1440 × 900, 25 fps, H.264, silent.
- Source browser recording: `/private/tmp/leo-motion-integration.hdPVII/LEO_INTEGRATED_OWNER_REVIEW.webm`
- Screenshots: `A-hidden.png` through `H-final.png` in the same folder; mobile launchers and open Advisor also included.
- Machine QA: `qa.json`, `final-check.json`; instrumented controller results: `/private/tmp/leo-interaction-qa.json`.

Temporary review evidence is outside the repository and must not be committed. It may be removed by system temp cleanup; retain separately if a permanent audit copy is needed.

SOURCE MP4 FILES MODIFIED: NO

COMMIT: NOT CREATED

PUSH: NOT PERFORMED

DEPLOYMENT: NOT PERFORMED

PRODUCTION: UNCHANGED
