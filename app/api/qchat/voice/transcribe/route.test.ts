import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { POST } from "./route";
const request=(data:unknown)=>new Request("http://localhost/api/qchat/voice/transcribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
const valid={data:"A".repeat(120),format:"webm",locale:"ar-EG"};
describe("Gemini voice graph",()=>{
  const oldKey=process.env.GEMINI_API_KEY;
  beforeEach(()=>{process.env.GEMINI_API_KEY="test-only-secret"});
  afterEach(()=>{vi.unstubAllGlobals();if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey});
  it("requires server credentials",async()=>{delete process.env.GEMINI_API_KEY;expect((await POST(request(valid))).status).toBe(503)});
  it("rejects malformed recordings before model execution",async()=>{const fetcher=vi.fn();vi.stubGlobal("fetch",fetcher);expect((await POST(request({...valid,format:"exe"}))).status).toBe(400);expect(fetcher).not.toHaveBeenCalled()});
  it("transcribes Arabic through Gemini without exposing credentials",async()=>{const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({candidates:[{content:{parts:[{text:"مرحبا"}]}}]})));vi.stubGlobal("fetch",fetcher);const response=await POST(request(valid));const result=await response.json() as {text:string;durationMs:number};expect(result.text).toBe("مرحبا");expect(result.durationMs).toBeGreaterThanOrEqual(0);expect(JSON.stringify(result)).not.toContain("test-only-secret");expect(fetcher.mock.calls[0]?.[0]).toContain("generativelanguage.googleapis.com")});
  it("exposes quota status without raw provider data",async()=>{vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response("secret upstream detail",{status:429})));const response=await POST(request(valid));expect(response.status).toBe(429);expect(await response.text()).not.toContain("secret upstream detail")});
});
