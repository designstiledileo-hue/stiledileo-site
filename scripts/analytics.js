(function () {
  // Idempotence covers script inclusion as well as successful callback delivery.
  if (window.StileAnalytics && window.StileAnalytics.measurementVersion === "enquiry-v2") return;
  const measurement = window.StileMeasurement;
  const measurementReady = () => measurement && measurement.ready === true && measurement.enabled === true && typeof window.gtag === "function";
  const rawPath = window.location.pathname || "/";
  const pagePath = measurement && measurement.pagePath || (/^\/(?:[a-z0-9][a-z0-9/_-]*(?:\.html)?)?$/i.test(rawPath) ? rawPath : "/");
  const sentFormStarts = new WeakSet();
  const acceptedKey = "stile_accepted_lead_ids_v2";
  const acceptedTtl = 24 * 60 * 60 * 1000;
  const validId = value => typeof value === "string" && /^[a-z0-9_-]{1,128}$/i.test(value);
  const sentLeadIds = new Map();
  const pruneAccepted = () => {
    const now = Date.now();
    for (const [id, at] of sentLeadIds) {
      if (!Number.isFinite(at) || now < at || now - at >= acceptedTtl) sentLeadIds.delete(id);
    }
    while (sentLeadIds.size > 100) sentLeadIds.delete(sentLeadIds.keys().next().value);
  };
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(acceptedKey));
    if (Array.isArray(saved)) saved.slice(-100).forEach(row => {
      if (row && validId(row.id) && Number.isFinite(row.at)) sentLeadIds.set(row.id, row.at);
    });
    pruneAccepted();
  } catch (error) { /* Bounded page-lifetime deduplication still works without storage. */ }
  const adsConversion = "AW-18005193234/Wa3ECP-l0I8dEJLkxYlD";

  // Reuse the site's existing Google tag; do not install a second loader.
  if (measurementReady()) window.gtag("config", "AW-18005193234", {page_location: measurement.pageLocation, page_referrer: measurement.pageReferrer});

  const serviceByPath = {
    "/fireplace-wall-vancouver.html": "fireplace",
    "/venetian-plaster-fireplace-surround-vancouver.html": "fireplace",
    "/feature-wall-vancouver.html": "feature_wall",
    "/microcement-vancouver.html": "microcement",
    "/venetian-plaster-surrey.html": "venetian_plaster",
    "/venetian-plaster-abbotsford.html": "venetian_plaster",
    "/venetian-plaster-langley.html": "venetian_plaster",
    "/venetian-plaster-north-vancouver.html": "venetian_plaster",
    "/venetian-plaster-vancouver.html": "venetian_plaster",
    "/marmorino-vancouver.html": "marmorino",
    "/marmorino-retail-interiors.html": "marmorino",
    "/commercial-limewash-vancouver.html": "limewash",
    "/holt-renfrew-limewash-vancouver.html": "limewash",
    "/plaster-range-hood-vancouver.html": "range_hood",
    "/west-vancouver-fireplace-transformation.html": "fireplace",
    "/brookswood-langley-fireplace-transformation.html": "fireplace",
    "/custom-architectural-rock-installation.html": "feature_wall",
    "/car.html": "general",
    "/car": "general"
  };
  const measuredServices = new Set([...Object.values(serviceByPath), "commercial", "limewash", "sculptural"]);

  const campaignByPath = {
    "/car.html": "car_qr",
    "/car": "car_qr"
  };

  const normalizeText = (value) => (value || "").replace(/\s+/g, " ").trim();

  const pageService = () => serviceByPath[pagePath] || "general";
  const pageCampaign = () => campaignByPath[pagePath] || undefined;

  // Same-tab session attribution is sent with the inquiry, not as GA4 event data.
  // Empty values remain unknown; a referrer is not proof of a paid/organic source.
  const acquisitionKey = "stile_acquisition_v1";
  const acquisitionFields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "initial_landing_path", "first_referrer"];
  const readAcquisition = () => {
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(acquisitionKey));
      if (stored && typeof stored.initial_landing_path === "string") return stored;
    } catch (error) { /* Blocked storage must not prevent contact or tracking. */ }
    const query = new URLSearchParams(window.location.search);
    const entry = { initial_landing_path: pagePath, first_referrer: "", service: "general" };
    acquisitionFields.filter((key) => key.startsWith("utm_")).forEach((key) => {
      entry[key] = (query.get(key) || "").slice(0, 500);
    });
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== window.location.origin) entry.first_referrer = referrer.origin;
    } catch (error) { /* No available referrer. */ }
    return entry;
  };
  const acquisition = readAcquisition();
  if (pageService() !== "general") acquisition.service = pageService();
  try {
    window.sessionStorage.setItem(acquisitionKey, JSON.stringify(acquisition));
  } catch (error) { /* Current-page context remains available without storage. */ }

  const getInquiryContext = () => {
    const context = {};
    acquisitionFields.forEach((key) => {
      context[key] = typeof acquisition[key] === "string" ? acquisition[key].slice(0, 500) : "";
    });
    context.service = Object.values(serviceByPath).includes(acquisition.service) ? acquisition.service : "general";
    return Object.assign(context, journeyParams());
  };

  const closestLocation = (element) => {
    const section = element.closest("header, footer, section, main, .cta, .conversion, .hero, .topbar");
    if (!section) return "body";
    if (section.id) return section.id;
    if (section.className && typeof section.className === "string") {
      return section.className.split(/\s+/).filter(Boolean).slice(0, 2).join("_");
    }
    return section.tagName.toLowerCase();
  };

  const journeyKey = "stile_cta_journey_v1";
  const validPath = value => typeof value === "string" && /^\/(?:[a-z0-9][a-z0-9/_-]*(?:\.html)?)?$/i.test(value);
  const validCtaId = value => typeof value === "string" && /^[a-z0-9_-]{1,180}$/i.test(value);
  let journey = {};
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(journeyKey));
    if (saved && validCtaId(saved.origin_id) && validPath(saved.origin_path)
        && validCtaId(saved.latest_id) && validPath(saved.latest_path)
        && Number.isFinite(saved.recorded_at) && Date.now() - saved.recorded_at >= 0
        && Date.now() - saved.recorded_at < 30 * 60 * 1000) journey = saved;
  } catch (error) { /* Unknown CTA origin stays unknown, not the homepage. */ }

  const rememberCta = (link) => {
    if (!link || !validPath(pagePath)) return undefined;
    const region = link.closest("header, footer, section, main, .cta, .conversion, .hero, .topbar");
    const siblings = region && typeof region.querySelectorAll === "function"
      ? Array.from(region.querySelectorAll("a[href], button")).filter(node =>
          ["estimate_click", "project_photo_click"].includes(eventForLink(node))) : [link];
    const slot = Math.max(1, siblings.indexOf(link) + 1);
    const page = pagePath === "/" || pagePath === "/index.html" ? "home" : pagePath.replace(/^\/|\.html$/g, "").replace(/\//g, "_");
    const location = closestLocation(link).replace(/[^a-z0-9_-]/gi, "_");
    const labelledBy = region && typeof region.getAttribute === "function" && region.getAttribute("aria-labelledby");
    const regionKey = region && (region.id || labelledBy);
    const regions = typeof document.querySelectorAll === "function"
      ? Array.from(document.querySelectorAll("header, footer, section, main, .cta, .conversion, .hero, .topbar")) : [];
    const similar = regions.filter(node => closestLocation(node) === closestLocation(link));
    const regionOrdinal = Math.max(1, similar.indexOf(region) + 1);
    const regionId = validCtaId(regionKey) ? regionKey : `${location}__r${regionOrdinal}`;
    const explicitId = link.dataset && link.dataset.ctaId;
    const id = validCtaId(explicitId) ? explicitId : `${page}__${regionId}__${slot}`;
    if (!validCtaId(id)) return undefined;
    if (!journey.origin_id || Date.now() - journey.recorded_at >= 30 * 60 * 1000) {
      journey = { origin_id: id, origin_path: pagePath };
    }
    Object.assign(journey, { latest_id: id, latest_path: pagePath, recorded_at: Date.now() });
    try { window.sessionStorage.setItem(journeyKey, JSON.stringify(journey)); } catch (error) { /* In-page origin remains available. */ }
    return id;
  };

  const journeyParams = () => journey.origin_id && Date.now() - journey.recorded_at >= 0 && Date.now() - journey.recorded_at < 30 * 60 * 1000 ? {
    cta_origin_id: journey.origin_id, cta_origin_path: journey.origin_path,
    cta_latest_id: journey.latest_id, cta_latest_path: journey.latest_path
  } : {};

  // Public hooks never forward arbitrary form fields or objects to measurement.
  const allowed = new Set(["service", "campaign", "lead_method", "cta_location", "link_url", "engagement_event", "transaction_id", "cta_id", "receipt_state"]);
  const safeParams = extra => Object.fromEntries(Object.entries(extra || {}).filter(([key, value]) => {
    if (!allowed.has(key) || typeof value !== "string" || value.length > 180) return false;
    if (key === "service") return measuredServices.has(value);
    if (key === "lead_method") return ["form", "phone", "email", "sms", "whatsapp"].includes(value);
    if (key === "transaction_id") return validId(value);
    if (key === "cta_id") return validCtaId(value);
    if (key === "receipt_state") return value === "http_accepted";
    if (key === "link_url") return /^\/(?:[a-z0-9/_-]|\.html)*(?:#[a-z0-9_-]+)?$/i.test(value) || /^#[a-z0-9_-]+$/i.test(value);
    // Published button labels/identifiers only; never contact text, URLs or query strings.
    return !/[@?=<>]/.test(value);
  }));

  const baseParams = (extra) => {
    const params = Object.assign({ page_path: pagePath, page_location: measurement && measurement.pageLocation, page_referrer: measurement && measurement.pageReferrer }, journeyParams(), safeParams(extra));
    if (!params.service) params.service = pageService();
    if (!params.campaign && pageCampaign()) params.campaign = pageCampaign();
    return params;
  };

  const track = (eventName, params) => {
    if (!measurementReady() || typeof eventName !== "string" || !/^[a-z][a-z0-9_]{0,39}$/.test(eventName)) return;
    window.gtag("event", eventName, baseParams(params));
  };

  const eventForLink = (link) => {
    const href = link.getAttribute("href") || "";
    const dataTrack = link.dataset.track;
    const text = normalizeText(link.textContent).toLowerCase();
    if (dataTrack === "none") return null;

    if (href.startsWith("tel:")) return "phone_click";
    if (href.startsWith("sms:")) return "sms_click";
    if (/wa\.me|whatsapp/i.test(href)) return "whatsapp_click";
    if (href.startsWith("mailto:")) return "email_click";
    if (["service_navigation", "project_view"].includes(dataTrack) && validPath(href.split("?")[0])) return dataTrack;

    if (dataTrack === "send_photo" || dataTrack === "project_photo" || /send .*photo|fireplace photo|project photo/.test(text)) {
      return "project_photo_click";
    }

    if (dataTrack === "estimate" || /estimate|consultation|quote|visualization/.test(text)) {
      return "estimate_click";
    }

    return null;
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href], button");
    if (!link) return;

    const eventName = eventForLink(link);
    if (!eventName) return;

    const href = link.getAttribute("href") || "";
    const params = {
      cta_id: ["estimate_click", "project_photo_click"].includes(eventName) ? rememberCta(link) : undefined,
      cta_location: closestLocation(link),
      link_url: href ? href.split("?")[0] : undefined
    };

    if (eventName === "phone_click") params.lead_method = "phone";
    if (eventName === "sms_click") params.lead_method = "sms";
    if (eventName === "whatsapp_click") params.lead_method = "whatsapp";
    if (eventName === "email_click") params.lead_method = "email";
    if (["service_navigation", "project_view"].includes(eventName)) params.service = serviceByPath[params.link_url];

    track(eventName, params);
    if ((eventName === "email_click" && link.dataset.track === "commercial_enquiry") ||
        (eventName === "estimate_click" && (link.dataset.estimateType === "commercial" || href.endsWith("#estimate-commercial")))) {
      track("commercial_enquiry", {
        service: "commercial", cta_id: params.cta_id, cta_location: params.cta_location,
        lead_method: eventName === "email_click" ? "email" : "form"
      });
    }

    if (pageCampaign()) {
      track("car_campaign_engagement", Object.assign({}, params, {
        engagement_event: eventName
      }));
    }
  }, true);

  document.addEventListener("input", (event) => {
    const form = event.target.closest("form");
    if (!form || sentFormStarts.has(form)) return;

    sentFormStarts.add(form);
    track("contact_form_start", {
      cta_location: form.id || form.getAttribute("name") || "form",
      lead_method: "form"
    });
  }, true);

  document.addEventListener("change", (event) => {
    const form = event.target.closest("form");
    if (!form || sentFormStarts.has(form)) return;

    sentFormStarts.add(form);
    track("contact_form_start", {
      cta_location: form.id || form.getAttribute("name") || "form",
      lead_method: "form"
    });
  }, true);

  window.StileAnalytics = {
    measurementVersion: "enquiry-v2",
    track,
    getInquiryContext,
    trackFormOpen: (trigger) => {
      rememberCta(trigger);
      track("contact_form_open", { cta_location: "estimate_modal", lead_method: "form" });
    },
    trackLeadSuccess: (params) => {
      const submissionId = params && params.transaction_id;
      pruneAccepted();
      if (!params || params.accepted !== true || !validId(submissionId) || sentLeadIds.has(submissionId)) return;
      sentLeadIds.set(submissionId, Date.now());
      pruneAccepted();
      try { window.sessionStorage.setItem(acceptedKey, JSON.stringify(Array.from(sentLeadIds, ([id, at]) => ({ id, at })))); } catch (error) { /* Bounded page-lifetime deduplication remains. */ }
      const form = typeof document.getElementById === "function" && document.getElementById("estimate-form");
      if (form) sentFormStarts.delete(form);
      // Successful form lifecycle is independent of whether analytics is enabled/available.
      try {
        track("generate_lead", Object.assign({
          lead_method: "form", receipt_state: "http_accepted"
        }, params || {}));
        // This preserves the existing Ads HTTP-acceptance signal, not a verified provider receipt.
        if (measurementReady()) window.gtag("event", "conversion", {
          send_to: adsConversion,
          page_location: measurement.pageLocation,
          page_referrer: measurement.pageReferrer,
          transaction_id: submissionId
        });
      } finally {
      journey = {};
      try { window.sessionStorage.removeItem(journeyKey); } catch (error) { /* New in-page inquiry starts without the old CTA. */ }
      }
    }
  };

  // The homepage inline script may open a hash-linked dialog before this deferred tracker.
  const alreadyOpen = typeof document.getElementById === "function" && document.getElementById("estimate-modal");
  if (alreadyOpen && alreadyOpen.classList && alreadyOpen.classList.contains("is-open")) {
    window.StileAnalytics.trackFormOpen();
  }

  // One shared inclusion; no widget on admin, technical or unrelated campaign pages.
  const advisorPaths = ["/", "/index.html", "/projects.html", "/venetian-plaster-vancouver.html", "/marmorino-vancouver.html", "/fireplace-wall-vancouver.html", "/feature-wall-vancouver.html", "/plaster-range-hood-vancouver.html", "/marmorino-retail-interiors.html", "/microcement-vancouver.html", "/custom-architectural-rock-installation.html", "/brookswood-langley-fireplace-transformation.html", "/west-vancouver-fireplace-transformation.html", "/venetian-plaster-cost-vancouver.html"];
  if (advisorPaths.includes(pagePath)) {
    const style = document.createElement("link");
    style.rel = "stylesheet"; style.href = "/styles/finish-advisor.css";
    const script = document.createElement("script");
    script.src = "/scripts/finish-advisor.js"; script.defer = true;
    document.head.append(style, script);
  }
})();
