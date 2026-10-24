# Customer Language & Qualified Inquiry Sprint v1.0

Date: 2026-10-23
Repository: /Users/vladyslavdementiev/Documents/GitHub/stiledileo-site
Branch: main
Baseline commit: 6acfe60cdf15d7fc8a1250e900e7205093b7e425
Status: CUSTOMER LANGUAGE SPRINT READY FOR HUMAN REVIEW
Publication: local edits only; no commit, push, deployment, advertising or external account changes.

## 1. Objective and evidence boundary

Make it easier for homeowners to recognize a suitable finish, see completed work and request a review without knowing material terminology. Preserve the path for designers, general contractors and commercial clients.

Mediterranean-inspired describes one possible appearance. It is not a new service category, a claim about Canadian preferences, or a verified keyword-volume opportunity. No traffic, ranking or lead increase is forecast.

Project descriptions use the existing approved case studies. Material suitability remains project-specific. No wet-area, waterproofing, countertop, exterior repair, universal heat-resistance or guaranteed no-demolition claims were introduced.

## 2. Comprehension and contact problems addressed

| Page | Problem | Change |
|---|---|---|
| Feature Wall | Intro and navigation explained website categories rather than helping a customer select a result | Describes softly textured backdrops and sculptural focal points, then links to the finish information |
| Feature Wall | Finish list named effects without showing which completed work illustrates them | Replaced it with three visual choices linked to Brookswood, West Vancouver and the sculptural project |
| Feature Wall | Requested a reference image without explaining the single-file form limitation | Requests one surface photo; suggests an inspiration link in the notes or a separate email |
| Marmorino | Repeated abstract terms such as material character, finish direction and mineral depth | Describes layered colour, trowel marks, texture, sheen and product/application differences |
| Marmorino | Hero caption and category explanation contained editorial language | Caption now describes visible room elements; the material relationship is explained without website architecture references |
| Marmorino | Estimate buttons led to the general contact section | Both now open the existing homepage photo intake directly |
| Homepage | Supporting copy gave less prominence to the surface a homeowner wants to change | Names fireplaces and feature walls while retaining commercial interiors and material names |
| Homepage | Project-photo CTA took an extra trip through the contact section | Points directly to the existing photo intake |
| Homepage | Some photo links depended on a hash change, so closing and clicking again could leave the form closed | Hero and project-block links now use the existing data-photo-intake handler and dialog ARIA attributes |

No sections, galleries or service pages were added. Existing finish-selection content was replaced. No CSS, JavaScript, image, video, navigation, sitemap or routing files were edited.

## 3. Page scope and exact copy review

Changed production files:

- feature-wall-vancouver.html
- marmorino-vancouver.html
- index.html

Created report:

- SEO/CUSTOMER-LANGUAGE-QUALIFIED-INQUIRY-SPRINT-v1.0.md

Reviewed and left unchanged:

- fireplace-wall-vancouver.html
- venetian-plaster-vancouver.html

Titles, H1s, meta descriptions, canonicals, OG URLs, robots directives, inline styles and script blocks are byte-identical to the baseline on all three edited pages. The exact before/after copy and attributes are included in Appendix A as the complete production-file diff.

## 4. Project evidence and imagery

| Evidence | Facts used | Use in this sprint |
|---|---|---|
| Brookswood / Langley case study | Dated brick fireplace; light San Marco Marmorino Antico; raised botanical detailing; preparation photographs | Warm textured appearance and hand-shaped detail; no claim about the client's requested design style |
| West Vancouver case study | Dark large-format tile; light Marmorino; piano and timber floor visible in room photography | Simpler contemporary appearance and relationship to the room |
| Custom architectural rock installation | Sculpted relief and integrated lighting for a dry interior feature | Dimensional wall option with direct project link |
| Existing homepage commercial work | Commercial project, trade path and project imagery already present | Retained unchanged |

All existing image sources and responsive candidates remain unchanged. No new imagery was created, substituted, cropped or relabelled as a newly verified project. Existing decorative room imagery was not used as the basis for new client, product, location or performance claims.

The Marmorino hero caption now describes visible elements only; it no longer asserts that the photograph is project evidence or identifies a particular material composition.

## 5. Photo intake and customer journey

Current form supports:

- One required project image, up to 7 MB.
- Phone or email.
- Optional city.
- Optional dimensions/project note.
- Existing campaign/source fields.

There is no separate inspiration-image upload. Copy now suggests an inspiration URL in the notes or a separate email attachment. The customer does not need a material name. No form fields, validation logic or lead system were added.

Expected journey:

Feature Wall -> visual choice -> existing case study -> photo intake.

Marmorino -> plain-language explanation -> completed fireplaces -> photo intake.

Homepage -> recognizable surface/application -> completed work -> photo intake.

