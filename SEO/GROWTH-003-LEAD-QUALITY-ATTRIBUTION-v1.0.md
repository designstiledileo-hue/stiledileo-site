# STILE DI LEO — GROWTH-003 LEAD QUALITY & REVENUE ATTRIBUTION FOUNDATION v1.0

## 1. Executive Summary

GROWTH-003 creates a lightweight lead-quality and revenue-attribution system for Stile di Leo.

The recommended implementation is a simple one-row-per-lead register, maintained as a spreadsheet-compatible CSV. This is intentionally not a CRM build, database project, automation sprint, or website rewrite.

The system connects:

Search / GBP / QR / Referral / Social
→ Lead
→ Qualified
→ Consultation
→ Quote
→ Won
→ Project Value

The owner should be able to maintain the register in less than approximately one minute per new lead, with short follow-up updates after consultation, quote, and decision.

## 2. Existing Lead Flow

Current contact and lead-intent paths identified from the repository and GROWTH-002 documentation:

- Homepage estimate/contact form:
  - `index.html`
  - Netlify form: `instant-estimate`
  - confirmed-success tracking: `generate_lead`
- Phone links:
  - tracked by Growth-002 as `phone_click`
- Email links:
  - tracked by Growth-002 as `email_click`
- Project-photo CTAs:
  - tracked by Growth-002 as `project_photo_click`
- Estimate / consultation CTAs:
  - tracked by Growth-002 as `estimate_click`
- Car QR landing page:
  - `car.html`
  - campaign label: `car_qr`
  - supporting event: `car_campaign_engagement`
- SMS and WhatsApp:
  - Growth-002 supports `sms_click` and `whatsapp_click`
  - no live SMS/WhatsApp links were confirmed in the inspected priority pages

Automatically knowable source evidence:

- GA4 event name and page path
- landing page
- campaign label where known, especially `car_qr`
- CTA/contact method for tracked interactions
- UTM parameters if present in future URLs

Manually entered evidence:

- whether the contact is a genuine lead
- service requested
- city/project location
- qualification decision
- quote amount
- won/lost outcome
- won project value
- customer-stated source when useful, such as “Google Maps” or referral name/category

## 3. Canonical Funnel

VISITOR

A person visits the website or sees a Stile di Leo business profile, social profile, vehicle QR code, referral, or other marketing touchpoint.

LEAD

A real person makes genuine project-related contact through form, phone, SMS, WhatsApp, email, social message, or another direct channel.

Important: ordinary GA4 CTA clicks are not leads by themselves. A CTA click is intent. A lead requires real contact.

QUALIFIED LEAD

The inquiry appears to concern a service Stile di Leo provides, in a workable service area, with a plausible project and enough information to continue the sales conversation.

CONSULTATION / SITE VISIT

A conversation, photo review, consultation, or site visit has occurred or been scheduled deeply enough to evaluate the project.

QUOTE SENT

A price or formal estimate has been sent to the customer.

WON

The customer has accepted the quote/project.

LOST

The lead did not become a project, or was disqualified, postponed, unresponsive, outside service area, price-sensitive, mismatched, or otherwise not won.

## 4. Lead Register Schema

Created template:

- `SEO/STILE-DI-LEO-LEAD-REGISTER-v1.0.csv`

Schema:

| Field | Purpose |
|---|---|
| `lead_id` | Unique lead identifier. Use `YYYYMMDD-001` style for real leads. |
| `date_received` | Date the inquiry was received. |
| `lead_source` | Primary acquisition source using controlled values. |
| `source_detail` | Short evidence note, such as “Google Maps call,” “vehicle QR /car,” or “customer said referral.” |
| `landing_page` | First known website page if available. Use `unknown` if unavailable. |
| `service_interest` | Primary service requested using controlled values. |
| `city` | Project city or area. |
| `contact_method` | How the lead contacted Stile di Leo. |
| `qualified` | `yes`, `no`, or `unknown`. |
| `qualification_reason` | Short reason for qualification decision. |
| `consultation_or_site_visit` | `yes` or `no`. |
| `quote_sent` | `yes` or `no`. |
| `quote_amount` | Quoted amount if available. |
| `status` | Current funnel status using controlled values. |
| `won_project_value` | Actual accepted/won project value. |
| `lost_reason` | Optional controlled lost reason. |
| `notes` | Minimal operational notes only. Do not paste full customer conversations. |

Removed/avoided fields:

- customer full name
- full email address
- full phone number
- full address
- conversation transcripts
- profit/margin fields
- complex sales-owner fields

These can be added later only if operationally necessary.

## 5. Controlled Values

