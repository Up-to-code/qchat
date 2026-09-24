export const runtime = "nodejs";

export function GET() {
  return Response.json({ available: Boolean(process.env.GEMINI_API_KEY), voiceAvailable: Boolean(process.env.GEMINI_API_KEY),provider:"gemini" });
}
