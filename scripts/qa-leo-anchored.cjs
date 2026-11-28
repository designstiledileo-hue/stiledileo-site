// Loopback-only. Real original motion and real page; the Advisor reply is
// simulated, and inquiries and analytics never leave the preview.
const { chromium, devices, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const pw = path.dirname(require.resolve(process.env.PLAYWRIGHT_MODULE || 'playwright'));
const { PNG } = require(path.join(pw, '../playwright-core/lib/utilsBundle.js'));
const base = process.env.LEO_QA_BASE || 'http://127.0.0.1:8917';
const out = process.env.LEO_QA_OUTPUT || '/private/tmp/stile-leo-anchored';
assert.match(base, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
fs.mkdirSync(out, { recursive: true });

const visible = '.sa-leo-visual[data-phase="visible"]';
const launcher = '.sa-launcher';
const sourcePrefix = '/images/leo-advisor/motion/';
const considered = 'stile_leo_anchored_intro_attempted';
const ready = (page) => page.waitForFunction((selector) => {
  const host = document.querySelector(selector);
  const video = host?.querySelector('video');
  return !!video && !video.paused && video.currentTime > 0.42 && Number(getComputedStyle(host).opacity) > 0.98;
}, visible, { timeout: 9000, polling: 40 });

function probe() {
  const host = document.querySelector('.sa-leo-visual[data-phase="visible"]');
  const button = document.querySelector('.sa-launcher');
  const video = host?.querySelector('video');
  if (!video || video.paused) return null;
  const vr = video.getBoundingClientRect(), hr = host.getBoundingClientRect(), br = button.getBoundingClientRect();
  const c = document.createElement('canvas');
  c.width = Math.round(vr.width);
  c.height = Math.round(vr.height);
  const ctx = c.getContext('2d');
  ctx.drawImage(video, 0, 0, c.width, c.height);
  const rgba = ctx.getImageData(0, 0, c.width, c.height).data;
  const samples = [];
  let left = Infinity, right = -Infinity, bottom = -Infinity, clear = 0, hash = 2166136261;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const offset = (y * c.width + x) * 4;
      const alpha = rgba[offset + 3];
      hash = Math.imul(hash ^ alpha, 16777619);
      if (alpha < 8) clear++;
      if (alpha > 32) {
        left = Math.min(left, vr.left + x);
        right = Math.max(right, vr.left + x + 1);
        bottom = Math.max(bottom, vr.top + y + 1);
      }
      if (alpha > 244 && x % 4 === 0 && y % 4 === 0) {
        samples.push([Math.round(vr.left + x), Math.round(vr.top + y), rgba[offset], rgba[offset + 1], rgba[offset + 2]]);
      }
    }
  }
  return { bounds: { left, right, bottom }, button: br.toJSON(), host: hr.toJSON(), scrollY, sameParent: button.parentElement === host.parentElement,
    src: video.getAttribute('src'), time: video.currentTime, clear, hash, samples, muted: video.muted, inline: video.playsInline };
}
function pixelMatch(img, p) {
  if (!p?.samples.length) return 0;
  return p.samples.filter(([x, y, r, g, b]) => {
    const index = (y * img.width + x) * 4;
    return (Math.abs(img.data[index] - r) + Math.abs(img.data[index + 1] - g) + Math.abs(img.data[index + 2] - b)) / 3 < 42;
  }).length / p.samples.length;
}
function assertBounds(frame, format) {
  assert(frame);
  const { bounds, host, button, clear, samples } = frame;
  assert(frame.sameParent && frame.muted && frame.inline);
  assert.equal(host.left, button.left);
  assert.equal(host.right, button.right);
  assert.equal(button.top - host.bottom, 4);
  assert(bounds.left >= button.left && bounds.right <= button.right && bounds.bottom <= button.top);
  assert(clear > 50 && samples.length > 25);
  assert(frame.src.endsWith('/leo-peek.' + format));
}

