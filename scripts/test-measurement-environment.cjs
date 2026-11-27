// Execute the real shared gate and tracker offline. No network or form submissions.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const bootstrap = read('scripts/measurement-bootstrap.js');
const tracker = read('scripts/analytics.js');
const testKey = 'stile_measurement_test_v1';
const ttl = 2 * 60 * 60 * 1000;
const now = 1_800_000_000_000;
const makeLink = href => ({
  href, dataset: {}, textContent: 'Published link',
  getAttribute(name) { return name === 'href' ? this.href : null; },
  setAttribute(name, value) { if (name === 'href') this.href = value; },
  closest() { return null; }
});
function page(url = 'https://stiledileo.com/feature-wall-tv-wall-vancouver.html', options = {}) {
  const storage = options.storage || new Map();
  const handlers = new Map();
  const loaders = [];
  const links = options.links || [];
  const blocked = () => { throw new Error('Storage is blocked'); };
  const sandbox = {
    location: new URL(url),
    document: {
      title: 'Published page title', referrer: options.referrer || '', readyState: options.readyState || 'loading',
      querySelectorAll: () => links,
      addEventListener(type, callback, settings) {
        if (!handlers.has(type)) handlers.set(type, []);
        handlers.get(type).push({callback, capture: settings === true});
      },
      createElement: tag => ({tagName: tag}), head: {appendChild: node => loaders.push(node), append: () => {}}
    },
    sessionStorage: options.blockStorage
      ? {getItem: blocked, setItem: blocked, removeItem: blocked}
      : {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key)},
    URL, URLSearchParams, WeakSet, Set,
    Date: class extends Date { static now() { return options.now ?? now; } }
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  return {
    sandbox, storage, links, loaders,
    runBootstrap: () => vm.runInContext(bootstrap, context),
    runTracker: () => vm.runInContext(tracker, context),
    commands: () => Array.from(sandbox.dataLayer || [], args => Array.from(args)),
    fire(type, event = {}) {
      const callbacks = handlers.get(type) || [];
      for (const {callback} of [...callbacks].sort((a, b) => Number(b.capture) - Number(a.capture))) callback(event);
    }
  };
}
const ga4Configs = view => view.commands().filter(args => args[0] === 'config' && args[1] === 'G-P7VJ8MQNKS');
const events = view => view.commands().filter(args => args[0] === 'event');
function assertSuppressed(view) {
  assert.equal(view.sandbox.StileMeasurement.enabled, false);
  assert.equal(view.loaders.length, 0, 'no Google script request');
  assert.deepEqual(view.commands(), [], 'no js, config, page_view or conversion commands');
}

test('all 54 measured heads including furniture use the same synchronous gate before their deferred tracker', () => {
  const files = fs.readdirSync(root).filter(file => file.endsWith('.html'));
  const measured = files.filter(file => read(file).includes('src="/scripts/analytics.js"'));
  const sitemapPages = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, url]) => new URL(url).pathname.slice(1) || 'index.html');
  assert.equal(measured.length, 54);
  assert.deepEqual(measured.sort(), [...sitemapPages, 'car.html', 'furniture.html'].sort());
  for (const file of measured) {
    const head = read(file).split('</head>')[0];
    const scripts = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    const gates = scripts.filter(match => /\bsrc="\/scripts\/measurement-bootstrap\.js"/.test(match[1]));
    assert.equal(gates.length, 1, file);
    assert(!/\b(?:async|defer|type)\b/.test(gates[0][1]), `${file}: parser-blocking gate`);
    assert(head.indexOf('/scripts/measurement-bootstrap.js') < head.indexOf('/scripts/analytics.js'), file);
    assert.match(scripts.find(match => /\bsrc="\/scripts\/analytics\.js"/.test(match[1]))[1], /\bdefer\b/);
    assert(!/googletagmanager\.com|gtag\s*\(/.test(head), `${file}: no unconditional Google loader or inline config`);
  }
});

