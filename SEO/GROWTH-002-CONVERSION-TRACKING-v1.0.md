# STILE DI LEO — GROWTH-002 CONVERSION TRACKING & LEAD ATTRIBUTION FOUNDATION v1.0

## 1. Existing Analytics Audit

- GA4 Measurement ID found: `G-P7VJ8MQNKS`.
- Existing GA4 installation was present on:
  - `index.html`
  - `car.html`
- No shared site-wide conversion tracking script was present before this sprint.
- Existing `car.html` tracking used a local inline click handler for `data-track` links and fired one broad event: `car_landing_action`.
- The homepage estimate form already submitted through Netlify form handling and showed a success state only after a successful `fetch("/")` response.
- No existing confirmed-success lead event was found for the estimate form.

## 2. GA4 Implementation Found

The existing GA4 pattern uses the direct Google tag implementation:

- async `gtag.js` loader
- `window.dataLayer`
- `gtag("js", new Date())`
- `gtag("config", "G-P7VJ8MQNKS")`

This sprint preserved that implementation pattern and did not introduce Google Tag Manager or a second analytics platform.

## 3. Changes Made

- Added shared conversion tracking script:
  - `scripts/analytics.js`
- Added the shared script to pages that already had GA4:
  - `index.html`
  - `car.html`
- Added the existing GA4 ID and shared tracking script to priority measurable pages:
  - `venetian-plaster-vancouver.html`
  - `fireplace-wall-vancouver.html`
  - `marmorino-vancouver.html`
  - `venetian-plaster-cost-vancouver.html`
- Replaced the old `car.html` inline `car_landing_action` tracking with shared tracking to avoid duplicate/conflicting event logic.
- Added successful-form-submit tracking to the homepage estimate flow after the existing Netlify `response.ok` success condition.
- Updated `scripts/seo-validate.js` so local `.js` references are recognized as valid local assets during validation.

No page titles, H1s, meta descriptions, canonical tags, sitemap strategy, redirects, content architecture, schema, or design were intentionally changed.

## 4. Shared Tracking Architecture

`scripts/analytics.js` provides one small shared client-side event layer.

The script:

- waits for GA4/`gtag` availability before sending events;
- uses delegated click tracking so existing and future CTAs can be measured without attaching many individual listeners;
- classifies phone, SMS, email, WhatsApp, estimate, and project-photo CTAs;
- adds page/service/campaign context;
- exposes one explicit method for verified form success:
  - `window.StileAnalytics.trackLeadSuccess(...)`

The architecture separates soft intent events from confirmed lead events.

## 5. Event Dictionary

| EVENT | TRIGGER | PARAMETERS | BUSINESS MEANING | KEY EVENT |
|---|---|---|---|---|
| `phone_click` | User clicks a `tel:` link | `lead_method`, `cta_text`, `cta_location`, `service`, `page_path`, `page_title`, `link_url`, optional `campaign` | Visitor intends to call | YES |
| `sms_click` | User clicks an `sms:` link | `lead_method`, `cta_text`, `cta_location`, `service`, `page_path`, `page_title`, `link_url`, optional `campaign` | Visitor intends to text | YES |
| `email_click` | User clicks a `mailto:` link | `lead_method`, `cta_text`, `cta_location`, `service`, `page_path`, `page_title`, `link_url`, optional `campaign` | Visitor intends to email | YES |
| `whatsapp_click` | User clicks a WhatsApp link | `lead_method`, `cta_text`, `cta_location`, `service`, `page_path`, `page_title`, `link_url`, optional `campaign` | Visitor intends to contact via WhatsApp | YES |
| `estimate_click` | User clicks estimate / consultation / quote / visualization CTA | `lead_method`, `cta_text`, `cta_location`, `service`, `page_path`, `page_title`, `link_url`, optional `campaign` | Visitor begins estimate intent | NO |
| `project_photo_click` | User clicks send-photo CTA or tracked project-photo CTA | `lead_method`, `cta_text`, `cta_location`, `service`, `page_path`, `page_title`, `link_url`, optional `campaign` | Visitor begins photo-based review intent | NO |
| `contact_form_start` | First input/change interaction with a form | `lead_method`, `cta_location`, `service`, `page_path`, `page_title` | Visitor starts a form | NO |
| `generate_lead` | Homepage estimate form receives successful Netlify response | `lead_method`, `cta_location`, `service`, `page_path`, `page_title` | Confirmed submitted lead | YES |
| `car_campaign_engagement` | First meaningful tracked interaction on `/car.html` or `/car` | `campaign`, `engagement_event`, `service`, `page_path`, `page_title` | Vehicle QR landing page produced engagement | NO |

## 6. Event Parameters

Standard parameters added where relevant:

- `page_path`
- `page_title`
- `cta_text`
- `cta_location`
- `service`
- `lead_method`
- `link_url`
- `campaign`
- `engagement_event`

Service values currently used:

- `fireplace`
- `venetian_plaster`
- `marmorino`
- `general`

Campaign values currently used:

