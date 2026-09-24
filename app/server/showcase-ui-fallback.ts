import "server-only";
import { qChatUIDocumentSchema,type QChatUIDocument } from "@qchat/core";
import type { ShowcaseRecord } from "./showcase-retriever";

interface CatalogRecord {readonly id:string;readonly name:string;readonly imageUrl?:string;readonly colors:readonly string[];readonly sizes:readonly string[];readonly priceUsd:number|Record<string,number>}
export function trustedFallbackDocument(catalogResult:string|undefined,retrievalHits:string|undefined,locale:string):QChatUIDocument {
  const arabic=locale.startsWith("ar");
  if(catalogResult){
    const catalog=JSON.parse(catalogResult) as {products:CatalogRecord[]};
    return qChatUIDocumentSchema.parse({version:"1",id:"trusted-products",layout:"scroll",children:[{type:"product-collection",id:"trusted-shoes",direction:"horizontal",title:arabic?"خيارات الجري":"Running options",items:catalog.products.map((item)=>({type:"product-card",id:item.id,title:item.name,description:arabic?"تفاصيل من كتالوج المضيف":"Details from the host catalog",image:item.imageUrl?{src:item.imageUrl,alt:item.name}:undefined,price:{amount:typeof item.priceUsd==="number"?item.priceUsd:Math.min(...Object.values(item.priceUsd)),currency:"USD"},colors:item.colors.map((color)=>({value:color,label:color})),sizes:item.sizes.map((size)=>({value:size,label:size}))}))}]});
  }
  const hits=JSON.parse(retrievalHits||"[]") as ShowcaseRecord[];
  if(hits.length===0)return qChatUIDocumentSchema.parse({version:"1",id:"trusted-empty",layout:"container",children:[{type:"status",id:"empty",variant:"empty",title:arabic?"لا توجد نتائج":"No matching records",description:arabic?"جرّب طلبًا آخر.":"Try another request."}]});
  const industry=hits[0]!.industry;
  return qChatUIDocumentSchema.parse({version:"1",id:"trusted-retrieval",layout:"container",children:hits.filter((hit)=>hit.industry===industry).map((hit)=>({type:"info-card",id:hit.id,title:hit.title,description:hit.summary,facts:hit.facts,source:`Sample ${hit.industry} knowledge base`}))});
}
