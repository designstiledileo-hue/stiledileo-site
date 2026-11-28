const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const start = '        <!-- BEGIN REPUTATION: generated from config/reputation.json -->';
const end = '        <!-- END REPUTATION -->';
const escapeHtml = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const dateLabel = new Intl.DateTimeFormat('en-CA', {year:'numeric', month:'long', day:'numeric', timeZone:'UTC'});
const numberLabel = new Intl.NumberFormat('en-CA');

function render({rating, reviewCount, verifiedOn, profileUrl}) {
  if (!Number.isFinite(rating) || rating < 1 || rating > 5 || Number(rating.toFixed(1)) !== rating) {
    throw new Error('Use a rating from 1 to 5 with at most one decimal place.');
  }
  if (!Number.isSafeInteger(reviewCount) || reviewCount < 1) throw new Error('Use a positive integer review count.');
  if (typeof verifiedOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(verifiedOn)) throw new Error('Use a YYYY-MM-DD verification date.');
  const date = new Date(verifiedOn);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== verifiedOn) throw new Error('Use a valid calendar date.');
  const url = new URL(profileUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'www.google.com' || url.port || url.username || url.password
    || !url.pathname.startsWith('/maps/place/')) throw new Error('Use the direct HTTPS Google Maps place URL.');
  return [
    start,
    '        <div class="reputation-summary" data-reputation-summary>',
    '          <p class="reputation-rating">',
    `            <span><strong>${rating.toFixed(1)}</strong> out of 5</span>`,
    `            <span class="reputation-stars" aria-hidden="true">☆☆☆☆☆<span style="inline-size:${(rating * 20).toFixed(1)}%">★★★★★</span></span>`,
    '          </p>',
    `          <p class="reputation-count">From ${numberLabel.format(reviewCount)} customer ${reviewCount === 1 ? 'review' : 'reviews'}</p>`,
    '          <p class="reputation-source">Stile di Leo Business Profile on Google</p>',
    `          <p class="reputation-date">As of <time datetime="${verifiedOn}">${dateLabel.format(date)}</time></p>`,
    '        </div>',
    '        <div class="reputation-actions">',
    `          <a class="text-link reputation-profile" data-reputation-profile href="${escapeHtml(url.href)}">`,
    '            <span class="reputation-mark"><img src="/images/homepage/editorial/google-review-g.svg" width="18" height="18" alt="" loading="lazy" decoding="async"></span>',
    '            <span>Read reviews on Google <span aria-hidden="true">↗</span></span>',
    '          </a>',
    '        </div>',
    end,
  ].join('\n');
}

function replaceBlock(home, block) {
  const first = home.indexOf(start);
  const last = home.indexOf(end);
  if (first < 0 || last < first || first !== home.lastIndexOf(start) || last !== home.lastIndexOf(end)) {
    throw new Error('Expected one valid reputation block in index.html.');
  }
  return home.slice(0, first) + block + home.slice(last + end.length);
}

if (require.main === module) {
  const target = path.join(root, 'index.html');
  const before = fs.readFileSync(target, 'utf8');
  const config = JSON.parse(fs.readFileSync(path.join(root, 'config/reputation.json'), 'utf8'));
  const after = replaceBlock(before, render(config));
  if (process.argv.includes('--check')) {
    if (before !== after) {
      console.error('Reputation differs from config/reputation.json. Run node scripts/render-reputation.cjs.');
      process.exitCode = 1;
    } else console.log('Static reputation matches config/reputation.json.');
  } else if (before !== after) {
    fs.writeFileSync(target, after);
    console.log('Updated the static homepage reputation block.');
  }
}
module.exports = { render, replaceBlock };
