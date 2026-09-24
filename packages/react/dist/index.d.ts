import { ComponentType, ReactNode } from 'react';
import * as _qchat_core from '@qchat/core';
import { QChatMessageRecord, QChatAgentEvent, QChatAction, QChatActionResult, QChatErrorShape, QChatUIDocument, QChatPerformanceRecord } from '@qchat/core';
import * as react_jsx_runtime from 'react/jsx-runtime';

/** Browser-safe configuration, transport, state, slot, and component interfaces. */

interface QChatClientCapabilities {
    readonly attachments?: boolean;
    readonly dictation?: boolean;
    readonly modelSelection?: boolean;
    readonly tools?: boolean;
}
interface QChatClient {
    readonly capabilities: QChatClientCapabilities;
    run(input: {
        readonly messages: readonly QChatMessageRecord[];
        readonly conversationId: string;
        readonly runId: string;
        readonly signal: AbortSignal;
    }): AsyncIterable<QChatAgentEvent>;
    action(action: QChatAction): Promise<QChatActionResult>;
}
interface QChatTheme {
    readonly accent?: string;
    readonly background?: string;
    readonly foreground?: string;
    readonly surface?: string;
    readonly muted?: string;
    readonly radius?: string;
    readonly fontFamily?: string;
    readonly motionScale?: number;
}
interface QChatSlotProps {
    readonly children?: ReactNode;
    readonly className?: string;
}
interface QChatSlots {
    readonly composer?: ComponentType<QChatSlotProps>;
    readonly thread?: ComponentType<QChatSlotProps>;
    readonly userAvatar?: ComponentType;
    readonly assistantAvatar?: ComponentType;
    readonly thinking?: ComponentType<QChatSlotProps>;
    readonly toolActivity?: ComponentType<QChatSlotProps>;
    readonly loading?: ComponentType;
    readonly error?: ComponentType<{
        error: QChatErrorShape;
    }>;
}
interface QChatConfig {
    readonly theme?: QChatTheme;
    readonly slots?: QChatSlots;
}
interface QChatToolState {
    readonly id: string;
    readonly name: string;
    readonly status: "running" | "complete" | "error";
    readonly summary?: string;
}
interface QChatStoreState {
    readonly messages: readonly QChatMessageRecord[];
    readonly draft: string;
    readonly status: "idle" | "running" | "error";
    readonly reasoning?: {
        readonly label: string;
        readonly startedAt: number;
        readonly elapsedMs: number;
    };
    readonly tools: readonly QChatToolState[];
    readonly document?: QChatUIDocument;
    readonly generatingUI: boolean;
    readonly error?: QChatErrorShape;
    readonly performance: readonly QChatPerformanceRecord[];
    readonly selections: Readonly<Record<string, string>>;
    setDraft(value: string): void;
    submit(): Promise<void>;
    cancel(): void;
    dispatchAction(action: Omit<QChatAction, "conversationId" | "runId">): Promise<QChatActionResult>;
    select(key: string, value: string): void;
}
interface QChatProviderProps {
    readonly client: QChatClient;
    readonly config?: QChatConfig;
    readonly initialMessages?: readonly QChatMessageRecord[];
    readonly conversationId?: string;
    readonly children: ReactNode;
}

declare function createQChatClient(client: QChatClient): QChatClient;

declare function QChatProvider({ client, config, initialMessages, conversationId, children }: QChatProviderProps): react_jsx_runtime.JSX.Element;
declare function useQChatSelector<T>(selector: (state: QChatStoreState) => T): T;
declare const useQChatMessages: () => readonly _qchat_core.QChatMessageRecord[];
declare const useQChatComposer: () => {
    draft: string;
    setDraft: (value: string) => void;
    submit: () => Promise<void>;
    cancel: () => void;
    status: "running" | "error" | "idle";
};
declare const useQChatRunState: () => {
    status: "running" | "error" | "idle";
    reasoning: {
        readonly label: string;
        readonly startedAt: number;
        readonly elapsedMs: number;
    } | undefined;
    error: _qchat_core.QChatErrorShape | undefined;
};
declare const useQChatGeneratedUI: () => {
    document: _qchat_core.QChatUIDocument | undefined;
    generating: boolean;
    selections: Readonly<Record<string, string>>;
};
declare const useQChatTools: () => readonly QChatToolState[];
declare const useQChatPerformance: () => readonly _qchat_core.QChatPerformanceRecord[];
declare const useQChatConfig: () => QChatConfig;

declare function QChatThread(): react_jsx_runtime.JSX.Element;

declare function QChatMessage({ message }: {
    readonly message: QChatMessageRecord;
}): react_jsx_runtime.JSX.Element;

declare function QChatComposer(): react_jsx_runtime.JSX.Element;

declare function QChatThinking(): react_jsx_runtime.JSX.Element | null;

declare function QChatToolActivity(): react_jsx_runtime.JSX.Element | null;

declare function QChatGeneratedUI(): react_jsx_runtime.JSX.Element | null;

export { type QChatClient, type QChatClientCapabilities, QChatComposer, type QChatConfig, QChatGeneratedUI, QChatMessage, QChatProvider, type QChatProviderProps, type QChatSlotProps, type QChatSlots, type QChatStoreState, type QChatTheme, QChatThinking, QChatThread, QChatToolActivity, type QChatToolState, createQChatClient, useQChatComposer, useQChatConfig, useQChatGeneratedUI, useQChatMessages, useQChatPerformance, useQChatRunState, useQChatSelector, useQChatTools };
