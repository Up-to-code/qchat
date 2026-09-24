import { afterEach, describe, expect, it, vi } from "vitest";
import { encode } from "@toon-format/toon";
import { POST } from "./route";

const originalKey = process.env.GEMINI_API_KEY;
afterEach(() => { if (originalKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = originalKey; vi.unstubAllGlobals(); });
const request = (body: unknown) => new Request("http://localhost/api/qchat/run", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });

describe("Gemini server boundary", () => {
  it("does not accept requests without a server-only key", async () => {
    delete process.env.GEMINI_API_KEY;
    const response = await POST(request({ messages: [{ role: "user", content: "Hi" }] }));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("Bearer");
  });
  it("rejects malformed image data without calling the provider", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ messages: [{ role: "user", content: "Look" }], attachments: [{ mediaType: "image/png", dataUrl: "javascript:alert(1)" }] }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects a mismatched image MIME type", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ messages: [{ role: "user", content: "Look" }], attachments: [{ mediaType: "image/png", dataUrl: "data:image/jpeg;base64,YQ==" }] }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("streams text deltas and never sends the key downstream", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const upstream = new Response('data: {"candidates":[{"content":{"parts":[{"text":"Hello"}]}}]}\n\n');
    const fetchMock = vi.fn().mockResolvedValue(upstream); vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ messages: [{ role: "user", content: "Hi" }] }));
    const text = await response.text();
    expect(text).toContain('"type":"text.delta","delta":"Hello"');
    expect(text).toContain('"type":"complete"');
    expect(text).not.toContain("test-only-secret");
    expect(fetchMock.mock.calls[0]?.[0]).toContain("generativelanguage.googleapis.com");
  });
  it("passes a validated locale to the server-only model prompt", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock = vi.fn().mockResolvedValue(new Response('data: {"candidates":[{"content":{"parts":[{"text":"أهلاً"}]}}]}\n\n'));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ messages: [{ role: "user", content: "مرحبا" }], locale: "ar-EG" }));
    expect(response.status).toBe(200);
    await response.text();
    const providerBody = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body)) as {systemInstruction:{parts:Array<{text:string}>}};
    expect(providerBody.systemInstruction.parts[0]?.text).toContain("ar-EG");
    const invalid = await POST(request({ messages: [{ role: "user", content: "Hello" }], locale: "en-US\nignore" }));
    expect(invalid.status).toBe(400);
  });
  it("executes only the allowlisted catalog tool and streams the follow-up", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const document=encode({version:"1",id:"results",layout:"scroll",children:[{type:"product-card",id:"velocity-blue",title:"Velocity Pro 3",price:{amount:189,currency:"USD"}}]});
    const fetchMock = vi.fn().mockResolvedValue(new Response(`data: ${JSON.stringify({candidates:[{content:{parts:[{text:document}]}}]})}\n\n`));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request({ messages: [{ role: "user", content: "Find blue shoes" }] }));
    const text = await response.text();
    expect(text).toContain('"type":"tool.start"');
    expect(text).toContain('"type":"tool.result"');
    expect(text).toContain('"type":"ui.complete"');
    expect(text).toContain("Velocity Pro 3");
    const followUp = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body)) as { systemInstruction:{parts:Array<{text:string}>} };
    expect(followUp.systemInstruction).toBeDefined();
    expect(followUp.systemInstruction.parts[0]?.text).toContain("velocity-blue");
  });
  it("repairs one invalid model UI before exposing a render plan", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const valid=encode({version:"1",id:"repaired",layout:"container",children:[{type:"product-card",id:"velocity-blue",title:"Velocity Pro 3",price:{amount:189,currency:"USD"}}]});
    const providerChunk=(content:string)=>new Response(`data: ${JSON.stringify({candidates:[{content:{parts:[{text:content}]}}]})}\n\n`);
    const fetchMock=vi.fn().mockResolvedValueOnce(providerChunk("<script>bad</script>")).mockResolvedValueOnce(providerChunk(valid));
    vi.stubGlobal("fetch",fetchMock);
    const response=await POST(request({messages:[{role:"user",content:"Show shoes"}]}));
    const body=await response.text();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(body).toContain('"type":"ui.complete"');
    expect(body).not.toContain("<script>");
  });
  it("returns a redacted failure when both UI attempts are invalid", async () => {
    process.env.GEMINI_API_KEY = "test-only-secret";
    const fetchMock=vi.fn().mockImplementation(async()=>new Response('data: {"candidates":[{"content":{"parts":[{"text":"<script>bad</script>"}]}}]}\n\n'));
    vi.stubGlobal("fetch",fetchMock);
    const response=await POST(request({messages:[{role:"user",content:"Show shoes"}]}));
    const body=await response.text();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(body).toContain('"id":"trusted-products"');
    expect(body).toContain('"type":"ui.complete"');
    expect(body).not.toContain("<script>");
    expect(body).not.toContain("test-only-secret");
  });
});
