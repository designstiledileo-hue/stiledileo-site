// Actual edge handler and injected gate, entirely offline.
const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');const {stripTypeScriptTypes}=require('node:module');
const source=fs.readFileSync('netlify/edge-functions/opinly-analytics.mts','utf8');
const edge=import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
async function transform(html='<html><head></head><body></body></html>',type='text/html'){
 const response=new Response(html,{status:203,statusText:'Existing',headers:{'content-type':type,'x-existing':'kept'}});
 const result=await(await edge).default(new Request('https://stiledileo.com/'),{next:async()=>response});
 return {result,text:await result.text()};
}
async function run({host='stiledileo.com',enabled=true,query='',referrer='',saved=null,blocked=false,ready='complete'}={}){
 const {text}=await transform();const code=text.match(/<script data-stile-opinly>([\s\S]*?)<\/script>/)[1];
 const scripts=[],forms=[{attrs:new Set(),setAttribute(k){this.attrs.add(k);}}],events=new Map();let observe;
 const location=new URL('https://'+host+'/'+query);
 const sandbox={location,URL,Object,Array,window:null,localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;}},
 document:{referrer,readyState:ready,documentElement:{},querySelectorAll:()=>forms,addEventListener:(name,fn)=>events.set(name,fn),createElement:()=>({dataset:{}}),head:{appendChild(s){assert(forms.every(f=>f.attrs.has('data-opinly-no-capture')));scripts.push(s);}}},
 MutationObserver:class{constructor(fn){observe=fn;}observe(){}}};
 sandbox.window=sandbox;sandbox.StileMeasurement={ready:true,enabled};vm.runInNewContext(code,sandbox);
 return {scripts,forms,events,sandbox,code,mutate(){observe();}};
}
test('clean production retains one existing Opinly loader after all forms opt out',async()=>{
 const env=await run();assert.equal(env.scripts.length,1);assert.equal(env.scripts[0].src,'https://static.opinly.ai/p.js');assert.match(env.scripts[0].dataset.key,/^pk-/);
 vm.runInNewContext(env.code,env.sandbox);assert.equal(env.scripts.length,1);
 const later={attrs:new Set(),setAttribute(k){this.attrs.add(k);}};env.forms.push(later);env.mutate();assert(later.attrs.has('data-opinly-no-capture'));
});
test('preview, test gate and unsafe raw URL/referrer prevent optional vendor load',async()=>{
 for(const opts of [{host:'localhost'},{host:'preview.netlify.app'},{enabled:false},{query:'?email=private@example.test'},{query:'?stile_test=1'},{referrer:'https://example.test/?email=private@example.test'},{referrer:'malformed'},{blocked:true}])assert.equal((await run(opts)).scripts.length,0,JSON.stringify(opts));
});
test('ordinary stored referrer/campaign can measure; unsafe legacy metadata stays private',async()=>{
 assert.equal((await run({saved:JSON.stringify({referrer:'https://www.google.com/',utm_source:'google',utm_medium:'organic'})})).scripts.length,1);
 for(const saved of ['broken','[]','null',JSON.stringify({referrer:'https://example.test/?email=x'}),JSON.stringify({email:'client@example.test'}),JSON.stringify({utm_source:'client@example.test'}),JSON.stringify({utm_campaign:'6045551234'}),JSON.stringify({click_ids:{gclid:'opaque-existing'}})])assert.equal((await run({saved})).scripts.length,0,saved);
});
test('DOMContentLoaded defers vendor until every form exists and is protected',async()=>{
 const env=await run({ready:'loading'});assert.equal(env.scripts.length,0);env.events.get('DOMContentLoaded')();assert.equal(env.scripts.length,1);
});
test('missing shared bootstrap fails closed',async()=>{
 const env=await run({enabled:false});delete env.sandbox.StileMeasurement;vm.runInNewContext(env.code,env.sandbox);assert.equal(env.scripts.length,0);
});
test('edge preserves HTML content/status/headers and does not inject twice',async()=>{
 const {text,result}=await transform();assert.equal(result.status,203);assert.equal(result.headers.get('x-existing'),'kept');assert(text.includes('<body></body>'));
 const second=await transform(text);assert.equal(second.text,text);assert.equal((text.match(/data-stile-opinly/g)||[]).length,1);
 const non=await transform('existing-content','application/json');assert.equal(non.text,'existing-content');
 assert.deepEqual((await edge).config,{path:'/*',excludedPath:['/admin/*','/.netlify/*']});
});
