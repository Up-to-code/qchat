"use client";
import { useContext,useEffect,useState,type CSSProperties } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { StoreApi } from "zustand/vanilla";
import { createQChatStore } from "../store/create-qchat-store";
import type { QChatProviderProps,QChatStoreState } from "../interfaces/react.interfaces";
import { QChatConfigContext,QChatStoreContext } from "./qchat-context";
import { resolveQChatLocale,translateQChat } from "../localization/qchat-localization";
export function QChatProvider({client,config={},initialMessages=[],initialDocument,initialTools=[],conversationId="default",children}:QChatProviderProps){
  const [store]=useState<StoreApi<QChatStoreState>>(()=>createQChatStore(client,initialMessages,conversationId,initialDocument,initialTools,config.localization?.locale??config.localization?.defaultLocale));
  const storedLocale=useStore(store,(state)=>state.locale);
  const telemetryOnRecord=config.telemetry?.onRecord;
  useEffect(()=>store.subscribe((state,previous)=>{if(state.performance!==previous.performance){const record=state.performance.at(-1);if(record){try{telemetryOnRecord?.(record)}catch{/* Observability must not interrupt rendering or generation. */}}}}),[store,telemetryOnRecord]);
  useEffect(()=>{const requested=config.localization?.locale;if(requested&&requested!==store.getState().locale)store.getState().setLocale(requested)},[config.localization?.locale,store]);
  const locale=resolveQChatLocale(config.localization,config.localization?.locale??storedLocale);
  const theme=config.theme;const style={"--qchat-accent":theme?.accent,"--qchat-bg":theme?.background,"--qchat-fg":theme?.foreground,"--qchat-surface":theme?.surface,"--qchat-muted":theme?.muted,"--qchat-radius":theme?.radius,"--qchat-font":locale.fontFamily??theme?.fontFamily,"--qchat-motion":String(theme?.motionScale??1),"--qchat-space":theme?.spacingUnit,"--qchat-composer-bg":theme?.composerSurface,"--qchat-composer-border":theme?.composerBorder,"--qchat-control-bg":theme?.controlSurface,"--qchat-control-fg":theme?.controlForeground,"--qchat-rail-gap":theme?.railGap,"--qchat-rail-card-width":theme?.railCardWidth,"--qchat-product-padding":theme?.productPadding,"--qchat-product-image-height":theme?.productImageHeight,"--qchat-product-image-radius":theme?.productImageRadius,"--qchat-message-padding":theme?.messagePadding,"--qchat-thread-gap":theme?.threadGap,"--qchat-thread-width":theme?.threadWidth,"--qchat-loading-image-height":theme?.loadingImageHeight??theme?.productImageHeight,"--qchat-voice-accent":theme?.voiceAccent} as CSSProperties;
  return <QChatConfigContext.Provider value={config}><QChatStoreContext.Provider value={store}><div className="qchat-root" lang={locale.code} dir={locale.direction} style={style}>{children}</div></QChatStoreContext.Provider></QChatConfigContext.Provider>
}
export function useQChatSelector<T>(selector:(state:QChatStoreState)=>T):T{const store=useContext(QChatStoreContext);if(!store)throw new Error("QChat hooks must be used inside QChatProvider");return useStore(store,selector)}
export const useQChatRecordPerformance=()=>useQChatSelector((state)=>state.recordPerformance);
export const useQChatMessages=()=>useQChatSelector((s)=>s.messages);export const useQChatComposer=()=>useQChatSelector(useShallow((s)=>({draft:s.draft,attachments:s.attachments,setDraft:s.setDraft,setAttachments:s.setAttachments,submit:s.submit,cancel:s.cancel,status:s.status})));export const useQChatRunState=()=>useQChatSelector(useShallow((s)=>({status:s.status,reasoning:s.reasoning,error:s.error})));export const useQChatGeneratedUI=()=>useQChatSelector(useShallow((s)=>({document:s.document,generating:s.generatingUI,selections:s.selections})));export const useQChatTools=()=>useQChatSelector((s)=>s.tools);export const useQChatPerformance=()=>useQChatSelector((s)=>s.performance);export const useQChatConfig=()=>useContext(QChatConfigContext);
export function useQChatLocale(){const config=useQChatConfig();const locale=useQChatSelector((state)=>state.locale);const setStoredLocale=useQChatSelector((state)=>state.setLocale);const resolved=resolveQChatLocale(config.localization,config.localization?.locale??locale);return {locale:resolved,locales:config.localization?.locales?.length?config.localization.locales:undefined,setLocale:(code:string)=>{const next=resolveQChatLocale(config.localization,code);if(next.code===code)setStoredLocale(code)},t:(key:import("../interfaces/react.interfaces").QChatTranslationKey)=>translateQChat(config.localization,resolved.code,key)} }
