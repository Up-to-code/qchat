"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUp, AudioLines, ChevronDown, ImagePlus, LoaderCircle, Mic, Plus, Square, X } from "lucide-react";
import type { QChatMessageRecord } from "@qchat/core";
import { useQChatComposer, useQChatRecordPerformance, useQChatConfig, useQChatLocale, useQChatMessages, useQChatRunState, useQChatTools, type QChatAttachment } from "@qchat/react";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputTextarea, PromptInputTools, PromptInputButton, usePromptInputAttachments } from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { CollapsibleContent } from "@/components/ui/collapsible";
import FluidOrb from "@/components/ui/fluid-orb";
import { showcaseAttachmentPolicy,showcaseComposerRules,showcaseTheme } from "./showcase-config";
import { resolveComposerPrimaryAction } from "./composer-primary-action";
import { prepareImageAttachment,visibleAttachmentCount } from "./composer-uploads";
import { voiceFailureMessage } from "./voice-permission";


const examples = [
  "Show four blue running shoes",
  "Show a vertical product list",
  "Show products with no matches",
  "Show unavailable products",
  "Show a validation fallback",
  "Simulate an agent failure",
  "Plan a trip to Cairo",
  "Compare family health insurance options",
  "اعرض رحلة إلى القاهرة",
  "قارن خطط التأمين الصحي للعائلة",
];

