import {describe,it,expect} from "vitest";
import {createQChatServer} from "./create-qchat-server";
describe("runtime resilience",()=>{
  it("does not let a telemetry failure break an answer",async()=>{
    const server=createQChatServer({telemetry:{async record(){throw new Error("logging down")}},adapter:{async *run(){yield {type:"text.delta",delta:"hello"};yield {type:"complete"}}}});
    const events=[];for await(const event of server.run({messages:[],metadata:{conversationId:"test",runId:"test"}}))events.push(event);
    expect(events).toContainEqual({type:"text.delta",delta:"hello"});expect(events.at(-1)?.type).toBe("complete");
  });
  it("bounds the generated document while it is still streaming",async()=>{
    const server=createQChatServer({compilerLimits:{maxDocumentBytes:10},adapter:{async *run(){yield {type:"ui.start"};yield {type:"ui.delta",delta:"a".repeat(20)};yield {type:"complete"}}}});
    const events=[];for await(const event of server.run({messages:[],metadata:{conversationId:"test",runId:"test"}}))events.push(event);
    expect(events.at(-1)?.type).toBe("failure");
  });
});
