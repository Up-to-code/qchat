import { z } from "zod";
import {geminiVoiceGraph} from "../../../../server/gemini-voice-graph";
import {GeminiProviderError} from "../../../../server/gemini-provider";

export const runtime = "nodejs";
const input = z.object({ data: z.string().min(100).max(11_000_000).regex(/^[A-Za-z0-9+/=]+$/), format: z.enum(["webm", "ogg", "m4a","wav"]), locale: z.string().regex(/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/).max(32) });

/** A configured audio-understanding model transcribes the recording; no raw provider errors escape. */
export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) return Response.json({ error: "Gemini voice is not configured." }, { status: 503 });
  if (Number(request.headers.get("content-length")) > 12_000_000) return Response.json({ error: "Recording is too large." }, { status: 413 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid recording." }, { status: 400 });
  try {
    const result=await geminiVoiceGraph.invoke({task:"transcribe",data:parsed.data.data,mimeType:parsed.data.format==="m4a"?"audio/mp4":`audio/${parsed.data.format}`,locale:parsed.data.locale},{signal:request.signal});
    return Response.json({text:result.text,durationMs:result.durationMs},{headers:{"Cache-Control":"no-store"}});
  } catch(error) { return Response.json({ error:error instanceof GeminiProviderError?error.message:"Voice transcription failed." }, { status:error instanceof GeminiProviderError&&error.status===429?429:502 }); }
}
