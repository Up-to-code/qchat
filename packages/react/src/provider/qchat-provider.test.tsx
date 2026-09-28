import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import type { QChatClient } from "../interfaces/react.interfaces";
import { QChatProvider } from "./qchat-provider";
import { QChatThread } from "../components/qchat-thread";
import { createQChatHostView } from "../host-view/create-qchat-host-view";

const client: QChatClient = {
  capabilities: {},
  async *run() { yield { type: "complete" as const }; },
  async action() { return { status: "rejected" as const, message: "Test action rejected" }; },
};

describe("QChatProvider", () => {
  it("sets document direction and locale font from configuration", () => {
    const html = renderToString(createElement(QChatProvider, { client, config: { localization: { locale: "ar-EG" } }},createElement(QChatThread)));
    expect(html).toContain('lang="ar-EG"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("Noto Sans Arabic");
  });
  it("renders a real thread with its hooks inside the provider", () => {
    const html = renderToString(createElement(QChatProvider, {
      client,
      initialMessages: [{ id: "m1", role: "assistant", content: "Provider is connected", createdAt: "2026-09-24T00:00:00.000Z" }]},createElement(QChatThread)
    ));
    expect(html).toContain("Provider is connected");
    expect(html).toContain("qchat-thread");
  });

  it("keeps message state separate for two provider instances", () => {
    const render = (content: string) => renderToString(createElement(QChatProvider, {
      client,
      initialMessages: [{ id: content, role: "user", content, createdAt: "2026-09-24T00:00:00.000Z" }]},createElement(QChatThread)
    ));
    expect(render("first conversation")).not.toContain("second conversation");
    expect(render("second conversation")).not.toContain("first conversation");
  });

  it("explains a missing provider at the hook boundary", () => {
    expect(() => renderToString(createElement(QChatThread))).toThrow("QChat hooks must be used inside QChatProvider");
  });

  it("renders configured message and tool slots with provider state", () => {
    const html = renderToString(createElement(QChatProvider, {
      client,
      config: { slots: {
        message: ({ message }) => createElement("p", { "data-testid": "custom-message" }, message.content),
        toolActivity: () => createElement("p", { "data-testid": "custom-tools" }, "Custom tools"),
      } },
      initialMessages: [{ id: "m2", role: "assistant", content: "Custom bubble", createdAt: "2026-09-24T00:00:00.000Z" }],
      initialTools: [{ id: "t1", name: "search_catalog", status: "complete" }]},createElement(QChatThread)
    ));
    expect(html).toContain("Custom bubble");
    expect(html).toContain("Custom tools");
    expect(html).not.toContain("qchat-message assistant");
  });

  it("uses a validated host component instead of a generated document", () => {
    const view = createQChatHostView(
      ({ data }: { readonly data: { subject: string } }) => createElement("div", null, data.subject),
      { subject: "Inbox" },
      { parse(value: unknown) { if (typeof value !== "object" || value === null || !("subject" in value) || typeof value.subject !== "string") throw new Error("Invalid host data"); return { subject: value.subject }; } },
    );
    const html = renderToString(createElement(QChatProvider, {
      client,
      config: { hostView: view },
      initialDocument: { version: "1", id: "ignored", layout: "container", children: [{ type: "status", id: "old", variant: "empty", title: "Generated fallback" }] }},createElement(QChatThread)
    ));
    expect(html).toContain("Inbox");
    expect(html).not.toContain("Generated fallback");
    expect(() => createQChatHostView(() => null, { subject: 1 }, { parse() { throw new Error("Invalid host data"); } })).toThrow("Invalid host data");
  });
});
