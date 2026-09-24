// Real integrated local site. Provider and lead network remain simulated.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:8888';
const out=process.env.LEO_QA_OUTPUT||'/private/tmp/leo-motion-final-review';
const photo=path.resolve(__dirname,'../images/projects/white-rock-range-hood/stile-di-leo-white-rock-plaster-range-hood-after-hero-01.jpg');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 async function setup(options={}) {
  const context=await browser.newContext({viewport:{width:options.width||1440,height:900},deviceScaleFactor:1,
   reducedMotion:options.reduced?'reduce':'no-preference',
   ...(options.safari?{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Safari/605.1.15'}:{}),
   ...(options.record?{recordVideo:{dir:out+'/recording',size:{width:1440,height:900}}}:{})});
  const page=await context.newPage(),errors=[],assets=[];let sent=false,release;
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/images/leo-advisor/'))assets.push(r.url());});
  await context.route('**/*',r=>r.request().url().startsWith(base)||r.request().url().startsWith('data:')?r.continue():r.fulfill({status:204,body:''}));
  if(options.failure)await page.route(options.failure==='all'?'**/images/leo-advisor/**':'**/images/leo-advisor/motion/**',r=>r.abort());
  await page.route('**/api/finish-advisor',async r=>{
   const body=r.request().postDataJSON();sent=!!body.image;
   await new Promise(resolve=>{release=resolve;});
   await r.fulfill({status:options.error?503:200,contentType:'application/json',body:JSON.stringify({reply:'Local simulated reply: this finish direction needs surface review.',links:[{label:'Plaster range hoods',path:'/plaster-range-hood-vancouver.html'}]})}).catch(()=>{});
  });
  await page.addInitScript(()=>{
   window.leoQAEvents=[];window.leoQAShifts=[];
   new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.leoQAShifts.push({value:e.value,sources:e.sources.map(s=>s.node?.className||s.node?.tagName)});}).observe({type:'layout-shift'});
  });
  await page.goto(base+'/');await page.locator('.sa-launcher').waitFor();
  await page.waitForFunction(()=>!!window.StileLeo);
  await page.evaluate(()=>{window.gtag=(...args)=>leoQAEvents.push(args);document.documentElement.style.scrollBehavior='auto';scrollTo(0,document.body.scrollHeight);});
  return {context,page,errors,assets,sent:()=>sent,release:()=>release?.()};
 }
 const hidden=p=>p.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'));
 const motion=(p,state)=>p.waitForFunction(s=>{const h=document.querySelector('.sa-leo-visual:not([hidden])');const v=h?.querySelector('video');return h?.dataset.pose===s&&h.dataset.renderer==='motion'&&v?.dataset.alphaVerified==='true'&&!v.paused&&v.currentTime>.1;},state);
 const shot=(p,name)=>p.screenshot({path:path.join(out,name+'.png')});
 async function finish(t,label){assert.deepEqual(t.errors,[]);results.push(label);t.release();await t.context.close();console.log('PASS '+label);}
 try {
  let t=await setup({record:true});let p=t.page;
  await shot(p,'A-hidden');
  await motion(p,'peek');await shot(p,'B-peek');
  assert.deepEqual([...new Set(t.assets.filter(x=>x.endsWith('.webm')).map(x=>x.split('/').pop()))],['leo-peek.webm'],'only PEEK idle preload');
  assert.equal(await p.locator('.sa-leo-visual').getAttribute('aria-hidden'),'true');
  assert.equal(await p.locator('.sa-leo-visual').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  await hidden(p);await shot(p,'C-hidden');
  assert.equal(await p.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),'true');
  const immediate=await p.evaluate(()=>{document.querySelector('.sa-launcher').click();return document.querySelector('#stile-advisor dialog').open;});assert(immediate);
  await motion(p,'react');await p.waitForTimeout(650);await shot(p,'D-react');
  await hidden(p);await shot(p,'E-advisor-open');
  await p.locator('#stile-advisor input[type=file]').setInputFiles(photo);
  await p.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));
  assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0,'selection alone never INSPECT');
  await p.locator('#stile-advisor textarea').fill('A quiet finish for my White Rock range hood.');
  await p.locator('.sa-send').click();await motion(p,'inspect');assert(t.sent());
  await p.waitForTimeout(500);await shot(p,'F-inspect');
  assert(await p.getByRole('button',{name:'Thinking…'}).isDisabled());
  await motion(p,'hide');await p.waitForTimeout(650);await shot(p,'G-hide');
  await hidden(p);t.release();await p.waitForFunction(()=>!document.querySelector('.sa-send').disabled);await shot(p,'H-final');
  assert.equal(await p.locator('.sa-links a[href="/plaster-range-hood-vancouver.html"]').count(),1);
  assert(await p.evaluate(()=>[...document.querySelectorAll('.sa-leo-visual video')].every(v=>v.paused)));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const shifts=await p.evaluate(()=>leoQAShifts);assert(shifts.every(x=>x.sources.every(s=>!String(s).includes('sa-leo'))));
  const events=await p.evaluate(()=>leoQAEvents);assert(events.some(x=>x[1]==='leo_peek_shown'));
  assert(!JSON.stringify(events).includes('White Rock'),'no customer text in analytics');
  const movie=await p.video().path();await p.waitForTimeout(1200);await finish(t,'actual A–H motion, decoded alpha, lazy preload, photo gate, analytics, zero Leo CLS/overflow/errors');
  fs.copyFileSync(movie,path.join(out,'LEO_INTEGRATED_OWNER_REVIEW.webm'));
  fs.writeFileSync(path.join(out,'chronological.json'),JSON.stringify({immediate,assets:t.assets,events,shifts},null,2));
  for(const mode of ['375','390','reduced']){
   t=await setup({width:mode==='reduced'?1440:Number(mode),reduced:mode==='reduced'});p=t.page;
   await p.waitForTimeout(1500);assert.equal(t.assets.length,0);
   assert(await p.evaluate(()=>{document.querySelector('.sa-launcher').click();return document.querySelector('#stile-advisor dialog').open;}));
   await p.waitForTimeout(300);assert.equal(t.assets.length,0);await shot(p,'static-'+mode);
   assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);
   await finish(t,mode+': static Ask Leo, no character downloads, immediate Advisor');
  }
  for(const mode of ['safari','video-failure','all-failure']){
   t=await setup({safari:mode==='safari',failure:mode==='video-failure'?'motion':mode==='all-failure'?'all':null});p=t.page;
   await p.waitForTimeout(1500);await p.evaluate(()=>document.querySelector('.sa-launcher').click());
   if(mode==='all-failure'){await p.waitForTimeout(4500);await hidden(p);}
   else{await p.waitForFunction(()=>document.querySelector('.sa-leo-visual:not([hidden])')?.dataset.renderer==='static');assert.equal(await p.locator('.sa-leo-visual video').count(),0);await shot(p,mode);}
   if(mode==='safari')assert(!t.assets.some(x=>x.endsWith('.webm')));
   await finish(t,mode+': safe static/launcher fallback (Safari UA policy simulation, not native Safari certification)');
  }
  for(const ending of ['response','error','close','clear','blur','hidden','overlay','reinit']){
   t=await setup({error:ending==='error'});p=t.page;await p.waitForTimeout(1200);
   await p.evaluate(()=>document.querySelector('.sa-launcher').click());
   await p.locator('#stile-advisor input[type=file]').setInputFiles(photo);await p.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));
   await p.locator('#stile-advisor textarea').fill('Test photo');await p.locator('.sa-send').click();await motion(p,'inspect');
   if(['response','error'].includes(ending))t.release();
   else await p.evaluate(e=>{
    const root=document.querySelector('#stile-advisor');
    if(e==='close')root.querySelector('[aria-label="Close Finish Advisor"]').click();
    if(e==='clear')root.querySelector('.sa-clear').click();
    if(e==='blur')window.dispatchEvent(new Event('blur'));
    if(e==='hidden'){Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));}
    if(e==='overlay'){const d=document.createElement('dialog');document.body.append(d);d.showModal();}
    if(e==='reinit'){const c=StileLeo.init(root);if(c!==StileLeo.init(root))throw Error('duplicate controller');c.destroy();StileLeo.init(root);}
   },ending);
   await hidden(p);await p.waitForTimeout(300);
   assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);
   assert(await p.evaluate(()=>[...document.querySelectorAll('.sa-leo-visual video')].every(v=>v.paused)));
   await finish(t,'real INSPECT interrupted by '+ending);
  }
  fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({status:'PASS',checks:results,scope:'Actual local integration. Simulated provider only. Safari policy branch emulated in Chrome.'},null,2));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