The surface still needs review before scope or pricing is confirmed. No response-time or exact-photo-quote guarantee was added. Existing email/phone alternatives and commercial drawing intake remain available.

Confirmed interaction correction: using an ordinary #estimate anchor could fail to reopen an already closed modal when the hash was unchanged. Adding the existing modal attributes to the hero and edited project-block CTA fixes this without changing the form script.

## 6. Analytics and qualification

Shared analytics file and inline form scripts remain unchanged.

Verified existing semantics:

| Action | Event | Interpretation |
|---|---|---|
| Feature Wall photo CTA | project_photo_click; service=feature_wall | Contact intent, not a lead |
| Marmorino estimate CTA | estimate_click; service=marmorino | Contact intent, not a lead |
| Homepage photo CTA | project_photo_click | Contact intent, not a lead |
| Accepted form response | generate_lead through trackLeadSuccess | Accepted website inquiry, not automatically qualified |
| Failed form response | No accepted-lead hook | No confirmed inquiry |

Production-host behavior was tested in a network-free VM using the actual analytics script. Browser tests ran locally with analytics delivery suppressed. Synthetic accepted/failed form responses were intercepted locally; no real Netlify submission was sent.

Checks passed:

- Clicks do not create generate_lead events.
- Accepted lead IDs are de-duplicated.
- Failed responses do not invoke the accepted-lead hook.
- City, email and project-note content stay out of the tested lead-hook payload.
- Existing same-tab acquisition context retains UTM content and service.
- Local browser activity does not populate production analytics.

Existing project-card navigation also uses project_photo_click. For a Send Photo metric, filter by CTA text/location and destination; do not interpret every event with that name as a photo-intake attempt.

Reuse SEO/STILE-DI-LEO-LEAD-REGISTER-v1.0.csv. Do not create another CRM.

Operational stages:

INQUIRY -> QUALIFIED -> CONSULTATION / SITE VISIT -> QUOTE SENT -> WON / LOST.

Record a real contact once. Qualification means a supported application, workable location and enough project detail to continue. Assess scope, schedule and commercial fit during follow-up without inventing a new minimum price.

Use existing fields for source, landing page, service, city, qualification reason, consultation, quote, status and won value. Record the messaging variant in source_detail or notes in the private lead log; never put customer contact details into campaign URLs or analytics.

## 7. Matched customer-acquisition test pack

Recommendations only. No campaign, draft ad or spend was created.

### Shared conditions

Use the same approved Brookswood before/after image for all three concepts:

marketing/week-1/brookswood/stile-di-leo-brookswood-fireplace-before-after-v1.jpg

Underlying completed-project photography:

images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-after-hero-01.jpg

Landing page for every concept:

https://stiledileo.com/fireplace-wall-vancouver.html

CTA for every concept: Send a Fireplace Photo.

Use the same image, crop, layout, audience, geography, placements, destination and test period. Change only the messaging. Do not use different image quality or different landing pages and then attribute the difference solely to wording.

Choose Facebook or Instagram attribution according to the actual platform. Keep traffic within the service area the owner is prepared to cover. Use the platform's controlled experiment facility if available and an owner-approved budget. Do not introduce speculative audience or cost claims.

### A. Transformation-led

Hook: From dated brick to a lighter fireplace.

Headline: Transform Your Fireplace

Caption:
This Brookswood fireplace went from exposed brick to a light Marmorino finish with raised botanical detail. Planning a change to your own fireplace? Send a photo, your city and approximate dimensions so we can review the surface and discuss what may be possible.

CTA: Send a Fireplace Photo

Attribution:
utm_source=facebook
utm_medium=paid_social
utm_campaign=fireplace_messages_v1
utm_content=transformation

### B. Mediterranean-inspired appearance

Hook: Warm texture. A softer focal point.

Headline: A Warmer Look for Your Fireplace

Caption:
Drawn to Mediterranean-inspired interiors? The light plaster and botanical detail on this completed Brookswood fireplace offer one reference for a warmer, textured focal point. Send a photo of your fireplace and the look you like; we can discuss suitable finishes after reviewing the surface.

CTA: Send a Fireplace Photo

Attribution:
utm_source=facebook
utm_medium=paid_social
utm_campaign=fireplace_messages_v1
utm_content=mediterranean

The style description is an interpretation of the finished appearance, not a claim about the client's brief or the style of every Stile di Leo project.

### C. Material / craftsmanship-led

Hook: Marmorino, applied by hand.

Headline: Hand-Finished Marmorino Fireplaces

Caption:
San Marco Marmorino Antico and raised botanical detailing give this Brookswood fireplace its finished appearance. See the original brick, preparation and completed work. Send a photo of your fireplace to discuss the preparation and finish options your project may need.

CTA: Send a Fireplace Photo

