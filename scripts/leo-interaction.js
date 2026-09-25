// Optional real-motion enhancement with approved still fallback. Never blocks the Advisor.
(function () {
  'use strict';
  if (window.StileLeo) return;
  const controllers = new WeakMap();
  const introKey = 'stile_leo_intro_seen';
  let autonomousDisabled = false;
  // Alpha >=128 bounds establish the visible paw anchor; ALL alpha is retained.
  // Shared 0.19 scale preserves the original anatomy. Translations compensate
  // for each visible centre/bottom, not its canvas centre. Paw anchor is (115,280).
  const calibration = Object.freeze({
    hide: { scale: .19, translateX: 9.835, translateY: 20.84 },
    peek: { scale: .19, translateX: 6.985, translateY: 29.01 },
    react: { scale: .19, translateX: 7.745, translateY: 24.45 },
    inspect: { scale: .19, translateX: 8.41, translateY: 19.7 }
  });
  function artworkAdapter() {
    let ready = false, dead = false, image, host, timer, revision = 0;
    const images = {};
    function stop() { revision++; clearTimeout(timer); image?.getAnimations().forEach(a => a.cancel()); }
    function pose(state) {
      const c = calibration[state];
      image.src = images[state].src;
      image.style.transform = `translate(${c.translateX}px,${c.translateY}px) scale(${c.scale})`;
      host.dataset.pose = state;
    }
    async function swap(state) {
      const current = ++revision;
      try {
        await image.animate([{opacity:1},{opacity:0}],{duration:90,fill:'forwards'}).finished;
        if (current !== revision || dead) return;
        pose(state);
        await image.animate([{opacity:0},{opacity:1}],{duration:90,fill:'forwards'}).finished;
      } catch (_) { /* Interrupted by input/close. */ }
    }
    function show(state, element, continuing) {
      if (!ready || dead) return false;
      stop(); host = element;
      if (!image) { image = new Image(); image.alt = ''; image.className = 'sa-leo-pose'; image.draggable = false; }
      host.replaceChildren(image);
      if (continuing) { swap(state); return true; }
      pose(state);
      image.animate([{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}],
        {duration:state === 'peek' ? 600 : 180,easing:'ease-out',fill:'forwards'});
      return true;
    }
    return {
      get ready() { return ready; },
      load(done) {
        if (innerWidth < 768 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const load = async () => {
          try {
            await Promise.all(Object.keys(calibration).map(async state => {
              const asset = new Image(); asset.src = `/images/leo-advisor/leo-${state}.webp`;
              await asset.decode(); images[state] = asset;
            }));
            if (!dead) { ready = true; done(); }
          } catch (_) { if (!dead) done(); /* No broken image is inserted. */ }
        };
        if ('requestIdleCallback' in window) requestIdleCallback(load,{timeout:3000}); else timer = setTimeout(load,1000);
      },
      showPeek: (element,continuing) => show('peek',element,continuing),
      showReact: (element,continuing) => show('react',element,continuing),
      showInspect: (element,continuing) => show('inspect',element,continuing),
      retreat(done) {
        if (!image || dead) { done(); return; }
        swap('hide');
        timer = setTimeout(() => {
          image.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 12px'}],
            {duration:220,easing:'ease-in',fill:'forwards'});
          timer = setTimeout(done,220);
        },180);
      },
      hide() { stop(); },
      destroy() { dead = true; stop(); image?.remove(); }
    };
  }

  function motionAdapter() {
    const fallback = artworkAdapter();
    // Calibrated from the approved alpha bounds, not the static PNG transforms.
    const geometry = {
      peek: { width:220, bottom:-102*220/834 },
      react: { width:230, bottom:0 },
      inspect: { width:230, bottom:0 },
      hide: { width:230, bottom:-87*230/860 }
    };
    const cached = new Map(), videos = new Set();
    // Conservative V1 Safari path. No second codec or UA-dependent opaque video.
    const safari = /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|Edg|OPR/.test(navigator.userAgent);
    const supportsVideo = !safari && !!document.createElement('video').canPlayType('video/webm; codecs="vp9"');
    let ready = false, dead = false, revision = 0, active, host, idle, timer, fallbackLoad;
    const allowed = () => !dead && innerWidth >= 768 && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    function stop() {
      revision++; clearTimeout(timer);
      videos.forEach(v => { v.pause(); v.onended = null; if (v.dataset.alphaVerified) v.onerror = null; v.getAnimations().forEach(a => a.cancel()); });
      fallback.hide(); active = null;
    }
    function prepare(state) {
      if (cached.has(state)) return cached.get(state);
      const promise = new Promise((resolve,reject) => {
        if (!allowed() || !supportsVideo) { reject(Error('static fallback')); return; }
        const v = document.createElement('video'); videos.add(v);
        v.className = 'sa-leo-motion'; v.muted = true; v.playsInline = true;
        v.loop = false; v.controls = false; v.tabIndex = -1; v.setAttribute('aria-hidden','true');
        v.preload = 'auto';
        const timeout = setTimeout(() => fail(),4000);
        function fail() {
          clearTimeout(timeout); v.onloadeddata = null; v.onerror = null;
          v.pause(); v.removeAttribute('src'); v.load(); reject(Error('motion unavailable'));
        }
        v.onerror = fail;
        v.onloadeddata = () => {
          try {
            // Verify real decoded alpha on this browser, not codec/container tags.
            const canvas = document.createElement('canvas'); canvas.width = canvas.height = 16;
            const ctx = canvas.getContext('2d',{willReadFrequently:true});
            ctx.drawImage(v,0,0,16,16);
            const bytes = ctx.getImageData(0,0,16,16).data;
            const alpha = []; for (let i=3;i<bytes.length;i+=4) alpha.push(bytes[i]);
            if (Math.min(...alpha) > 8 || Math.max(...alpha) < 200) { fail(); return; }
            clearTimeout(timeout); v.onloadeddata = null; v.onerror = null;
            v.dataset.alphaVerified = 'true'; resolve(v);
          } catch (_) { fail(); }
        };
        v.src = `/images/leo-advisor/motion/leo-${state}.webm`;
      });
      cached.set(state,promise); return promise;
    }
    function getFallback() {
      fallbackLoad ||= new Promise(resolve => fallback.load(resolve));
      return fallbackLoad;
    }
    async function exit(done, token) {
      if (token !== revision || dead) return;
      try {
        if (active) await active.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 28px'}],
          {duration:220,easing:'ease-in',fill:'forwards'}).finished;
      } catch (_) { return; }
      if (token === revision && !dead) done();
    }
    async function render(state, token, done, retreat = false, shown = () => {}) {
      try {
        const v = await prepare(state);
        if (token !== revision || !allowed()) return;
        if (retreat && active) {
          await active.animate([{opacity:1},{opacity:0}],{duration:80,fill:'forwards'}).finished;
          if (token !== revision) return;
          active.pause(); active.getAnimations().forEach(a => a.cancel());
        }
        const viewport = document.createElement('div'); viewport.className = 'sa-leo-motion-viewport';
        const boundary = document.createElement('div'); boundary.className = 'sa-leo-boundary';
        Object.assign(v.style,{width:geometry[state].width+'px',bottom:geometry[state].bottom+'px'});
        v.currentTime = 0; viewport.append(v); host.replaceChildren(viewport,boundary);
        host.dataset.pose = state; host.dataset.renderer = 'motion'; active = v;
        // Keep the element transparent until playback succeeds. No broken flash.
        host.style.opacity = '0'; await v.play();
        if (token !== revision || !allowed()) { v.pause(); return; }
        host.style.opacity = '1';
        shown();
        v.onerror = () => { if (token === revision) done(); };
        v.animate([{opacity:0,translate:'0 16px'},{opacity:1,translate:'0 0'}],
          {duration:200,easing:'ease-out'});
        v.onended = () => {
          v.onended = null;
          if (token !== revision) return;
          if (state === 'inspect') render('hide',token,done,true);
          else exit(done,token);
        };
      } catch (_) {
        if (token !== revision || !allowed()) return;
        if (retreat) { exit(done,token); return; }
        await getFallback();
        if (token !== revision || !allowed()) return;
        if (!fallback.ready) { done(); return; }
        host.style.opacity = '1'; host.dataset.renderer = 'static';
        const method = {peek:'showPeek',react:'showReact',inspect:'showInspect'}[state];
        if (fallback[method](host,false) !== true) { done(); return; }
        shown();
        timer = setTimeout(() => { if (token === revision) fallback.retreat(done); },state === 'peek' ? 2000 : state === 'inspect' ? 2400 : 1200);
      }
    }
    function show(state, element, _continuing, done, shown) {
      if (!ready || !allowed()) return false;
      stop(); host = element; host.replaceChildren(); host.style.opacity = '0';
      const token = revision;
      render(state,token,done,false,shown);
      // Load only the upcoming retreat, only after a real photo request.
      if (state === 'inspect' && supportsVideo) prepare('hide').catch(() => {});
      return true;
    }
    return {
      get ready() { return ready; },
      completionDriven:true,
      motionGeometry:true,
      load(done) {
        if (!allowed()) return;
        const load = () => {
          if (!allowed()) return;
          ready = true; done();
          // One non-critical idle warmup, never four eager video downloads.
          if (supportsVideo) prepare('peek').catch(() => {});
        };
        if ('requestIdleCallback' in window) idle = requestIdleCallback(load,{timeout:3000});
        else timer = setTimeout(load,1000);
      },
      warmReact() { if (ready && allowed() && supportsVideo) prepare('react').catch(() => {}); },
      showPeek:(e,c,done,shown)=>show('peek',e,c,done,shown),
      showReact:(e,c,done,shown)=>show('react',e,c,done,shown),
      showInspect:(e,c,done,shown)=>show('inspect',e,c,done,shown),
      hide() { stop(); if (host) host.style.opacity='0'; },
      destroy() {
        dead=true; stop(); if (idle !== undefined && 'cancelIdleCallback' in window) cancelIdleCallback(idle);
        fallback.destroy(); videos.forEach(v=>{v.removeAttribute('src');v.load();v.remove();});cached.clear();
      }
    };
  }

  function init(root, adapter) {
    if (!root || controllers.has(root)) return controllers.get(root);
    adapter ||= motionAdapter();
    const launcher = root.querySelector('.sa-launcher');
    const panel = root.querySelector('dialog');
    if (!launcher || !panel) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const abort = new AbortController();
    let destroyed = false, failed = false, host = null;
    let visualState = 'HIDDEN', introTimer = null, endTimer = null, lastReact = -Infinity;
    let introAttempts = 0;
    let introCancelled = autonomousDisabled;
    const panelState = () => panel.open ? 'OPEN' : 'CLOSED';
    const on = (target, type, callback) => target.addEventListener(type, callback, { signal: abort.signal });
    const available = () => adapter.ready === true && !failed && !destroyed;
    function safe(method, ...args) {
      try { return typeof adapter[method] === 'function' ? adapter[method](...args) : false; }
      catch (_) { failed = true; return false; }
    }
    function hide() {
      clearTimeout(endTimer); endTimer = null;
      if (visualState !== 'HIDDEN') safe('hide');
      visualState = 'HIDDEN';
      if (host?.hidePopover && host.matches(':popover-open')) host.hidePopover();
      if (host && !host.hidden) host.hidden = true;
    }
    function cancelIntro() {
      clearTimeout(introTimer); introTimer = null;
      introCancelled = true; autonomousDisabled = true;
    }
    function interrupt() { cancelIntro(); hide(); }
    function visible(el) {
      const style = getComputedStyle(el);
      return el.getClientRects().length > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    }
    function conflictingUI() {
      if (root.inert) return true;
      return [...document.querySelectorAll('dialog[open], [aria-modal="true"], .estimate-modal.is-open, [data-leo-blocking-overlay]')]
        .some(el => el !== panel && !root.contains(el) && visible(el));
    }
    function placement(kind, retainPosition = false) {
      // Conservative mobile fallback, including all 375/390 layouts. A final asset
      // must pass an additional rendered mobile review before relaxing this rule.
      if (innerWidth < 768 || reduced.matches || document.visibilityState !== 'visible' || !document.hasFocus() || conflictingUI()) return null;
      const besidePanel = panel.open;
      const anchor = (besidePanel ? panel : launcher).getBoundingClientRect();
      const width = 230, height = adapter.motionGeometry ? 295 : 300;
      const preferred = besidePanel
        ? { left: anchor.left - width - 12, top: anchor.bottom - (adapter.motionGeometry ? 295 : 280), width, height }
        : { left: anchor.right - width, top: anchor.top - (adapter.motionGeometry ? 281 : 288), width, height };
      // Only the explicitly decorative homepage background is exempt. Foreground
      // project media, interactive cards, controls and the open panel stay protected.
      const decorative = el => el.matches('.hero-desktop-video') && !!el.closest('header.hero');
      const excluded = el => el === launcher || launcher.contains(el) || el === host || host?.contains(el) || !visible(el);
      const obstacles = [...document.querySelectorAll('button, a[href], input, textarea, select, img, video, nav, dialog[open], [role="button"], [role="slider"]')]
        .filter(el => !excluded(el) && !decorative(el)).map(el => el.getBoundingClientRect());
      // Protect actual readable line rectangles, not the empty area of a layout
      // wrapper. This leaves legitimate gutters available without covering copy.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let text;
      while ((text = walker.nextNode())) {
        const parent = text.parentElement;
        if (!text.textContent.trim() || !parent || parent.closest('script, style, noscript') || excluded(parent)) continue;
        const range = document.createRange(); range.selectNodeContents(text);
        obstacles.push(...range.getClientRects());
      }
      const inView = obstacles.filter(r => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth);
      const safeBox = box => {
        if (box.left < 16 || box.top < 16 || box.left + width > innerWidth - 16 || box.top + height > innerHeight) return false;
        const top = box.top + (adapter.motionGeometry ? 0 : kind === 'PEEK' ? 88 : 22);
        return !inView.some(r => r.right > box.left - 8 && r.left < box.left + width + 8 && r.bottom > top - 4 && r.top < box.top + 283 + 8);
      };
      // Never slide an already playing character around in response to layout changes.
      if (retainPosition && host && !host.hidden) {
        const current = host.getBoundingClientRect();
        return safeBox(current) ? current : null;
      }
      if (safeBox(preferred)) return preferred;
      // Bounded, nearest-first alternatives along nearby foreground edges. At most
      // two character widths horizontally / 96px vertically from the original anchor.
      const xs = [preferred.left, preferred.left - width - 12, preferred.left + width + 12];
      const ys = [preferred.top, preferred.top - 48, preferred.top + 48, preferred.top - 96, preferred.top + 96,
        Math.min(preferred.top + 96, innerHeight - height)];
      inView.forEach(r => { xs.push(r.left - width - 8, r.right + 8); });
      const candidates = [...new Set(xs)].filter(x => Math.abs(x - preferred.left) <= width * 2)
        .flatMap(left => ys.map(top => ({ left, top, width, height })))
        .sort((a,b) => Math.hypot(a.left-preferred.left,a.top-preferred.top)-Math.hypot(b.left-preferred.left,b.top-preferred.top));
      return candidates.find(safeBox) || null;
    }
    function start(kind, autonomous = false) {
      if (!available() || (kind === 'PEEK' && panel.open) || (kind === 'INSPECT' && !panel.open)) return false;
      const box = placement(kind); if (!box) return false;
      const continuing = visualState !== 'HIDDEN';
      hide();
      if (!host) {
        host = document.createElement('div'); host.className = 'sa-leo-visual';
        host.hidden = true; host.inert = true; host.setAttribute('aria-hidden', 'true');
        host.setAttribute('popover', 'manual');
        root.append(host);
      }
      Object.assign(host.style, { left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' });
      // The motion adapter may finish decoding asynchronously, never delaying UI.
      host.hidden = false;
      // Decorative top-layer sibling: stays outside the modal's content and focus.
      if (host.showPopover) host.showPopover();
      const method = { PEEK: 'showPeek', REACT: 'showReact', INSPECT: 'showInspect' }[kind];
      let tracked = false;
      const shown = () => {
        if (!autonomous || tracked) return;
        try { sessionStorage.setItem(introKey, 'true'); }
        catch (_) { interrupt(); return; }
        cancelIntro();
        tracked = true;
        try { window.StileAnalytics?.track('leo_peek_shown'); } catch (_) { /* Optional measurement. */ }
      };
      const finished = () => { hide(); if (autonomous && !tracked) scheduleIntro(4000); };
      if (safe(method, host, continuing, finished, shown) !== true) { hide(); return false; }
      visualState = kind;
      if (!adapter.completionDriven) shown();
      endTimer = setTimeout(() => {
        if (!adapter.completionDriven && typeof adapter.retreat === 'function') safe('retreat',hide); else hide();
      }, adapter.completionDriven ? 12000 : kind === 'PEEK' ? 2000 : kind === 'INSPECT' ? 2400 : 1200);
      return true;
    }
    function scheduleIntro(delay = 9000) {
      if (!available() || introCancelled || introTimer !== null || introAttempts >= 3 || reduced.matches || innerWidth < 768) return;
      try { if (sessionStorage.getItem(introKey) === 'true') return; }
      catch (_) { cancelIntro(); return; }
      if (panel.open || conflictingUI() || document.visibilityState !== 'visible' || !document.hasFocus()) { cancelIntro(); return; }
      introTimer = setTimeout(() => {
        introTimer = null;
        if (!introCancelled) {
          introAttempts++;
          if (!start('PEEK', true)) scheduleIntro(4000);
        }
      }, delay);
    }
    function environmentChanged() {
      if (reduced.matches || conflictingUI() || document.visibilityState !== 'visible' || innerWidth < 768) interrupt();
      else if (panel.open && visualState === 'PEEK') interrupt();
      else if (visualState !== 'HIDDEN' && !placement(visualState, true)) hide();
    }
    on(launcher, 'pointerenter', () => {
      // Warm the intentional REACT without a hover animation then click replay.
      if (adapter.completionDriven) { safe('warmReact'); return; }
      if (!pointer.matches || performance.now() - lastReact < 20000 || visualState !== 'HIDDEN') return;
      cancelIntro();
      if (start('REACT')) lastReact = performance.now();
    });
    on(root, 'stile:advisor-visual', event => {
      if (event.detail === 'photo-sent') { cancelIntro(); start('INSPECT'); }
      else if (event.detail === 'open') { cancelIntro(); start('REACT'); }
      else interrupt();
    });
    on(document, 'input', interrupt);
    on(document, 'keydown', event => { if (event.key.length === 1) interrupt(); });
    on(document, 'visibilitychange', environmentChanged);
    on(window, 'blur', interrupt);
    on(window, 'pagehide', interrupt);
    on(window, 'resize', environmentChanged);
    on(window, 'scroll', environmentChanged);
    on(reduced, 'change', environmentChanged);
    const observer = new MutationObserver(() => {
      if (!root.isConnected) controller.destroy(); else environmentChanged();
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'class', 'aria-hidden', 'aria-modal', 'hidden', 'inert'] });
    const controller = {
      get panelState() { return panelState(); },
      get visualState() { return visualState; },
      destroy() {
        if (destroyed) return;
        interrupt(); destroyed = true; abort.abort(); observer.disconnect(); safe('destroy'); host?.remove();
        controllers.delete(root);
      }
    };
    controllers.set(root, controller);
    if (typeof adapter.load === 'function') safe('load',scheduleIntro); else scheduleIntro();
    return controller;
  }
  window.StileLeo = Object.freeze({ init });
})();
