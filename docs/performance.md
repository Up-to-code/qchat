# Performance diagnostics

The preview's Diagnostics disclosure includes a rolling 200-record timing log. Download it as JSON; it contains stage names, durations, model identifiers, run IDs, timestamps and error/status codes, not prompts, images, audio, credentials or response text. Set `QCHAT_LOG_PERFORMANCE=1` to emit the same server metrics as structured console logs. Production consumers can subscribe through `QChatConfig.telemetry.onRecord`, set `slowThresholdMs`, read `useQChatPerformance`, or add host metrics through `useQChatRecordPerformance`.

| Stage | What it measures |
| --- | --- |
| `voice.permission` | Browser microphone permission and device acquisition |
| `voice.capture` | Time the microphone was recording |
| `voice.audio_decode` | Browser audio decoding and mixing |
| `voice.live.connected` | Microphone permission, token provisioning, and provider connection |
| `voice.transcription_provider` | Gemini transcription request |
| `server.validation` | Server request reading and validation |
| `orchestrator.graph` | LangGraph routing and host retrieval |
| `provider.headers` | Model request to provider response headers |
| `provider.first_token` | Model request to first text delta |
| `transport.first_text` | Browser request to first text event received |
| `runtime.first_text` | Submit to first text event delivered to Zustand |
| `runtime.max_dispatch` | Slowest synchronous store event update |
| `react.first_commit` | First text event receipt to React effect after commit; not paint time |

Timings overlap. Do not sum them. Comparing provider first-token time with browser first-text time highlights overhead outside the provider call, but does not separate network latency from server startup. Provider first-token time includes provider queue/compute and network; The provider does not expose a separate queue timing here. Server and browser durations each use their own monotonic clock.

The preview marks stages over five seconds as slow, excluding intentional recording duration. Native voice calls use provider voice activity detection; there is no local inference worker or per-turn recording/transcription/chat/synthesis cascade. Exiting closes the provider session, microphone tracks, audio contexts, and queued playback. Dictation is a separate recording workflow.

Try `/voice-check` for synthetic Arabic and English transcription, and `/message-states` for message rendering. Free provider limits and connection delays are reported separately from UI processing.