test('only the two exact production hosts load and configure GA4 once', () => {
  for (const hostname of ['stiledileo.com', 'www.stiledileo.com', 'localhost', '127.0.0.1', 'main--designbyleo.netlify.app', 'deploy-preview-1--designbyleo.netlify.app', 'stiledileo.com.example.net']) {
    const view = page(`https://${hostname}/feature-wall-tv-wall-vancouver.html`);
    view.runBootstrap();
    const enabled = ['stiledileo.com', 'www.stiledileo.com'].includes(hostname);
    assert.equal(view.sandbox.StileMeasurement.ready, true);
    assert.equal(view.sandbox.StileMeasurement.enabled, enabled, hostname);
    if (!enabled) { assertSuppressed(view); continue; }
    assert.equal(view.loaders.length, 1);
    assert.equal(view.loaders[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-P7VJ8MQNKS');
    assert.equal(view.loaders[0].async, true);
    assert.deepEqual(view.commands().map(args => args[0]), ['js', 'config']);
    assert.equal(ga4Configs(view).length, 1);
  }
});

test('test1 suppresses the production page before any Google loader, even with blocked storage', () => {
  for (const blockStorage of [false, true]) {
    const view = page('https://stiledileo.com/?stile_test=1', {blockStorage});
    view.runBootstrap();
    assert.equal(view.sandbox.StileMeasurement.testMode, true);
    assertSuppressed(view);
  }
  const conflicting = page('https://stiledileo.com/?stile_test=0&stile_test=1');
  conflicting.runBootstrap();
  assertSuppressed(conflicting);
});

test('same-tab test mode has a fixed two-hour lifetime, expires, and is not extended by navigation', () => {
  const storage = new Map();
  const first = page('https://stiledileo.com/?stile_test=1', {storage});
  first.runBootstrap();
  assert.equal(JSON.parse(storage.get(testKey)).expires_at, now + ttl);
  const next = page('https://stiledileo.com/projects.html', {storage, now: now + 60_000});
  next.runBootstrap();
  assertSuppressed(next);
  assert.equal(JSON.parse(storage.get(testKey)).expires_at, now + ttl);
  const repeated = page('https://stiledileo.com/?stile_test=1', {storage, now: now + 120_000});
  repeated.runBootstrap();
  assertSuppressed(repeated);
  assert.equal(JSON.parse(storage.get(testKey)).expires_at, now + ttl);
  const expired = page('https://stiledileo.com/', {storage, now: now + ttl});
  expired.runBootstrap();
  assert.equal(expired.sandbox.StileMeasurement.enabled, true);
  assert.equal(storage.has(testKey), false);
});

test('malformed, obsolete, expired, and unbounded stored markers cannot stick', () => {
  for (const saved of ['1', '{broken', 'null', '[]', '{}', JSON.stringify({expires_at: '1800000001000'}), JSON.stringify({expires_at: now - 1}), JSON.stringify({expires_at: now + ttl + 1})]) {
    const storage = new Map([[testKey, saved]]);
    const view = page('https://stiledileo.com/', {storage});
    view.runBootstrap();
    assert.equal(view.sandbox.StileMeasurement.enabled, true, saved);
    assert.equal(storage.has(testKey), false, saved);
  }
});

test('an explicit test1 replaces malformed persistence and still suppresses before any tag command', () => {
  const storage = new Map([[testKey, '{invalid']]);
  const view = page('https://stiledileo.com/?stile_test=1', {storage});
  view.runBootstrap();
  assertSuppressed(view);
  assert.equal(JSON.parse(storage.get(testKey)).expires_at, now + ttl);
  const readyLink = makeLink('/projects.html');
  const ready = page('https://stiledileo.com/?stile_test=1', {blockStorage: true, links: [readyLink], readyState: 'complete'});
  ready.runBootstrap();
  assert.equal(new URL(readyLink.href, ready.sandbox.location.href).searchParams.get('stile_test'), '1');
});

test('test0 clears persistence but keeps its document suppressed until a fresh clean navigation', () => {
  for (const saved of [undefined, JSON.stringify({expires_at: now + ttl})]) {
    const storage = new Map(saved ? [[testKey, saved]] : []);
    const link = makeLink('/projects.html');
    const clearing = page('https://stiledileo.com/?stile_test=0', {storage, links: [link]});
    clearing.runBootstrap();
    clearing.fire('DOMContentLoaded');
    assertSuppressed(clearing);
    assert.equal(storage.has(testKey), false);
    assert.equal(link.href, '/projects.html', 'clear must not re-add the test marker');
    clearing.sandbox.location.search = '';
    clearing.runBootstrap();
    assertSuppressed(clearing);
    const fresh = page('https://stiledileo.com/projects.html', {storage});
    fresh.runBootstrap();
    assert.equal(fresh.sandbox.StileMeasurement.enabled, true);
  }
  const blocked = page('https://stiledileo.com/?stile_test=0', {blockStorage: true});
  blocked.runBootstrap();
  assertSuppressed(blocked);
});

test('blocked-storage test navigation preserves its expiry and excludes external, contact and fragment links', () => {
  const links = ['/projects.html?campaign=published#gallery', 'https://stiledileo.com/#estimate', 'tel:+16047732298', 'mailto:designstiledileo@gmail.com', 'https://external.example/path?name=private#fragment', 'https://www.stiledileo.com/projects.html', '#estimate', '/?stile_test=0'].map(makeLink);
  const view = page('https://stiledileo.com/?stile_test=1', {blockStorage: true, links});
  view.runBootstrap();
  view.fire('DOMContentLoaded');
  for (const link of links.slice(0, 2)) {
    const target = new URL(link.href, view.sandbox.location.href);
    assert.equal(target.searchParams.get('stile_test'), '1');
    assert.equal(target.searchParams.get('stile_test_until'), String(now + ttl));
    const next = page(target.href, {blockStorage: true, now: now + 60_000});
    next.runBootstrap();
    assertSuppressed(next);
  }
  assert.equal(links[0].href, `/projects.html?campaign=published&stile_test=1&stile_test_until=${now + ttl}#gallery`);
  assert.deepEqual(links.slice(2).map(link => link.href), ['tel:+16047732298', 'mailto:designstiledileo@gmail.com', 'https://external.example/path?name=private#fragment', 'https://www.stiledileo.com/projects.html', '#estimate', '/?stile_test=0']);
  const dynamic = makeLink('/blog.html');
  view.fire('click', {target: {closest: () => dynamic}});
  assert.equal(new URL(dynamic.href, view.sandbox.location.href).searchParams.get('stile_test'), '1');
  const expiredLink = makeLink('/projects.html');
  const expired = page(`https://stiledileo.com/?stile_test=1&stile_test_until=${now - 1}`, {blockStorage: true, links: [expiredLink]});
  expired.runBootstrap();
  expired.fire('DOMContentLoaded');
  assertSuppressed(expired);
  assert.equal(expiredLink.href, '/projects.html', 'expired propagation does not restart the session');
});

test('Google configuration receives only canonical page and sanitized referrer context', () => {
  for (const [referrer, expected] of [
    ['https://stiledileo.com/projects.html?name=private@example.com#phone', 'https://stiledileo.com/projects.html'],
    ['https://www.stiledileo.com/index.html?email=private#fragment', 'https://stiledileo.com/'],
    ['https://search.example/search?q=private@example.com#fragment', 'https://search.example'],
    ['https://search.example/private@example.com?phone=private', 'https://search.example'],
    ['https://stiledileo.com/private%40example.com?name=private', 'https://stiledileo.com/'],
    ['javascript:private@example.com', ''], ['not a URL', ''], ['', '']
  ]) {
    const view = page('https://www.stiledileo.com/feature-wall-tv-wall-vancouver.html?name=private@example.com#phone', {referrer});
    view.runBootstrap();
    const config = ga4Configs(view)[0][2];
    assert.equal(config.page_location, 'https://stiledileo.com/feature-wall-tv-wall-vancouver.html');
    assert.equal(config.page_referrer, expected);
    assert.equal(view.sandbox.StileMeasurement.pageLocation, config.page_location);
    assert.equal(view.sandbox.StileMeasurement.pageReferrer, config.page_referrer);
    assert(!JSON.stringify(config).includes('private'));
  }
  const unsafe = page('https://stiledileo.com/private%40example.com?name=private#private');
  unsafe.runBootstrap();
  assert.equal(unsafe.sandbox.StileMeasurement.pageLocation, 'https://stiledileo.com/');
});

test('repeat bootstrap includes cannot duplicate a loader or config or re-enable the document', () => {
  for (const suffix of ['', '?stile_test=1']) {
    const view = page('https://stiledileo.com/' + suffix);
    view.runBootstrap();
    const measurement = view.sandbox.StileMeasurement;
    view.sandbox.location.search = suffix ? '?stile_test=0' : '?stile_test=1';
    view.runBootstrap();
    assert.strictEqual(view.sandbox.StileMeasurement, measurement);
    assert(Object.isFrozen(measurement));
    assert.equal(Object.getOwnPropertyDescriptor(view.sandbox, 'StileMeasurement').writable, false);
    assert.equal(Object.getOwnPropertyDescriptor(view.sandbox, 'StileMeasurement').configurable, false);
    assert.equal(view.loaders.length, suffix ? 0 : 1);
    assert.equal(ga4Configs(view).length, suffix ? 0 : 1);
  }
});

test('both script execution orders keep synthetic and nonproduction contact actions unmeasured', () => {
  for (const url of ['https://stiledileo.com/?stile_test=1', 'https://localhost/', 'https://deploy-preview-1--designbyleo.netlify.app/']) {
    for (const order of ['bootstrap-first', 'tracker-first']) {
      const view = page(url);
      if (order === 'tracker-first') {
        view.runTracker();
        view.sandbox.StileAnalytics.track('phone_click');
        assert.deepEqual(view.commands(), [], 'missing bootstrap must fail closed');
      }
      view.runBootstrap();
      if (order === 'bootstrap-first') view.runTracker();
      view.sandbox.StileAnalytics.track('phone_click');
      view.sandbox.StileAnalytics.trackLeadSuccess({accepted: true, transaction_id: 'offline-only'});
      view.sandbox.StileAnalytics.trackLeadSuccess({accepted: true, transaction_id: 'offline-only'});
      assertSuppressed(view);
    }
  }
});

test('a production tracker fails closed with a stray gtag when the bootstrap is missing or arrives late', () => {
  const view = page('https://stiledileo.com/projects.html?name=private#private');
  const commands = [];
  view.sandbox.gtag = (...args) => commands.push(args);
  view.runTracker();
  view.sandbox.StileAnalytics.track('phone_click');
  view.sandbox.StileAnalytics.trackLeadSuccess({accepted: true, transaction_id: 'offline-order-only'});
  assert.deepEqual(commands, [], 'gtag alone does not authorize measurement');
  view.runBootstrap();
  assert.deepEqual(commands.map(args => args[0]), ['js', 'config']);
  view.sandbox.StileAnalytics.track('phone_click');
  assert.deepEqual(commands.map(args => args[0]), ['js', 'config'], 'reversed script order remains closed for tracker events');
  assert.equal(commands[1][2].page_location, 'https://stiledileo.com/projects.html');
});

test('Abbotsford photo intent retains same-tab attribution and never becomes a lead click', () => {
  const storage = new Map();
  const entry = page('https://stiledileo.com/venetian-plaster-abbotsford.html?utm_source=offline-regression', {storage});
  entry.runBootstrap();
  entry.runTracker();
  const button = makeLink('/#estimate');
  Object.assign(button, {dataset: {track: 'send_photo'}, textContent: 'Send a Project Photo'});
  entry.fire('click', {target: {closest: () => button}});
  assert.equal(events(entry).length, 1);
  assert.equal(events(entry)[0][1], 'project_photo_click');
  assert.equal(events(entry)[0][2].service, 'venetian_plaster');
  assert(!events(entry).some(args => ['generate_lead', 'conversion', 'estimate_click'].includes(args[1])));
  const home = page('https://stiledileo.com/', {storage});
  home.runBootstrap();
  home.runTracker();
  assert.equal(home.sandbox.StileAnalytics.getInquiryContext().initial_landing_path, '/venetian-plaster-abbotsford.html');
  assert.equal(home.sandbox.StileAnalytics.getInquiryContext().utm_source, 'offline-regression');
  assert.equal(home.sandbox.StileAnalytics.getInquiryContext().service, 'venetian_plaster');
});
