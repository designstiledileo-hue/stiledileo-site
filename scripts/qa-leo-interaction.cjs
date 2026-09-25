// Local browser integration QA. Instrumented adapter tests hooks, never real artwork.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = 'http://localhost:8888';
const controllerSource = fs.readFileSync(path.join(__dirname, 'leo-interaction.js'), 'utf8');
const photo = path.resolve(__dirname, '../images/projects/white-rock-range-hood/stile-di-leo-white-rock-plaster-range-hood-after-hero-01.jpg');
const installAdapter = `
window.leoCalls=[]; window.leoEvents=[];
window.StileAnalytics={track:n=>window.leoEvents.push(n)};
window.testAdapter={ready:true,
 showPeek:()=>{window.leoCalls.push({kind:'PEEK',seen:sessionStorage.getItem('stile_leo_intro_seen')});return true},
 showReact:()=>{window.leoCalls.push({kind:'REACT'});return true},
 showInspect:()=>{window.leoCalls.push({kind:'INSPECT',sent:window.requestSent===true});return true},
 hide:()=>window.leoCalls.push({kind:'HIDE'}),destroy:()=>window.leoCalls.push({kind:'DESTROY'})};
window.leoController=window.StileLeo.init(document.getElementById('stile-advisor'),window.testAdapter);`;
const fixture = `<!doctype html><html><head><link rel="stylesheet" href="/styles/finish-advisor.css"><style>
body{margin:0;min-height:100vh;background:#eee}.estimate-modal{display:none}.estimate-modal.is-open{display:block;position:fixed;inset:40px;background:#fff;z-index:100}
</style></head><body><textarea id="outside" aria-label="Other field"></textarea><div class="estimate-modal" id="estimate-modal" aria-hidden="true">Inquiry</div><script src="/scripts/finish-advisor.js"></script></body></html>`;
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 async function setup(options={}) {
  const context=await browser.newContext({viewport:{width:options.width||1440,height:900},reducedMotion:options.reduced?'reduce':'no-preference'});
  if(options.storage) await context.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('blocked')};Storage.prototype.setItem=()=>{throw new Error('blocked')};});
  const page=await context.newPage(), errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/__leo-qa*',r=>r.fulfill({contentType:'text/html',body:fixture}));
  await page.route('**/scripts/leo-interaction.js',r=>options.loadFailure?r.abort():r.fulfill({contentType:'text/javascript',body:controllerSource+(options.noAdapter?'':installAdapter)}));
  if(options.noAdapter) await page.route('**/images/leo-advisor/**',r=>r.abort());
  let respond;
  await page.route('**/api/finish-advisor',async r=>{
   await page.evaluate(()=>{window.requestSent=true});
   if(options.pending) await new Promise(resolve=>{respond=()=>{r.fulfill({status:503,body:'unavailable'}).then(resolve).catch(resolve)};});
   else await r.fulfill({contentType:'application/json',body:JSON.stringify({reply:'A finish direction requires preparation review.',links:[]})});
  });
  await page.clock.install(); await page.goto(base+'/__leo-qa');
  await page.locator('.sa-launcher').waitFor();
  if(!options.loadFailure) await page.waitForFunction(()=>!!window.StileLeo);
  const count=kind=>page.evaluate(k=>(window.leoCalls||[]).filter(x=>x.kind===k).length,kind);
  return {context,page,errors,count,respond:()=>respond?.()};
 }
 async function finish(t,label) {assert.deepEqual(t.errors,[]);await t.context.close();results.push(label);console.log('PASS '+label);}
 try {
  let t=await setup();await t.page.clock.runFor(9100);assert.equal(await t.count('PEEK'),1);
  assert.equal(await t.page.evaluate(()=>leoCalls[0].seen),null,'not marked before renderer starts');assert.equal(await t.page.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),'true');assert.equal(await t.page.evaluate(()=>leoEvents.filter(x=>x==='leo_peek_shown').length),1);
  await t.page.clock.runFor(2300);assert.equal(await t.page.evaluate(()=>leoController.visualState),'HIDDEN');
  await t.page.goto(base+'/__leo-qa-next');await t.page.waitForFunction(()=>!!window.leoController);await t.page.clock.runFor(12000);assert.equal(await t.count('PEEK'),0);
  await t.page.reload();await t.page.waitForFunction(()=>!!window.leoController);await t.page.clock.runFor(12000);assert.equal(await t.count('PEEK'),0);await finish(t,'A/B/C: one start; marker at start; same-tab navigation/reload suppressed');
  t=await setup();await t.page.clock.runFor(9100);assert.equal(await t.count('PEEK'),1);await finish(t,'D: fresh context eligible');
  for(const mode of ['noAdapter','storage','loadFailure','reduced']) {
   t=await setup({[mode]:true});await t.page.clock.runFor(12000);assert.equal(await t.count('PEEK'),0);
   const immediate=await t.page.evaluate(()=>{document.querySelector('.sa-launcher').click();return document.querySelector('#stile-advisor dialog').open});assert(immediate);
   // Lazy decoding may create an empty decorative host; failed media must never render.
   if(mode==='noAdapter')assert.equal(await t.page.locator('.sa-leo-visual img,.sa-leo-visual video').count(),0);
   await finish(t,'fallback opens synchronously: '+mode);
  }
  for(const action of ['advisor','estimate','typing','hidden','blur','reduced','destroy','overlay']) {
   t=await setup();await t.page.clock.runFor(3000);
   await t.page.evaluate(a=>{
    if(a==='advisor')document.querySelector('.sa-launcher').click();
    if(a==='estimate')document.querySelector('#estimate-modal').classList.add('is-open');
    if(a==='typing')document.querySelector('#outside').dispatchEvent(new Event('input',{bubbles:true}));
    if(a==='hidden'){Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));}
    if(a==='blur')window.dispatchEvent(new Event('blur'));
    if(a==='destroy'){leoController.destroy();window.leoController=StileLeo.init(document.querySelector('#stile-advisor'),testAdapter);}
    if(a==='overlay'){const d=document.createElement('dialog');document.body.append(d);d.showModal();}
   },action);
   if(action==='reduced')await t.page.emulateMedia({reducedMotion:'reduce'});
   await t.page.clock.runFor(12000);assert.equal(await t.count('PEEK'),0);assert.equal(await t.page.evaluate(()=>leoController.visualState),'HIDDEN');await finish(t,'scheduled interruption: '+action);
  }
  for(const action of ['advisor','estimate','typing','hidden','reduced','destroy']) {
   t=await setup();await t.page.clock.runFor(9100);assert.equal(await t.count('PEEK'),1);
   await t.page.evaluate(a=>{
    if(a==='advisor')document.querySelector('.sa-launcher').click();
    if(a==='estimate')document.querySelector('#estimate-modal').classList.add('is-open');
    if(a==='typing')document.querySelector('#outside').dispatchEvent(new Event('input',{bubbles:true}));
    if(a==='hidden'){Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));}
    if(a==='destroy')leoController.destroy();
   },action);
   if(action==='reduced')await t.page.emulateMedia({reducedMotion:'reduce'});
   if(action==='advisor') {assert.equal(await t.page.evaluate(()=>leoController.visualState),'REACT');await t.page.clock.runFor(1300);}
   await t.page.waitForFunction(()=>leoController.visualState==='HIDDEN');await t.page.clock.runFor(15000);assert.equal(await t.count('PEEK'),1);await finish(t,'active interruption: '+action);
  }
  t=await setup();assert(await t.page.evaluate(()=>StileLeo.init(document.querySelector('#stile-advisor'))===leoController));
  await t.page.addScriptTag({content:controllerSource});await t.page.clock.runFor(9100);assert.equal(await t.count('PEEK'),1);assert.equal(await t.page.locator('.sa-leo-visual').count(),1);await finish(t,'idempotent script and controller');
  t=await setup();await t.page.locator('.sa-launcher').hover();assert.equal(await t.count('REACT'),1);await t.page.mouse.move(20,300);await t.page.clock.runFor(2000);await t.page.locator('.sa-launcher').hover();assert.equal(await t.count('REACT'),1);await t.page.clock.runFor(21000);await t.page.mouse.move(20,300);await t.page.locator('.sa-launcher').hover();assert.equal(await t.count('REACT'),2);await finish(t,'pointer cooldown');
  t=await setup();await t.page.evaluate(()=>{testAdapter.showPeek=()=>{throw Error('adapter failed')}});await t.page.clock.runFor(10000);assert.equal(await t.page.evaluate(()=>leoController.visualState),'HIDDEN');assert.equal(await t.page.evaluate(()=>leoEvents.filter(x=>x==='leo_peek_shown').length),0);await t.page.locator('.sa-launcher').click();assert(await t.page.locator('dialog').first().isVisible());await finish(t,'broken adapter cannot block advisor or emit peek event');
  for(const width of [375,390]){t=await setup({width});await t.page.clock.runFor(12000);assert.equal(await t.count('PEEK'),0);assert.equal(await t.page.locator('.sa-leo-visual').count(),0);await finish(t,'mobile suppression '+width);}
  t=await setup();await t.page.evaluate(()=>{const a=document.createElement('button');a.id='collision-blocker';a.textContent='Protected foreground';Object.assign(a.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh'});document.body.append(a);});await t.page.clock.runFor(10000);assert.equal(await t.count('PEEK'),0);assert.equal(await t.page.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),null);
  await t.page.evaluate(()=>document.querySelector('#collision-blocker').remove());await t.page.clock.runFor(4000);assert.equal(await t.count('PEEK'),1);await finish(t,'rejected placement retains one opportunity for bounded safe retry');
  t=await setup();await t.page.evaluate(()=>{testAdapter.showPeek=()=>{leoCalls.push({kind:'REJECTED'});return false;};});await t.page.clock.runFor(30000);assert.equal(await t.count('REJECTED'),3);await t.page.clock.runFor(60000);assert.equal(await t.count('REJECTED'),3);assert.equal(await t.page.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),null);await finish(t,'three attempts maximum; rejected renderer never consumes session');
  t=await setup();await t.page.evaluate(()=>{testAdapter.completionDriven=true;testAdapter.showPeek=(host,continuing,done,shown)=>{window.signalShown=shown;return true;};});await t.page.clock.runFor(9100);assert.equal(await t.page.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),null);await t.page.evaluate(()=>signalShown());assert.equal(await t.page.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),'true');assert.equal(await t.page.evaluate(()=>leoEvents.filter(x=>x==='leo_peek_shown').length),1);await finish(t,'completion-driven renderer marks only actual shown callback');
  for(const ending of ['error','close','clear']) {
   t=await setup({pending:true});await t.page.locator('.sa-launcher').click();await t.page.locator('#stile-advisor input[type=file]').setInputFiles(photo);
   await t.page.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));assert.equal(await t.count('INSPECT'),0);
   await t.page.locator('#stile-advisor textarea').fill('My project');await t.page.locator('.sa-send').click();await t.page.waitForFunction(()=>window.requestSent===true);assert.equal(await t.count('INSPECT'),1);
   assert.equal(await t.page.locator('.sa-leo-visual').evaluate(e=>getComputedStyle(e).pointerEvents),'none');assert.equal(await t.page.locator('.sa-leo-visual').getAttribute('aria-hidden'),'true');
   if(ending==='close')await t.page.keyboard.press('Escape');
   if(ending==='clear')await t.page.getByRole('button',{name:'New conversation'}).click();
   t.respond();await t.page.waitForFunction(()=>leoController.visualState==='HIDDEN');await t.page.clock.runFor(5000);assert.equal(await t.count('INSPECT'),1);await finish(t,'photo sent once; stops on '+ending);
  }
  fs.writeFileSync('/private/tmp/leo-interaction-qa.json',JSON.stringify({status:'PASS',scope:'instrumented adapter, no real character animation',checks:results},null,2));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
