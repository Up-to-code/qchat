import { qChatUIDocumentSchema,type QChatUIDocument } from "@qchat/core";
import { decodeToonDocument } from "./toon-decoder";
import type { QChatCompilerLimits } from "../interfaces/server.interfaces";

function inspectDepth(value:unknown,depth=0):number {
  if(value===null||typeof value!=="object")return depth;
  const values=Array.isArray(value)?value:Object.values(value);
  return values.reduce<number>((max,item)=>Math.max(max,inspectDepth(item,depth+1)),depth);
}
export interface QChatCompileResult { readonly document?:QChatUIDocument; readonly diagnostics:readonly string[]; readonly durationMs:number }
export function compileToonUI(source:string,limits:QChatCompilerLimits,allowedImageHosts:readonly string[]=[]):QChatCompileResult {
  const started=performance.now();
  try {
    const decoded=decodeToonDocument(source,limits.maxDocumentBytes);
    if(inspectDepth(decoded)>limits.maxDepth)throw new Error(`Document nesting exceeds ${limits.maxDepth}`);
    const parsed=qChatUIDocumentSchema.safeParse(decoded);
    if(!parsed.success)return {diagnostics:parsed.error.issues.map((issue)=>`${issue.path.join(".")||"root"}: ${issue.message}`),durationMs:performance.now()-started};
    for(const node of parsed.data.children){
      const cards=node.type==="product-collection"?node.items:node.type==="product-card"?[node]:[];
      if(cards.length>limits.maxCollectionItems)throw new Error("Collection item limit exceeded");
      for(const card of cards){if(card.image&&allowedImageHosts.length>0&&!allowedImageHosts.includes(new URL(card.image.src).hostname))throw new Error(`Image host is not allowed: ${new URL(card.image.src).hostname}`)}
    }
    return {document:parsed.data,diagnostics:[],durationMs:performance.now()-started};
  }catch(error){return {diagnostics:[error instanceof Error?error.message:"Unknown compiler failure"],durationMs:performance.now()-started}}
}
