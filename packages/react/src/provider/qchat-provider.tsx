"use client";
import { createContext,useContext,useRef,type CSSProperties } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { StoreApi } from "zustand/vanilla";
import { createQChatStore } from "../store/create-qchat-store";
import type { QChatConfig,QChatProviderProps,QChatStoreState } from "../interfaces/react.interfaces";
const StoreContext=createContext<StoreApi<QChatStoreState>|null>(null);const ConfigContext=createContext<QChatConfig>({});
export function QChatProvider({client,config={},initialMessages=[],conversationId="default",children}:QChatProviderProps){
  const store=useRef<StoreApi<QChatStoreState>|null>(null);if(!store.current)store.current=createQChatStore(client,initialMessages,conversationId);
  const theme=config.theme;const style={"--qchat-accent":theme?.accent,"--qchat-bg":theme?.background,"--qchat-fg":theme?.foreground,"--qchat-surface":theme?.surface,"--qchat-muted":theme?.muted,"--qchat-radius":theme?.radius,"--qchat-font":theme?.fontFamily,"--qchat-motion":String(theme?.motionScale??1)} as CSSProperties;
  return <ConfigContext.Provider value={config}><StoreContext.Provider value={store.current}><div className="qchat-root" style={style}>{children}</div></StoreContext.Provider></ConfigContext.Provider>
}
export function useQChatSelector<T>(selector:(state:QChatStoreState)=>T):T{const store=useContext(StoreContext);if(!store)throw new Error("QChat hooks must be used inside QChatProvider");return useStore(store,selector)}
export const useQChatMessages=()=>useQChatSelector((s)=>s.messages);export const useQChatComposer=()=>useQChatSelector(useShallow((s)=>({draft:s.draft,setDraft:s.setDraft,submit:s.submit,cancel:s.cancel,status:s.status})));export const useQChatRunState=()=>useQChatSelector(useShallow((s)=>({status:s.status,reasoning:s.reasoning,error:s.error})));export const useQChatGeneratedUI=()=>useQChatSelector(useShallow((s)=>({document:s.document,generating:s.generatingUI,selections:s.selections})));export const useQChatTools=()=>useQChatSelector((s)=>s.tools);export const useQChatPerformance=()=>useQChatSelector((s)=>s.performance);export const useQChatConfig=()=>useContext(ConfigContext);
