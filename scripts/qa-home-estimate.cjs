// Local-only browser proof. A loopback receiver handles all POSTs; external requests are blocked.
// STILE_PREVIEW_ORIGIN=http://127.0.0.1:8913 node scripts/qa-home-estimate.cjs
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { Readable } = require('node:stream');
const { once } = require('node:events');
const { chromium, webkit } = require(process.env.STILE_PLAYWRIGHT_MODULE || 'playwright');

const base = new URL(process.env.STILE_PREVIEW_ORIGIN || 'http://127.0.0.1:8913');
assert(base.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'A loopback preview is required.');
const acceptedReply = () => new Response('<html><h1>Thank you!</h1><p>Your form submission has been received.</p></html>', { headers: { 'Content-Type': 'text/html' } });

async function verify(browserType, viewport, isMobile, validate) {
  const executablePath = process.env[`STILE_${browserType.name().toUpperCase()}_EXECUTABLE`];
  const browser = await browserType.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const received = [], advisor = [], errors = [];
  let responseMode = 'static', release;
  const receiver = createServer(async (incoming, outgoing) => {
    try {
      const url = new URL(incoming.url, endpoint);
      if (url.origin !== endpoint) return outgoing.writeHead(400).end();
      if (incoming.method !== 'POST') {
        const local = new URL(base);
        local.pathname = url.pathname;
        local.search = url.search;
        const resource = await fetch(local, { method: incoming.method, redirect: 'manual' });
        const headers = Object.fromEntries(resource.headers);
        delete headers['content-encoding'];
        delete headers['content-length'];
        outgoing.writeHead(resource.status, headers);
        if (resource.body) Readable.fromWeb(resource.body).on('error', () => outgoing.destroy()).pipe(outgoing);
        else outgoing.end();
        return;
      }
      const pieces = [];
      for await (const piece of incoming) pieces.push(piece);
      const body = Buffer.concat(pieces);
      if (url.pathname === '/api/finish-advisor') {
        advisor.push(JSON.parse(body.toString()));
        return outgoing.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ reply: 'Synthetic Advisor test reflection.', links: [] }));
      }
      if (url.pathname !== '/') return outgoing.writeHead(418).end();
      const request = new Request(url, { method: 'POST', headers: incoming.headers, body });
      const result = await validate(request, { async next(original) {
        received.push(await original.formData());
        if (responseMode === 'static') return new Response('<h1>Homepage, no delivery</h1>', { headers: { 'Content-Type': 'text/html' } });
        if (responseMode === 'unavailable') return new Response('Synthetic downstream failure', { status: 503 });
        if (responseMode === 'wait') await new Promise(resolve => { release = resolve; });
        return acceptedReply();
      } });
      outgoing.writeHead(result.status, Object.fromEntries(result.headers)).end(Buffer.from(await result.arrayBuffer()));
    } catch (error) {
      errors.push(error.message);
      if (!outgoing.headersSent) outgoing.writeHead(500).end();
      else outgoing.destroy();
    }
  });
  receiver.listen(0, '127.0.0.1');
  await once(receiver, 'listening');
  const endpoint = `http://127.0.0.1:${receiver.address().port}`;
  try {
    const context = await browser.newContext({ viewport, isMobile, hasTouch: isMobile, reducedMotion: 'reduce' });
    await context.addInitScript(() => {
      window.capturedMeasurement = [];
      window.gtag = (...event) => window.capturedMeasurement.push(event);
      window.StileMeasurement = { ready: true, enabled: true, pagePath: location.pathname, pageLocation: `https://stiledileo.com${location.pathname}`, pageReferrer: '' };
    });
    await context.route('**/*', async route => {
      if (new URL(route.request().url()).origin !== endpoint) return route.fulfill({ status: 204 });
      return route.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${endpoint}/?a11y=form&utm_source=synthetic_qa#estimate`);
    await page.waitForFunction(() => document.activeElement.id === 'estimate-title');
    await page.goto(`${endpoint}/?utm_source=synthetic_qa`);
    const hero = page.locator('[data-cta-id=home_hero_estimate]');
    const modal = page.getByRole('dialog', { name: 'Request an Estimate' });
    const submit = page.locator('#estimate-form [type=submit]');
    const optional = page.locator('#estimate-optional');
    const name = page.locator('#estimate-name');
    const email = page.locator('#estimate-email');
    const phone = page.locator('#estimate-phone');
    const type = page.locator('#estimate-project-type');
    const details = page.locator('#estimate-details');
    const photo = page.locator('#estimate-photo');
    const removePhoto = page.getByRole('button', { name: 'Remove photo' });
    const waitVisible = id => page.locator(`#estimate-${id}`).waitFor({ state: 'visible' });
    const active = () => page.evaluate(() => document.activeElement.id);
    const waitFocus = id => page.waitForFunction(target => document.activeElement.id === `estimate-${target}`, id, { timeout: 2000 });
    const events = () => page.evaluate(() => window.capturedMeasurement.filter(([action]) => action === 'event'));
    const counted = async key => (await events()).filter(([, name]) => name === key);
    await hero.click();
    await modal.waitFor();
    assert.equal(await active(), 'estimate-title');
    assert.equal(await optional.evaluate(el => el.open), false);
    const initialButton = await submit.boundingBox();
    assert(initialButton && initialButton.y + initialButton.height <= viewport.height, 'Send button must fit before using optional details.');
    assert(await page.locator('main').evaluate(main => main.inert));
    assert(await page.locator('body').evaluate(body => body.scrollWidth <= innerWidth));
    await page.keyboard.press('Tab');
    assert.equal(await active(), 'estimate-close');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await submit.evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Escape');
    assert(await hero.evaluate(el => el === document.activeElement));
    assert.equal(await page.locator('main').evaluate(main => main.inert), false);
    await hero.click();
    await submit.click();
    assert.equal(await active(), 'estimate-name');
    await waitVisible('name-error');
    await name.fill('Synthetic Visitor');
    await submit.click();
    assert.equal(await active(), 'estimate-email');
    await waitVisible('contact-error');
    assert.equal(received.length, 0);
    await email.fill('synthetic@example.invalid');
    await optional.locator('summary').click();
    await page.locator('#estimate-project-type').selectOption('commercial');
    await submit.click();
    await waitVisible('failure');
    await waitFocus('failure');
    assert.equal((await counted('generate_lead')).length, 0);
    responseMode = 'wait';
    await submit.click();
    assert(await submit.isDisabled());
    for (let attempts = 0; !release && attempts < 100; attempts++) await new Promise(resolve => setTimeout(resolve, 25));
    assert(release, 'Local provider did not receive a valid retry.');
    await page.locator('#estimate-form').evaluate(form => form.requestSubmit());
    release();
    await waitVisible('success');
    await waitFocus('success');
    assert.equal(received.length, 2);
    assert.equal(received[0].get('submission_id'), received[1].get('submission_id'));
    assert.equal(received[1].has('wall_photo'), false);
    assert.equal(received[1].get('utm_source'), 'synthetic_qa');
    assert.equal(received[1].get('cta_origin_id'), 'home_hero_estimate');
    assert.equal(received[1].get('project_type'), 'commercial');
    const leads = await counted('generate_lead');
    assert.equal(leads.length, 1);
    assert.equal(leads[0][2].service, 'commercial');
    assert.equal(leads[0][2].receipt_state, 'http_accepted');
    assert.equal((await counted('conversion')).length, 1);

    // Exercise the existing Advisor UI and same-tab photo handoff end-to-end with synthetic media.
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Ask Leo' }).click();
    const advisorBox = page.locator('#stile-advisor dialog');
    const smallPng = await page.evaluate(() => document.createElement('canvas').toDataURL('image/png').split(',')[1]);
    await advisorBox.locator('input[type=file]').setInputFiles({ name: 'private-attachment.png', mimeType: 'image/png', buffer: Buffer.from(smallPng, 'base64') });
    await advisorBox.getByRole('img', { name: 'Selected project photo' }).waitFor();
    await advisorBox.getByRole('textbox', { name: 'Your project question' }).fill('Private visitor note: a retail feature wall.');
    await advisorBox.getByRole('button', { name: 'Send', exact: true }).click();
    await advisorBox.getByText('Synthetic Advisor test reflection.').waitFor();
    assert(advisor[0].image.startsWith('data:image/jpeg;base64,'));
    await advisorBox.getByRole('button', { name: 'Request a project review' }).click();
    await modal.waitFor();
    assert.equal(await optional.evaluate(el => el.open), true);
    assert.equal(received.length, 2, 'Advisor handoff must not submit.');
    assert.match(await page.locator('#estimate-details').inputValue(), /Private visitor note/);
    assert.equal(await page.locator('#estimate-photo').evaluate(el => el.files[0]?.name), 'project-photo.jpg');
    assert.equal(await name.inputValue(), '');
    await name.fill('Second Synthetic Visitor');
    await phone.fill('+1 (604) 555-0100');
    responseMode = 'accept';
    await submit.click();
    await waitVisible('success');
    assert.equal(received.length, 3);
    const photoDelivery = received[2];
    assert.equal(photoDelivery.get('lead_source'), 'finish_advisor');
    assert.equal(photoDelivery.get('email'), '');
    assert.equal(photoDelivery.get('phone'), '+1 (604) 555-0100');
    assert.equal(photoDelivery.get('wall_photo_filename'), 'project-photo.jpg');
    assert(photoDelivery.get('wall_photo').size > 0);
    assert.notEqual(photoDelivery.get('submission_id'), received[1].get('submission_id'));
    assert.equal((await counted('generate_lead')).length, 2);
    assert.equal((await counted('conversion')).length, 2);
    assert.doesNotMatch(JSON.stringify(await events()), /Private visitor note|synthetic@example\.invalid|private-attachment|project-photo\.jpg|555-0100|data:image|Synthetic Visitor/i);
    await page.keyboard.press('Escape');
    await page.locator('[data-cta-id=home_optional_photo]').click();
    await modal.waitFor();
    assert.equal(await optional.evaluate(el => el.open), true);
    await waitFocus('photo');
    assert.equal(await page.locator('#estimate-form [name=lead_source]').inputValue(), 'website');
    assert.equal(received.length, 3);

    // A search visitor can take the labeled photo journey directly from a service page.
    await page.goto(`${endpoint}/venetian-plaster-vancouver.html`);
    await page.locator('a[href="/#estimate-photo"][data-track=send_photo]').first().click();
    await page.waitForURL(`${endpoint}/#estimate-photo`);
    await modal.waitFor();
    await waitFocus('photo');
    assert.equal(await optional.evaluate(el => el.open), true);
    assert.equal(await type.inputValue(), 'general');
    const removalBase = received.length;
    await name.fill('Attachment QA Visitor');
    await email.fill('attachment-qa@example.invalid');
    await photo.setInputFiles({ name: 'private-invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('synthetic') });
    await waitVisible('photo-error');
    await submit.click();
    assert.equal(received.length, removalBase, 'A locally rejected file must not reach the provider.');
    await removePhoto.click();
    await waitFocus('photo');
    assert.equal(await photo.evaluate(el => el.files.length), 0);
    assert.equal(await photo.getAttribute('aria-invalid'), 'false');
    assert.equal(await removePhoto.isVisible(), false);
    await submit.click();
    await waitVisible('success');
    assert.equal(received.length, removalBase + 1);
    assert.equal(received.at(-1).has('wall_photo'), false);
    assert.equal(received.at(-1).get('wall_photo_filename'), '');
    assert.equal(received.at(-1).get('project_type'), 'general');

    // Sending from a normal estimate link does not force a photo, including direct search entry.
    await page.goto(`${endpoint}/fireplace-wall-vancouver.html`);
    await page.locator('a[href="/#estimate"][data-track=estimate]').first().click();
    await page.waitForURL(`${endpoint}/#estimate`);
    await modal.waitFor();
    await waitFocus('title');
    assert.equal(await optional.evaluate(el => el.open), false);
    await optional.locator('summary').click();
    await photo.setInputFiles({ name: 'private-first.png', mimeType: 'image/png', buffer: Buffer.from(smallPng, 'base64') });
    await removePhoto.waitFor();
    // Type/name pass the browser check; malformed bytes must still be stopped by the real validator.
    await photo.setInputFiles({ name: 'private-bad-bytes.png', mimeType: 'image/png', buffer: Buffer.from('not a PNG') });
    await name.fill('Replacement QA Visitor');
    await phone.fill('604-555-0101');
    const replacementBase = received.length;
    await submit.click();
    await waitVisible('photo-error');
    await waitFocus('photo');
    assert.equal(received.length, replacementBase, 'Server-rejected malformed image must not reach provider.');
    assert.equal((await counted('generate_lead')).length, 0);
    await photo.setInputFiles({ name: 'private-replacement.png', mimeType: 'image/png', buffer: Buffer.from(smallPng, 'base64') });
    assert.equal(await photo.getAttribute('aria-invalid'), 'false');
    await submit.click();
    await waitVisible('success');
    assert.equal(received.length, replacementBase + 1);
    const replacement = received.at(-1);
    assert.equal(replacement.get('wall_photo_filename'), 'private-replacement.png');
    assert.equal(replacement.get('wall_photo').name, 'private-replacement.png');
    assert.equal(replacement.get('wall_photo').size, Buffer.from(smallPng, 'base64').length);
    assert.equal(replacement.get('email'), '');

    // A direct commercial link opens its lane, without absorbing a prior residential draft.
    await page.goto(`${endpoint}/commercial-limewash-vancouver.html`);
    await page.locator('a[href="/#estimate-commercial"]').first().click();
    await page.waitForURL(`${endpoint}/#estimate-commercial`);
    await modal.waitFor();
    await waitFocus('title');
    assert.equal(await type.inputValue(), 'commercial');
    await name.fill('Commercial Draft');
    await email.fill('commercial-draft@example.invalid');
    await optional.locator('summary').click();
    await details.fill('Commercial draft notes');
    await type.selectOption('sculptural');
    await photo.setInputFiles({ name: 'private-trade.png', mimeType: 'image/png', buffer: Buffer.from(smallPng, 'base64') });
    responseMode = 'unavailable';
    const switchBase = received.length;
    await submit.click();
    await waitVisible('failure');
    await waitFocus('failure');
    assert.equal(received.length, switchBase + 1);
    assert.equal(received.at(-1).get('project_type'), 'sculptural', 'Do not overwrite deliberate material selection.');
    const commercialId = received.at(-1).get('submission_id');
    await page.keyboard.press('Escape');
    await page.locator('[data-cta-id=home_residential_estimate]').click();
    await modal.waitFor();
    assert.equal(await type.inputValue(), 'general');
    assert.equal(await name.inputValue(), '');
    assert.equal(await email.inputValue(), '');
    assert.equal(await details.inputValue(), '');
    assert.equal(await photo.evaluate(el => el.files.length), 0);
    assert.equal(await optional.evaluate(el => el.open), false);
    assert.equal(await page.locator('#estimate-form [name=submission_id]').inputValue(), '');
    assert.equal(await page.locator('#estimate-failure').isVisible(), false);
    await name.fill('Residential Draft');
    await phone.fill('604-555-0102');
    await page.keyboard.press('Escape');
    await page.locator('[data-cta-id=home_trade_estimate]').click();
    await modal.waitFor();
    assert.equal(await name.inputValue(), 'Commercial Draft');
    assert.equal(await details.inputValue(), 'Commercial draft notes');
    assert.equal(await type.inputValue(), 'sculptural');
    assert.equal(await photo.evaluate(el => el.files[0]?.name), 'private-trade.png');
    assert.equal(await page.locator('#estimate-form [name=submission_id]').inputValue(), commercialId);
    await page.keyboard.press('Escape');
    await page.locator('[data-cta-id=home_residential_estimate]').click();
    await modal.waitFor();
    assert.equal(await name.inputValue(), 'Residential Draft');
    assert.equal(await phone.inputValue(), '604-555-0102');
    assert.equal(await type.inputValue(), 'general');

    // A held response may not show a prior lane's outcome in a different enquiry context.
    responseMode = 'wait';
    release = undefined;
    await submit.click();
    for (let attempts = 0; !release && attempts < 100; attempts++) await new Promise(resolve => setTimeout(resolve, 25));
    assert(release, 'Local provider did not hold residential request.');
    const residential = received.at(-1);
    assert.equal(residential.get('project_type'), 'general');
    assert.equal(residential.get('email'), '');
    assert.equal(residential.has('wall_photo'), false);
    assert.notEqual(residential.get('submission_id'), commercialId);
    try {
      await page.keyboard.press('Escape');
      assert.equal(await modal.isVisible(), true, 'Pending submission must not close into a different CTA.');
      await page.evaluate(() => { location.hash = '#estimate-commercial'; });
      assert.equal(await type.inputValue(), 'general');
      await page.locator('#estimate-form').evaluate(form => form.requestSubmit());
    } finally {
      release();
    }
    await waitVisible('success');
    await waitFocus('success');
    assert.equal(received.length, switchBase + 2);
    assert.deepEqual((await counted('generate_lead')).map(([, , data]) => data.service), ['general']);
    assert.equal((await counted('conversion')).length, 1);
    assert.doesNotMatch(JSON.stringify(await events()), /draft notes|example\.invalid|private-trade|555-0102|Residential Draft/i);

    // The untouched commercial default is distinct from either a residential request or a deliberate edit.
    await page.goto(`${endpoint}/commercial-limewash-vancouver.html`);
    await page.locator('a[href="/#estimate-commercial"]').first().click();
    await page.waitForURL(`${endpoint}/#estimate-commercial`);
    await modal.waitFor();
    assert.equal(await optional.evaluate(el => el.open), false);
    await waitVisible('intent');
    await name.fill('Commercial Classification QA');
    await email.fill('trade-qa@example.invalid');
    responseMode = 'accept';
    await submit.click();
    await waitVisible('success');
    assert.equal(received.length, switchBase + 3);
    assert.equal(received.at(-1).get('project_type'), 'commercial');
    assert.equal(received.at(-1).has('wall_photo'), false);
    assert.deepEqual((await counted('generate_lead')).map(([, , data]) => data.service), ['commercial']);
    assert.doesNotMatch(JSON.stringify(await events()), /trade-qa|Commercial Classification QA/i);
    assert.deepEqual(errors, []);
    console.log(`${browserType.name()} ${viewport.width}×${viewport.height}: enquiry keyboard/focus, photo-free email/phone, photo removal/replacement, three cross-page CTA intents, draft/receipt isolation, pending modal and repeat protection, Advisor handoff, analytics privacy PASS (local provider simulation)`);
  } finally {
    await browser.close();
    receiver.closeAllConnections();
    await new Promise(resolve => receiver.close(resolve));
  }
}

async function main() {
  const { default: validate } = await import('../netlify/edge-functions/estimate-validation.mts');
  for (const [browser, viewport, mobile] of [
    [chromium, { width: 1440, height: 900 }, false],
    [webkit, { width: 390, height: 844 }, true],
    [webkit, { width: 428, height: 926 }, true]
  ]) await verify(browser, viewport, mobile, validate);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
