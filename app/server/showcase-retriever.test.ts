import { describe,expect,it } from "vitest";
import { createShowcaseRetriever } from "./showcase-retriever";

describe("host-data token vector retrieval",()=>{
  const index=createShowcaseRetriever();
  it("retrieves travel data by English query",()=>expect(index.search("Cairo travel trip")[0]?.record.id).toBe("travel-cairo"));
  it("retrieves insurance data by Arabic query",()=>expect(index.search("تأمين صحي للعائلة")[0]?.record.industry).toBe("insurance"));
  it("returns no fabricated result for unrelated text",()=>expect(index.search("quantum banana semaphore")).toEqual([]));
  it("accepts validated host-provided records",()=>{
    const custom=createShowcaseRetriever([{id:"custom",industry:"travel",title:"Lisbon tour",summary:"Tram and waterfront visit",keywords:["Lisbon","Portugal","رحلة"],facts:[]}]);
    expect(custom.search("Lisbon")[0]?.record.id).toBe("custom");
  });
});
