import type { QChatAttachment } from "@qchat/react";

export function visibleAttachmentCount(total: number, maxVisible: number) {
  return total > maxVisible ? Math.max(1, maxVisible - 1) : total;
}

export async function prepareImageAttachment(file: File, options: { signal: AbortSignal; onProgress: (percent: number) => void }): Promise<QChatAttachment> {
  if (!file.type.startsWith("image/")) throw new Error("This preview accepts image files only.");
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
