"use client";
import {QChatProvider,QChatThread,type QChatClient} from "@qchat/react";
import type {QChatMessageRecord} from "@qchat/core";
import {ElementsMessage} from "../elements-chat-ui";
import {showcaseTheme,showcaseLocalization} from "../showcase-config";
const client:QChatClient={capabilities:{},async *run(){yield {type:"complete"}},async action(){return {status:"rejected",message:"Visual fixture"}}};
const image={kind:"image" as const,mediaType:"image/svg+xml",filename:"landscape.svg",previewUrl:"/attachment-fixture.svg"};
function messages(arabic:boolean):QChatMessageRecord[]{return [
  {id:"text-user",role:"user",content:arabic?"مرحبًا، هذه رسالة نصية.":"Hello, this is a text message."},
  {id:"text-assistant",role:"assistant",content:arabic?"أهلًا! هذه رسالة المساعد.":"Hello! This is the assistant reply."},
  {id:"image-user",role:"user",content:"",attachments:[image]},
  {id:"caption-user",role:"user",content:arabic?"هذه صورة مع تعليق.":"An image with a caption.",attachments:[image]},
  {id:"file-user",role:"user",content:"",attachments:[{kind:"file" as const,mediaType:"application/pdf",filename:arabic?"مستند.pdf":"document.pdf"}]},
  {id:"empty-assistant",role:"assistant",content:""},
].map(message=>({...message,role:message.role as QChatMessageRecord["role"],createdAt:"2026-09-25T00:00:00.000Z"}))}
export default function MessageStates(){return <main style={{padding:24}}><h1>Message layout checks</h1><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,360px),1fr))",gap:24,marginTop:24}}>{[false,true].map(arabic=><section key={String(arabic)}><h2>{arabic?"العربية · RTL":"English · LTR"}</h2><div className="showcase-stage" style={{height:1000,marginTop:16}}><QChatProvider client={client} initialMessages={messages(arabic)} config={{theme:showcaseTheme,localization:{...showcaseLocalization,locale:arabic?"ar-EG":"en-US"},slots:{message:ElementsMessage}}}><QChatThread/></QChatProvider></div></section>)}</div></main>}
