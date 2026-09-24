// src/schemas/ui-document.schema.ts
import { z } from "zod";
var safeText = (max) => z.string().trim().min(1).max(max);
var safeUrl = z.string().url().refine((value) => ["https:", "http:"].includes(new URL(value).protocol), "Only HTTP(S) URLs are allowed");
var qChatChoiceOptionSchema = z.object({ value: safeText(64), label: safeText(64), color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), disabled: z.boolean().optional() }).strict();
var actionSchema = z.object({ label: safeText(48), name: z.enum(["product.select", "product.add", "product.open"]), payload: z.record(z.union([z.string().max(256), z.number().finite(), z.boolean()])) }).strict();
var qChatProductCardSchema = z.object({ type: z.literal("product-card"), id: safeText(80), title: safeText(100), description: safeText(280).optional(), image: z.object({ src: safeUrl, alt: safeText(140) }).strict().optional(), price: z.object({ amount: z.number().finite().nonnegative(), currency: z.string().length(3).transform((v) => v.toUpperCase()) }).strict(), tags: z.array(safeText(32)).max(6).optional(), colors: z.array(qChatChoiceOptionSchema).max(12).optional(), sizes: z.array(qChatChoiceOptionSchema).max(12).optional(), primaryAction: actionSchema.optional(), secondaryAction: actionSchema.optional() }).strict();
var qChatProductCollectionSchema = z.object({ type: z.literal("product-collection"), id: safeText(80), direction: z.enum(["horizontal", "vertical"]), title: safeText(100).optional(), items: z.array(qChatProductCardSchema).min(1).max(12) }).strict();
var qChatStatusSchema = z.object({ type: z.literal("status"), id: safeText(80), variant: z.enum(["empty", "unavailable", "error"]), title: safeText(100), description: safeText(280).optional() }).strict();
var qChatUIDocumentSchema = z.object({ version: z.literal("1"), id: safeText(80), layout: z.enum(["container", "scroll"]), children: z.array(z.discriminatedUnion("type", [qChatProductCollectionSchema, qChatProductCardSchema, qChatStatusSchema])).min(1).max(16) }).strict();
export {
  qChatChoiceOptionSchema,
  qChatProductCardSchema,
  qChatProductCollectionSchema,
  qChatStatusSchema,
  qChatUIDocumentSchema
};
//# sourceMappingURL=index.js.map