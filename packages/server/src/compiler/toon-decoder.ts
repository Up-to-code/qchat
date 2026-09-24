import { decode } from "@toon-format/toon";
export function decodeToonDocument(source:string,maxDocumentBytes:number):unknown {
  const size=new TextEncoder().encode(source).byteLength;
  if(size>maxDocumentBytes)throw new Error(`TOON document exceeds ${maxDocumentBytes} bytes`);
  return decode(source);
}
