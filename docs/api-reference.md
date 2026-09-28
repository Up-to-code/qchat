# API reference

## @qchat/server

- `createQChatServer(config: QChatServerConfig): QChatServer` — builds the runtime. Key config: `adapter` (your agent framework), `customSystemPrompt`, `tools`, `maxCompilationRetries` (default 1), `timeoutMs` (default 60_000), `compilerLimits` (default `{maxDocumentBytes: 128_000, maxDepth: 8, maxCollectionItems: 12}`), `allowedImageHosts` (always pass a non-empty list; empty means allow-all), `authorizeAction` (absent means every action is rejected), `telemetry`, `redactErrors`.
- `QChatServer.run(request: QChatRunRequest): AsyncIterable<QChatAgentEvent>` — streams adapter events, compiles UI output, yields `ui.complete` plus the terminal event.
- `QChatServer.handleAction(action: QChatAction): Promise<QChatActionResult>` — runs `authorizeAction` or rejects with "No action authorizer is configured."
- `compileToonUI(source, limits, allowedImageHosts = []): QChatCompileResult` — standalone TOON decode, validate, and limit check. Returns `{document?, diagnostics, durationMs}`.
- `composeSystemPrompt(includeDefault, custom): string` and `normalizeCustomPrompt(value): string | undefined` — prompt assembly with control-character rejection.
- `QChatAgentAdapter` — the only interface a host framework implements: `run(input: QChatRunInput): AsyncIterable<QChatAgentEvent>`.

## @qchat/react

- `QChatProvider({client, config, initialMessages, initialDocument, initialTools, conversationId, children})` — wires the store, locale/theme CSS variables, and config context.
- `createQChatClient(client): QChatClient` — freezes a client definition.
- Hooks: `useQChatMessages`, `useQChatComposer` (`draft`, `setDraft`, `attachments`, `submit`, `cancel`, `status`), `useQChatRunState`, `useQChatGeneratedUI`, `useQChatTools`, `useQChatPerformance`, `useQChatConfig`, `useQChatLocale` (`locale`, `setLocale`, `t`), `useQChatSelector`, `useQChatRecordPerformance`.
- Components: `QChatThread`, `QChatMessage`, `QChatComposer` (`suggestions`, `agentLabel`), `QChatThinking`, `QChatToolActivity`, `QChatGeneratedUI`.
- `createQChatHostView(component, data, schema)` — renders host-owned UI with Zod-validated data instead of a generated document.
- `resolveQChatLocale`, `translateQChat`, `defaultLocales` — locale resolution and translation (including RTL).

## @qchat/core

- Event union: `text.delta`, `tool.start`, `tool.result`, `tool.error`, `ui.start`, `ui.delta`, `ui.complete`, `reasoning.status`, `complete`, `failure`.
- UI nodes: `product-card`, `product-collection`, `status`, `info-card` under schema version `"1"`.
- `qChatUIDocumentSchema`, product-variant schemas and catalog helpers for validation and variant resolution.

## @qchat/orpc

- `qChatORPCContract` — `run` (event iterator) and `action` routes; `qChatEventSchema`, `qChatActionSchema` (actions limited to `product.select`, `product.add`, `product.open`).
