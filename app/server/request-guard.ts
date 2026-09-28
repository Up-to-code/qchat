/**
 * Preview route guard. These endpoints are a local showcase, not a production
 * backend: enforce same-origin callers and per-client rate limits so a
 * deployed preview cannot be hot-linked to burn provider quota.
 * A production host must add real user authentication in front of these routes.
 */
const WINDOW_MS = 60_000;
const buckets = new Map<string, number[]>();

export function previewClientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function isSameOriginRequest(request: Request): boolean {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin) return origin === url.origin;
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === url.origin;
    } catch {
      return false;
    }
  }
  return false;
}

function isRateLimited(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (hits.length >= maxPerMinute) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  if (buckets.size > 10_000) buckets.clear();
  buckets.set(key, hits);
  return false;
}

/** Returns a 403/429 response when the request must be rejected, else null. */
export function guardPreviewRequest(request: Request, maxPerMinute: number): Response | null {
  if (!isSameOriginRequest(request)) return Response.json({ error: "Cross-origin requests are not allowed for this preview endpoint." }, { status: 403 });
  if (isRateLimited(`${previewClientKey(request)}:${new URL(request.url).pathname}`, maxPerMinute)) return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });
  return null;
}
