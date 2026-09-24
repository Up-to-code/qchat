import "server-only";
import {Annotation,StateGraph,START,END} from "@langchain/langgraph";
import {generateGemini} from "./gemini-provider";
import {showcaseModelConfig} from "./showcase-model-config";
const VoiceState=Annotation.Root({task:Annotation<"transcribe"|"speak">(),data:Annotation<string>(),mimeType:Annotation<string>(),locale:Annotation<string>(),text:Annotation<string>(),audio:Annotation<{data:string;mimeType:string}>(),durationMs:Annotation<number>()});
/** Host orchestration only: audio models are not dependencies of the QChat UI library. */
export const geminiVoiceGraph=new StateGraph(VoiceState)
  .addNode("route_voice",state=>({task:state.task}))
  .addNode("transcribe_audio",async(state,config)=>{
    const started=performance.now();const result=await generateGemini(process.env.GEMINI_TRANSCRIPTION_MODEL??showcaseModelConfig.transcription.model,{contents:[{role:"user",parts:[{text:`Transcribe the speech verbatim in its original language. Locale: ${state.locale}. Return only the transcript. If there is no speech return an empty string.`},{inlineData:{mimeType:state.mimeType,data:state.data}}]}],generationConfig:{temperature:0,thinkingConfig:{thinkingBudget:0},maxOutputTokens:2048}},config.signal??new AbortController().signal);
    return {text:(result.candidates?.[0]?.content?.parts??[]).filter(part=>!part.thought).map(part=>part.text??"").join("").trim(),durationMs:performance.now()-started};
  })
  .addNode("synthesize_speech",async(state,config)=>{
    const started=performance.now();const result=await generateGemini(process.env.GEMINI_SPEECH_MODEL??showcaseModelConfig.speech.model,{contents:[{role:"user",parts:[{text:`Read aloud naturally in ${state.locale}:\n${state.text}`}]}],generationConfig:{responseModalities:["AUDIO"],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:"Kore"}}}}},config.signal??new AbortController().signal);
    const audio=result.candidates?.[0]?.content?.parts?.find(part=>part.inlineData)?.inlineData;if(!audio)throw new Error("Gemini returned no speech");
    return {audio,durationMs:performance.now()-started};
  })
  .addEdge(START,"route_voice")
  .addConditionalEdges("route_voice",state=>state.task==="transcribe"?"transcribe_audio":"synthesize_speech")
  .addEdge("transcribe_audio",END).addEdge("synthesize_speech",END).compile();
