import { QChatRunInput, QChatAgentEvent, QChatAction, QChatActionResult, QChatToolDescriptor, QChatPerformanceRecord, QChatUIDocument } from '@qchat/core';

/** Server-only adapter, configuration, telemetry, and action authorization contracts. */

interface QChatAgentAdapter {
    run(input: QChatRunInput): AsyncIterable<QChatAgentEvent>;
}
interface QChatCompilerLimits {
    readonly maxDocumentBytes: number;
    readonly maxDepth: number;
    readonly maxCollectionItems: number;
}
interface QChatTelemetry {
    record(record: QChatPerformanceRecord): void | Promise<void>;
}
interface QChatServerConfig {
    readonly adapter: QChatAgentAdapter;
    readonly includeDefaultSystemPrompt?: boolean;
    readonly customSystemPrompt?: string;
    readonly tools?: readonly QChatToolDescriptor[];
    readonly maxCompilationRetries?: number;
    readonly timeoutMs?: number;
    readonly compilerLimits?: Partial<QChatCompilerLimits>;
    readonly allowedImageHosts?: readonly string[];
    readonly authorizeAction?: (action: QChatAction) => Promise<QChatActionResult> | QChatActionResult;
    readonly telemetry?: QChatTelemetry;
    readonly redactErrors?: boolean;
}
interface QChatRunRequest {
    readonly messages: QChatRunInput["messages"];
    readonly metadata: QChatRunInput["metadata"];
    readonly signal?: AbortSignal;
}
interface QChatServer {
    run(request: QChatRunRequest): AsyncIterable<QChatAgentEvent>;
    handleAction(action: QChatAction): Promise<QChatActionResult>;
    readonly systemPrompt: string;
}

declare const QCHAT_SYSTEM_PROMPT = "You are operating inside QChat's generative UI environment.\nWhen a compact validated interface is more useful than prose, emit one complete TOON document through the UI channel. The decoded object must match QChat UI schema version 1.\nAllowed nodes: product-collection, product-card, info-card, and status. Allowed actions: product.select, product.add, product.open.\nNever emit JSX, HTML, CSS, JavaScript, component imports, event handlers, secrets, or executable code. Never choose visual theme values. Titles are at most 100 characters, product descriptions 280, info-card descriptions 500, collections 12 products, tags 6, options 12. Use stable unique IDs. UI is optional; ordinary prose is valid when it is clearer.";
declare function normalizeCustomPrompt(value: string | undefined): string | undefined;
declare function composeSystemPrompt(includeDefault: boolean, custom: string | undefined): string;

interface QChatCompileResult {
    readonly document?: QChatUIDocument;
    readonly diagnostics: readonly string[];
    readonly durationMs: number;
}
declare function compileToonUI(source: string, limits: QChatCompilerLimits, allowedImageHosts?: readonly string[]): QChatCompileResult;

declare function createQChatServer(config: QChatServerConfig): QChatServer;

export { QCHAT_SYSTEM_PROMPT, type QChatAgentAdapter, type QChatCompileResult, type QChatCompilerLimits, type QChatRunRequest, type QChatServer, type QChatServerConfig, type QChatTelemetry, compileToonUI, composeSystemPrompt, createQChatServer, normalizeCustomPrompt };
