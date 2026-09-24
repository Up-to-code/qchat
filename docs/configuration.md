# Configuration and customization
`includeDefaultSystemPrompt` defaults to `true`. A custom prompt is appended to the QChat instruction. When the default is disabled, a non-empty custom prompt is required.

Use `QChatConfig.theme` for palette, radius, typography, motion, and spacing. `spacingUnit` sets the base rhythm; the showcase uses `8px`. Composer and control colors have dedicated tokens (`composerSurface`, `composerBorder`, `controlSurface`, `controlForeground`). Rail and generated-UI geometry is controlled by `railGap`, `railCardWidth`, `productPadding`, `productImageHeight`, `productImageRadius`, `messagePadding`, `threadGap`, `threadWidth`, and `loadingImageHeight`. See [showcase-config.ts](../app/showcase-config.ts) for a host-owned example. Model output cannot set CSS or these tokens.

Use `QChatConfig.localization` to configure locale codes, labels, translations, font, and RTL/LTR direction. The library exposes `useQChatLocale`; see [localization](./localization.md). The preview globe is not part of the library.

Use slots to replace the composer, thread, avatars, thinking, tool activity, loading, and error views. Generated nodes stay restricted to the registered schema even when visual renderers are replaced.

The showcase composer chooses exactly one primary action: voice when empty and supported, send when text is entered, and a clickable stop control while streaming. `QChatConfig.voice.connect` owns provider-native voice calls, state changes, cancellation, audio levels, and errors. The preview uses Gemini Live; no browser speech-recognition fallback is used. `transcribe` remains an independent dictation adapter. Role-specific overrides are in `.env.example`. A model name alone does not guarantee that the account is eligible or that the model is free. The voice controls and their labels are configured in [showcase-config.ts](../app/showcase-config.ts).
# Attachment processing

Open `/message-states` in the preview for side-by-side English and Arabic regression examples: text, image only, image with caption, and file only. Message role controls alignment independently of text direction. Image-only messages have metadata above the image and no text bubble. Microphone startup requests permission before activating the listening view; recognition service errors are distinguished from permission errors.

`QChatConfig.attachments` controls accepted MIME types, maximum file count and size, and the number of visible composer previews. A fifth attachment becomes a `+N` overflow tile at the logical end of the row; `dir="rtl"` places the first attachment at the right edge. The showcase accepts PNG, JPEG, WebP, and GIF, up to 12 files of 3 MB each. The Send control remains disabled while any attachment is processing or has failed.

Hosts can supply `processFile(file, { signal, onProgress })` to upload PDFs, documents, or other allowlisted types to their own storage. Return a `{ kind: "file", mediaType, uploadId, filename }` descriptor after server-side authorization, or an image descriptor with a data URL. Sent attachments remain in the local message history as thumbnails or filenames. The preview's live OpenRouter adapter forwards images only; other file descriptors require a host adapter that understands them. File processing and final send are separate, so a dropped file is never sent before its processor resolves.

The demo Test agent runs a deterministic LangGraph workflow on the server and feeds TOON through QChat's compiler. Production adapters remain framework-neutral and may translate events from LangGraph, the Vercel AI SDK, or custom runtimes into `QChatAgentEvent`.