async function setup(browser, viewport, opts = {}) {
  const size = { width: viewport.width, height: viewport.height };
  const ctx = await browser.newContext({
    ...(opts.mobile ? devices['iPhone 13 Pro Max'] : {}),
    viewport, deviceScaleFactor: 1, reducedMotion: opts.reduced ? 'reduce' : 'no-preference',
    ...(opts.record ? { recordVideo: { dir: path.join(out, 'recordings'), size } } : {})
  });
  const page = await ctx.newPage();
  const errors = [], media = [], scripts = [], provider = [], unexpectedPosts = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', req => {
    if (req.url().includes(sourcePrefix)) media.push(new URL(req.url()).pathname);
    if (req.url().endsWith('/scripts/leo-interaction.js')) scripts.push(req.url());
  });
  await ctx.route('**/*', route => {
    const req = route.request();
    if (!req.url().startsWith(base + '/')) return route.fulfill({ status: 204, body: '' });
    if (opts.badMedia && req.url().includes(sourcePrefix)) return route.abort();
    if (req.method() === 'POST' && new URL(req.url()).pathname === '/api/finish-advisor') {
      provider.push(req.postDataJSON());
      return route.fulfill({ json: { reply: 'Local review fixture: a quiet mineral finish may suit this project.', links: [{ label: 'See projects', path: '/projects.html' }] } });
    }
    if (req.method() === 'POST') {
      unexpectedPosts.push(new URL(req.url()).pathname);
      return route.abort();
    }
    return route.continue();
  });
  await page.addInitScript(() => {
    window.leoQA = { shifts: [] };
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue;
          leoQA.shifts.push({ value: entry.value, sources: entry.sources.map(item => String(item.node?.className || '')) });
        }
      }).observe({ type: 'layout-shift' });
    } catch (_) {}
  });
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.locator(launcher).waitFor();
  if (!opts.reduced && !opts.earlyAdvisor) {
    await page.waitForFunction(() => !!window.StileLeo, undefined, { polling: 100, timeout: 10000 });
    const scriptDelay = await page.evaluate(() => {
      const request = performance.getEntriesByType('resource').find(({ name }) => name.endsWith('/scripts/leo-interaction.js'));
      const nav = performance.getEntriesByType('navigation')[0];
      return request?.startTime - nav?.loadEventEnd;
    });
    assert(scriptDelay > 675, `Motion must wait for page load and paint; delay ${scriptDelay}`);
  }
  return { ctx, page, errors, media, scripts, provider, unexpectedPosts };
}

