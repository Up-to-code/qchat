import {describe,it,expect,vi} from "vitest";
import {requestMicrophonePermission,voiceFailureMessage} from "./voice-permission";
describe("microphone permission",()=>{
  it("requests audio permission and releases every probe track",async()=>{const stop=vi.fn();const getUserMedia=vi.fn().mockResolvedValue({getTracks:()=>[{stop}]});await requestMicrophonePermission({getUserMedia});expect(getUserMedia).toHaveBeenCalledWith({audio:true});expect(stop).toHaveBeenCalledOnce()});
  it("propagates denial so the caller cannot activate listening",async()=>{const error=new DOMException("Denied","NotAllowedError");await expect(requestMicrophonePermission({getUserMedia:vi.fn().mockRejectedValue(error)})).rejects.toBe(error);expect(voiceFailureMessage(error)).toContain("permission was denied")});
  it("distinguishes network failure from microphone denial",()=>expect(voiceFailureMessage({error:"network"})).toContain("could not connect"));
  it("rejects unsupported browsers before activation",async()=>{await expect(requestMicrophonePermission(undefined)).rejects.toThrow("unavailable")});
});
