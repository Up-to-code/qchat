var __defProp = Object.defineProperty;
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
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator) => {
  var resume = (k, v, yes, no) => {
    try {
      var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
      Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? { done: y.done, value: y.value } : y, yes, no) : yes({ value: y, done })).catch((e) => resume("throw", e, yes, no));
    } catch (e) {
      no(e);
    }
  }, method = (k, call, wait, clear) => it[k] = (x) => (call = new Promise((yes, no, run) => (run = () => resume(k, x, yes, no), q ? q.then(run) : run())), clear = () => q === wait && (q = 0), q = wait = call.then(clear, clear), call), q, it = {};
  return generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it;
};
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);

// src/prompt/qchat-system-prompt.ts
var QCHAT_SYSTEM_PROMPT = `You are operating inside QChat's generative UI environment.
When a compact validated interface is more useful than prose, emit one complete TOON document through the UI channel. The decoded object must match QChat UI schema version 1.
Allowed nodes: product-collection, product-card, info-card, and status. Allowed actions: product.select, product.add, product.open.
Never emit JSX, HTML, CSS, JavaScript, component imports, event handlers, secrets, or executable code. Never choose visual theme values. Titles are at most 100 characters, product descriptions 280, info-card descriptions 500, collections 12 products, tags 6, options 12. Use stable unique IDs. UI is optional; ordinary prose is valid when it is clearer.`;
function normalizeCustomPrompt(value) {
  if (value === void 0) return void 0;
  const normalized = value.normalize("NFC").trim();
  if (normalized.length === 0 || normalized.length > 2e4) throw new Error("customSystemPrompt must contain 1-20000 characters");
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(normalized)) throw new Error("customSystemPrompt contains forbidden control characters");
  return normalized;
}
function composeSystemPrompt(includeDefault, custom) {
  const normalized = normalizeCustomPrompt(custom);
  if (!includeDefault && !normalized) throw new Error("A customSystemPrompt is required when includeDefaultSystemPrompt is false");
  return [includeDefault ? QCHAT_SYSTEM_PROMPT : void 0, normalized].filter((part) => Boolean(part)).join("\n\n--- Host instructions ---\n");
}

// src/compiler/document-compiler.ts
import { qChatUIDocumentSchema } from "@qchat/core";

// src/compiler/toon-decoder.ts
import { decode } from "@toon-format/toon";
function decodeToonDocument(source, maxDocumentBytes) {
  const size = new TextEncoder().encode(source).byteLength;
  if (size > maxDocumentBytes) throw new Error(`TOON document exceeds ${maxDocumentBytes} bytes`);
  return decode(source);
}

