import {z} from "zod";
import {GoogleGenAI,Modality} from "@google/genai";
import {showcaseModelConfig} from "../../../../server/showcase-model-config";
import {guardPreviewRequest} from "../../../../server/request-guard";
export const runtime="nodejs";
const inputSchema=z.object({locale:z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/).max(40)});
/** Local preview only. A deployed host must authenticate users before issuing tokens. */
export async function POST(request:Request){
  const guard = guardPreviewRequest(request, 10);
  if (guard) return guard;
  const url=new URL(request.url);
  const origin=request.headers.get("origin");
  if(origin&&origin!==url.origin)return Response.json({error:"Cross-origin voice sessions are not allowed."},{status:403});
  const fetchSite=request.headers.get("sec-fetch-site");
  if(fetchSite&&fetchSite!=="same-origin")return Response.json({error:"Cross-origin voice sessions are not allowed."},{status:403});
  if(!["localhost","127.0.0.1","[::1]"].includes(url.hostname))return Response.json({error:"Configure host authentication before deploying voice sessions."},{status:403});
  const key=process.env.GEMINI_API_KEY;
  if(!key)return Response.json({error:"Gemini is not configured."},{status:503});
  const parsed=inputSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return Response.json({error:"Invalid voice locale."},{status:400});
  const model=process.env.GEMINI_LIVE_MODEL??showcaseModelConfig.live.model;
  if(!/^gemini-[a-zA-Z0-9.-]+$/.test(model))return Response.json({error:"Invalid live model configuration."},{status:500});
  const config={
    responseModalities:[Modality.AUDIO],
    systemInstruction:{parts:[{text:`You are a helpful voice assistant. Begin in ${parsed.data.locale}, but follow the language the user speaks or explicitly requests. Respond conversationally. Do not claim to have performed actions or accessed data without a connected tool.`}]},
    speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:process.env.GEMINI_LIVE_VOICE??"Kore"}}},
  };
  try{
    const ai=new GoogleGenAI({apiKey:key,httpOptions:{apiVersion:"v1alpha",timeout:15000}});
    const token=z.object({name:z.string().min(1)}).parse(await ai.authTokens.create({config:{uses:1,expireTime:new Date(Date.now()+15*60_000).toISOString(),newSessionExpireTime:new Date(Date.now()+60_000).toISOString(),liveConnectConstraints:{model,config}}}));
    return Response.json({token:token.name,model,config},{headers:{"Cache-Control":"no-store"}});
  }catch{return Response.json({error:"Gemini Live session connection failed."},{status:502})}
}
