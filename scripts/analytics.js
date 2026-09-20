(function () {
  const measurementReady = () => typeof window.gtag === "function";
  const pagePath = window.location.pathname || "/";
  const pageTitle = document.title || "";
  const sentFormStarts = new WeakSet();

  const serviceByPath = {
    "/fireplace-wall-vancouver.html": "fireplace",
    "/venetian-plaster-fireplace-surround-vancouver.html": "fireplace",
    "/feature-wall-vancouver.html": "feature_wall",
    "/microcement-vancouver.html": "microcement",
    "/venetian-plaster-surrey.html": "venetian_plaster",
    "/venetian-plaster-langley.html": "venetian_plaster",
    "/venetian-plaster-north-vancouver.html": "venetian_plaster",
    "/venetian-plaster-vancouver.html": "venetian_plaster",
    "/marmorino-vancouver.html": "marmorino",
    "/plaster-range-hood-vancouver.html": "range_hood",
    "/west-vancouver-fireplace-transformation.html": "fireplace",
    "/brookswood-langley-fireplace-transformation.html": "fireplace",
    "/custom-architectural-rock-installation.html": "feature_wall",
    "/car.html": "general",
    "/car": "general"
  };

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
    return context;
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

  const baseParams = (extra) => {
    const params = Object.assign({
      page_path: pagePath,
      page_title: pageTitle
    }, extra || {});

    if (!params.service) params.service = pageService();
    if (!params.campaign && pageCampaign()) params.campaign = pageCampaign();

    return params;
  };

  const track = (eventName, params) => {
    if (!measurementReady()) return;
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
      cta_text: normalizeText(link.textContent),
      cta_location: closestLocation(link),
      link_url: href ? href.split("?")[0] : undefined
    };

    if (eventName === "phone_click") params.lead_method = "phone";
    if (eventName === "sms_click") params.lead_method = "sms";
    if (eventName === "whatsapp_click") params.lead_method = "whatsapp";
    if (eventName === "email_click") params.lead_method = "email";

    track(eventName, params);

    if (pageCampaign()) {
      track("car_campaign_engagement", Object.assign({}, params, {
        engagement_event: eventName
      }));
    }
  });

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
    track,
    getInquiryContext,
    trackLeadSuccess: (params) => {
      track("generate_lead", Object.assign({
        lead_method: "form"
      }, params || {}));
    }
  };
})();
