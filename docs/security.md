# Security model
The model emits data, never JSX, HTML, CSS, JavaScript, imports, or event handlers. The server applies byte, depth, collection, string, action, protocol, and optional image-host limits. Browser actions are untrusted requests and must pass the server authorizer. Error details are redacted by default.

Custom-prompt validation is structural only; the host remains responsible for semantic safety. Apply authentication, authorization, rate limiting, CSRF protection, and provider-specific policy at the application boundary.
