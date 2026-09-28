import type { QChatAgentEvent,QChatPerformanceRecord } from "@qchat/core";
import type { QChatCompilerLimits,QChatRunRequest,QChatServer,QChatServerConfig } from "../interfaces/server.interfaces";
import { compileToonUI } from "../compiler/document-compiler";
import { composeSystemPrompt } from "../prompt/qchat-system-prompt";
const DEFAULT_LIMITS:QChatCompilerLimits={maxDocumentBytes:128_000,maxDepth:8,maxCollectionItems:12};
const now=()=>new Date().toISOString();
export function createQChatServer(config:QChatServerConfig):QChatServer {
  const systemPrompt=composeSystemPrompt(config.includeDefaultSystemPrompt??true,config.customSystemPrompt);
  const limits={...DEFAULT_LIMITS,...config.compilerLimits};
  const retries=config.maxCompilationRetries??1;
  const timeoutMs=config.timeoutMs??60_000;
  async function* run(request:QChatRunRequest):AsyncIterable<QChatAgentEvent>{
    const runStarted=performance.now();let attempt=0;let diagnostics:readonly string[]=[];let sawFirstEvent=false;let sawFirstUiByte=false;
    while(attempt<=retries){
      const controller=new AbortController();const relay=()=>controller.abort(request.signal?.reason);request.signal?.addEventListener("abort",relay,{once:true});if(request.signal?.aborted)relay();
      const timeout=setTimeout(()=>controller.abort(new Error("QChat run timed out")),timeoutMs);let toon="";let sawUi=false;
      try{
        for await(const event of config.adapter.run({messages:request.messages,tools:config.tools??[],systemPrompt,metadata:request.metadata,signal:controller.signal,...(attempt>0?{repair:{attempt,diagnostics}}:{})})){
          if(controller.signal.aborted)throw new DOMException("Aborted","AbortError");if(!sawFirstEvent){sawFirstEvent=true;await record("qchat.first_event",performance.now()-runStarted,request.metadata.runId,config)}
          if(event.type==="ui.start"){sawUi=true;toon="";yield event;continue}
          if(event.type==="ui.delta"){toon+=event.delta;if(new TextEncoder().encode(toon).byteLength>limits.maxDocumentBytes)throw new Error("UI stream exceeds document byte limit");if(!sawFirstUiByte){sawFirstUiByte=true;await record("qchat.first_ui_byte",performance.now()-runStarted,request.metadata.runId,config)}continue}
          if(event.type==="ui.complete"){yield event;continue}
          if(event.type==="complete"&&sawUi){
            const result=compileToonUI(toon,limits,config.allowedImageHosts);
            await record("qchat.compile",result.durationMs,request.metadata.runId,config);
            if(result.document){yield {type:"ui.complete",document:result.document};yield event;await record("qchat.run.total",performance.now()-runStarted,request.metadata.runId,config);return}
            diagnostics=result.diagnostics;if(attempt<retries){yield {type:"reasoning.status",label:"Repairing generated interface"};break}
            yield {type:"failure",error:{code:"COMPILE_FAILED",message:"The generated interface could not be validated.",retryable:false,diagnostics:config.redactErrors===false?diagnostics:undefined}};await record("qchat.run.total",performance.now()-runStarted,request.metadata.runId,config);return;
          }
          yield event;
        }
        if(!sawUi){await record("qchat.run.total",performance.now()-runStarted,request.metadata.runId,config);return}
      }catch(error){
        const cancelled=controller.signal.aborted;
        yield {type:"failure",error:{code:cancelled?"CANCELLED":"ADAPTER_FAILED",message:cancelled?"Generation stopped.":config.redactErrors===false&&error instanceof Error?error.message:"The agent run failed.",retryable:!cancelled}};await record("qchat.run.total",performance.now()-runStarted,request.metadata.runId,config);return;
      }finally{clearTimeout(timeout);request.signal?.removeEventListener("abort",relay)}
      attempt+=1;
    }
    await record("qchat.run.total",performance.now()-runStarted,request.metadata.runId,config);
  }
  return {systemPrompt,run,async handleAction(action){const started=performance.now();const result=config.authorizeAction?await config.authorizeAction(action):{status:"rejected" as const,message:"No action authorizer is configured."};await record("qchat.action",performance.now()-started,action.runId,config);return result}}
}
async function record(name:string,durationMs:number,runId:string,config:QChatServerConfig){const item:QChatPerformanceRecord={name,durationMs,runId,timestamp:now()};try{await config.telemetry?.record(item)}catch{/* Telemetry is not part of the agent result. */}}
