import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {generateGemini,streamGemini} from "./gemini-provider";
describe("Gemini failures and streams",()=>{
  beforeEach(()=>vi.stubEnv("GEMINI_API_KEY","private-test-key"));
  afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs()});
  it("retries a transient overload once before streaming",async()=>{
    const fetcher=vi.fn().mockResolvedValueOnce(new Response(null,{status:503})).mockResolvedValueOnce(new Response('data: {"candidates":[{"content":{"parts":[{"thought":true,"text":"private"},{"text":"Hello"}]}}]}\n'));
    vi.stubGlobal("fetch",fetcher);const records:string[]=[];let text="";
    for await(const delta of streamGemini([{role:"user",content:"hi"}],new AbortController().signal,"gemini-3.1-flash-lite",r=>records.push(r.name)))text+=delta;
    expect(text).toBe("Hello");expect(fetcher).toHaveBeenCalledTimes(2);expect(records).toContain("provider.retry");
  });
  it("does not retry missing models or quota failures",async()=>{
    for(const status of [404,429]){
      const fetcher=vi.fn().mockResolvedValue(new Response(null,{status}));vi.stubGlobal("fetch",fetcher);
      await expect(generateGemini("gemini-test",{},new AbortController().signal)).rejects.toMatchObject({status});
      expect(fetcher).toHaveBeenCalledTimes(1);
    }
  });
  it("redacts provider errors and stops after two attempts",async()=>{
    const fetcher=vi.fn().mockImplementation(()=>Promise.resolve(new Response("sensitive upstream details",{status:503})));vi.stubGlobal("fetch",fetcher);
    await expect(generateGemini("gemini-test",{},new AbortController().signal)).rejects.toThrow("temporarily overloaded");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
