import { createQChatClient, type QChatClient } from "@qchat/react";
import type { QChatAgentEvent } from "@qchat/core";

export const testGraphClient: QChatClient = createQChatClient({
  capabilities: { tools: true, attachments: true },
  async *run({ messages,locale, signal }): AsyncIterable<QChatAgentEvent> {
    const response = await fetch("/api/qchat/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: messages.filter((message) => message.role !== "system").map(({ role, content }) => ({ role, content })),locale }), signal });
    if (!response.ok || !response.body) { yield { type: "failure", error: { code: "ADAPTER_FAILED", message: "The test agent is unavailable.", retryable: true } }; return; }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) { const { done, value } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const lines = buffer.split("\n"); buffer = lines.pop() ?? ""; for (const item of lines) if (item) yield JSON.parse(item) as QChatAgentEvent; }
  },
  async action() { return { status: "rejected", message: "Test actions require a host authorizer." }; },
});
