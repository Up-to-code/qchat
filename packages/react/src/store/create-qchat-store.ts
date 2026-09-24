import { createStore } from "zustand/vanilla";
import type { QChatAgentEvent,QChatMessageRecord } from "@qchat/core";
import type { QChatClient,QChatStoreState } from "../interfaces/react.interfaces";
const id=()=>globalThis.crypto?.randomUUID?.()??Math.random().toString(36).slice(2);
export function createQChatStore(client:QChatClient,initialMessages:readonly QChatMessageRecord[],conversationId:string){
  let controller:AbortController|undefined;let ticker:ReturnType<typeof setInterval>|undefined;let activeRunId="";
  return createStore<QChatStoreState>((set,get)=>({
    messages:initialMessages,draft:"",status:"idle",tools:[],generatingUI:false,performance:[],selections:{},
    setDraft:(draft)=>set({draft}),select:(key,value)=>set((state)=>({selections:{...state.selections,[key]:value}})),
    cancel:()=>controller?.abort(),
    dispatchAction:async(action)=>client.action({...action,conversationId,runId:activeRunId}),
    submit:async()=>{
      const text=get().draft.trim();if(!text||get().status==="running")return;
      activeRunId=id();controller=new AbortController();const user:QChatMessageRecord={id:id(),role:"user",content:text,createdAt:new Date().toISOString()};const assistantId=id();
      const next=[...get().messages,user];set({messages:[...next,{id:assistantId,role:"assistant",content:"",createdAt:new Date().toISOString()}],draft:"",status:"running",error:undefined,document:undefined,tools:[],generatingUI:false,reasoning:{label:"Thinking",startedAt:Date.now(),elapsedMs:0}});
      ticker=setInterval(()=>set((state)=>state.reasoning?{reasoning:{...state.reasoning,elapsedMs:Date.now()-state.reasoning.startedAt}}:{}),100);
      try{for await(const event of client.run({messages:next,conversationId,runId:activeRunId,signal:controller.signal}))applyEvent(event,assistantId,set)}finally{if(ticker)clearInterval(ticker);ticker=undefined;controller=undefined;if(get().status==="running")set({status:"idle",reasoning:undefined})}
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
    case "performance":set((state)=>({performance:[...state.performance,event.record]}));break;
    case "failure":set({status:"error",error:event.error,generatingUI:false,reasoning:undefined});break;
    case "complete":set({status:"idle",reasoning:undefined,generatingUI:false});break;
  }
}
