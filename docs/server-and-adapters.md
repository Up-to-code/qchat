# Server and adapters
Implement `QChatAgentAdapter.run` as an async iterable translating your framework's output into canonical QChat events. Keep provider keys, prompts, tools, and action authorization on the server. Abort the provider when `input.signal` fires.

The server accumulates `ui.delta` events, decodes completed TOON, validates it, and emits `ui.complete` only after compilation succeeds. Invalid output receives one repair attempt by default.
