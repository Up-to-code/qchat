# Gemini preview

The live preview runs Google AI Studio models through server-side LangGraph. QChat packages stay provider-independent. Set GEMINI_API_KEY in ignored .env.local; never expose it through NEXT_PUBLIC variables. See .env.example for separate text, vision, UI, transcription, and speech model overrides.

The host defaults are in app/server/showcase-model-config.ts. Text uses Gemini 3.1 Flash-Lite; vision, structured UI, and transcription use Gemini 3.5 Flash. Speech uses a separate audio-output model. Catalog availability does not guarantee that a model can be invoked by an account. Free quotas vary, and this application does not enable billing. Image generation stays unavailable until a suitable provider is explicitly configured.

Voice mode uses Gemini Live native audio through the Google SDK. The browser requests microphone permission, receives a constrained one-use token from the local server, and opens a bidirectional provider session. Audio streams directly; interruption stops queued playback. It does not create chat messages or call transcription/chat/TTS endpoints for each turn. The microphone button is a separate dictation feature. The synthetic English and Arabic fixtures at /voice-check test dictation without accessing a microphone. Set GEMINI_LIVE_MODEL and GEMINI_LIVE_VOICE in the host configuration. The token endpoint is restricted to localhost; deployers must add authenticated session provisioning.

HTTP 404 identifies a missing model, 429 identifies quota exhaustion, and 503 identifies temporary overload. Transient 5xx responses get one bounded retry before streaming starts; quota and credential errors do not. Diagnostics expose stage durations and retries without logging keys or prompts.

Live commerce uses an allowlisted catalog node and validated generated UI, with one repair attempt. The test agent remains deterministic. Live generated actions require a host authorizer. See localization.md and performance.md.
