"use client";
import type { QChatMessageRecord } from "@qchat/core";
import { useQChatLocale } from "../provider/qchat-provider";

export function QChatMessage({message}:{readonly message:QChatMessageRecord}){
  const {t,locale}=useQChatLocale();
  const user=message.role==="user";
  const time=new Date(message.createdAt).toLocaleTimeString(locale.code,{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"UTC"});
  if(!message.content.trim()&&!message.attachments?.length)return null;
  return <article className={`qchat-message ${user?"is-user":"is-assistant"}`}>
    <div className="qchat-meta"><span>{user?t("you"):"QChat"}</span><time>{time}</time></div>
    {Boolean(message.attachments?.length)&&<div className="qchat-message-attachments" aria-label="Message attachments">
      {message.attachments?.map((attachment,index)=><div className={`qchat-message-attachment is-${attachment.kind}`} key={`${message.id}-${index}`}>
        {attachment.kind==="image"&&attachment.previewUrl?<img src={attachment.previewUrl} alt={attachment.filename??"Attached image"}/>:<span>{attachment.filename??"Attached file"}</span>}
      </div>)}
    </div>}
    {message.content.trim()&&<div className="qchat-bubble" dir="auto">{message.content}</div>}
    {user&&<span className="qchat-read">{t("read")}</span>}
  </article>;
}
