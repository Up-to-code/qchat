import {GoogleGenAI,type Session,type LiveServerMessage,type LiveConnectConfig} from "@google/genai";
import type {QChatLiveVoiceOptions} from "@qchat/react";
/** Owns the entire call lifecycle; no transcript -> chat -> TTS cascade. */
export async function connectGeminiLive(options:QChatLiveVoiceOptions):Promise<{close():void}>{
  const {signal,onState,onLevel,onMetric}=options;
  const started=performance.now();
  let stream:MediaStream|undefined,input:AudioContext|undefined,output:AudioContext|undefined,session:Session|undefined;
  let capture:AudioWorkletNode|undefined,source:MediaStreamAudioSourceNode|undefined,closed=false,nextAudio=0;
  const playing=new Set<AudioBufferSourceNode>();
  const stopPlayback=()=>{for(const node of playing){node.onended=null;node.stop()}playing.clear();nextAudio=0};
  const close=()=>{
    if(closed)return;closed=true;signal.removeEventListener("abort",close);
    capture?.disconnect();source?.disconnect();stream?.getTracks().forEach(track=>track.stop());
    stopPlayback();session?.close();void input?.close();void output?.close();
    onState("closed");
  };
  const fail=(message:string)=>{close();options.onError(message)};
  signal.addEventListener("abort",close,{once:true});
  try{
    if(signal.aborted)throw new DOMException("Aborted","AbortError");
    onState("permission");
    stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    if(closed){stream.getTracks().forEach(track=>track.stop());throw new DOMException("Aborted","AbortError")}
    onMetric?.("voice.live.permission",performance.now()-started);
    input=new AudioContext({sampleRate:16000});output=new AudioContext({sampleRate:24000});
    await Promise.all([input.resume(),output.resume(),input.audioWorklet.addModule("/qchat-audio-worklet.js")]);
    onState("connecting");
    const response=await fetch("/api/qchat/voice/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({locale:options.locale}),signal});
    const payload=await response.json() as {token?:string;model?:string;config?:LiveConnectConfig;error?:string};
    if(!response.ok||!payload.token||!payload.model)throw new Error(payload.error??"Live voice session is unavailable.");
    const ai=new GoogleGenAI({apiKey:payload.token,httpOptions:{apiVersion:"v1alpha"}});
    let firstAudio=true;
    const onmessage=(message:LiveServerMessage)=>{
      if(closed||!output)return;
      const content=message.serverContent;
      if(content?.interrupted){stopPlayback();onState("listening")}
      for(const part of content?.modelTurn?.parts??[]){
        const data=part.inlineData;if(!data?.data||!data.mimeType?.startsWith("audio/pcm"))continue;
        if(firstAudio){onMetric?.("voice.live.first_audio",performance.now()-started);firstAudio=false}
        const bytes=Uint8Array.from(atob(data.data),char=>char.charCodeAt(0));
        const view=new DataView(bytes.buffer);const rate=Number(/rate=(\d+)/.exec(data.mimeType)?.[1]??24000);
        const buffer=output.createBuffer(1,Math.floor(bytes.length/2),rate);const channel=buffer.getChannelData(0);
        for(let i=0;i<channel.length;i++)channel[i]=view.getInt16(i*2,true)/32768;
        const node=output.createBufferSource();node.buffer=buffer;node.connect(output.destination);
        nextAudio=Math.max(nextAudio,output.currentTime);node.start(nextAudio);nextAudio+=buffer.duration;playing.add(node);onState("speaking");
        node.onended=()=>{playing.delete(node);if(!closed&&playing.size===0)onState("listening")};
      }
      if(message.goAway)fail("The provider is ending this voice session. Start a new call.");
    };
    session=await ai.live.connect({model:payload.model,config:payload.config,callbacks:{onmessage,onerror:()=>fail("Gemini Live connection failed. Start a new call."),onclose:event=>{if(!closed)fail(`Gemini Live disconnected (${event.code}). Start a new call.`)}}});
    if(closed){session.close();throw new DOMException("Aborted","AbortError")}
    onMetric?.("voice.live.connected",performance.now()-started);
    source=input.createMediaStreamSource(stream);capture=new AudioWorkletNode(input,"qchat-capture");
    capture.port.onmessage=(event:MessageEvent<{buffer:ArrayBuffer;level:number}>)=>{
      if(closed)return;
      onLevel?.(event.data.level,performance.now()-started,stream?.getAudioTracks()[0]?.label??"Microphone");
      const bytes=new Uint8Array(event.data.buffer);let raw="";for(const byte of bytes)raw+=String.fromCharCode(byte);
      try{session?.sendRealtimeInput({audio:{data:btoa(raw),mimeType:"audio/pcm;rate=16000"}})}catch{fail("The live audio connection was interrupted.")}
    };
    source.connect(capture);capture.connect(input.destination);
    onState("listening");
    return {close};
  }catch(error){close();throw error}
}