async function scene(browser, label, viewport, format, opts) {
  const run = await setup(browser, viewport, opts);
  const { ctx, page } = run;
  const file = path.join(out, label + '-peek.png');
  const movie = opts.record ? path.join(out, label + '-review.webm') : null;
  try {
    const initiallyCoveredLinks = await page.evaluate(() => {
      const button = document.querySelector('.sa-launcher').getBoundingClientRect();
      const targets = [...document.querySelectorAll('.hero-media figcaption a, a[href*="google.com/maps/place/Stile"]')];
      return targets.filter(link => {
        const box = link.getBoundingClientRect();
        return box.left < button.right && box.right > button.left && box.top < button.bottom && box.bottom > button.top;
      }).map(link => link.textContent.trim());
    });
    assert.deepEqual(initiallyCoveredLinks, [], 'Launcher must not cover project and Google review links at the homepage top');
    let initial = 'TOP';
    if (opts.allowScroll) {
      // One ordinary stop, never a hunt for a position that lets Leo play.
      const atTop = await page.locator('.sa-leo-motion').waitFor({ state: 'attached', timeout: 3400 }).then(() => true, () => false);
      if (!atTop) {
        assert.equal(run.media.length, 0, 'A blocked position must not download video');
        initial = 'FOREGROUND_AT_TOP';
        await page.screenshot({ path: path.join(out, label + '-top-blocked.png') });
        await page.evaluate(() => scrollTo({ top: 220, behavior: 'instant' }));
        await page.waitForFunction(key => sessionStorage.getItem(key) === 'true', considered, { timeout: 4000 });
        if (opts.allowStatic && !run.media.length) {
          await page.evaluate(() => scrollTo({ top: 1710, behavior: 'instant' }));
          await page.waitForTimeout(850);
          assert(await page.locator('.sa-leo-visual').isHidden());
          assert.equal(run.media.length, 0);
          assert.deepEqual(run.errors, []);
          return { label, viewport, file: path.join(out, label + '-top-blocked.png'), movie, initial,
            outcome: 'STATIC_AFTER_FIRST_SCROLL', fallbackOffset: 220, checkedNoFurtherScrollPlayback: 1710, errors: run.errors };
        }
      }
    }
    try { await ready(page); }
    catch (error) {
      await page.screenshot({ path: path.join(out, label + '-no-peek.png') });
      throw error;
    }
    const before = await page.evaluate(probe);
    const shot = PNG.sync.read(await page.screenshot({ path: file, scale: 'css' }));
    const after = await page.evaluate(probe);
    assertBounds(before, format);
    assertBounds(after, format);
    const renderedMatch = Math.max(pixelMatch(shot, before), pixelMatch(shot, after));
    assert(renderedMatch > .65, `Expected composited Leo pixels for ${label}; ratio ${renderedMatch}`);
    if (!opts.allowScroll) assert.equal(before.scrollY, 0, 'Measure from untouched homepage top');
    await page.waitForFunction(t => document.querySelector('.sa-leo-motion')?.currentTime > t + .26, before.time);
    const later = await page.evaluate(probe);
    assertBounds(later, format);
    assert.notEqual(before.hash, later.hash, 'Alpha silhouette must change during the original motion');
    if (opts.workflow) {
      await page.locator(launcher).click();
      assert(await page.locator('#stile-advisor dialog').isVisible());
      assert(await page.locator('.sa-leo-visual').isHidden());
      const textarea = page.locator('#stile-advisor textarea');
      await textarea.fill('Which finish suits a residential feature wall?');
      await page.locator('.sa-send').click();
      await page.getByRole('link', { name: 'See projects' }).waitFor();
      assert.equal(run.provider.length, 1);
      assert.equal(run.provider[0].image, undefined);
      await textarea.fill('My project in Burnaby has a plaster range hood.');
      const img = await page.evaluate(() => {
        const c = document.createElement('canvas'); c.width = c.height = 28;
        c.getContext('2d').fillRect(0, 0, 28, 28);
        return c.toDataURL().split(',')[1];
      });
      await page.locator('#stile-advisor input[type=file]').setInputFiles({ name: 'local-test.png', mimeType: 'image/png', buffer: Buffer.from(img, 'base64') });
      await page.waitForFunction(() => document.querySelector('.sa-status').textContent.includes('Photo ready'));
      await page.waitForTimeout(1500); // Existing Advisor has a 1.5 second send guard.
      await page.locator('.sa-send').click();
      await page.getByRole('link', { name: 'See projects' }).last().waitFor();
      assert.equal(run.provider.length, 2);
      assert.match(run.provider[1].image, /^data:image\/jpeg;base64,/);
      assert(await page.locator('.sa-leo-visual').isHidden());
      await page.locator('.sa-handoff').click();
      await page.locator('#estimate-modal.is-open').waitFor();
      assert.equal(await page.locator('#estimate-form [name=lead_source]').inputValue(), 'finish_advisor');
      assert.match(await page.locator('#estimate-details').inputValue(), /Burnaby/);
      assert.equal(await page.locator('#estimate-photo').evaluate(el => el.files.length), 1);
      assert.deepEqual(run.unexpectedPosts, []);
    } else {
      await page.locator('.sa-leo-visual').waitFor({ state: 'hidden' });
      await page.screenshot({ path: path.join(out, label + '-hidden.png') });
    }
    assert.equal(await page.evaluate(() => sessionStorage.getItem('stile_leo_intro_seen')), 'true');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.evaluate(() => leoQA.shifts.some(entry => entry.sources.some(source => /sa-leo|sa-launcher/.test(source)))), false);
    assert.deepEqual(run.errors, []);
    if (opts.once) {
      const requests = run.media.length;
      await page.goto(base + '/marmorino-retail-interiors.html', { waitUntil: 'domcontentloaded' });
      await page.locator(launcher).waitFor();
      await page.waitForTimeout(4200);
      assert(await page.locator('.sa-leo-visual').isHidden());
      assert.equal(run.media.length, requests);
    }
    const { samples: _unused, ...frame } = before;
    return { label, viewport, file, movie, initial, outcome: initial === 'TOP' ? 'AUTONOMOUS_TOP' : 'AUTONOMOUS_FIRST_SCROLL',
      ...frame, renderedMatch, laterTime: later.time, advisor: opts.workflow ? 'SIMULATED_PASS' : 'NOT_TESTED', errors: run.errors };
  } finally {
    const video = page.video();
    await ctx.close();
    if (movie && video) await video.saveAs(movie);
  }
}

async function optionalFailure(chrome, label, options) {
  const run = await setup(chrome, { width: 1440, height: 900 }, options);
  try {
    await run.page.waitForTimeout(3400);
    assert.equal(await run.page.locator(visible).count(), 0);
    if (options.reduced) {
      assert.deepEqual(run.media, [], 'Reduced motion must not fetch decorative video');
      assert.deepEqual(run.scripts, [], 'Reduced motion must not fetch decorative code');
    }
    else assert(run.media.length > 0, 'Failed-media fixture must exercise retrieval');
    await run.page.locator(launcher).click();
    assert(await run.page.locator('#stile-advisor dialog').isVisible());
    assert(await run.page.locator('.sa-leo-visual').isHidden());
    assert.deepEqual(run.errors, []);
    return { label, videoRequests: run.media.length, advisor: 'PASS' };
  } finally { await run.ctx.close(); }
}