`lead_source`

- `organic_google`
- `google_business_profile`
- `car_qr`
- `instagram`
- `facebook`
- `tiktok`
- `referral`
- `designer_builder`
- `direct`
- `paid_google`
- `other`
- `unknown`

`service_interest`

- `fireplace`
- `venetian_plaster`
- `marmorino`
- `feature_wall`
- `microcement`
- `decorative_plaster`
- `other`
- `unknown`

`contact_method`

- `form`
- `phone`
- `sms`
- `whatsapp`
- `email`
- `instagram`
- `other`

`qualified`

- `yes`
- `no`
- `unknown`

`consultation_or_site_visit`

- `yes`
- `no`

`quote_sent`

- `yes`
- `no`

`status`

- `new`
- `qualified`
- `consultation`
- `quote_sent`
- `won`
- `lost`
- `not_qualified`

`lost_reason`

- `price`
- `no_response`
- `outside_service_area`
- `service_mismatch`
- `project_postponed`
- `competitor`
- `timeline`
- `unknown`

## 6. Qualification Definition

Qualified = `yes` when all four conditions are reasonably true:

1. Service fit:
   - requested work matches a real Stile di Leo service.
2. Location fit:
   - project is in a workable Metro Vancouver / Lower Mainland service area.
3. Real project:
   - inquiry describes or demonstrates a plausible actual project.
4. Contactability / intent:
   - there is enough information to continue the sales conversation.

Qualified = `no` when a clear blocker exists:

- outside service area
- service mismatch
- spam/vendor solicitation
- no plausible project
- impossible or irrelevant request

Qualified = `unknown` when there is not enough information yet.

Budget is not required for qualification unless the customer voluntarily provides it or price mismatch becomes obvious.

## 7. Attribution Rules

Use the most reliable evidence available. Do not manufacture precision.

Recommended hierarchy:

1. Explicit tracked campaign:
   - example: `/car` or `campaign = car_qr`
2. UTM parameters:
   - example: future links with `utm_source`, `utm_medium`, `utm_campaign`
3. Direct platform evidence:
   - example: GBP call/message, Instagram DM, referral from designer/builder
4. Landing page + GA4 source/medium evidence:
   - example: organic Google session landing on `/fireplace-wall-vancouver.html`
5. Customer statement:
   - example: “I found you on Google Maps” or “my designer recommended you”
6. Unknown:
   - use `unknown` when evidence is insufficient

Attribution labels:

- DIRECTLY ATTRIBUTED:
  - campaign/UTM/platform evidence is clear
- LIKELY ATTRIBUTED:
  - landing page, GA4 source, and customer context all point in the same direction, but no deterministic link exists
- UNKNOWN:
  - source evidence is missing or contradictory

## 8. Car QR Attribution

Treat verified vehicle QR leads separately.

If evidence shows the lead came from `/car`, `/car.html`, or Growth-002 campaign context `car_qr`:

- `lead_source = car_qr`
- `source_detail = vehicle QR /car`
- `landing_page = /car.html`

Do not classify every `/car` page visitor as a lead. A lead requires genuine contact.

Future recommendation for new QR URLs:

- `utm_source=vehicle`
- `utm_medium=qr`
- `utm_campaign=rear_window`

No printed QR URL change is recommended during this sprint.

## 9. GBP Attribution

Use `google_business_profile` only where evidence supports GBP origin.

Examples:

- customer calls/messages through Google Business Profile
- customer says “Google Maps”
- customer says they found Stile di Leo in the local profile/map pack
- future GBP website links use trackable UTM parameters

Do not label every Google-origin lead as GBP.

If the lead came from organic website search, use:

- `organic_google`

If unclear, use:

- `unknown`

## 10. Revenue Attribution

Minimum financial fields:

- `quote_amount`
- `won_project_value`

Do not track profit, material cost, labor cost, tax treatment, or accounting fields in this register unless a later operational need is confirmed.

Future calculations enabled:

- Lead → Qualified rate
- Qualified → Quote rate
- Quote → Win rate
- Lead → Win rate
- Average quote value
- Average won project value
- Revenue by source
- Revenue by service
- Revenue by city
- Revenue by landing page

No revenue totals or conversion rates are calculated in this sprint because no verified historical lead dataset was provided.

## 11. Lost Lead Reasons

Optional `lost_reason` values:

- `price`
- `no_response`
- `outside_service_area`
- `service_mismatch`
- `project_postponed`
- `competitor`
- `timeline`
- `unknown`

Use one value only. Add detail in `notes` only if it is operationally useful.

This helps distinguish:

