// Actual tracker and actual homepage submission callback, with offline DOM/network stubs.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const tracker = fs.readFileSync(path.join(root,'scripts/analytics.js'),'utf8');
const estimate = fs.readFileSync(path.join(root,'scripts/home-estimate.js'),'utf8');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const noop = () => {};
const day = 24 * 60 * 60 * 1000;
const acceptedKey = 'stile_accepted_lead_ids_v2';
const fixtureNow = Date.UTC(2026,10,18);

// The bootstrap's host/query/privacy behavior is tested by the environment suite.
// Here its explicit state is a fixture; the real tracker and submit handler execute.
function load({pathname='/venetian-plaster-vancouver.html',hostname='stiledileo.com',search='',storage=new Map(),blocked=false,modalOpen=false,enabled,gtag=true,bootstrap=true,now=fixtureNow}={}) {
  const handlers = new Map(), calls = [], regions = [], appended = [];
  const clock = {now};
  class TestDate extends Date { static now() { return clock.now; } }
  const form = {id:'estimate-form',getAttribute:name=>name==='name'?'instant-estimate':null};
  const origin = `https://${hostname}`;
  const sandbox = {
    location:{hostname,pathname,search,origin,href:origin+pathname+search},
    document:{title:'Public service page',referrer:'',addEventListener:(type,handler)=>{if(!handlers.has(type))handlers.set(type,[]);handlers.get(type).push(handler);},querySelectorAll:()=>regions,createElement:()=>({}),head:{append:(...nodes)=>appended.push(...nodes)},getElementById:id=>id==='estimate-form'?form:id==='estimate-modal'&&modalOpen?{classList:{contains:name=>name==='is-open'}}:null},
    sessionStorage:{getItem:key=>{if(blocked)throw Error('blocked');return storage.get(key)||null;},setItem:(key,value)=>{if(blocked)throw Error('blocked');storage.set(key,value);},removeItem:key=>{if(blocked)throw Error('blocked');storage.delete(key);}},
    URL,URLSearchParams,WeakSet,Set,Map,Date:TestDate
  };
  const recordTag = (...args)=>calls.push(args);
  if(gtag)sandbox.gtag=recordTag;
  if(bootstrap)sandbox.StileMeasurement={ready:true,enabled:enabled??(/^(www\.)?stiledileo\.com$/i.test(hostname)&&new URLSearchParams(search).get('stile_test')!=='1'),pagePath:pathname,pageLocation:origin+pathname,pageReferrer:''};
  sandbox.window=sandbox;
  const context=vm.createContext(sandbox);
  const init=()=>vm.runInContext(tracker,context);
  init();
  const dispatch=(type,event)=>{for(const handler of handlers.get(type)||[])handler(event);};
  return {sandbox,context,handlers,calls,storage,form,regions,appended,clock,init,dispatch,recordTag,events:()=>calls.filter(x=>x[0]==='event')};
}
function button({text='Request a Consultation',href='/#contact',region='cta',regionId='',labelledBy='',slot=1}={}) {
  const node={dataset:{},textContent:text,getAttribute:name=>name==='href'?href:null};
  const peers=Array.from({length:slot-1},()=>({dataset:{},textContent:'Send photo',getAttribute:()=>'/#estimate'}));
  const section={id:regionId,className:region,tagName:'SECTION',getAttribute:name=>name==='aria-labelledby'?labelledBy:null,querySelectorAll:()=>[...peers,node]};
  section.closest=()=>section;
  node.closest=()=>section;
  return node;
}
const click=(env,node)=>{const region=node.closest();if(!env.regions.includes(region))env.regions.push(region);env.dispatch('click',{target:{closest:()=>node}});};
const input=env=>env.dispatch('input',{target:{closest:()=>env.form}});

test('reinitializing the actual tracker keeps one listener, event and modal catch-up',()=>{
  const env=load({pathname:'/',modalOpen:true});
  const api=env.sandbox.StileAnalytics;
  assert.equal(api.measurementVersion,'enquiry-v2');
  const appended=env.appended.length;
  env.init();env.init();
  assert.equal(env.sandbox.StileAnalytics,api);
  for(const type of ['click','input','change'])assert.equal(env.handlers.get(type).length,1,type);
  assert.equal(env.appended.length,appended,'reinitialization does not append the advisor again');
  assert.equal(env.events().filter(e=>e[1]==='contact_form_open').length,1);
  click(env,button());
  assert.equal(env.events().filter(e=>e[1]==='estimate_click').length,1);
});

