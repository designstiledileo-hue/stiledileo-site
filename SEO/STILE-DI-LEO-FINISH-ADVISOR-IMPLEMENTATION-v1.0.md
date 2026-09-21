# Stile di Leo Finish Advisor v1.0 — local implementation

## Release state

**LOCAL ONLY. No commit, push or deployment.** Starting HEAD: `c9705c39817b1e7064d8a86bd9c7380a66cedc0c`; main matched origin/main and was clean before implementation. Existing production remains unchanged.

Production environment presence check on existing Netlify site `designbyleo` (`a77348e3-558e-4e36-bd42-4c63bacd278f`), production context / Functions scope: `OPENAI_API_KEY` ABSENT; `STILE_ADVISOR_MODEL` ABSENT. Values were not printed. This prevents live provider certification and release. The owner has explicitly requested no commit/push/deployment at this stage.

## Architecture

Existing shared `scripts/analytics.js` adds one lightweight advisor script and stylesheet on an explicit commercial-page allowlist. No duplication across service HTML files and no new H1/schema/canonical. The widget calls only same-origin `POST /api/finish-advisor`. A modern Netlify `.mts` function calls `https://api.openai.com/v1/responses` server-side using native fetch. No browser OpenAI request, SDK runtime dependency, web search, tools, database or CRM.

The user explicitly requested direct OpenAI with `OPENAI_API_KEY`, so this does not use Netlify AI Gateway. Default model: `gpt-5.6-luna`; optional server-only `STILE_ADVISOR_MODEL` override. Uses `reasoning.effort=none`, `max_output_tokens=700`, strict `text.format` JSON schema, `store=false`. Output message content is read from Responses `output` items, not SDK-only convenience properties. Only complete, validated output is rendered. No fallback to a different model. A model override requires its own live compatibility test.

Official implementation references reviewed:

