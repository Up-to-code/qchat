// src/schemas/ui-document.schema.ts
import { z } from "zod";
var safeText = (max) => z.string().trim().min(1).max(max);
var safeUrl = z.string().url().refine((value) => ["https:", "http:"].includes(new URL(value).protocol), "Only HTTP(S) URLs are allowed");
var qChatChoiceOptionSchema = z.object({ value: safeText(64), label: safeText(64), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), disabled: z.boolean().optional() }).strict();
var actionSchema = z.object({ label: safeText(48), name: z.enum(["product.select", "product.add", "product.open"]), payload: z.record(z.union([z.string().max(256), z.number().finite(), z.boolean()])) }).strict();
var qChatProductCardSchema = z.object({ type: z.literal("product-card"), id: safeText(80), title: safeText(100), description: safeText(280).optional(), image: z.object({ src: safeUrl, alt: safeText(140) }).strict().optional(), price: z.object({ amount: z.number().finite().nonnegative(), currency: z.string().length(3).transform((v) => v.toUpperCase()) }).strict(), tags: z.array(safeText(32)).max(6).optional(), colors: z.array(qChatChoiceOptionSchema).max(12).optional(), sizes: z.array(qChatChoiceOptionSchema).max(12).optional(), primaryAction: actionSchema.optional(), secondaryAction: actionSchema.optional() }).strict();
var qChatProductCollectionSchema = z.object({ type: z.literal("product-collection"), id: safeText(80), direction: z.enum(["horizontal", "vertical"]), title: safeText(100).optional(), items: z.array(qChatProductCardSchema).min(1).max(12) }).strict();
var qChatStatusSchema = z.object({ type: z.literal("status"), id: safeText(80), variant: z.enum(["empty", "unavailable", "error"]), title: safeText(100), description: safeText(280).optional() }).strict();
var qChatInfoCardSchema = z.object({ type: z.literal("info-card"), id: safeText(80), title: safeText(100), description: safeText(500), facts: z.array(z.object({ label: safeText(64), value: safeText(120) }).strict()).max(8).optional(), source: safeText(120).optional() }).strict();
var qChatUIDocumentSchema = z.object({ version: z.literal("1"), id: safeText(80), layout: z.enum(["container", "scroll"]), children: z.array(z.discriminatedUnion("type", [qChatProductCollectionSchema, qChatProductCardSchema, qChatStatusSchema, qChatInfoCardSchema])).min(1).max(16) }).strict();

// src/schemas/product-variant.schema.ts
import { z as z2 } from "zod";
var safeIdentifier = z2.string().trim().min(1).max(80).regex(/^[A-Za-z0-9._:-]+$/);
var safeUrl2 = z2.string().url().refine((value) => ["https:", "http:"].includes(new URL(value).protocol), "Only HTTP(S) URLs are allowed");
var qChatProductVariantSchema = z2.object({
  id: safeIdentifier,
  color: safeIdentifier,
  size: safeIdentifier,
  price: z2.object({ amount: z2.number().finite().nonnegative(), currency: z2.string().length(3).transform((value) => value.toUpperCase()) }).strict(),
  available: z2.boolean(),
  image: z2.object({ src: safeUrl2, alt: z2.string().trim().min(1).max(140) }).strict().optional()
}).strict();
var catalogSchema = z2.record(safeIdentifier, z2.array(qChatProductVariantSchema).min(1).max(100)).refine((catalog) => Object.keys(catalog).length <= 40, "Too many products").superRefine((catalog, context) => {
  var _a;
  for (const [productId, variants] of Object.entries(catalog)) {
    const ids = /* @__PURE__ */ new Set();
    const combinations = /* @__PURE__ */ new Set();
    const currency = (_a = variants[0]) == null ? void 0 : _a.price.currency;
    for (const variant of variants) {
      const combination = `${variant.color}\0${variant.size}`;
      if (ids.has(variant.id)) context.addIssue({ code: z2.ZodIssueCode.custom, message: `Duplicate variant ID for ${productId}` });
      if (combinations.has(combination)) context.addIssue({ code: z2.ZodIssueCode.custom, message: `Duplicate color/size for ${productId}` });
      if (variant.price.currency !== currency) context.addIssue({ code: z2.ZodIssueCode.custom, message: `Mixed currency for ${productId}` });
      ids.add(variant.id);
      combinations.add(combination);
    }
  }
});
function createQChatProductVariantCatalog(value) {
  return catalogSchema.parse(value);
}
export {
  createQChatProductVariantCatalog,
  qChatChoiceOptionSchema,
  qChatInfoCardSchema,
  qChatProductCardSchema,
  qChatProductCollectionSchema,
  qChatProductVariantSchema,
  qChatStatusSchema,
  qChatUIDocumentSchema
};
//# sourceMappingURL=index.js.map