// A changed label/destination must not be reported as a newly different CTA slot.
test('consultation and proposed photo footer retain the same CTA identity; header differs',()=>{
  const old=load(),next=load(),header=load();
  click(old,button());
  click(next,button({text:'Send a Project Photo',href:'/#estimate'}));
  click(header,button({text:'Send a Project Photo',href:'/#estimate',region:'topbar'}));
  const first=old.events()[0],second=next.events()[0];
  assert.equal(first[1],'estimate_click');assert.equal(second[1],'project_photo_click');
  assert.equal(first[2].cta_id,second[2].cta_id);
  assert.notEqual(first[2].cta_id,header.events()[0][2].cta_id);
  for(const env of [old,next,header])assert(env.events().every(event=>event[2].cta_text===undefined),'click labels are not sent to analytics');
  assert(!old.events().some(e=>['generate_lead','conversion'].includes(e[1])));
});

test('same-class proof and planning regions have distinct CTA slots, including the ordinal fallback',()=>{
  for(const labelled of [true,false]){
    const env=load({pathname:'/feature-wall-vancouver.html'});
    const proof=button({text:'View Project Photo',href:'/project.html',region:'section',labelledBy:labelled?'finished-feature-project':''});
    const planning=button({text:'Send a Wall Photo',href:'/#estimate',region:'section',labelledBy:labelled?'feature-wall-planning':''});
    env.regions.push(proof.closest(),planning.closest());
    click(env,proof);click(env,planning);
    const ids=env.events().filter(e=>e[1]==='project_photo_click').map(e=>e[2].cta_id);
    assert.equal(ids.length,2);assert(ids.every(id=>typeof id==='string'&&id.length));
    assert.notEqual(ids[0],ids[1],labelled?'aria-labelledby identifies the region':'page-wide region ordinal identifies the region');
  }
});

test('service footer -> homepage contact -> open/start/accept retains original and latest CTA metadata',()=>{
  const storage=new Map(),entry=load({storage});click(entry,button());
  const origin=entry.events()[0][2].cta_id;
  const home=load({pathname:'/',storage});
  // Both the modal hook and delegated click may observe the same trigger.
  const contact=button({text:'Send Project Photo',href:'#estimate',region:'contact'});
  home.sandbox.StileAnalytics.trackFormOpen(contact);click(home,contact);
  input(home);
  home.dispatch('change',{target:{closest:()=>home.form}});
  const open=home.events().find(e=>e[1]==='contact_form_open');
  assert.equal(open[2].cta_origin_id,origin);assert.equal(open[2].cta_origin_path,'/venetian-plaster-vancouver.html');
  assert.equal(open[2].cta_latest_path,'/');assert.notEqual(open[2].cta_latest_id,origin);
  assert.equal(home.events().filter(e=>e[1]==='contact_form_start').length,1);
  const inquiry=home.sandbox.StileAnalytics.getInquiryContext();
  assert.equal(inquiry.cta_origin_id,origin);assert.equal(inquiry.initial_landing_path,'/venetian-plaster-vancouver.html');
  home.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'opaque-receipt-1',service:'venetian_plaster'});
  const accepted=home.events().find(e=>e[1]==='generate_lead');
  assert.equal(accepted[2].cta_origin_id,origin);assert.equal(accepted[2].receipt_state,'http_accepted');
  assert.equal(home.sandbox.StileAnalytics.getInquiryContext().cta_origin_id,undefined,'next inquiry does not inherit a completed CTA journey');
});

test('direct hash entry, blocked storage and malformed/stale saved origin stay unknown',()=>{
  for(const settings of [{},{blocked:true},{storage:new Map([['stile_cta_journey_v1',JSON.stringify({origin_id:'bad@id',origin_path:'/private?email=bad',latest_id:'a',latest_path:'/',recorded_at:fixtureNow})]])},{storage:new Map([['stile_cta_journey_v1',JSON.stringify({origin_id:'footer',origin_path:'/service.html',latest_id:'footer',latest_path:'/service.html',recorded_at:fixtureNow-31*60*1000})]])}]) {
    const env=load({pathname:'/',...settings});env.sandbox.StileAnalytics.trackFormOpen();
    assert.equal(env.events()[0][2].cta_origin_id,undefined);
    assert.equal(env.sandbox.StileAnalytics.getInquiryContext().cta_origin_path,undefined);
  }
});

