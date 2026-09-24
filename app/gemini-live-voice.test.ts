import {afterEach,describe,it,expect,vi} from "vitest";
import {connectGeminiLive} from "./gemini-live-voice";
afterEach(()=>vi.unstubAllGlobals());
describe("native voice lifecycle",()=>{
  it("does not request a microphone after cancellation",async()=>{
    const getUserMedia=vi.fn();vi.stubGlobal("navigator",{mediaDevices:{getUserMedia}});
    const controller=new AbortController();controller.abort();
    await expect(connectGeminiLive({locale:"en-US",signal:controller.signal,onState:vi.fn(),onError:vi.fn()})).rejects.toMatchObject({name:"AbortError"});
    expect(getUserMedia).not.toHaveBeenCalled();
  });
  it("releases a microphone granted after the user exits",async()=>{
    let grant!:(stream:MediaStream)=>void;const stop=vi.fn();
    vi.stubGlobal("navigator",{mediaDevices:{getUserMedia:()=>new Promise<MediaStream>(resolve=>{grant=resolve})}});
    const controller=new AbortController();
    const call=connectGeminiLive({locale:"ar-EG",signal:controller.signal,onState:vi.fn(),onError:vi.fn()});
    controller.abort();grant({getTracks:()=>[{stop}]} as unknown as MediaStream);
    await expect(call).rejects.toMatchObject({name:"AbortError"});expect(stop).toHaveBeenCalledOnce();
  });
});
