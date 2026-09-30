// Deterministic lifecycle QA. Frame acknowledgement is instrumented here;
// the real-media suite separately verifies decoded alpha and screenshot pixels.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.LEO_QA_BASE||'http://127.0.0.1:8888',source=fs.readFileSync(path.join(__dirname,'leo-interaction.js'),'utf8');
const fixture=`<!doctype html><link rel="stylesheet" href="/styles/finish-advisor.css"><style>body{margin:0;background:#171310;min-height:100vh}</style><textarea id="outside"></textarea><script src="/scripts/finish-advisor.js"></script>`;
const install=`window.calls=[];window.callbacks=[];window.events=[];window.StileAnalytics={track:x=>events.push(x)};let timers=[];
const show=kind=>(host,continuing,done,shown)=>{calls.push({kind,time:Date.now()});callbacks.push({kind,done,shown});if(!window.defer)timers.push(setTimeout(shown,20),setTimeout(done,1000));return !window.reject;};
window.adapter={ready:true,completionDriven:true,motionGeometry:true,showPeek:show('PEEK'),showReact:show('REACT'),showInspect:show('INSPECT'),showHide:show('HIDE'),hide(){timers.forEach(clearTimeout);timers=[];},destroy(){this.hide();}};
window.controller=StileLeo.init(document.querySelector('#stile-advisor'),adapter);`;
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true}),results=[];
 async function setup(o={}){
  const c=await b.newContext({viewport:{width:o.width||1440,height:o.height||900},reducedMotion:o.reduced?'reduce':'no-preference'});
  if(o.storage)await c.addInitScript(()=>{Storage.prototype.getItem=Storage.prototype.setItem=()=>{throw Error('storage blocked')};});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/__v11*',r=>r.fulfill({contentType:'text/html',body:fixture}));
  await p.route('**/scripts/leo-interaction.js',r=>r.fulfill({contentType:'text/javascript',body:source.replace('function placement(kind, retainPosition = false) {','function placement(kind, retainPosition = false) { window.placementChecks=(window.placementChecks||0)+1;')+install}));
  await p.clock.install();await p.clock.pauseAt(new Date(Date.now()+1000));await p.goto(base+'/__v11');await p.waitForFunction(()=>!!window.controller);
  return{c,p,errors,count:k=>p.evaluate(k=>calls.filter(x=>x.kind===k).length,k)};
 }
 const run=(t,ms)=>t.p.clock.runFor(ms);
 const open=t=>t.p.evaluate(()=>{document.querySelector('.sa-launcher').click();return document.querySelector('dialog').open;});
 const close=t=>t.p.keyboard.press('Escape');
 const marker=(t,key='stile_leo_intro_seen')=>t.p.evaluate(k=>sessionStorage.getItem(k),key);
 async function done(t,label){assert.deepEqual(t.errors,[]);await t.c.close();results.push(label);console.log('PASS '+label);}
 try{
  let t=await setup();await run(t,2999);assert.equal(await t.count('PEEK'),0);await run(t,1);assert.equal(await t.count('PEEK'),1);assert.equal(await marker(t),null);await run(t,21);assert.equal(await marker(t),'true');
  await run(t,61000);assert.equal(await t.count('PEEK'),2);assert.equal(await marker(t,'stile_leo_idle_seen'),'true');await run(t,240000);assert.equal(await t.count('PEEK'),2);
  for(const url of ['/__v11-next','/__v11']){await t.p.goto(base+url);await t.p.waitForFunction(()=>!!window.controller);await run(t,120000);assert.equal(await t.count('PEEK'),0);}await t.p.reload();await t.p.waitForFunction(()=>!!window.controller);await run(t,120000);assert.equal(await t.count('PEEK'),0);await done(t,'3s first + one 60s idle; reload/navigation/home retain both flags');
  t=await setup();await run(t,3021);assert.equal(await t.count('PEEK'),1);await done(t,'independent new tab context eligible');
  t=await setup();await open(t);await run(t,1020);await close(t);await run(t,59000);assert.equal(await t.count('PEEK'),0);await run(t,1021);assert.equal(await marker(t,'stile_leo_idle_seen'),'true');await done(t,'close resets idle deadline');
  t=await setup();await open(t);await run(t,71000);assert.equal(await t.count('PEEK'),0);await close(t);await run(t,61021);assert.equal(await marker(t,'stile_leo_idle_seen'),'true');await done(t,'no idle inside open Advisor; fresh interaction resets bounded retry');
  t=await setup();await open(t);await run(t,30);await close(t);await open(t);assert.equal(await t.count('REACT'),1);await run(t,24969);await close(t);await open(t);assert.equal(await t.count('REACT'),1);await run(t,1);await close(t);await open(t);assert.equal(await t.count('REACT'),2);assert.equal(await t.p.locator('.sa-leo-visual').count(),1);await done(t,'exact 25s cooldown and rapid open-close-open');
  t=await setup();await t.p.locator('.sa-launcher').hover();assert.equal(await t.count('REACT'),0);await done(t,'hover never plays REACT');
  for(const event of ['open','close-inspect','hidden','destroy','reinit']){
   t=await setup();await t.p.evaluate(()=>window.defer=true);
   if(event==='close-inspect'){await open(t);await t.p.evaluate(()=>document.querySelector('#stile-advisor').dispatchEvent(new CustomEvent('stile:advisor-visual',{detail:'photo-sent'})));}else await run(t,3001);
   await t.p.evaluate(()=>window.stale=callbacks.at(-1));
   if(event==='open')await open(t);
   if(event==='close-inspect')await close(t);
   if(event==='hidden')await t.p.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
   if(event==='destroy'||event==='reinit')await t.p.evaluate(reinit=>{controller.destroy();if(reinit)controller=StileLeo.init(document.querySelector('#stile-advisor'),adapter);},event==='reinit');
   const before=await t.p.evaluate(()=>controller.visualState);await t.p.evaluate(()=>{stale.shown();stale.done();});assert.equal(await t.p.evaluate(()=>controller.visualState),before);assert.equal(await marker(t),null);assert((await t.p.locator('.sa-leo-visual:not([hidden])').count())<=1);await done(t,'stale shown/done ignored after '+event);
  }
  t=await setup();await t.p.evaluate(()=>{window.reject=true;window.defer=true;});await run(t,120000);assert.equal(await t.count('PEEK'),3);assert.equal(await marker(t),null);await done(t,'three failed attempts maximum, no session consumption');
  t=await setup();await t.p.evaluate(()=>{const e=document.createElement('button');e.id='block';e.textContent='Protected';Object.assign(e.style,{position:'fixed',inset:0,width:'100vw',height:'100vh'});document.body.append(e);});await run(t,3100);assert.equal(await t.count('PEEK'),0);assert.equal(await marker(t),null);await t.p.locator('#block').evaluate(e=>e.remove());await run(t,4021);assert.equal(await marker(t),'true');await done(t,'unsafe placement not consumed; bounded safe retry');
  for(const opt of [{storage:true},{reduced:true}]){t=await setup(opt);await run(t,120000);assert.equal(await t.count('PEEK'),0);assert(await open(t));await done(t,'functional launcher with '+Object.keys(opt)[0]);}
  t=await setup();assert(await t.p.evaluate(()=>StileLeo.init(document.querySelector('#stile-advisor'))===controller));await t.p.addScriptTag({content:source});await run(t,3021);assert.equal(await t.count('PEEK'),1);assert.equal(await t.p.locator('.sa-leo-visual').count(),1);await done(t,'idempotent controller/repeated script');
  for(const width of [375,390]){t=await setup({width});await run(t,3021);assert.equal(await marker(t),'true');assert.equal(await t.p.locator('.sa-leo-visual').evaluate(e=>e.getBoundingClientRect().width),135);assert(await open(t));await done(t,'compact mobile eligibility '+width);}
  const block=t=>t.p.evaluate(()=>{document.body.style.minHeight='10000px';const e=document.createElement('button');e.id='block';Object.assign(e.style,{position:'fixed',inset:0,width:'100vw',height:'100vh'});document.body.append(e);});
  const scroll=async(t,y)=>{await t.p.evaluate(y=>{window.scrollTo({top:y,behavior:'instant'});window.dispatchEvent(new Event('scroll'));},y);};
  for(const width of [375,390]){
   t=await setup({width,height:width===375?812:844});await block(t);await run(t,3100);assert.equal(await marker(t),null);const checks=await t.p.evaluate(()=>placementChecks);
   await run(t,12000);assert.equal(await t.p.evaluate(()=>placementChecks),checks);assert.equal(await t.count('PEEK'),0);
   await t.p.locator('#block').evaluate(e=>e.remove());await scroll(t,30);await run(t,400);assert.equal(await t.count('PEEK'),0);
   await scroll(t,80);await run(t,200);await scroll(t,120);await run(t,319);assert.equal(await t.count('PEEK'),0);await run(t,1);assert.equal(await t.count('PEEK'),1);assert.equal(await marker(t),null);await run(t,21);assert.equal(await marker(t),'true');
   await run(t,1100);await scroll(t,240);await run(t,5000);assert.equal(await t.count('PEEK'),1);assert(await open(t));assert.equal(await t.count('REACT'),1);await done(t,'mobile '+width+' deferred 320ms settled scroll, no timed retry, visible-frame gate, once-only first and independent REACT');
  }
  t=await setup({width:390});await block(t);await run(t,3100);
  for(let i=1;i<=6;i++){await scroll(t,i*100);await run(t,400);}
  const capped=await t.p.evaluate(()=>placementChecks);await t.p.locator('#block').evaluate(e=>e.remove());await scroll(t,900);await run(t,15000);assert.equal(await t.p.evaluate(()=>placementChecks),capped);assert.equal(await marker(t),null);await done(t,'six settled states maximum; exhausted opportunity never polls or consumes session');
  for(const event of ['open','photo','hidden','pagehide','reduced','destroy','reinit']){
   t=await setup({width:390});await block(t);await run(t,3100);await t.p.locator('#block').evaluate(e=>e.remove());await scroll(t,120);await run(t,200);
   if(event==='open')assert(await open(t));
   if(event==='photo')await t.p.evaluate(()=>document.querySelector('#stile-advisor').dispatchEvent(new CustomEvent('stile:advisor-visual',{detail:'photo-sent'})));
   if(event==='hidden')await t.p.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
   if(event==='pagehide')await t.p.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
   if(event==='reduced')await t.p.emulateMedia({reducedMotion:'reduce'});
   if(event==='destroy'||event==='reinit')await t.p.evaluate(reinit=>{controller.destroy();if(reinit)controller=StileLeo.init(document.querySelector('#stile-advisor'),adapter);},event==='reinit');
   await run(t,500);assert.equal(await t.count('PEEK'),0);assert.equal(await marker(t),null);await done(t,'pending deferred callback cancelled by '+event);
  }
  t=await setup({width:390});await block(t);await run(t,3100);await t.p.locator('#block').evaluate(e=>e.remove());await t.p.evaluate(()=>{window.reject=true;window.defer=true;});await scroll(t,120);await run(t,500);assert.equal(await t.count('PEEK'),1);await scroll(t,300);await run(t,12000);assert.equal(await t.count('PEEK'),1);assert.equal(await marker(t),null);await done(t,'failed deferred media never consumes first or retries on stale scroll');
  fs.writeFileSync(process.env.LEO_CONTROLLER_OUTPUT||'/private/tmp/leo-v11-controller-qa.json',JSON.stringify({status:'PASS',scope:'instrumented frame acknowledgement; separate real-media QA required',checks:results},null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
