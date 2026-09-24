import { z } from "zod";
import type { QChatProductVariantCatalog } from "../interfaces/product-variant.interfaces";

const safeIdentifier = z.string().trim().min(1).max(80).regex(/^[A-Za-z0-9._:-]+$/);
const safeUrl = z.string().url().refine((value) => ["https:", "http:"].includes(new URL(value).protocol), "Only HTTP(S) URLs are allowed");
export const qChatProductVariantSchema = z.object({
  id: safeIdentifier,
  color: safeIdentifier,
  size: safeIdentifier,
  price: z.object({ amount: z.number().finite().nonnegative(), currency: z.string().length(3).transform((value) => value.toUpperCase()) }).strict(),
  available: z.boolean(),
  image: z.object({ src: safeUrl, alt: z.string().trim().min(1).max(140) }).strict().optional(),
}).strict();

const catalogSchema = z.record(safeIdentifier, z.array(qChatProductVariantSchema).min(1).max(100)).refine((catalog) => Object.keys(catalog).length <= 40, "Too many products").superRefine((catalog, context) => {
  for (const [productId, variants] of Object.entries(catalog)) {
    const ids = new Set<string>();
    const combinations = new Set<string>();
    const currency = variants[0]?.price.currency;
    for (const variant of variants) {
      const combination = `${variant.color}\u0000${variant.size}`;
      if (ids.has(variant.id)) context.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate variant ID for ${productId}` });
      if (combinations.has(combination)) context.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate color/size for ${productId}` });
      if (variant.price.currency !== currency) context.addIssue({ code: z.ZodIssueCode.custom, message: `Mixed currency for ${productId}` });
      ids.add(variant.id);
      combinations.add(combination);
    }
  }
});

/** Parse catalog facts before supplying them to QChatConfig. */
export function createQChatProductVariantCatalog(value: unknown): QChatProductVariantCatalog {
  return catalogSchema.parse(value);
}