test('success requires explicit HTTP acceptance and is deduplicated across same-tab reloads',()=>{
  const storage=new Map(),env=load({storage});
  for(const accepted of [undefined,false,1,'true',{},null])env.sandbox.StileAnalytics.trackLeadSuccess({accepted,transaction_id:'receipt-a'});
  assert.equal(env.events().length,0);
  assert.equal(storage.has(acceptedKey),false,'non-acceptance does not consume the accepted ID');
  env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-a'});
  env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-a'});
  assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,1);
  assert.equal(env.events().filter(e=>e[1]==='conversion').length,1);
  const reload=load({storage});reload.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-a'});
  assert.equal(reload.events().length,0);
});

test('accepted ledger expires after 24 hours in memory and across reloads',()=>{
  for(const reload of [false,true]){
    const storage=new Map(),first=load({storage});
    first.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-ttl'});
    const at=first.clock.now;
    const env=reload?load({storage,now:at+day-1}):first;
    env.clock.now=at+day-1;
    env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-ttl'});
    const before=env.events().filter(e=>e[1]==='generate_lead').length;
    assert.equal(before,reload?0:1,'the same ID is suppressed within its TTL');
    env.clock.now=at+day+1;
    env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-ttl'});
    assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,before+1,'expired ID is eligible again');
    assert.equal(JSON.parse(storage.get(acceptedKey))[0].at,at+day+1);
  }
});

test('accepted ledger stores timestamps and bounds memory and session storage to 100 IDs',()=>{
  const storage=new Map(),env=load({storage});
  for(let n=0;n<101;n++){
    env.clock.now++;
    env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:`receipt-${n}`});
  }
  const ledger=JSON.parse(storage.get(acceptedKey));
  assert.equal(ledger.length,100);
  assert(ledger.every(entry=>Object.keys(entry).sort().join(',')==='at,id'&&typeof entry.id==='string'&&Number.isFinite(entry.at)));
  assert.equal(ledger[0].id,'receipt-1');assert.equal(ledger[99].id,'receipt-100');
  const before=env.events().filter(e=>e[1]==='generate_lead').length;
  env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-0'});
  assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,before+1,'oldest ID is also evicted in memory');
  const reloaded=load({storage,now:env.clock.now});
  reloaded.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-100'});
  assert.equal(reloaded.events().filter(e=>e[1]==='generate_lead').length,0,'retained recent ID survives reload');
});

test('accepted cleanup works without emission and a duplicate callback preserves a newer journey',()=>{
  for(const settings of [{enabled:false},{gtag:false},{bootstrap:false}]){
    const env=load(settings);
    click(env,button({regionId:'original'}));input(env);
    assert(env.sandbox.StileAnalytics.getInquiryContext().cta_origin_id);
    env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-suppressed'});
    assert.equal(env.calls.length,0);
    assert.equal(env.sandbox.StileAnalytics.getInquiryContext().cta_origin_id,undefined);
    assert.equal(JSON.parse(env.storage.get(acceptedKey)).length,1,'suppressed acceptance still deduplicates cleanup');
    click(env,button({regionId:'new-inquiry'}));
    const next=env.sandbox.StileAnalytics.getInquiryContext().cta_origin_id;
    assert(next);
    env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-suppressed'});
    assert.equal(env.sandbox.StileAnalytics.getInquiryContext().cta_origin_id,next,'duplicate callback cannot erase the next inquiry');
    assert.equal(env.calls.length,0);
    if(settings.gtag===false){
      env.sandbox.gtag=env.recordTag;
      input(env);input(env);
      assert.equal(env.events().filter(e=>e[1]==='contact_form_start').length,1,'successful suppressed inquiry reset form-start state');
      env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-suppressed'});
      assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,0,'restoring gtag does not replay a completed suppressed inquiry');
      assert.equal(env.sandbox.StileAnalytics.getInquiryContext().cta_origin_id,next);
    }
  }
});

