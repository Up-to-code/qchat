import "server-only";
import {streamGemini} from "./gemini-provider";
import {showcaseModelConfig} from "./showcase-model-config";
import type {ModelMetricSink} from "./model-performance";
/** The preview's provider adapter. QChat itself knows only the event protocol. */
export function streamAgentModel(messages:readonly unknown[],signal:AbortSignal,_key:string,task:"conversation"|"ui"="conversation",metric?:ModelMetricSink){
  const vision=messages.some(m=>typeof m==="object"&&m!==null&&"content" in m&&Array.isArray(m.content));
  const model=task==="ui"?process.env.GEMINI_UI_MODEL??showcaseModelConfig.ui:vision?process.env.GEMINI_VISION_MODEL??showcaseModelConfig.vision:process.env.GEMINI_TEXT_MODEL??showcaseModelConfig.conversation;
  return streamGemini(messages,signal,model,metric);
}
