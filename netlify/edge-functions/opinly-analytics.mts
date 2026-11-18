// This review draft disables optional Opinly activity if published because the
// existing vendor auto-identifies contact emails. Google/Ads keep their separate
// sanitized measurement flow. Restore vendor capture only after owner review.
// Preserve upstream content, status, headers and streaming without injection.
export default async (_req:Request,context:any)=>context.next();
export const config={path:"/*",excludedPath:["/admin/*","/.netlify/*"]};
