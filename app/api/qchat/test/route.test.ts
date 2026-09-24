import { describe, expect, it } from "vitest";
import { POST } from "./route";

const request = (content: string) => new Request("http://localhost/api/qchat/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content }] }) });
const events = async (response: Response) => (await response.text()).trim().split("\n").map((line) => JSON.parse(line) as { type: string; document?: { children: readonly { type: string }[] } });

describe("LangGraph test adapter", () => {
  it("compiles a valid product UI through the server", async () => {
    const response = await POST(request("Show blue running shoes"));
    const result = await events(response);
    expect(result.map((event) => event.type)).toContain("ui.complete");
    expect(result.find((event) => event.type === "ui.complete")?.document?.children[0]?.type).toBe("product-collection");
  });
  it("keeps failures typed and redacted", async () => {
    const result = await events(await POST(request("Simulate an agent failure")));
    expect(result.at(-1)?.type).toBe("failure");
    expect(JSON.stringify(result)).not.toContain("Simulated test failure");
  });
  it("rejects malformed requests", async () => {
    const response = await POST(new Request("http://localhost/api/qchat/test", { method: "POST", body: "{}" }));
    expect(response.status).toBe(400);
  });
  it("retrieves and compiles travel information without product-card coercion",async()=>{
    const result=await events(await POST(request("Plan a trip to Cairo")));
    expect(result.find((event)=>event.type==="ui.complete")?.document?.children[0]?.type).toBe("info-card");
    expect(result.some((event)=>event.type==="tool.start")).toBe(true);
  });
});
