"use client";
import {useEffect,useRef} from "react";
import {useQChatMessages,useQChatPerformance,useQChatRecordPerformance} from "../provider/qchat-provider";
/** Measures React commit after the first text event; not a browser paint measurement. */
export function QChatRenderProbe(){
  const messages=useQChatMessages();const records=useQChatPerformance();const record=useQChatRecordPerformance();const measured=useRef("");const last=messages.at(-1);
  useEffect(()=>{if(!last?.content||last.role!=="assistant"||measured.current===last.id)return;const start=[...records].reverse().find(item=>item.name==="runtime.first_text"&&item.attributes?.messageId===last.id);if(!start)return;measured.current=last.id;record({name:"react.first_commit",durationMs:Math.max(0,Date.now()-Number(start.attributes?.receivedAt)),runId:start.runId,timestamp:new Date().toISOString(),attributes:{layer:"render"}})},[last,records,record]);return null;
}
