import {z} from "zod";
import {geminiVoiceGraph} from "../../../../server/gemini-voice-graph";
import {GeminiProviderError} from "../../../../server/gemini-provider";
import {guardPreviewRequest} from "../../../../server/request-guard";
export const runtime="nodejs";
const input=z.object({text:z.string().trim().min(1).max(6000),locale:z.string().regex(/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/).max(32)});
export async function POST(request:Request){
  const guard = guardPreviewRequest(request, 30);
  if (guard) return guard;
  if(!process.env.GEMINI_API_KEY)return Response.json({error:"Gemini voice is not configured."},{status:503});
  const rawBody = await request.text().catch(()=>null);
  if(rawBody === null || rawBody.length > 40_000)return Response.json({error:"Speech request is too large."},{status:413});
  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { payload = null; }
  const parsed=input.safeParse(payload);if(!parsed.success)return Response.json({error:"Invalid speech request."},{status:400});
  try{const result=await geminiVoiceGraph.invoke({task:"speak",text:parsed.data.text,locale:parsed.data.locale},{signal:request.signal});return Response.json({...result.audio,durationMs:result.durationMs},{headers:{"Cache-Control":"no-store"}})}catch(error){return Response.json({error:error instanceof GeminiProviderError?error.message:"Speech generation failed."},{status:error instanceof GeminiProviderError&&error.status===429?429:502})}
}
