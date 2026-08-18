# STILE DI LEO — STAGE IV VERIFICATION & EXECUTION CONTROL v1.0

## 1. Routing Verification

Live production HTTP verification was performed against `https://stiledileo.com/`.

| URL | Initial HTTP status | Redirect location | Final HTTP status | Final URL |
|---|---:|---|---:|---|
| `https://stiledileo.com/venetian-plaster-vancouver` | 200 | none | 200 | `https://stiledileo.com/venetian-plaster-vancouver` |
| `https://stiledileo.com/venetian-plaster-vancouver.html` | 200 | none | 200 | `https://stiledileo.com/venetian-plaster-vancouver.html` |
| `https://stiledileo.com/fireplace-wall-vancouver` | 200 | none | 200 | `https://stiledileo.com/fireplace-wall-vancouver` |
| `https://stiledileo.com/fireplace-wall-vancouver.html` | 200 | none | 200 | `https://stiledileo.com/fireplace-wall-vancouver.html` |
| `https://stiledileo.com/marmorino-vancouver` | 200 | none | 200 | `https://stiledileo.com/marmorino-vancouver` |
| `https://stiledileo.com/marmorino-vancouver.html` | 200 | none | 200 | `https://stiledileo.com/marmorino-vancouver.html` |
| `https://stiledileo.com/definitely-not-a-real-page` | 404 | none | 404 | `https://stiledileo.com/definitely-not-a-real-page` |

Expected behavior:

- clean owner URL → 301/308 → matching `.html`
- `.html` URL → 200
- fake URL → not homepage 200

Result:

- Fake URL behavior passes: nonexistent URL returns 404.
- `.html` owner URLs pass: each returns 200.
- Clean owner URL redirect behavior fails: clean owner URLs return 200 directly instead of redirecting to matching `.html`.

## 2. Canonical Verification

Live HTML for the three owner pages was checked.

| Owner Page | Canonical Count | Canonical URL | Result |
|---|---:|---|---|
| Venetian Plaster | 1 | `https://stiledileo.com/venetian-plaster-vancouver.html` | PASS |
| Fireplace Transformations | 1 | `https://stiledileo.com/fireplace-wall-vancouver.html` | PASS |
| Marmorino | 1 | `https://stiledileo.com/marmorino-vancouver.html` | PASS |

No canonical changes were made.

## 3. GA4 Verification

Local source implementation was inspected.

Confirmed event support:

- `estimate_click`
- `contact_form_start`
- `generate_lead`
- `phone_click`
- `sms_click`
- `whatsapp_click`
- `email_click`
- `project_photo_click`
- `car_campaign_engagement`

Confirmed behavior from source:

- `generate_lead` is not fired from ordinary CTA clicks.
- `generate_lead` is exposed through `window.StileAnalytics.trackLeadSuccess(...)`, which is called from the successful homepage Netlify form path.
- CTA click tracking uses one delegated click listener in `scripts/analytics.js`.
- Form-start tracking uses delegated `input` and `change` listeners with a `WeakSet` so each form is counted once.
- No user-entered form fields, uploaded photo contents, or customer message text are sent to GA4 by the shared analytics script.

Live GA4 Realtime/DebugView access was not available from this environment.

Manual live GA4 check required:

1. open GA4 Realtime;
2. submit one real test form;
3. confirm `contact_form_start`;
4. confirm `generate_lead`;
5. click phone or another tracked action;
6. confirm corresponding event;
7. ensure events do not double-fire.

## 4. GSC Baseline Freeze

Use the previously established direct Query × Page baseline as the historical pre-change reference.

Query:

- `plaster fireplace vancouver`

Fireplace owner baseline:

- 115 impressions
- average position approximately 22.55

Query:

- `venetian plaster vancouver`

Venetian owner baseline:

- 302 impressions
- average position approximately 44.98

These are PRE-CHANGE / HISTORICAL BASELINE values.

Do not reinterpret them as current post-change performance.

## 5. Owner Page Status

| Owner Page | Status |
|---|---|
| Venetian Plaster | WATCH |
| Fireplace Transformations | WATCH |
| Marmorino | HOLD / COLLECT DATA |

Do not recommend another owner-page rewrite before enough post-change data accumulates.

## 6. 90-Day Outcome KPI Framework

Track the following for the first 90 days:

- outreach sent
- positive replies
- qualified B2B conversations
- real project opportunities
- quotes requested / sent
- won projects
- attributed project value
- time spent on outreach

For the first 30–45 days:

- establish baseline

Do not invent target percentages yet.

After baseline:

- scale only from repeated qualified opportunities, quotes, and won-project evidence;
- deprioritize only from repeated poor fit, excessive effort, or lack of project opportunity.

## 7. Capacity Guardrail

Stile di Leo is solo-operated.

Normal mode:

- 2–3 focused hours/week
- approximately 10–15 new high-fit prospects/week
- plus follow-ups

Maintenance mode:

- approximately 5 new prospects/week
- plus follow-ups
- inbound responses
- lead register updates
- review requests

Use maintenance mode when a large live paid project materially reduces available capacity.

Marketing administration must not interfere with paid project delivery.

## 8. Review Trigger

Operational review request trigger:

PROJECT COMPLETE
→ customer confirms satisfaction
→ final cleanup / photography
→ 1–3 days later: send honest Google review request with direct review link
→ if no response: one polite follow-up after approximately 7–10 days
→ stop

Rules:

- do not review-gate;
- do not incentivize positive reviews;
- request honest feedback only.

## 9. Weekly 10-Minute Review

Every week, spend approximately 10 minutes reviewing:

- new leads
- qualified leads
- B2B replies
- active opportunities
- quotes
- won/lost
- review requests
- time spent on outreach

Ask:

- What changed this week?
- Which channel produced real opportunity?
- Is capacity normal mode or maintenance mode?
- What is the next highest-value action?

Do not turn this into a dashboard-building task.

## 10. Decision Rules

Do not:

- change SEO because of one week of volatility;
- stop B2B after one weak batch;
- scale a channel because of one good lead;
- judge car QR by scans alone;
- judge social by likes;
- judge SEO by impressions alone.

Prefer:

- qualified opportunities;
- quotes;
- won projects;
- project value.

## 11. Any Blockers

Routing verification blocker:

- Live clean owner URLs currently return HTTP 200 directly instead of 301/308 redirecting to canonical `.html` URLs.

Affected URLs:

- `https://stiledileo.com/venetian-plaster-vancouver`
- `https://stiledileo.com/fireplace-wall-vancouver`
- `https://stiledileo.com/marmorino-vancouver`

Not blocked:

- nonexistent URL returns 404 and does not render homepage 200;
- live `.html` owner URLs return 200;
- live owner page canonical tags are exactly one and self-referential;
- GA4 source implementation contains the expected events.

## 12. Final Execution Readiness

Stage IV execution controls are defined.

However, the live routing sanity check does not match the stated production architecture because clean owner URLs return 200 directly instead of redirecting to canonical `.html` URLs.

Final readiness:

- STAGE IV VERIFICATION BLOCKED until clean owner URL redirect behavior is corrected or intentionally reclassified as acceptable production behavior.

