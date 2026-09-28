import { encode } from "@toon-format/toon";
import { z } from "zod";
import { createQChatServer } from "@qchat/server";
import { showcaseAgentGraph } from "../../../server/showcase-agent-graph";
import { guardPreviewRequest } from "../../../server/request-guard";
import type { ShowcaseRecord } from "../../../server/showcase-retriever";

export const runtime = "nodejs";
const inputSchema = z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000) })).min(1).max(30),locale:z.string().max(32).default("en-US") });
const line = (event: unknown) => new TextEncoder().encode(`${JSON.stringify(event)}\n`);

/** Deterministic test adapter: LangGraph plans, QChat compiles; no model key required. */
export async function POST(request: Request) {
  const guard = guardPreviewRequest(request, 60);
  if (guard) return guard;
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid messages." }, { status: 400 });
  const prompt = parsed.data.messages.at(-1)?.content ?? "";
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const plan = await showcaseAgentGraph.invoke({ prompt }, { signal: request.signal });
        const hits=JSON.parse(plan.retrievalHits||"[]") as ShowcaseRecord[];
        controller.enqueue(line({ type: "tool.start", toolCallId: "search", name: plan.catalogResult ? "lookup_showcase_products" : "search_knowledge_index" }));
        controller.enqueue(line({ type: "tool.result", toolCallId: "search", summary: `${hits.length} indexed records retrieved` }));
        if (/failure/i.test(prompt)) throw new Error("Simulated test failure");
        const variant = /no matches/i.test(prompt) ? "empty" : /unavailable/i.test(prompt) ? "unavailable" : /validation/i.test(prompt) ? "error" : hits[0]?.industry&&hits[0].industry!=="retail" ? "knowledge" : "products";
        const document = variant==="knowledge"
          ? {version:"1",id:"retrieved-results",layout:"container",children:hits.filter((hit)=>hit.industry===hits[0]?.industry).map((hit)=>({type:"info-card",id:hit.id,title:hit.title,description:hit.summary,facts:hit.facts,source:`Sample ${hit.industry} knowledge base`}))}
          : variant !== "products"
          ? { version: "1", id: `status-${variant}`, layout: "container", children: [{ type: "status", id: variant, variant, title: variant === "empty" ? "No products found" : variant === "unavailable" ? "Products unavailable" : "Interface could not be displayed", description: variant === "empty" ? "Try a broader search." : variant === "unavailable" ? "Please try again later." : "The generated document did not pass validation." }] }
          : { version: "1", id: "graph-products", layout: "scroll", children: [{ type: "product-collection", id: "shoes", direction: /vertical/i.test(prompt) ? "vertical" : "horizontal", title: "Performance runners in blue", items: [{ type: "product-card", id: "velocity-blue", title: "Velocity Pro 3", description: "Responsive blue running shoe.", image: { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900", alt: "Blue running shoe" }, price: { amount: 189, currency: "USD" }, colors: [{ value: "blue", label: "Blue", color: "#3478f6" }, { value: "black", label: "Black", color: "#17191e" }], sizes: [{ value: "9", label: "9" }, { value: "10", label: "10" }, { value: "11", label: "11" }] }] }] };
        const toon = encode(document);
        const server = createQChatServer({ adapter: { async *run() { yield { type: "ui.start" }; yield { type: "ui.delta", delta: toon }; yield { type: "complete" }; } }, allowedImageHosts: ["images.unsplash.com"] });
        controller.enqueue(line({ type: "text.delta", delta: parsed.data.locale.startsWith("ar") ? variant==="knowledge"?"هذه نتائج من قاعدة المعرفة التجريبية.":"هذه نتائج من بيانات المضيف التجريبية.":variant === "products" ? "Here are the options from the test catalog." : variant==="knowledge"?"Here are retrieved results from the sample knowledge base.":"Here is the requested state." }));
        for await (const event of server.run({ messages: parsed.data.messages.map((message, index) => ({ id: String(index), role: message.role, content: message.content, createdAt: new Date().toISOString() })), metadata: { conversationId: "showcase-test", runId: crypto.randomUUID() }, signal: request.signal })) controller.enqueue(line(event));
      } catch { if (!request.signal.aborted) controller.enqueue(line({ type: "failure", error: { code: "ADAPTER_FAILED", message: "The test agent could not complete this run.", retryable: true } })); }
      finally { controller.close(); }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
