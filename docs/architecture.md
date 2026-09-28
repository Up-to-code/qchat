# Architecture

QChat is an adapter-first generative UI runtime. The model never renders pixels and never executes code: it emits a constrained TOON document, the server compiles and validates it against a strict schema, and the client renders it with fixed host-owned components.

## Package map

- `@qchat/core` — shared contracts. Message, tool, action, usage, and run types (`interfaces/runtime.interfaces.ts`), the canonical agent event union (`interfaces/event.interfaces.ts`: `text.delta`, `tool.*`, `ui.*`, `complete`, `failure`), render-plan node types (`interfaces/ui-document.interfaces.ts`: product-card, collection, status, info-card), product-variant types, plus Zod schemas (`schemas/ui-document.schema.ts`, `schemas/product-variant.schema.ts`). Every node schema is `.strict()` with URL, color, and length caps.
- `@qchat/server` — the compiler and runtime. `compileToonUI` decodes TOON, enforces byte/depth/collection/image-host limits, and returns `{document?, diagnostics, durationMs}`. `createQChatServer` runs the adapter event loop: buffers `ui.delta` chunks with a byte bound, compiles on `complete`, retries with repair diagnostics (`maxCompilationRetries`), enforces `timeoutMs`/abort, records telemetry, and exposes `handleAction` which rejects unless `authorizeAction` is configured (deny-by-default).
- `@qchat/orpc` — transport contract. oRPC `run` route streams agent events and `action` accepts only `product.select`, `product.add`, `product.open` with scalar payloads.
- `@qchat/react` — client runtime and UI. A Zustand store (`create-qchat-store.ts`) owns messages, draft, run state, tools, generated document, and performance records; `QChatProvider` exposes it through hooks (`useQChatMessages`, `useQChatComposer`, `useQChatRunState`, `useQChatGeneratedUI`, `useQChatTools`, `useQChatPerformance`, `useQChatLocale`, `useQChatConfig`). Components render messages, thread, composer, thinking state, tool activity, and the validated `UIDocument`. Model strings are rendered as React text children only.

## Request lifecycle (preview app)

1. `POST /api/qchat/run` validates the caller (same-origin + rate limit), the body (16 MB cap, Zod), and the key, then streams NDJSON events.
2. `showcase-agent-graph` (LangGraph) classifies the prompt, runs catalog lookup or knowledge retrieval from trusted host fixtures, and returns a plan.
3. For UI tasks, the plan's trusted catalog records are interpolated into a TOON-only system prompt and streamed through the Gemini provider adapter as `ui.*` events.
4. `createQChatServer` compiles the TOON stream. Invalid output triggers repair retries, then a trusted host fallback document. Failures are mapped to generic, redacted messages.
5. The React client applies events to the store, renders progress, and resolves product-variant selections (color/size/price/availability) locally.

Voice follows the same shape: short-lived one-use Live tokens (`/api/qchat/voice/session`), transcription and speech endpoints, and a browser Live client. No transcript bubbles are injected; the microphone action is separate dictation.

## Trust boundaries

- Model output is untrusted data: schema-validated, size-bounded, host-allowlisted, never executed.
- Catalog and retriever fixtures are trusted host data: hosts plugging untrusted sources inherit prompt-injection risk through that channel.
- Preview API routes are local-only: same-origin + rate limits hold for demos, but production hosts must add user authentication, per-user quotas, and an action authorizer.
- `oai-authenticated-user-*` headers are ChatGPT-proxy-injected identity with no signature: only trust them behind that proxy.
