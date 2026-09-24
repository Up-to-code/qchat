import {describe,it,expect} from "vitest";
import {createQChatStore} from "./create-qchat-store";
import type {QChatClient} from "../interfaces/react.interfaces";
const action:QChatClient["action"]=async()=>({status:"accepted"});
describe("run lifecycle",()=>{
  it("keeps failure terminal even if an adapter emits complete afterwards",async()=>{
    const store=createQChatStore({capabilities:{},action,async *run(){yield {type:"failure",error:{code:"ADAPTER_FAILED",message:"Provider overloaded",retryable:true}};yield {type:"complete"}}},[],"test");
    store.getState().setDraft("hi");await store.getState().submit();
    expect(store.getState().status).toBe("error");
  });
  it("reports a truncated stream instead of leaving a loading skeleton",async()=>{
    const store=createQChatStore({capabilities:{},action,async *run(){yield {type:"ui.start"}}},[],"test");
    store.getState().setDraft("hi");await store.getState().submit();
    expect(store.getState().generatingUI).toBe(false);expect(store.getState().error?.message).toContain("before completion");
  });
  it("clears loading after cancellation even when the adapter returns normally",async()=>{
    let release!:()=>void;
    const wait=new Promise<void>(resolve=>{release=resolve});
    const store=createQChatStore({capabilities:{},action,async *run(){yield {type:"ui.start"};await wait}},[],"test");
    store.getState().setDraft("hi");const pending=store.getState().submit();await Promise.resolve();store.getState().cancel();release();await pending;
    expect(store.getState().status).toBe("idle");expect(store.getState().generatingUI).toBe(false);
  });
});
