// Offline regression checks. No analytics events, provider requests or leads are sent.
// Run: node --test scripts/test-seo-foundation.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html') && !['car.html', 'thank-you.html'].includes(name));
const scripts = html => Array.from(html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi), m => ({ attrs: m[1], code: m[2] }));
const srcOf = script => script.attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];

test('marketing inventory remains 51 pages', () => assert.equal(pages.length, 51));

for (const file of pages) {
  test(`${file}: one Google tag, one initializer and one shared tracker`, () => {
    const html = read(file);
    const tags = scripts(html);
    const loaders = tags.filter(s => srcOf(s)?.includes('www.googletagmanager.com/gtag/js?id=G-P7VJ8MQNKS'));
    const trackers = tags.filter(s => srcOf(s) === '/scripts/analytics.js');
    assert.equal(loaders.length, 1, 'one GA4 loader');
    assert.equal(trackers.length, 1, 'one shared tracker');
    assert.match(loaders[0].attrs, /\basync\b/);
    assert.match(trackers[0].attrs, /\bdefer\b/);
    const initializers = tags.filter(s => /gtag\(\s*['"]config['"]\s*,\s*['"]G-P7VJ8MQNKS['"]/.test(s.code));
    assert.equal(initializers.length, 1, 'one GA4 config; no double page_view');
    assert.match(initializers[0].code, /dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]/);
    assert(html.indexOf(initializers[0].code) < html.indexOf('src="/scripts/analytics.js"'));
    assert(html.indexOf('src="/scripts/analytics.js"') < html.indexOf('</head>'));
  });

  test(`${file}: canonical, indexability, H1 and inline JavaScript remain valid`, () => {
    const html = read(file);
    const expected = file === 'index.html' ? 'https://stiledileo.com/' : `https://stiledileo.com/${file}`;
    const canonical = Array.from(html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi));
    assert.equal(canonical.length, 1);
    assert(canonical[0][0].includes(`href="${expected}"`));
    assert.equal((html.match(/<h1\b/gi) || []).length, 1);
    assert(!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html));
    for (const [i, script] of scripts(html).entries()) {
      if (srcOf(script) || /type=["']application\/ld\+json["']/i.test(script.attrs)) continue;
      new vm.Script(script.code, { filename: `${file}:inline-${i}` });
    }
  });
}

test('retired fireplace URLs have explicit permanent, single-hop replacements', () => {
  const rules = read('netlify.toml').split('[[redirects]]').slice(1).map(block => ({
    from: block.match(/^\s*from\s*=\s*"([^"]+)"/m)?.[1],
    to: block.match(/^\s*to\s*=\s*"([^"]+)"/m)?.[1],
    status: Number(block.match(/^\s*status\s*=\s*(\d+)/m)?.[1]),
    force: /^\s*force\s*=\s*true\s*$/m.test(block)
  }));
  for (const [old, current] of [
    ['fireplace-wall-ideas-vancouver', '/venetian-plaster-fireplace-ideas-vancouver.html'],
    ['fireplace-wall-design-vancouver', '/fireplace-wall-vancouver.html']
  ]) {
    for (const suffix of ['', '.html']) {
      const from = `/${old}${suffix}`;
      assert.deepEqual(rules.filter(rule => rule.from === from), [{ from, to: current, status: 301, force: true }]);
      assert(fs.existsSync(path.join(root, current)));
      assert(!rules.some(rule => rule.from === current));
    }
  }
});

test('article CTA opens the existing photo intake; blog navigation has no missing About anchor', () => {
  assert.match(read('is-venetian-plaster-worth-it-vancouver.html'), /href="\/#estimate">Send a Project Photo<\/a>/);
  assert.match(read('index.html'), /window\.location\.hash === "#estimate"\) openEstimate\(\)/);
  assert.match(read('blog.html'), /href="\/venetian-plaster-vancouver.html">Services<\/a>/);
  for (const file of pages) assert(!/href=["']\/?#(?:visualization|about)["']/.test(read(file)), file);
});

test('bathroom referrals and microcement service agree on supported dry-only scope', () => {
  const ideas = read('venetian-plaster-bathroom-ideas-vancouver.html');
  assert(ideas.includes('does not offer microcement bathrooms, showers or wet-room systems'));
  assert(!ideas.includes('finish in wetter zones'));
  const service = read('microcement-vancouver.html');
  assert(service.includes('We do not offer microcement bathrooms, showers or wet-room systems.'));
  const blog = read('blog.html');
  assert(blog.includes('Explore microcement for selected dry interior walls and architectural feature surfaces'));
  assert(!blog.includes('from bathrooms and fireplaces to seamless minimalist'));
});

test('internal design and SEO notes are absent from public copy', () => {
  for (const file of pages) {
    assert(!/calm supporting frame|not meant to duplicate|broader parent|overlap in search intent|rather than a keyword|page is intentionally focused/i.test(read(file)), file);
  }
});

test('technical and QR pages retain noindex; business tracking still requires accepted lead', () => {
  for (const file of ['car.html', 'thank-you.html']) assert.match(read(file), /name="robots" content="noindex, follow"/);
  const tracker = read('scripts/analytics.js');
  assert(tracker.includes('if (!submissionId || sentLeadIds.has(submissionId) || !measurementReady()) return;'));
  assert(tracker.includes('track("generate_lead"'));
  assert(tracker.includes('transaction_id: submissionId'));
});

test('newly measured article queues one page config and de-duplicates accepted lead events offline', () => {
  const handlers = new Map();
  const storage = new Map();
  const sandbox = {
    document: {
      title: 'TV Feature Wall Vancouver',
      referrer: '',
      addEventListener: (name, callback) => handlers.set(name, callback),
      createElement: () => { throw new Error('article analytics must not add the Advisor'); }
    },
    location: { hostname: 'stiledileo.com', pathname: '/feature-wall-tv-wall-vancouver.html', search: '' },
    sessionStorage: { getItem: name => storage.get(name), setItem: (name, value) => storage.set(name, value) },
    URL, URLSearchParams, WeakSet, Set, Date
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  const bootstrap = scripts(read('feature-wall-tv-wall-vancouver.html')).find(s => /function gtag/.test(s.code));
  vm.runInContext(bootstrap.code, context);
  vm.runInContext(read('scripts/analytics.js'), context);
  const events = () => sandbox.dataLayer.map(args => Array.from(args));
  assert.equal(events().filter(args => args[0] === 'config' && args[1] === 'G-P7VJ8MQNKS').length, 1);
  assert.equal(events().filter(args => args[0] === 'event' && args[1] === 'page_view').length, 0, 'Google config supplies the page view');

  const phone = {
    dataset: {}, textContent: 'Call Stile di Leo',
    getAttribute: name => name === 'href' ? 'tel:+16047732298' : null,
    closest: () => null
  };
  handlers.get('click')({ target: { closest: () => phone } });
  assert.equal(events().filter(args => args[1] === 'phone_click').length, 1);
  assert.equal(events().filter(args => args[1] === 'generate_lead').length, 0);
  sandbox.StileAnalytics.trackLeadSuccess({});
  assert.equal(events().filter(args => args[1] === 'generate_lead').length, 0, 'no lead without accepted submission id');
  sandbox.StileAnalytics.trackLeadSuccess({ transaction_id: 'offline-regression-only' });
  sandbox.StileAnalytics.trackLeadSuccess({ transaction_id: 'offline-regression-only' });
  assert.equal(events().filter(args => args[1] === 'generate_lead').length, 1);
  assert.equal(events().filter(args => args[1] === 'conversion').length, 1);
});
