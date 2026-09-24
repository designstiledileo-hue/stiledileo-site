// Static contract: node --test scripts/test-finish-advisor-route.cjs
// Real Netlify router, no provider calls: ADVISOR_ROUTE_QA_BASE=http://localhost:8899 node --test scripts/test-finish-advisor-route.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const toml=fs.readFileSync(path.join(root,'netlify.toml'),'utf8');
const rules=toml.split('[[redirects]]').slice(1).map(block=>({
 from:block.match(/^\s*from\s*=\s*"([^"]+)"/m)?.[1],
 to:block.match(/^\s*to\s*=\s*"([^"]+)"/m)?.[1],
 status:Number(block.match(/^\s*status\s*=\s*(\d+)/m)?.[1]),
 force:/^\s*force\s*=\s*true\s*$/m.test(block)
}));

test('exact Advisor internal rewrite precedes all other rules',()=>{
 assert.deepEqual(rules[0],{from:'/api/finish-advisor',to:'/.netlify/functions/finish-advisor',status:200,force:true});
 assert.equal(rules.filter(r=>r.from==='/api/finish-advisor').length,1);
 assert(!rules.some(r=>r.from==='/api/*'),'do not introduce an API catch-all');
});
test('representative canonical redirects and browser-facing API URL remain intact',()=>{
 for(const route of ['/projects','/plaster-range-hood-vancouver','/marmorino-retail-interiors','/blog']){
  assert.deepEqual(rules.find(r=>r.from===route),{from:route,to:route+'.html',status:301,force:true});
 }
 const client=fs.readFileSync(path.join(root,'scripts/finish-advisor.js'),'utf8');
 assert(client.includes("fetch('/api/finish-advisor'"));
 assert(!client.includes('/.netlify/functions/finish-advisor'));
});

const base=process.env.ADVISOR_ROUTE_QA_BASE;
test('friendly route reaches the real Function and preserves method, origin and body handling',{skip:!base},async()=>{
 const origin=new URL(base).origin;
 const request=(suffix,options={})=>fetch(new URL(suffix,origin),{redirect:'manual',signal:AbortSignal.timeout(15000),...options});
 const post=(body,headers={})=>request('/api/finish-advisor',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
 const get=await request('/api/finish-advisor');
 assert.equal(get.status,405);assert.equal((await get.json()).error,'Use POST for a project question.');
 assert.equal(get.headers.get('cache-control'),'no-store');assert.equal(get.headers.get('x-content-type-options'),'nosniff');
 const invalid=await post({});assert.equal(invalid.status,400);assert.match((await invalid.json()).error,/between 1 and 2,000/);
 const badOrigin=await post({message:'test'},{Origin:'https://invalid.example'});
 // Netlify Dev's outer proxy can replace the handler's 403 with a 405.
 // The existing handler unit suite separately requires its exact 403 response.
 assert([403,405].includes(badOrigin.status),'cross-origin requests must be rejected');
 const unsupported=await post({message:'Do you offer microcement for a shower?'});assert.equal(unsupported.status,200);
 assert.match((await unsupported.json()).reply,/does not currently offer microcement bathrooms/);
 // This deterministic business-rule response is deliberately before OpenAI in the real handler.
 for(const route of ['/projects','/plaster-range-hood-vancouver','/marmorino-retail-interiors']){
  const response=await request(route);assert.equal(response.status,301);assert.equal(new URL(response.headers.get('location'),origin).pathname,route+'.html');
 }
 for(const route of ['/','/projects.html','/marmorino-retail-interiors.html','/car.html'])assert.equal((await request(route)).status,200,route);
 assert.equal((await request('/api/finish-advisor-route-qa-missing')).status,404);
 assert.equal((await request('/finish-advisor-route-qa-missing.html')).status,404);
});
