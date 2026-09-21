// Browser QA uses simulated provider replies, never submits a real inquiry.
// PLAYWRIGHT_MODULE can point to an existing Playwright installation.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const base=process.env.ADVISOR_QA_BASE || 'http://localhost:8888';
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base)) throw new Error('Run this mocked integration QA locally only.');
const photo=path.resolve(__dirname,'../images/projects/white-rock-range-hood/stile-di-leo-white-rock-plaster-range-hood-after-hero-01.jpg');
const out=process.env.ADVISOR_QA_OUTPUT || '/private/tmp';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
 for(const width of [375,390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let requests=[],mode='success',delay=150,leadPosts=[];
  await page.route('**/api/finish-advisor',async route=>{
   requests.push(route.request().postDataJSON());
   await new Promise(r=>setTimeout(r,delay));
   if(mode==='error')return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Unavailable'})});
   if(mode==='rate')return route.fulfill({status:429,body:'rate limited'});
   if(mode==='network')return route.abort();
   const reply=mode==='long'?'A restrained finish direction needs preparation review. '.repeat(30):'For this geometry, consider a restrained mineral finish after surface review. What city is the project in? <img src=x onerror="window.qaUnsafe=1">';
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({reply,links:[{label:'Plaster Range Hoods',path:'/plaster-range-hood-vancouver.html'},{label:'Malicious link',path:'https://evil.example'}]})});
  });
  await page.route(base+'/',async route=>{if(route.request().method()==='POST'){leadPosts.push(route.request().postData());return route.fulfill({status:200,body:'accepted test fixture'});}return route.continue();});
  await page.goto(base+'/');await page.locator('#stile-advisor .sa-launcher').waitFor();
  await page.evaluate(()=>{window.qaEvents=[];window.gtag=(...args)=>window.qaEvents.push(args);});
  const widget=page.locator('#stile-advisor'),dialog=widget.locator('dialog'),input=widget.locator('textarea');
  assert(!(await dialog.isVisible()));
  const boxes=await page.evaluate(()=>['#stile-advisor .sa-launcher','#floating-quote'].map(s=>{const b=document.querySelector(s).getBoundingClientRect();return {top:b.top,bottom:b.bottom};}));
  assert(boxes[0].bottom<=boxes[1].top,'Launcher must not obscure photo CTA');
  await widget.locator('.sa-launcher').click();assert(await dialog.isVisible());assert(await input.evaluate(e=>e===document.activeElement));
  for(let n=0;n<18;n++){await page.keyboard.press('Tab');assert(await dialog.evaluate(d=>d.contains(document.activeElement)),'Dialog must contain keyboard focus');}
  await page.keyboard.press('Escape');assert(!(await dialog.isVisible()));assert(await widget.locator('.sa-launcher').evaluate(e=>e===document.activeElement));
  await widget.locator('.sa-launcher').click();await widget.getByRole('button',{name:'Range Hood',exact:true}).click();assert((await input.inputValue()).includes('range hood'));
  await widget.locator('input[type=file]').setInputFiles(photo);await page.waitForFunction(()=>document.querySelector('#stile-advisor .sa-status').textContent.includes('Photo ready'));
  if(width===375){for(const filename of ['../images/favicon.png','../images/projects/marmorino-vancouver-retail/marmorino-retail-wide.webp']){await widget.locator('input[type=file]').setInputFiles(path.resolve(__dirname,filename));await page.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));}await widget.locator('input[type=file]').setInputFiles(photo);await page.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('Photo ready'));}
  const thumb=widget.locator('.sa-photo img');await thumb.evaluate(i=>i.decode());
  await input.fill('My hood is in Burnaby, about 4 feet wide. I prefer quiet mineral movement.');
  await widget.getByRole('button',{name:'Send',exact:true}).click();assert(await widget.getByRole('button',{name:'Thinking…'}).isDisabled());
  await page.waitForFunction(()=>document.querySelectorAll('.sa-message:not(.sa-user)').length===1);
  assert.equal(requests.length,1);assert(requests[0].image.startsWith('data:image/jpeg;base64,'));assert(Buffer.from(requests[0].image.split(',')[1],'base64').length<=1048576);
  assert.equal(await widget.locator('.sa-message img').count(),0);assert.equal(await widget.locator('a[href="https://evil.example"]').count(),0);assert(!(await page.evaluate(()=>window.qaUnsafe)));
  const stored=await page.evaluate(()=>sessionStorage.getItem('stile_advisor_session_v1'));assert(!stored.includes('data:image'));assert(!stored.includes('base64'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  await dialog.screenshot({path:path.join(out,`finish-advisor-${width}.png`)});
  assert.equal(leadPosts.length,0);await widget.getByRole('button',{name:'Request a project review'}).click();
  assert(await page.locator('#estimate-modal.is-open').isVisible());
  assert.equal(await page.locator('#estimate-form [name=lead_source]').inputValue(),'finish_advisor');
  const note=await page.locator('#estimate-details').inputValue();assert(note.includes('Burnaby'));assert(!note.includes('For this geometry'));assert.equal(await page.locator('#estimate-photo').evaluate(e=>e.files.length),1);
  assert.equal(leadPosts.length,0);assert(!(await page.evaluate(()=>window.qaEvents.some(e=>e[1]==='generate_lead'))));
  await page.locator('#estimate-form [data-next]').click();await page.locator('#estimate-email').fill('qa@example.invalid');
  await page.locator('#estimate-details').fill(note+'\nVisitor can edit these notes.');await page.locator('#estimate-form button[type=submit]').click();
  await page.locator('#estimate-success:visible').waitFor();assert.equal(leadPosts.length,1);assert(leadPosts[0].includes('finish_advisor'));assert(leadPosts[0].includes('Visitor can edit'));
  const events=await page.evaluate(()=>window.qaEvents);assert(events.some(e=>e[1]==='generate_lead'));assert(!JSON.stringify(events).includes('Burnaby'));assert(!JSON.stringify(events).includes('base64'));
  await page.keyboard.press('Escape');await widget.locator('.sa-launcher').click();await widget.getByRole('button',{name:'New conversation'}).click();
  assert.equal(await widget.locator('.sa-message').count(),0);assert(await widget.locator('.sa-handoff').isHidden());
  assert.equal(await widget.locator('.sa-photo img').getAttribute('src'),null);
  await widget.locator('input[type=file]').setInputFiles({name:'bad.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg/>')});assert((await widget.locator('.sa-status').textContent()).includes('Choose a JPEG'));
  await widget.locator('input[type=file]').setInputFiles({name:'large.jpg',mimeType:'image/jpeg',buffer:Buffer.alloc(7*1024*1024+1)});assert((await widget.locator('.sa-status').textContent()).includes('7 MB'));
  await widget.locator('input[type=file]').setInputFiles({name:'broken.jpg',mimeType:'image/jpeg',buffer:Buffer.from('not an image')});await page.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('could not be prepared'));
  mode='long';await input.fill('Wall '.repeat(400));await page.waitForTimeout(1550);await widget.getByRole('button',{name:'Send',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.sa-send').disabled);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);assert((await widget.locator('.sa-scroll').evaluate(e=>e.scrollHeight>e.clientHeight)));
  for(const failure of ['error','rate','network']){mode=failure;await input.fill('A feature wall');await page.waitForTimeout(1550);await widget.getByRole('button',{name:'Send',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.sa-send').disabled);assert((await widget.locator('.sa-status').textContent()).length>20);assert(await widget.locator('.sa-handoff').isVisible());}
  if(width===375){mode='success';delay=500;await page.evaluate(()=>{window.qaOriginalTimer=window.setTimeout;window.setTimeout=(fn,ms,...args)=>window.qaOriginalTimer(fn,ms===25000?20:ms,...args);});await page.waitForTimeout(1550);await widget.locator('.sa-send').click();await page.waitForFunction(()=>document.querySelector('.sa-status').textContent.includes('temporarily unavailable'));await page.evaluate(()=>window.setTimeout=window.qaOriginalTimer);}
  mode='success';delay=700;await page.waitForTimeout(1550);await widget.getByRole('button',{name:'Send',exact:true}).click();await widget.getByRole('button',{name:'New conversation'}).click();await page.waitForTimeout(850);assert.equal(await widget.locator('.sa-message').count(),0);
  await page.setViewportSize({width,height:500});assert((await dialog.boundingBox()).height<=476);await widget.locator('.sa-send').scrollIntoViewIfNeeded();await dialog.screenshot({path:path.join(out,`finish-advisor-keyboard-${width}.png`)});
  await page.keyboard.press('Escape');await page.setViewportSize({width,height:900});
  // Cross-page handoff uses same-tab text only; image reattachment is explicit.
  await page.goto(base+'/marmorino-retail-interiors.html');await page.locator('#stile-advisor .sa-launcher').click();await page.locator('#stile-advisor textarea').fill('We are specifying a boutique in Vancouver.');
  await page.locator('#stile-advisor .sa-send').click();await page.waitForFunction(()=>document.querySelector('.sa-handoff')&&!document.querySelector('.sa-handoff').hidden);
  await page.locator('#stile-advisor .sa-handoff').click();await page.waitForURL('**/#estimate');await page.locator('#estimate-modal.is-open').waitFor();assert((await page.locator('#estimate-details').inputValue()).includes('boutique'));assert.equal(await page.locator('#estimate-photo').evaluate(e=>e.files.length),0);
  assert(await page.locator('#estimate-advisor-note').isVisible());
  assert.equal(errors.length,0,JSON.stringify(errors));
  console.log(JSON.stringify({width,ui:'PASS',responsive:'PASS',imagePreprocessing:'PASS',safeDOM:'PASS',editableHandoff:'PASS',noAutoSubmission:'PASS',analyticsNoContent:'PASS',mockedProvider:'SIMULATED / STRUCTURAL PASS'}));await context.close();
 }
 const page=await browser.newPage();
 for(const route of ['/','/projects.html','/venetian-plaster-vancouver.html','/marmorino-vancouver.html','/fireplace-wall-vancouver.html','/feature-wall-vancouver.html','/plaster-range-hood-vancouver.html','/marmorino-retail-interiors.html','/microcement-vancouver.html','/custom-architectural-rock-installation.html','/brookswood-langley-fireplace-transformation.html','/west-vancouver-fireplace-transformation.html','/venetian-plaster-cost-vancouver.html']){assert.equal((await page.goto(base+route)).status(),200);await page.locator('#stile-advisor .sa-launcher').waitFor();}
 await page.goto(base+'/car.html');assert.equal(await page.locator('#stile-advisor').count(),0);
 console.log('Commercial page coverage: PASS; excluded campaign page: PASS');
 const denied=await browser.newContext();await denied.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('blocked')};Storage.prototype.setItem=()=>{throw new Error('blocked')};});
 const p=await denied.newPage();await p.route('**/api/finish-advisor',r=>r.fulfill({status:503,body:'unavailable'}));await p.goto(base+'/projects.html');await p.locator('.sa-launcher').click();await p.locator('#stile-advisor textarea').fill('A fireplace');await p.locator('.sa-send').click();await p.locator('.sa-handoff').click();assert(await p.getByRole('link',{name:'Continue to the photo form without saved notes'}).isVisible());await denied.close();console.log('Storage-denied graceful handoff: PASS');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
