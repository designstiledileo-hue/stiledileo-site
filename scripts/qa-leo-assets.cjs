// Actual local artwork/browser QA. Provider responses are simulated; no lead is sent.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = '/private/tmp/leo-owner-review';
fs.mkdirSync(out, { recursive: true });
const photo = path.resolve(__dirname, '../images/projects/white-rock-range-hood/stile-di-leo-white-rock-plaster-range-hood-after-hero-01.jpg');
(async () => {
 const browser = await chromium.launch({ channel: 'chrome', headless: true });
 const results = [], shots = [];
 try {
  const context = await browser.newContext({viewport:{width:1440,height:900}});
  const page = await context.newPage(), errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.leoCLS=0;window.leoShifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){window.leoCLS+=e.value;window.leoShifts.push({value:e.value,sources:e.sources.map(s=>({tag:s.node?.tagName,cls:s.node?.className,inPanel:!!s.node?.closest?.('#stile-advisor dialog')}))});}}).observe({type:'layout-shift',buffered:true});});
  let release, submitted;
  await page.route('**/api/finish-advisor',async r=>{
   submitted=r.request().postDataJSON();
   await new Promise(resolve=>{release=resolve;});
   await r.fulfill({contentType:'application/json',body:JSON.stringify({reply:'A quiet mineral finish may suit this surface; preparation needs review.',links:[{label:'Range hoods',path:'/plaster-range-hood-vancouver.html'}]})});
  });
  await page.goto('http://localhost:8888/');
  await page.locator('.sa-launcher').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,document.body.scrollHeight);});
  await page.waitForTimeout(800);
  const initialCLS=await page.evaluate(()=>{const prior=window.leoCLS;window.leoCLS=0;window.leoShifts=[];return prior;});
  async function capture(name) {await page.screenshot({path:`${out}/${name}.png`});shots.push(name);}
  const layout = () => page.evaluate(()=>['.sa-launcher','.cta-card','#floating-quote'].map(s=>JSON.stringify(document.querySelector(s).getBoundingClientRect())));
  const beforeLayout = await layout();
  await capture('A-launcher-only');
  await page.waitForFunction(()=>document.querySelector('.sa-leo-visual:not([hidden])[data-pose="peek"]'),{},{timeout:20000});
  await page.waitForTimeout(650); await capture('B-autonomous-peek');
  assert(await page.locator('.sa-leo-visual').isVisible());
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),'true');
  assert.equal(await page.locator('.sa-leo-visual img').count(),1);
  const autonomousCLS=await page.evaluate(()=>window.leoCLS);
  const afterLayout = await layout();
  // Existing reveal transforms settle at subpixel positions; allow 0.25 CSS px.
  for(let i=0;i<beforeLayout.length;i++) {
   const before=JSON.parse(beforeLayout[i]),after=JSON.parse(afterLayout[i]);
   for(const key of ['x','y','width','height']) assert(Math.abs(before[key]-after[key])<.25,'Leo does not move page, launcher or CTA');
  }
  const immediate = await page.evaluate(()=>{document.querySelector('.sa-launcher').click();return document.querySelector('#stile-advisor dialog').open;});
  assert(immediate); await page.waitForTimeout(250); await capture('C-react-advisor-open');
  assert.equal(await page.locator('.sa-leo-visual').getAttribute('data-pose'),'react');
  assert(await page.locator('.sa-leo-visual').isVisible());
  assert.equal(await page.locator('.sa-leo-visual').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  assert.equal(await page.locator('.sa-leo-visual').getAttribute('aria-hidden'),'true');
  await page.locator('#stile-advisor input[type=file]').setInputFiles(photo);
  await page.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));
  assert.notEqual(await page.locator('.sa-leo-visual').getAttribute('data-pose'),'inspect');
  await page.locator('#stile-advisor textarea').fill('A quiet finish for my White Rock hood.');
  await page.locator('.sa-send').click();
  await page.waitForFunction(()=>document.querySelector('.sa-leo-visual:not([hidden])[data-pose="inspect"]'));
  await page.waitForTimeout(250); await capture('D-inspect-photo-submitted');
  assert(submitted.image.startsWith('data:image/'));
  await page.waitForFunction(()=>document.querySelector('.sa-leo-visual:not([hidden])[data-pose="hide"]'));
  await page.waitForTimeout(100);await capture('E1-retreat-transition');
  await page.waitForFunction(()=>document.querySelector('.sa-leo-visual').hidden);
  await capture('E2-fully-hidden');
  assert(await page.getByRole('button',{name:'Thinking…'}).isDisabled());
  release();await page.waitForFunction(()=>document.querySelectorAll('.sa-message:not(.sa-user)').length===1);
  assert.equal(await page.locator('#stile-advisor a[href="/plaster-range-hood-vancouver.html"]').count(),1);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const cls=await page.evaluate(()=>window.leoCLS), shifts=await page.evaluate(()=>window.leoShifts);
  assert(shifts.every(e=>e.sources.every(s=>!String(s.cls).includes('sa-leo'))));
  assert.deepEqual(errors,[]);
  results.push({test:'A–E actual art; immediate modal; photo sent only; retreat; single image; no overflow/errors; unchanged page/CTA/launcher bounds',status:'PASS',observedPreOpenCLS:autonomousCLS,observedFlowCLS:cls,initialPageCLS:initialCLS,leoShiftSources:0,shiftSources:[...new Set(shifts.flatMap(e=>e.sources.map(s=>s.tag+':'+s.cls)))]});
  await page.reload();await page.waitForTimeout(11000);
  assert.equal(await page.locator('.sa-leo-visual:not([hidden])').count(),0);
  results.push({test:'same-tab autonomous replay suppressed',status:'PASS'});
  await context.close();
  const baseline=await browser.newContext({viewport:{width:1440,height:900}}), bp=await baseline.newPage();
  await bp.route('**/scripts/leo-interaction.js',r=>r.abort());
  await bp.goto('http://localhost:8888/');await bp.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,document.body.scrollHeight);});
  await bp.waitForTimeout(1500);
  await bp.evaluate(()=>{window.baselineCLS=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.baselineCLS+=e.value;}).observe({type:'layout-shift'});});
  await bp.waitForTimeout(10000);
  results.push({test:'unchanged homepage control with Leo script disabled',observedCLS:await bp.evaluate(()=>window.baselineCLS),note:'Existing CTA ::after sheen animates left; not a Leo layout shift. No homepage changes.'});
  await baseline.close();
  for(const mode of ['375','390','reduced','missing']) {
   const c=await browser.newContext({viewport:{width:mode==='375'?375:mode==='390'?390:1440,height:900},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
   const p=await c.newPage();let requests=0;
   p.on('request',r=>{if(r.url().includes('/images/leo-advisor/'))requests++;});
   if(mode==='missing')await p.route('**/images/leo-advisor/**',r=>r.abort());
   await p.goto('http://localhost:8888/');await p.locator('.sa-launcher').waitFor();await p.waitForTimeout(1200);
   if(mode==='390'){await p.screenshot({path:`${out}/F-mobile-390.png`});shots.push('F-mobile-390');}
   assert(await p.evaluate(()=>{document.querySelector('.sa-launcher').click();return document.querySelector('#stile-advisor dialog').open;}));
   assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(mode!=='missing')assert.equal(requests,0);
   results.push({test:`${mode}: static launcher, immediate Advisor, no broken-image flash`,status:'PASS'});await c.close();
  }
  fs.writeFileSync(`${out}/qa.json`,JSON.stringify({scope:'local visual integration; simulated provider only',results,screenshots:shots},null,2));
  fs.writeFileSync(`${out}/index.html`,`<!doctype html><meta charset="utf-8"><title>Leo chronological owner review</title><style>body{background:#111;color:#eee;font:18px system-ui;margin:32px}img{display:block;width:100%;max-width:1440px;border:1px solid #555}section{margin:40px 0}</style><h1>Leo — local chronological review</h1><p>A → B → C → D → E1 → E2 → F. Provider response simulated. No deployment.</p>${shots.map(s=>`<section><h2>${s}</h2><img src="${s}.png"></section>`).join('')}`);
  console.log(JSON.stringify(results,null,2));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
