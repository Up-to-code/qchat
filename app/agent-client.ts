import { createQChatClient, type QChatClient } from "@qchat/react";
import {readAgentEvents} from "./agent-event-stream";
import type { QChatAgentEvent } from "@qchat/core";

export const agentClient: QChatClient = createQChatClient({
  capabilities: { attachments: true, dictation: true },
  async *run({ messages, attachments, locale, signal,runId }): AsyncIterable<QChatAgentEvent> {
    const started=performance.now();let firstEvent=true;let firstText=true;
    const metric=(name:string):QChatAgentEvent=>({type:"performance",record:{name,durationMs:performance.now()-started,runId,timestamp:new Date().toISOString(),attributes:{layer:"transport"}}});
    const response = await fetch("/api/qchat/run", { method: "POST", headers: { "Content-Type": "application/json","X-QChat-Run-Id":runId }, body: JSON.stringify({ messages: messages.filter((message) => message.role !== "system").map(({ role, content }) => ({ role, content })), attachments:attachments.filter((item)=>item.kind==="image"), locale }), signal });
    yield metric("transport.headers");
    if (!response.ok || !response.body) { yield { type: "failure", error: { code: "ADAPTER_FAILED", message: "The live model is unavailable.", retryable: true } }; return; }
    try{for await(const event of readAgentEvents(response.body)){if(firstEvent){yield metric("transport.first_event");firstEvent=false}if(event.type==="text.delta"&&firstText){yield metric("transport.first_text");firstText=false}yield event}}
    finally{yield metric("transport.total")}

  },
  async action() { return { status: "rejected", message: "Live actions require a host authorizer." }; },
});
