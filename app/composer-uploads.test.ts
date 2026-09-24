import { describe, expect, it } from "vitest";
import { visibleAttachmentCount } from "./composer-uploads";

describe("attachment overflow", () => {
  it("keeps all previews until the configured limit", () => {
    expect(visibleAttachmentCount(4, 4)).toBe(4);
  });
  it("reserves the final tile for a +N indicator", () => {
    expect(visibleAttachmentCount(5, 4)).toBe(3);
    expect(visibleAttachmentCount(12, 4)).toBe(3);
  });
});
