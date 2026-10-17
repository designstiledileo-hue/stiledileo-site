// Local WebKit integration, not certification on a physical iPhone.
// Real approved media; disposable photo and mocked provider. Never submits a lead.
const {webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.LEO_QA_BASE||'http://127.0.0.1:8899';
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))throw Error('Local QA only');
const out=process.env.LEO_APPLE_QA_OUTPUT||'/private/tmp/leo-apple-review';fs.mkdirSync(out,{recursive:true});
const visible=()=>{const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h?.querySelector('video');return h&&v&&!v.paused&&v.currentTime>.18&&getComputedStyle(h).opacity==='1'?h.dataset.pose:null;};
(async()=>{
 const b=await webkit.launch({headless:true}),results=[];
 try{
 for(const width of [428,390,375]){
  const height=width===428?926:width===390?844:812;
  const c=await b.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1,recordVideo:{dir:out+'/recordings',size:{width,height}}});
  const p=await c.newPage(),errors=[],requests=[],poses=[];let release,sent=false;
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.url().includes('/motion/'))requests.push(r.url());});
  await c.route('**/*',r=>r.request().url().startsWith(base)||/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(r.request().url())?r.continue():r.fulfill({status:204,body:''}));
  await p.route('**/api/finish-advisor',async r=>{sent=!!r.request().postDataJSON().image;await new Promise(resolve=>release=resolve);await r.fulfill({contentType:'application/json',body:JSON.stringify({reply:'Local test reply: your project details remain editable.',links:[]})}).catch(()=>{});});
  await p.goto(base,{waitUntil:'domcontentloaded'});await p.locator('.sa-launcher').waitFor();await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(4200);await p.screenshot({path:path.join(out,width+'-top.png')});
  let peek=await p.evaluate(visible),stops=[];
  // Browser scroll input is simulated. No forced Leo state, storage or placement.
  for(let n=0;n<90&&!peek;n++){
   const before=await p.evaluate(()=>scrollY);
   await p.evaluate(()=>scrollBy({top:120,behavior:'instant'}));await p.waitForTimeout(650);
   if(await p.locator('.sa-leo-visual:not([hidden])').count())await p.waitForFunction(visible,null,{timeout:5000}).catch(()=>{});
   peek=await p.evaluate(visible);stops.push(await p.evaluate(pose=>({y:scrollY,pose,focus:document.hasFocus(),state:StileLeo.init(document.querySelector('#stile-advisor')).visualState,seen:sessionStorage.getItem('stile_leo_intro_seen'),video:document.querySelector('.sa-leo-visual video')?.currentTime}),peek));
   if(n%10===0)console.log('SCROLL',width,stops.at(-1));
   if(await p.evaluate(()=>scrollY)===before)break;
  }
  fs.writeFileSync(path.join(out,width+'-stops.json'),JSON.stringify(stops,null,2));
  if(!peek)await p.screenshot({path:path.join(out,width+'-no-peek.png')});
  assert.equal(peek,'peek','autonomous PEEK must be visibly playing on real homepage '+width);
  async function capture(state){
   await p.waitForFunction(visible,null,{timeout:5000});
   const info=await p.evaluate(()=>{const h=document.querySelector('.sa-leo-visual:not([hidden])'),v=h.querySelector('video'),r=h.getBoundingClientRect(),c=document.createElement('canvas');c.width=64;c.height=80;const x=c.getContext('2d');x.drawImage(v,0,0,64,80);const d=x.getImageData(0,0,64,80).data;let clear=0,solid=0;for(let i=3;i<d.length;i+=4){if(d[i]<8)clear++;if(d[i]>200)solid++;}return{pose:h.dataset.pose,src:v.getAttribute('src'),clear,solid,y:scrollY,box:r.toJSON(),time:v.currentTime};});
   assert.equal(info.pose,state);assert(info.src.endsWith('.mov'));assert(info.clear>20&&info.solid>20);poses.push(info);
   await p.screenshot({path:path.join(out,width+'-'+state+'.png')});return info;
  }
  await capture('peek');await p.waitForFunction(()=>sessionStorage.getItem('stile_leo_intro_seen')==='true');
  await p.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'));await p.screenshot({path:path.join(out,width+'-hidden.png')});
  await p.locator('.sa-launcher').click();assert(await p.locator('dialog').evaluate(e=>e.open));
  await capture('react');await p.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'));
  const image=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=32;c.getContext('2d').fillRect(0,0,32,32);return c.toDataURL().split(',')[1];});
  await p.locator('#stile-advisor input[type=file]').setInputFiles({name:'disposable-test.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});
  await p.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));
  assert.equal(await p.evaluate(visible),null);await p.locator('#stile-advisor textarea').fill('Local test project');await p.locator('.sa-send').click();
  await p.waitForTimeout(650);assert(sent);const inspect=await p.evaluate(visible);
  if(inspect==='inspect'){await capture('inspect');await p.waitForFunction(()=>document.querySelector('.sa-leo-visual:not([hidden])')?.dataset.pose==='hide');await capture('hide');}
  await p.waitForFunction(()=>!document.querySelector('.sa-leo-visual:not([hidden])'));release();await p.waitForFunction(()=>!document.querySelector('.sa-send').disabled);
  await p.locator('.sa-handoff').click();await p.locator('#estimate-modal.is-open').waitFor();assert.equal(await p.locator('#estimate-form [name=lead_source]').inputValue(),'finish_advisor');assert.equal(await p.locator('#estimate-photo').evaluate(e=>e.files.length),1);
  assert.deepEqual(errors,[]);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const video=await p.video().path();await c.close();fs.copyFileSync(video,path.join(out,'WEBKIT_'+width+'_REVIEW.webm'));
  const row={width,height,stops,poses,requests,inspect:inspect==='inspect'?'VISIBLE':'SAFELY_SUPPRESSED',handoff:'PASS',errors};results.push(row);console.log('PASS WebKit '+width,JSON.stringify({peekY:poses[0].y,inspect:row.inspect}));
  fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({checks:results,nativeIPhone:'NOT_TESTED',provider:'MOCKED'},null,2));
 }
 const c=await b.newContext({viewport:{width:428,height:926},isMobile:true,reducedMotion:'reduce'}),p=await c.newPage(),downloads=[];
 p.on('request',r=>{if(r.url().includes('/images/leo-advisor/'))downloads.push(r.url());});
 await p.goto(base);await p.locator('.sa-launcher').click();await p.waitForTimeout(4500);assert(await p.locator('dialog').evaluate(e=>e.open));assert.equal(downloads.length,0);assert.equal(await p.evaluate(visible),null);await c.close();console.log('PASS reduced motion: functional launcher, no motion downloads');
 fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({status:'PASS',checks:results,reducedMotion:'PASS',nativeIPhone:'NOT_TESTED',provider:'MOCKED'},null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
