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

// src/client/create-qchat-client.ts
function createQChatClient(client) {
  return Object.freeze(client);
}

// src/provider/qchat-provider.tsx
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

// src/store/create-qchat-store.ts
import { createStore } from "zustand/vanilla";
var id = () => {
  var _a, _b, _c;
  return (_c = (_b = (_a = globalThis.crypto) == null ? void 0 : _a.randomUUID) == null ? void 0 : _b.call(_a)) != null ? _c : Math.random().toString(36).slice(2);
};
function createQChatStore(client, initialMessages, conversationId) {
  let controller;
  let ticker;
  let activeRunId = "";
  return createStore((set, get) => ({
    messages: initialMessages,
    draft: "",
    status: "idle",
    tools: [],
    generatingUI: false,
    performance: [],
    selections: {},
    setDraft: (draft) => set({ draft }),
    select: (key, value) => set((state) => ({ selections: __spreadProps(__spreadValues({}, state.selections), { [key]: value }) })),
    cancel: () => controller == null ? void 0 : controller.abort(),
    dispatchAction: async (action) => client.action(__spreadProps(__spreadValues({}, action), { conversationId, runId: activeRunId })),
    submit: async () => {
      const text = get().draft.trim();
      if (!text || get().status === "running") return;
      activeRunId = id();
      controller = new AbortController();
      const user = { id: id(), role: "user", content: text, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
      const assistantId = id();
      const next = [...get().messages, user];
      set({ messages: [...next, { id: assistantId, role: "assistant", content: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() }], draft: "", status: "running", error: void 0, document: void 0, tools: [], generatingUI: false, reasoning: { label: "Thinking", startedAt: Date.now(), elapsedMs: 0 } });
      ticker = setInterval(() => set((state) => state.reasoning ? { reasoning: __spreadProps(__spreadValues({}, state.reasoning), { elapsedMs: Date.now() - state.reasoning.startedAt }) } : {}), 100);
      try {
        try {
          for (var iter = __forAwait(client.run({ messages: next, conversationId, runId: activeRunId, signal: controller.signal })), more, temp, error; more = !(temp = await iter.next()).done; more = false) {
            const event = temp.value;
            applyEvent(event, assistantId, set);
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
      } finally {
        if (ticker) clearInterval(ticker);
        ticker = void 0;
        controller = void 0;
        if (get().status === "running") set({ status: "idle", reasoning: void 0 });
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
      set((state) => ({ performance: [...state.performance, event.record] }));
      break;
    case "failure":
      set({ status: "error", error: event.error, generatingUI: false, reasoning: void 0 });
      break;
    case "complete":
      set({ status: "idle", reasoning: void 0, generatingUI: false });
      break;
  }
}

// src/provider/qchat-provider.tsx
import { jsx } from "react/jsx-runtime";
var StoreContext = createContext(null);
var ConfigContext = createContext({});
function QChatProvider({ client, config = {}, initialMessages = [], conversationId = "default", children }) {
  var _a;
  const store = useRef(null);
  if (!store.current) store.current = createQChatStore(client, initialMessages, conversationId);
  const theme = config.theme;
  const style = { "--qchat-accent": theme == null ? void 0 : theme.accent, "--qchat-bg": theme == null ? void 0 : theme.background, "--qchat-fg": theme == null ? void 0 : theme.foreground, "--qchat-surface": theme == null ? void 0 : theme.surface, "--qchat-muted": theme == null ? void 0 : theme.muted, "--qchat-radius": theme == null ? void 0 : theme.radius, "--qchat-font": theme == null ? void 0 : theme.fontFamily, "--qchat-motion": String((_a = theme == null ? void 0 : theme.motionScale) != null ? _a : 1) };
  return /* @__PURE__ */ jsx(ConfigContext.Provider, { value: config, children: /* @__PURE__ */ jsx(StoreContext.Provider, { value: store.current, children: /* @__PURE__ */ jsx("div", { className: "qchat-root", style, children }) }) });
}
function useQChatSelector(selector) {
  const store = useContext(StoreContext);
  if (!store) throw new Error("QChat hooks must be used inside QChatProvider");
  return useStore(store, selector);
}
var useQChatMessages = () => useQChatSelector((s) => s.messages);
var useQChatComposer = () => useQChatSelector(useShallow((s) => ({ draft: s.draft, setDraft: s.setDraft, submit: s.submit, cancel: s.cancel, status: s.status })));
var useQChatRunState = () => useQChatSelector(useShallow((s) => ({ status: s.status, reasoning: s.reasoning, error: s.error })));
var useQChatGeneratedUI = () => useQChatSelector(useShallow((s) => ({ document: s.document, generating: s.generatingUI, selections: s.selections })));
var useQChatTools = () => useQChatSelector((s) => s.tools);
var useQChatPerformance = () => useQChatSelector((s) => s.performance);
var useQChatConfig = () => useContext(ConfigContext);

// src/components/qchat-generated-ui.tsx
import { ExternalLink, ShoppingBag } from "lucide-react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function QChatGeneratedUI() {
  const { document, generating } = useQChatGeneratedUI();
  if (generating) return /* @__PURE__ */ jsxs("div", { className: "qchat-ui-loading", "aria-live": "polite", children: [
    /* @__PURE__ */ jsx2("span", {}),
    /* @__PURE__ */ jsx2("span", {}),
    /* @__PURE__ */ jsx2("span", {}),
    /* @__PURE__ */ jsx2("p", { children: "Compiling interface" })
  ] });
  if (!document) return null;
  return /* @__PURE__ */ jsx2("section", { className: `qchat-generated ${document.layout}`, "aria-label": "Generated interface", children: document.children.map((node) => /* @__PURE__ */ jsx2(Node, { node }, node.id)) });
}
function Node({ node }) {
  if (node.type === "product-collection") return /* @__PURE__ */ jsxs("div", { className: "qchat-collection", children: [
    /* @__PURE__ */ jsx2("h3", { children: node.title }),
    /* @__PURE__ */ jsx2("div", { className: node.direction, children: node.items.map((card) => /* @__PURE__ */ jsx2(ProductCard, { card }, card.id)) })
  ] });
  if (node.type === "product-card") return /* @__PURE__ */ jsx2(ProductCard, { card: node });
  return /* @__PURE__ */ jsxs("div", { className: `qchat-status ${node.variant}`, children: [
    /* @__PURE__ */ jsx2("strong", { children: node.title }),
    node.description && /* @__PURE__ */ jsx2("p", { children: node.description })
  ] });
}
function ProductCard({ card }) {
  const selections = useQChatSelector((s) => s.selections);
  const select = useQChatSelector((s) => s.select);
  const dispatch = useQChatSelector((s) => s.dispatchAction);
  const price = new Intl.NumberFormat(void 0, { style: "currency", currency: card.price.currency }).format(card.price.amount);
  return /* @__PURE__ */ jsxs("article", { className: "qchat-product", children: [
    card.image && /* @__PURE__ */ jsx2("img", { src: card.image.src, alt: card.image.alt }),
    /* @__PURE__ */ jsxs("div", { className: "qchat-product-body", children: [
      card.tags && /* @__PURE__ */ jsx2("div", { className: "qchat-tags", children: card.tags.map((tag) => /* @__PURE__ */ jsx2("span", { children: tag }, tag)) }),
      /* @__PURE__ */ jsxs("div", { className: "qchat-product-heading", children: [
        /* @__PURE__ */ jsx2("h4", { children: card.title }),
        /* @__PURE__ */ jsx2("strong", { children: price })
      ] }),
      card.description && /* @__PURE__ */ jsx2("p", { children: card.description }),
      card.colors && /* @__PURE__ */ jsx2(Choice, { label: "Color", cardId: card.id, options: card.colors, selected: selections[`${card.id}:color`], onSelect: (value) => select(`${card.id}:color`, value) }),
      " ",
      card.sizes && /* @__PURE__ */ jsx2(Choice, { label: "Size", cardId: card.id, options: card.sizes, selected: selections[`${card.id}:size`], onSelect: (value) => select(`${card.id}:size`, value) }),
      /* @__PURE__ */ jsxs("div", { className: "qchat-product-actions", children: [
        card.primaryAction && /* @__PURE__ */ jsxs("button", { onClick: () => {
          var _a, _b;
          return void dispatch({ name: card.primaryAction.name, sourceNodeId: card.id, payload: __spreadProps(__spreadValues({}, card.primaryAction.payload), { color: (_a = selections[`${card.id}:color`]) != null ? _a : "", size: (_b = selections[`${card.id}:size`]) != null ? _b : "" }) });
        }, children: [
          /* @__PURE__ */ jsx2(ShoppingBag, { size: 15 }),
          card.primaryAction.label
        ] }),
        card.secondaryAction && /* @__PURE__ */ jsxs("button", { className: "secondary", onClick: () => void dispatch({ name: card.secondaryAction.name, sourceNodeId: card.id, payload: card.secondaryAction.payload }), children: [
          card.secondaryAction.label,
          /* @__PURE__ */ jsx2(ExternalLink, { size: 14 })
        ] })
      ] })
    ] })
  ] });
}
function Choice({ label, cardId, options, selected, onSelect }) {
  return /* @__PURE__ */ jsxs("fieldset", { className: "qchat-choice", children: [
    /* @__PURE__ */ jsx2("legend", { children: label }),
    /* @__PURE__ */ jsx2("div", { children: options.map((option) => /* @__PURE__ */ jsxs("button", { type: "button", disabled: option.disabled, "aria-pressed": selected === option.value, "aria-label": `${label} ${option.label}`, onClick: () => onSelect(option.value), children: [
      option.color && /* @__PURE__ */ jsx2("span", { style: { backgroundColor: option.color } }),
      option.label
    ] }, option.value)) })
  ] });
}

// src/components/qchat-message.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function QChatMessage({ message }) {
  const user = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
  return /* @__PURE__ */ jsxs2("article", { className: `qchat-message ${user ? "is-user" : "is-assistant"}`, children: [
    /* @__PURE__ */ jsxs2("div", { className: "qchat-meta", children: [
      /* @__PURE__ */ jsx3("span", { children: user ? "You" : "QChat" }),
      /* @__PURE__ */ jsx3("time", { children: time })
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "qchat-bubble", children: message.content || /* @__PURE__ */ jsx3("span", { className: "qchat-cursor", "aria-label": "Response streaming" }) }),
    user && /* @__PURE__ */ jsx3("span", { className: "qchat-read", children: "Read" })
  ] });
}

// src/components/qchat-thinking.tsx
import { Brain, ChevronDown } from "lucide-react";
import { useState } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function QChatThinking() {
  const { reasoning } = useQChatRunState();
  const [open, setOpen] = useState(false);
  if (!reasoning) return null;
  return /* @__PURE__ */ jsxs3("section", { className: "qchat-thinking", children: [
    /* @__PURE__ */ jsxs3("button", { type: "button", "aria-expanded": open, onClick: () => setOpen(!open), children: [
      /* @__PURE__ */ jsx4(Brain, { size: 15 }),
      /* @__PURE__ */ jsx4("span", { children: reasoning.label }),
      /* @__PURE__ */ jsxs3("time", { children: [
        (reasoning.elapsedMs / 1e3).toFixed(1),
        "s"
      ] }),
      /* @__PURE__ */ jsx4(ChevronDown, { size: 14, className: open ? "is-open" : "" })
    ] }),
    open && /* @__PURE__ */ jsx4("p", { children: "QChat is resolving the request and validating any generated interface on the server." })
  ] });
}

// src/components/qchat-tool-activity.tsx
import { Check, ChevronDown as ChevronDown2, LoaderCircle, Wrench, X } from "lucide-react";
import { useState as useState2 } from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function QChatToolActivity() {
  const tools = useQChatTools();
  const [open, setOpen] = useState2(true);
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
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function QChatThread() {
  var _a;
  const messages = useQChatMessages();
  const { error } = useQChatRunState();
  const { slots } = useQChatConfig();
  const Thread = (_a = slots == null ? void 0 : slots.thread) != null ? _a : "div";
  const ErrorView = slots == null ? void 0 : slots.error;
  return /* @__PURE__ */ jsx6(Thread, { className: "qchat-thread", children: /* @__PURE__ */ jsxs5("div", { className: "qchat-thread-inner", children: [
    messages.map((message) => /* @__PURE__ */ jsx6(QChatMessage, { message }, message.id)),
    /* @__PURE__ */ jsx6(QChatThinking, {}),
    /* @__PURE__ */ jsx6(QChatToolActivity, {}),
    /* @__PURE__ */ jsx6(QChatGeneratedUI, {}),
    error && (ErrorView ? /* @__PURE__ */ jsx6(ErrorView, { error }) : /* @__PURE__ */ jsx6("div", { role: "alert", className: "qchat-error", children: error.message }))
  ] }) });
}

// src/components/qchat-composer.tsx
import { ArrowUp, AudioLines, ChevronDown as ChevronDown3, Globe, Image, Paperclip, Plus, Square, Sparkles } from "lucide-react";
import { useEffect, useRef as useRef2, useState as useState3 } from "react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function QChatComposer() {
  const { draft, setDraft, submit, cancel, status } = useQChatComposer();
  const ref = useRef2(null);
  const [menu, setMenu] = useState3(false);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.style.height = "0px";
      node.style.height = `${Math.min(node.scrollHeight, 180)}px`;
    }
  }, [draft]);
  return /* @__PURE__ */ jsxs6("form", { className: "qchat-composer", onSubmit: (event) => {
    event.preventDefault();
    void submit();
  }, children: [
    /* @__PURE__ */ jsx7("textarea", { ref, value: draft, onChange: (event) => setDraft(event.target.value), onKeyDown: (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void submit();
      }
    }, placeholder: "Ask QChat to compare products\u2026", "aria-label": "Message QChat", rows: 1 }),
    /* @__PURE__ */ jsxs6("div", { className: "qchat-composer-toolbar", children: [
      /* @__PURE__ */ jsxs6("div", { className: "qchat-toolbar-group", children: [
        /* @__PURE__ */ jsxs6("div", { className: "qchat-menu-wrap", children: [
          /* @__PURE__ */ jsx7("button", { type: "button", "aria-label": "Add context", "aria-expanded": menu, onClick: () => setMenu(!menu), children: /* @__PURE__ */ jsx7(Plus, { size: 19 }) }),
          menu && /* @__PURE__ */ jsxs6("div", { className: "qchat-menu", children: [
            /* @__PURE__ */ jsxs6("button", { type: "button", children: [
              /* @__PURE__ */ jsx7(Paperclip, { size: 15 }),
              "Attach a file"
            ] }),
            /* @__PURE__ */ jsxs6("button", { type: "button", children: [
              /* @__PURE__ */ jsx7(Image, { size: 15 }),
              "Add an image"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx7("button", { type: "button", "aria-label": "Search the web", children: /* @__PURE__ */ jsx7(Globe, { size: 17 }) }),
        /* @__PURE__ */ jsx7("button", { type: "button", "aria-label": "Voice input", children: /* @__PURE__ */ jsx7(AudioLines, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "qchat-toolbar-group", children: [
        /* @__PURE__ */ jsxs6("button", { className: "qchat-model", type: "button", children: [
          /* @__PURE__ */ jsx7(Sparkles, { size: 15 }),
          "Balanced",
          /* @__PURE__ */ jsx7(ChevronDown3, { size: 14 })
        ] }),
        /* @__PURE__ */ jsx7("button", { className: "qchat-send", type: status === "running" ? "button" : "submit", "aria-label": status === "running" ? "Stop generation" : "Send message", onClick: status === "running" ? cancel : void 0, disabled: status !== "running" && !draft.trim(), children: status === "running" ? /* @__PURE__ */ jsx7(Square, { size: 15, fill: "currentColor" }) : /* @__PURE__ */ jsx7(ArrowUp, { size: 18 }) })
      ] })
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
  useQChatComposer,
  useQChatConfig,
  useQChatGeneratedUI,
  useQChatMessages,
  useQChatPerformance,
  useQChatRunState,
  useQChatSelector,
  useQChatTools
};
//# sourceMappingURL=index.js.map