- `car_qr`

## 7. Page / Service Mapping

| Page | Service Mapping | Campaign Mapping |
|---|---:|---:|
| `/` / `index.html` | inferred from form selection, fallback `general` | none |
| `/car.html` | `general` | `car_qr` |
| `/car` | `general` | `car_qr` |
| `/fireplace-wall-vancouver.html` | `fireplace` | none |
| `/venetian-plaster-vancouver.html` | `venetian_plaster` | none |
| `/marmorino-vancouver.html` | `marmorino` | none |
| `/venetian-plaster-cost-vancouver.html` | default `general` | none |

## 8. Form Tracking Method

The homepage estimate form is tracked in two stages:

1. `contact_form_start`
   - fires once when the visitor first interacts with the form;
   - does not include entered values.
2. `generate_lead`
   - fires only after the existing Netlify form submission receives a successful `response.ok`;
   - does not fire on validation failure;
   - does not fire from the fallback `mailto:` path.

This preserves a clean distinction between form intent and a confirmed submitted lead.

## 9. Car QR Tracking

The car landing page now uses the shared tracker instead of a page-specific inline handler.

Tracked behavior includes:

- send-photo CTA clicks;
- phone clicks;
- email clicks;
- first campaign engagement event for the vehicle QR page.

The campaign label is:

- `car_qr`

## 10. Attribution Strategy

This sprint creates first-party, event-level lead attribution based on:

- page context;
- service page context;
- CTA type;
- campaign context for `/car.html`;
- confirmed form success.

This gives GA4 enough structure to separate high-intent contact actions from softer CTA engagement without requiring content, URL, or SEO architecture changes.

## 11. GA4 Key Event Recommendations

Recommended GA4 key events:

- `generate_lead`
- `phone_click`
- `sms_click`
- `email_click`
- `whatsapp_click`

Recommended non-key supporting events:

- `estimate_click`
- `project_photo_click`
- `contact_form_start`
- `car_campaign_engagement`

Manual GA4 setup is still required to mark key events inside the GA4 property.

## 12. Privacy Safeguards

- No user-entered name, email, phone number, message text, uploaded filename, or photo content is sent to GA4.
- Form-start tracking is based only on interaction state, not field contents.
- Form-success tracking is based only on successful submission state and service context.
- The shared tracker does not read file upload contents.

## 13. Validation Results

Validation completed:

- `node --check scripts/analytics.js`
- `node --check scripts/seo-validate.js`
- `node scripts/seo-validate.js`
- independent internal-link validation
- independent broken-link validation
- independent broken-image validation
- independent canonical validation
- independent sitemap validation
- local browser analytics validation with mocked GA4/dataLayer checks

Results:

- SEO validation passed for 44 HTML files and 42 sitemap URLs.
- Canonical validation passed for 44 HTML files.
- Sitemap validation passed with 42 unique URLs.
- Internal links and images passed for 44 HTML files.
- Browser analytics validation passed across:
  - `/`
  - `/car.html`
  - `/venetian-plaster-vancouver.html`
  - `/fireplace-wall-vancouver.html`
  - `/marmorino-vancouver.html`
  - `/venetian-plaster-cost-vancouver.html`
- Non-blocking SEO validator warning remains: image dimension opportunities.

## 14. Files Changed

Growth-002 changed files:

- `index.html`
- `car.html`
- `venetian-plaster-vancouver.html`
- `fireplace-wall-vancouver.html`
- `marmorino-vancouver.html`
- `venetian-plaster-cost-vancouver.html`
- `scripts/analytics.js`
- `scripts/seo-validate.js`
- `SEO/GROWTH-002-CONVERSION-TRACKING-v1.0.md`

Pre-existing untracked file observed and not modified as part of this sprint:

- `SEO/GROWTH-001-SEARCH-PERFORMANCE-BASELINE-v1.0.md`

## 15. Manual GA4 Actions Required

Inside GA4, manually mark these as key events after deployment and first event receipt:

- `generate_lead`
- `phone_click`
- `sms_click`
- `email_click`
- `whatsapp_click`

Recommended GA4 review after deployment:

- confirm events appear in Realtime;
- confirm service/campaign parameters are visible;
- create or verify custom dimensions if reporting requires parameter breakdowns;
- exclude internal/test traffic if not already configured.

## 16. Remaining Limitations

- The shared tracking script is installed on the approved priority pages only; additional secondary pages can be enrolled later by adding the existing GA4 snippet and shared script.
- GA4 key events cannot be marked from the repository; this requires manual GA4 property configuration.
- The fallback email path from the estimate form is intentionally not counted as `generate_lead` because it is not a verified Netlify form success.
- Offline lead quality, booked consultations, and closed revenue still require manual or CRM-side tracking.

## 17. Recommended GROWTH-003

Recommended next sprint:

- add a lightweight lead-quality review loop;
- connect GA4 lead events to a simple monthly conversion report;
- define booked-consultation and won-project attribution fields;
- decide whether secondary pages should receive the shared tracking script site-wide.

