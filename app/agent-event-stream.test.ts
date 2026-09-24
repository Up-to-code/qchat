import {describe,it,expect} from "vitest";
import {readAgentEvents} from "./agent-event-stream";
async function collect(text:string){const result=[];for await(const event of readAgentEvents(new Response(text).body!))result.push(event);return result}
describe("agent transport",()=>{
  it("reads a final event without a newline",async()=>{expect(await collect('{"type":"complete"}')).toEqual([{type:"complete"}])});
  it("rejects malformed events",async()=>{await expect(collect('{"type":"text.delta","delta":42}')).rejects.toThrow()});
  it("rejects unvalidated generated UI",async()=>{await expect(collect('{"type":"ui.complete","document":{"html":"<script>"}}')).rejects.toThrow()});
});