export function ElementsMessage({ message }: { readonly message: QChatMessageRecord }) {
  const {t,locale}=useQChatLocale();
  if (message.role === "assistant" && !message.content.trim()) return null;
  const time = new Date(message.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
  const sampleArabic:Readonly<Record<string,string>>={a:"أخبرني عمّا تبحث عنه وسأعرض لك الخيارات المناسبة.",u:"اعرض أحذية جري زرقاء خفيفة بأقل من ٢٠٠ دولار مع خيارات اللون والمقاس.",result:"إليك أربعة خيارات. اختر اللون والمقاس للمقارنة.","host-intro":"هذه الواجهة مقدّمة من التطبيق المضيف، وليست من النموذج."};
  const content=locale.direction==="rtl"?sampleArabic[message.id]??message.content:message.content;
  return <Message from={message.role === "system" ? "assistant" : message.role} className="elements-message">
    <div className="qchat-meta"><span>{message.role === "user" ? t("you") : "QChat"}</span><time>{time}</time></div>
    {Boolean(message.attachments?.length)&&<div className="elements-message-attachments" aria-label="Message attachments">{message.attachments?.map((attachment,index)=><div className={`elements-message-attachment is-${attachment.kind}`} key={`${message.id}-${index}`}>{attachment.kind==="image"&&attachment.previewUrl?<img src={attachment.previewUrl} alt={attachment.filename??"Attached image"}/>:<span>{attachment.filename??"Attached file"}</span>}</div>)}</div>}
    {Boolean(content.trim())&&<MessageContent className="elements-message-content" dir="auto">{message.role === "assistant" ? <MessageResponse>{content}</MessageResponse> : content}</MessageContent>}
    {message.role === "user" && <span className="qchat-read">{t("read")}</span>}
  </Message>;
}

export function ElementsThinking() {
  const { reasoning, status } = useQChatRunState();
  const {t,locale}=useQChatLocale();
  const messages=useQChatMessages();
  const tools = useQChatTools();
  if (!reasoning && tools.length === 0) return status==="running"&&!messages.at(-1)?.content.trim()?<p className="qchat-waiting" role="status">{locale.direction==="rtl"?"في انتظار الرد":"Waiting for response"}</p>:null;
  const seconds = Math.max(1, Math.ceil((reasoning?.elapsedMs ?? 0) / 1000));
  const activeTool=tools.find((tool)=>tool.status==="running");
  const label = activeTool ? activeTool.name.replaceAll("_"," ") : reasoning?.label ?? (tools.length>0 ? `${tools.length} ${tools.length===1?"tool":"tools"}` : t("thinking"));
  return <Reasoning className="elements-reasoning" isStreaming={status === "running"} duration={seconds} defaultOpen={false}>
    <ReasoningTrigger aria-label="Toggle activity details"><span className={status==="running"?"qchat-waiting":undefined}>{label}{reasoning&&status!=="running"?` · ${seconds} ${t(seconds===1?"second":"seconds")}`:""}</span><ChevronDown size={13}/></ReasoningTrigger>
    <CollapsibleContent className="elements-thinking-content">
      {tools.length > 0 ? <ol className="elements-thinking-steps">{tools.map((tool) => <li key={tool.id}><span className="elements-step-mark">{tool.status === "running" ? "·" : tool.status === "error" ? "!" : "✓"}</span><span><strong>{tool.name.replaceAll("_", " ")}</strong>{tool.summary && <small>{tool.summary}</small>}</span></li>)}</ol> : <p>{reasoning?.label ?? "Working through the request"}</p>}
    </CollapsibleContent>
  </Reasoning>;
}

export function ElementsComposer() {
  const { draft, setDraft, setAttachments, submit, cancel, status } = useQChatComposer();
  const {locale,t}=useQChatLocale();
  const language=locale.code;
  const [open, setOpen] = useState(false);
  const browserVoice = useSyncExternalStore(subscribeVoiceAvailability, getVoiceAvailability, () => false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceProgress,setVoiceProgress]=useState("");
  const [voiceInput,setVoiceInput]=useState({level:0,elapsedMs:0,device:""});
  const recordPerformance=useQChatRecordPerformance();
  const voiceSession=useRef("");
  const recordVoice=useCallback((name:string,durationMs:number)=>recordPerformance({name,durationMs,runId:voiceSession.current,timestamp:new Date().toISOString(),attributes:{layer:"voice"}}),[recordPerformance]);
  const [attachmentCount,setAttachmentCount] = useState(0);
  const [uploadState,setUploadState] = useState<{ready:readonly QChatAttachment[];busy:boolean;error:boolean}>({ready:[],busy:false,error:false});
  const config=useQChatConfig();
  const canVoice=browserVoice&&Boolean(config.voice?.connect);
  const permissionPending=useRef(false);
  const voiceRequest=useRef(0);
  const attachmentPolicy=config.attachments??showcaseAttachmentPolicy;
  const direction = locale.direction;
  const recorder = useRef<MediaRecorder|null>(null);
  const audioStream = useRef<MediaStream|null>(null);
  const voiceController=useRef<AbortController|null>(null);
  const voiceModeRef = useRef(false);
  useEffect(() => {
    return () => { voiceRequest.current++;voiceModeRef.current = false;  if(recorder.current?.state==="recording")recorder.current.stop(); audioStream.current?.getTracks().forEach((track)=>track.stop()); voiceController.current?.abort();  };
  }, []);
  const stopVoiceMode = useCallback(() => {
    voiceRequest.current++;

    voiceModeRef.current = false;

    voiceController.current?.abort();
    if(recorder.current?.state==="recording")recorder.current.stop();
    audioStream.current?.getTracks().forEach((track)=>track.stop());

    setVoiceMode(false);
    setListening(false);
    setSpeaking(false);
    setVoiceProgress("");
  }, []);
  const startRecognition=useCallback(async(_mode:"dictation")=>{
    if(permissionPending.current||!config.voice?.transcribe)return;
    permissionPending.current=true;setVoiceError("");voiceSession.current=crypto.randomUUID();
    const requestId=++voiceRequest.current;const controller=new AbortController();voiceController.current=controller;
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(requestId!==voiceRequest.current||controller.signal.aborted){stream.getTracks().forEach(track=>track.stop());return}
      audioStream.current=stream;
      const preferred=["audio/webm;codecs=opus","audio/mp4"].find(value=>MediaRecorder.isTypeSupported(value));
      const capture=new MediaRecorder(stream,preferred?{mimeType:preferred}:undefined);const chunks:Blob[]=[];
      capture.ondataavailable=event=>{if(event.data.size)chunks.push(event.data)};
      capture.onstop=()=>{
        stream.getTracks().forEach(track=>track.stop());setListening(false);if(controller.signal.aborted||!chunks.length)return;
        void config.voice!.transcribe!(new Blob(chunks,{type:capture.mimeType}),language,controller.signal,(label,metric)=>{setVoiceProgress(label);if(metric)recordVoice(metric.name,metric.durationMs)})
          .then(text=>{if(!controller.signal.aborted)setDraft(draft?`${draft} ${text}`:text)})
          .catch((error:unknown)=>{if(!controller.signal.aborted)setVoiceError(error instanceof Error?error.message:"Dictation failed.")})
          .finally(()=>{if(!controller.signal.aborted)setVoiceProgress("")});
      };
      capture.onerror=()=>{controller.abort();stream.getTracks().forEach(track=>track.stop());setListening(false);setVoiceError("Microphone recording failed.")};
      recorder.current=capture;capture.start();setListening(true);
    }catch(error){setVoiceError(voiceFailureMessage(error))}finally{permissionPending.current=false}
  },[config.voice,language,draft,setDraft,recordVoice]);
  const startVoiceMode = () => {
    if (!canVoice) return;
    if(!config.voice?.connect){setVoiceError("Configure a live voice provider to start a call.");return}
    if(voiceController.current&&!voiceController.current.signal.aborted)voiceController.current.abort();
    const controller=new AbortController();voiceController.current=controller;
    voiceSession.current=crypto.randomUUID();setVoiceError("");setVoiceMode(true);voiceModeRef.current=true;
    void config.voice.connect({
      locale:language,signal:controller.signal,
      onState:(state)=>{if(controller.signal.aborted)return;setListening(state==="listening");setSpeaking(state==="speaking");setVoiceProgress(state==="permission"?(language.startsWith("ar")?"السماح بالميكروفون…":"Waiting for microphone permission…"):state==="connecting"?(language.startsWith("ar")?"جارٍ الاتصال…":"Connecting…"):"");if(state==="closed"){setVoiceMode(false);voiceModeRef.current=false}},
      onError:(message)=>{setVoiceError(message);setVoiceMode(false);voiceModeRef.current=false},
      onLevel:(level,elapsedMs,device)=>setVoiceInput({level,elapsedMs,device}),
      onMetric:recordVoice,
    }).catch((error:unknown)=>{if(!controller.signal.aborted){stopVoiceMode();setVoiceError(error instanceof Error?error.message:"Live voice connection failed.")}});

  };
  const running = status === "running";
  const primaryAction = attachmentCount > 0 && status !== "running" ? "send" : resolveComposerPrimaryAction(status, draft, canVoice);
  return <>
  {voiceMode && <div className="elements-voice-stage" aria-live="polite"><FluidOrb size={96} color={showcaseTheme.voiceAccent} className="elements-voice-orb" aria-hidden="true"/><p>{listening ? t("listening") : voiceProgress || (speaking ? t("speaking") : (language.startsWith("ar")?"في انتظار الرد":"Waiting for response"))}</p>{listening&&<div className="elements-input-meter"><small>{voiceInput.device} · {(voiceInput.elapsedMs/1000).toFixed(0)}s</small><meter min={0} max={1} value={voiceInput.level} aria-label={language.startsWith("ar")?"مستوى الميكروفون":"Microphone input level"}/></div>}{recorder.current?.state==="recording"&&<button type="button" className="elements-voice-finish" onClick={()=>recorder.current?.stop()}>{language.startsWith("ar")?"انتهيت من التحدث":"Finish speaking"}</button>}<a href="https://rareui.com" target="_blank" rel="noopener noreferrer">Orb by Rare UI</a></div>}
  <div className="elements-composer-wrap">
    {open && <div className="elements-examples" role="group" aria-label="Example prompts">{examples.map((example) => <button key={example} type="button" onClick={() => { setDraft(example); setOpen(false); }}>{example}</button>)}</div>}
    <PromptInput className="elements-composer" accept={attachmentPolicy.acceptedMimeTypes.join(",")} multiple maxFiles={attachmentPolicy.maxFiles} maxFileSize={attachmentPolicy.maxFileSizeBytes} convertFilesOnSubmit={false} onError={(error)=>setVoiceError(error.message)} onSubmit={async ({ text }) => { if (running || uploadState.busy || uploadState.error || uploadState.ready.length!==attachmentCount || (!text.trim() && attachmentCount===0)) throw new Error("Attachments must finish processing before sending."); setVoiceError("");setDraft(text); setAttachments(uploadState.ready); await submit(); }}>
      <PromptInputBody><ComposerImages onCountChange={setAttachmentCount} onStateChange={setUploadState}/><PromptInputTextarea dir={direction} aria-label="Message QChat" placeholder={t("messagePlaceholder")} value={draft} onChange={(event) => { if (voiceMode) stopVoiceMode(); setDraft(event.currentTarget.value); }} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}/></PromptInputBody>
      <PromptInputFooter><PromptInputTools><PromptInputButton aria-label={t("examplePrompts")} aria-expanded={open} onClick={() => setOpen((value) => !value)} type="button" variant="ghost"><Plus size={17}/></PromptInputButton><ComposerAddImage/></PromptInputTools><div className="elements-composer-end">{showcaseComposerRules.allowDictation && canVoice && !voiceMode && <PromptInputButton aria-label={listening ? t("stopDictation") : t("startDictation")} aria-pressed={listening} onClick={() => listening ? recorder.current?.stop() : startRecognition("dictation")} type="button" variant="ghost"><Mic size={16}/></PromptInputButton>}{primaryAction === "stop" ? <PromptInputButton size="icon-sm" className="elements-primary-action is-running" type="button" aria-label={t("stopGeneration")} onClick={() => { cancel(); if (voiceMode) stopVoiceMode(); }}><LoaderCircle className="elements-loading-ring" size={28}/><Square size={11} fill="currentColor"/></PromptInputButton> : voiceMode ? <PromptInputButton size="icon-sm" className="elements-primary-action" type="button" aria-label={t("exitVoiceMode")} onClick={stopVoiceMode}><X size={17}/></PromptInputButton> : primaryAction === "send" ? <PromptInputButton size="icon-sm" className="elements-primary-action" type="submit" disabled={uploadState.busy||uploadState.error||uploadState.ready.length!==attachmentCount} aria-label={t("sendMessage")}><ArrowUp size={18}/></PromptInputButton> : <PromptInputButton size="icon-sm" className="elements-primary-action" type="button" aria-label={t("startVoiceMode")} title={canVoice?undefined:"Voice requires a configured transcription adapter"} disabled={!canVoice || !showcaseComposerRules.allowVoiceMode} onClick={startVoiceMode}><AudioLines size={18}/></PromptInputButton>}</div></PromptInputFooter>
    </PromptInput>
    {voiceError && <p className="elements-voice-error" role="alert">{voiceError}</p>}
    {!voiceMode&&voiceProgress&&<p className="qchat-waiting" role="status">{voiceProgress}</p>}
  </div></>;
}

