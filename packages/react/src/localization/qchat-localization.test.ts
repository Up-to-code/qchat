import { describe,expect,it } from "vitest";
import { resolveQChatLocale,translateQChat } from "./qchat-localization";

describe("QChat localization interface",()=>{
  it("resolves Arabic direction and translates library chrome",()=>{
    expect(resolveQChatLocale(undefined,"ar-EG").direction).toBe("rtl");
    expect(translateQChat(undefined,"ar-EG","nextProducts")).toBe("المنتجات التالية");
  });
  it("accepts host languages, labels, and translations with English fallback",()=>{
    const localization={defaultLocale:"fr-FR",locales:[{code:"fr-FR",label:"Français",direction:"ltr" as const}],translations:{"fr-FR":{sendMessage:"Envoyer"}}};
    expect(resolveQChatLocale(localization,"fr-FR")).toMatchObject({code:"fr-FR",label:"Français",direction:"ltr"});
    expect(translateQChat(localization,"fr-FR","sendMessage")).toBe("Envoyer");
    expect(translateQChat(localization,"fr-FR","addImage")).toBe("Add image");
    expect(resolveQChatLocale(localization,"invalid").code).toBe("fr-FR");
  });
});
