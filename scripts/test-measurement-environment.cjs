// Offline execution of the actual page bootstrap and shared tracker. No network.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter(file => file.endsWith('.html'));
const bootstrap = file => Array.from(fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))
  .map(match => match[2]).find(code => /gtag\(\s*['"]config['"]\s*,\s*['"]G-P7VJ8MQNKS/.test(code));
const tracked = files.filter(file => bootstrap(file));

test('all 53 measured page bootstraps initialize production once and leave local/preview hosts unmeasured', () => {
  assert.equal(tracked.length,53);
  for (const file of tracked) {
    for (const hostname of ['stiledileo.com','www.stiledileo.com','localhost','127.0.0.1','main--designbyleo.netlify.app','stiledileo.com.example.net']) {
      const sandbox = {location:{hostname},Date};
      sandbox.window = sandbox;
      vm.runInNewContext(bootstrap(file),sandbox);
      const configs = sandbox.dataLayer.filter(args => args[0] === 'config');
      const expected = ['stiledileo.com','www.stiledileo.com'].includes(hostname) ? 1 : 0;
      assert.equal(configs.length,expected,`${file} on ${hostname}`);
      assert.equal(sandbox.dataLayer.length,expected*2,`${file}: no queued js/config outside production`);
    }
  }
});

test('a local or preview contact action cannot send GA4 events or Ads conversions', () => {
  for (const hostname of ['localhost','127.0.0.1','deploy-preview-1--designbyleo.netlify.app']) {
    const handlers = new Map();
    const sandbox = {
      location:{hostname,pathname:'/feature-wall-tv-wall-vancouver.html',search:''},
      document:{title:'Offline review',referrer:'',addEventListener:(type,handler)=>handlers.set(type,handler)},
      sessionStorage:{getItem:()=>null,setItem:()=>{}},URL,URLSearchParams,WeakSet,Set,Date
    };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    vm.runInContext(bootstrap('feature-wall-tv-wall-vancouver.html'),context);
    vm.runInContext(fs.readFileSync(path.join(root,'scripts/analytics.js'),'utf8'),context);
    sandbox.StileAnalytics.track('phone_click');
    sandbox.StileAnalytics.trackLeadSuccess({transaction_id:'offline-only'});
    sandbox.StileAnalytics.trackLeadSuccess({transaction_id:'offline-only'});
    assert.equal(sandbox.dataLayer.length,0,hostname);
    assert.equal(sandbox.StileAnalytics.getInquiryContext().initial_landing_path,'/feature-wall-tv-wall-vancouver.html');
  }
});

test('Abbotsford photo intent retains same-tab landing attribution and never becomes a lead click', () => {
  const storage = new Map();
  const load = pathname => {
    const handlers = new Map();
    const sandbox = {
      location:{hostname:'stiledileo.com',pathname,search:pathname.includes('abbotsford')?'?utm_source=offline-regression':''},
      document:{
        title:'Abbotsford test',referrer:'',addEventListener:(type,handler)=>handlers.set(type,handler),
        createElement:()=>({}),head:{append:()=>{}}
      },
      sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},
      URL,URLSearchParams,WeakSet,Set,Date
    };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    vm.runInContext(bootstrap('venetian-plaster-abbotsford.html'),context);
    vm.runInContext(fs.readFileSync(path.join(root,'scripts/analytics.js'),'utf8'),context);
    return {sandbox,handlers};
  };
  const entry = load('/venetian-plaster-abbotsford.html');
  const button = {
    dataset:{track:'send_photo'},textContent:'Send a Project Photo',
    getAttribute:name=>name==='href'?'/#estimate':null,
    closest:()=>null
  };
  entry.handlers.get('click')({target:{closest:()=>button}});
  const events = entry.sandbox.dataLayer.map(args=>Array.from(args)).filter(args=>args[0]==='event');
  assert.equal(events.length,1);
  assert.equal(events[0][1],'project_photo_click');
  assert.equal(events[0][2].service,'venetian_plaster');
  assert(!events.some(args=>['generate_lead','conversion','estimate_click'].includes(args[1])));
  const home = load('/');
  assert.equal(home.sandbox.StileAnalytics.getInquiryContext().initial_landing_path,'/venetian-plaster-abbotsford.html');
  assert.equal(home.sandbox.StileAnalytics.getInquiryContext().utm_source,'offline-regression');
  assert.equal(home.sandbox.StileAnalytics.getInquiryContext().service,'venetian_plaster');
});
