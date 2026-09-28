import { describe, expect, it } from "vitest";
import { prepareImageAttachment, visibleAttachmentCount } from "./composer-uploads";

const signal = new AbortController().signal;
const file = (type: string, size: number) => new File([new Uint8Array(size)], "attachment", { type });

describe("attachment overflow", () => {
  it("keeps all previews until the configured limit", () => {
    expect(visibleAttachmentCount(4, 4)).toBe(4);
  });
  it("reserves the final tile for a +N indicator", () => {
    expect(visibleAttachmentCount(5, 4)).toBe(3);
    expect(visibleAttachmentCount(12, 4)).toBe(3);
  });
});

describe("attachment validation", () => {
  it("rejects SVG before reading the file", async () => {
    await expect(prepareImageAttachment(file("image/svg+xml", 100), { signal, onProgress: () => {} })).rejects.toThrow(/PNG, JPEG, WebP, or GIF/);
  });
  it("rejects oversized images before reading the file", async () => {
    await expect(prepareImageAttachment(file("image/png", 3_000_001), { signal, onProgress: () => {} })).rejects.toThrow(/3 MB/);
  });
});
