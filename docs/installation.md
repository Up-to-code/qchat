# Installation
Install `@qchat/core`, `@qchat/server`, `@qchat/orpc`, and `@qchat/react` as needed. Import `@qchat/react/styles.css` once. React 19.3 and React DOM 19.3 are peer dependencies; Tailwind is not required in the consuming application because QChat ships its component CSS.

Create the server with `createQChatServer`, mount the oRPC contract with the handler appropriate to Node, Hono, or Express, then create a browser transport with `createQChatClient` and place `QChatProvider` around the thread and composer.
