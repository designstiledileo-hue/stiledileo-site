const PIXEL='<script async src="https://static.opinly.ai/p.js" data-key="pk-z0a3SVCuclPQ4PLQ-lCiSQRYxG7B9-2C1NlyXc5"></script>';
export default async (_req:Request,context:any)=>{
  const response=await context.next();
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html"))return response;
  const html=await response.text();
  if(html.includes("static.opinly.ai/p.js"))return new Response(html,response);
  const injected=html.includes("</head>")?html.replace("</head>",`${PIXEL}</head>`):html;
  return new Response(injected,{status:response.status,statusText:response.statusText,headers:response.headers});
};
export const config={path:"/*",excludedPath:["/admin/*","/.netlify/*"]};