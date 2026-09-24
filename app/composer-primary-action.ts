/** One visible primary action, derived from the composer state. */
export function resolveComposerPrimaryAction(
  status: "idle" | "running" | "error",
  draft: string,
  canVoice: boolean,
): "stop" | "send" | "voice" | "voice-unavailable" {
  if (status === "running") return "stop";
  if (draft.trim()) return "send";
  return canVoice ? "voice" : "voice-unavailable";
}