Attribution:
utm_source=facebook
utm_medium=paid_social
utm_campaign=fireplace_messages_v1
utm_content=craftsmanship

For Instagram delivery, use utm_source=instagram and preserve the same campaign/content naming. Add these parameters to the existing landing URL; do not create a campaign page.

### Evaluation

Primary business observations:

- Number of suitable inquiries by messaging variant.
- Cost per qualified inquiry, if the campaign runs with recorded spend.
- Progression to consultation/site visit and estimate.
- Won projects and value when the sales cycle allows.

Supporting observations:

- Landing visits, CTA clicks and form starts.
- Inquiry completion.
- Customer-stated style/material vocabulary.
- Disqualification reasons.

Do not declare a winner from a few clicks, one lead or unequal delivery. If the agreed budget ends before enough comparable inquiry outcomes exist, label the result INCONCLUSIVE. No universal sample-size, CPC, CPL or conversion forecast is asserted. Pause for broken destinations, failed contact flow, unsupported-scope inquiries that cannot be corrected, or the agreed spend cap; never keep spending simply to reach an arbitrary result.

## 8. Thirty-day operating plan

Days are relative to a future approved release; no deployment or automation was scheduled.

| Period | Owner action | Measurement |
|---|---|---|
| Days 1-3 | Review exact diff and rendered pages; approve final wording and test asset; confirm capacity, service geography and budget | Capture a dated baseline from available GA4/GSC plus the existing lead register; mark missing data unknown |
| Days 4-7 | After approval, release the reviewed changes through the normal workflow; verify live photo intake and analytics; launch the matched message test only with separate authorization | Record actual publication/launch times, spend and variant attribution |
| Days 8-14 | Follow up on real inquiries using the current business process; record qualification and estimate progression | Compare application fit, usable project details and disqualification reasons |
| Days 15-21 | Review delivery balance and lead quality; fix only confirmed campaign/contact defects | Separate style-led interest from actual estimate opportunities; keep low samples inconclusive |
| Days 22-30 | Review inquiries, qualified opportunities, quotes and wins where available; decide whether to continue, revise or stop the test | Prefer qualified opportunity value over likes or cheap clicks; document sales still pending |

Search titles and H1s were held stable. Compare current search data using matched query, geography, device and date dimensions where available; do not attribute ranking or CTR movement to this copy change without accounting for those factors.

## 9. Validation results

| Check | Result |
|---|---|
| Normal local Netlify build | PASSED: netlify build --offline using the installed CLI; five serverless functions and one edge function bundled; no publish operation |
| Analytics syntax | PASSED: node --check scripts/analytics.js |
| Existing foundation/measurement tests | PASSED: 111 tests, zero failures |
| HTML structural validation | PASSED on all three edited pages using html-validate: close order, permitted content, duplicate IDs, attribute quoting, valid IDs and void content |
| Repository SEO validator | FAILED with 143 pre-existing diagnostics; full diagnostics exactly match the baseline, all involving /.netlify/images? URLs treated as literal local files |
| Independent local reference/image validation | PASSED: 276 source references, including 168 image candidates; Netlify transformation URLs unwrapped to their real source assets and exact filename case checked |
| Fragment/CTA validation | PASSED: 24 fragment references, including the intentionally JavaScript-handled #estimate destination |
| Metadata/H1/canonical invariants | PASSED: unchanged; one H1 on each page |
| JSON-LD | Existing homepage block parses and is unchanged; no FAQ JSON-LD exists in either baseline or current Feature Wall/Marmorino files, so none was added or left stale |
| Style/script preservation | PASSED: inline style and script blocks byte-identical |
| Diff whitespace | PASSED: git diff --check |
| Scope | Three production HTML files plus this report; no assets, service pages, shared script/style files or metadata changed |

The SEO validator was not modified or bypassed to manufacture a clean exit. It tests the literal CDN endpoint as if it were a repository file. The independent source check establishes that the edited pages' source assets and links resolve locally; production Image CDN behavior is outside this local check.

## 10. Rendered and interaction QA

Preview:
http://127.0.0.1:4197/

The temporary loopback server serves the current canonical repository. It uses Sharp to simulate Netlify image transforms from the unchanged real source files. It is not a Netlify deployment and does not reproduce edge functions, production CDN caching or live form delivery.

| Page | 1440px | 390px | 375px |
|---|---|---|---|
| Feature Wall | PASS | PASS | PASS |
| Marmorino | PASS | PASS | PASS |
| Homepage | PASS | PASS | PASS |

Full-page scroll/load checks and screenshots found zero horizontal overflow, broken visible images, page JavaScript errors, console errors or visible development placeholders. Fonts loaded without font errors. Edited sections were inspected in close-up at all three widths.

Final CTA targets measure approximately:

