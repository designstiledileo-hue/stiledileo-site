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

test('marketing inventory contains 52 pages after the approved Abbotsford pilot', () => assert.equal(pages.length, 52));

test('Abbotsford preserves approved public copy and has one canonical sitemap entry', () => {
  const html = read('venetian-plaster-abbotsford.html');
  const approved = read('SEO/ABBOTSFORD-SERVICE-AREA-BRIEF-v1.0.md')
    .split('<!-- PUBLIC COPY START -->')[1].split('<!-- PUBLIC COPY END -->')[0];
  const normalize = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
  const expected = approved.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,3} /gm, '').replace(/^\d\. /gm, '').replace(/\*/g, '');
  const actual = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1]
    .replace(/<\/(?:h[1-3]|p|figcaption|li)>/g, ' ').replace(/<[^>]*>/g, '');
  assert.equal(normalize(actual), normalize(expected));
  const canonical = 'https://stiledileo.com/venetian-plaster-abbotsford.html';
  const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.equal(urls.filter(url => url === canonical).length, 1);
  assert(html.includes(`<meta property="og:url" content="${canonical}">`));
  assert.equal((html.match(/href="\/#estimate"/g) || []).length, 3);
  assert(!html.includes('<form'));
  for (const schema of scripts(html).filter(s => /application\/ld\+json/.test(s.attrs))) {
    const data = JSON.parse(schema.code);
    assert.equal(data['@graph'].find(item => item['@type'] === 'Service').areaServed.name, 'Abbotsford, British Columbia');
    assert(!/"(?:address|geo|aggregateRating|review|offers)"\s*:/.test(schema.code));
  }
});

test('Abbotsford uses one explicit permanent alias without altering its html destination', () => {
  const from = '/venetian-plaster-abbotsford';
  const blocks = read('netlify.toml').split('[[redirects]]').slice(1);
  const matching = blocks.filter(block => block.match(/^\s*from\s*=\s*"([^"]+)"/m)?.[1] === from);
  assert.equal(matching.length, 1);
  assert.match(matching[0], /^\s*to\s*=\s*"\/venetian-plaster-abbotsford\.html"\s*$/m);
  assert.match(matching[0], /^\s*status\s*=\s*301\s*$/m);
  assert.match(matching[0], /^\s*force\s*=\s*true\s*$/m);
  assert(!/^\s*query\s*=/m.test(matching[0]), 'no query restriction or replacement');
  assert(!blocks.some(block => block.match(/^\s*from\s*=\s*"([^"]+)"/m)?.[1] === from + '.html'));
});

test('function-served sitemap static inventory matches every canonical XML entry exactly once', () => {
  const source = read('netlify/functions/opinly-sitemap.mts');
  const dataEnd = source.indexOf('function e(');
  assert(dataEnd > 0, 'static inventory must precede sitemap rendering');
  const paths = vm.runInNewContext(source.slice(0, dataEnd) + '\nJSON.stringify(existing);');
  const generatedUrls = JSON.parse(paths).map(p => 'https://stiledileo.com' + p);
  const xmlUrls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.equal(generatedUrls.length, 52);
  assert.equal(new Set(generatedUrls).size, 52);
  assert.deepEqual(generatedUrls.sort(), xmlUrls.sort());
  assert.equal(generatedUrls.filter(url => url.endsWith('/venetian-plaster-abbotsford.html')).length, 1);
  assert(!generatedUrls.some(url => /\/(?:car|thank-you)\.html$/.test(url)));
});

test('Abbotsford project media retain true locations, source case and loading priorities', () => {
  const html = read('venetian-plaster-abbotsford.html');
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  assert.equal(images.length, 3);
  assert.match(images[0], /loading="eager"/);
  assert.match(images[0], /fetchpriority="high"/);
  assert.match(images[0], /Brookswood, Langley/);
  assert.match(images[2], /West Vancouver/);
  for (const image of images.slice(1)) assert.match(image, /loading="lazy"/);
  const expected = [
    '/images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-after-hero-01.jpg',
    '/images/projects/brookswood-fireplace/stile-di-leo-brookswood-marmorino-fireplace-before-01.jpg',
    '/images/projects/west-vancouver-fireplace/stile-di-leo-west-vancouver-marmorino-fireplace-after-front-01.jpg'
  ];
  assert.deepEqual(images.map(image => new URL(image.match(/src="([^"]+)"/)[1].replaceAll('&amp;', '&'), 'https://stiledileo.com').searchParams.get('url')), expected);
  for (const source of expected) {
    let cursor = root;
    for (const part of source.split('/').filter(Boolean)) {
      assert(fs.readdirSync(cursor).includes(part), source);
      cursor = path.join(cursor, part);
    }
  }
});

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
