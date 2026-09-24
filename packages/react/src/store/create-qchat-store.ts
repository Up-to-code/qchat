import { createStore } from "zustand/vanilla";
import type { QChatAgentEvent,QChatMessageRecord,QChatUIDocument } from "@qchat/core";
import type { QChatClient,QChatStoreState,QChatToolState } from "../interfaces/react.interfaces";
const id=()=>globalThis.crypto?.randomUUID?.()??Math.random().toString(36).slice(2);
export function createQChatStore(client:QChatClient,initialMessages:readonly QChatMessageRecord[],conversationId:string,initialDocument?:QChatUIDocument,initialTools:readonly QChatToolState[]=[],initialLocale="en-US"){
  let controller:AbortController|undefined;let ticker:ReturnType<typeof setInterval>|undefined;let activeRunId=initialDocument?id():"";
  return createStore<QChatStoreState>((set,get)=>({
    messages:initialMessages,draft:"",attachments:[],locale:initialLocale,status:"idle",tools:initialTools,document:initialDocument,generatingUI:false,performance:[],selections:{},
    recordPerformance:(record)=>set((state)=>({performance:[...state.performance.slice(-199),record]})),
    setDraft:(draft)=>set({draft}),setAttachments:(attachments)=>set({attachments}),setLocale:(locale)=>set({locale}),select:(key,value)=>set((state)=>({selections:{...state.selections,[key]:value}})),
    cancel:()=>controller?.abort(),
    dispatchAction:async(action)=>client.action({...action,conversationId,runId:activeRunId}),
    submit:async()=>{
      const text=get().draft.trim();const attachments=get().attachments;if((!text&&attachments.length===0)||controller)return;
      const runStarted=performance.now();let firstEvent=true;let firstText=true;let maxApplyMs=0;let terminal=false;
      activeRunId=id();controller=new AbortController();const user:QChatMessageRecord={id:id(),role:"user",content:text,createdAt:new Date().toISOString(),attachments:attachments.map((attachment)=>({kind:attachment.kind,mediaType:attachment.mediaType,filename:attachment.filename,...(attachment.kind==="image"?{previewUrl:attachment.dataUrl}:{})}))};const assistantId=id();
      const next=[...get().messages,user];set({messages:[...next,{id:assistantId,role:"assistant",content:"",createdAt:new Date().toISOString()}],draft:"",attachments:[],status:"running",error:undefined,document:undefined,tools:[],generatingUI:false,reasoning:undefined});
      ticker=setInterval(()=>set((state)=>state.reasoning?{reasoning:{...state.reasoning,elapsedMs:Date.now()-state.reasoning.startedAt}}:{}),100);
      const record=(name:string,durationMs:number,attributes:Readonly<Record<string,string|number|boolean>>={})=>get().recordPerformance({name,durationMs,runId:activeRunId,timestamp:new Date().toISOString(),attributes:{layer:"runtime",...attributes}});
      try{for await(const event of client.run({messages:next,attachments,locale:get().locale,conversationId,runId:activeRunId,signal:controller.signal})){if(controller.signal.aborted)break;if(firstEvent){record("runtime.first_event",performance.now()-runStarted);firstEvent=false}if(event.type==="text.delta"&&firstText){record("runtime.first_text",performance.now()-runStarted,{receivedAt:Date.now(),messageId:assistantId});firstText=false}if(terminal&&event.type!=="performance")continue;if(event.type==="complete"||event.type==="failure")terminal=true;const applyStarted=performance.now();applyEvent(event,assistantId,set);maxApplyMs=Math.max(maxApplyMs,performance.now()-applyStarted)}}catch{if(controller.signal.aborted)set({status:"idle",reasoning:undefined,generatingUI:false});else set({status:"error",error:{code:"ADAPTER_FAILED",message:"The agent run failed.",retryable:true},generatingUI:false});record("runtime.error",performance.now()-runStarted,{cancelled:controller.signal.aborted})}finally{if(controller.signal.aborted)set({status:"idle",reasoning:undefined,generatingUI:false,error:undefined});record("runtime.max_dispatch",maxApplyMs);record("runtime.total",performance.now()-runStarted);if(ticker)clearInterval(ticker);ticker=undefined;controller=undefined;if(get().status==="running")set({status:"error",generatingUI:false,error:{code:"ADAPTER_FAILED",message:"The agent stream ended before completion.",retryable:true}})}
    }
  }))
}
type Setter=(partial:Partial<QChatStoreState>|((state:QChatStoreState)=>Partial<QChatStoreState>))=>void;
function applyEvent(event:QChatAgentEvent,assistantId:string,set:Setter){
  switch(event.type){
    case "text.delta":set((state)=>({messages:state.messages.map((message)=>message.id===assistantId?{...message,content:message.content+event.delta}:message)}));break;
    case "reasoning.status":set((state)=>({reasoning:{label:event.label,startedAt:state.reasoning?.startedAt??Date.now(),elapsedMs:event.elapsedMs??state.reasoning?.elapsedMs??0}}));break;
    case "tool.start":set((state)=>({tools:[...state.tools,{id:event.toolCallId,name:event.name,status:"running"}]}));break;
    case "tool.result":set((state)=>({tools:state.tools.map((tool)=>tool.id===event.toolCallId?{...tool,status:"complete",summary:event.summary}:tool)}));break;
    case "tool.error":set((state)=>({tools:state.tools.map((tool)=>tool.id===event.toolCallId?{...tool,status:"error",summary:event.message}:tool)}));break;
    case "ui.start":set({generatingUI:true});break;
    case "ui.complete":set({document:event.document,generatingUI:false});break;
    case "performance":set((state)=>({performance:[...state.performance.slice(-199),event.record]}));break;
    case "failure":set({status:"error",error:event.error,generatingUI:false});break;
    case "complete":set({status:"idle",generatingUI:false});break;
  }
}