- Feature Wall: 217 x 48 CSS pixels.
- Marmorino: 226 x 48 CSS pixels.
- Homepage: 234 x 54 desktop; 300 x 54 at 390px; 285 x 54 at 375px.

Service hero/final CTA navigation, modal closing, required-photo validation and local simulated form failure/success passed at all three widths. The homepage project CTA opens and reopens after Escape with the same URL hash. Keyboard Escape and focus handling use the existing dialog implementation.

The browser cancelled some homepage hero-video requests while scrolling/navigating; no video source was changed and no associated page/console error occurred. No claim of a full accessibility, field performance, Safari or physical-device audit is made.

Review artifacts are local and are not production assets:

- /private/tmp/stiledileo-customer-language-qa/results.json
- /private/tmp/stiledileo-customer-language-qa/feature-wall-vancouver.html-1440-full.png
- /private/tmp/stiledileo-customer-language-qa/marmorino-vancouver.html-1440-full.png
- /private/tmp/stiledileo-customer-language-qa/index.html-1440-full.png
- /private/tmp/stiledileo-customer-language-qa/feature-wall-vancouver.html-390-sequence.png
- /private/tmp/stiledileo-customer-language-qa/marmorino-vancouver.html-390-sequence.png
- /private/tmp/stiledileo-customer-language-qa/feature-wall-vancouver.html-375-hero.png
- /private/tmp/stiledileo-customer-language-qa/marmorino-vancouver.html-375-final.png
- /private/tmp/stiledileo-customer-language-qa/index.html-375-contact.png

Additional selection/process/contact screenshots exist in the same directory for each viewport. Screenshots are snapshots, not permanent project evidence.

## 11. Remaining human inputs and release sequence

No remaining blocker to reviewing this package.

Human inputs before a paid test:

- Approve copy and chosen campaign photograph.
- Confirm available project capacity, workable geography and campaign budget.
- Supply a current, comparable analytics/lead baseline where available.
- Assign responsibility for follow-up and updating the existing lead register.
- Confirm live event receipt and form delivery after an approved release.
- Check creative/account placement requirements when the campaign is actually prepared.

The unchanged SEO validator diagnostic limitation should be tracked separately. Do not broaden this copy sprint into a shared-validator repair.

Release sequence: review diff and local pages -> obtain approval -> separately authorize commit/push/release -> verify live CTA/form delivery and measurement -> separately approve advertising -> evaluate qualified outcomes. No step after local review has been performed.

## Appendix A. Exact before/after production diff

The following is the complete diff for the three edited HTML files. Removed lines are the prior copy; added lines are the implemented copy and contact attributes.

