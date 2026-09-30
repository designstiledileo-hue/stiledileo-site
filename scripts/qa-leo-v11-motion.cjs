// LOCAL ONLY. Disposable generated test pixels, mocked provider. Never hosted QA.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {PNG}=require(path.resolve(path.dirname(require.resolve(process.env.PLAYWRIGHT_MODULE||'playwright')),'../playwright-core/lib/utilsBundle.js'));
const base=process.env.LEO_QA_BASE||'http://127.0.0.1:8888',out=process.env.LEO_QA_OUTPUT||'/private/tmp/leo-v11-owner-review';fs.mkdirSync(out,{recursive:true});
const testPNG=new PNG({width:32,height:32});for(let i=0;i<testPNG.data.length;i+=4){testPNG.data[i]=130;testPNG.data[i+1]=95;testPNG.data[i+2]=60;testPNG.data[i+3]=255;}
const photo={name:'disposable-qa.png',mimeType:'image/png',buffer:PNG.sync.write(testPNG)};
const fixture='<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles/finish-advisor.css"><style>body{background:#171310;margin:0;min-height:100vh}</style><body><script src="/scripts/finish-advisor.js"></script></body>';
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true}),results=[];
 async function setup(o={}){
  const width=o.width||1440,height=o.height||900;
  const c=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1,reducedMotion:o.reduced?'reduce':'no-preference',...(o.safari?{userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'}:{}),recordVideo:{dir:out+'/recordings',size:{width,height}}});
  const p=await c.newPage(),errors=[],assets=[];let release,sent=false;
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.url().includes('/images/leo-advisor/'))assets.push(r.url());});
  await c.route('**/*',r=>r.request().url().startsWith(base)||/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(r.request().url())||r.request().url().startsWith('data:')?r.continue():r.fulfill({status:204,body:''}));
  await p.route('**/__v11-empty',r=>r.fulfill({contentType:'text/html',body:fixture}));
  if(o.failure)await p.route('**/images/leo-advisor/**',r=>r.abort());
  if(o.autoplay)await p.addInitScript(()=>{HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('QA autoplay denied','NotAllowedError'));});
  if(o.delayMedia)await p.route('**/images/leo-advisor/motion/**',async r=>{await new Promise(resolve=>setTimeout(resolve,r.request().url().endsWith('leo-peek.webm')?3500:1500));await r.continue().catch(()=>{});});
  await p.route('**/api/finish-advisor',async r=>{sent=!!r.request().postDataJSON().image;await new Promise(resolve=>release=resolve);await r.fulfill({contentType:'application/json',body:JSON.stringify({reply:'Local mock: review the sample finish direction with the owner.',links:[]})}).catch(()=>{});});
  await p.addInitScript(()=>{window.qaPoses=[];window.qaShifts=[];new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)qaShifts.push({value:e.value,nodes:e.sources.map(s=>s.node?.className||'')});}).observe({type:'layout-shift'});document.addEventListener('DOMContentLoaded',()=>new MutationObserver(()=>{const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h?.querySelector('video');const pose=h&&getComputedStyle(h).opacity==='1'&&v&&!v.paused&&v.getAttribute('src')?.endsWith('/leo-'+h.dataset.pose+'.webm')?h.dataset.pose:'hidden';if(qaPoses.at(-1)?.pose!==pose)qaPoses.push({pose,time:performance.now()});}).observe(document.body,{subtree:true,attributes:true,childList:true}));});
  await p.goto(base+(o.fixture?'/__v11-empty':'/'),{waitUntil:'domcontentloaded'});await p.locator('.sa-launcher').waitFor();await p.waitForFunction(()=>!!window.StileLeo);
  return{c,p,errors,assets,release:()=>release?.(),sent:()=>sent};
 }
 const hidden=p=>p.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'));
 const shot=(p,name)=>p.screenshot({path:path.join(out,name+'.png')});
 async function pixels(p,state,label){
  await p.waitForFunction(s=>{const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h?.querySelector('video');return h?.dataset.pose===s&&v?.dataset.alphaVerified==='true'&&!v.paused&&v.currentTime>.35&&getComputedStyle(h).opacity==='1';},state,{timeout:75000});
  const capture=()=>{
   if(!document.querySelector('.sa-leo-visual:not([hidden]) video'))return null;
   const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h.querySelector('video'),hr=h.getBoundingClientRect(),r=v.getBoundingClientRect();
   const c=document.createElement('canvas');c.width=Math.round(r.width);c.height=Math.round(r.height);const x=c.getContext('2d');x.drawImage(v,0,0,c.width,c.height);const d=x.getImageData(0,0,c.width,c.height).data,samples=[];let clear=0;
   for(let y=0;y<c.height;y+=3)for(let x=0;x<c.width;x+=3){let i=(y*c.width+x)*4;if(d[i+3]<8)clear++;if(d[i+3]>245&&r.left+x>hr.left&&r.left+x<hr.right&&r.top+y>hr.top&&r.top+y<hr.bottom-14)samples.push([Math.round(r.left+x),Math.round(r.top+y),d[i],d[i+1],d[i+2]]);}
   const panel=document.querySelector('#stile-advisor dialog'),inside=innerWidth<768&&panel.open;
   const skip=e=>h===e||h.contains(e)||(!inside&&e.closest('.sa-launcher')&&innerWidth>=768)||e.matches('header.hero .hero-desktop-video')||(inside&&(e===panel||!panel.contains(e)))||!e.getClientRects().length||getComputedStyle(e).visibility==='hidden';
   const overlap=r=>r.width>0&&r.height>0&&r.right>hr.left&&r.left<hr.right&&r.bottom>hr.top&&r.top<hr.bottom;
   const blockers=[...document.querySelectorAll('button,a[href],input,textarea,select,img,video,nav,dialog[open]')].filter(e=>!skip(e)&&overlap(e.getBoundingClientRect())).map(e=>e.tagName+'.'+e.className);
   const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const e=n.parentElement;if(!n.textContent.trim()||!e||skip(e)||e.closest('style,script,noscript'))continue;const r=document.createRange();r.selectNodeContents(n);if([...r.getClientRects()].some(overlap))blockers.push('text:'+n.textContent.trim().slice(0,35));}
   const anchor=document.querySelector('.sa-launcher').getBoundingClientRect();
   const preferred={left:anchor.right-135-16,top:anchor.top-174-8};
   const nearbySections=[...document.querySelectorAll('section')].filter(e=>overlap(e.getBoundingClientRect())).map(e=>({id:e.id,heading:e.querySelector('h2,h3')?.textContent.trim()}));
   return{samples,clear,box:hr.toJSON(),blockers,muted:v.muted,inline:v.playsInline,scrollY,nearbySections,
    alternatePlacement:!inside&&innerWidth<768?(Math.abs(hr.left-preferred.left)>.1||Math.abs(hr.top-preferred.top)>.1):null};
  };
  const probe=await p.evaluate(capture);
  assert(probe.clear>20);assert(probe.samples.length>250);assert(probe.muted&&probe.inline);assert.deepEqual(probe.blockers,[]);
  const img=PNG.sync.read(await shot(p,label)),after=await p.evaluate(capture);
  // Screenshot capture and decoded sampling are not atomic. Bracket the screenshot
  // with real frames instead of pausing playback or weakening the pixel threshold.
  const ratios=[probe,after].filter(Boolean).map(q=>{let matches=0;for(const[x,y,r,g,b]of q.samples){const i=(y*img.width+x)*4;if((Math.abs(img.data[i]-r)+Math.abs(img.data[i+1]-g)+Math.abs(img.data[i+2]-b))/3<40)matches++;}return matches/q.samples.length;});
  const match=Math.max(...ratios);assert(match>.55,'actual rendered pixels '+match);delete probe.samples;fs.writeFileSync(path.join(out,label+'.json'),JSON.stringify({...probe,renderedPixelMatch:match},null,2));console.log('VISIBLE',label,match);
 }
 async function done(t,label,movie){t.release();assert.deepEqual(t.errors,[]);assert.equal(await t.p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert((await t.p.evaluate(()=>qaShifts)).every(s=>s.nodes.every(n=>!String(n).includes('sa-leo'))));const video=await t.p.video().path();await t.c.close();if(movie)fs.copyFileSync(video,path.join(out,movie+'.webm'));results.push(label);console.log('PASS',label);}
 try{
  let t,p;
  if(process.env.LEO_QA_DEFERRED_ONLY){
   for(const [width,height,target]of [[375,812,5920],[390,844,6160]]){
    t=await setup({width,height});p=t.p;await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(3800);
    assert.equal(await p.evaluate(()=>scrollY),0);assert.equal(await p.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),null);assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);await shot(p,'deferred-'+width+'-initial-suppressed');
    await p.mouse.move(width/2,height/2);
    const stops=[];
    // Real input scrolling on the unchanged homepage, not a fixture or forced pose.
    // Five ordinary browsing pauses, then the first safe region found by geometry QA.
    for(const stop of [960,1920,2880,3840,4800,target]){
     let y=await p.evaluate(()=>scrollY);
     while(y<stop){await p.mouse.wheel(0,Math.min(80,stop-y));await p.waitForTimeout(70);y=await p.evaluate(()=>scrollY);}
     await p.waitForTimeout(650);stops.push({scrollY:await p.evaluate(()=>scrollY),visible:await p.locator('.sa-leo-visual:not([hidden])').count()>0});
     if(stops.at(-1).visible)break;
    }
    await pixels(p,'peek','deferred-'+width+'-peek');await p.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true');await hidden(p);await shot(p,'deferred-'+width+'-hidden');
    await p.mouse.wheel(0,160);await p.waitForTimeout(6000);assert.equal(await p.evaluate(()=>qaPoses.filter(x=>x.pose==='peek').length),1);assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);
    await p.locator('.sa-launcher').click();assert(await p.locator('dialog').evaluate(e=>e.open));await pixels(p,'react','deferred-'+width+'-react');await hidden(p);await shot(p,'deferred-'+width+'-final');
    fs.writeFileSync(path.join(out,'deferred-'+width+'-sequence.json'),JSON.stringify({stops,poses:await p.evaluate(()=>qaPoses),forcedState:false,fixture:false},null,2));
    await done(t,'real homepage '+width+' suppression → settled browsing → visible autonomous PEEK → hidden → independent REACT','MOBILE_'+width+'_DEFERRED_OWNER_REVIEW');
   }
   t=await setup({width:1440,height:1000});p=t.p;await pixels(p,'peek','desktop-1000-peek');assert.equal(await p.evaluate(()=>scrollY),0);await hidden(p);await done(t,'1440×1000 untouched homepage first PEEK unchanged','DESKTOP_1000_REGRESSION');
   fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({status:'PASS',checks:results,nativeIPhoneSafari:'UNVERIFIED',scope:'local real homepage; actual scroll input and rendered pixels, no forced poses'},null,2));return;
  }
  if(!process.env.LEO_QA_RACES_ONLY){
  t=await setup();p=t.p;await shot(p,'desktop-initial');await pixels(p,'peek','desktop-peek');assert.equal(await p.evaluate(()=>scrollY),0);await p.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true');await hidden(p);await shot(p,'desktop-hidden');
  // Real-time idle return, not a forced state or clock jump, in the owner recording.
  await pixels(p,'peek','desktop-idle-return');await p.waitForFunction(()=>sessionStorage.getItem('stile_leo_idle_seen')==='true');await hidden(p);
  await p.locator('.sa-launcher').click();assert(await p.locator('dialog').evaluate(e=>e.open));await pixels(p,'react','desktop-react');await hidden(p);
  await p.locator('#stile-advisor input[type=file]').setInputFiles(photo);await p.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);
  await p.locator('#stile-advisor textarea').fill('Disposable local QA swatch');await p.locator('.sa-send').click();await pixels(p,'inspect','desktop-inspect');assert(t.sent());await pixels(p,'hide','desktop-hide');await hidden(p);t.release();await p.waitForFunction(()=>!document.querySelector('.sa-send').disabled);await shot(p,'desktop-complete');await done(t,'desktop actual first/idle/REACT/dispatch INSPECT/HIDE, transparency and no collision','DESKTOP_OWNER_REVIEW');
  for(const [width,height]of [[375,812],[390,844]]){
   t=await setup({width,height});p=t.p;await p.waitForTimeout(3500);await shot(p,'mobile-'+width+'-home');
   // Dense homepage content may safely suppress PEEK. Opening never waits for it.
   await p.locator('.sa-launcher').click();assert(await p.locator('dialog').evaluate(e=>e.open));await pixels(p,'react','mobile-'+width+'-react');await hidden(p);
   await p.locator('#stile-advisor input[type=file]').setInputFiles(photo);await p.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));await p.locator('#stile-advisor textarea').fill('Disposable QA');await p.locator('.sa-send').click();await p.waitForTimeout(500);assert(t.sent());await shot(p,'mobile-'+width+'-photo');t.release();await p.waitForFunction(()=>!document.querySelector('.sa-send').disabled);await p.keyboard.press('Escape');await hidden(p);await done(t,'Chrome mobile '+width+' actual transparent REACT; dense content/photo safely protected','MOBILE_'+width+'_OWNER_REVIEW');
   t=await setup({width,height,fixture:true});p=t.p;await pixels(p,'peek','mobile-'+width+'-safe-peek');await p.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true');await hidden(p);await done(t,'Chrome mobile '+width+' autonomous actual alpha pixels in safe placement','MOBILE_'+width+'_SAFE_PLACEMENT');
  }
  for(const mode of ['reduced','safari','failure','autoplay']){
   t=await setup({[mode]:true,width:390,height:844,fixture:true});p=t.p;await p.waitForTimeout(mode==='autoplay'?12000:4500);await p.locator('.sa-launcher').click();await p.waitForTimeout(1800);assert(await p.locator('dialog').evaluate(e=>e.open));assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);assert.equal(await p.evaluate(()=>sessionStorage.getItem('stile_leo_intro_seen')),null);if(['reduced','safari'].includes(mode))assert.equal(t.assets.length,0);await shot(p,'fallback-'+mode);await done(t,mode+' static launcher, no opaque media/no consumed PEEK (Safari UA only)');
  }
  }
  t=await setup({fixture:true});p=t.p;await p.locator('.sa-launcher').click();await pixels(p,'react','close-race-react');await hidden(p);
  await p.locator('#stile-advisor input[type=file]').setInputFiles(photo);await p.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));await p.locator('#stile-advisor textarea').fill('Disposable close race');await p.locator('.sa-send').click();await pixels(p,'inspect','close-race-inspect');await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').evaluate(e=>e.open),false);await hidden(p);t.release();await p.waitForTimeout(1500);assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);await done(t,'actual photo dispatch then close cancels INSPECT; late response cannot resurrect it');
  t=await setup({fixture:true});p=t.p;await pixels(p,'peek','running-race-peek');await p.locator('.sa-launcher').click();assert(await p.locator('dialog').evaluate(e=>e.open));await pixels(p,'react','running-race-react');await p.keyboard.press('Escape');await p.locator('.sa-launcher').click();await p.waitForTimeout(1500);assert(await p.locator('dialog').evaluate(e=>e.open));assert.equal(await p.locator('.sa-leo-visual').count(),1);assert.equal(await p.locator('.sa-leo-visual:not([hidden])').count(),0);await done(t,'visible running PEEK preempted by REACT; rapid reopen cancels HIDE without cooldown replay');
  for(const event of ['open','hidden','reinit']){
   t=await setup({delayMedia:true,fixture:true});p=t.p;await p.waitForFunction(()=>StileLeo.init(document.querySelector('#stile-advisor')).visualState==='PEEK');
   if(event==='open'){await p.locator('.sa-launcher').click();await pixels(p,'react','race-react');}
   if(event==='hidden')await p.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
   if(event==='reinit')await p.evaluate(()=>{const root=document.querySelector('#stile-advisor');StileLeo.init(root).destroy();StileLeo.init(root);root.querySelector('.sa-launcher').click();});
   await p.waitForTimeout(4500);assert((await p.locator('.sa-leo-visual').count())<=1);await hidden(p);await done(t,'real media load/animation race '+event);
  }
  fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({status:'PASS',checks:results,nativeIPhoneSafari:'UNVERIFIED',scope:'LOCAL; actual Chrome alpha/pixel checks, disposable image, mocked provider only'},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
