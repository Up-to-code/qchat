/** Serializable render-plan interfaces. Model output can never carry executable code. */
import type { QChatAction } from "./runtime.interfaces";
export interface QChatChoiceOption { readonly value: string; readonly label: string; readonly color?: string; readonly disabled?: boolean }
export interface QChatProductCardNode { readonly type: "product-card"; readonly id: string; readonly title: string; readonly description?: string; readonly image?: { readonly src: string; readonly alt: string }; readonly price: { readonly amount: number; readonly currency: string }; readonly tags?: readonly string[]; readonly colors?: readonly QChatChoiceOption[]; readonly sizes?: readonly QChatChoiceOption[]; readonly primaryAction?: Omit<QChatAction,"conversationId"|"runId"|"sourceNodeId"> & { readonly label: string }; readonly secondaryAction?: Omit<QChatAction,"conversationId"|"runId"|"sourceNodeId"> & { readonly label: string } }
export interface QChatProductCollectionNode { readonly type: "product-collection"; readonly id: string; readonly direction: "horizontal" | "vertical"; readonly title?: string; readonly items: readonly QChatProductCardNode[] }
export interface QChatStatusNode { readonly type: "status"; readonly id: string; readonly variant: "empty" | "unavailable" | "error"; readonly title: string; readonly description?: string }
/** A bounded, industry-neutral result backed by host data rather than model-authored markup. */
export interface QChatInfoCardNode { readonly type:"info-card";readonly id:string;readonly title:string;readonly description:string;readonly facts?:readonly {readonly label:string;readonly value:string}[];readonly source?:string }
export type QChatUINode = QChatProductCollectionNode | QChatProductCardNode | QChatStatusNode | QChatInfoCardNode;
export interface QChatUIDocument { readonly version: "1"; readonly id: string; readonly layout: "container" | "scroll"; readonly children: readonly QChatUINode[] }
