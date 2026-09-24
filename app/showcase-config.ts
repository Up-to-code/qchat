import type { QChatConfig } from "@qchat/react";
import { defaultLocales } from "@qchat/react";
import { createQChatProductVariantCatalog } from "@qchat/core";

/** Host-owned design rules. The model never receives or authors these values. */
export const showcaseTheme: NonNullable<QChatConfig["theme"]> = {
  background: "#1c1c1e",
  foreground: "#ececee",
  surface: "#252527",
  muted: "#96969b",
  accent: "#f1f1f2",
  radius: "16px",
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  motionScale: 1,
  spacingUnit: "8px",
  composerSurface: "#29292c",
  composerBorder: "#3d3d41",
  controlSurface: "#f1f1f2",
  controlForeground: "#202023",
  railGap: "16px",
  railCardWidth: "262px",
  productPadding: "12px",
  productImageHeight: "180px",
  productImageRadius: "12px",
  messagePadding: "10px 13px",
  threadGap: "16px",
  threadWidth: "730px",
  loadingImageHeight: "180px",
  voiceAccent: "#7377ff",
};

export const showcaseLocalization: NonNullable<QChatConfig["localization"]> = {
  defaultLocale: "en-US",
  locales: defaultLocales,
};

export const showcaseComposerRules = {
  placeholder: "Ask anything",
  defaultVoiceLanguage: showcaseLocalization.defaultLocale!,
  voiceLanguages: showcaseLocalization.locales!,
  maxImages: 4,
  maxImageBytes: 3_000_000,
  allowVoiceMode: true,
  allowDictation: true,
} as const;

export const showcaseAttachmentPolicy: NonNullable<QChatConfig["attachments"]> = {
  acceptedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  maxFiles: 12,
  maxFileSizeBytes: 3_000_000,
  maxVisible: 4,
};

/** Demo catalog facts. In production, load these from the commerce backend. */
export const showcaseProductVariants = createQChatProductVariantCatalog({
  "velocity-blue": [
    { id: "velocity-blue-9", color: "blue", size: "9", price: { amount: 189, currency: "USD" }, available: true },
    { id: "velocity-blue-10", color: "blue", size: "10", price: { amount: 189, currency: "USD" }, available: true },
    { id: "velocity-blue-11", color: "blue", size: "11", price: { amount: 189, currency: "USD" }, available: true },
    { id: "velocity-black-9", color: "black", size: "9", price: { amount: 199, currency: "USD" }, available: false },
    { id: "velocity-black-10", color: "black", size: "10", price: { amount: 199, currency: "USD" }, available: true },
    { id: "velocity-black-11", color: "black", size: "11", price: { amount: 199, currency: "USD" }, available: true },
  ],
});
