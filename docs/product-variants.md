# Product variants and dependent controls

A generated product card is a presentation proposal. It is not an authority for price, stock, or valid color/size combinations. The host should fetch those facts from its commerce system and validate them with `createQChatProductVariantCatalog` before passing them as `QChatConfig.productVariants`.

```ts
const variants = createQChatProductVariantCatalog({
  "suit-42": [
    { id: "navy-38", color: "navy", size: "38", price: { amount: 220, currency: "USD" }, available: true },
    { id: "navy-40", color: "navy", size: "40", price: { amount: 230, currency: "USD" }, available: true },
    { id: "charcoal-40", color: "charcoal", size: "40", price: { amount: 260, currency: "USD" }, available: true },
  ],
});
```

The browser derives the displayed price from the selected valid variant. Before a complete selection, it displays the cheapest matching available variant, prefixed with “From” when prices differ. Sizes without stock in the selected color are disabled. Changing color clears an incompatible size. Add to cart stays disabled until an available color/size combination is selected, and its action includes the specific `variantId`.

The agent may find and suggest a product, but it should not invent variant facts. A production server should hydrate the card from a trusted product service before rendering. On `product.add`, the server authorizer must re-check the variant ID, current price, inventory, user authorization, and any purchase policy; browser state is only a preview and can be stale or manipulated. The showcase uses a static mock catalog and mock authorizer to demonstrate the interaction, not a commerce backend.
