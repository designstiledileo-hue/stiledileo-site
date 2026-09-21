import { advisorInstructions, advisorPages } from "./_shared/finish-advisor-knowledge.mts";
import type { Config } from "@netlify/functions";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
function fail(message: string, status: number) { return json({ error: message }, status); }
function unavailable() { return fail("The Finish Advisor is temporarily unavailable. You can still send your project photo directly to Stile di Leo.", 503); }

async function readBody(req: Request) {
  const max = 1500000;
  if (Number(req.headers.get("content-length")) > max) throw new Error("size");
  if (!req.body) throw new Error("body");
  const reader = req.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length;
      if (size > max) { await reader.cancel(); throw new Error("size"); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
function validImage(image: unknown): image is string {
  if (typeof image !== "string") return false;
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
  if (!match || match[2].length % 4 !== 0 || match[2].length > 1398104) return false;
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length < 12 || bytes.length > 1048576 || bytes.toString("base64") !== match[2]) return false;
  if (match[1] === "jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (match[1] === "png") return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
}
function reply(text: string, ids: string[] = []) {
  const pages = advisorPages();
  return json({ reply: text, links: [...new Set(ids)].filter(id => Object.hasOwn(pages, id)).slice(0, 2).map(id => pages[id as keyof typeof pages]) });
}

export default async (req: Request) => {
  if (req.method !== "POST") return fail("Use POST for a project question.", 405);
  // Same-origin browser endpoint, not a general cross-origin API. This is not authentication.
  if (req.headers.get("origin") !== new URL(req.url).origin || req.headers.get("sec-fetch-site") === "cross-site") return fail("Please use the advisor on this website.", 403);
  if (!(req.headers.get("content-type") || "").startsWith("application/json")) return fail("Please send a valid project question.", 415);
  let body;
  try { body = await readBody(req); } catch { return fail("The request is invalid or too large. Please shorten it or choose a smaller photo.", 400); }
  if (!body || Array.isArray(body) || typeof body.message !== "string" || body.message.trim().length < 1 || body.message.length > 2000) return fail("Please use between 1 and 2,000 characters.", 400);
  const history = body.history ?? [];
  if (!Array.isArray(history) || history.length > 8 || history.some(m => !m || !["user", "assistant"].includes(m.role) || typeof m.text !== "string" || m.text.length > 2000 || !m.text.trim())) return fail("Please start a new conversation.", 400);
  if (Object.keys(body).some(k => !["message", "history", "image"].includes(k)) || (body.image !== undefined && !validImage(body.image))) return fail("Use one JPEG, PNG or WebP photo, resized to 1 MB or less.", 400);
  const text = body.message.trim();
  // Deterministic low-cost stops for obvious abuse and the current wet-room exclusion.
  if (/ignore.{0,40}(instructions|rules)|system\s*prompt|reveal.{0,30}(prompt|secret|key)|write.{0,25}(code|essay)|homework|stock\s*price|latest\s*news/i.test(text)) return reply("I can help with Stile di Leo finishes and project planning. What surface are you working with?");
  if (/microcement/i.test(text) && /shower|bathroom|wet[ -]?room/i.test(text)) return reply("Stile di Leo does not currently offer microcement bathrooms, showers or wet-room systems. We can discuss selected dry interior walls and feature surfaces after project review. Is there a dry interior surface you have in mind?", ["microcement"]);
  const key = Netlify.env.get("OPENAI_API_KEY");
  if (!key) return unavailable();
  const pages = advisorPages();
  const input = history.map(m => ({ role: m.role, content: m.text }));
  const content: Record<string, string>[] = [{ type: "input_text", text }];
  if (body.image) content.push({ type: "input_image", image_url: body.image, detail: "auto" });
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST", signal: controller.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: Netlify.env.get("STILE_ADVISOR_MODEL") || "gpt-5.6-luna",
        instructions: advisorInstructions(), input: [...input, { role: "user", content }],
        store: false, max_output_tokens: 700, reasoning: { effort: "none" },
        text: { format: { type: "json_schema", name: "finish_advice", strict: true,
          schema: { type: "object", properties: { reply: { type: "string" }, pages: { type: "array", items: { type: "string", enum: Object.keys(pages) } } }, required: ["reply", "pages"], additionalProperties: false } } }
      })
    });
    if (!response.ok) return unavailable();
    const data = await response.json();
    if (data.status !== "completed" || !Array.isArray(data.output)) return unavailable();
    const output = data.output.filter((o: any) => o.type === "message").flatMap((o: any) => o.content || []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("");
    const parsed = JSON.parse(output);
    if (typeof parsed.reply !== "string" || !parsed.reply.trim() || parsed.reply.length > 2000 || !Array.isArray(parsed.pages) || parsed.pages.some((id: unknown) => typeof id !== "string" || !Object.hasOwn(pages, id))) return unavailable();
    return reply(parsed.reply, parsed.pages);
  } catch { return unavailable(); } finally { clearTimeout(timer); }
};

export const config = { path: "/api/finish-advisor", rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] } } satisfies Config;
