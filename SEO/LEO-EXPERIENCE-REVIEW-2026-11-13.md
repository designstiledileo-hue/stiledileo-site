# Leo experience review — 2026-11-13

## Owner decision and scope

Leo stays beside **Ask Leo**. The owner explicitly chose this over a reserved position near the headline, accepting a later first appearance when no safe space exists. The headline experiment was removed; `index.html` is byte-identical to the starting revision. Character artwork, all eight motion files, framing, mobile size, collision clearances, backend, routes and analytics payloads are unchanged.

Baseline: `1143bd3415749d719ad8212451ca9f6372af5747`, branch `codex/venetian-photo-cta-review`. The unrelated pre-existing change in `venetian-plaster-vancouver.html` is preserved, SHA-256 `5ce379bb3c8488662ee1f9dd544e7e91d3eaf45a0b43019e25994a55884adcd8`. No commit, push or deployment performed.

The public Leo script was read successfully and matched the starting local script, SHA-256 `4b5288b9007c16404f0c430f386aecec2ff6009f746ce4a21842c666ec9adc8c`. The previously added HEVC path was therefore already present in production; an undeployed codec fix did not explain all remaining symptoms.

## Findings and corrections

| Finding | Correction |
| --- | --- |
| A roughly 200ms glimpse consumed the first introduction even when scrolling immediately hid it. | The production renderer requires approximately one second of visible playback before acknowledging PEEK. Interrupted attempts retain eligibility. |
| Temporary load failures permanently cached rejected promises. | Cache reusable media elements, discard failed elements, allow a subsequent attempt, and try the other supported format. No failed promise is retained. |
| Decoding/alpha verification depended on a detached paused preload. This is an iOS compatibility risk, not a confirmed physical-device trace. | Attach the transparent player, initiate muted inline playback, await decoded media, verify real alpha, then reveal. No opaque video is displayed. |
| Missing video-frame callback API immediately rejected otherwise working playback. | Use animation-frame paint checks and decoded alpha where the API is unavailable. |
| End handler was installed after several asynchronous steps. | Install it before starting playback, so completion cannot be missed. |
| REACT cooldown began before any visible response. | Cooldown starts at the actual visible acknowledgement. An unshown reaction does not burn the next deliberate opportunity. |
| A fast photo reply cut INSPECT off before it became visible. | Response settlement allows a safe active INSPECT/HIDE to finish. New content can still suppress the actor if it would cover a message. |
| Opening on a phone automatically raised the keyboard; the actor ignored visual-viewport changes. | Open with focus on the accessible Close control; the visitor taps the question field when ready. Placement checks the visual viewport and responds to its resize/scroll events. |
| Returning from initially reduced motion did not initialize the adapter. | Initialize lazily when motion becomes allowed; preserve the no-media reduced-motion path. |
| Failed deferred attempts could lose their scroll opportunity. | Rearm accepted-but-unshown and synchronously rejected attempts for the next settled scroll, without timer polling. |
| A coarse placement grid could miss a safe gap near the launcher. | Also test actual nearby content edges, within the same horizontal/vertical bounds and collision clearances. |

## Verification

- 34 deterministic controller scenarios passed, including cooldown timing, unshown/rejected responses, fast photo settlement and deferred retries.
- Six actual WebKit media resilience scenarios passed: missing frame API, reduced-motion preference change, transient fetch failure, denied autoplay, simulated visual viewport shrink and interrupted first introduction. These use an explicitly isolated local fixture and simulate browser conditions; they do not certify a physical phone.
- Advisor server/routing regression: 18 passed, one optional hosted request skipped. Provider behavior is simulated; no real customer image or paid provider request used.
- Final homepage recordings, responsive results and frontend checks are recorded in the review package's JSON reports. Photo replies use a 150ms mock rather than being held until the animation completes. Any absent photo reaction is separately labeled, not counted as visible animation.
- Syntax and whitespace checks run on the changed scripts. All source media checksums remain unchanged.

Final checks: 34 controller scenarios, six WebKit resilience scenarios, responsive Advisor flows at 375/390/1440, commercial-page coverage and storage-denied handoff passed. Three measurement-environment tests passed, covering 53 page bootstraps and suppression of local/preview measurements. The existing Advisor QA expected a local GA4 conversion; it was updated to observe the accepted-form hook while asserting that localhost emits no production conversions. Production analytics code was not changed. One exact scroll-timer assertion failed in a combined run and passed in the isolated rerun; no runtime change was made merely to accommodate it.

On the final recorded browsing path with local Image CDN sources supplied correctly, autonomous PEEK appeared at scrollY 4800 (428×926), 7800 (390×844) and 12000 (375×812). These are observed stops, not guaranteed earliest positions. REACT was visible at each width. With a 150ms photo reply, INSPECT/HIDE remained visible at 428; the smaller layouts suppressed the additional reaction after chat content filled the area. Desktop 1440×900 first PEEK remained at scrollY 0 and the full photo reaction completed. No page exceptions or horizontal overflow were observed in those runs.

## Review package

`/Users/vladyslavdementiev/Documents/New project/Leo-review-2026-11-13.IEIkDM/`

The package contains chronological recordings, screenshots and test reports. It is outside the website repository and remains local. Earlier prototype recordings in temporary directories are not the final approved placement.

## Practical limits

Physical iPhone 13 Pro Max Safari/Chrome playback is **NOT TESTED**. Actual macOS WebKit at mobile dimensions and simulated browser restrictions are not a substitute for that test. Reduced-motion preference, operating-system playback denial and a genuinely crowded viewport retain the usable static launcher.

The owner-selected placement deliberately waits for safe launcher-adjacent space. It does not promise a PEEK at the crowded homepage top. It must not be described as an early first-screen appearance, universal device certification or a flawless final release.
