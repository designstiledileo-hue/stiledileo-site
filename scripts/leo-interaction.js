// Optional motion, anchored to the actual Ask Leo button. The Advisor never
// depends on the character, and the original motion assets are unchanged.
(function () {
  'use strict';
  if (window.StileLeo) return;
  const controllers = new WeakMap();
  const introAttempted = 'stile_leo_anchored_intro_attempted';
  const introSeen = 'stile_leo_intro_seen';
  const reducedMotion = '(prefers-reduced-motion: reduce)';
  const controls = 'a[href], button, input, select, textarea, summary, [role="button"], [data-leo-protect], [data-leo-blocking-overlay]';
  const readable = 'h1, h2, h3, h4, p, li, label, figcaption, span, small, strong, em, time, dd, dt, blockquote';
  const introDelay = 2800, introWindow = 18000, scrollSettle = 425, scrollThreshold = 56;

  function playableFormats() {
    const agent = navigator.userAgent;
    const apple = /iPhone|iPad|iPod/.test(agent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      || (/Safari/.test(agent) && !/Chrome|Chromium|Edg|OPR/.test(agent));
    const probe = document.createElement('video');
    return (apple ? ['mov', 'webm'] : ['webm', 'mov']).filter(format =>
      probe.canPlayType(format === 'mov' ? 'video/mp4; codecs="hvc1"' : 'video/webm; codecs="vp9"'));
  }

  function hasTransparency(video) {
    // Some browsers claim the codec but ignore its alpha plane. Never show
    // a rectangle in those browsers; try the other unchanged asset instead.
    try {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 32;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, 32, 32);
      const rgba = ctx.getImageData(0, 0, 32, 32).data;
      let transparent = 0, subject = 0;
      for (let i = 3; i < rgba.length; i += 4) {
        if (rgba[i] < 8) transparent++;
        if (rgba[i] > 200) subject++;
      }
      return transparent > 20 && subject > 20;
    } catch (_) { return false; }
  }

  function nextFrame(video, signal, needsAlpha) {
    return new Promise(resolve => {
      let timeout, frame, raf;
      function finish(ok) {
        clearTimeout(timeout); cancelAnimationFrame(raf);
        if (frame !== undefined) video.cancelVideoFrameCallback?.(frame);
        video.removeEventListener('error', cancel);
        signal.removeEventListener('abort', cancel);
        resolve(ok);
      }
      function cancel() { finish(false); }
      function queue() {
        if (video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(check);
        else raf = requestAnimationFrame(check);
      }
      function check() {
        if (signal.aborted || video.error || video.ended) return cancel();
        if (video.readyState >= 2 && !video.paused && video.currentTime > 0
          && (!needsAlpha || hasTransparency(video))) return finish(true);
        queue();
      }
      if (signal.aborted || video.error) return cancel();
      signal.addEventListener('abort', cancel, { once: true });
      video.addEventListener('error', cancel, { once: true });
      timeout = setTimeout(cancel, needsAlpha ? 2600 : 1000);
      queue();
    });
  }

  function init(root) {
    if (!root || controllers.has(root)) return controllers.get(root);
    const launcher = root.querySelector('.sa-launcher');
    const anchor = launcher?.closest('.sa-launcher-anchor');
    const panel = root.querySelector('dialog');
    if (!anchor || !panel) return;
    const reduced = matchMedia(reducedMotion);
    const lifetime = new AbortController();
    const formats = playableFormats();
    const host = document.createElement('div');
    host.className = 'sa-leo-visual';
    host.setAttribute('aria-hidden', 'true');
    host.hidden = true;
    anchor.prepend(host);
    let introTimer, fallbackTimer, expiry, checkFrame, exitTimer;
    let stage = 'idle', run = null, active = null;
    let lastScrollY = window.scrollY, fallbackOriginY = lastScrollY, lastScrollAt = -Infinity;
    let fallbackQualified = false, observer, layoutObserver;
    const on = (target, event, listener) => target.addEventListener(event, listener, { signal: lifetime.signal });
    const enabled = () => !lifetime.signal.aborted && !reduced.matches && !panel.open && !root.inert
      && document.visibilityState === 'visible' && root.isConnected;
    const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    function clearOfForeground() {
      if (!enabled()) return false;
      const box = host.getBoundingClientRect();
      const visual = window.visualViewport;
      const left = visual?.offsetLeft || 0, top = visual?.offsetTop || 0;
      if (!box.width || box.left < left || box.top < top
        || box.right > left + (visual?.width || innerWidth) + 1
        || box.bottom > top + (visual?.height || innerHeight) + 1) return false;
      for (const el of document.querySelectorAll(controls + ', ' + readable)) {
        if (root.contains(el) || !overlaps(box, el.getBoundingClientRect()) || getComputedStyle(el).visibility !== 'visible') continue;
        if (el.matches(controls)) return false;
        // A full-width copy block may be near Leo; only its actual line boxes
        // matter. Do not treat empty space to the side of text as a collision.
        for (const child of el.childNodes) {
          if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) continue;
          const text = document.createRange();
          text.selectNodeContents(child);
          if (Array.from(text.getClientRects()).some(rect => overlaps(box, rect))) return false;
        }
      }
      return true;
    }

    function unmountVideo(video) {
      if (!video) return;
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
    }
    function hide() {
      run?.abort(); run = null;
      clearTimeout(exitTimer);
      host.hidden = true;
      delete host.dataset.phase;
      unmountVideo(active); active = null;
    }
    function retire() {
      stage = 'idle';
      clearTimeout(introTimer); clearTimeout(fallbackTimer); clearTimeout(expiry);
    }
    function stop() { retire(); hide(); }
    function retreat() {
      if (!active || host.dataset.phase !== 'visible') return hide();
      clearTimeout(exitTimer);
      host.dataset.phase = 'retreat';
      exitTimer = setTimeout(hide, 180);
    }
    function stored(key) { try { return sessionStorage.getItem(key); } catch (_) { return 'unavailable'; } }
    function save(key) { try { sessionStorage.setItem(key, 'true'); return true; } catch (_) { return false; } }
    function stayStatic() { retire(); save(introAttempted); }

    async function playCurrentIntro() {
      const operation = new AbortController();
      run = operation;
      const signal = operation.signal;
      for (const format of formats) {
        if (signal.aborted) return;
        const video = document.createElement('video');
        video.className = 'sa-leo-motion';
        video.muted = video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.tabIndex = -1;
        video.preload = 'auto';
        // The approved 512×682 PEEK matte reaches both canvas edges in the
        // full-frame alpha sweep. Centre the canvas and leave 3% on each side.
        video.src = `/images/leo-advisor/motion/leo-peek.${format}`;
        active = video;
        host.append(video);
        video.play().catch(() => video.dispatchEvent(new Event('error')));
        if (await nextFrame(video, signal, true)) {
          if (signal.aborted) return;
          if (!clearOfForeground()) return hide();
          host.dataset.phase = 'visible';
          video.addEventListener('ended', retreat, { once: true, signal });
          video.addEventListener('error', hide, { once: true, signal });
          // Account for an actually presented frame, not merely a play call.
          const painted = await nextFrame(video, signal, false);
          if (signal.aborted) return;
          if (painted && clearOfForeground()) {
            save(introSeen);
            try { window.StileAnalytics?.track('leo_peek_shown'); } catch (_) { /* Optional measurement. */ }
          }
          // Guard against a browser that stops reporting playback events.
          if (host.dataset.phase === 'visible') exitTimer = setTimeout(retreat, 3200);
          return;
        }
        if (signal.aborted) return;
        unmountVideo(video); active = null;
      }
      hide();
    }

    function tryIntro() {
      if (stage === 'idle' || !enabled()) return false;
      // Layout first; the host remains at zero opacity until a validated frame.
      host.hidden = false;
      if (!clearOfForeground()) { host.hidden = true; return false; }
      retire();
      if (save(introAttempted)) void playCurrentIntro();
      else hide();
      return true;
    }
    function checkAppearance() {
      if (!run || checkFrame) return;
      checkFrame = requestAnimationFrame(() => {
        checkFrame = 0;
        if (run && !clearOfForeground()) hide();
      });
    }
    function scheduleFallback() {
      if (stage !== 'awaiting-scroll') return;
      fallbackQualified ||= Math.abs(lastScrollY - fallbackOriginY) >= scrollThreshold;
      if (!fallbackQualified) return;
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(() => {
        // One settled, meaningful scroll is the only fallback. If it also has
        // foreground content, keep the ordinary button instead of chasing a gap.
        if (!tryIntro()) stayStatic();
      }, Math.max(0, scrollSettle - (performance.now() - lastScrollAt)));
    }
    function pageScrolled() {
      checkAppearance();
      if (stage === 'idle') return;
      const y = window.scrollY;
      if (y === lastScrollY) return; // Browser chrome/viewport movement is not a page scroll.
      lastScrollY = y;
      lastScrollAt = performance.now();
      scheduleFallback();
    }
    function initialOpportunity() {
      if (stage !== 'initial' || !enabled()) return;
      const inMotion = performance.now() - lastScrollAt < scrollSettle;
      if (!inMotion && tryIntro()) return;
      stage = 'awaiting-scroll';
      if (inMotion) scheduleFallback();
      else fallbackOriginY = window.scrollY;
    }
    function environmentChanged() {
      if (!enabled()) stop();
    }
    on(root, 'stile:advisor-visual', event => {
      if (event.detail !== 'open') return;
      if (stage !== 'idle') stayStatic();
      hide();
    });
    on(document, 'visibilitychange', environmentChanged);
    on(window, 'pagehide', stop);
    on(window, 'resize', checkAppearance);
    on(window, 'scroll', pageScrolled);
    on(reduced, 'change', environmentChanged);
    if (window.visualViewport) {
      on(window.visualViewport, 'resize', checkAppearance);
      on(window.visualViewport, 'scroll', checkAppearance);
    }
    if (document.fonts) on(document.fonts, 'loadingdone', checkAppearance);
    observer = new MutationObserver(environmentChanged);
    observer.observe(root, { attributes: true, attributeFilter: ['inert'] });
    observer.observe(panel, { attributes: true, attributeFilter: ['open'] });
    const controller = {
      get panelState() { return panel.open ? 'OPEN' : 'CLOSED'; },
      get visualState() { return host.dataset.phase === 'visible' ? 'PEEK' : 'HIDDEN'; },
      destroy() {
        stop(); lifetime.abort(); observer.disconnect(); layoutObserver?.disconnect(); cancelAnimationFrame(checkFrame); host.remove();
        controllers.delete(root);
      }
    };
    controllers.set(root, controller);
    if (formats.length && enabled() && !stored(introAttempted) && !stored(introSeen)) {
      if (window.ResizeObserver) {
        layoutObserver = new ResizeObserver(checkAppearance);
        layoutObserver.observe(document.body);
        document.querySelectorAll('.hero, .proof').forEach(el => layoutObserver.observe(el));
      }
      stage = 'initial';
      introTimer = setTimeout(initialOpportunity, introDelay);
      expiry = setTimeout(stayStatic, introWindow);
    }
    return controller;
  }
  window.StileLeo = Object.freeze({ init });
})();
