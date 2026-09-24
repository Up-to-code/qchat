import type { QChatProductVariant } from "@qchat/core";

export interface QChatResolvedVariant {
  readonly exact?: QChatProductVariant;
  readonly display?: QChatProductVariant;
  readonly isFromPrice: boolean;
  readonly availableColors: ReadonlySet<string>;
  readonly availableSizes: ReadonlySet<string>;
}

/** Derive displayed facts from host catalog data, never from model guesses. */
export function resolveProductVariant(
  variants: readonly QChatProductVariant[],
  color?: string,
  size?: string,
): QChatResolvedVariant {
  const available = variants.filter((variant) => variant.available);
  const matchingColor = color ? available.filter((variant) => variant.color === color) : available;
  const exact = color && size ? matchingColor.find((variant) => variant.size === size) : undefined;
  const candidates = matchingColor.length > 0 ? matchingColor : available;
  const display = exact ?? candidates.reduce<QChatProductVariant | undefined>((cheapest, variant) => !cheapest || variant.price.amount < cheapest.price.amount ? variant : cheapest, undefined);
  return {
    ...(exact ? { exact } : {}),
    ...(display ? { display } : {}),
    isFromPrice: !exact && new Set(candidates.map((variant) => variant.price.amount)).size > 1,
    availableColors: new Set(available.map((variant) => variant.color)),
    availableSizes: new Set(matchingColor.map((variant) => variant.size)),
  };
}

export function isAvailableCombination(variants: readonly QChatProductVariant[], color: string, size: string): boolean {
  return variants.some((variant) => variant.available && variant.color === color && variant.size === size);
}
