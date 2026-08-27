import { Webhook } from "svix";
export default async (req:Request)=>{
  if(req.method!=="POST")return new Response("Method not allowed",{status:405});
  const secret=Netlify.env.get("OPINLY_WEBHOOK_SIGNING_SECRET");
  if(!secret)return new Response("Webhook not configured",{status:503});
  const id=req.headers.get("svix-id"),ts=req.headers.get("svix-timestamp"),sig=req.headers.get("svix-signature");
  if(!id||!ts||!sig)return new Response("Invalid signature",{status:400});
  const raw=await req.text();let event:any;
  try{event=new Webhook(secret).verify(raw,{"svix-id":id,"svix-timestamp":ts,"svix-signature":sig});}catch{return new Response("Invalid signature",{status:400});}
  if(event?.type==="content.routes-changed")console.log("Opinly routes changed",event.data?.changed||[]);
  // Blog responses use short CDN caching (5 min), so no persistent application cache exists to purge.
  // A valid webhook is still acknowledged immediately; the next uncached request fetches fresh Opinly data.
  return new Response("ok",{status:200});
};
export const config={path:"/api/opinly-webhook"};