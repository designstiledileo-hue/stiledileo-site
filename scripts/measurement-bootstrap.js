(function () {
  "use strict";
  // This synchronous gate must run before the deferred shared tracker.
  if (window.StileMeasurement && window.StileMeasurement.ready === true) return;

  const canonicalOrigin = "https://stiledileo.com";
  const testKey = "stile_measurement_test_v1";
  const testTtl = 2 * 60 * 60 * 1000;
  const now = Date.now();
  const productionHost = /^(www\.)?stiledileo\.com$/i.test(window.location.hostname);
  const safePath = value => typeof value === "string" && /^\/(?:[a-z0-9][a-z0-9/_-]*(?:\.html)?)?$/i.test(value)
    ? (value === "/index.html" ? "/" : value) : "/";
  const pagePath = safePath(window.location.pathname);
  const pageLocation = canonicalOrigin + pagePath;
  let pageReferrer = "";
  try {
    const referrer = new URL(document.referrer);
    if (/^https?:$/.test(referrer.protocol)) {
      pageReferrer = /^(www\.)?stiledileo\.com$/i.test(referrer.hostname)
        ? canonicalOrigin + safePath(referrer.pathname) : referrer.origin;
    }
  } catch (error) { /* An absent or malformed referrer stays unknown. */ }

  const query = new URLSearchParams(window.location.search);
  const flags = query.getAll("stile_test");
  // An explicit test marker wins if conflicting flags are supplied.
  const flag = flags.includes("1") ? "1" : flags.includes("0") ? "0" : "";
  const validExpiry = value => Number.isSafeInteger(value) && value > now && value <= now + testTtl;
  let expiresAt = 0;
  try {
    const saved = window.sessionStorage.getItem(testKey);
    const record = saved ? JSON.parse(saved) : null;
    if (record && validExpiry(record.expires_at)) expiresAt = record.expires_at;
    else if (saved) window.sessionStorage.removeItem(testKey);
  } catch (error) {
    try { window.sessionStorage.removeItem(testKey); } catch (storageError) { /* Storage may be blocked. */ }
  }

  if (flag === "0") {
    expiresAt = 0;
    try { window.sessionStorage.removeItem(testKey); } catch (error) { /* No stored marker is available. */ }
  } else if (flag === "1") {
    const suppliedExpiry = query.get("stile_test_until");
    if (suppliedExpiry !== null) {
      const parsedExpiry = Number(suppliedExpiry);
      // An expired propagated marker suppresses this document but does not restart its TTL.
      expiresAt = validExpiry(parsedExpiry) ? Math.min(expiresAt || parsedExpiry, parsedExpiry) : 0;
    } else if (!expiresAt) expiresAt = now + testTtl;
    if (expiresAt) {
      try { window.sessionStorage.setItem(testKey, JSON.stringify({ expires_at: expiresAt })); }
      catch (error) { /* Carry the same absolute expiry on internal navigation instead. */ }
    }
  }
  // A clearing URL remains synthetic for this document. A fresh clean navigation can measure.
  const testMode = flag === "1" || flag === "0" || expiresAt > now;
  const enabled = productionHost && !testMode;
  Object.defineProperty(window, "StileMeasurement", {
    value: Object.freeze({ ready: true, version: 1, enabled, testMode, pagePath, pageLocation, pageReferrer }),
    writable: false,
    configurable: false
  });

  if (testMode && expiresAt > now && flag !== "0") {
    const markLink = link => {
      if (!link || typeof link.getAttribute !== "function") return;
      const href = link.getAttribute("href");
      // Fragment-only controls remain in this document and keep their existing behavior.
      if (!href || href.startsWith("#")) return;
      try {
        const target = new URL(href, window.location.href);
        if (!/^https?:$/.test(target.protocol) || target.origin !== window.location.origin
            || target.searchParams.get("stile_test") === "0") return;
        target.searchParams.set("stile_test", "1");
        target.searchParams.set("stile_test_until", String(expiresAt));
        link.setAttribute("href", target.pathname + target.search + target.hash);
      } catch (error) { /* Non-navigation and malformed links are left alone. */ }
    };
    const markLinks = () => document.querySelectorAll("a[href], area[href]").forEach(markLink);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", markLinks, { once: true });
    else markLinks();
    const markClickedLink = event => {
      const target = event.target;
      if (target && typeof target.closest === "function") markLink(target.closest("a[href], area[href]"));
    };
    ["click", "auxclick", "contextmenu"].forEach(type => document.addEventListener(type, markClickedLink, true));
  }

  if (!enabled) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", "G-P7VJ8MQNKS", { page_location: pageLocation, page_referrer: pageReferrer });
  const loader = document.createElement("script");
  loader.async = true;
  loader.src = "https://www.googletagmanager.com/gtag/js?id=G-P7VJ8MQNKS";
  document.head.appendChild(loader);
})();
