import type { QChatAttachment } from "@qchat/react";

export function visibleAttachmentCount(total: number, maxVisible: number) {
  return total > maxVisible ? Math.max(1, maxVisible - 1) : total;
}

// Mirrors the server's accepted image types (run/route.ts). SVG is excluded:
// <img>-rendered SVG is script-inert, but the server rejects it anyway.
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 3_000_000;

export async function prepareImageAttachment(file: File, options: { signal: AbortSignal; onProgress: (percent: number) => void }): Promise<QChatAttachment> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("This preview accepts PNG, JPEG, WebP, or GIF images only.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("This image exceeds the 3 MB attachment limit.");
  return new Promise<QChatAttachment>((resolve, reject) => {
    const reader = new FileReader();
    const abort = () => reader.abort();
    options.signal.addEventListener("abort", abort, { once: true });
    reader.onprogress = (event) => { if (event.lengthComputable) options.onProgress(Math.round(event.loaded / event.total * 100)); };
    reader.onload = () => { options.signal.removeEventListener("abort", abort); options.onProgress(100); resolve({ kind: "image", mediaType: file.type, dataUrl: String(reader.result), filename: file.name }); };
    reader.onerror = () => { options.signal.removeEventListener("abort", abort); reject(new Error("Could not read the attachment.")); };
    reader.onabort = () => { options.signal.removeEventListener("abort", abort); reject(new DOMException("Aborted", "AbortError")); };
    reader.readAsDataURL(file);
  });
}
