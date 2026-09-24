import { describe, expect, it } from "vitest";
import { resolveComposerPrimaryAction } from "./composer-primary-action";

describe("composer primary action", () => {
  it("offers voice only when empty and supported", () => {
    expect(resolveComposerPrimaryAction("idle", "", true)).toBe("voice");
    expect(resolveComposerPrimaryAction("idle", " ", false)).toBe("voice-unavailable");
  });
  it("sends typed text and always allows a running request to stop", () => {
    expect(resolveComposerPrimaryAction("idle", "Hello", true)).toBe("send");
    expect(resolveComposerPrimaryAction("error", "Retry", false)).toBe("send");
    expect(resolveComposerPrimaryAction("running", "Hello", true)).toBe("stop");
    expect(resolveComposerPrimaryAction("running", "", false)).toBe("stop");
  });
});
