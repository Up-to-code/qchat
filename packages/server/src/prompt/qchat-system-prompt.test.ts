import { describe,expect,it } from "vitest";
import { composeSystemPrompt,QCHAT_SYSTEM_PROMPT } from "./qchat-system-prompt";
describe("composeSystemPrompt",()=>{
  it("uses the protected default by default",()=>expect(composeSystemPrompt(true,undefined)).toBe(QCHAT_SYSTEM_PROMPT));
  it("appends host instructions without replacing the default",()=>{const result=composeSystemPrompt(true,"Be concise.");expect(result).toContain(QCHAT_SYSTEM_PROMPT);expect(result).toContain("Be concise.")});
  it("allows a host-only prompt when the default is disabled",()=>expect(composeSystemPrompt(false,"Host policy")).toBe("Host policy"));
  it("rejects empty host-only configuration",()=>expect(()=>composeSystemPrompt(false," ")).toThrow());
  it("rejects control characters",()=>expect(()=>composeSystemPrompt(true,"unsafe\u0000prompt")).toThrow());
});