- marketing/source quality problems
- qualification problems
- sales/timing problems
- price-fit problems

## 12. Monthly Scorecard

One-page monthly scorecard:

| Metric | Source |
|---|---|
| Website sessions | GA4 |
| Organic clicks | GSC |
| Leads | Lead Register + GA4 lead events |
| Qualified leads | Lead Register |
| Quotes | Lead Register |
| Won projects | Lead Register |
| Lead → qualified rate | Lead Register |
| Quote → win rate | Lead Register |
| Average won project value | Lead Register |
| Attributed project value | Lead Register |

Breakdowns where data permits:

- source
- service
- city
- landing page

Keep the scorecard small enough to understand in approximately one minute.

## 13. GSC → GA4 → Revenue Model

Interpret the systems together like this:

GSC:

- query
- impression
- click

GA4:

- landing page
- CTA event
- confirmed form lead event where available

Lead Register:

- genuine lead
- qualified lead
- quote sent
- won/lost
- project value

Important interpretation rules:

- GSC does not identify individual leads.
- GA4 does not reliably identify whether a lead was qualified or won.
- The lead register is the source of truth for lead quality and revenue outcome.
- Use DIRECTLY ATTRIBUTED / LIKELY ATTRIBUTED / UNKNOWN rather than pretending every lead has perfect attribution.

## 14. Privacy Rules

- Do not send customer PII into GA4.
- Do not copy full customer conversations into analytics or the register.
- Do not store uploaded photo filenames or photo contents in analytics.
- Keep `notes` short and operational.
- Avoid storing full address unless it becomes necessary for real operations.
- Use city/area rather than exact address for reporting.
- Store only the information needed to understand lead quality and project outcome.

## 15. Implementation Decision

Recommended implementation:

- CSV/spreadsheet register.

Not recommended at this stage:

- custom CRM
- database
- marketing automation system
- new website JavaScript
- new forms
- complex scoring model

Reason:

The business needs reliable lead-quality and revenue outcome tracking before it needs more software.

## 16. Operating Procedure

Routine workflow, under approximately one minute per new lead:

NEW INQUIRY

1. Add one row.
2. Enter:
   - `lead_id`
   - `date_received`
   - `lead_source`
   - `source_detail`
   - `landing_page`
   - `service_interest`
   - `city`
   - `contact_method`
   - `status = new`

AFTER FIRST REAL CONVERSATION / PHOTO REVIEW

1. Set `qualified` to `yes`, `no`, or `unknown`.
2. Add a short `qualification_reason`.
3. Update `status`.

AFTER CONSULTATION / SITE VISIT

1. Set `consultation_or_site_visit = yes`.
2. Update `status = consultation`.

AFTER QUOTE

1. Set `quote_sent = yes`.
2. Enter `quote_amount`.
3. Update `status = quote_sent`.

AFTER CUSTOMER DECISION

1. If accepted:
   - `status = won`
   - enter `won_project_value`
2. If not accepted:
   - `status = lost`
   - select one `lost_reason`

No daily reporting is required.

## 17. Historical Data Policy

Do not fabricate historical leads.

If verified historical records become available, they can be entered later only when there is enough evidence to avoid misleading attribution.

If source, landing page, or lead origin is unclear, use:

- `unknown`

Start clean from implementation date if historical data is unavailable.

The CSV template includes two rows beginning with `EXAMPLE-` only. They are examples, not real leads.

## 18. Decision Thresholds

Minimum evidence rules:

- Do not kill a source after one bad lead.
- Do not call a landing page successful because it produced one inquiry.
- Do not infer lead quality from CTA clicks alone.
- Do not optimize solely for lead quantity.
- Do not compare services until enough qualified leads exist to make the comparison meaningful.
- Prefer qualified leads, quotes, won projects, and project value over vanity traffic.
- Treat early data as directional until patterns repeat across multiple leads.

Practical first review threshold:

- review monthly, but avoid major strategy decisions until at least several real leads have accumulated per source or service.

## 19. Files Created

- `SEO/GROWTH-003-LEAD-QUALITY-ATTRIBUTION-v1.0.md`
- `SEO/STILE-DI-LEO-LEAD-REGISTER-v1.0.csv`

## 20. Website Changes Made

None.

No production website files were changed during GROWTH-003.

## 21. Recommended GROWTH-004

Recommended GROWTH-004:

- Create the first monthly acquisition scorecard template using GSC + GA4 + the lead register.
- Define a simple monthly review workflow.
- Decide whether GBP website links and future QR/social links should receive consistent UTM parameters.
- Do not expand into CRM automation until the manual register proves which fields are genuinely useful.

