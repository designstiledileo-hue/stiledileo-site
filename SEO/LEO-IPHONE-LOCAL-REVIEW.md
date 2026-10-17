# Leo — iPhone compatibility and deferred PEEK (local review)

Baseline: `e56dc61`. No commit, push or deployment is authorized by this work.

## Defects addressed

1. Safari was explicitly disabled, with no Apple-compatible transparent media. iOS Chrome was excluded from the Safari check but still received VP9 only. The new adapter prefers HEVC alpha for Apple browsers, including iOS-branded browsers, and retains VP9 for other browsers. Capability hints do not grant playback: each file must pass the existing real decoded-alpha check before display. Failed transparency must never show an opaque rectangle.
2. Six unsafe mobile pauses permanently discarded an unseen PEEK. The pending first appearance now continues to wait for a safe settled downward scroll. There is no polling: 48px net progress and 320ms settling are still required. Success or interaction cancels the listener. Returning from background/focus loss can rearm an unseen pending first appearance without starting a timer retry.

Collision geometry, full character framing, mobile size, UI boundary, 25-second reaction cooldown and session acknowledgement are unchanged. No compact crop has been restored. No public page content, backend, routing, credentials or source artwork changed.

## Media

Four additional `.mov` HEVC-alpha derivatives, created non-generatively from the existing approved WebM runtime clips. No new motion, anatomy, retiming, framing or background. Original WebM checksums remain identical. See `images/leo-advisor/motion/apple-manifest.json` for immutable source/output checksums, frame counts and encoding command.

Total Apple variant size: 3,495,689 bytes. Only the selected supported path is used; no four-state eager download. Reduced-motion preference requests no Leo media.

## Validation and limits

- 30 deterministic controller checks passed, including first-visible-frame acknowledgement, deferred scroll, background return, cancellation, cooldown and no silent session consumption.
- 13 Chrome real-media regression checks passed: desktop first/idle PEEK, mobile REACT, explicit safe-layout mobile PEEK (not a homepage claim), photo INSPECT/HIDE, reduced motion, media/autoplay failure and cancellation races. Evidence: `chrome-regression/qa.json`. The running test's three fallback labels retained an obsolete “Safari UA only” suffix; those tests ran Chrome, not Safari. The label is corrected in source; actual Apple-path results are in `final-webkit/qa.json`.
- Advisor offline tests: 18 passed, 1 optional hosted-route check skipped. Provider replies are simulated; no real business/API revalidation is claimed or required for this visual change.
- Actual macOS WebKit HEVC playback sampled across all four complete clips. Transparency present throughout. HIDE ends with the subject out of view, as intended.
- Real local homepage tested in WebKit at 428×926, 390×844 and 375×812. Each passed autonomous PEEK → hidden → REACT → actual local photo dispatch → INSPECT → HIDE → editable estimate/photo handoff. Test photo is disposable and provider response is mocked. No lead submitted. No page exceptions or horizontal overflow in those tests.
- The browser scroll is simulated; no Leo state, storage flag, placement function or page content is forced. Initial homepage top is suppressed for lack of safe space, **not** counted as a PEEK pass.
- Native iPhone Safari and iOS Chrome remain **NOT TESTED**. WebKit on a Mac is useful integration evidence, not certification on an iPhone. System reduced-motion, denied autoplay and unsupported decoding deliberately retain the functional launcher.

| Viewport | Visible first PEEK at tested scrollY | All four states captured |
| --- | ---: | --- |
| 428×926 (iPhone 13 Pro Max dimensions) | 4680 | Yes |
| 390×844 | 7800 | Yes |
| 375×812 | 7680 | Yes |

These are first safe stops on the tested 120px-step path, not guaranteed earliest positions. Appearance still occurs several screens down: discoverability requires owner review. This work does not claim to make an unsafe crowded hero into a safe placement.

## Review evidence (outside Git)

`/private/tmp/leo-iphone-fix.94cQUt/index.html`

- `final-webkit/WEBKIT_428_REVIEW.mp4`
- `final-webkit/WEBKIT_390_REVIEW.mp4`
- `final-webkit/WEBKIT_375_REVIEW.mp4`
- `final-webkit/qa.json`, state screenshots and original WebM recordings
- `controller.json`, `alpha-probe.json`

JavaScript syntax checks, JSON parsing/checksums and `git diff --check` passed. Existing source WebM hashes are unchanged.

The initial WebKit integration test missed a visible PEEK by scrolling again at 650ms while its video time was only 233ms; its >250ms sampling threshold missed the frame. Final QA stops scrolling when a visual host is active, checks actual playback/alpha, and records the sequence without altering runtime behavior. Earlier failed test folders remain separate from final evidence.

## Gate

Local owner review only. Public website remains unchanged. Review the timing/discoverability and obtain actual iPhone playback confirmation before a release claim.
