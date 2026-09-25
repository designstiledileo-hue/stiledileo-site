// Real integrated local site. Provider and lead network remain simulated.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {PNG}=require(path.resolve(path.dirname(require.resolve(process.env.PLAYWRIGHT_MODULE||'playwright')),'../playwright-core/lib/utilsBundle.js'));
const base='http://127.0.0.1:8888';
const out=process.env.LEO_QA_OUTPUT||'/private/tmp/leo-motion-final-review';
const photo=path.resolve(__dirname,'../images/projects/white-rock-range-hood/stile-di-leo-white-rock-plaster-range-hood-after-hero-01.jpg');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 async function setup(options={}) {
  const context=await browser.newContext({viewport:{width:options.width||1440,height:options.height||900},deviceScaleFactor:1,
   reducedMotion:options.reduced?'reduce':'no-preference',
   ...(options.safari?{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Safari/605.1.15'}:{}),
   ...(options.record?{recordVideo:{dir:out+'/recording',size:{width:1440,height:options.height||900}}}:{})});
  const page=await context.newPage(),errors=[],assets=[];let sent=false,release;
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/images/leo-advisor/'))assets.push(r.url());});
  await context.route('**/*',r=>r.request().url().startsWith(base)||r.request().url().startsWith('data:')||/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(r.request().url())?r.continue():r.fulfill({status:204,body:''}));
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
  await page.goto(base+(options.page||'/'));await page.locator('.sa-launcher').waitFor();
  await page.waitForFunction(()=>!!window.StileLeo);
  await page.evaluate(top=>{window.gtag=(...args)=>leoQAEvents.push(args);if(!top){document.documentElement.style.scrollBehavior='auto';scrollTo(0,document.body.scrollHeight);}},!!options.top);
  return {context,page,errors,assets,sent:()=>sent,release:()=>release?.()};
 }
 const hidden=p=>p.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'));
 const motion=(p,state)=>p.waitForFunction(s=>{const h=document.querySelector('.sa-leo-visual:not([hidden])');const v=h?.querySelector('video');return h?.dataset.pose===s&&h.dataset.renderer==='motion'&&v?.dataset.alphaVerified==='true'&&!v.paused&&v.currentTime>.1;},state);
 const shot=(p,name)=>p.screenshot({path:path.join(out,name+'.png')});
 async function visiblePixels(p,state,label) {
  await motion(p,state);await p.waitForTimeout(350);
  const probe=await p.evaluate(()=>{
   const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h.querySelector('video'),r=v.getBoundingClientRect(),hr=h.getBoundingClientRect();
   const canvas=document.createElement('canvas');canvas.width=Math.round(r.width);canvas.height=Math.round(r.height);
   const ctx=canvas.getContext('2d');ctx.drawImage(v,0,0,canvas.width,canvas.height);const bytes=ctx.getImageData(0,0,canvas.width,canvas.height).data,samples=[];
   for(let y=0;y<canvas.height;y+=3)for(let x=0;x<canvas.width;x+=3){const i=(y*canvas.width+x)*4,px=Math.round(r.left+x),py=Math.round(r.top+y);if(bytes[i+3]>245&&px>hr.left&&px<hr.right&&py>hr.top&&py<hr.bottom-14)samples.push([px,py,bytes[i],bytes[i+1],bytes[i+2]]);}
   const excluded=e=>h.contains(e)||e===h||e.closest('.sa-launcher')||e.matches('header.hero .hero-desktop-video');
   const overlaps=r=>r.width&&r.height&&r.right>hr.left-8&&r.left<hr.right+8&&r.bottom>hr.top-8&&r.top<hr.top+291;
   const blockers=[...document.querySelectorAll('button,a[href],input,textarea,select,img,video,nav,dialog[open],[role="button"],[role="slider"]')].filter(e=>!excluded(e)&&getComputedStyle(e).visibility!=='hidden'&&overlaps(e.getBoundingClientRect())).map(e=>e.tagName+'.'+e.className);
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
   while((node=walker.nextNode())){const e=node.parentElement;if(!node.textContent.trim()||!e||e.closest('script,style,noscript')||excluded(e)||getComputedStyle(e).visibility==='hidden')continue;const range=document.createRange();range.selectNodeContents(node);if([...range.getClientRects()].some(overlaps))blockers.push('text:'+node.textContent.trim().slice(0,50));}
   return{samples,box:hr.toJSON(),scrollY,blockers,opacity:getComputedStyle(h).opacity,popover:h.matches(':popover-open')};
  });
  assert.equal(probe.scrollY,0,'untouched homepage top');assert(probe.box.width>0&&probe.box.height>0);assert.equal(probe.opacity,'1');assert(probe.popover);assert.deepEqual(probe.blockers,[],'foreground is protected');
  const screenshot=PNG.sync.read(await shot(p,label));let matches=0;
  for(const [x,y,r,g,b] of probe.samples){const i=(y*screenshot.width+x)*4;if((Math.abs(screenshot.data[i]-r)+Math.abs(screenshot.data[i+1]-g)+Math.abs(screenshot.data[i+2]-b))/3<35)matches++;}
  assert(probe.samples.length>800,'opaque subject samples');assert(matches/probe.samples.length>.55,'decoded Leo pixels must be present in the rendered screenshot, not merely playing');
  const evidence={box:probe.box,samples:probe.samples.length,renderedPixelMatch:matches/probe.samples.length,blockers:probe.blockers,scrollY:probe.scrollY};
  fs.writeFileSync(path.join(out,label+'.json'),JSON.stringify(evidence,null,2));console.log('VISIBLE '+label+' '+JSON.stringify(evidence));
 }
 async function finish(t,label){assert.deepEqual(t.errors,[]);results.push(label);t.release();await t.context.close();console.log('PASS '+label);}
 try {
  for(const height of [900,1000]){
   const t=await setup({top:true,height,record:true}),p=t.page;
   await shot(p,'top-'+height+'-initial');await visiblePixels(p,'peek','top-'+height+'-peek');await hidden(p);await shot(p,'top-'+height+'-hidden');
   assert.equal(await p.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),'true');
   await p.locator('.sa-launcher').click();assert(await p.locator('#stile-advisor dialog').evaluate(e=>e.open));
   await visiblePixels(p,'react','top-'+height+'-react');await hidden(p);await shot(p,'top-'+height+'-final');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert((await p.evaluate(()=>leoQAShifts)).every(x=>x.sources.every(s=>!String(s).includes('sa-leo'))));
   const movie=await p.video().path();await finish(t,'untouched homepage top '+height+': rendered PEEK/REACT, no foreground overlap, clean hide');
   fs.copyFileSync(movie,path.join(out,'LEO_HOMEPAGE_TOP_'+height+'_OWNER_REVIEW.webm'));
  }
  if(process.env.LEO_QA_TOP_ONLY)return;
  for(const route of ['/marmorino-retail-interiors.html','/plaster-range-hood-vancouver.html','/projects.html']){
   const t=await setup({top:true,page:route}),p=t.page;
   await p.locator('.sa-launcher').click();assert(await p.locator('#stile-advisor dialog').evaluate(e=>e.open));
   await p.locator('#stile-advisor textarea').fill('Local UI check only; not sent.');await p.keyboard.press('Escape');
   assert.equal(await p.locator('#stile-advisor dialog').evaluate(e=>e.open),false);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await finish(t,'commercial page retains immediate Advisor, input, close and no overflow: '+route);
  }
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
