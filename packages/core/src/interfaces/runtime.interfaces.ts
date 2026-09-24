/** Public contracts shared by QChat adapters, servers, transports, and renderers. */
export type QChatRole = "user" | "assistant" | "system";
export interface QChatMessageAttachment { readonly kind:"image"|"file"; readonly mediaType:string; readonly filename?:string; readonly previewUrl?:string }
export interface QChatMessageRecord { readonly id: string; readonly role: QChatRole; readonly content: string; readonly createdAt: string; readonly attachments?:readonly QChatMessageAttachment[] }
export interface QChatToolDescriptor { readonly name: string; readonly description: string; readonly inputSchema?: Readonly<Record<string, unknown>> }
export interface QChatRequestMetadata { readonly conversationId: string; readonly runId: string; readonly userId?: string; readonly locale?: string; readonly [key: string]: unknown }
export interface QChatRunInput { readonly messages: readonly QChatMessageRecord[]; readonly tools: readonly QChatToolDescriptor[]; readonly systemPrompt: string; readonly metadata: QChatRequestMetadata; readonly signal: AbortSignal; readonly repair?: { readonly attempt: number; readonly diagnostics: readonly string[] } }
export interface QChatUsage { readonly inputTokens?: number; readonly outputTokens?: number }
export interface QChatPerformanceRecord { readonly name: string; readonly durationMs: number; readonly runId: string; readonly timestamp: string; readonly attributes?: Readonly<Record<string, string | number | boolean>> }
export interface QChatAction { readonly name: "product.select" | "product.add" | "product.open"; readonly sourceNodeId: string; readonly payload: Readonly<Record<string, string | number | boolean>>; readonly conversationId: string; readonly runId: string }
export type QChatActionResult = { readonly status: "accepted"; readonly message?: string; readonly navigationUrl?: string } | { readonly status: "rejected"; readonly message: string };
export interface QChatErrorShape { readonly code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED"; readonly message: string; readonly retryable: boolean; readonly diagnostics?: readonly string[] }
