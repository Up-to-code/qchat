var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);

// src/localization/qchat-localization.ts
var defaultLocales = [
  { code: "en-US", label: "English", direction: "ltr" },
  { code: "ar-EG", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", direction: "rtl", fontFamily: '"Noto Sans Arabic", system-ui, sans-serif' }
];
var english = { thinking: "Thinking", thoughtFor: "Thought for", second: "second", seconds: "seconds", loadingProducts: "Loading products", color: "Color", size: "Size", chooseAvailable: "Choose an available color and size", previousProducts: "Previous products", nextProducts: "Next products", sendMessage: "Send message", stopGeneration: "Stop generation", addImage: "Add image", startVoiceMode: "Start voice mode", examplePrompts: "Example prompts", messagePlaceholder: "Ask anything", you: "You", read: "Read", startDictation: "Start dictation", stopDictation: "Stop dictation", exitVoiceMode: "Exit voice mode", listening: "Listening", speaking: "Speaking" };
var arabic = { thinking: "\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u0641\u0643\u064A\u0631", thoughtFor: "\u0627\u0633\u062A\u063A\u0631\u0642 \u0627\u0644\u062A\u0641\u0643\u064A\u0631", second: "\u062B\u0627\u0646\u064A\u0629", seconds: "\u062B\u0648\u0627\u0646\u064D", loadingProducts: "\u062C\u0627\u0631\u064D \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A", color: "\u0627\u0644\u0644\u0648\u0646", size: "\u0627\u0644\u0645\u0642\u0627\u0633", chooseAvailable: "\u0627\u062E\u062A\u0631 \u0644\u0648\u0646\u064B\u0627 \u0648\u0645\u0642\u0627\u0633\u064B\u0627 \u0645\u062A\u0627\u062D\u064A\u0646", previousProducts: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629", nextProducts: "\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u062A\u0627\u0644\u064A\u0629", sendMessage: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629", stopGeneration: "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0625\u0646\u0634\u0627\u0621", addImage: "\u0625\u0636\u0627\u0641\u0629 \u0635\u0648\u0631\u0629", startVoiceMode: "\u0628\u062F\u0621 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0635\u0648\u062A\u064A", examplePrompts: "\u0623\u0645\u062B\u0644\u0629 \u0644\u0644\u0623\u0633\u0626\u0644\u0629", messagePlaceholder: "\u0627\u0633\u0623\u0644 \u0639\u0646 \u0623\u064A \u0634\u064A\u0621", you: "\u0623\u0646\u062A", read: "\u062A\u0645\u062A \u0627\u0644\u0642\u0631\u0627\u0621\u0629", startDictation: "\u0628\u062F\u0621 \u0627\u0644\u0625\u0645\u0644\u0627\u0621", stopDictation: "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0625\u0645\u0644\u0627\u0621", exitVoiceMode: "\u0627\u0644\u062E\u0631\u0648\u062C \u0645\u0646 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0635\u0648\u062A\u064A", listening: "\u062C\u0627\u0631\u064D \u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0639", speaking: "\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u062D\u062F\u062B" };
function resolveQChatLocale(localization, requested) {
  var _a, _b, _c;
  const locales = ((_a = localization == null ? void 0 : localization.locales) == null ? void 0 : _a.length) ? localization.locales : defaultLocales;
  const selected = (_c = (_b = locales.find((item) => item.code === requested)) != null ? _b : locales.find((item) => item.code === (localization == null ? void 0 : localization.defaultLocale))) != null ? _c : locales[0];
  return selected;
}
function translateQChat(localization, locale, key) {
  var _a, _b, _c;
  return (_c = (_b = (_a = localization == null ? void 0 : localization.translations) == null ? void 0 : _a[locale]) == null ? void 0 : _b[key]) != null ? _c : locale.startsWith("ar") ? arabic[key] : english[key];
}

// src/client/create-qchat-client.ts
function createQChatClient(client) {
  return Object.freeze(client);
}

// src/host-view/create-qchat-host-view.tsx
import { createElement } from "react";
function createQChatHostView(component, data, validator) {
  const validated = validator.parse(data);
  return { render: () => createElement(component, { data: validated }) };
}

// src/provider/qchat-provider.tsx
import { useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

// src/store/create-qchat-store.ts
import { createStore } from "zustand/vanilla";
var id = () => {
  var _a, _b, _c;
  return (_c = (_b = (_a = globalThis.crypto) == null ? void 0 : _a.randomUUID) == null ? void 0 : _b.call(_a)) != null ? _c : Math.random().toString(36).slice(2);
};
function createQChatStore(client, initialMessages, conversationId, initialDocument, initialTools = [], initialLocale = "en-US") {
  let controller;
  let ticker;
  let activeRunId = initialDocument ? id() : "";
  return createStore((set, get) => ({
    messages: initialMessages,
    draft: "",
    attachments: [],
    locale: initialLocale,
    status: "idle",
    tools: initialTools,
    document: initialDocument,
    generatingUI: false,
    performance: [],
    selections: {},
    recordPerformance: (record) => set((state) => ({ performance: [...state.performance.slice(-199), record] })),
    setDraft: (draft) => set({ draft }),
    setAttachments: (attachments) => set({ attachments }),
    setLocale: (locale) => set({ locale }),
    select: (key, value) => set((state) => ({ selections: __spreadProps(__spreadValues({}, state.selections), { [key]: value }) })),
    cancel: () => controller == null ? void 0 : controller.abort(),
    dispatchAction: async (action) => client.action(__spreadProps(__spreadValues({}, action), { conversationId, runId: activeRunId })),
    submit: async () => {
      const text = get().draft.trim();
      const attachments = get().attachments;
      if (!text && attachments.length === 0 || controller) return;
      const runStarted = performance.now();
      let firstEvent = true;
      let firstText = true;
      let maxApplyMs = 0;
      let terminal = false;
      activeRunId = id();
      controller = new AbortController();
      const user = { id: id(), role: "user", content: text, createdAt: (/* @__PURE__ */ new Date()).toISOString(), attachments: attachments.map((attachment) => __spreadValues({ kind: attachment.kind, mediaType: attachment.mediaType, filename: attachment.filename }, attachment.kind === "image" ? { previewUrl: attachment.dataUrl } : {})) };
      const assistantId = id();
      const next = [...get().messages, user];
      set({ messages: [...next, { id: assistantId, role: "assistant", content: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() }], draft: "", attachments: [], status: "running", error: void 0, document: void 0, tools: [], generatingUI: false, reasoning: void 0 });
      ticker = setInterval(() => set((state) => state.reasoning ? { reasoning: __spreadProps(__spreadValues({}, state.reasoning), { elapsedMs: Date.now() - state.reasoning.startedAt }) } : {}), 100);
      const record = (name, durationMs, attributes = {}) => get().recordPerformance({ name, durationMs, runId: activeRunId, timestamp: (/* @__PURE__ */ new Date()).toISOString(), attributes: __spreadValues({ layer: "runtime" }, attributes) });
      try {
        try {
          for (var iter = __forAwait(client.run({ messages: next, attachments, locale: get().locale, conversationId, runId: activeRunId, signal: controller.signal })), more, temp, error; more = !(temp = await iter.next()).done; more = false) {
            const event = temp.value;
            if (controller.signal.aborted) break;
            if (firstEvent) {
              record("runtime.first_event", performance.now() - runStarted);
              firstEvent = false;
            }
            if (event.type === "text.delta" && firstText) {
              record("runtime.first_text", performance.now() - runStarted, { receivedAt: Date.now(), messageId: assistantId });
              firstText = false;
            }
            if (terminal && event.type !== "performance") continue;
            if (event.type === "complete" || event.type === "failure") terminal = true;
            const applyStarted = performance.now();
            applyEvent(event, assistantId, set);
            maxApplyMs = Math.max(maxApplyMs, performance.now() - applyStarted);
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter.return) && await temp.call(iter);
          } finally {
            if (error)
              throw error[0];
          }
        }
      } catch (e) {
        if (controller.signal.aborted) set({ status: "idle", reasoning: void 0, generatingUI: false });
        else set({ status: "error", error: { code: "ADAPTER_FAILED", message: "The agent run failed.", retryable: true }, generatingUI: false });
        record("runtime.error", performance.now() - runStarted, { cancelled: controller.signal.aborted });
      } finally {
        if (controller.signal.aborted) set({ status: "idle", reasoning: void 0, generatingUI: false, error: void 0 });
        record("runtime.max_dispatch", maxApplyMs);
        record("runtime.total", performance.now() - runStarted);
        if (ticker) clearInterval(ticker);
        ticker = void 0;
        controller = void 0;
        if (get().status === "running") set({ status: "error", generatingUI: false, error: { code: "ADAPTER_FAILED", message: "The agent stream ended before completion.", retryable: true } });
      }
    }
  }));
}
function applyEvent(event, assistantId, set) {
  switch (event.type) {
    case "text.delta":
      set((state) => ({ messages: state.messages.map((message) => message.id === assistantId ? __spreadProps(__spreadValues({}, message), { content: message.content + event.delta }) : message) }));
      break;
    case "reasoning.status":
      set((state) => {
        var _a, _b, _c, _d, _e;
        return { reasoning: { label: event.label, startedAt: (_b = (_a = state.reasoning) == null ? void 0 : _a.startedAt) != null ? _b : Date.now(), elapsedMs: (_e = (_d = event.elapsedMs) != null ? _d : (_c = state.reasoning) == null ? void 0 : _c.elapsedMs) != null ? _e : 0 } };
      });
      break;
    case "tool.start":
      set((state) => ({ tools: [...state.tools, { id: event.toolCallId, name: event.name, status: "running" }] }));
      break;
    case "tool.result":
      set((state) => ({ tools: state.tools.map((tool) => tool.id === event.toolCallId ? __spreadProps(__spreadValues({}, tool), { status: "complete", summary: event.summary }) : tool) }));
      break;
    case "tool.error":
      set((state) => ({ tools: state.tools.map((tool) => tool.id === event.toolCallId ? __spreadProps(__spreadValues({}, tool), { status: "error", summary: event.message }) : tool) }));
      break;
    case "ui.start":
      set({ generatingUI: true });
      break;
    case "ui.complete":
      set({ document: event.document, generatingUI: false });
      break;
    case "performance":
      set((state) => ({ performance: [...state.performance.slice(-199), event.record] }));
      break;
    case "failure":
      set({ status: "error", error: event.error, generatingUI: false });
      break;
    case "complete":
      set({ status: "idle", generatingUI: false });
      break;
  }
}

// src/provider/qchat-context.ts
import { createContext } from "react";
var QChatStoreContext = createContext(null);
var QChatConfigContext = createContext({});

// src/provider/qchat-provider.tsx
import { jsx } from "react/jsx-runtime";
function QChatProvider({ client, config = {}, initialMessages = [], initialDocument, initialTools = [], conversationId = "default", children }) {
  var _a, _b, _c, _d, _e, _f, _g;
  const [store] = useState(() => {
    var _a2, _b2, _c2;
    return createQChatStore(client, initialMessages, conversationId, initialDocument, initialTools, (_c2 = (_a2 = config.localization) == null ? void 0 : _a2.locale) != null ? _c2 : (_b2 = config.localization) == null ? void 0 : _b2.defaultLocale);
  });
  const storedLocale = useStore(store, (state) => state.locale);
  useEffect(() => store.subscribe((state, previous) => {
    var _a2, _b2;
    if (state.performance !== previous.performance) {
      const record = state.performance.at(-1);
      if (record) {
        try {
          (_b2 = (_a2 = config.telemetry) == null ? void 0 : _a2.onRecord) == null ? void 0 : _b2.call(_a2, record);
        } catch (e) {
        }
      }
    }
  }), [store, (_a = config.telemetry) == null ? void 0 : _a.onRecord]);
  useEffect(() => {
    var _a2;
    const requested = (_a2 = config.localization) == null ? void 0 : _a2.locale;
    if (requested && requested !== store.getState().locale) store.getState().setLocale(requested);
  }, [(_b = config.localization) == null ? void 0 : _b.locale, store]);
  const locale = resolveQChatLocale(config.localization, (_d = (_c = config.localization) == null ? void 0 : _c.locale) != null ? _d : storedLocale);
  const theme = config.theme;
  const style = { "--qchat-accent": theme == null ? void 0 : theme.accent, "--qchat-bg": theme == null ? void 0 : theme.background, "--qchat-fg": theme == null ? void 0 : theme.foreground, "--qchat-surface": theme == null ? void 0 : theme.surface, "--qchat-muted": theme == null ? void 0 : theme.muted, "--qchat-radius": theme == null ? void 0 : theme.radius, "--qchat-font": (_e = locale.fontFamily) != null ? _e : theme == null ? void 0 : theme.fontFamily, "--qchat-motion": String((_f = theme == null ? void 0 : theme.motionScale) != null ? _f : 1), "--qchat-space": theme == null ? void 0 : theme.spacingUnit, "--qchat-composer-bg": theme == null ? void 0 : theme.composerSurface, "--qchat-composer-border": theme == null ? void 0 : theme.composerBorder, "--qchat-control-bg": theme == null ? void 0 : theme.controlSurface, "--qchat-control-fg": theme == null ? void 0 : theme.controlForeground, "--qchat-rail-gap": theme == null ? void 0 : theme.railGap, "--qchat-rail-card-width": theme == null ? void 0 : theme.railCardWidth, "--qchat-product-padding": theme == null ? void 0 : theme.productPadding, "--qchat-product-image-height": theme == null ? void 0 : theme.productImageHeight, "--qchat-product-image-radius": theme == null ? void 0 : theme.productImageRadius, "--qchat-message-padding": theme == null ? void 0 : theme.messagePadding, "--qchat-thread-gap": theme == null ? void 0 : theme.threadGap, "--qchat-thread-width": theme == null ? void 0 : theme.threadWidth, "--qchat-loading-image-height": (_g = theme == null ? void 0 : theme.loadingImageHeight) != null ? _g : theme == null ? void 0 : theme.productImageHeight, "--qchat-voice-accent": theme == null ? void 0 : theme.voiceAccent };
  return /* @__PURE__ */ jsx(QChatConfigContext.Provider, { value: config, children: /* @__PURE__ */ jsx(QChatStoreContext.Provider, { value: store, children: /* @__PURE__ */ jsx("div", { className: "qchat-root", lang: locale.code, dir: locale.direction, style, children }) }) });
}
function useQChatSelector(selector) {
  const store = useContext(QChatStoreContext);
  if (!store) throw new Error("QChat hooks must be used inside QChatProvider");
  return useStore(store, selector);
}
var useQChatRecordPerformance = () => useQChatSelector((state) => state.recordPerformance);
var useQChatMessages = () => useQChatSelector((s) => s.messages);
var useQChatComposer = () => useQChatSelector(useShallow((s) => ({ draft: s.draft, attachments: s.attachments, setDraft: s.setDraft, setAttachments: s.setAttachments, submit: s.submit, cancel: s.cancel, status: s.status })));
var useQChatRunState = () => useQChatSelector(useShallow((s) => ({ status: s.status, reasoning: s.reasoning, error: s.error })));
var useQChatGeneratedUI = () => useQChatSelector(useShallow((s) => ({ document: s.document, generating: s.generatingUI, selections: s.selections })));
var useQChatTools = () => useQChatSelector((s) => s.tools);
var useQChatPerformance = () => useQChatSelector((s) => s.performance);
var useQChatConfig = () => useContext(QChatConfigContext);
function useQChatLocale() {
  var _a, _b, _c, _d;
  const config = useQChatConfig();
  const locale = useQChatSelector((state) => state.locale);
  const setStoredLocale = useQChatSelector((state) => state.setLocale);
  const resolved = resolveQChatLocale(config.localization, (_b = (_a = config.localization) == null ? void 0 : _a.locale) != null ? _b : locale);
  return { locale: resolved, locales: ((_d = (_c = config.localization) == null ? void 0 : _c.locales) == null ? void 0 : _d.length) ? config.localization.locales : void 0, setLocale: (code) => {
    const next = resolveQChatLocale(config.localization, code);
    if (next.code === code) setStoredLocale(code);
  }, t: (key) => translateQChat(config.localization, resolved.code, key) };
}

// src/components/qchat-thread.tsx
import { useEffect as useEffect4, useRef as useRef3 } from "react";

// src/components/qchat-render-probe.tsx
import { useEffect as useEffect2, useRef } from "react";
function QChatRenderProbe() {
  const messages = useQChatMessages();
  const records = useQChatPerformance();
  const record = useQChatRecordPerformance();
  const measured = useRef("");
  const last = messages.at(-1);
  useEffect2(() => {
    var _a;
    if (!(last == null ? void 0 : last.content) || last.role !== "assistant" || measured.current === last.id) return;
    const start = [...records].reverse().find((item) => {
      var _a2;
      return item.name === "runtime.first_text" && ((_a2 = item.attributes) == null ? void 0 : _a2.messageId) === last.id;
    });
    if (!start) return;
    measured.current = last.id;
    record({ name: "react.first_commit", durationMs: Math.max(0, Date.now() - Number((_a = start.attributes) == null ? void 0 : _a.receivedAt)), runId: start.runId, timestamp: (/* @__PURE__ */ new Date()).toISOString(), attributes: { layer: "render" } });
  }, [last, records, record]);
  return null;
}

// src/components/qchat-generated-ui.tsx
import { ArrowLeft, ArrowRight, ExternalLink, ShoppingBag } from "lucide-react";
import { useEffect as useEffect3, useRef as useRef2, useState as useState2 } from "react";

// src/product-variants/resolve-product-variant.ts
function resolveProductVariant(variants, color, size) {
  const available = variants.filter((variant) => variant.available);
  const matchingColor = color ? available.filter((variant) => variant.color === color) : available;
  const exact = color && size ? matchingColor.find((variant) => variant.size === size) : void 0;
  const candidates = matchingColor.length > 0 ? matchingColor : available;
  const display = exact != null ? exact : candidates.reduce((cheapest, variant) => !cheapest || variant.price.amount < cheapest.price.amount ? variant : cheapest, void 0);
  return __spreadProps(__spreadValues(__spreadValues({}, exact ? { exact } : {}), display ? { display } : {}), {
    isFromPrice: !exact && new Set(candidates.map((variant) => variant.price.amount)).size > 1,
    availableColors: new Set(available.map((variant) => variant.color)),
    availableSizes: new Set(matchingColor.map((variant) => variant.size))
  });
}
function isAvailableCombination(variants, color, size) {
  return variants.some((variant) => variant.available && variant.color === color && variant.size === size);
}

// src/components/qchat-generated-ui.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function QChatGeneratedUI() {
  const { document, generating } = useQChatGeneratedUI();
  const { hostView, slots } = useQChatConfig();
  const { t } = useQChatLocale();
  if (hostView) return /* @__PURE__ */ jsx2("section", { className: "qchat-host-view", "aria-label": "Host interface", children: hostView.render() });
  if (generating) {
    const Loading = slots == null ? void 0 : slots.loading;
    if (Loading) return /* @__PURE__ */ jsx2(Loading, {});
    return /* @__PURE__ */ jsx2("div", { className: "qchat-ui-loading", role: "status", "aria-label": t("loadingProducts"), children: /* @__PURE__ */ jsxs("div", { className: "qchat-loading-card", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx2("div", { className: "qchat-loading-image" }),
      /* @__PURE__ */ jsx2("div", { className: "qchat-loading-line" }),
      /* @__PURE__ */ jsx2("div", { className: "qchat-loading-line short" }),
      /* @__PURE__ */ jsxs("div", { className: "qchat-loading-options", children: [
        /* @__PURE__ */ jsx2("i", {}),
        /* @__PURE__ */ jsx2("i", {}),
        /* @__PURE__ */ jsx2("i", {})
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "qchat-loading-button" })
    ] }) });
  }
  if (!document) return null;
  return /* @__PURE__ */ jsx2("section", { className: `qchat-generated ${document.layout}`, "aria-label": "Generated interface", children: document.children.map((node) => /* @__PURE__ */ jsx2(Node, { node }, node.id)) });
}
function Node({ node }) {
  if (node.type === "product-collection") return /* @__PURE__ */ jsx2(ProductCollection, { node });
  if (node.type === "product-card") return /* @__PURE__ */ jsx2(ProductCard, { card: node });
  if (node.type === "info-card") return /* @__PURE__ */ jsxs("article", { className: "qchat-info-card", children: [
    /* @__PURE__ */ jsx2("h3", { children: node.title }),
    /* @__PURE__ */ jsx2("p", { children: node.description }),
    node.facts && /* @__PURE__ */ jsx2("dl", { children: node.facts.map((fact) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx2("dt", { children: fact.label }),
      /* @__PURE__ */ jsx2("dd", { children: fact.value })
    ] }, fact.label)) }),
    node.source && /* @__PURE__ */ jsx2("small", { children: node.source })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: `qchat-status ${node.variant}`, children: [
    /* @__PURE__ */ jsx2("strong", { children: node.title }),
    node.description && /* @__PURE__ */ jsx2("p", { children: node.description })
  ] });
}
function ProductCollection({ node }) {
  const { locale, t } = useQChatLocale();
  const scroller = useRef2(null);
  const [canPrev, setCanPrev] = useState2(false);
  const [canNext, setCanNext] = useState2(false);
  const update = () => {
    const element = scroller.current;
    if (!element) return;
    const offset = Math.abs(element.scrollLeft);
    setCanPrev(offset > 2);
    setCanNext(offset + element.clientWidth < element.scrollWidth - 2);
  };
  const move = (direction) => {
    const element = scroller.current;
    if (!element) return;
    element.scrollBy({ left: (locale.direction === "rtl" ? -1 : 1) * direction * element.clientWidth * 0.85, behavior: "smooth" });
  };
  useEffect3(() => {
    update();
    const element = scroller.current;
    if (!element) return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [node.items.length]);
  return /* @__PURE__ */ jsxs("div", { className: "qchat-collection", children: [
    /* @__PURE__ */ jsxs("div", { className: "qchat-collection-header", children: [
      /* @__PURE__ */ jsx2("h3", { children: node.title }),
      node.direction === "horizontal" && node.items.length > 1 && /* @__PURE__ */ jsxs("div", { className: "qchat-collection-controls", children: [
        /* @__PURE__ */ jsx2("button", { type: "button", "aria-label": t("previousProducts"), disabled: !canPrev, onClick: () => move(-1), children: /* @__PURE__ */ jsx2(ArrowLeft, { size: 15 }) }),
        /* @__PURE__ */ jsx2("button", { type: "button", "aria-label": t("nextProducts"), disabled: !canNext, onClick: () => move(1), children: /* @__PURE__ */ jsx2(ArrowRight, { size: 15 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx2("div", { ref: scroller, className: node.direction, onScroll: update, children: node.items.map((card) => /* @__PURE__ */ jsx2(ProductCard, { card }, card.id)) })
  ] });
}
function ProductCard({ card }) {
  var _a, _b, _c, _d;
  const { productVariants } = useQChatConfig();
  const { t } = useQChatLocale();
  const variants = productVariants == null ? void 0 : productVariants[card.id];
  const selections = useQChatSelector((state) => state.selections);
  const select = useQChatSelector((state) => state.select);
  const dispatch = useQChatSelector((state) => state.dispatchAction);
  const color = selections[`${card.id}:color`];
  const size = selections[`${card.id}:size`];
  const resolved = variants ? resolveProductVariant(variants, color, size) : void 0;
  const shownPrice = (_b = (_a = resolved == null ? void 0 : resolved.display) == null ? void 0 : _a.price) != null ? _b : card.price;
  const formattedPrice = new Intl.NumberFormat(void 0, { style: "currency", currency: shownPrice.currency }).format(shownPrice.amount);
  const image = (_d = (_c = resolved == null ? void 0 : resolved.display) == null ? void 0 : _c.image) != null ? _d : card.image;
  const chooseColor = (value) => {
    select(`${card.id}:color`, value);
    if (variants && size && !isAvailableCombination(variants, value, size)) select(`${card.id}:size`, "");
  };
  const addProduct = () => {
    if (!card.primaryAction || variants && !(resolved == null ? void 0 : resolved.exact)) return;
    void dispatch({ name: card.primaryAction.name, sourceNodeId: card.id, payload: __spreadValues(__spreadProps(__spreadValues({}, card.primaryAction.payload), { color: color != null ? color : "", size: size != null ? size : "" }), (resolved == null ? void 0 : resolved.exact) ? { variantId: resolved.exact.id } : {}) });
  };
  return /* @__PURE__ */ jsxs("article", { className: "qchat-product", children: [
    image && /* @__PURE__ */ jsx2("img", { src: image.src, alt: image.alt }),
    /* @__PURE__ */ jsxs("div", { className: "qchat-product-body", children: [
      card.tags && /* @__PURE__ */ jsx2("div", { className: "qchat-tags", children: card.tags.map((tag) => /* @__PURE__ */ jsx2("span", { children: tag }, tag)) }),
      /* @__PURE__ */ jsxs("div", { className: "qchat-product-heading", children: [
        /* @__PURE__ */ jsx2("h4", { children: card.title }),
        /* @__PURE__ */ jsxs("strong", { "aria-live": "polite", children: [
          (resolved == null ? void 0 : resolved.isFromPrice) ? "From " : "",
          formattedPrice
        ] })
      ] }),
      card.description && /* @__PURE__ */ jsx2("p", { children: card.description }),
      card.colors && /* @__PURE__ */ jsx2(Choice, { label: t("color"), options: card.colors, selected: color, available: resolved == null ? void 0 : resolved.availableColors, onSelect: chooseColor }),
      card.sizes && /* @__PURE__ */ jsx2(Choice, { label: t("size"), options: card.sizes, selected: size, available: resolved == null ? void 0 : resolved.availableSizes, onSelect: (value) => select(`${card.id}:size`, value) }),
      variants && !(resolved == null ? void 0 : resolved.exact) && /* @__PURE__ */ jsx2("span", { className: "qchat-variant-hint", children: t("chooseAvailable") }),
      /* @__PURE__ */ jsxs("div", { className: "qchat-product-actions", children: [
        card.primaryAction && /* @__PURE__ */ jsxs("button", { type: "button", disabled: Boolean(variants && !(resolved == null ? void 0 : resolved.exact)), onClick: addProduct, children: [
          /* @__PURE__ */ jsx2(ShoppingBag, { size: 15 }),
          card.primaryAction.label
        ] }),
        card.secondaryAction && /* @__PURE__ */ jsxs("button", { type: "button", className: "secondary", onClick: () => void dispatch({ name: card.secondaryAction.name, sourceNodeId: card.id, payload: card.secondaryAction.payload }), children: [
          card.secondaryAction.label,
          /* @__PURE__ */ jsx2(ExternalLink, { size: 14 })
        ] })
      ] })
    ] })
  ] });
}
function Choice({ label, options, selected, available, onSelect }) {
  return /* @__PURE__ */ jsxs("fieldset", { className: "qchat-choice", children: [
    /* @__PURE__ */ jsx2("legend", { children: label }),
    /* @__PURE__ */ jsx2("div", { children: options.map((option) => /* @__PURE__ */ jsxs("button", { type: "button", disabled: option.disabled || Boolean(available && !available.has(option.value)), "aria-pressed": selected === option.value, "aria-label": `${label} ${option.label}`, onClick: () => onSelect(option.value), children: [
      option.color && /* @__PURE__ */ jsx2("span", { style: { backgroundColor: option.color } }),
      option.label
    ] }, option.value)) })
  ] });
}

// src/components/qchat-message.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function QChatMessage({ message }) {
  var _a, _b, _c;
  const { t, locale } = useQChatLocale();
  const user = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString(locale.code, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
  if (!message.content.trim() && !((_a = message.attachments) == null ? void 0 : _a.length)) return null;
  return /* @__PURE__ */ jsxs2("article", { className: `qchat-message ${user ? "is-user" : "is-assistant"}`, children: [
    /* @__PURE__ */ jsxs2("div", { className: "qchat-meta", children: [
      /* @__PURE__ */ jsx3("span", { children: user ? t("you") : "QChat" }),
      /* @__PURE__ */ jsx3("time", { children: time })
    ] }),
    Boolean((_b = message.attachments) == null ? void 0 : _b.length) && /* @__PURE__ */ jsx3("div", { className: "qchat-message-attachments", "aria-label": "Message attachments", children: (_c = message.attachments) == null ? void 0 : _c.map((attachment, index) => {
      var _a2, _b2;
      return /* @__PURE__ */ jsx3("div", { className: `qchat-message-attachment is-${attachment.kind}`, children: attachment.kind === "image" && attachment.previewUrl ? /* @__PURE__ */ jsx3("img", { src: attachment.previewUrl, alt: (_a2 = attachment.filename) != null ? _a2 : "Attached image" }) : /* @__PURE__ */ jsx3("span", { children: (_b2 = attachment.filename) != null ? _b2 : "Attached file" }) }, `${message.id}-${index}`);
    }) }),
    message.content.trim() && /* @__PURE__ */ jsx3("div", { className: "qchat-bubble", dir: "auto", children: message.content }),
    user && /* @__PURE__ */ jsx3("span", { className: "qchat-read", children: t("read") })
  ] });
}

// src/components/qchat-thinking.tsx
import { ChevronDown } from "lucide-react";
import { useState as useState3 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function QChatThinking() {
  var _a;
  const { reasoning, status } = useQChatRunState();
  const messages = useQChatMessages();
  const tools = useQChatTools();
  const { locale } = useQChatLocale();
  const [open, setOpen] = useState3(false);
  if (!reasoning) return status === "running" && !((_a = messages.at(-1)) == null ? void 0 : _a.content.trim()) && tools.length === 0 ? /* @__PURE__ */ jsx4("p", { className: "qchat-waiting", role: "status", children: locale.direction === "rtl" ? "\u0641\u064A \u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u0631\u062F" : "Waiting for response" }) : null;
  return /* @__PURE__ */ jsxs3("section", { className: "qchat-thinking", children: [
    /* @__PURE__ */ jsxs3("button", { type: "button", "aria-expanded": open, onClick: () => setOpen(!open), children: [
      /* @__PURE__ */ jsx4("span", { className: status === "running" ? "qchat-waiting" : void 0, children: reasoning.label }),
      /* @__PURE__ */ jsxs3("time", { children: [
        (reasoning.elapsedMs / 1e3).toFixed(1),
        "s"
      ] }),
      /* @__PURE__ */ jsx4(ChevronDown, { size: 14, className: open ? "is-open" : "" })
    ] }),
    open && /* @__PURE__ */ jsx4("p", { children: reasoning.label })
  ] });
}

// src/components/qchat-tool-activity.tsx
import { Check, ChevronDown as ChevronDown2, LoaderCircle, Wrench, X } from "lucide-react";
import { useState as useState4 } from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function QChatToolActivity() {
  const tools = useQChatTools();
  const [open, setOpen] = useState4(false);
  if (!tools.length) return null;
  return /* @__PURE__ */ jsxs4("section", { className: "qchat-tools", children: [
    /* @__PURE__ */ jsxs4("button", { type: "button", "aria-expanded": open, onClick: () => setOpen(!open), children: [
      /* @__PURE__ */ jsx5(Wrench, { size: 14 }),
      /* @__PURE__ */ jsxs4("span", { children: [
        tools.length,
        " tool ",
        tools.length === 1 ? "call" : "calls"
      ] }),
      /* @__PURE__ */ jsx5(ChevronDown2, { size: 14, className: open ? "is-open" : "" })
    ] }),
    open && /* @__PURE__ */ jsx5("ul", { children: tools.map((tool) => /* @__PURE__ */ jsxs4("li", { children: [
      tool.status === "running" ? /* @__PURE__ */ jsx5(LoaderCircle, { className: "spin", size: 14 }) : tool.status === "complete" ? /* @__PURE__ */ jsx5(Check, { size: 14 }) : /* @__PURE__ */ jsx5(X, { size: 14 }),
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx5("strong", { children: tool.name }),
        tool.summary && /* @__PURE__ */ jsx5("span", { children: tool.summary })
      ] })
    ] }, tool.id)) })
  ] });
}

// src/components/qchat-thread.tsx
import { Fragment, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function QChatThread() {
  var _a, _b, _c, _d;
  const messages = useQChatMessages();
  const { error, status } = useQChatRunState();
  const { slots } = useQChatConfig();
  const Thread = (_a = slots == null ? void 0 : slots.thread) != null ? _a : "div";
  const ErrorView = slots == null ? void 0 : slots.error;
  const ToolActivity = (_b = slots == null ? void 0 : slots.toolActivity) != null ? _b : QChatToolActivity;
  const MessageView = (_c = slots == null ? void 0 : slots.message) != null ? _c : QChatMessage;
  const Thinking = (_d = slots == null ? void 0 : slots.thinking) != null ? _d : QChatThinking;
  const end = useRef3(null);
  const following = useRef3(true);
  const last = messages.at(-1);
  const activityIndex = (last == null ? void 0 : last.role) === "assistant" ? messages.length - 1 : messages.length;
  useEffect4(() => {
    var _a2;
    const content = (_a2 = end.current) == null ? void 0 : _a2.parentElement;
    const scroller = content == null ? void 0 : content.closest(".qchat-thread");
    if (!(scroller instanceof HTMLElement) || !content) return;
    const scroll = () => {
      if (following.current) scroller.scrollTop = scroller.scrollHeight;
    };
    const onScroll = () => {
      following.current = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 80;
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(scroll);
    observer.observe(content);
    scroll();
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect4(() => {
    var _a2;
    if ((last == null ? void 0 : last.role) === "user") following.current = true;
    const scroller = (_a2 = end.current) == null ? void 0 : _a2.closest(".qchat-thread");
    if (following.current && scroller instanceof HTMLElement) scroller.scrollTop = scroller.scrollHeight;
  }, [last == null ? void 0 : last.content, last == null ? void 0 : last.id, status, error]);
  return /* @__PURE__ */ jsxs5(Thread, { className: "qchat-thread", children: [
    /* @__PURE__ */ jsx6(QChatRenderProbe, {}),
    /* @__PURE__ */ jsxs5("div", { className: "qchat-thread-inner", children: [
      messages.map((message, index) => /* @__PURE__ */ jsxs5("div", { className: "qchat-transcript-entry", children: [
        index === activityIndex && /* @__PURE__ */ jsxs5(Fragment, { children: [
          /* @__PURE__ */ jsx6(Thinking, {}),
          /* @__PURE__ */ jsx6(ToolActivity, {})
        ] }),
        /* @__PURE__ */ jsx6(MessageView, { message })
      ] }, message.id)),
      activityIndex === messages.length && /* @__PURE__ */ jsxs5(Fragment, { children: [
        /* @__PURE__ */ jsx6(Thinking, {}),
        /* @__PURE__ */ jsx6(ToolActivity, {})
      ] }),
      /* @__PURE__ */ jsx6(QChatGeneratedUI, {}),
      error && (ErrorView ? /* @__PURE__ */ jsx6(ErrorView, { error }) : /* @__PURE__ */ jsx6("div", { role: "alert", className: "qchat-error", children: error.message })),
      /* @__PURE__ */ jsx6("div", { ref: end, className: "qchat-thread-end", "aria-hidden": "true" })
    ] })
  ] });
}

// src/components/qchat-composer.tsx
import { ArrowUp, Plus, Square } from "lucide-react";
import { useEffect as useEffect5, useRef as useRef4, useState as useState5 } from "react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function QChatComposer({ suggestions = [], agentLabel }) {
  const { draft, setDraft, submit, cancel, status } = useQChatComposer();
  const input = useRef4(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState5(false);
  const running = status === "running";
  useEffect5(() => {
    const node = input.current;
    if (!node) return;
    node.style.height = "0px";
    node.style.height = `${Math.min(node.scrollHeight, 200)}px`;
  }, [draft]);
  return /* @__PURE__ */ jsxs6("form", { className: "qchat-composer", onSubmit: (event) => {
    event.preventDefault();
    if (!running) void submit();
  }, children: [
    suggestionsOpen && /* @__PURE__ */ jsx7("div", { className: "qchat-suggestions", role: "group", "aria-label": "Suggested prompts", children: suggestions.map((suggestion) => /* @__PURE__ */ jsx7("button", { type: "button", onClick: () => {
      var _a;
      setDraft(suggestion);
      setSuggestionsOpen(false);
      (_a = input.current) == null ? void 0 : _a.focus();
    }, children: suggestion }, suggestion)) }),
    /* @__PURE__ */ jsx7("textarea", { ref: input, value: draft, onChange: (event) => setDraft(event.target.value), onKeyDown: (event) => {
      if (event.key === "Escape") setSuggestionsOpen(false);
      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        if (!running) void submit();
      }
    }, placeholder: "Ask anything", "aria-label": "Message QChat", rows: 1 }),
    /* @__PURE__ */ jsxs6("div", { className: "qchat-composer-toolbar", children: [
      /* @__PURE__ */ jsxs6("div", { className: "qchat-composer-actions", children: [
        suggestions.length > 0 && /* @__PURE__ */ jsx7("button", { type: "button", className: "qchat-add", "aria-label": "Suggested prompts", "aria-expanded": suggestionsOpen, onClick: () => setSuggestionsOpen((open) => !open), children: /* @__PURE__ */ jsx7(Plus, { size: 17 }) }),
        agentLabel && /* @__PURE__ */ jsx7("span", { className: "qchat-agent-label", children: agentLabel })
      ] }),
      /* @__PURE__ */ jsx7("button", { className: "qchat-send", type: running ? "button" : "submit", "aria-label": running ? "Stop generation" : "Send message", onClick: running ? cancel : void 0, disabled: !running && !draft.trim(), children: running ? /* @__PURE__ */ jsx7(Square, { size: 14, fill: "currentColor" }) : /* @__PURE__ */ jsx7(ArrowUp, { size: 18 }) })
    ] })
  ] });
}
export {
  QChatComposer,
  QChatGeneratedUI,
  QChatMessage,
  QChatProvider,
  QChatThinking,
  QChatThread,
  QChatToolActivity,
  createQChatClient,
  createQChatHostView,
  defaultLocales,
  resolveQChatLocale,
  translateQChat,
  useQChatComposer,
  useQChatConfig,
  useQChatGeneratedUI,
  useQChatLocale,
  useQChatMessages,
  useQChatPerformance,
  useQChatRecordPerformance,
  useQChatRunState,
  useQChatSelector,
  useQChatTools
};
//# sourceMappingURL=index.js.map