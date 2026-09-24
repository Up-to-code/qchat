import {describe,it,expect} from "vitest";
import {classifyShowcaseTask,needsShowcaseCatalog} from "./showcase-model-config";
describe("output intent",()=>{
  it("does not route prose into UI generation",()=>{
    for(const prompt of ["I want you to write long content as a test blog so I can test your capability of formatting.","Write an article about shoe prices","اكتب مقالاً عن أسعار الأحذية"]){
      expect(classifyShowcaseTask(prompt)).toBe("conversation");
      expect(needsShowcaseCatalog(prompt)).toBe(false);
    }
  });
  it("keeps explicitly requested cards and shopping available",()=>{
    expect(classifyShowcaseTask("Show travel cards")).toBe("ui");
    expect(needsShowcaseCatalog("Show blue shoes")).toBe(true);
    expect(needsShowcaseCatalog("Summarize this text")).toBe(false);
  });
});
