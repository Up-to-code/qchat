import "server-only";
import {z} from "zod";
import {modelTimer,type ModelMetricSink} from "./model-performance";

const part=z.object({text:z.string().optional(),thought:z.boolean().optional(),inlineData:z.object({mimeType:z.string(),data:z.string()}).optional()});
export const geminiResponseSchema=z.object({candidates:z.array(z.object({content:z.object({parts:z.array(part)}).optional(),finishReason:z.string().optional()})).optional()});
export class GeminiProviderError extends Error{constructor(readonly status:number){super(status===400?"Gemini rejected the request format (400).":status===401||status===403?"Gemini rejected the credential or access permission.":status===404?"The configured Gemini model is not available (404).":status===429?"Gemini free quota is currently exhausted (429).":status===503?"Gemini is temporarily overloaded (503). Please try again.":`Gemini request failed (${status}).`)}}
async function requestGemini(url:string,init:RequestInit,signal:AbortSignal,onRetry?:()=>void){
  signal=AbortSignal.any([signal,AbortSignal.timeout(45000)]);
  for(let attempt=0;attempt<2;attempt++){
    const response=await fetch(url,{...init,signal});
    if(attempt===0&&[500,502,503,504].includes(response.status)){
      await response.body?.cancel();onRetry?.();
      await new Promise<void>((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(signal.reason)};const timer=setTimeout(()=>{signal.removeEventListener("abort",abort);resolve()},350);signal.addEventListener("abort",abort,{once:true});if(signal.aborted)abort()});
      continue;
    }
    return response;
  }
  throw new GeminiProviderError(503);
}
function endpoint(model:string,method:string){if(!/^gemini-[a-zA-Z0-9.-]+$/.test(model))throw new Error("Invalid Gemini model configuration");return `https://generativelanguage.googleapis.com/v1beta/models/${model}:${method}`}
export async function generateGemini(model:string,body:unknown,signal:AbortSignal){
  const key=process.env.GEMINI_API_KEY;if(!key)throw new GeminiProviderError(401);
  const response=await requestGemini(endpoint(model,"generateContent"),{method:"POST",headers:{"x-goog-api-key":key,"Content-Type":"application/json"},body:JSON.stringify(body)},signal);
  if(!response.ok)throw new GeminiProviderError(response.status);
  return geminiResponseSchema.parse(await response.json());
}
const messageSchema=z.object({role:z.enum(["system","user","assistant"]),content:z.union([z.string(),z.array(z.union([z.object({type:z.literal("text"),text:z.string()}),z.object({type:z.literal("image_url"),image_url:z.object({url:z.string()})})]))])});
export function geminiConversationBody(messages:readonly unknown[]){
  const parsed=z.array(messageSchema).parse(messages);
  return {systemInstruction:{parts:[{text:parsed.filter(m=>m.role==="system").map(m=>m.content).join("\n")}]},contents:parsed.filter(m=>m.role!=="system").map(m=>({role:m.role==="assistant"?"model":"user",parts:typeof m.content==="string"?[{text:m.content}]:m.content.map(p=>{if(p.type==="text")return {text:p.text};const match=/^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(p.image_url.url);if(!match)throw new Error("Unsupported image input");return {inlineData:{mimeType:match[1]!,data:match[2]!}}})})),generationConfig:{thinkingConfig:{thinkingBudget:0},maxOutputTokens:4096}};
}
export async function* streamGemini(messages:readonly unknown[],signal:AbortSignal,model:string,onMetric?:ModelMetricSink):AsyncIterable<string>{
  const key=process.env.GEMINI_API_KEY;if(!key)throw new GeminiProviderError(401);
  const mark=modelTimer(model,"gemini",onMetric);mark("provider.request");
  let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;let first=true;
  try{
    const response=await requestGemini(`${endpoint(model,"streamGenerateContent")}?alt=sse`,{method:"POST",headers:{"x-goog-api-key":key,"Content-Type":"application/json"},body:JSON.stringify(geminiConversationBody(messages))},signal,()=>mark("provider.retry"));mark("provider.headers",{status:response.status});
    if(!response.ok||!response.body)throw new GeminiProviderError(response.status);
    reader=response.body.getReader();const decoder=new TextDecoder();let pending="";
    while(true){const {done,value}=await reader.read();pending+=done?decoder.decode():decoder.decode(value,{stream:true});const lines=pending.split("\n");pending=done?"":lines.pop()??"";for(const line of lines){if(!line.startsWith("data:"))continue;const raw:unknown=JSON.parse(line.slice(5).trim());if(raw&&typeof raw==="object"&&"error" in raw)throw new GeminiProviderError(502);const result=geminiResponseSchema.parse(raw);for(const p of result.candidates?.[0]?.content?.parts??[]){if(p.text&&!p.thought){if(first){mark("provider.first_token");first=false}yield p.text}}}if(done)break}
    if(first)throw new GeminiProviderError(502);
  }catch(error){mark("provider.error",{status:error instanceof GeminiProviderError?error.status:0,cancelled:signal.aborted});throw error}finally{reader?.releaseLock();mark("provider.total")}
}
