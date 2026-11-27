// Validate the homepage's existing Netlify form before forwarding its original body.
// This handler has no storage, credentials, notification destination or analytics.
const maxPhotoBytes = 7 * 1024 * 1024;
const maxRequestBytes = 8 * 1000 * 1000;
const fields = new Map([
  ['form-name', 32], ['company', 120], ['name', 120], ['email', 254], ['phone', 45],
  ['city', 120], ['project_type', 40], ['dimensions', 160], ['timeline', 160],
  ['project_note', 2000], ['wall_photo_filename', 255], ['lead_source', 32], ['submission_id', 128],
  ['utm_source', 500], ['utm_medium', 500], ['utm_campaign', 500], ['utm_content', 500],
  ['initial_landing_path', 500], ['first_referrer', 500],
  ['cta_origin_id', 180], ['cta_origin_path', 500], ['cta_latest_id', 180], ['cta_latest_path', 500]
]);
const projectTypes = new Set([
  '', 'general', 'fireplace', 'feature_wall', 'venetian_plaster', 'limewash', 'marmorino',
  'range_hood', 'commercial', 'sculptural', 'microcement'
]);
const imageTypes = new Map([
  ['jpeg', ['image/jpeg']], ['png', ['image/png']], ['webp', ['image/webp']], ['heif', ['image/heic', 'image/heif']]
]);
const imageExtensions = new Map([
  ['jpeg', /\.jpe?g$/i], ['png', /\.png$/i], ['webp', /\.webp$/i], ['heif', /\.hei[cf]$/i]
]);

function reject(status: number, code: string) {
  return Response.json({ code }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

async function readBody(request: Request) {
  if (Number(request.headers.get('content-length')) > maxRequestBytes) return null;
  const reader = request.body?.getReader();
  if (!reader) return new ArrayBuffer(0);
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return new Blob(chunks).arrayBuffer();
      total += value.byteLength;
      if (total > maxRequestBytes) {
        void reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
}

async function validImage(file: File) {
  if (!file.size || file.size > maxPhotoBytes || file.name.length > 255) return false;
  const bytes = new Uint8Array(await file.slice(0, 256).arrayBuffer());
  const ascii = (from: number, to: number) => new TextDecoder().decode(bytes.subarray(from, to));
  let format = '';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) format = 'jpeg';
  else if ([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte)) format = 'png';
  else if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') format = 'webp';
  else if (bytes.length >= 16 && ascii(4, 8) === 'ftyp') {
    const brands = [ascii(8, 12)];
    const declaredEnd = new DataView(bytes.buffer).getUint32(0);
    for (let index = 16; index + 4 <= Math.min(bytes.length, declaredEnd); index += 4) brands.push(ascii(index, index + 4));
    if (brands.some(brand => /^(heic|heix|hevc|hevx|heis|hevm|hevs|mif1|msf1)$/.test(brand))) format = 'heif';
  }
  if (!format) return false;
  if (imageTypes.get(format)?.includes(file.type)) return true;
  return (!file.type || file.type === 'application/octet-stream') && Boolean(imageExtensions.get(format)?.test(file.name));
}

async function validateEnquiry(data: FormData) {
  const seen = new Set<string>();
  for (const [key, value] of data) {
    if (seen.has(key)) return reject(400, 'invalid_fields');
    seen.add(key);
    if (key === 'wall_photo') {
      if (typeof value === 'string') return reject(400, 'invalid_photo');
      // A native untouched file input can send an empty unnamed part.
      if ((value.name || value.size) && !await validImage(value)) return reject(400, 'invalid_photo');
    } else if (typeof value !== 'string' || !fields.has(key) || value.length > fields.get(key)!) {
      return reject(400, 'invalid_fields');
    }
  }
  if (data.get('company')) return reject(400, 'invalid_fields');
  const name = text(data, 'name');
  const email = text(data, 'email');
  const phone = text(data, 'phone');
  const digits = phone.replace(/\D/g, '').length;
  if (!name || (!email && !phone)) return reject(400, 'contact_required');
  if (email && !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(email)) {
    return reject(400, 'invalid_contact');
  }
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits < 7 || digits > 15)) return reject(400, 'invalid_contact');
  if (!projectTypes.has(text(data, 'project_type'))) return reject(400, 'invalid_fields');
  if (!['website', 'finish_advisor'].includes(text(data, 'lead_source'))) return reject(400, 'invalid_fields');
  if (!/^[a-z0-9_-]{1,128}$/i.test(text(data, 'submission_id'))) return reject(400, 'invalid_fields');
  return null;
}

type Context = { next: (request: Request) => Promise<Response> };

export default async function validateEstimate(request: Request, context: Context) {
  // Netlify still detects, sanitizes, stores, spam-checks and notifies as usual.
  // Only the homepage form's POST path participates in this request check.
  if (request.method !== 'POST') return;
  const contentType = request.headers.get('content-type') || '';
  if (!/^(multipart\/form-data|application\/x-www-form-urlencoded)(;|$)/i.test(contentType)) {
    return reject(415, 'unsupported_form');
  }
  const origin = request.headers.get('origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') {
    return reject(403, 'invalid_origin');
  }
  let body, data;
  try {
    body = await readBody(request);
    if (!body) return reject(413, 'form_too_large');
    data = await new Response(body, { headers: { 'Content-Type': contentType } }).formData();
  } catch (_) { return reject(400, 'invalid_form'); }
  const nextRequest = new Request(request, { body });
  const formNames = data.getAll('form-name');
  if (!formNames.some(value => typeof value === 'string' && value.trim() === 'instant-estimate')) return context.next(nextRequest);
  if (formNames.length !== 1 || formNames[0] !== 'instant-estimate') return reject(400, 'invalid_fields');
  const invalid = await validateEnquiry(data);
  if (invalid) return invalid;

  let confirmation;
  try {
    const upstream = await context.next(nextRequest);
    if (!upstream.ok) return reject(upstream.status >= 500 ? 503 : 502, 'provider_not_confirmed');
    // A static 200 or a redirect does not establish that Forms handled the request.
    if (!upstream.headers.get('content-type')?.includes('text/html')) return reject(502, 'provider_not_confirmed');
    confirmation = await upstream.text();
  } catch (_) { return reject(503, 'provider_not_confirmed'); }
  if (!/your form submission has been received/i.test(confirmation) || /id\s*=\s*["']estimate-form["']/i.test(confirmation)) {
    return reject(502, 'provider_not_confirmed');
  }
  return new Response(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store', 'X-Stile-Estimate-Receipt': 'http_accepted' }
  });
}

export const config = { path: ['/', '/index.html'], method: 'POST' };
