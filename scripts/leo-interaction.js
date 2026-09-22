// Optional decorative layer. No character artwork or animation runtime is bundled.
(function () {
  'use strict';
  if (window.StileLeo) return;
  const controllers = new WeakMap();
  const introKey = 'stile_leo_intro_seen';
  let autonomousDisabled = false;
  const noVisual = Object.freeze({ ready: false, hide() {}, destroy() {} });

  function init(root, adapter = noVisual) {
    if (!root || controllers.has(root)) return controllers.get(root);
    const launcher = root.querySelector('.sa-launcher');
    const panel = root.querySelector('dialog');
    if (!launcher || !panel) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const abort = new AbortController();
    let destroyed = false, failed = false, host = null;
    let visualState = 'HIDDEN', introTimer = null, endTimer = null, lastReact = -Infinity;
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
    function placement(kind) {
      // Conservative mobile fallback, including all 375/390 layouts. A final asset
      // must pass an additional rendered mobile review before relaxing this rule.
      if (innerWidth < 768 || reduced.matches || document.visibilityState !== 'visible' || !document.hasFocus() || conflictingUI()) return null;
      const anchor = (kind === 'INSPECT' ? panel : launcher).getBoundingClientRect();
      const width = 144, height = 160;
      const box = kind === 'INSPECT'
        ? { left: anchor.left - width - 12, top: anchor.bottom - height, width, height }
        : { left: anchor.right - width, top: anchor.top - height - 8, width, height };
      if (box.left < 16 || box.top < 16 || box.left + width > innerWidth - 16 || box.top + height > innerHeight - 16) return null;
      const overlaps = el => {
        if (el === launcher || el === host || host?.contains(el) || !visible(el)) return false;
        const r = el.getBoundingClientRect();
        return r.right > box.left - 8 && r.left < box.left + width + 8 && r.bottom > box.top - 8 && r.top < box.top + height + 8;
      };
      // Protect all visible actions and project media, not merely the safe-area inset.
      if ([...document.querySelectorAll('button, a[href], input, textarea, select, img, video, [role="button"]')].some(overlaps)) return null;
      return box;
    }
    function start(kind, autonomous = false) {
      if (!available() || (kind !== 'INSPECT' && panel.open) || (kind === 'INSPECT' && !panel.open)) return false;
      const box = placement(kind); if (!box) return false;
      hide();
      if (!host) {
        host = document.createElement('div'); host.className = 'sa-leo-visual';
        host.hidden = true; host.inert = true; host.setAttribute('aria-hidden', 'true');
        root.append(host);
      }
      Object.assign(host.style, { left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' });
      // The ready adapter MUST begin playback synchronously and return true only
      // after it has begun. Loading belongs outside this controller.
      if (autonomous) {
        try { sessionStorage.setItem(introKey, 'true'); }
        catch (_) { interrupt(); return false; }
        introCancelled = true; autonomousDisabled = true;
      }
      host.hidden = false;
      const method = { PEEK: 'showPeek', REACT: 'showReact', INSPECT: 'showInspect' }[kind];
      if (safe(method, host) !== true) { safe('hide'); host.hidden = true; return false; }
      visualState = kind;
      if (autonomous) { try { window.StileAnalytics?.track('leo_peek_shown'); } catch (_) { /* Optional measurement. */ } }
      endTimer = setTimeout(hide, kind === 'PEEK' ? 2200 : kind === 'INSPECT' ? 2400 : 1200);
      return true;
    }
    function scheduleIntro() {
      if (!available() || introCancelled || reduced.matches || innerWidth < 768) return;
      try { if (sessionStorage.getItem(introKey) === 'true') return; }
      catch (_) { cancelIntro(); return; }
      if (panel.open || conflictingUI() || document.visibilityState !== 'visible' || !document.hasFocus()) { cancelIntro(); return; }
      introTimer = setTimeout(() => {
        introTimer = null;
        if (!introCancelled) { start('PEEK', true); cancelIntro(); }
      }, 9000);
    }
    function environmentChanged() {
      if (reduced.matches || conflictingUI() || document.visibilityState !== 'visible' || innerWidth < 768) interrupt();
      else if (panel.open && visualState !== 'INSPECT') interrupt();
      else if (visualState !== 'HIDDEN' && !placement(visualState)) hide();
    }
    on(launcher, 'pointerenter', () => {
      if (!pointer.matches || performance.now() - lastReact < 20000 || visualState !== 'HIDDEN') return;
      cancelIntro();
      if (start('REACT')) lastReact = performance.now();
    });
    on(root, 'stile:advisor-visual', event => {
      if (event.detail === 'photo-sent') { cancelIntro(); start('INSPECT'); }
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
    controllers.set(root, controller); scheduleIntro();
    return controller;
  }
  window.StileLeo = Object.freeze({ init });
})();
