// LOCAL ONLY: actual WebKit runtime/media in an explicitly isolated safe fixture.
// Browser failure/viewport conditions are simulated; no forced Leo states or API calls.
const {webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.LEO_QA_BASE||'http://127.0.0.1:8899';
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))throw Error('Local QA only');
const out=process.env.LEO_RESILIENCE_OUTPUT||'/private/tmp/leo-resilience-review';
fs.mkdirSync(out,{recursive:true});
const fixture='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles/finish-advisor.css"><style>body{margin:0;min-height:4000px;background:#171310}#qa-obstacle{position:fixed;inset:0;width:100vw;height:100vh;z-index:80}</style></head><body><script src="/scripts/finish-advisor.js"></script></body></html>';
const visible=()=>{
 const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h?.querySelector('video');
 return h&&v&&v.dataset.alphaVerified==='true'&&!v.paused&&v.currentTime>.2&&getComputedStyle(h).opacity==='1';
};
const first=()=>sessionStorage.getItem('stile_leo_intro_seen');
(async()=>{
 const browser=await webkit.launch({headless:true}),checks=[];
 let current='setup';
 const save=(status,extra={})=>fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({status,scope:'isolated local safe fixture; actual WebKit media; browser failures and viewport simulated',nativeIPhone:'NOT_TESTED',checks,...extra},null,2));
 async function run(name,options,test){
  current=name;const context=await browser.newContext({viewport:{width:428,height:926},isMobile:true,hasTouch:true,deviceScaleFactor:1,reducedMotion:options.reduced?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[],requests=[];let providerRequests=0;
  page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/images/leo-advisor/'))requests.push(r.url());});
  await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.fulfill({status:204,body:''}));
  await page.route('**/api/finish-advisor',r=>{providerRequests++;return r.fulfill({status:503,body:'Unexpected provider call during visual-only QA'});});
  await page.route('**/__leo-resilience',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:fixture}));
  if(options.init)await page.addInitScript(options.init);
  if(options.before)await options.before(page);
  const capture=async(label,screenshot=true)=>{
   await page.waitForFunction(visible,null,{timeout:10000});
   const info=await page.evaluate(()=>{
    const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h.querySelector('video'),c=document.createElement('canvas');c.width=c.height=64;
    const x=c.getContext('2d');x.drawImage(v,0,0,64,64);const d=x.getImageData(0,0,64,64).data;let clear=0,solid=0;
    for(let i=3;i<d.length;i+=4){if(d[i]<8)clear++;if(d[i]>200)solid++;}
    return{pose:h.dataset.pose,src:v.getAttribute('src'),time:v.currentTime,clear,solid,box:h.getBoundingClientRect().toJSON(),seen:sessionStorage.getItem('stile_leo_intro_seen')};
   });
   assert(info.clear>20&&info.solid>20,'decoded frame must contain both transparent pixels and Leo');
   if(screenshot)await page.screenshot({path:path.join(out,label+'.png')});return info;
  };
  try{
   await page.goto(base+'/__leo-resilience',{waitUntil:'domcontentloaded'});await page.locator('.sa-launcher').waitFor();await page.waitForFunction(()=>!!window.StileLeo);
   const evidence=await test({page,context,requests,capture});
   assert.deepEqual(errors,[]);assert.equal(providerRequests,0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   checks.push({name,status:'PASS',...evidence});save('RUNNING');console.log('PASS '+name);
  }finally{await context.close();}
 }
 try{
  await run('missing video-frame callback still plays real transparent motion',{
   init:()=>{Object.defineProperty(HTMLVideoElement.prototype,'requestVideoFrameCallback',{configurable:true,value:undefined});Object.defineProperty(HTMLVideoElement.prototype,'cancelVideoFrameCallback',{configurable:true,value:undefined});}
  },async({page,capture})=>{
   assert.equal(await page.evaluate(()=>typeof document.createElement('video').requestVideoFrameCallback),'undefined');
   const frame=await capture('no-frame-callback');await page.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true',null,{timeout:5000});return{frame};
  });
  await run('initial reduced motion can become eligible without reload',{reduced:true},async({page,requests,capture})=>{
   await page.waitForTimeout(4300);assert.equal(requests.length,0);assert.equal(await page.evaluate(first),null);assert.equal(await page.locator('.sa-leo-visual:not([hidden])').count(),0);
   await page.emulateMedia({reducedMotion:'no-preference'});const frame=await capture('reduced-to-motion');await page.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true',null,{timeout:5000});return{frame,mediaRequests:requests.length};
  });
  let allowMedia=false,failed=0,mediaAttempts=0;
  await run('transient media failure does not poison subsequent real playback',{
   before:page=>page.route('**/images/leo-advisor/motion/leo-peek.*',r=>{mediaAttempts++;if(!allowMedia){failed++;return r.abort('failed');}return r.continue();})
  },async({page,capture})=>{
   const deadline=Date.now()+8000;while(!failed&&Date.now()<deadline)await page.waitForTimeout(100);assert(failed>0,'must encounter a real failed media request');
   await page.waitForTimeout(500);assert.equal(await page.evaluate(first),null);allowMedia=true;
   const frame=await capture('transient-media-recovered');await page.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true',null,{timeout:5000});assert(mediaAttempts>failed);return{failedRequests:failed,mediaAttempts,frame};
  });
  await run('denied autoplay leaves first PEEK unseen and Advisor usable',{
   init:()=>{HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Simulated browser autoplay denial','NotAllowedError'));}
  },async({page,requests})=>{
   await page.waitForTimeout(5000);assert(requests.length>0);assert.equal(await page.evaluate(first),null);assert.equal(await page.locator('.sa-leo-visual:not([hidden])').count(),0);
   await page.locator('.sa-launcher').click();assert(await page.locator('dialog').evaluate(e=>e.open));await page.waitForTimeout(500);assert.equal(await page.evaluate(first),null);return{mediaRequests:requests.length};
  });
  await run('visual viewport shrink removes an out-of-bounds actor',{
   init:()=>{window.qaVisualHeight=926;Object.defineProperty(window.visualViewport,'height',{configurable:true,get:()=>window.qaVisualHeight});}
  },async({page,capture})=>{
   const frame=await capture('before-visual-viewport-shrink',false);assert.equal(frame.seen,null);
   await page.evaluate(()=>{window.qaVisualHeight=500;visualViewport.dispatchEvent(new Event('resize'));});
   await page.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'),null,{timeout:1000});assert.equal(await page.evaluate(first),null);return{frame,simulatedVisibleHeight:500,layoutHeight:await page.evaluate(()=>innerHeight)};
  });
  await run('brief interrupted introduction remains eligible for a settled-scroll retry',{
   before:page=>page.route('**/__leo-resilience',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:fixture.replace('<body>','<body><button id="qa-obstacle">Protected foreground fixture</button>')}))
  },async({page,capture})=>{
   await page.waitForTimeout(4300);assert.equal(await page.locator('.sa-leo-visual:not([hidden])').count(),0);assert.equal(await page.evaluate(first),null);
   await page.locator('#qa-obstacle').evaluate(e=>e.remove());await page.evaluate(()=>scrollTo({top:100,behavior:'instant'}));
   const interrupted=await capture('brief-introduction',false);assert.equal(interrupted.seen,null);
   await page.evaluate(()=>{const e=document.createElement('button');e.id='qa-obstacle';e.textContent='Protected foreground fixture';document.body.append(e);});
   await page.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'),null,{timeout:1000});assert.equal(await page.evaluate(first),null);
   await page.locator('#qa-obstacle').evaluate(e=>e.remove());await page.evaluate(()=>scrollTo({top:240,behavior:'instant'}));
   const retry=await capture('retry-after-brief-introduction');await page.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true',null,{timeout:5000});return{interrupted,retry};
  });
  save('PASS');
 }catch(error){save('FAIL',{failedCheck:current,error:error.message});throw error;}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
