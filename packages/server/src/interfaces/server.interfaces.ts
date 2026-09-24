/** Server-only adapter, configuration, telemetry, and action authorization contracts. */
import type { QChatAction,QChatActionResult,QChatAgentEvent,QChatPerformanceRecord,QChatRunInput,QChatToolDescriptor } from "@qchat/core";
export interface QChatAgentAdapter { run(input:QChatRunInput):AsyncIterable<QChatAgentEvent> }
export interface QChatCompilerLimits { readonly maxDocumentBytes:number; readonly maxDepth:number; readonly maxCollectionItems:number }
export interface QChatTelemetry { record(record:QChatPerformanceRecord):void|Promise<void> }
export interface QChatServerConfig { readonly adapter:QChatAgentAdapter; readonly includeDefaultSystemPrompt?:boolean; readonly customSystemPrompt?:string; readonly tools?:readonly QChatToolDescriptor[]; readonly maxCompilationRetries?:number; readonly timeoutMs?:number; readonly compilerLimits?:Partial<QChatCompilerLimits>; readonly allowedImageHosts?:readonly string[]; readonly authorizeAction?:(action:QChatAction)=>Promise<QChatActionResult>|QChatActionResult; readonly telemetry?:QChatTelemetry; readonly redactErrors?:boolean }
export interface QChatRunRequest { readonly messages:QChatRunInput["messages"]; readonly metadata:QChatRunInput["metadata"]; readonly signal?:AbortSignal }
export interface QChatServer { run(request:QChatRunRequest):AsyncIterable<QChatAgentEvent>; handleAction(action:QChatAction):Promise<QChatActionResult>; readonly systemPrompt:string }
