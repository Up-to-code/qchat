import { describe, expect, it, vi } from "vitest";
import type { QChatUIDocument } from "@qchat/core";
import type { QChatClient } from "../interfaces/react.interfaces";
import { createQChatStore } from "./create-qchat-store";

const document: QChatUIDocument = { version: "1", id: "products", layout: "container", children: [] };
const action: QChatClient["action"] = async () => ({ status: "accepted" });

describe("createQChatStore", () => {
  it("forwards selected images to one run and clears pending attachments", async () => {
    const run = vi.fn(async function* ({ attachments }: Parameters<QChatClient["run"]>[0]) {
      expect(attachments).toEqual([{ kind:"image",mediaType: "image/png", dataUrl: "data:image/png;base64,YQ==" }]);
      yield { type: "complete" } as const;
    });
    const store = createQChatStore({ capabilities: { attachments: true }, action, run }, [], "image-run");
    store.getState().setAttachments([{ kind:"image",mediaType: "image/png", dataUrl: "data:image/png;base64,YQ==" }]);
    await store.getState().submit();
    expect(run).toHaveBeenCalledOnce();
    expect(store.getState().attachments).toEqual([]);
    expect(store.getState().messages[0]).toMatchObject({content:"",attachments:[{kind:"image",mediaType:"image/png",previewUrl:"data:image/png;base64,YQ=="}]});
  });
  it("forwards the selected locale to the agent adapter", async () => {
    const run = vi.fn(async function* ({ locale }: Parameters<QChatClient["run"]>[0]) { expect(locale).toBe("ar-EG"); yield { type: "complete" } as const; });
    const store = createQChatStore({ capabilities: {}, action, run }, [], "locale-run");
    store.getState().setLocale("ar-EG");
    store.getState().setDraft("مرحبا");
    await store.getState().submit();
    expect(run).toHaveBeenCalledOnce();
  });
  it("streams text, tools, and validated UI into one run", async () => {
    const client: QChatClient = {
      capabilities: { tools: true }, action,
      async *run() {
        yield { type: "reasoning.status", label: "Searching" };
        yield { type: "tool.start", toolCallId: "catalog", name: "catalog_search" };
        yield { type: "tool.result", toolCallId: "catalog", summary: "2 items" };
        yield { type: "text.delta", delta: "Found " };
        yield { type: "text.delta", delta: "two." };
        yield { type: "ui.start" };
        yield { type: "ui.complete", document };
        yield { type: "complete" };
      },
    };
    const store = createQChatStore(client, [], "conversation-1");
    store.getState().setDraft("blue shoes");
    await store.getState().submit();
    const state = store.getState();
    expect(state.messages.map((message) => message.content)).toEqual(["blue shoes", "Found two."]);
    expect(state.tools).toMatchObject([{ id: "catalog", status: "complete", summary: "2 items" }]);
    expect(state.document).toEqual(document);
    expect(state.generatingUI).toBe(false);
    expect(state.status).toBe("idle");
  });

  it("cancels an in-flight adapter without an unhandled rejection", async () => {
    const client: QChatClient = {
      capabilities: {}, action,
      async *run({ signal }) {
        await new Promise<void>((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true }));
        yield { type: "complete" };
      },
    };
    const store = createQChatStore(client, [], "conversation-2");
    store.getState().setDraft("stop this");
    const pending = store.getState().submit();
    expect(store.getState().status).toBe("running");
    expect(store.getState().reasoning).toBeUndefined();
    store.getState().cancel();
    await expect(pending).resolves.toBeUndefined();
    expect(store.getState().status).toBe("idle");
    expect(store.getState().reasoning).toBeUndefined();
  });

  it("redacts thrown adapter errors from browser state", async () => {
    const client: QChatClient = {
      capabilities: {}, action,
      async *run() { throw new Error("private provider key"); yield { type: "complete" }; },
    };
    const store = createQChatStore(client, [], "conversation-3");
    store.getState().setDraft("trigger error");
    await store.getState().submit();
    expect(store.getState().status).toBe("error");
    expect(store.getState().error).toMatchObject({ code: "ADAPTER_FAILED", retryable: true });
    expect(JSON.stringify(store.getState().error)).not.toContain("private provider key");
  });

  it("attaches run metadata to an authorized action", async () => {
    const actionSpy = vi.fn(action);
    const client: QChatClient = { capabilities: {}, action: actionSpy, async *run() { yield { type: "complete" }; } };
    const store = createQChatStore(client, [], "conversation-4", document);
    expect(store.getState().document).toEqual(document);
    store.getState().setDraft("go");
    await store.getState().submit();
    await store.getState().dispatchAction({ name: "product.open", sourceNodeId: "shoe", payload: { productId: "shoe" } });
    expect(actionSpy).toHaveBeenCalledWith(expect.objectContaining({ conversationId: "conversation-4", name: "product.open", sourceNodeId: "shoe", runId: expect.any(String) }));
  });

  it("gives a preloaded document a run ID for actions", async () => {
    const actionSpy = vi.fn(action);
    const client: QChatClient = { capabilities: {}, action: actionSpy, async *run() { yield { type: "complete" }; } };
    const store = createQChatStore(client, [], "conversation-5", document);
    await store.getState().dispatchAction({ name: "product.open", sourceNodeId: "shoe", payload: { productId: "shoe" } });
    expect(actionSpy).toHaveBeenCalledWith(expect.objectContaining({ runId: expect.stringMatching(/.+/) }));
  });
});
