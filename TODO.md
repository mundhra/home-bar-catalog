# TODO

Deferred features, not needed for current use. Nothing here is scheduled.

## Batch / party scaler
Scale a recipe for a group from the recipe view.
- Multipliers: 1×, 2×, 4×, and pitcher (8–12×).
- Batching tips for pre-mixed pitchers, e.g. add 15–20% water by volume when a batch is
  chilled in the fridge instead of shaken or stirred over ice per serve.
- The share-as-image card should be able to show the scaled amounts.
- Amounts are free text today (`"45 ml"`, `"Top (60 ml)"`), so scaling needs a parser for the
  number + unit, leaving non-numeric amounts ("Top", "2 dashes") unscaled or marked.
- Rough size: about half a day.

## ml ↔ oz display
Show amounts in US fluid ounces as an option (1 oz ≈ 29.57 ml; bar convention 30 ml).
- Same amount parser as the scaler; worth building together.
- A display preference only; recipes stay stored in ml.

## Accessibility pass
- Dialogs: keep keyboard focus inside while open, return focus to the trigger on close.
- Icon-only header buttons on phones rely on `title`/`aria-label`; check screen-reader output.
- Colour contrast check on muted text and badges.
- Rough size: a few hours.
