import type { QChatLocaleDefinition,QChatLocalization,QChatTranslationKey,QChatTranslations } from "../interfaces/react.interfaces";

export const defaultLocales: readonly QChatLocaleDefinition[] = [
  { code: "en-US", label: "English", direction: "ltr" },
  { code: "ar-EG", label: "العربية", direction: "rtl", fontFamily: '"Noto Sans Arabic", system-ui, sans-serif' },
];

const english: QChatTranslations = { thinking: "Thinking", thoughtFor: "Thought for", second: "second", seconds: "seconds", loadingProducts: "Loading products", color: "Color", size: "Size", chooseAvailable: "Choose an available color and size", previousProducts: "Previous products", nextProducts: "Next products", sendMessage: "Send message", stopGeneration: "Stop generation", addImage: "Add image", startVoiceMode: "Start voice mode", examplePrompts: "Example prompts",messagePlaceholder:"Ask anything",you:"You",read:"Read",startDictation:"Start dictation",stopDictation:"Stop dictation",exitVoiceMode:"Exit voice mode",listening:"Listening",speaking:"Speaking" };
const arabic: QChatTranslations = { thinking: "جارٍ التفكير", thoughtFor: "استغرق التفكير", second: "ثانية", seconds: "ثوانٍ", loadingProducts: "جارٍ تحميل المنتجات", color: "اللون", size: "المقاس", chooseAvailable: "اختر لونًا ومقاسًا متاحين", previousProducts: "المنتجات السابقة", nextProducts: "المنتجات التالية", sendMessage: "إرسال الرسالة", stopGeneration: "إيقاف الإنشاء", addImage: "إضافة صورة", startVoiceMode: "بدء الوضع الصوتي", examplePrompts: "أمثلة للأسئلة",messagePlaceholder:"اسأل عن أي شيء",you:"أنت",read:"تمت القراءة",startDictation:"بدء الإملاء",stopDictation:"إيقاف الإملاء",exitVoiceMode:"الخروج من الوضع الصوتي",listening:"جارٍ الاستماع",speaking:"جارٍ التحدث" };

export function resolveQChatLocale(localization:QChatLocalization|undefined,requested:string|undefined){
  const locales=localization?.locales?.length?localization.locales:defaultLocales;
  const selected=locales.find((item)=>item.code===requested)??locales.find((item)=>item.code===localization?.defaultLocale)??locales[0]!;
  return selected;
}

/** Translate library chrome with English fallback; hosts can add any BCP-47 locale. */
export function translateQChat(localization:QChatLocalization|undefined,locale:string,key:QChatTranslationKey){
  return localization?.translations?.[locale]?.[key]??(locale.startsWith("ar")?arabic[key]:english[key]);
}
