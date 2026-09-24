import { describe,expect,it } from "vitest";
import { encode } from "@toon-format/toon";
import { compileToonUI } from "./document-compiler";
const limits={maxDocumentBytes:8_000,maxDepth:8,maxCollectionItems:12};
const valid={version:"1",id:"results",layout:"container",children:[{type:"product-card",id:"shoe",title:"Blue runner",price:{amount:99,currency:"usd"},primaryAction:{label:"Add",name:"product.add",payload:{productId:"shoe"}}}]};
describe("compileToonUI",()=>{
  it("decodes, validates, and normalizes a TOON UI document",()=>{const result=compileToonUI(encode(valid),limits);expect(result.diagnostics).toEqual([]);expect(result.document?.children[0]).toMatchObject({type:"product-card",price:{currency:"USD"}})});
  it("rejects executable or unknown model fields",()=>{const result=compileToonUI(encode({...valid,children:[{...valid.children[0],onClick:"javascript:alert(1)"}]}),limits);expect(result.document).toBeUndefined();expect(result.diagnostics.join(" ")).toContain("Unrecognized key")});
  it("rejects unsafe image protocols",()=>{const result=compileToonUI(encode({...valid,children:[{...valid.children[0],image:{src:"javascript:alert(1)",alt:"bad"}}]}),limits);expect(result.document).toBeUndefined()});
  it("enforces document byte limits before parsing",()=>{const result=compileToonUI(encode(valid),{...limits,maxDocumentBytes:2});expect(result.diagnostics[0]).toContain("exceeds")});
  it("enforces configured image hosts",()=>{const result=compileToonUI(encode({...valid,children:[{...valid.children[0],image:{src:"https://images.example.com/shoe.jpg",alt:"shoe"}}]}),limits,["cdn.example.com"]);expect(result.diagnostics[0]).toContain("not allowed")});
});
