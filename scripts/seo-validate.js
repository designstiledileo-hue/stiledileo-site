#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { XMLParser } = (() => {
  return { XMLParser: null };
})();

const root = path.resolve(__dirname, '..');
const site = 'https://stiledileo.com';
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const fail = [];
const warn = [];

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const attr = (tag, name) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
};
const canonicalFor = (file) => file === 'index.html' ? `${site}/` : `${site}/${file}`;
const strip = (value) => value.replace(/\s+/g, ' ').trim();
const sitemapXml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapSet = new Set(sitemapUrls);

if (!fs.existsSync(path.join(root, 'robots.txt'))) fail.push('robots.txt is missing');
if (!fs.existsSync(path.join(root, 'sitemap.xml'))) fail.push('sitemap.xml is missing');
if (!sitemapXml.includes('<urlset')) fail.push('sitemap.xml does not look like a urlset');

for (const url of sitemapUrls) {
  if (!url.startsWith(site)) fail.push(`Sitemap URL uses wrong host: ${url}`);
  const pathname = new URL(url).pathname;
  if (pathname !== '/' && !pathname.endsWith('.html')) fail.push(`Sitemap URL is not canonical .html format: ${url}`);
  const local = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (!fs.existsSync(path.join(root, local))) fail.push(`Sitemap URL has no local HTML target: ${url}`);
}
if (sitemapUrls.length !== sitemapSet.size) fail.push('sitemap.xml contains duplicate <loc> entries');

const intentionalNoindex = new Set(['thank-you.html', 'compare-homepages.html', 'index-v2.html', 'car.html']);

for (const file of htmlFiles) {
  const html = read(file);
  const title = strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
  const descriptions = [...html.matchAll(/<meta[^>]+name=["']description["'][^>]*>/gi)].map((m) => attr(m[0], 'content'));
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)].map((m) => attr(m[0], 'href'));
  const robots = [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]*>/gi)].map((m) => attr(m[0], 'content'));
  const ogUrls = [...html.matchAll(/<meta[^>]+property=["']og:url["'][^>]*>/gi)].map((m) => attr(m[0], 'content'));
  const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)];
  const expected = canonicalFor(file);
  const indexable = !intentionalNoindex.has(file);

  if (indexable && !title) fail.push(`${file}: missing <title>`);
  if (indexable && (descriptions.length !== 1 || !strip(descriptions[0] || ''))) fail.push(`${file}: must have exactly one non-empty meta description`);
  if (canonicals.length !== 1) fail.push(`${file}: must have exactly one canonical`);
  else if (canonicals[0] !== expected) fail.push(`${file}: canonical mismatch (${canonicals[0]} !== ${expected})`);
  if (ogUrls.length && (ogUrls.length !== 1 || ogUrls[0] !== (canonicals[0] || expected))) fail.push(`${file}: og:url does not match canonical`);
  if (indexable && robots.some((value) => /noindex|none|unavailable_after/i.test(value))) fail.push(`${file}: indexable page has blocking robots meta`);
  if (h1s.length !== 1) fail.push(`${file}: expected one H1, found ${h1s.length}`);
  if (indexable && file !== 'index.html' && !sitemapSet.has(expected)) fail.push(`${file}: canonical URL missing from sitemap.xml`);

  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); }
    catch (error) { fail.push(`${file}: invalid JSON-LD (${error.message})`); }
  }

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const raw = match[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) continue;
    const clean = raw.split('#')[0].split('?')[0];
    if (!clean || clean === '/') continue;
    if (clean.startsWith('/')) {
      const target = path.join(root, clean.slice(1));
      if (!fs.existsSync(target)) fail.push(`${file}: broken local reference ${raw}`);
      else {
        const parts = clean.slice(1).split('/');
        let cursor = root;
        for (const part of parts) {
          const names = fs.readdirSync(cursor);
          if (!names.includes(part)) fail.push(`${file}: local reference case mismatch ${raw}`);
          cursor = path.join(cursor, part);
        }
      }
      if (!/\.(html|xml|txt|png|PNG|jpe?g|webp|svg|mp4|pdf|ico)$/i.test(clean) && !clean.startsWith('/admin')) {
        const htmlTarget = path.join(root, `${clean.slice(1)}.html`);
        if (fs.existsSync(htmlTarget)) fail.push(`${file}: internal link points to redirecting clean URL ${raw}`);
      }
    }
  }

  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = img[0];
    const src = attr(tag, 'src');
    if (!src || /^(https?:|data:)/i.test(src)) continue;
    if (!tag.match(/\salt=/i)) fail.push(`${file}: image missing alt ${src}`);
    if (!tag.match(/\swidth=/i) || !tag.match(/\sheight=/i)) warn.push(`${file}: image missing width/height ${src}`);
  }
}

if (fail.length) {
  console.error(`SEO validation failed: ${fail.length} issue(s)`);
  for (const issue of fail) console.error(`- ${issue}`);
  if (warn.length) console.error(`Warnings: ${warn.length}`);
  process.exit(1);
}
console.log(`SEO validation passed for ${htmlFiles.length} HTML files and ${sitemapUrls.length} sitemap URLs.`);
if (warn.length) {
  console.log(`Warnings: ${warn.length} non-blocking image dimension opportunity/opportunities.`);
}
