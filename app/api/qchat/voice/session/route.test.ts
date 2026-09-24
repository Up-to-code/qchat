import {describe,it,expect,vi,afterEach} from "vitest";
const create=vi.hoisted(()=>vi.fn());
vi.mock("@google/genai",()=>({Modality:{AUDIO:"AUDIO"},GoogleGenAI:class{authTokens={create}}}));
import {POST} from "./route";
afterEach(()=>{vi.unstubAllEnvs();create.mockReset()});
describe("live token provisioning",()=>{
  it("rejects cross-origin access before issuing tokens",async()=>{
    const response=await POST(new Request("http://localhost/api/qchat/voice/session",{method:"POST",headers:{origin:"https://evil.example"}}));
    expect(response.status).toBe(403);expect(create).not.toHaveBeenCalled();
  });
  it("issues a constrained one-use token without exposing the permanent key",async()=>{
    vi.stubEnv("GEMINI_API_KEY","permanent-private-key");create.mockResolvedValue({name:"auth_tokens/short-lived"});
    const response=await POST(new Request("http://localhost/api/qchat/voice/session",{method:"POST",body:JSON.stringify({locale:"es-ES"})}));
    expect(response.status).toBe(200);expect(response.headers.get("cache-control")).toBe("no-store");
    const text=await response.text();expect(text).not.toContain("permanent-private-key");expect(text).toContain("short-lived");
    expect(create.mock.calls[0]?.[0]).toMatchObject({config:{uses:1,liveConnectConstraints:{config:{responseModalities:["AUDIO"]}}}});
  });
  it("does not expose upstream error details",async()=>{
    vi.stubEnv("GEMINI_API_KEY","permanent-private-key");create.mockRejectedValue(new Error("secret"));
    const response=await POST(new Request("http://localhost/api/qchat/voice/session",{method:"POST",body:JSON.stringify({locale:"en-US"})}));
    expect(response.status).toBe(502);expect(await response.text()).not.toContain("secret");
  });
});