test('local/preview and explicit synthetic event mode cannot emit events or Ads conversions',()=>{
  for(const settings of [{hostname:'localhost'},{hostname:'127.0.0.1'},{hostname:'deploy-preview-2--example.netlify.app'},{search:'?stile_test=1'}]){
    const env=load(settings);click(env,button());env.sandbox.StileAnalytics.trackFormOpen();
    env.sandbox.StileAnalytics.track('contact_form_submit_attempt');
    env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'test-only'});
    assert.equal(env.calls.length,0);
  }
});

test('arbitrary client fields, unsafe paths and non-opaque contact IDs are never forwarded',()=>{
  const env=load();
  env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'receipt-safe',email:'client@example.test',phone:'+16045550000',name:'Private name',notes:'Private project',photo:'private.jpg',arbitrary:{nested:'secret'},cta_location:'unsafe@example.test',cta_text:'Private client label',link_url:'/?email=client@example.test'});
  const event=env.events().find(e=>e[1]==='generate_lead');
  for(const name of ['accepted','email','phone','name','notes','photo','arbitrary','link_url','cta_location','cta_text'])assert.equal(event[2][name],undefined,name);
  assert(!JSON.stringify(env.calls).includes('client@example'));
  env.sandbox.StileAnalytics.trackLeadSuccess({accepted:true,transaction_id:'client@example.test'});
  assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,1);
});

test('homepage service, project and commercial clicks remain separate from successful enquiries',()=>{
  const env=load({pathname:'/'});
  const link=(href,track,extra={})=>Object.assign(button({text:'Public link',href}),{dataset:{track,...extra}});
  click(env,link('/commercial-limewash-vancouver.html','service_navigation'));
  click(env,link('/holt-renfrew-limewash-vancouver.html','project_view'));
  click(env,link('mailto:private@example.test?subject=Draft','commercial_enquiry'));
  click(env,link('#estimate','estimate',{estimateType:'commercial',ctaId:'home_trade_estimate'}));
  assert.deepEqual(env.events().map(e=>e[1]),['service_navigation','project_view','email_click','commercial_enquiry','estimate_click','commercial_enquiry']);
  assert.equal(env.events()[0][2].service,'limewash');
  assert.equal(env.events()[1][2].link_url,'/holt-renfrew-limewash-vancouver.html');
  assert.equal(env.events()[3][2].lead_method,'email');
  assert.equal(env.events()[5][2].lead_method,'form');
  assert.equal(env.events()[5][2].cta_id,'home_trade_estimate');
  assert.doesNotMatch(JSON.stringify(env.events()),/private@example|subject=Draft/);
});

