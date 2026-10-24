// Offline source-resolution and CLI regressions; no network requests or production edits.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { checkReference, cssUrls, srcsetUrls } = require('./seo-reference-utils.cjs');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'stile-image-validator-'));
const options = { root, file: 'index.html', site: 'https://stiledileo.com' };
fs.mkdirSync(path.join(root, 'images', 'Project'), { recursive: true });
for (const name of ['sample.jpg', 'space image.jpg', 'literal%20name.jpg', 'literal&amp;name.jpg', 'MixedCase.PNG', 'comma,name.jpg']) {
  fs.writeFileSync(path.join(root, 'images', name), 'fixture asset');
}
fs.writeFileSync(path.join(root, 'images', 'Project', 'detail.jpg'), 'fixture asset');
test.after(() => fs.rmSync(root, { recursive: true, force: true }));
const check = raw => checkReference(raw, options);
const cdn = source => `/.netlify/images?url=${encodeURIComponent(source)}&w=640`;

test('valid local Image CDN source is checked instead of the virtual endpoint', () => {
  const result = check('/.netlify/images?url=/images/sample.jpg&w=800');
  assert.equal(result.kind, 'local');
  assert.equal(result.cdn, true);
  assert.equal(result.status, 'ok');
  assert.equal(result.target, path.join(root, 'images', 'sample.jpg'));
});

test('encoded local paths and spaces resolve through both URL encoding layers', () => {
  for (const source of ['/images/space image.jpg', '/images/space%20image.jpg']) {
    const result = check(cdn(source));
    assert.equal(result.status, 'ok');
    assert.equal(result.pathname, '/images/space image.jpg');
  }
});

test('multiple transformation parameters, HTML entities and parameter order preserve the source', () => {
  for (const separator of ['&amp;', '&#38;', '&#x26;']) {
    const result = check(`/.netlify/images?w=400${separator}h=300${separator}fit=cover${separator}fm=webp${separator}q=85${separator}url=%2Fimages%2Fsample.jpg`);
    assert.equal(result.status, 'ok');
    assert.equal(result.pathname, '/images/sample.jpg');
  }
});

test('missing local CDN source remains a genuine failure', () => {
  assert.equal(check(cdn('/images/missing.jpg')).status, 'missing');
});

test('filename and extension case mismatches fail on every filesystem', () => {
  const result = check(cdn('/images/mixedcase.png'));
  assert.equal(result.status, 'case-mismatch');
  assert.equal(result.actualPath, '/images/MixedCase.PNG');
  assert.equal(check(cdn('/images/MixedCase.PNG')).status, 'ok');
});

test('directory case is checked without relying on filesystem case sensitivity', () => {
  const result = check(cdn('/images/project/detail.jpg'));
  assert.equal(result.status, 'case-mismatch');
  assert.equal(result.actualPath, '/images/Project/detail.jpg');
});

test('remote CDN sources preserve their query and are not asserted to exist locally', () => {
  const source = 'https://media.example.test/image.jpg?v=2&variant=large';
  const result = check(cdn(source));
  assert.equal(result.kind, 'remote');
  assert.equal(result.cdn, true);
  assert.equal(result.url, source);
  assert.equal(result.status, undefined);
});

test('ordinary root-relative, document-relative and same-origin absolute images resolve', () => {
  for (const source of ['/images/sample.jpg?v=2#detail', 'images/sample.jpg', 'https://stiledileo.com/images/sample.jpg']) {
    assert.equal(check(source).status, 'ok');
  }
  assert.equal(checkReference('../images/sample.jpg', { ...options, file: 'nested/page.html' }).status, 'ok');
});

test('ordinary missing images and case mismatches are not suppressed', () => {
  assert.equal(check('/images/missing.jpg').status, 'missing');
  assert.equal(check('/images/mixedcase.png').status, 'case-mismatch');
});

test('literal percent sequences are not decoded repeatedly', () => {
  const result = check(cdn('/images/literal%2520name.jpg'));
  assert.equal(result.pathname, '/images/literal%20name.jpg');
  assert.equal(result.status, 'ok');
});

test('source query strings and fragments do not become filename components', () => {
  assert.equal(check(cdn('/images/sample.jpg?v=1&variant=small#detail')).status, 'ok');
});

test('missing, empty and duplicate CDN source parameters are rejected', () => {
  for (const query of ['w=400', 'url=', 'url=%20', 'url=/images/sample.jpg&url=/images/missing.jpg']) {
    assert.equal(check(`/.netlify/images?${query}`).kind, 'invalid');
  }
});

test('malformed source escapes, unsupported protocols and encoded traversal fail safely', () => {
  for (const source of ['/images/%ZZ.jpg', 'file:///images/sample.jpg', '/images/%2e%2e%2f%2e%2e%2foutside.jpg']) {
    assert.equal(check(cdn(source)).kind, 'invalid', source);
  }
});

test('protocol-relative remote sources are remote; lookalike domains are not local', () => {
  assert.equal(check(cdn('//media.example.test/image.jpg')).kind, 'remote');
  assert.equal(check('https://stiledileo.com.example.test/images/sample.jpg').kind, 'remote');
});

