"use client";
import { useEffect, useRef } from "react";
import {QChatRenderProbe} from "./qchat-render-probe";
import { QChatGeneratedUI } from "./qchat-generated-ui";import { QChatMessage } from "./qchat-message";import { QChatThinking } from "./qchat-thinking";import { QChatToolActivity } from "./qchat-tool-activity";import { useQChatConfig,useQChatMessages,useQChatRunState } from "../provider/qchat-provider";
export function QChatThread(){const messages=useQChatMessages();const {error,status}=useQChatRunState();const {slots}=useQChatConfig();const Thread=slots?.thread??"div";const ErrorView=slots?.error;const ToolActivity=slots?.toolActivity??QChatToolActivity;const MessageView=slots?.message??QChatMessage;const Thinking=slots?.thinking??QChatThinking;const end=useRef<HTMLDivElement>(null);const following=useRef(true);const last=messages.at(-1);const activityIndex=last?.role==="assistant"?messages.length-1:messages.length;useEffect(()=>{
  const content=end.current?.parentElement;const scroller=content?.closest(".qchat-thread");
  if(!(scroller instanceof HTMLElement)||!content)return;
  const scroll=()=>{if(following.current)scroller.scrollTop=scroller.scrollHeight};
  const onScroll=()=>{following.current=scroller.scrollHeight-scroller.scrollTop-scroller.clientHeight<80};
  scroller.addEventListener("scroll",onScroll,{passive:true});
  const observer=new ResizeObserver(scroll);observer.observe(content);scroll();
  return()=>{observer.disconnect();scroller.removeEventListener("scroll",onScroll)};
},[]);
useEffect(()=>{if(last?.role==="user")following.current=true;const scroller=end.current?.closest(".qchat-thread");if(following.current&&scroller instanceof HTMLElement)scroller.scrollTop=scroller.scrollHeight},[last?.content,last?.id,last?.role,status,error]);return <Thread className="qchat-thread"><QChatRenderProbe/><div className="qchat-thread-inner">{messages.map((message,index)=><div key={message.id} className="qchat-transcript-entry">{index===activityIndex&&<><Thinking/><ToolActivity/></>}<MessageView message={message}/></div>)}{activityIndex===messages.length&&<><Thinking/><ToolActivity/></>}<QChatGeneratedUI/>{error&&(ErrorView?<ErrorView error={error}/>:<div role="alert" className="qchat-error">{error.message}</div>)}<div ref={end} className="qchat-thread-end" aria-hidden="true"/></div></Thread>}
