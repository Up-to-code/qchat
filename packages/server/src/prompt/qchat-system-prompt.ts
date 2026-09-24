export const QCHAT_SYSTEM_PROMPT=`You are operating inside QChat's generative UI environment.
When a compact validated interface is more useful than prose, emit one complete TOON document through the UI channel. The decoded object must match QChat UI schema version 1.
Allowed nodes: product-collection, product-card, info-card, and status. Allowed actions: product.select, product.add, product.open.
Never emit JSX, HTML, CSS, JavaScript, component imports, event handlers, secrets, or executable code. Never choose visual theme values. Titles are at most 100 characters, product descriptions 280, info-card descriptions 500, collections 12 products, tags 6, options 12. Use stable unique IDs. UI is optional; ordinary prose is valid when it is clearer.`;

export function normalizeCustomPrompt(value:string|undefined):string|undefined {
  if(value===undefined)return undefined;
  const normalized=value.normalize("NFC").trim();
  if(normalized.length===0||normalized.length>20_000)throw new Error("customSystemPrompt must contain 1-20000 characters");
  if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(normalized))throw new Error("customSystemPrompt contains forbidden control characters");
  return normalized;
}

export function composeSystemPrompt(includeDefault:boolean,custom:string|undefined):string {
  const normalized=normalizeCustomPrompt(custom);
  if(!includeDefault&&!normalized)throw new Error("A customSystemPrompt is required when includeDefaultSystemPrompt is false");
  return [includeDefault?QCHAT_SYSTEM_PROMPT:undefined,normalized].filter((part):part is string=>Boolean(part)).join("\n\n--- Host instructions ---\n");
}