test('nested CDN sources explicitly require runtime verification', () => {
  assert.equal(check(cdn('/.netlify/images?url=/images/sample.jpg')).kind, 'unsupported');
});

test('responsive candidate parsing preserves encoded commas, query strings and data URLs', () => {
  const first = cdn('/images/comma,name.jpg');
  assert.deepEqual(srcsetUrls(`${first} 400w, /images/sample.jpg 800w`), [first, '/images/sample.jpg']);
  assert.deepEqual(srcsetUrls('data:image/png;base64,AAAA 1x, /images/sample.jpg 2x'), ['data:image/png;base64,AAAA', '/images/sample.jpg']);
  assert.deepEqual(srcsetUrls('/images/sample.jpg, /images/MixedCase.PNG'), ['/images/sample.jpg', '/images/MixedCase.PNG']);
});

test('inline CSS sources support quoted CDN URLs and ordinary backgrounds', () => {
  const source = cdn('/images/sample.jpg');
  assert.deepEqual(cssUrls(`background:url('${source}'); mask:url(/images/MixedCase.PNG)`), [source, '/images/MixedCase.PNG']);
});

function runFixture(markup, extraHead = '') {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'stile-validator-cli-'));
  try {
    fs.mkdirSync(path.join(fixture, 'scripts'));
    fs.cpSync(path.join(root, 'images'), path.join(fixture, 'images'), { recursive: true });
    for (const file of ['seo-validate.js', 'seo-reference-utils.cjs']) {
      fs.copyFileSync(path.join(__dirname, file), path.join(fixture, 'scripts', file));
    }
    fs.writeFileSync(path.join(fixture, 'robots.txt'), 'User-agent: *\nAllow: /\n');
    fs.writeFileSync(path.join(fixture, 'sitemap.xml'), '<urlset><url><loc>https://stiledileo.com/</loc></url></urlset>');
    fs.writeFileSync(path.join(fixture, 'index.html'), `<!doctype html><html lang="en"><head><title>Fixture</title><meta name="description" content="Offline fixture"><link rel="canonical" href="https://stiledileo.com/">${extraHead}</head><body><h1>Fixture</h1>${markup}</body></html>`);
    const result = spawnSync(process.execPath, [path.join(fixture, 'scripts', 'seo-validate.js')], { encoding: 'utf8' });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

const image = source => `<img src="${source}" alt="Fixture" width="800" height="600">`;

test('actual CLI accepts valid CDN, encoded, responsive and inline background sources', () => {
  const result = runFixture(image(cdn('/images/space%20image.jpg')) +
    `<picture><source srcset="${cdn('/images/sample.jpg')} 400w, /images/MixedCase.PNG 800w">${image('/images/sample.jpg')}</picture>` +
    '<div style="background:url(\'/images/sample.jpg\')"></div>');
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /SEO validation passed/);
});

test('actual CLI rejects missing and case-mismatched CDN source files', () => {
  for (const source of ['/images/missing.jpg', '/images/mixedcase.png']) {
    const result = runFixture(image(cdn(source)));
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, /Image CDN source/);
    assert.match(result.output, /broken|case mismatch/);
  }
});

test('actual CLI checks responsive-only, relative and inline CSS image failures', () => {
  for (const markup of [
    `<picture><source srcset="${cdn('/images/missing.jpg')} 400w">${image('/images/sample.jpg')}</picture>`,
    image('images/missing.jpg'),
    '<div style="background:url(\'/images/mixedcase.png\')"></div>'
  ]) {
    const result = runFixture(markup);
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, /broken|case mismatch/);
  }
});

test('actual CLI decodes inline style attribute quotes before extracting CSS URLs', () => {
  const result = runFixture('<div style="background:url(&quot;/images/sample.jpg&quot;)"></div>');
  assert.equal(result.status, 0, result.output);
});

test('CSS text does not decode HTML character references as attribute values', () => {
  const result = checkReference('/images/literal&amp;name.jpg', { ...options, htmlDecoded: true });
  assert.equal(result.status, 'ok');
  assert.equal(result.pathname, '/images/literal&amp;name.jpg');
  assert.equal(runFixture('', '<style>.card{background:url("/images/literal&amp;name.jpg")}</style>').status, 0);
  assert.equal(runFixture('<div style="background:url(\'/images/literal&amp;amp;name.jpg\')"></div>').status, 0);
});

test('actual CLI reports remote checks as unsupported, without claiming runtime success', () => {
  const result = runFixture(image(cdn('https://media.example.test/image.jpg?v=1&variant=large')));
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /Unsupported checks: 1/);
  assert.match(result.output, /not counted as passes/);
  assert.match(result.output, /remote image availability not checked offline/);
});

test('actual CLI rejects an image source that is only a directory', () => {
  const result = runFixture(image(cdn('/images/')));
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /not an image file/);
});

test('actual CLI still fails unrelated canonical defects', () => {
  const result = runFixture(image('/images/sample.jpg'), '<link rel="canonical" href="https://stiledileo.com/other.html">');
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /must have exactly one canonical/);
});
