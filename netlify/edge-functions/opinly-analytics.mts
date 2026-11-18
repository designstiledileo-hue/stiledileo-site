// Preserve the existing vendor only behind the shared measurement/privacy gate.
// Official data-opinly-no-capture protects forms; no new destination or key.
const PIXEL = String.raw`<script data-stile-opinly>(function () {
  if (window.__stileOpinlyLoaded) return;
  const gate = window.StileMeasurement;
  if (!gate || !gate.ready || !gate.enabled || !/^(www\.)?stiledileo\.com$/i.test(location.hostname)) return;
  // Optional vendor reads raw URL/attribution: exclude query-bearing visits.
  try {
    if (new URL(location.href).search) return;
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.search || ref.hash || ref.username || ref.password) return;
    }
    const saved = localStorage.getItem('_opinly_utm');
    if (saved) {
      const touch = JSON.parse(saved);
      if (!touch || typeof touch !== 'object' || Array.isArray(touch)) return;
      const fields = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id'];
      for (const [name,value] of Object.entries(touch)) {
        if (name === 'referrer') {
          const ref = new URL(value);
          if (!/^https?:$/.test(ref.protocol) || ref.search || ref.hash || ref.username || ref.password) return;
        } else if (name === 'click_ids') {
          // Existing click attribution remains private until its capture is separately reviewed.
          if (!value || typeof value !== 'object' || Object.keys(value).length) return;
        } else if (!fields.includes(name) || typeof value !== 'string'
                   || !/^[a-z0-9_-]{1,100}$/i.test(value) || /\d{7}/.test(value)) return;
      }
    }
  } catch (_) { return; }
  // Official vendor opt-out: protect every current/future form before SDK capture.
  const protect = () => document.querySelectorAll('form').forEach(form => form.setAttribute('data-opinly-no-capture',''));
  const start = () => {
    if (window.__stileOpinlyLoaded) return;
    protect();
    new MutationObserver(protect).observe(document.documentElement, {childList:true,subtree:true});
    window.__stileOpinlyLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://static.opinly.ai/p.js';
    script.dataset.key = 'pk-z0a3SVCuclPQ4PLQ-lCiSQRYxG7B9-2C1NlyXc5';
    document.head.appendChild(script);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();</script>`;
export default async (_req:Request,context:any)=>{
  const response=await context.next();
  if(!response.headers.get('content-type')?.includes('text/html'))return response;
  const html=await response.text();
  if(html.includes('data-stile-opinly'))return new Response(html,response);
  const headers=new Headers(response.headers);
  headers.delete('content-length'); headers.delete('etag');
  return new Response(html.replace('</head>',PIXEL+'</head>'),{status:response.status,statusText:response.statusText,headers});
};
export const config={path:"/*",excludedPath:["/admin/*","/.netlify/*"]};
