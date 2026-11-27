import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import validate, { config } from '../netlify/edge-functions/estimate-validation.mts';

const url = 'https://example.invalid/';
const receipt = () => new Response('<html><h1>Thank you!</h1><p>Your form submission has been received.</p></html>', {
  status: 200, headers: { 'Content-Type': 'text/html' }
});
const fields = (values: Record<string, string> = {}) => ({
  'form-name': 'instant-estimate', company: '', name: 'Synthetic QA', email: 'synthetic@example.invalid', phone: '',
  project_type: 'fireplace', lead_source: 'website', submission_id: 'qa-loopback-only', ...values
});
const encoded = (values: Record<string, string> = {}, headers: HeadersInit = {}) => new Request(url, {
  method: 'POST', headers, body: new URLSearchParams(fields(values))
});
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aSNcAAAAASUVORK5CYII=', 'base64');
function multipart(file: File, values: Record<string, string> = {}) {
  const data = new FormData();
  Object.entries(fields(values)).forEach(([key, value]) => data.set(key, value));
  data.set('wall_photo', file);
  return new Request(url, { method: 'POST', body: data });
}
async function notForwarded(request: Request, status: number) {
  const result = await validate(request, { next() { throw new Error('Invalid request should not reach provider'); } });
  assert.equal(result?.status, status);
  assert.equal(result?.headers.get('X-Stile-Estimate-Receipt'), null);
}

test('Edge declaration is scoped to homepage POST and does not intercept GET', async () => {
  assert.deepEqual(config, { path: ['/', '/index.html'], method: 'POST' });
  assert.equal(await validate(new Request(url), { next() { throw new Error('GET must pass through'); } }), undefined);
});

test('the registered estimate form requests the native Netlify receipt, not the homepage', () => {
  const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const estimate = source.match(/<form\b[^>]*\bname="instant-estimate"[^>]*>/i)?.[0];
  assert.ok(estimate, 'deploy-time form declaration must exist');
  assert.match(estimate, /\bmethod="POST"/i);
  assert.match(estimate, /\bdata-netlify="true"/);
  // An explicit action, including "/", lets Netlify return that static page
  // after storing the POST. Our transport receipt must be the built-in page.
  assert.doesNotMatch(estimate, /\saction\s*=/i);
});

test('text-only email enquiry preserves existing receipt fields and body', async () => {
  const request = encoded({ project_note: 'Short project note', utm_source: 'synthetic', cta_origin_id: 'home_hero' });
  const rawBody = await request.clone().text();
  let forwarded = 0;
  const result = await validate(request, { async next(nextRequest) {
    forwarded++;
    assert.equal(await nextRequest.clone().text(), rawBody);
    const data = await nextRequest.formData();
    assert.equal(data.get('form-name'), 'instant-estimate');
    assert.equal(data.get('email'), 'synthetic@example.invalid');
    assert.equal(data.has('wall_photo'), false);
    assert.equal(data.get('cta_origin_id'), 'home_hero');
    return receipt();
  } });
  assert.equal(forwarded, 1);
  assert.equal(result?.status, 204);
  assert.equal(result?.headers.get('X-Stile-Estimate-Receipt'), 'http_accepted');
});

test('phone-only commercial enquiry needs no email or attachment', async () => {
  const result = await validate(encoded({ email: '', phone: '+1 (604) 555-0100', project_type: 'commercial' }), {
    async next(request) {
      const data = await request.formData();
      assert.equal(data.get('email'), '');
      assert.equal(data.get('phone'), '+1 (604) 555-0100');
      assert.equal(data.get('project_type'), 'commercial');
      return receipt();
    }
  });
  assert.equal(result?.status, 204);
});

