/** Host-supplied commerce facts. These are not generated UI instructions. */
export interface QChatProductVariant {
  readonly id: string;
  readonly color: string;
  readonly size: string;
  readonly price: { readonly amount: number; readonly currency: string };
  readonly available: boolean;
  readonly image?: { readonly src: string; readonly alt: string };
}

export type QChatProductVariantCatalog = Readonly<Record<string, readonly QChatProductVariant[]>>;
