// Optional transparent motion. Unsupported media leaves the static Ask Leo launcher.
(function () {
  'use strict';
  if (window.StileLeo) return;
  const controllers = new WeakMap();
  const introKey = 'stile_leo_intro_seen';
  const idleKey = 'stile_leo_idle_seen';
  const interactionKey = 'stile_leo_last_interaction';
  const reactKey = 'stile_leo_last_react';
  let autonomousDisabled = false;

  function motionAdapter() {
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
    let ready = false, dead = false, revision = 0, active, host, idle, timer;
    const pendingFrames = new Set();
    const allowed = () => !dead && supportsVideo && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    function stop() {
      revision++; clearTimeout(timer);
      pendingFrames.forEach(cancel => cancel()); pendingFrames.clear();
      videos.forEach(v => { v.pause(); v.onended = null; if (v.dataset.alphaVerified) v.onerror = null; v.getAnimations().forEach(a => a.cancel()); });
      active = null;
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
    function visibleFrame(v, token) {
      // A compositor-submitted frame, followed by a paint opportunity. play(),
      // loadeddata and currentTime alone must never consume a session appearance.
      return new Promise(resolve => {
        let frame, raf, timeout, settled = false;
        const finish = value => {
          if (settled) return; settled = true;
          clearTimeout(timeout); cancelAnimationFrame(raf);
          if (frame !== undefined) v.cancelVideoFrameCallback?.(frame);
          pendingFrames.delete(cancel); resolve(value);
        };
        const cancel = () => finish(false); pendingFrames.add(cancel);
        const check = () => {
          if (token !== revision || !allowed() || document.visibilityState !== 'visible') return finish(false);
          const r = v.getBoundingClientRect(), h = host.getBoundingClientRect();
          if (!host.isConnected || host.hidden || getComputedStyle(host).display === 'none' || Number(getComputedStyle(host).opacity) < .9 || v.paused || r.width < 1 || h.top < 0 || h.bottom > innerHeight) return finish(false);
          try {
            const canvas = document.createElement('canvas'); canvas.width = canvas.height = 32;
            const ctx = canvas.getContext('2d'); ctx.drawImage(v,0,0,32,32);
            const bytes = ctx.getImageData(0,0,32,32).data; let clear = 0, subject = 0;
            for (let i=3;i<bytes.length;i+=4) { if (bytes[i]<8) clear++; if (bytes[i]>200) subject++; }
            finish(clear > 20 && subject > 20);
          } catch (_) { finish(false); }
        };
        timeout = setTimeout(cancel,1500);
        if (!v.requestVideoFrameCallback) return finish(false);
        frame = v.requestVideoFrameCallback(() => { raf=requestAnimationFrame(() => { raf=requestAnimationFrame(check); }); });
      });
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
        const scale = host.getBoundingClientRect().width / 230;
        Object.assign(v.style,{width:geometry[state].width*scale+'px',bottom:geometry[state].bottom*scale+'px'});
        v.currentTime = 0; viewport.append(v); host.replaceChildren(viewport,boundary);
        host.dataset.pose = state; host.dataset.renderer = 'motion'; active = v;
        // Keep the element transparent until playback succeeds. No broken flash.
        host.style.opacity = '0'; await v.play();
        if (token !== revision || !allowed()) return;
        host.style.opacity = '1';
        v.onerror = () => { if (token === revision) done(); };
        await v.animate([{opacity:0,translate:'0 16px'},{opacity:1,translate:'0 0'}],
          {duration:200,easing:'ease-out'}).finished;
        if (token !== revision || !allowed()) return;
        if (!await visibleFrame(v,token)) { if (token === revision) done(); return; }
        if (token !== revision) return;
        shown();
        v.onended = () => {
          v.onended = null;
          if (token !== revision) return;
          if (state === 'inspect') render('hide',token,done,true);
          else exit(done,token);
        };
      } catch (_) {
        if (token !== revision || !allowed()) return;
        if (retreat) { exit(done,token); return; }
        // Unsupported/failed alpha playback leaves only the functional launcher.
        done();
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
      showHide:(e,c,done,shown)=>show('hide',e,c,done,shown),
      hide() { stop(); if (host) host.style.opacity='0'; },
      destroy() {
        dead=true; stop(); if (idle !== undefined && 'cancelIdleCallback' in window) cancelIdleCallback(idle);
        videos.forEach(v=>{v.removeAttribute('src');v.load();v.remove();});cached.clear();
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
    const abort = new AbortController();
    let destroyed = false, failed = false, host = null;
    let visualState = 'HIDDEN', endTimer = null, epoch = 0, photoPending = false, typingUntil = 0;
    let lastReact = -Infinity, lastInteraction = 0;
    const autonomous = {
      first: { key:introKey, timer:null, attempts:0 },
      idle: { key:idleKey, timer:null, attempts:0 }
    };
    const deferredFirst = { used:false, armed:false, timer:null, checks:0, y:0, revision:0 };
    function read(key) { try { return sessionStorage.getItem(key); } catch (_) { autonomousDisabled = true; return null; } }
    function write(key,value) { try { sessionStorage.setItem(key,value); return true; } catch (_) { autonomousDisabled = true; cancelAutonomous(); return false; } }
    lastInteraction = Number(read(interactionKey)) || 0;
    lastReact = Number(read(reactKey)) || -Infinity;
    const panelState = () => panel.open ? 'OPEN' : 'CLOSED';
    const on = (target, type, callback) => target.addEventListener(type, callback, { signal: abort.signal });
    const available = () => adapter.ready === true && !failed && !destroyed;
    function safe(method, ...args) {
      try { return typeof adapter[method] === 'function' ? adapter[method](...args) : false; }
      catch (_) { failed = true; return false; }
    }
    function hide() {
      epoch++;
      clearTimeout(endTimer); endTimer = null;
      safe('hide');
      visualState = 'HIDDEN';
      if (host?.hidePopover && host.matches(':popover-open')) host.hidePopover();
      if (host && !host.hidden) host.hidden = true;
    }
    function cancelAutonomous() {
      Object.values(autonomous).forEach(slot => { clearTimeout(slot.timer); slot.timer = null; });
      cancelDeferredFirst();
    }
    function cancelDeferredFirst() {
      deferredFirst.revision++;
      deferredFirst.armed = false;
      clearTimeout(deferredFirst.timer); deferredFirst.timer = null;
      window.removeEventListener('scroll', deferredScroll);
    }
    function firstOpportunityReady() {
      return available() && !autonomousDisabled && innerWidth < 768 && !reduced.matches
        && document.visibilityState === 'visible' && document.hasFocus() && !conflictingUI()
        && !panel.open && !photoPending && Date.now() >= typingUntil && visualState === 'HIDDEN'
        && read(introKey) !== 'true' && read(idleKey) !== 'true' && !autonomousDisabled;
    }
    function deferredScroll() {
      clearTimeout(deferredFirst.timer); deferredFirst.timer = null;
      if (!deferredFirst.armed) return;
      // Scroll frames only reset a debounce; collision geometry is read once settled.
      if (scrollY - deferredFirst.y < 48) return;
      const revision = deferredFirst.revision;
      deferredFirst.timer = setTimeout(() => {
        deferredFirst.timer = null;
        if (!deferredFirst.armed || revision !== deferredFirst.revision) return;
        if (!firstOpportunityReady()) { cancelDeferredFirst(); return; }
        deferredFirst.y = scrollY; deferredFirst.checks++;
        if (placement('PEEK')) {
          cancelDeferredFirst();
          // The normal renderer still owns visible-pixel acknowledgement/session use.
          start('PEEK', 'first');
        } else if (deferredFirst.checks >= 6) cancelDeferredFirst();
      }, 320);
    }
    function deferFirstUntilScroll() {
      if (deferredFirst.used || !firstOpportunityReady()) return;
      deferredFirst.used = true; deferredFirst.armed = true; deferredFirst.y = scrollY;
      window.addEventListener('scroll', deferredScroll, { passive:true });
    }
    function interrupt() { cancelAutonomous(); hide(); }
    function meaningful() {
      lastInteraction = Date.now(); write(interactionKey,String(lastInteraction));
      autonomous.idle.attempts = 0;
      cancelAutonomous(); scheduleAutonomous('idle',60000);
    }
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
      if (reduced.matches || document.visibilityState !== 'visible' || !document.hasFocus() || conflictingUI()) return null;
      const mobile = innerWidth < 768;
      const besidePanel = panel.open;
      const anchor = (besidePanel ? panel : launcher).getBoundingClientRect();
      const width = mobile ? 135 : 230, scale = width/230, height = Math.ceil((adapter.motionGeometry ? 295 : 300)*scale);
      const chat = mobile && besidePanel ? root.querySelector('.sa-scroll')?.getBoundingClientRect() : null;
      const preferred = mobile
        ? {left:(chat || anchor).right-width-16,top:chat ? chat.bottom-height-12 : anchor.top-height-8,width,height}
        : besidePanel
        ? { left: anchor.left - width - 12, top: anchor.bottom - (adapter.motionGeometry ? 295 : 280), width, height }
        : { left: anchor.right - width, top: anchor.top - (adapter.motionGeometry ? 281 : 288), width, height };
      // Only the explicitly decorative homepage background is exempt. Foreground
      // project media, interactive cards, controls and the open panel stay protected.
      const decorative = el => el.matches('.hero-desktop-video') && !!el.closest('header.hero');
      const excluded = el => (!mobile && (el === launcher || launcher.contains(el))) || el === host || host?.contains(el) || !visible(el)
        || (chat && (el === panel || !panel.contains(el)));
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
        if(chat && (box.left<chat.left+12 || box.top<chat.top+12 || box.left+width>chat.right-12 || box.top+height>chat.bottom-8))return false;
        const top = box.top + (adapter.motionGeometry ? 0 : kind === 'PEEK' ? 88 : 22)*scale;
        return !inView.some(r => r.right > box.left - 8 && r.left < box.left + width + 8 && r.bottom > top - 4 && r.top < box.top + 283*scale + 8);
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
      // Mobile uses launcher-adjacent space or an empty area of the chat viewport;
      // message text and controls remain protected. No room means no character.
      if (mobile && !besidePanel) { xs.push(anchor.left-width-12); ys.push(anchor.top,anchor.bottom-height,innerHeight-height-16); }
      inView.forEach(r => { xs.push(r.left - width - 8, r.right + 8); });
      const candidates = [...new Set(xs)].filter(x => Math.abs(x - preferred.left) <= width * 2)
        .flatMap(left => ys.map(top => ({ left, top, width, height })))
        .sort((a,b) => Math.hypot(a.left-preferred.left,a.top-preferred.top)-Math.hypot(b.left-preferred.left,b.top-preferred.top));
      return candidates.find(safeBox) || null;
    }
    function start(kind, slotName = null) {
      if (!available() || (kind === 'PEEK' && (panel.open || photoPending || visualState !== 'HIDDEN')) || (kind === 'INSPECT' && !panel.open)) return false;
      const box = placement(kind); if (!box) return false;
      const continuing = visualState !== 'HIDDEN';
      hide();
      const token = epoch;
      if (!host) {
        host = document.createElement('div'); host.className = 'sa-leo-visual';
        host.hidden = true; host.inert = true; host.setAttribute('aria-hidden', 'true');
        host.setAttribute('popover', 'manual');
        root.append(host);
      }
      Object.assign(host.style, { left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' });
      host.style.setProperty('--leo-scale',String(box.width/230));
      // The motion adapter may finish decoding asynchronously, never delaying UI.
      host.hidden = false;
      // Decorative top-layer sibling: stays outside the modal's content and focus.
      if (host.showPopover) host.showPopover();
      const method = { PEEK: 'showPeek', REACT: 'showReact', INSPECT: 'showInspect', HIDE:'showHide' }[kind];
      let tracked = false;
      const shown = () => {
        if (token !== epoch || destroyed || tracked) return;
        if (!placement(kind,true)) { hide(); if(slotName)scheduleAutonomous(slotName,4000); return; }
        tracked = true;
        if (slotName) {
          if (!write(autonomous[slotName].key,'true')) { interrupt(); return; }
          meaningful();
          try { window.StileAnalytics?.track('leo_peek_shown'); } catch (_) { /* Optional measurement. */ }
        }
      };
      const finished = () => { if(token!==epoch||destroyed)return; hide(); if(slotName&&!tracked)scheduleAutonomous(slotName,4000); };
      visualState = kind;
      if (safe(method, host, continuing, finished, shown) !== true) { hide(); return false; }
      // Production adapter confirms a composited frame. Test/custom adapters must
      // explicitly invoke shown as well; a successful method return is insufficient.
      endTimer = setTimeout(() => {
        finished();
      },12000);
      return true;
    }
    function scheduleAutonomous(name, delay) {
      const slot = autonomous[name];
      // A deferred first opportunity never turns back into timed placement polling.
      if (name === 'first' && deferredFirst.used) return;
      if (!available() || autonomousDisabled || slot.timer !== null || slot.attempts >= 3 || reduced.matches || read(slot.key)==='true' || read(idleKey)==='true' || autonomousDisabled) return;
      slot.timer = setTimeout(() => {
        slot.timer = null; slot.attempts++;
        if (destroyed || autonomousDisabled) return;
        const safe = !panel.open && !photoPending && Date.now() >= typingUntil && visualState==='HIDDEN';
        if (name === 'first' && firstOpportunityReady() && !placement('PEEK')) {
          deferFirstUntilScroll(); return;
        }
        if (!safe || !start('PEEK',name)) scheduleAutonomous(name,4000);
      }, delay);
    }
    function resumeAutonomous() {
      if (destroyed || autonomousDisabled) return;
      if (lastInteraction) scheduleAutonomous('idle',Math.max(0,60000-(Date.now()-lastInteraction)));
      else scheduleAutonomous('first',3000);
    }
    function environmentChanged() {
      if (reduced.matches || conflictingUI() || document.visibilityState !== 'visible' || !document.hasFocus()) interrupt();
      else if (panel.open && visualState === 'PEEK') hide();
      else if (visualState !== 'HIDDEN' && !placement(visualState, true)) { hide(); resumeAutonomous(); }
    }
    on(launcher, 'pointerenter', () => {
      safe('warmReact'); // Hover never initiates a reaction.
    });
    on(root, 'stile:advisor-visual', event => {
      if (event.detail === 'photo-sent') { photoPending=true; meaningful(); hide(); start('INSPECT'); }
      else if (event.detail === 'open') {
        meaningful();
        if (photoPending) return;
        hide();
        if (Date.now()-lastReact>=25000 && start('REACT')) { lastReact=Date.now(); write(reactKey,String(lastReact)); }
      } else if (event.detail === 'close') {
        meaningful(); const participating=visualState!=='HIDDEN'; hide();
        if(participating)start('HIDE');
      } else { photoPending=false; meaningful(); hide(); }
    });
    function inputActivity() { typingUntil=Date.now()+60000; meaningful(); if(visualState!=='INSPECT')hide(); }
    on(document, 'input', inputActivity);
    on(document, 'keydown', event => { if (event.key.length === 1) inputActivity(); });
    on(root,'pointerdown',() => { if(panel.open) meaningful(); });
    on(document, 'visibilitychange', environmentChanged);
    on(window, 'blur', interrupt);
    on(window, 'pagehide', interrupt);
    on(window, 'focus', resumeAutonomous);
    on(document,'visibilitychange',() => { if(document.visibilityState==='visible')resumeAutonomous(); });
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
    if (typeof adapter.load === 'function') safe('load',resumeAutonomous); else resumeAutonomous();
    return controller;
  }
  window.StileLeo = Object.freeze({ init });
})();
