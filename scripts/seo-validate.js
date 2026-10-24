#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { checkReference, cssUrls, decodeHtmlAttribute, srcsetUrls } = require('./seo-reference-utils.cjs');
const { XMLParser } = (() => {
  return { XMLParser: null };
})();

const root = path.resolve(__dirname, '..');
const site = 'https://stiledileo.com';
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const fail = [];
const warn = [];
const unsupported = new Set();
const checkedCdnSources = new Set();

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
    validateReference(raw);
  }

  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = img[0];
    const src = attr(tag, 'src');
    if (src) validateReference(src, true);
    if (!src || /^(https?:|data:)/i.test(src)) continue;
    if (!tag.match(/\salt=/i)) fail.push(`${file}: image missing alt ${src}`);
    if (!tag.match(/\swidth=/i) || !tag.match(/\sheight=/i)) warn.push(`${file}: image missing width/height ${src}`);
  }

  for (const media of html.matchAll(/<(?:img|source|link)\b[^>]*>/gi)) {
    for (const attribute of ['srcset', 'imagesrcset']) {
      for (const source of srcsetUrls(attr(media[0], attribute))) validateReference(source, true);
    }
  }
  // Inline background images use the same source checks as visible img/srcset media.
  for (const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const source of cssUrls(style[1])) validateReference(source, true, true);
  }
  for (const style of html.matchAll(/\sstyle=(["'])([\s\S]*?)\1/gi)) {
    for (const source of cssUrls(decodeHtmlAttribute(style[2]))) validateReference(source, true, true);
  }

  function validateReference(raw, image = false, htmlDecoded = false) {
    const result = checkReference(raw, { root, file, site, htmlDecoded });
    const context = result.cdn ? 'Image CDN source' : 'local reference';
    const addFailure = message => {
      const issue = `${file}: ${message} ${raw}`;
      if (!fail.includes(issue)) fail.push(issue);
    };
    if (result.kind === 'invalid') addFailure(`invalid ${context} (${result.message})`);
    if (result.kind === 'unsupported') unsupported.add(`${file}: ${result.message} ${raw}`);
    if (result.kind === 'remote' && (result.cdn || image)) {
      unsupported.add(`${file}: remote image availability not checked offline ${result.url}`);
    }
    if (result.kind !== 'local') return;
    if (result.cdn) checkedCdnSources.add(`${file}:${raw}`);
    if (result.status === 'missing') addFailure(`broken ${context} (source ${result.pathname})`);
    else if (result.status === 'case-mismatch') addFailure(`${context} case mismatch (actual ${result.actualPath})`);
    else if ((result.cdn || image) && !result.isFile) addFailure(`${context} is not an image file`);
    const clean = result.pathname;
    if (!result.cdn && !image && !path.extname(clean) && clean !== '/' && !clean.startsWith('/admin')) {
      const htmlTarget = path.join(root, `${clean.slice(1)}.html`);
      if (fs.existsSync(htmlTarget)) addFailure('internal link points to redirecting clean URL');
    }
  }
}

console.log(`Image source checks: ${checkedCdnSources.size} local Image CDN reference(s) resolved to source paths.`);
if (unsupported.size) {
  console.log(`Unsupported checks: ${unsupported.size} image reference(s) need separate runtime verification (not counted as passes).`);
  for (const issue of unsupported) console.log(`- ${issue}`);
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