```diff
diff --git a/feature-wall-vancouver.html b/feature-wall-vancouver.html
index 73e778b..01aeac9 100644
--- a/feature-wall-vancouver.html
+++ b/feature-wall-vancouver.html
@@ -245,7 +245,7 @@
       <p class="hero-kicker">Vancouver Feature Walls</p>
       <h1>Feature Wall<br>Vancouver</h1>
       <p>
-        Custom Venetian plaster feature walls in Vancouver for living rooms, bedrooms, dining areas, fireplace compositions, and modern interiors that deserve a stronger focal point.
+        Turn a plain wall into a softly textured backdrop or a sculptural focal point. Custom Venetian plaster feature walls for living spaces across Metro Vancouver.
       </p>
       <a class="btn" href="/#estimate" data-track="send_photo">Send a Wall Photo</a>
     </div>
@@ -256,15 +256,15 @@
     <div class="intro">
       <div class="intro-copy">
         <p>
-          At Stile di Leo, we create handcrafted Venetian plaster statement walls that bring depth, movement, and a refined architectural finish to contemporary interiors.
+          A softly varied wall behind a sofa, a textured bedroom backdrop or a sculpted feature can change how a room feels. Stile di Leo creates these surfaces by hand, with the colour, texture and sheen chosen for the space.
         </p>
 
         <p>
-          Rather than treating a feature wall as simple decoration, we design it as part of the room. The finish, scale, and placement are considered in relation to lighting, furniture, millwork, fireplaces, and the overall mood of the home.
+          We consider the wall alongside your lighting, furniture and surrounding materials. The completed projects below show two different approaches to a plaster focal point.
         </p>
 
         <p>
-          If you are looking more broadly for <a href="/venetian-plaster-vancouver.html">Venetian plaster Vancouver</a> rather than a dedicated focal wall, start with the main service page and then return here for feature-wall-specific planning.
+          To understand the material and its applications, explore our <a href="/venetian-plaster-vancouver.html">Venetian plaster finishes</a>.
         </p>
       </div>
 
@@ -297,7 +297,7 @@
         <li><strong>Wall details:</strong> include the width, height, corners, outlets and any TV mount or shelving that needs coordination.</li>
         <li><strong>Budget:</strong> separate the decorative finish from preparation, access and additional detailing when comparing estimates.</li>
       </ul>
-      <p><a href="/#estimate">Send a wall photo for a project review</a>. Include your city, approximate dimensions and a reference image if you have one.</p>
+      <p><a href="/#estimate" data-track="send_photo">Send a wall photo for a project review</a>. Add your city and approximate dimensions in the notes. If you have an inspiration image, include a link or email it separately. You do not need to know the material name.</p>
     </section>
     <div class="section">
       <h2>Where Feature Walls Work Best</h2>
@@ -345,16 +345,15 @@
     </div>
 
     <div class="section">
-      <h2>Popular Feature Wall Directions in Vancouver</h2>
+      <h2>Choose the Look for Your Room</h2>
       <ul>
-        <li>Soft tonal plaster for calm contemporary homes</li>
-        <li>Marble-look finishes for dramatic focal walls</li>
-        <li>Warm neutral textures that complement oak, stone, and bronze</li>
-        <li>Minimal modern finishes for condo interiors and clean layouts</li>
+        <li><strong>Warm, softly textured plaster:</strong> light tones and gentle variation for a Mediterranean-inspired or relaxed interior. The <a href="/brookswood-langley-fireplace-transformation.html">Brookswood fireplace</a> pairs a light Marmorino surface with raised botanical detailing; its photographs show both the texture and the hand-shaped detail.</li>
+        <li><strong>Understated contemporary plaster:</strong> a continuous surface with subtle variation for a living-room focal wall. See how the <a href="/west-vancouver-fireplace-transformation.html">West Vancouver finish sits within the room</a>, beside the piano and timber floor.</li>
+        <li><strong>Sculpted stone texture:</strong> pronounced relief for a dry interior feature where the surface itself becomes the focal point. Explore the <a href="/custom-architectural-rock-installation.html">hand-sculpted architectural stone project</a> to see the texture and integrated lighting.</li>
       </ul>
       <p>
-        If you are still exploring visual ideas room by room, visit
-        <a href="/feature-wall-ideas-vancouver.html">Feature Wall Ideas Vancouver</a> for inspiration.
+        Still deciding where to place the feature? Browse
+        <a href="/feature-wall-ideas-vancouver.html">wall ideas by room</a> before selecting a finish.
       </p>
     </div>
 
@@ -386,7 +385,7 @@
         Vancouver interiors often favor clean lines, premium materials, and subtle contrast. Venetian plaster feature walls complement that approach by adding richness without clutter, making them especially effective in luxury condos, renovated living rooms, and refined open-plan homes.
       </p>
       <p>
-        For a more sculptural dry interior feature direction, view the completed <a href="/custom-architectural-rock-installation.html">custom architectural rock installation</a>.
+        For a more dimensional surface, view the completed <a href="/custom-architectural-rock-installation.html">custom architectural rock installation</a>.
       </p>
     </div>
 
@@ -407,9 +406,9 @@
     <div class="cta">
       <h2>Request a Consultation</h2>
       <p>
-        Tell us about your room, wall dimensions, and design direction and we will help you create a feature wall that feels tailored to your Vancouver interior.
+        Start with a photo of your wall, your city and approximate dimensions. Describe the look you want in your own words; we can discuss finishes after reviewing the surface.
       </p>
-      <a href="/#estimate" class="btn">Send a Wall Photo</a>
+      <a href="/#estimate" class="btn" data-track="send_photo">Send a Wall Photo</a>
     </div>
 
   </div>
diff --git a/index.html b/index.html
index 7c19950..91814b9 100644
--- a/index.html
+++ b/index.html
@@ -2450,10 +2450,10 @@
       <div class="hero-main">
         <span class="eyebrow">Vancouver · Residential &amp; Commercial Finishes</span>
         <h1 class="hero-title">Walls that define the entire room</h1>
-        <p class="hero-copy">Hand-finished Venetian plaster and decorative wall finishes for homes and commercial interiors across Metro Vancouver.</p>
+        <p class="hero-copy">Custom finishes for fireplaces, feature walls and commercial interiors across Metro Vancouver. Hand-applied Venetian plaster and decorative surfaces, chosen for your space.</p>
         <div class="hero-mobile-frame"><a class="hero-retail-preview" href="/holt-renfrew-limewash-vancouver.html" data-track="project_photo"><picture><source type="image/webp" srcset="/images/projects/holt-renfrew/holt-renfrew-finished-interior-600.webp 600w, /images/projects/holt-renfrew/holt-renfrew-finished-interior-1200.webp 1200w" sizes="90px"><img src="/images/projects/holt-renfrew/holt-renfrew-finished-interior.jpg" width="1200" height="2127" loading="eager" decoding="async" class="" alt="Hand-applied decorative wall finish at Holt Renfrew Vancouver beside clothing displays and an upholstered bench"></picture><span class="hero-retail-preview-copy"><small>Featured commercial project</small><strong>Holt Renfrew</strong><span>Vancouver · 8 units<br>View the project →</span></span></a></div>
         <div class="btn-row">
-          <a href="#estimate" class="btn btn-primary" data-track="send_photo">Send Project Photo</a>
+          <a href="#estimate" class="btn btn-primary" data-photo-intake data-track="send_photo" aria-controls="estimate-modal" aria-haspopup="dialog">Send Project Photo</a>
           <a href="#trade" class="btn btn-secondary">For GCs &amp; Designers</a>
         </div>
         <div class="hero-mobile-links">
@@ -2607,8 +2607,8 @@
               <div>
                 <span class="project-kicker">Start With Proof</span>
                 <h3 class="project-title">Have a wall or fireplace to transform?</h3>
-                <p class="project-text">Send a photo of the surface and a few project details. We can review the fit and discuss the right finish direction.</p>
-                <a href="#contact" class="btn btn-primary" data-track="send_photo" style="margin-top:20px;">Send Project Photos</a>
+                <p class="project-text">Send a photo of your wall or fireplace, your city and approximate dimensions. You do not need to know the material name to start.</p>
+                <a href="#estimate" class="btn btn-primary" data-photo-intake data-track="send_photo" aria-controls="estimate-modal" aria-haspopup="dialog" style="margin-top:20px;">Send Project Photos</a>
               </div>
             </article>
           </div>
@@ -2872,7 +2872,7 @@
         <div class="section-head reveal">
           <span class="eyebrow">Process</span>
           <h2 class="section-title">A simple path from photo to <em>finished wall</em></h2>
-          <p class="section-copy">The process stays minimal and clear. You share the space, we shape the direction, and the wall is developed with the same restraint as the design itself.</p>
+          <p class="section-copy">Start with the surface you want to change and the look you have in mind. We review the project before discussing preparation, finish options and scope.</p>
         </div>
 
         <div class="process-intro-grid">
@@ -2903,7 +2903,7 @@
           <article class="process-card reveal delay-1">
             <span class="process-index">01</span>
             <h3 class="process-title">Send photos</h3>
-            <p class="process-text">Share a few images of the wall, the room, and any references that match the atmosphere you want.</p>
+            <p class="process-text">Upload one photo of your surface, then add your city and approximate dimensions. Include an inspiration link in the notes, or email additional images separately.</p>
           </article>
 
           <article class="process-card reveal delay-2">
@@ -2933,7 +2933,7 @@
           <div class="cta-content">
             <span class="eyebrow">Private Consultation</span>
             <h2 class="cta-title">Bring your space to life</h2>
-            <p class="cta-copy">Send a wall photo and a short note about the room. We’ll shape a premium direction for your surface before anything is built.</p>
+            <p class="cta-copy">A wall or fireplace photo is enough to start. Add your city, approximate dimensions and the look you want. We will review the surface before discussing scope and pricing.</p>
             <div class="btn-row">
               <a href="#estimate" class="btn btn-primary" data-photo-intake data-track="send_photo" aria-controls="estimate-modal" aria-haspopup="dialog">Send Project Photo</a>
               <a href="mailto:designstiledileo@gmail.com?subject=Free%20Visualization%20Request" class="btn">Ask About a Free Visualization</a>
@@ -2971,7 +2971,7 @@
 
         <section class="estimate-step is-active" data-step="0">
           <h2 class="estimate-step-title" id="estimate-title" tabindex="-1">Send your project photo</h2>
-          <p class="estimate-step-text">Step 1 of 2. Share a photo for a manual review of your surface and finish direction.</p>
+          <p class="estimate-step-text">Step 1 of 2. Share one photo of the surface you want to change. You do not need to know the material name.</p>
           <p class="estimate-note">No photo yet? <a href="mailto:designstiledileo@gmail.com?subject=Project%20Enquiry">Email your project details</a> or <a href="tel:+16047732298">call Leo</a> to discuss the surface, approximate dimensions and location.</p>
           <p class="estimate-note" id="estimate-advisor-note" hidden>Your Finish Advisor notes are editable in step 2. Please attach your photo here if it is not already selected. Nothing is submitted until you choose Send Project Photo.</p>
           <label class="estimate-upload" for="estimate-photo">
diff --git a/marmorino-vancouver.html b/marmorino-vancouver.html
index 9d62273..f094fec 100644
--- a/marmorino-vancouver.html
+++ b/marmorino-vancouver.html
@@ -325,17 +325,17 @@
       <p class="kicker">Vancouver Marmorino Finishes</p>
       <h1>Marmorino Vancouver</h1>
       <p>
-        Hand-applied Marmorino finishes for fireplaces, feature walls, living rooms, and refined interior surfaces that need more depth and material character than paint.
+        Softly varied colour, a smooth or textured surface, and a sheen chosen for the room. Hand-applied Marmorino for fireplaces and feature walls across Metro Vancouver.
       </p>
       <div class="actions">
-        <a href="/#contact" class="btn">Request an Estimate</a>
-        <a href="#projects" class="btn secondary">View Real Projects</a>
+        <a href="/#estimate" class="btn" data-track="estimate">Request an Estimate</a>
+        <a href="#projects" class="btn secondary">View Finished Projects</a>
       </div>
     </div>
 
     <figure>
       <img src="/.netlify/images?url=/images/car-marmorino.jpg&amp;w=600&amp;fm=webp&amp;q=85" width="600" height="900" alt="Warm Marmorino mineral plaster wall in a refined residential interior" srcset="/.netlify/images?url=/images/car-marmorino.jpg&amp;w=480&amp;fm=webp&amp;q=85 480w, /.netlify/images?url=/images/car-marmorino.jpg&amp;w=600&amp;fm=webp&amp;q=85 600w" sizes="(max-width: 900px) calc(100vw - 40px), 600px" decoding="async" loading="eager" fetchpriority="high">
-      <figcaption>Real Stile di Leo mineral plaster photography used for material direction.</figcaption>
+      <figcaption>Warm neutral walls, a stone mantel and layered tones in a living room.</figcaption>
     </figure>
   </section>
 
@@ -345,20 +345,20 @@
       <div>
         <h2>What Marmorino Is</h2>
         <p>
-          Marmorino is a hand-applied decorative plaster finish used when a wall should feel more architectural, mineral, and custom than a standard painted surface. It can create a smooth, refined appearance with depth, soft movement, and finish character that changes with light.
+          Marmorino is a decorative plaster applied by hand. Its layered colour and trowel marks give walls a varied appearance rather than a uniform painted colour. Texture and sheen depend on the selected product and application.
         </p>
       </div>
       <div class="panel">
-        <h3>A Material-Led Finish</h3>
+        <h3>Start with the Look You Want</h3>
         <p>
-          The appeal is not a printed pattern or a flat colour. It comes from preparation, hand application, subtle surface movement, and the way the finish is developed for the room.
+          Warm neutrals and soft texture can suit a Mediterranean-inspired interior; a quieter surface can work in a contemporary room. Bring a reference you like, and we can discuss which finish may suit your wall.
         </p>
       </div>
     </section>
 
     <section class="section">
       <h2>Where Marmorino Works</h2>
-      <p>For commercial spaces, explore <a href="/marmorino-retail-interiors.html">Marmorino for retail interiors</a> — a finish direction considered around architectural curves, millwork and lighting.</p>
+      <p>For commercial spaces, explore <a href="/marmorino-retail-interiors.html">Marmorino for retail interiors</a>, with examples of curved surfaces, millwork and lighting.</p>
       <p>
         Stile di Leo uses Marmorino where the surface has a clear role in the room: a fireplace elevation, a feature wall behind the main seating area, a living-room focal wall, a <a href="/plaster-range-hood-vancouver.html">custom plaster range hood surround</a>, or another selected interior surface that should feel quietly elevated.
       </p>
@@ -385,7 +385,7 @@
           Fireplace walls are one of the strongest places to consider Marmorino. On suitable prepared surfaces, it can help an existing or newly planned fireplace feel more continuous, architectural, and integrated with the room.
         </p>
         <p>
-          Because fireplace projects depend on the existing construction, substrate condition, clearances, and finish direction, each one should be reviewed before a scope is confirmed. For broader planning, see <a href="/fireplace-wall-vancouver.html">fireplace transformations</a>.
+          Fireplace work depends on the existing construction, substrate condition, clearances and selected finish. Each project needs review before a scope is confirmed. See our <a href="/fireplace-wall-vancouver.html">fireplace transformations</a> for project and planning information.
         </p>
       </div>
       <div>
@@ -394,28 +394,27 @@
           The final appearance depends heavily on what happens before the decorative finish. Substrate condition, leveling, edges, corners, and surface preparation all affect how clean and refined the finished Marmorino wall will feel.
         </p>
         <p>
-          Stile di Leo reviews the wall, the surrounding materials, and the desired finish character before recommending the right approach.
+          Stile di Leo reviews the wall, surrounding materials and desired appearance before recommending an approach.
         </p>
       </div>
     </section>
 
     <section class="section">
-      <h2>Finish Character</h2>
+      <h2>Colour, Texture and Sheen</h2>
       <p>
-        Marmorino can be calm and understated or more expressive depending on colour, sheen, movement, and the room around it. The strongest results usually come from matching the finish to the architecture rather than forcing a surface effect onto every wall.
+        Consider how much variation you want to see, how pronounced the texture should be and how much light the surface should reflect. The available combinations depend on the product and application.
       </p>
       <ul class="list">
-        <li>Subtle movement and mineral depth</li>
-        <li>Smooth, hand-applied variation</li>
-        <li>Custom colour and sheen direction</li>
-        <li>A refined alternative to ordinary paint on important walls</li>
+        <li>Colour variation: from subtle shading to more visible trowel marks</li>
+        <li>Texture: a smooth appearance or more pronounced surface detail</li>
+        <li>Sheen: selected around daylight, lamps and adjacent materials</li>
       </ul>
     </section>
 
     <section class="section" id="projects">
       <h2>Marmorino Fireplace Projects</h2>
       <p>
-        Marmorino is easiest to understand through finished rooms. These fireplace transformations show how the material can soften heavy existing surfaces and create a more continuous architectural presence.
+        Compare the botanical relief at Brookswood with the simpler fireplace face in West Vancouver. Both use light Marmorino, with different shapes and detailing.
       </p>
       <div class="project-grid">
         <a class="project-card" href="/brookswood-langley-fireplace-transformation.html" data-track="project_photo">
@@ -444,18 +443,18 @@
 
     <section class="section split">
       <div>
-        <h2>Cost and Estimate Path</h2>
+        <h2>What Affects the Estimate</h2>
         <p>
           Marmorino pricing depends on substrate condition, preparation, area, detailing, access, and finish complexity. A simple flat wall and a detailed fireplace wall are not scoped the same way.
         </p>
         <p>
-          For broader finish pricing context, review <a href="/venetian-plaster-cost-vancouver.html">Venetian plaster pricing</a>.
+          Review <a href="/venetian-plaster-cost-vancouver.html">decorative plaster pricing and preparation costs</a> to help plan your project.
         </p>
       </div>
       <div>
         <h2>How It Relates to Venetian Plaster</h2>
         <p>
-          Marmorino is part of the broader family of decorative plaster finishes, but this page is focused on the Marmorino material direction specifically. For the wider service category, see <a href="/venetian-plaster-vancouver.html">Venetian plaster services in Vancouver</a>.
+          Marmorino belongs to the decorative plaster family often described as Venetian plaster. The name alone does not specify a single texture or sheen. Explore our <a href="/venetian-plaster-vancouver.html">Venetian plaster finishes</a> to compare applications.
         </p>
       </div>
     </section>
@@ -464,27 +463,27 @@
       <h2>Frequently Asked Questions</h2>
 
       <p><strong>What is Marmorino?</strong><br>
-      Marmorino is a decorative plaster finish chosen for smooth mineral depth, hand-applied movement, and a more architectural surface than standard paint.</p>
+      Marmorino is a decorative plaster applied by hand, with layered colour and a smooth or textured appearance depending on the product and application.</p>
 
       <p><strong>Is Marmorino the same as Venetian plaster?</strong><br>
-      It is related to the broader decorative plaster category, but Marmorino has its own material character and finish direction. The right choice depends on the room and desired surface.</p>
+      Marmorino is part of the family of decorative finishes often called Venetian plaster. Compare the specific product, texture and sheen rather than choosing by the name alone.</p>
 
       <p><strong>Can Marmorino be used on fireplace walls?</strong><br>
       Yes, when the fireplace surface and project conditions are suitable and properly prepared. The existing construction should be reviewed before confirming scope.</p>
 
       <p><strong>How is Marmorino priced?</strong><br>
-      Pricing depends on preparation, wall size, detailing, access, and finish complexity. Photos and approximate dimensions help with an initial estimate direction.</p>
+      Pricing depends on preparation, wall size, detailing, access and finish complexity. Photos and approximate dimensions help us review the scope; a photo alone does not confirm a final price.</p>
 
       <p><strong>Can the colour and sheen be customized?</strong><br>
-      Yes. Colour, sheen, and movement are part of the finish direction and should be selected around the room, lighting, and surrounding materials.</p>
+      Colour and sheen options depend on the selected product and application. We consider these alongside your lighting and surrounding materials.</p>
     </section>
 
     <div class="cta">
       <h2>Planning a Marmorino Fireplace or Feature Wall?</h2>
       <p>
-        Send photos, approximate dimensions, and your city. Stile di Leo can review the surface and help define the right Marmorino finish direction for your project.
+        Send a photo of the surface, your city and approximate dimensions. You do not need to know the material name. If you have an inspiration image, add a link in the notes or email it separately. We will review the surface before discussing scope and pricing.
       </p>
-      <a href="/#contact" class="btn">Request an Estimate</a>
+      <a href="/#estimate" class="btn" data-track="estimate">Request an Estimate</a>
     </div>
 
   </main>
```

