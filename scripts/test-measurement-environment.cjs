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

test('all 52 measured page bootstraps initialize production once and leave local/preview hosts unmeasured', () => {
  assert.equal(tracked.length,52);
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
