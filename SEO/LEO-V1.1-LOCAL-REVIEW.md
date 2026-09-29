# Leo V1.1 — local owner review

Baseline: `ae94a6b177c4cdd885a7b9033b64c109296ba22f`. Local changes only; no commit, push or deployment.

## Implemented behavior

- First autonomous PEEK: approximately 3 seconds after readiness, subject to focus, visibility, supported transparent media and safe placement.
- One idle-return PEEK per tab: 60 seconds after the latest meaningful interaction. Separate sessionStorage flags survive same-tab reload/navigation. Once the idle return is consumed, all further autonomous appearances are suppressed.
- No session consumption on timer, load or play events. The production renderer waits for an animation paint, compositor frame callback, paint opportunities, current-frame alpha/subject samples, visible host geometry and controller placement revalidation before acknowledging a shown frame.
- At most three attempts per scheduling cycle; a new meaningful user interaction can reset the deferred idle retry budget. Storage failure disables autonomous appearances, without blocking explicit Advisor use.
- REACT only on opening, with a 25-second cooldown. INSPECT only after photo dispatch. Close is immediate; HIDE is optional and safely skipped when obstructed.
- Controller and renderer generation tokens invalidate obsolete callbacks. Frame waits, animations and active playback are cancelled on interruption; initialization is idempotent.
- Mobile uses a 135px host (approximately 125–135px visible subject), anchored beside the launcher or within genuinely empty chat space. Readable content and controls remain protected. The dense real homepage top at 375/390 has no safe PEEK gap and deliberately suppresses it; this is not a playback failure.
- Unsupported media, blocked autoplay and failed alpha validation leave the functional static Ask Leo launcher. Approved assets and formats are unchanged. Reduced motion does not request character media.

## Acceptance

| Category | Result |
| --- | --- |
| Desktop motion | VERIFIED |
| Mobile responsive layout (375×812, 390×844) | VERIFIED |
| Chrome mobile-emulated motion | VERIFIED — actual decoded alpha and screenshot subject pixels |
| Native iPhone Safari transparent motion | UNVERIFIED — no real iPhone execution environment used |
| Reduced motion | VERIFIED |

Safari user-agent simulation verified the conservative static-launcher branch only. It is not native Safari certification.

## Local QA evidence

- 18 deterministic session/lifecycle checks: `/private/tmp/leo-v11-controller-qa.json`.
- 12 integrated real-media checks and recordings: `/private/tmp/leo-v11-owner-review/qa.json`.
- Five additional actual-media interruption checks, including delayed loading, visible PEEK preemption, rapid reopen and closing during INSPECT: `/private/tmp/leo-v11-race-review/qa.json`.
- 18 offline Advisor tests passed; the optional hosted-route test was intentionally skipped. Syntax checks, offline Netlify build and `git diff --check` passed.
- No relevant frontend errors, horizontal overflow, character-induced layout shifts, opaque staging backgrounds or broken-media flashes observed in tested local contexts.
- All new INSPECT integration tests use a disposable generated 32×32 PNG and a mocked local response. No owner/project photo was submitted to hosted OpenAI. No production API requests were needed.
- The offline build generated `deno.lock`; it was moved to `/private/tmp/leo-v11-owner-review/offline-build.deno.lock`, outside the source change.

## Owner review

Open `/private/tmp/leo-v11-owner-review/index.html`.

- `DESKTOP_OWNER_REVIEW.webm`: actual first PEEK, full real-time idle interval, idle return, REACT, INSPECT, HIDE.
- `MOBILE_375_OWNER_REVIEW.webm` and `MOBILE_390_OWNER_REVIEW.webm`: actual local homepage and Advisor interaction.
- `MOBILE_375_SAFE_PLACEMENT.webm` and `MOBILE_390_SAFE_PLACEMENT.webm`: explicitly isolated test layouts demonstrating autonomous mobile PEEK where there is safe space; not claimed to be the homepage.

All files above are under `/private/tmp/leo-v11-owner-review/`. Review media is not tracked in Git.

## Source scope

Runtime: `scripts/leo-interaction.js`, `styles/finish-advisor.css`.

Tests: existing `scripts/qa-leo-interaction.cjs` and `scripts/qa-leo-motion.cjs` now delegate to `scripts/qa-leo-v11.cjs` and `scripts/qa-leo-v11-motion.cjs`, replacing obsolete 9-second/mobile-suppression expectations.

No changes to character media, backend, routing, analytics implementation, production credentials or website content. Owner visual approval is required before release.
