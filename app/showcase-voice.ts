import type { QChatVoiceAdapter } from "@qchat/react";
import {connectGeminiLive} from "./gemini-live-voice";

export const showcaseVoice: QChatVoiceAdapter = {
  connect:connectGeminiLive,
  preferRecording:true,
  async transcribe(audio, locale, signal,onProgress) {
    const started=performance.now();onProgress?.(locale.startsWith("ar")?"جارٍ تحويل الصوت إلى نص عبر Gemini…":"Transcribing with Gemini…");
    if (audio.size > 8_000_000) throw new Error("Recording is too long.");
    const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = () => reject(new Error("Could not read the recording.")); reader.readAsDataURL(audio); });
    const response = await fetch("/api/qchat/voice/transcribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data, format: audio.type.includes("wav")?"wav":audio.type.includes("ogg") ? "ogg" : audio.type.includes("mp4") ? "m4a" : "webm", locale }), signal });
    const result = await response.json() as { text?: unknown;error?:unknown;durationMs?:unknown };
    onProgress?.("",{name:"voice.transcription_roundtrip",durationMs:performance.now()-started});
    if(typeof result.durationMs==="number")onProgress?.("",{name:"voice.transcription_provider",durationMs:result.durationMs});
    if (!response.ok) throw new Error(typeof result.error==="string"?result.error:"Gemini transcription is unavailable.");
    if (typeof result.text !== "string" || !result.text.trim()) throw new Error("No speech was recognized.");
    return result.text.trim();
  },
  async speak(text, locale, signal,onProgress) {
    const started=performance.now();onProgress?.(locale.startsWith("ar")?"جارٍ إنشاء الصوت عبر Gemini…":"Generating speech with Gemini…");
    const response=await fetch("/api/qchat/voice/speak",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:text.slice(0,6000),locale}),signal});
    const result:unknown=await response.json();
    if(!result||typeof result!=="object")throw new Error("Invalid Gemini speech response.");
    if(!response.ok)throw new Error("error" in result&&typeof result.error==="string"?result.error:"Gemini speech generation failed.");
    if(!("data" in result)||typeof result.data!=="string"||!("mimeType" in result)||typeof result.mimeType!=="string"||!result.mimeType.startsWith("audio/L16"))throw new Error("Unsupported speech audio format.");
    onProgress?.("",{name:"voice.speech_roundtrip",durationMs:performance.now()-started});
    if("durationMs" in result&&typeof result.durationMs==="number")onProgress?.("",{name:"voice.speech_provider",durationMs:result.durationMs});
    const bytes=Uint8Array.from(atob(result.data),character=>character.charCodeAt(0));
    const rate=Number(/rate=(\d+)/.exec(result.mimeType)?.[1]??24000);const context=new AudioContext({sampleRate:rate});
    const buffer=context.createBuffer(1,Math.floor(bytes.length/2),rate);const output=buffer.getChannelData(0);const view=new DataView(bytes.buffer);for(let i=0;i<output.length;i++)output[i]=view.getInt16(i*2,true)/32768;
    return new Promise<void>((resolve, reject) => {
      const source=context.createBufferSource();source.buffer=buffer;source.connect(context.destination);
      let startedPlayback=false;
      const cleanup=()=>{signal.removeEventListener("abort",abort);void context.close()};
      const abort=()=>{source.onended=null;if(startedPlayback)source.stop();cleanup();reject(new DOMException("Aborted","AbortError"))};
      source.onended=()=>{cleanup();resolve()};signal.addEventListener("abort",abort,{once:true});
      if(signal.aborted){cleanup();reject(new DOMException("Aborted","AbortError"));return}
      void context.resume().then(()=>{if(signal.aborted)return;source.start();startedPlayback=true}).catch(()=>{cleanup();reject(new Error("Speech playback is blocked by the browser."))});
    });
  },
};