test('valid optional photo and Advisor source survive multipart validation and handoff', async () => {
  const original = multipart(new File([png], 'synthetic.png', { type: 'image/png' }), { lead_source: 'finish_advisor' });
  const bytes = Buffer.from(await original.clone().arrayBuffer());
  const result = await validate(original, { async next(request) {
    assert.deepEqual(Buffer.from(await request.clone().arrayBuffer()), bytes);
    const data = await request.formData();
    assert.equal(data.get('lead_source'), 'finish_advisor');
    const file = data.get('wall_photo');
    assert(file instanceof File);
    assert.deepEqual(Buffer.from(await file.arrayBuffer()), png);
    return receipt();
  } });
  assert.equal(result?.status, 204);
});

test('missing or malformed contact, honeypot, duplicate and unregistered fields do not forward', async () => {
  await notForwarded(encoded({ name: '   ' }), 400);
  await notForwarded(encoded({ email: '', phone: '' }), 400);
  await notForwarded(encoded({ email: 'broken@' }), 400);
  await notForwarded(encoded({ email: '', phone: '12345' }), 400);
  await notForwarded(encoded({ company: 'non-empty', lead_source: 'website' }), 400);
  await notForwarded(encoded({ company: ' ' }), 400);
  await notForwarded(encoded({ custom: 'unexpected' }), 400);
  await notForwarded(encoded({ project_note: 'x'.repeat(2001) }), 400);
  const data = new URLSearchParams(fields());
  data.append('email', 'second@example.invalid');
  await notForwarded(new Request(url, { method: 'POST', body: data }), 400);
  const conflicted = new URLSearchParams(fields({ 'form-name': 'furniture-inquiry' }));
  conflicted.append('form-name', 'instant-estimate');
  await notForwarded(new Request(url, { method: 'POST', body: conflicted }), 400);
});

test('invalid photo signature, MIME mismatch, excess bytes and unreadable body fail safely', async () => {
  await notForwarded(multipart(new File(['fake'], 'invalid.png', { type: 'image/png' })), 400);
  await notForwarded(multipart(new File([png], 'invalid.jpg', { type: 'image/jpeg' })), 400);
  await notForwarded(multipart(new File([png, new Uint8Array(7 * 1024 * 1024)], 'too-large.png', { type: 'image/png' })), 400);
  await notForwarded(encoded({}, { 'Content-Length': '9000000' }), 413);
  await notForwarded(new Request(url, { method: 'POST', headers: { 'Content-Type': 'multipart/form-data' }, body: 'invalid' }), 400);
});

test('foreign origin and unsupported content type cannot create accepted receipts', async () => {
  await notForwarded(encoded({}, { Origin: 'https://another.example.invalid' }), 403);
  await notForwarded(encoded({}, { 'Sec-Fetch-Site': 'cross-site' }), 403);
  await notForwarded(new Request(url, { method: 'POST', body: JSON.stringify(fields()) }), 415);
});

test('provider errors, redirects, homepage 200 and unrecognised 200 are not success', async () => {
  for (const providerResponse of [
    new Response('Unavailable', { status: 503 }),
    Response.redirect(url),
    new Response('<form id="estimate-form"></form>Your form submission has been received.', { headers: { 'Content-Type': 'text/html' } }),
    new Response('<h1>Homepage</h1>', { headers: { 'Content-Type': 'text/html' } }),
    new Response('{}', { headers: { 'Content-Type': 'application/json' } })
  ]) {
    const result = await validate(encoded(), { async next() { return providerResponse; } });
    assert(result && !result.ok);
    assert.equal(result.headers.get('X-Stile-Estimate-Receipt'), null);
  }
  const failure = await validate(encoded(), { async next() { throw new Error('Unavailable'); } });
  assert.equal(failure?.status, 503);
});

test('other registered form is passed through without estimate validation or receipt', async () => {
  const request = encoded({ 'form-name': 'furniture-inquiry', name: '', email: '' });
  const result = await validate(request, { async next(request) {
    assert.equal((await request.formData()).get('form-name'), 'furniture-inquiry');
    return receipt();
  } });
  assert.equal(result?.status, 200);
  assert.equal(result?.headers.get('X-Stile-Estimate-Receipt'), null);
});
