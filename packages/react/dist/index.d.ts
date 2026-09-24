import { ComponentType, ReactNode } from 'react';
import * as _qchat_core from '@qchat/core';
import { QChatMessageRecord, QChatAgentEvent, QChatAction, QChatActionResult, QChatPerformanceRecord, QChatErrorShape, QChatProductVariantCatalog, QChatUIDocument } from '@qchat/core';
import * as react_jsx_runtime from 'react/jsx-runtime';

/** Browser-safe configuration, transport, state, slot, and component interfaces. */

interface QChatClientCapabilities {
    readonly attachments?: boolean;
    readonly dictation?: boolean;
    readonly modelSelection?: boolean;
    readonly tools?: boolean;
}
type QChatAttachment = {
    readonly kind: "image";
    readonly mediaType: string;
    readonly dataUrl: string;
    readonly filename?: string;
} | {
    readonly kind: "file";
    readonly mediaType: string;
    readonly uploadId: string;
    readonly filename?: string;
};
interface QChatAttachmentPolicy {
    readonly acceptedMimeTypes: readonly string[];
    readonly maxFiles?: number;
    readonly maxFileSizeBytes?: number;
    readonly maxVisible?: number;
    readonly processFile?: (file: File, options: {
        readonly signal: AbortSignal;
        readonly onProgress: (percent: number) => void;
    }) => Promise<QChatAttachment>;
}
/** Host-selected voice adapter. Recording, transcription, and speech are never assumed to exist in every browser. */
interface QChatLiveVoiceOptions {
    readonly locale: string;
    readonly signal: AbortSignal;
    readonly onState: (state: "permission" | "connecting" | "listening" | "speaking" | "closed") => void;
    readonly onError: (message: string) => void;
    readonly onLevel?: (level: number, elapsedMs: number, device: string) => void;
    readonly onMetric?: (name: string, durationMs: number) => void;
}
interface QChatVoiceAdapter {
    readonly connect?: (options: QChatLiveVoiceOptions) => Promise<{
        close(): void;
    }>;
    readonly preferRecording?: boolean;
    readonly transcribe?: (audio: Blob, locale: string, signal: AbortSignal, onProgress?: (label: string, metric?: {
        readonly name: string;
        readonly durationMs: number;
    }) => void) => Promise<string>;
    readonly speak?: (text: string, locale: string, signal: AbortSignal, onProgress?: (label: string, metric?: {
        readonly name: string;
        readonly durationMs: number;
    }) => void) => Promise<void>;
}
interface QChatClient {
    readonly capabilities: QChatClientCapabilities;
    run(input: {
        readonly messages: readonly QChatMessageRecord[];
        readonly attachments: readonly QChatAttachment[];
        readonly locale: string;
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
    readonly spacingUnit?: string;
    readonly composerSurface?: string;
    readonly composerBorder?: string;
    readonly controlSurface?: string;
    readonly controlForeground?: string;
    readonly railGap?: string;
    readonly railCardWidth?: string;
    readonly productPadding?: string;
    readonly productImageHeight?: string;
    readonly productImageRadius?: string;
    readonly messagePadding?: string;
    readonly threadGap?: string;
    readonly threadWidth?: string;
    readonly loadingImageHeight?: string;
    readonly voiceAccent?: string;
}
/** Host-owned locale metadata and chrome copy. Model-authored content is not auto-translated. */
interface QChatLocaleDefinition {
    readonly code: string;
    readonly label: string;
    readonly direction: "ltr" | "rtl";
    readonly fontFamily?: string;
}
type QChatTranslationKey = "thinking" | "thoughtFor" | "second" | "seconds" | "loadingProducts" | "color" | "size" | "chooseAvailable" | "previousProducts" | "nextProducts" | "sendMessage" | "stopGeneration" | "addImage" | "startVoiceMode" | "examplePrompts" | "messagePlaceholder" | "you" | "read" | "startDictation" | "stopDictation" | "exitVoiceMode" | "listening" | "speaking";
type QChatTranslations = Readonly<Record<QChatTranslationKey, string>>;
interface QChatLocalization {
    readonly locale?: string;
    readonly defaultLocale?: string;
    readonly locales?: readonly QChatLocaleDefinition[];
    readonly translations?: Readonly<Record<string, Partial<QChatTranslations>>>;
}
interface QChatSlotProps {
    readonly children?: ReactNode;
    readonly className?: string;
}
/** Trusted host-authored UI. The model cannot choose its component or data. */
interface QChatHostView {
    readonly render: () => ReactNode;
}
interface QChatSlots {
    readonly composer?: ComponentType<QChatSlotProps>;
    readonly thread?: ComponentType<QChatSlotProps>;
    readonly message?: ComponentType<{
        readonly message: QChatMessageRecord;
    }>;
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
    readonly telemetry?: {
        readonly onRecord?: (record: QChatPerformanceRecord) => void;
        readonly slowThresholdMs?: number;
    };
    readonly theme?: QChatTheme;
    readonly localization?: QChatLocalization;
    readonly attachments?: QChatAttachmentPolicy;
    readonly voice?: QChatVoiceAdapter;
    readonly slots?: QChatSlots;
    readonly hostView?: QChatHostView;
    readonly productVariants?: QChatProductVariantCatalog;
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
    readonly attachments: readonly QChatAttachment[];
    readonly locale: string;
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
    recordPerformance(record: QChatPerformanceRecord): void;
    setDraft(value: string): void;
    setAttachments(value: readonly QChatAttachment[]): void;
    setLocale(value: string): void;
    submit(): Promise<void>;
    cancel(): void;
    dispatchAction(action: Omit<QChatAction, "conversationId" | "runId">): Promise<QChatActionResult>;
    select(key: string, value: string): void;
}
interface QChatProviderProps {
    readonly client: QChatClient;
    readonly config?: QChatConfig;
    readonly initialMessages?: readonly QChatMessageRecord[];
    readonly initialDocument?: QChatUIDocument;
    readonly initialTools?: readonly QChatToolState[];
    readonly conversationId?: string;
    readonly children: ReactNode;
}

declare const defaultLocales: readonly QChatLocaleDefinition[];
declare function resolveQChatLocale(localization: QChatLocalization | undefined, requested: string | undefined): QChatLocaleDefinition;
/** Translate library chrome with English fallback; hosts can add any BCP-47 locale. */
declare function translateQChat(localization: QChatLocalization | undefined, locale: string, key: QChatTranslationKey): string;

declare function createQChatClient(client: QChatClient): QChatClient;

/** Bind a host component to host-validated data; no model output is involved. */
declare function createQChatHostView<T>(component: ComponentType<{
    readonly data: T;
}>, data: unknown, validator: {
    parse(value: unknown): T;
}): QChatHostView;

declare function QChatProvider({ client, config, initialMessages, initialDocument, initialTools, conversationId, children }: QChatProviderProps): react_jsx_runtime.JSX.Element;
declare function useQChatSelector<T>(selector: (state: QChatStoreState) => T): T;
declare const useQChatRecordPerformance: () => (record: _qchat_core.QChatPerformanceRecord) => void;
declare const useQChatMessages: () => readonly _qchat_core.QChatMessageRecord[];
declare const useQChatComposer: () => {
    draft: string;
    attachments: readonly QChatAttachment[];
    setDraft: (value: string) => void;
    setAttachments: (value: readonly QChatAttachment[]) => void;
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
declare function useQChatLocale(): {
    locale: QChatLocaleDefinition;
    locales: readonly QChatLocaleDefinition[] | undefined;
    setLocale: (code: string) => void;
    t: (key: QChatTranslationKey) => string;
};

declare function QChatThread(): react_jsx_runtime.JSX.Element;

declare function QChatMessage({ message }: {
    readonly message: QChatMessageRecord;
}): react_jsx_runtime.JSX.Element | null;

interface QChatComposerProps {
    readonly suggestions?: readonly string[];
    readonly agentLabel?: string;
}
declare function QChatComposer({ suggestions, agentLabel }: QChatComposerProps): react_jsx_runtime.JSX.Element;

declare function QChatThinking(): react_jsx_runtime.JSX.Element | null;

declare function QChatToolActivity(): react_jsx_runtime.JSX.Element | null;

declare function QChatGeneratedUI(): react_jsx_runtime.JSX.Element | null;

export { type QChatAttachment, type QChatAttachmentPolicy, type QChatClient, type QChatClientCapabilities, QChatComposer, type QChatComposerProps, type QChatConfig, QChatGeneratedUI, type QChatHostView, type QChatLiveVoiceOptions, type QChatLocaleDefinition, type QChatLocalization, QChatMessage, QChatProvider, type QChatProviderProps, type QChatSlotProps, type QChatSlots, type QChatStoreState, type QChatTheme, QChatThinking, QChatThread, QChatToolActivity, type QChatToolState, type QChatTranslationKey, type QChatTranslations, type QChatVoiceAdapter, createQChatClient, createQChatHostView, defaultLocales, resolveQChatLocale, translateQChat, useQChatComposer, useQChatConfig, useQChatGeneratedUI, useQChatLocale, useQChatMessages, useQChatPerformance, useQChatRecordPerformance, useQChatRunState, useQChatSelector, useQChatTools };