- [OpenAI GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna)
- [OpenAI image inputs](https://developers.openai.com/api/docs/guides/images-vision)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Netlify rate limiting](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/)

## Site scope

Widget enabled on `/` (and `/index.html`), `/projects.html`, `/venetian-plaster-vancouver.html`, `/marmorino-vancouver.html`, `/fireplace-wall-vancouver.html`, `/feature-wall-vancouver.html`, `/plaster-range-hood-vancouver.html`, `/marmorino-retail-interiors.html`, `/microcement-vancouver.html`, `/custom-architectural-rock-installation.html`, `/brookswood-langley-fireplace-transformation.html`, `/west-vancouver-fireplace-transformation.html`, `/venetian-plaster-cost-vancouver.html`.

Not injected into admin, technical pages, blog output, car campaign or other non-allowlisted pages. Existing .html redirects and all Opinly functions remain unchanged.

## UI

Opt-in bottom-right “Ask about your project” launcher. On the homepage it sits above, not on top of, the existing fixed photo CTA. Dark/mineral/gold styling uses existing site fonts. Desktop dialog and responsive mobile sheet; dynamic viewport height; reduced-height/keyboard layout; message scrolling; native dialog semantics plus explicit Tab wrap and Escape/return-focus. Existing inquiry modal and advisor cannot remain interactive together.

Free text with quick starts: Fireplace, Feature Wall, Range Hood, Venetian Plaster / Marmorino, Retail / Commercial, Sculpted Surface, Other. Explicit Upload a photo, preview/remove, loading/error states and New conversation. No fake human identity, online indicator or automatic popup. Clear cancels pending requests and prevents stale responses restoring cleared history.

## Image flow

JPEG, PNG and WebP only; browser input maximum 7 MB and 40 megapixels. Browser decodes, resizes longest side to at most 1600 px, strips file metadata by canvas re-encoding, composites transparency on white, and compresses to JPEG at 0.85 / 0.70 / 0.55 until at most 1 MB. Failure is explicit; HEIC/GIF are not claimed as supported. Original files are untouched.

One selected image per request, held only in memory, never sessionStorage. Image is sent only when Send is pressed, as Responses `input_image` with a data URL. Server enforces exact MIME/base64 structure, matching JPEG/PNG/WebP signature and 1 MB decoded limit; rejects remote URLs and multiple-image arrays. Image validity beyond signature is handled by the provider; malformed decoding yields safe fallback rather than analysis claims. A selected photo remains available for follow-up questions until removed/cleared or the page unloads.

## Knowledge and business boundaries

`netlify/functions/_shared/finish-advisor-knowledge.mts` contains curated, source-page-linked facts and a server-owned link map. Reviewed current Venetian, Marmorino, fireplace, feature-wall, hood, retail, microcement, sculpted-stone, completed-case-study and pricing pages.

Rules preserve conditional preparation/substrate review; no engineering/HVAC/electrical/gas approval; decorative-only hood scope; verified White Rock example; retail imagery as APPLICATION, not executed commission; sculpted work as dry-interior relief/moss/lighting; microcement excludes bathrooms/showers/wet rooms. Exact published planning ranges are available as context only; no calculated or binding quote. Service area remains Metro Vancouver / Lower Mainland. No invented warranties, finish systems, scheduling promises or customer data. At most two follow-up questions. Visitor language respected. Photos cannot establish concealed substrate or technical safety.

## Existing lead flow

“Request a project review” appears after a question or retained conversation, including service-unavailable fallback. It copies **visitor messages only**, not model advice or an invented structured summary, into the existing editable `project_note` field. History is bounded; omitted earlier text is noted. Existing notes are preserved before appended context, subject to the existing 2,000-character field cap.

On the homepage an explicit event opens the current `instant-estimate` form; a processed in-memory File transfers through DataTransfer if the form does not already contain a photo. If transfer is unsupported, the existing uploader remains available. From another page, same-tab sessionStorage passes only visitor text to `/#estimate`, expires after 10 minutes and is consumed once. The form explicitly asks the visitor to attach the photo again. No image is stored to enable cross-page transfer. If browser storage is denied, a copy-notes instruction and direct form link are provided.

Only a static `lead_source` hidden field and small advisor handoff note/hook were added to the existing homepage form. Name/contact collection, required photo, email/phone validation, Netlify Form endpoint, anti-spam, attribution and manual submission remain in the existing flow. `lead_source=finish_advisor` travels with the actual inquiry. The form never submits from the chat. No claim that the owner received a photo before successful form submission. Starting a new form after an accepted inquiry resets advisor attribution/help text through the existing reset flow.

## Analytics and privacy

Uses existing `StileAnalytics.track`: `finish_advisor_open`, `finish_advisor_started`, `finish_advisor_photo_added`, `finish_advisor_lead_cta`, `finish_advisor_clear`. These contain existing page context, never chat text, photos, filenames or personal contact information. Generic chat buttons/links have `data-track=none` to avoid accidental content-based events. No advisor-triggered generate_lead; existing success semantics remain tied to an accepted form response.

Bounded text conversation in same-tab sessionStorage, with two-hour restore age and Clear; no indefinite localStorage. Memory-only images. Send disclosure identifies OpenAI processing and asks visitors not to share sensitive information. Server does not log customer text/images, keys or upstream error bodies. `store=false` avoids application response storage at OpenAI; it is **not a promise of zero provider retention**. Applicable OpenAI account/data-retention terms still apply. Explicit inquiry submission uses the existing Netlify Forms retention workflow.

## Security and cost controls

- POST only, JSON only, exact same-origin browser request check; no CORS allowance.
- Stream-bounded request body 1,500,000 bytes; 2,000-character message; at most eight history messages, each at most 2,000 characters; only user/assistant roles. Caller cannot select model/tools/system instructions.
- One at-most-1-MB image with allowed MIME/signature; no remote-image fetching/SSRF.
- Server-only key and instructions; strict structured output, server-owned same-site URLs, at most two links; all content rendered using text nodes, never model innerHTML.
- Output capped to 700 tokens and 2,000 characters; no tools; 20-second provider timeout and 25-second browser timeout.
- Pending-send disable, 1.5-second browser send interval and Netlify-native per-IP/domain 10 requests/60 seconds. No fragile process-memory “global” limiter.
- Obvious prompt-extraction, unrelated homework/code/news and wet-room microcement requests get bounded deterministic responses without calling OpenAI. Broader scope enforcement remains model instruction, not a provable semantic security boundary.
- Native rate limiting is approximate (Netlify documents enforcement delay up to 10 seconds), not a global spend cap or bot authentication. Multiple-IP abuse, provider budget configuration and production platform enforcement remain owner/release considerations. Origin headers are spoofable outside browsers; origin checks are not authentication.
- Safe no-store errors and a direct inquiry fallback; no raw stack traces, response IDs or provider errors returned.

## QA status vocabulary

**PASS**: exercised real local code/browser/build with observable results.
**SIMULATED / STRUCTURAL PASS**: provider responses or accepted lead receipts were mocked; verifies transport/schema/guards/UI only, not real AI judgement or delivery.
**BLOCKED BY API KEY**: requires live OpenAI access and was not run.

## Tests and results

| Check | Result |
|---|---|
| JS syntax: widget, analytics, browser test | PASS |
| TypeScript no-emit check with Netlify/Node types | PASS |
| 16 Node contract tests | PASS (provider-dependent assertions SIMULATED / STRUCTURAL PASS) |
| POST/origin/content-type/body/history/output/image validation | PASS |
| Real local Netlify request without key returns safe HTTP 503 | PASS |
| API payload: Responses schema, model, history, store=false, image bytes | SIMULATED / STRUCTURAL PASS |
| Basic/fireplace/hood/Marmorino/retail/pricing request scenarios | SIMULATED / STRUCTURAL PASS; business prompt inspected, model judgement untested |
| Deterministic wet microcement and obvious unrelated/injection stops | PASS |
| Provider refusal/error/truncation/network/timeout handling | SIMULATED / STRUCTURAL PASS |
| Browser 375/390/1440: open/close, focus trap, chips, text, photo, long messages, scroll, error, clear, no overflow | PASS with SIMULATED provider replies |
| Reduced 500px viewport (keyboard approximation) | PASS; no physical-device keyboard certification |
| JPEG/PNG/WebP preparation, oversized/unsupported/corrupt upload rejection | PASS |
| Text-only DOM and controlled links against hostile mock output | PASS |
| Same-page photo carryover, cross-page text handoff, user editability, no silent submit | PASS |
| Netlify inquiry receipt/lead event after submission | SIMULATED / STRUCTURAL PASS; no actual customer lead submitted |
| Analytics excludes conversation/image content | PASS |
| Storage denial, missing-key failure CTA and stale-request Clear handling | PASS |
| All 13 commercial destinations initialize; car page excluded | PASS |
| Existing homepage hood/retail discovery, modal, comparison slider, finishes expansion | PASS at 375/390/1440 |
| Work page links/images/H1/canonical/navigation and CTA | PASS at 375/390/1440 |
| SEO validator | PASS: 50 HTML / 48 sitemap URLs; same 88 unrelated nonblocking dimension warnings |
| Netlify offline Functions/Edge bundling | PASS |
| git diff --check and scoped diff | PASS |
| Real model text answers, language behaviour, subtle injection resistance, business A–E conversations | BLOCKED BY API KEY |
| Actual visual reasoning on the real hood photo | BLOCKED BY API KEY (only byte transport/preprocessing proven) |
| Live account/model access, quotas/latency, deployment and production advisor tests | BLOCKED BY API KEY |
| Deployed rate-limit enforcement | Not run: no deployment authorized while key absent |

Rendered screenshots were inspected; hover contrast and keyboard focus-wrap findings were fixed and retested. Screenshots/temporary QA files remain outside the repository. Browser QA uses synthetic visitor text and intercepted form POSTs, never real inquiries. Existing portfolio image QA excludes the deliberately empty, hidden advisor-upload preview element until an image is selected.

## Re-run locally

```sh
npx netlify dev --offline --port 8888 --no-open
node --test scripts/test-finish-advisor.mts
PLAYWRIGHT_MODULE=/absolute/path/to/playwright node scripts/qa-finish-advisor.cjs
node --check scripts/finish-advisor.js
node --check scripts/analytics.js
npx --yes --package typescript tsc --noEmit --module nodenext --target es2022 --types node --allowImportingTsExtensions --skipLibCheck netlify/functions/finish-advisor.mts netlify/functions/_shared/finish-advisor-knowledge.mts
node scripts/seo-validate.js
npx netlify build --offline
git diff --check
```

Node contract tests require Node 22.18+ or Node 24+ for native type stripping (tested with Node 25.9.0). Playwright browser QA intentionally refuses non-localhost URLs and requires installed Chrome. @netlify/functions and @types/node are development-only typings; native fetch needs no OpenAI runtime package. package-lock.json records dependencies. Local build/node_modules ignored.

## Exact files

Changed: `.gitignore`, `index.html`, `package.json`, `scripts/analytics.js`.

Created: `package-lock.json`, `netlify/functions/finish-advisor.mts`, `netlify/functions/_shared/finish-advisor-knowledge.mts`, `scripts/finish-advisor.js`, `styles/finish-advisor.css`, `scripts/test-finish-advisor.mts`, `scripts/qa-finish-advisor.cjs`, `SEO/STILE-DI-LEO-FINISH-ADVISOR-IMPLEMENTATION-v1.0.md`.

No service/project page rewrites, image changes, routing changes, sitemap edits, existing analytics-event rewrites or unrelated files. No new commit; source remains available in the current working tree.

## Required owner action and release gate

In the **existing Netlify designbyleo project → Project configuration → Environment variables**, add `OPENAI_API_KEY` securely for **production / Functions**. Do not paste it in chat, source, HTML, public variables or git. Optional `STILE_ADVISOR_MODEL=gpt-5.6-luna`; leaving it unset uses that default. Ensure the OpenAI project has billing/model access and an appropriate spend budget.

After saving, notify the implementer to run the blocked live server text/image/business checks before authorizing any release. Do not deploy this public widget merely because non-live tests passed. No final production push is permitted in the current key-absent state.
