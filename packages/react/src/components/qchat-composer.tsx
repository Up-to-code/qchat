"use client";
import { ArrowUp, Plus, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQChatComposer } from "../provider/qchat-provider";

export interface QChatComposerProps {
  readonly suggestions?: readonly string[];
  readonly agentLabel?: string;
}

export function QChatComposer({ suggestions = [], agentLabel }: QChatComposerProps) {
  const { draft, setDraft, submit, cancel, status } = useQChatComposer();
  const input = useRef<HTMLTextAreaElement>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const running = status === "running";
  useEffect(() => {
    const node = input.current;
    if (!node) return;
    node.style.height = "0px";
    node.style.height = `${Math.min(node.scrollHeight, 200)}px`;
  }, [draft]);
  return <form className="qchat-composer" onSubmit={(event) => { event.preventDefault(); if (!running) void submit(); }}>
    {suggestionsOpen && <div className="qchat-suggestions" role="group" aria-label="Suggested prompts">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setDraft(suggestion); setSuggestionsOpen(false); input.current?.focus(); }}>{suggestion}</button>)}</div>}
    <textarea ref={input} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setSuggestionsOpen(false); if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!running) void submit(); } }} placeholder="Ask anything" aria-label="Message QChat" rows={1}/>
    <div className="qchat-composer-toolbar">
      <div className="qchat-composer-actions">{suggestions.length > 0 && <button type="button" className="qchat-add" aria-label="Suggested prompts" aria-expanded={suggestionsOpen} onClick={() => setSuggestionsOpen((open) => !open)}><Plus size={17}/></button>}{agentLabel && <span className="qchat-agent-label">{agentLabel}</span>}</div>
      <button className="qchat-send" type={running ? "button" : "submit"} aria-label={running ? "Stop generation" : "Send message"} onClick={running ? cancel : undefined} disabled={!running && !draft.trim()}>{running ? <Square size={14} fill="currentColor"/> : <ArrowUp size={18}/>}</button>
    </div>
  </form>;
}
