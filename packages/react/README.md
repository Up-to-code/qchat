# @qchat/react
React 19 chat UI, isolated Zustand runtime, commerce renderers, theming, slots, and typed hooks. Import `@qchat/react/styles.css` once in your application.

## Host-authored UI (no model-generated component)

Pass a trusted React component and data through `config.hostView`. Validate the data first; this view takes precedence over a generated UI document and never accepts model-authored component code.

```tsx
import { createQChatHostView, QChatProvider, QChatThread } from "@qchat/react";
import { z } from "zod";

const emailSchema = z.object({ subject: z.string(), preview: z.string() });
function EmailPreview({ data }: { data: z.infer<typeof emailSchema> }) {
  return <div><strong>{data.subject}</strong><p>{data.preview}</p></div>;
}

const hostView = createQChatHostView(EmailPreview, incomingEmail, emailSchema);
<QChatProvider client={client} config={{ hostView }}>
  <QChatThread />
</QChatProvider>;
```

The host owns the component and its validation schema. This bypasses generated-UI rendering, but it does not automatically disable agent runs elsewhere in the thread.