async function actualSubmission(status,storage=new Map(),settings={}){
  // A numeric status models Fetch's HTTP contract; Error models a transport failure.
  if(typeof status==='boolean')status=status?200:500;
  const env=load({pathname:'/',storage}),f=env.form,fields=new Map();
  for(const key of ['submission_id','project_type','wall_photo_filename','utm_source','utm_medium','utm_campaign','utm_content','initial_landing_path','first_referrer','cta_origin_id','cta_origin_path','cta_latest_id','cta_latest_path'])fields.set(key,{value:''});
  let handler,posts=0,successHookCalls=0,payload;
  const element=()=>({hidden:false,classList:{add:noop,remove:noop,contains:()=>true},setAttribute:noop,removeAttribute:noop,focus:noop});
  const photo=Object.hasOwn(settings,'photo')?settings.photo:{name:'fixture.png',type:'image/png',size:1024};
  const nodes=Object.fromEntries(['title','form-controls','name','email','phone','photo','details','project-type','success','failure','advisor-note','name-error','contact-error','photo-error','close','file-label'].map(key=>[key,{...element(),id:`estimate-${key}`,addEventListener:noop}]));
  Object.assign(nodes.name,{value:settings.visitorName??'Fixture Visitor'});
  Object.assign(nodes.email,{value:settings.email??'fixture@example.test',validity:{valid:settings.emailValid??true}});
  Object.assign(nodes.phone,{value:settings.phone??''});
  Object.assign(nodes.photo,{files:photo?[photo]:[]});
  Object.assign(nodes['project-type'],{value:'general',options:[{value:'general'},{value:'venetian_plaster'}]});
  nodes.success.hidden=true;
  const submit={disabled:false,textContent:'Send Enquiry'};
  const modal={...element(),querySelector:element,addEventListener:noop};
  const formAttrs=new Map();
  Object.assign(f,{dataset:{},querySelector:()=>submit,addEventListener:(_,fn)=>handler=fn,elements:{namedItem:key=>fields.get(key)},setAttribute:(key,val)=>formAttrs.set(key,val),removeAttribute:key=>formAttrs.delete(key)});
  const find=env.sandbox.document.getElementById;
  env.sandbox.document.getElementById=id=>id==='estimate-modal'?modal:(nodes[id.replace(/^estimate-/,'')]||find(id));
  Object.assign(env.sandbox,{
    addEventListener:noop,crypto:{randomUUID:()=> 'opaque-offline-fixture'},
    FormData:class extends Map{constructor(){super([['form-name','instant-estimate'],['project_type','general'],...photo?[['wall_photo',photo]]:[]]);}},
    AbortController:class{constructor(){this.signal={}}abort(){}},
    fetch:async(_,options)=>{posts++;payload=options.body;if(settings.fetchGate)await settings.fetchGate;if(status instanceof Error)throw status;return {ok:status>=200&&status<300,status,headers:{get:key=>key==='X-Stile-Estimate-Receipt'&&!settings.noReceipt?'http_accepted':null}};},
    setTimeout:()=>1,clearTimeout:noop
  });
  if(settings.successHookThrows)env.sandbox.StileAnalytics.trackLeadSuccess=()=>{successHookCalls++;throw Error('offline measurement failure fixture');};
  assert(/<script src="\/scripts\/home-estimate\.js" defer><\/script>/.test(html),'homepage includes the real submission script');
  vm.runInContext(estimate,env.context);
  if(settings.autoSubmit!==false)await handler({preventDefault:noop});
  return {env,posts,fields,handler,nodes,submit,formAttrs,payload,getPosts:()=>posts,getSuccessHookCalls:()=>successHookCalls};
}

test('actual photo and contact validation failures cannot emit an attempt, POST or acceptance',async()=>{
  const cases=[
    {name:'missing name',visitorName:'  '},
    {name:'non-image photo',photo:{name:'fixture.txt',type:'text/plain',size:1024}},
    {name:'oversized photo',photo:{name:'fixture.png',type:'image/png',size:8*1024*1024}},
    {name:'missing contact',phone:'  ',email:'  '},
    {name:'invalid email',email:'invalid fixture',emailValid:false},
    {name:'invalid phone characters',phone:'call me'},
    {name:'short phone',phone:'123'},
    {name:'long phone',phone:'1234567890123456'}
  ];
  for(const settings of cases){
    const {env,posts,fields,nodes,formAttrs}=await actualSubmission(200,new Map(),settings);
    assert.equal(posts,0,settings.name);
    assert.equal(env.events().filter(e=>['contact_form_submit_attempt','generate_lead','conversion'].includes(e[1])).length,0,settings.name);
    assert.equal(nodes.success.hidden,true,settings.name);
    assert.equal(formAttrs.has('aria-busy'),false,settings.name);
    assert.equal(fields.get('submission_id').value,'','validation failure does not allocate a submitted inquiry ID');
    assert(nodes['name-error'].textContent||nodes['photo-error'].textContent||nodes['contact-error'].textContent,'validation failure explains the required correction');
  }
});

test('a second actual submit while the HTTP request is pending cannot make a second POST',async()=>{
  let resolveFetch;
  const fetchGate=new Promise(resolve=>{resolveFetch=resolve;});
  const {env,handler,getPosts,formAttrs,submit,nodes}=await actualSubmission(200,new Map(),{fetchGate,autoSubmit:false});
  const first=handler({preventDefault:noop});
  assert.equal(formAttrs.get('aria-busy'),'true');
  assert.equal(submit.disabled,true);
  await handler({preventDefault:noop});
  assert.equal(getPosts(),1);
  assert.equal(env.events().filter(e=>e[1]==='contact_form_submit_attempt').length,1);
  assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,0,'pending response is not HTTP acceptance');
  resolveFetch();await first;
  assert.equal(getPosts(),1);
  assert.equal(nodes.success.hidden,false);
  assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,1);
});

