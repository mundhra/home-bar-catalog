# Bar Assistant → Private Reserve: feature analysis

Sources: Bar Assistant server README and Salt Rim (web client) README on GitHub, and the
`bar-assistant/data` recipe repository (format, methods, calculators). Checked 2026-11-15.

## What Bar Assistant is
- **Server** (PHP/Laravel API, MIT, ~1,100★, actively maintained) + **Salt Rim** web client
  (Vue 3, MIT, installable as a PWA). Needs Docker, Redis and Meilisearch to self-host.
- **Recipe data** (`bar-assistant/data`): 500+ recipes, 250+ base ingredients, **MIT licensed**.
  Images carry their own per-image copyright credits, so they can't be reused freely.
- Recipe format includes: ingredients with numeric `amount` + `units`, `optional`,
  `amount_max`, `note`, **substitutes**; `abv`; `method` (each method has a dilution %:
  Shake 25, Stir 20, Build 10, Blend 25, Muddle 10, Layer 0); `garnish`; `tags`; `glass`;
  `utensils`; `parent_cocktail_id` (variations); `source`; `year`; `author`.

## Constraint for us
Static files on GitHub Pages, works offline on the phone, no server. So anything needing
accounts, a database, a search server or server-side fetching is out. Personal data
(favourites, notes, ratings) lives in the phone's storage and travels via Export/Import,
like stock levels do today.

## Already covered by our app
| Bar Assistant | Ours |
|---|---|
| Inventory, filter by "have the ingredients" | Stock + mixers on hand, Can make now, One ingredient away |
| Shopping list from missing ingredients | Buy-one-thing-unlock-more ranking (goes further) |
| Custom recipes, glass types, methods | Recipe builder, glasses, techniques |
| Printing, sharing | Print menu, Share as Image |
| Data export | JSON backup + catalog.js |
| PWA | Installed, offline, auto-updating |
| Instant search and filters | Search, category, vibe, ingredient AND/OR |

## Already parked in TODO.md (not re-proposed)
Batch scaling, unit switching (ml/oz). Both exist in Bar Assistant.

## Not feasible on GitHub Pages
Multiple bars/users/roles, SSO, API tokens, Meilisearch, metrics, server-side URL recipe
scraping (blocked by browser CORS), AI generation, cross-device live sync.

## Candidates we can add

Ranked by value for one person making drinks at home and hosting parties.

| # | Feature | What it does here | Effort |
|---|---|---|---|
| 1 | **Substitutes & optional ingredients** | "Ginger beer *or* ginger ale", "Vodka *or* white rum"; optional items (e.g. a garnish syrup) don't block *Can make now*. More drinks become makeable with no shopping. | ½–1 day |
| 2 | **Party menu + QR code** | Pick drinks into a named menu ("Saturday party"). A guest link (`…/#menu=…`) opens a clean read-only menu: no stock, no editing. Print it or show a QR code guests scan. | 1 day |
| 3 | **Favourites & ratings** | Heart and 1–5 stars per drink; *Favourites* filter; sort by rating. Included in backups. | 2–4 h |
| 4 | **Recipe library from Bar Assistant data** | Import their MIT recipes, mapped to your inventory. Ship only the ones your bar can (nearly) make as an optional "Discover" section; one tap adds a recipe to your catalog. No images (copyright). Credit + licence notice included. | 1–2 days |
| 5 | **Personal notes** | Your own note per drink ("half the grenadine"). Shown in the recipe view; included in backups. | 1–2 h |
| 6 | **Deep links** | `…/#recipe=shirley-temple` opens that drink directly; *Copy link* next to Share. Works for drinks in the published catalog. | 1–2 h |
| 7 | **Tags** | Short tags beyond the four vibes (Sour, Spritz, Highball, Tiki, Summer, Party…) with a tag filter. Seed from recipe data; editable. | ½ day |
| 8 | **"I made this" + stats** | Count each time you make a drink; *Most made*, *Never tried*, favourite base spirit. Feeds #9. | ½ day |
| 9 | **Recommendations** | "You might like": drinks sharing ingredients/vibe/tags with your favourites and most-made, preferring ones you can make now. | ½ day (after #3/#8) |
| 10 | **Estimated ABV** | Item ABV + amounts + method dilution → "≈ 14% ABV"; a strength filter. Needs the amount parser parked with the scaler in TODO.md, so it's best done together with that. | ½–1 day |
| 11 | **Variations** | Link a recipe to its parent ("Variation of: Paloma"); show variations in the recipe view. | 2–4 h |
| 12 | **Recipe photos** | Attach your own photo to a drink, kept in the phone's storage (IndexedDB), not uploaded or synced. Large backups if included. | ½ day |
| 13 | **Bar calculators** | Simple-syrup ratios, batch dilution helper; static widgets. | 2–4 h |
| 14 | **Cost per drink** | Bottle price + size → cost per pour/drink. Also needs the amount parser. | ½ day |

## Recommendation
Do **1 → 2 → 3** first: substitutes make *Can make now* smarter today, the party menu
fits how the app gets used socially, and favourites are cheap and feed later ideas.
**4** is the biggest jump in content but the most work (ingredient mapping); worth it if
you want more recipes without writing them. 10 and 14 should wait for the amount parser.
