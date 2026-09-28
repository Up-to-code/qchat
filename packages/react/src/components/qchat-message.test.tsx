import {describe,it,expect} from "vitest";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {QChatMessage} from "./qchat-message";
import {QChatProvider} from "../provider/qchat-provider";
import type {QChatClient} from "../interfaces/react.interfaces";
import type {QChatMessageRecord} from "@qchat/core";
const client:QChatClient={capabilities:{},async *run(){yield {type:"complete"}},async action(){return {status:"accepted"}}};
const render=(content:string,attachments:QChatMessageRecord["attachments"])=>(renderToStaticMarkup(createElement(QChatProvider,{client,config:{localization:{locale:"ar-EG"}}},createElement(QChatMessage,{message:{id:"test",role:"user",content,createdAt:"2026-09-25T00:00:00.000Z",attachments}}))));
describe("message content states",()=>{
  const image=[{kind:"image" as const,mediaType:"image/png",previewUrl:"data:image/png;base64,YQ==",filename:"image.png"}];
  it("renders image-only history without a text bubble",()=>{const html=render("",image);expect(html).toContain("<img");expect(html).not.toContain('class="qchat-bubble"');expect(html.indexOf('class="qchat-meta"')).toBeLessThan(html.indexOf('class="qchat-message-attachments"'))});
  it("renders a separate caption only when text exists",()=>{expect(render("تعليق",image)).toContain('class="qchat-bubble"');expect(render("  ",image)).not.toContain('class="qchat-bubble"')});
  it("renders files by name without a text bubble",()=>{const html=render("",[{kind:"file",mediaType:"application/pdf",filename:"ملف.pdf"}]);expect(html).toContain("ملف.pdf");expect(html).not.toContain('class="qchat-bubble"')});
  it("does not render an empty message shell",()=>expect(render("",[])).not.toContain('class="qchat-meta"'));
});
