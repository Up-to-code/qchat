"use client";
import { useQChatTools } from "@qchat/react";
import { Tool, ToolContent, ToolHeader } from "@/components/ai-elements/tool";

export function ElementsToolActivity() {
  const tools = useQChatTools();
  if (tools.length === 0) return null;
  return <div className="elements-tool-list" aria-label="Tool activity">
    {tools.map((tool) => <Tool key={tool.id} defaultOpen={false}>
      <ToolHeader
        type="dynamic-tool"
        toolName={tool.name}
        title={tool.name}
        state={tool.status === "running" ? "input-available" : tool.status === "error" ? "output-error" : "output-available"}
      />
      <ToolContent>{tool.summary && <p className="elements-tool-summary">{tool.summary}</p>}</ToolContent>
    </Tool>)}
  </div>;
}
