// Execute the actual TypeScript edge handler offline. No provider calls or submissions.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {stripTypeScriptTypes} = require('node:module');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'netlify/edge-functions/opinly-analytics.mts'), 'utf8');
const edgeModule = import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));

async function passThrough(response, url = 'https://stiledileo.com/') {
  const edge = await edgeModule;
  let nextCalls = 0;
  const result = await edge.default(new Request(url), {next: () => {
    nextCalls++;
    return Promise.resolve(response);
  }});
  assert.equal(nextCalls, 1, 'continue the existing edge chain exactly once');
  assert.strictEqual(result, response, 'preserve the original response and its streaming body');
  assert.equal(result.bodyUsed, false, 'do not consume or transform the upstream body');
  return result;
}

test('HTML responses retain every byte, status and header without an Opinly script', async () => {
  for (const file of ['index.html', 'venetian-plaster-abbotsford.html', 'thank-you.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const response = new Response(html, {
      status: 203, statusText: 'Existing status',
      headers: {'content-type': 'text/html; charset=utf-8', 'x-existing': 'preserved', 'cache-control': 'public, max-age=30'}
    });
    const result = await passThrough(response);
    assert.equal(result.status, 203);
    assert.equal(result.statusText, 'Existing status');
    assert.equal(result.headers.get('content-type'), 'text/html; charset=utf-8');
    assert.equal(result.headers.get('x-existing'), 'preserved');
    assert.equal(result.headers.get('cache-control'), 'public, max-age=30');
    const text = await result.text();
    assert.equal(text, html);
    assert(!text.includes('static.opinly.ai/p.js'), 'no optional vendor injection');
  }
});

test('preview, synthetic and campaign-tagged requests receive the same untouched response', async () => {
  const html = '<html><head></head><body>Existing content</body></html>';
  for (const url of ['https://localhost/', 'https://deploy-preview-1--designbyleo.netlify.app/', 'https://stiledileo.com/?stile_test=1', 'https://stiledileo.com/?utm_source=google&email=private@example.com']) {
    const response = await passThrough(new Response(html), url);
    assert.equal(await response.text(), html);
  }
});

test('non-HTML, redirects and empty responses preserve their upstream behavior', async () => {
  for (const [body, contentType] of [['{"existing":true}', 'application/json'], ['body{color:black}', 'text/css'], ['existing();', 'text/javascript']]) {
    const response = await passThrough(new Response(body, {headers: {'content-type': contentType}}));
    assert.equal(response.headers.get('content-type'), contentType);
    assert.equal(await response.text(), body);
  }
  const redirect = await passThrough(Response.redirect('https://stiledileo.com/projects.html', 301));
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), 'https://stiledileo.com/projects.html');
  const empty = await passThrough(new Response(null, {status: 204}));
  assert.equal(empty.status, 204);
  assert.equal(await empty.text(), '');
});

test('repeated edge passes add no vendor markup and route configuration is unchanged', async () => {
  const html = '<html><head></head><body>Existing content</body></html>';
  const response = new Response(html, {headers: {'content-type': 'text/html'}});
  await passThrough(response);
  await passThrough(response);
  assert.equal(await response.text(), html);
  assert.deepEqual((await edgeModule).config, {path: '/*', excludedPath: ['/admin/*', '/.netlify/*']});
});

test('the retired injector contains no executable vendor loader or network call', () => {
  assert(!/https?:\/\/|<script\b|\bfetch\s*\(|createElement|appendChild|data-key|PIXEL/.test(source));
});