function ComposerAddImage(){const images=usePromptInputAttachments();const {t}=useQChatLocale();return <PromptInputButton aria-label={t("addImage")} type="button" variant="ghost" onClick={()=>images.openFileDialog()}><ImagePlus size={16}/></PromptInputButton>}
function ComposerImages({onCountChange,onStateChange}:{readonly onCountChange:(count:number)=>void;readonly onStateChange:(state:{ready:readonly QChatAttachment[];busy:boolean;error:boolean})=>void}){
  const images=usePromptInputAttachments();
  const policy=useQChatConfig().attachments??showcaseAttachmentPolicy;
  const [states,setStates]=useState<Record<string,{status:"loading"|"ready"|"error";progress:number;attachment?:QChatAttachment}>>({});
  const uploadControllers=useRef(new Map<string,AbortController>());
  const files=images.files;
  const ids=files.map((file)=>file.id).join("|");
  useEffect(()=>{
    const active=new Set(files.map((file)=>file.id));
    for(const [id,controller] of uploadControllers.current)if(!active.has(id)){controller.abort();uploadControllers.current.delete(id)}
    setStates((previous)=>Object.fromEntries(Object.entries(previous).filter(([id])=>active.has(id))));
    for(const file of files){
      if(states[file.id]||uploadControllers.current.has(file.id))continue;
      const controller=new AbortController();
      uploadControllers.current.set(file.id,controller);
      setStates((previous)=>({...previous,[file.id]:{status:"loading",progress:0}}));
      void (async()=>{try{
        if(!file.url)throw new Error("Attachment preview is unavailable.");
        const blob=await fetch(file.url,{signal:controller.signal}).then((response)=>response.blob());
        const input=new File([blob],file.filename??"attachment",{type:file.mediaType});
        const attachment=await (policy.processFile??prepareImageAttachment)(input,{signal:controller.signal,onProgress:(progress)=>setStates((previous)=>({...previous,[file.id]:{status:"loading",progress}}))});
        if(!controller.signal.aborted)setStates((previous)=>({...previous,[file.id]:{status:"ready",progress:100,attachment}}));
      }catch{if(!controller.signal.aborted)setStates((previous)=>({...previous,[file.id]:{status:"error",progress:0}}));}})();
    }
  },[ids]);
  useEffect(()=>()=>{for(const controller of uploadControllers.current.values())controller.abort()},[]);
  useEffect(()=>{onCountChange(files.length);onStateChange({ready:files.flatMap((file)=>states[file.id]?.attachment?[states[file.id]!.attachment!]:[]),busy:files.some((file)=>!states[file.id]||states[file.id]?.status==="loading"),error:files.some((file)=>states[file.id]?.status==="error")});},[ids,states,onCountChange,onStateChange]);
  if(files.length===0)return null;
  const visible=visibleAttachmentCount(files.length,policy.maxVisible??4);
  return <div className="elements-images" aria-label="Attached files">{files.slice(0,visible).map((file)=><div key={file.id} className="elements-image">{file.mediaType.startsWith("image/")&&file.url?<img src={file.url} alt={file.filename??"Attached image"}/>:<span className="elements-file-label">{file.filename??"File"}</span>}{states[file.id]?.status==="loading"&&<span className="elements-upload-progress" role="status" aria-label={`Processing ${file.filename??"file"}`}><LoaderCircle size={24}/><small>{states[file.id]?.progress??0}%</small></span>}{states[file.id]?.status==="error"&&<span className="elements-upload-error">!</span>}<button type="button" aria-label={`Remove ${file.filename??"file"}`} onClick={()=>images.remove(file.id)}><X size={13}/></button></div>)}{files.length>visible&&<div className="elements-image elements-image-overflow" aria-label={`${files.length-visible} more attachments`}>+{files.length-visible}</div>}</div>;
}

function subscribeVoiceAvailability() { return () => {}; }
function getVoiceAvailability() { return typeof window !== "undefined" && Boolean(navigator.mediaDevices && typeof window.AudioContext!=="undefined"); }