test('a throwing measurement hook after HTTP acceptance cannot make the form retryable',async()=>{
  const {env,handler,getPosts,getSuccessHookCalls,nodes,formAttrs,submit}=await actualSubmission(200,new Map(),{successHookThrows:true});
  assert.equal(getSuccessHookCalls(),1,'fixture exercises the throwing hook');
  assert.equal(formAttrs.has('aria-busy'),false);
  assert.equal(nodes.success.hidden,false);
  assert.equal(nodes.failure.hidden,true);
  assert.equal(submit.disabled,true);
  await handler({preventDefault:noop});
  assert.equal(getPosts(),1);
  assert.equal(getSuccessHookCalls(),1);
  assert.equal(env.events().filter(e=>e[1]==='contact_form_submit_attempt').length,1);
});

test('photo intake modal and form retain their third-party capture opt-out attributes',()=>{
  for(const [tag,id] of [['div','estimate-modal'],['form','estimate-form']]){
    const opening=html.match(new RegExp(`<${tag}\\b[^>]*\\bid="${id}"[^>]*>`));
    assert(opening,`${id} opening tag exists`);
    assert(/\sdata-opinly-no-capture(?:\s|>|=)/.test(opening[0]),`${id} keeps data-opinly-no-capture`);
  }
});

test('actual handler records attempt but no lead for rejection or an unconfirmed 200',async()=>{
  for(const status of [200,400,500,new Error('offline transport fixture')]){
    const {env,posts,nodes}=await actualSubmission(status,new Map(),{noReceipt:true});
    assert.equal(posts,1);assert.equal(env.events().filter(e=>e[1]==='contact_form_submit_attempt').length,1);
    assert.equal(env.events().filter(e=>['generate_lead','conversion'].includes(e[1])).length,0);
    assert.equal(nodes.success.hidden,true);
  }
});

test('actual handler emits accepted photo-free lead once; accepted retry is not a second POST',async()=>{
  const {env,posts,handler,getPosts,nodes,payload}=await actualSubmission(204,new Map(),{photo:null});
  assert.equal(posts,1);assert.equal(env.events().filter(e=>e[1]==='generate_lead').length,1);
  assert.equal(env.events().filter(e=>e[1]==='conversion').length,1);
  assert.equal(env.events().find(e=>e[1]==='generate_lead')[2].receipt_state,'http_accepted');
  assert.equal(nodes.success.hidden,false);
  assert.equal(payload.has('wall_photo'),false);
  await handler({preventDefault:noop});
  assert.equal(env.events().filter(e=>e[1]==='contact_form_submit_attempt').length,1);
  assert.equal(getPosts(),1);
});

// Metadata is deliberately a source hint, not commercial service classification.
test('actual accepted form copies safe original/latest CTA fields to its receipt payload',async()=>{
  const storage=new Map(),entry=load({storage});click(entry,button());
  const expected=entry.events()[0][2].cta_id;
  const {payload}=await actualSubmission(true,storage);
  assert.equal(payload.get('cta_origin_id'),expected);
  assert.equal(payload.get('cta_origin_path'),'/venetian-plaster-vancouver.html');
  assert.equal(payload.get('initial_landing_path'),'/venetian-plaster-vancouver.html');
  assert.equal(payload.get('cta_latest_id'),expected);
  for(const name of ['cta_origin_id','cta_origin_path','cta_latest_id','cta_latest_path']) {
    assert(html.includes(`type="hidden" name="${name}"`),'Netlify static form registers '+name);
  }
});

test('deferred tracker catches an already open hash-linked modal once without inventing a CTA',()=>{
  const direct=load({pathname:'/',modalOpen:true});
  const opened=direct.events().filter(e=>e[1]==='contact_form_open');
  assert.equal(opened.length,1);assert.equal(opened[0][2].cta_origin_id,undefined);
  const storage=new Map(),entry=load({storage});click(entry,button({text:'Send a Project Photo',href:'/#estimate'}));
  const home=load({pathname:'/',storage,modalOpen:true});
  assert.equal(home.events().filter(e=>e[1]==='contact_form_open').length,1);
  assert.equal(home.events()[0][2].cta_origin_path,'/venetian-plaster-vancouver.html');
});
