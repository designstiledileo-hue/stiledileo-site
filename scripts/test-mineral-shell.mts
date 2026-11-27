import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import journal from '../netlify/functions/opinly-blog.mts';

const read = (name: string) => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const mainPages = readdirSync(new URL('../', import.meta.url)).filter(file =>
  file.endsWith('.html') && !['car.html','thank-you.html','furniture-thank-you.html'].includes(file));

test('marketing templates share one native menu, style, footer and route-appropriate enquiry link', () => {
  assert.equal(mainPages.length, 53);
  for (const file of mainPages) {
    const markup = read(file);
    for (const token of ['<!-- mineral-header -->','<!-- mineral-footer -->','href="/styles/site-navigation.css"','src="/scripts/home-navigation.js"']) {
      assert.equal(markup.split(token).length - 1, 1, `${file} requires one ${token}`);
    }
    assert.match(markup, /<details class="stile-menu">\s*<summary>Menu<\/summary>/);
    assert.match(markup, /href="\/#estimate-photo" data-track="send_photo">Send a Project Photo<\/a>/);
    assert.match(markup, /href="\/#estimate-commercial" data-track="estimate" data-estimate-type="commercial">Discuss a Commercial Project<\/a>/);
    if (file === 'furniture.html') {
      assert.match(markup, /class="stile-primary" href="#inquiry"/);
      assert.match(markup, /<form name="furniture-inquiry"/);
      assert.doesNotMatch(markup, /<script[^>]*src="https:\/\/www.googletagmanager.com/);
    }
  }
  for (const file of ['car.html','thank-you.html','furniture-thank-you.html','admin/index.html']) {
    assert.doesNotMatch(read(file), /mineral-header/);
  }
  const qr = read('car.html');
  assert.equal((qr.match(/href="\/#estimate-photo" data-track="send_photo"/g) || []).length, 2);
  assert.equal((qr.match(/href="\/#estimate" data-track="estimate"/g) || []).length, 2);
});

test('the generated journal uses the same shell and preserves canonical posting/404 responses', async () => {
  const nativeFetch = globalThis.fetch;
  const originalNetlify = Object.getOwnPropertyDescriptor(globalThis, 'Netlify');
  Object.defineProperty(globalThis, 'Netlify', { value: { env: { get: () => 'synthetic-local-test' } }, configurable: true });
  globalThis.fetch = async input => {
    const url = new URL(String(input));
    assert.equal(url.origin, 'https://sdk.opinly.ai');
    if (url.pathname.endsWith('/posts')) return Response.json({ data: [] });
    if (url.searchParams.get('slug') === 'missing') return new Response(null, { status: 404 });
    return Response.json({
      slug:'local-test', title:'Mineral & Light', description:'Synthetic reference.',
      content:{ type:'doc', content:[{type:'paragraph',content:[{type:'text',text:'Editorial content.'}]}] }
    });
  };
  try {
    for (const [route, status] of [['/blog/local-test',200],['/blog/missing',404],['/blog/',200]] as const) {
      const response = await journal(new Request('https://stiledileo.com' + route));
      assert.equal(response.status, status, route);
      const page = await response.text();
      assert.match(page, /<link rel="canonical" href="https:\/\/stiledileo\.com\//);
      assert.match(page, /class="stile-chrome stile-global-header"/);
      assert.match(page, /class="stile-chrome stile-global-footer"/);
      assert.match(page, /href="\/#estimate"/);
      if (route === '/blog/local-test') {
        assert.ok(page.includes('https://stiledileo.com/blog/local-test'));
        assert.match(page, /"@type":"BlogPosting"/);
        assert.match(page, /Mineral &amp; Light/);
        assert.match(page, /Editorial content\./);
      }
    }
  } finally {
    globalThis.fetch = nativeFetch;
    if (originalNetlify) Object.defineProperty(globalThis, 'Netlify', originalNetlify);
    else Reflect.deleteProperty(globalThis, 'Netlify');
  }
});
