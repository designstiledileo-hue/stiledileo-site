const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const {render, replaceBlock} = require('./render-reputation.cjs');
const settings = require('../config/reputation.json');
const root = path.join(__dirname, '..');

test('homepage uses the generated dated reputation with no reviews runtime script', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const block = render(settings);
  assert.equal(replaceBlock(home, block), home);
  assert.match(block, /Stile di Leo Business Profile on Google/);
  assert.ok(block.includes(`datetime="${settings.verifiedOn}"`));
  assert.ok(block.includes(settings.rating.toFixed(1)));
  assert.match(block, /aria-hidden="true">☆☆☆☆☆.*★★★★★/);
  assert.doesNotMatch(block, /<blockquote|<script|<iframe/);
  assert.doesNotMatch(home, /home-reviews\.js|data-review-panel|google-maps-attribution|\/api\/google-reviews/);
  assert.equal(fs.existsSync(path.join(root, 'netlify/functions/stile-google-reviews.mts')), false);
});

test('one config update regenerates rating, star fill, count, verified date and link', () => {
  const block = render({...settings, rating:4.8, reviewCount:23, verifiedOn:'2026-11-20', profileUrl:settings.profileUrl+'?hl=en&gl=ca'});
  assert.match(block, /4\.8/);
  assert.match(block, /inline-size:96\.0%/);
  assert.match(block, /From 23 customer reviews/);
  assert.match(block, /2026-11-20/);
  assert.match(block, /hl=en&amp;gl=ca/);
  assert.ok(block.indexOf('reputation-stars') < block.indexOf('Stile di Leo Business Profile') &&
    block.indexOf('Stile di Leo Business Profile') < block.indexOf('google-review-g.svg'));
});

test('the trust strip links to the single reputation section directly before services', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.equal((home.match(/\bid="client-reputation"/g) || []).length, 1);
  const trustThroughServices = home.slice(home.indexOf('<div class="proof shell"'), home.indexOf('id="services"'));
  assert.match(trustThroughServices, /href="#client-reputation">Client reviews/);
  assert.match(trustThroughServices, /Serving Metro Vancouver<\/p>\s*<\/div>\s*<section [^>]*id="client-reputation"/);
  assert.match(trustThroughServices, /<!-- END REPUTATION -->\s*<\/div>\s*<\/section>\s*<section [^>]*$/);
});

test('invalid ratings, invalid dates and non-Google destinations cannot be published by the renderer', () => {
  for (const patch of [
    {rating:5.1}, {rating:4.74}, {reviewCount:0}, {verifiedOn:'2026-02-30'},
    {profileUrl:'https://www.google.com.example.org/maps/place/test'}, {profileUrl:'https://www.google.com/maps/search/example'}
  ]) assert.throws(() => render({...settings, ...patch}));
});
