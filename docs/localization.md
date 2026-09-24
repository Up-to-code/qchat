# Localization and RTL

`QChatConfig.localization` is the library's locale interface. Each locale has a BCP-47 `code`, display `label`, `direction`, and optional `fontFamily`. The provider keeps locale state per instance; `useQChatLocale()` returns the active locale, configured options, a guarded `setLocale(code)`, and `t(key)` for library chrome. A host can also control it with `localization.locale` (as the showcase navbar does).

```tsx
<QChatProvider
  client={client}
  config={{
    localization: {
      locale: selectedLocale,
      defaultLocale: "en-US",
      locales: [
        { code: "en-US", label: "English", direction: "ltr" },
        { code: "ar-EG", label: "العربية", direction: "rtl", fontFamily: '"Noto Sans Arabic", sans-serif' },
        { code: "fr-FR", label: "Français", direction: "ltr" },
      ],
      translations: { "fr-FR": { sendMessage: "Envoyer", addImage: "Ajouter une image" } },
    },
  }}
>
  <QChatThread />
</QChatProvider>
```

English and Arabic chrome strings are built in; missing custom translations fall back to English. This does not translate model-authored titles, descriptions, prices, user messages, or host-provided labels automatically. The selected locale is forwarded to the agent adapter, and the OpenRouter showcase asks the model to reply in that locale. Hosts should provide localized catalog data where needed.

The provider applies `lang`, `dir`, and the locale font to the entire runtime. RTL changes message alignment and the product rail's starting edge; product navigation handles negative RTL scroll offsets. The preview additionally loads Noto Sans Arabic and places its globe selector in the navbar, but that navbar is not part of `@qchat/react`.
