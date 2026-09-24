import { describe, expect, it } from "vitest";
import { createQChatProductVariantCatalog } from "@qchat/core";
import { isAvailableCombination, resolveProductVariant } from "./resolve-product-variant";

const catalog = createQChatProductVariantCatalog({ suit: [
  { id: "navy-38", color: "navy", size: "38", price: { amount: 220, currency: "usd" }, available: true },
  { id: "navy-40", color: "navy", size: "40", price: { amount: 230, currency: "usd" }, available: true },
  { id: "charcoal-40", color: "charcoal", size: "40", price: { amount: 260, currency: "usd" }, available: true },
  { id: "charcoal-42", color: "charcoal", size: "42", price: { amount: 270, currency: "usd" }, available: false },
] });
const variants = catalog.suit!;

describe("trusted product variants", () => {
  it("changes price and disabled sizes from the selected color", () => {
    expect(resolveProductVariant(variants, "navy", "38").exact).toMatchObject({ id: "navy-38", price: { amount: 220, currency: "USD" } });
    expect(resolveProductVariant(variants, "charcoal").display?.price.amount).toBe(260);
    expect(resolveProductVariant(variants, "charcoal").availableSizes.has("38")).toBe(false);
    expect(resolveProductVariant(variants, "charcoal").availableSizes.has("40")).toBe(true);
    expect(isAvailableCombination(variants, "charcoal", "38")).toBe(false);
  });

  it("rejects inconsistent or unsafe host catalog data", () => {
    expect(() => createQChatProductVariantCatalog({ suit: [variants[0], variants[0]] })).toThrow();
    expect(() => createQChatProductVariantCatalog({ suit: [{ ...variants[0], image: { src: "javascript:alert(1)", alt: "Unsafe" } }] })).toThrow();
    expect(() => createQChatProductVariantCatalog({ suit: [{ ...variants[0], price: { amount: -1, currency: "USD" } }] })).toThrow();
  });
});
