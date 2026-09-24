import {z} from "zod";
import {qChatUIDocumentSchema,type QChatAgentEvent} from "@qchat/core";
const str=z.string().max(256_000);
const eventSchema=z.discriminatedUnion("type",[
  z.object({type:z.literal("text.delta"),delta:str}),
  z.object({type:z.literal("ui.delta"),delta:str}),
  z.object({type:z.literal("reasoning.status"),label:str,elapsedMs:z.number().nonnegative().optional()}),
  z.object({type:z.literal("tool.start"),toolCallId:str,name:str}),
  z.object({type:z.literal("tool.result"),toolCallId:str,summary:str}),
  z.object({type:z.literal("tool.error"),toolCallId:str,message:str}),
  z.object({type:z.literal("ui.start")}),
  z.object({type:z.literal("ui.complete"),document:qChatUIDocumentSchema}),
  z.object({type:z.literal("complete")}),
  z.object({type:z.literal("usage"),usage:z.object({inputTokens:z.number().nonnegative().optional(),outputTokens:z.number().nonnegative().optional()})}),
  z.object({type:z.literal("failure"),error:z.object({code:z.enum(["CONFIG_INVALID","ADAPTER_FAILED","COMPILE_FAILED","ACTION_REJECTED","CANCELLED"]),message:str,retryable:z.boolean(),diagnostics:z.array(str).optional()})}),
  z.object({type:z.literal("performance"),record:z.object({name:str,durationMs:z.number().finite().nonnegative(),runId:str,timestamp:str,attributes:z.record(z.union([z.string(),z.number(),z.boolean()])).optional()})}),
]);
export async function* readAgentEvents(body:ReadableStream<Uint8Array>):AsyncIterable<QChatAgentEvent>{
  const reader=body.getReader();const decoder=new TextDecoder();let pending="";
  try{
    while(true){
      const {done,value}=await reader.read();
      pending+=done?decoder.decode():decoder.decode(value,{stream:true});
      const lines=pending.split("\n");pending=done?"":lines.pop()??"";
      if(pending.length>512_000)throw new Error("Agent event exceeded the size limit");
      for(const line of lines){if(!line.trim())continue;if(line.length>512_000)throw new Error("Agent event exceeded the size limit");yield eventSchema.parse(JSON.parse(line))}
      if(done)break;
    }
  }finally{await reader.cancel().catch(()=>{});reader.releaseLock()}
}
