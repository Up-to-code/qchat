/** Agent policy belongs to the host application; QChat packages do not import this file. */
export const showcaseModelConfig={
  live:{provider:"gemini",model:"gemini-3.8-live"},
  conversation:"gemini-3.1-flash-lite",
  vision:"gemini-3.5-flash",
  ui:"gemini-3.5-flash",
  transcription:{provider:"gemini",model:"gemini-3.5-flash"},
  speech:{provider:"gemini",model:"gemini-2.5-flash-preview-tts"},
  imageGeneration:{available:false,reason:"Gemini image generation has no configured free API tier."},
} as const;
export type ShowcaseTask="conversation"|"vision"|"ui"|"image-generation";
export function classifyShowcaseTask(prompt:string,hasImages=false):ShowcaseTask{
  if(/(?:generate|create|draw|make)\s+(?:an?\s+)?(?:image|picture|illustration|photo)|(?:ارسم|أنشئ صورة|انشئ صورة|ولد صورة)/i.test(prompt))return "image-generation";
  if(hasImages)return "vision";
  // Output intent is independent of retrieval matches: an article is not a UI.
  if(/\b(blog|article|essay|story|prose)\b|مقال|تدوينة|قصة/i.test(prompt))return "conversation";
  if(/\b(cards?|dashboard|interface|interactive|ui)\b|بطاقات|واجهة|لوحة تحكم/i.test(prompt))return "ui";
  return "conversation";
}
export function needsShowcaseCatalog(prompt:string){
  if(/\b(blog|article|essay|story|prose)\b|مقال|تدوينة|قصة/i.test(prompt))return false;
  return /\b(products?|shoes?|shopping|shop|sizes?|colors?|prices?)\b|منتج|حذاء|أحذية|مقاس|لون|سعر/i.test(prompt);
}
