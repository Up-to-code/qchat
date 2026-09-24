import { eventIterator,oc } from "@orpc/contract";
import { z } from "zod";
import { qChatUIDocumentSchema } from "@qchat/core";
const metadataSchema=z.object({conversationId:z.string().min(1).max(128),runId:z.string().min(1).max(128),userId:z.string().max(128).optional(),locale:z.string().max(32).optional()}).catchall(z.unknown());
const messageSchema=z.object({id:z.string(),role:z.enum(["user","assistant","system"]),content:z.string().max(100_000),createdAt:z.string().datetime()});
const scalar=z.union([z.string().max(256),z.number().finite(),z.boolean()]);
export const qChatEventSchema=z.discriminatedUnion("type",[
  z.object({type:z.literal("text.delta"),delta:z.string()}),z.object({type:z.literal("reasoning.status"),label:z.string(),elapsedMs:z.number().optional()}),
  z.object({type:z.literal("tool.start"),toolCallId:z.string(),name:z.string()}),z.object({type:z.literal("tool.result"),toolCallId:z.string(),summary:z.string()}),z.object({type:z.literal("tool.error"),toolCallId:z.string(),message:z.string()}),
  z.object({type:z.literal("ui.start")}),z.object({type:z.literal("ui.delta"),delta:z.string()}),z.object({type:z.literal("ui.complete"),document:qChatUIDocumentSchema}),
  z.object({type:z.literal("usage"),usage:z.object({inputTokens:z.number().optional(),outputTokens:z.number().optional()})}),
  z.object({type:z.literal("performance"),record:z.object({name:z.string(),durationMs:z.number(),runId:z.string(),timestamp:z.string(),attributes:z.record(z.union([z.string(),z.number(),z.boolean()])).optional()})}),
  z.object({type:z.literal("complete")}),z.object({type:z.literal("failure"),error:z.object({code:z.enum(["CONFIG_INVALID","ADAPTER_FAILED","COMPILE_FAILED","ACTION_REJECTED","CANCELLED"]),message:z.string(),retryable:z.boolean(),diagnostics:z.array(z.string()).optional()})})
]);
export const qChatActionSchema=z.object({name:z.enum(["product.select","product.add","product.open"]),sourceNodeId:z.string().min(1).max(80),payload:z.record(scalar),conversationId:z.string().min(1).max(128),runId:z.string().min(1).max(128)});
export const qChatORPCContract={
  run:oc.route({method:"POST",path:"/qchat/run"}).input(z.object({messages:z.array(messageSchema).max(200),metadata:metadataSchema})).output(eventIterator(qChatEventSchema)),
  action:oc.route({method:"POST",path:"/qchat/action"}).input(qChatActionSchema).output(z.discriminatedUnion("status",[z.object({status:z.literal("accepted"),message:z.string().optional(),navigationUrl:z.string().url().optional()}),z.object({status:z.literal("rejected"),message:z.string()})]))
};
export type QChatORPCContract=typeof qChatORPCContract;
