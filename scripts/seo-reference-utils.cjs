const fs = require('node:fs');
const path = require('node:path');

function decodeHtmlAttribute(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, name) => {
    if (!name.startsWith('#')) return named[name.toLowerCase()];
    const number = /^#x/i.test(name) ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    return number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff)
      ? String.fromCodePoint(number) : '\ufffd';
  });
}

function resolveReference(raw, { root, file, site, htmlDecoded = false }) {
  const value = (htmlDecoded ? raw : decodeHtmlAttribute(raw)).trim();
  if (!value || /^(?:#|mailto:|tel:|data:|blob:|javascript:)/i.test(value)) return { kind: 'skip' };
  let url;
  let cdn = false;
  try {
    url = new URL(value, new URL(file, `${site}/`));
    if (url.origin === new URL(site).origin && url.pathname === '/.netlify/images') {
      cdn = true;
      const sources = url.searchParams.getAll('url');
      if (sources.length !== 1 || !sources[0].trim()) {
        return { kind: 'invalid', cdn, message: 'Image CDN requires exactly one non-empty url source' };
      }
      // URLSearchParams decodes the outer query; the source URL retains its own path encoding.
      url = new URL(sources[0], `${site}/`);
    }
    if (!/^https?:$/.test(url.protocol)) {
      return { kind: 'invalid', cdn, message: `unsupported URL protocol ${url.protocol}` };
    }
    if (url.origin !== new URL(site).origin) return { kind: 'remote', cdn, url: url.href };
    if (cdn && url.pathname === '/.netlify/images') {
      return { kind: 'unsupported', cdn, message: 'nested Image CDN source requires runtime verification' };
    }
    const pathname = decodeURIComponent(url.pathname);
    if (/[\0\\]/.test(pathname)) throw new Error('invalid local path character');
    const target = path.resolve(root, `.${pathname}`);
    const relative = path.relative(root, target);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      throw new Error('local path escapes the repository');
    }
    return { kind: 'local', cdn, pathname, target, relative };
  } catch (error) {
    return { kind: 'invalid', cdn, message: error.message };
  }
}

function checkReference(raw, options) {
  const result = resolveReference(raw, options);
  if (result.kind !== 'local') return result;
  const parts = result.relative.split(path.sep).filter(Boolean);
  let cursor = options.root;
  let caseMismatch = false;
  for (const part of parts) {
    let names;
    try { names = fs.readdirSync(cursor); }
    catch { return { ...result, status: 'missing' }; }
    const actual = names.includes(part) ? part : names.find(name => name.toLowerCase() === part.toLowerCase());
    if (!actual) return { ...result, status: 'missing' };
    caseMismatch ||= actual !== part;
    cursor = path.join(cursor, actual);
  }
  try {
    const isFile = fs.statSync(cursor).isFile();
    return { ...result, status: caseMismatch ? 'case-mismatch' : 'ok', isFile,
      actualPath: `/${path.relative(options.root, cursor).split(path.sep).join('/')}` };
  } catch {
    return { ...result, status: 'missing' };
  }
}

function srcsetUrls(value) {
  const urls = [];
  let position = 0;
  while (position < value.length) {
    while (/[\s,]/.test(value[position] || '') && position < value.length) position++;
    const start = position;
    while (position < value.length && !/\s/.test(value[position])) position++;
    let url = value.slice(start, position);
    const trailingComma = url.endsWith(',');
    url = url.replace(/,+$/, '');
    if (url) urls.push(url);
    if (trailingComma) continue;
    let parentheses = 0;
    while (position < value.length) {
      const character = value[position++];
      if (character === '(') parentheses++;
      if (character === ')') parentheses--;
      if (character === ',' && parentheses === 0) break;
    }
  }
  return urls;
}

function cssUrls(value) {
  return [...value.matchAll(/url\(\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^\s)]+))\s*\)/gi)]
    .map(match => match[1] ?? match[2] ?? match[3]);
}

module.exports = { checkReference, cssUrls, decodeHtmlAttribute, resolveReference, srcsetUrls };