// src/compiler/document-compiler.ts
function inspectDepth(value, depth = 0) {
  if (value === null || typeof value !== "object") return depth;
  const values = Array.isArray(value) ? value : Object.values(value);
  return values.reduce((max, item) => Math.max(max, inspectDepth(item, depth + 1)), depth);
}
function compileToonUI(source, limits, allowedImageHosts = []) {
  const started = performance.now();
  try {
    const decoded = decodeToonDocument(source, limits.maxDocumentBytes);
    if (inspectDepth(decoded) > limits.maxDepth) throw new Error(`Document nesting exceeds ${limits.maxDepth}`);
    const parsed = qChatUIDocumentSchema.safeParse(decoded);
    if (!parsed.success) return { diagnostics: parsed.error.issues.map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`), durationMs: performance.now() - started };
    for (const node of parsed.data.children) {
      const cards = node.type === "product-collection" ? node.items : node.type === "product-card" ? [node] : [];
      if (cards.length > limits.maxCollectionItems) throw new Error("Collection item limit exceeded");
      for (const card of cards) {
        if (card.image && allowedImageHosts.length > 0 && !allowedImageHosts.includes(new URL(card.image.src).hostname)) throw new Error(`Image host is not allowed: ${new URL(card.image.src).hostname}`);
      }
    }
    return { document: parsed.data, diagnostics: [], durationMs: performance.now() - started };
  } catch (error) {
    return { diagnostics: [error instanceof Error ? error.message : "Unknown compiler failure"], durationMs: performance.now() - started };
  }
}

// src/runtime/create-qchat-server.ts
var DEFAULT_LIMITS = { maxDocumentBytes: 128e3, maxDepth: 8, maxCollectionItems: 12 };
var now = () => (/* @__PURE__ */ new Date()).toISOString();
function createQChatServer(config) {
  var _a, _b, _c;
  const systemPrompt = composeSystemPrompt((_a = config.includeDefaultSystemPrompt) != null ? _a : true, config.customSystemPrompt);
  const limits = __spreadValues(__spreadValues({}, DEFAULT_LIMITS), config.compilerLimits);
  const retries = (_b = config.maxCompilationRetries) != null ? _b : 1;
  const timeoutMs = (_c = config.timeoutMs) != null ? _c : 6e4;
  function run(request) {
    return __asyncGenerator(this, null, function* () {
      var _a2, _b2, _c2, _d;
      const runStarted = performance.now();
      let attempt = 0;
      let diagnostics = [];
      let sawFirstEvent = false;
      let sawFirstUiByte = false;
      while (attempt <= retries) {
        const controller = new AbortController();
        const relay = () => {
          var _a3;
          return controller.abort((_a3 = request.signal) == null ? void 0 : _a3.reason);
        };
        (_a2 = request.signal) == null ? void 0 : _a2.addEventListener("abort", relay, { once: true });
        if ((_b2 = request.signal) == null ? void 0 : _b2.aborted) relay();
        const timeout = setTimeout(() => controller.abort(new Error("QChat run timed out")), timeoutMs);
        let toon = "";
        let sawUi = false;
        try {
          try {
            for (var iter = __forAwait(config.adapter.run(__spreadValues({ messages: request.messages, tools: (_c2 = config.tools) != null ? _c2 : [], systemPrompt, metadata: request.metadata, signal: controller.signal }, attempt > 0 ? { repair: { attempt, diagnostics } } : {}))), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
              const event = temp.value;
              if (controller.signal.aborted) throw new DOMException("Aborted", "AbortError");
              if (!sawFirstEvent) {
                sawFirstEvent = true;
                yield new __await(record("qchat.first_event", performance.now() - runStarted, request.metadata.runId, config));
              }
              if (event.type === "ui.start") {
                sawUi = true;
                toon = "";
                yield event;
                continue;
              }
              if (event.type === "ui.delta") {
                toon += event.delta;
                if (new TextEncoder().encode(toon).byteLength > limits.maxDocumentBytes) throw new Error("UI stream exceeds document byte limit");
                if (!sawFirstUiByte) {
                  sawFirstUiByte = true;
                  yield new __await(record("qchat.first_ui_byte", performance.now() - runStarted, request.metadata.runId, config));
                }
                continue;
              }
              if (event.type === "ui.complete") {
                yield event;
                continue;
              }
              if (event.type === "complete" && sawUi) {
                const result = compileToonUI(toon, limits, config.allowedImageHosts);
                yield new __await(record("qchat.compile", result.durationMs, request.metadata.runId, config));
                if (result.document) {
                  yield { type: "ui.complete", document: result.document };
                  yield event;
                  yield new __await(record("qchat.run.total", performance.now() - runStarted, request.metadata.runId, config));
                  return;
                }
                diagnostics = result.diagnostics;
                if (attempt < retries) {
                  yield { type: "reasoning.status", label: "Repairing generated interface" };
                  break;
                }
                yield { type: "failure", error: { code: "COMPILE_FAILED", message: "The generated interface could not be validated.", retryable: false, diagnostics: config.redactErrors === false ? diagnostics : void 0 } };
                yield new __await(record("qchat.run.total", performance.now() - runStarted, request.metadata.runId, config));
                return;
              }
              yield event;
            }
          } catch (temp) {
            error = [temp];
          } finally {
            try {
              more && (temp = iter.return) && (yield new __await(temp.call(iter)));
            } finally {
              if (error)
                throw error[0];
            }
          }
          if (!sawUi) {
            yield new __await(record("qchat.run.total", performance.now() - runStarted, request.metadata.runId, config));
            return;
          }
        } catch (error2) {
          const cancelled = controller.signal.aborted;
          yield { type: "failure", error: { code: cancelled ? "CANCELLED" : "ADAPTER_FAILED", message: cancelled ? "Generation stopped." : config.redactErrors === false && error2 instanceof Error ? error2.message : "The agent run failed.", retryable: !cancelled } };
          yield new __await(record("qchat.run.total", performance.now() - runStarted, request.metadata.runId, config));
          return;
        } finally {
          clearTimeout(timeout);
          (_d = request.signal) == null ? void 0 : _d.removeEventListener("abort", relay);
        }
        attempt += 1;
      }
      yield new __await(record("qchat.run.total", performance.now() - runStarted, request.metadata.runId, config));
    });
  }
  return { systemPrompt, run, async handleAction(action) {
    const started = performance.now();
    const result = config.authorizeAction ? await config.authorizeAction(action) : { status: "rejected", message: "No action authorizer is configured." };
    await record("qchat.action", performance.now() - started, action.runId, config);
    return result;
  } };
}
async function record(name, durationMs, runId, config) {
  var _a;
  const item = { name, durationMs, runId, timestamp: now() };
  try {
    await ((_a = config.telemetry) == null ? void 0 : _a.record(item));
  } catch (e) {
  }
}
export {
  QCHAT_SYSTEM_PROMPT,
  compileToonUI,
  composeSystemPrompt,
  createQChatServer,
  normalizeCustomPrompt
};
//# sourceMappingURL=index.js.map