async function oneScrollFallback(chrome, remainBlocked) {
  const label = remainBlocked ? 'blocked first scroll stays static' : 'one clear settled-scroll fallback';
  const run = await setup(chrome, { width: 1440, height: 900 });
  const { page } = run;
  try {
    // This collision fixture is deliberately test-only. The real motion and
    // launcher are still measured in the browser with no forced controller state.
    await page.evaluate(() => {
      const protector = document.createElement('div');
      protector.id = 'leo-qa-protector';
      protector.dataset.leoProtect = '';
      protector.style.cssText = 'position:fixed;right:20px;bottom:66px;width:100px;height:120px;pointer-events:none';
      document.body.append(protector);
    });
    await page.waitForTimeout(3050);
    assert.equal(run.media.length, 0);
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), considered), null);
    if (!remainBlocked) await page.locator('#leo-qa-protector').evaluate(el => el.remove());
    await page.evaluate(() => scrollTo({ top: 24, behavior: 'instant' }));
    await page.waitForTimeout(550);
    assert.equal(run.media.length, 0, 'Minor scroll/toolbar jitter is not the fallback');
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), considered), null);
    await page.evaluate(() => scrollTo({ top: 90, behavior: 'instant' }));
    await page.waitForFunction(key => sessionStorage.getItem(key) === 'true', considered, { timeout: 4500 });
    if (remainBlocked) {
      await page.locator('#leo-qa-protector').evaluate(el => el.remove());
      await page.evaluate(() => scrollTo({ top: 220, behavior: 'instant' }));
      await page.waitForTimeout(750);
      assert.equal(run.media.length, 0);
      assert(await page.locator('.sa-leo-visual').isHidden());
    } else {
      await ready(page);
      const frame = await page.evaluate(probe);
      assertBounds(frame, 'webm');
      assert.equal(frame.scrollY, 90);
      await page.locator('.sa-leo-visual').waitFor({ state: 'hidden' });
    }
    assert.deepEqual(run.errors, []);
    return { label, mediaRequests: run.media.length, errors: run.errors };
  } finally { await run.ctx.close(); }
}

async function openingPrecedesMotion(chrome) {
  const run = await setup(chrome, { width: 1440, height: 900 }, { earlyAdvisor: true });
  try {
    await run.page.locator(launcher).click();
    assert(await run.page.locator('#stile-advisor dialog').isVisible());
    await run.page.getByRole('button', { name: 'Close Finish Advisor' }).click();
    await run.page.waitForTimeout(4100);
    assert.deepEqual(run.scripts, []);
    assert.deepEqual(run.media, []);
    assert.deepEqual(run.errors, []);
    return { label: 'Advisor opens before motion and prevents late surprise', advisor: 'PASS', errors: run.errors };
  } finally { await run.ctx.close(); }
}

(async () => {
  const chrome = await chromium.launch({ channel: 'chrome' });
  const safari = await webkit.launch();
  try {
    // Do not contend with another tab for browser visibility while judging an
    // autonomous animation. Chrome and WebKit can run independently.
    const groups = [
      [
        () => scene(chrome, 'desktop-1440x900', { width: 1440, height: 900 }, 'webm', { record: true, once: true }),
        () => scene(chrome, 'desktop-1440x1000', { width: 1440, height: 1000 }, 'webm', { workflow: true }),
        () => optionalFailure(chrome, 'reduced motion', { reduced: true }),
        () => optionalFailure(chrome, 'media unavailable', { badMedia: true }),
        () => oneScrollFallback(chrome, false),
        () => oneScrollFallback(chrome, true),
        () => openingPrecedesMotion(chrome)
      ], [
        () => scene(safari, 'mobile-375x812', { width: 375, height: 812 }, 'mov', { mobile: true, allowScroll: true, allowStatic: true }),
        () => scene(safari, 'mobile-390x844', { width: 390, height: 844 }, 'mov', { mobile: true, record: true, allowScroll: true, allowStatic: true }),
        () => scene(safari, 'iphone-13-pro-max-webkit', devices['iPhone 13 Pro Max'].viewport, 'mov', { mobile: true, record: true, workflow: true }),
        () => scene(safari, 'iphone-13-pro-max-expanded-428x926', { width: 428, height: 926 }, 'mov', { mobile: true, allowScroll: true, allowStatic: true })
      ]
    ];
    const settled = (await Promise.all(groups.map(async jobs => {
      const results = [];
      for (const job of jobs) results.push((await Promise.allSettled([job()]))[0]);
      return results;
    }))).flat();
    fs.writeFileSync(path.join(out, 'leo-qa.json'), JSON.stringify(settled.map(row => row.status === 'fulfilled' ? row.value : { failure: row.reason.stack }), null, 2) + '\n');
    for (const row of settled) {
      if (row.status === 'fulfilled') console.log('PASS', row.value.label);
      else console.error(row.reason);
    }
    assert(settled.every(row => row.status === 'fulfilled'), 'At least one Ask Leo QA scenario failed');
  } finally {
    await Promise.all([chrome.close(), safari.close()]);
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
