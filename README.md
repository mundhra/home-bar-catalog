# 🍸 The Private Reserve — Home Bar Cocktail & Mocktail Catalog

A single-file web app that catalogs a personal home bar and serves **57 recipes** built around it: cocktails, zero-proof mocktails and low-ABV wine drinks. It includes SVG glassware illustrations, per-bottle stock tracking and a restock checklist.

🔗 **Live app (GitHub Pages):** <https://mundhra.github.io/home-bar-catalog/>

---

## ✨ Features

* **57 recipes:** 41 cocktails, 10 mocktails (8 of them kombucha-based) and 6 wine & low-ABV drinks. Every recipe is built on the stocked bottles and syrups below, plus common mixers where noted.
* **Glassware & garnish illustrations:** each drink gets an inline SVG of its glass (Highball, Rocks, Coupe, Martini, Copa Balloon, Hurricane, Champagne Flute) showing the drink colour, ice and garnish. The **Glassware & Garnish Guide** tab explains when to use each glass.
* **Filtering:**
  * **Search** by drink name, flavour, glass, notes or ingredient.
  * **Ingredient multi-select:** pick any mix of spirits, wines, kombucha, syrups, juices and mixers, then match **Any (OR)** or **All (AND)**. Selected ingredients show as removable chips.
  * **Category** (*Cocktail*, *Mocktail*, *Wine & Low-ABV*) and **Flavour Vibe** (*Refreshing & Crisp*, *Tropical & Fruity*, *Rich & Dessert*, *Herbal & Bold*).
  * **Readiness:** *Can Make Now*, *One Ingredient Away*, *Bar-Ready* (needs only bottles, syrups and staple mixers) or *Needs Fresh Mixers*.
* **Stock manager:** mark each of the 23 bar items **In Stock**, **Low** or **Out**, from the header drawer or the Inventory tab. Statuses are saved in the browser's `localStorage`. Two toggles act on them: *Hide Out-of-Stock Drinks* and *Use Up Low-Stock Items*.
* **What can I make tonight?** Every card says *✓ Can make now*, *Need: Fresh Lime Juice* or *Missing 2*, based on your stock levels and the mixers you have on hand. The line above the grid shows how many drinks you can make now and how many are one ingredient away; tap either to filter.
* **Shopping & mixers on hand:** tick the mixers and juices in the fridge (staples like soda and tonic start ticked). The dialog ranks the single items that would unlock the most drinks ("Fresh Lime Juice: unlocks 10 drinks") with a *Got it* button, and lists bottles marked Low or Out.
* **Edit in the app:** add, edit, duplicate and delete recipes and inventory items, with export/import backups to move between devices. See *Editing Recipes & Inventory*.
* **Print / PDF:** print styles render a clean, light menu (`Ctrl+P` → *Save as PDF*).

---

## 🍾 Bar Inventory (23 tracked items)

### Syrups (12)
* **Fruity & tart:** Watermelon, Passion Fruit, Green Apple, Strawberry, Grenadine
* **Herbal & refreshing:** Mint Mojito
* **Citrus:** Cacao Blue (Blue Curaçao), Triple Sec Cacao
* **Rich, nutty & dessert:** Vanilla, Cheesecake, Hazelnut, Coconut

### Spirits, liqueurs & wines (10)
* **Base spirits:** Whisky, Vodka, Tequila, Dark Rum, Grappa
* **Flavoured spirits:** Coffee Gin
* **Liqueurs:** Jägermeister, Baileys
* **Wines:** Red Wine, White Wine

### Fermented / zero-proof base (1)
* **Kombucha** *(Ginger, Berry, Citrus, Original)*

### On-demand staples (not stock-tracked)
Club soda, tonic water, ginger ale/beer, cola, fresh limes and lemons, orange, pineapple and cranberry juice, milk/cream, and espresso/cold brew. Mark them on hand or not in the Shopping dialog or on the Inventory tab. Soda, tonic, ginger ale/beer and cola are *staples*: on hand unless you untick them.

---

## 🚀 Hosting & Access

### GitHub Pages
1. Keep `index.html` at the repository root (it already is).
2. Go to **Settings → Pages**, set **Source** to **Deploy from a branch**, choose **`main`** and **`/ (root)`**, then **Save**.
3. Every push to `main` goes live in about a minute.

### iPhone home-screen shortcut
1. Open the live URL in **Safari**.
2. Tap **Share** (`□↑`), then **Add to Home Screen**.

### Running locally
Open `index.html` directly in a browser. No build step and no server needed.

---

## 🛠️ Tech Stack

* **HTML5 + vanilla JavaScript**, no build step and no backend.
* **Tailwind CSS** via the Play CDN (`cdn.tailwindcss.com`) and **Google Fonts** (Cormorant Garamond, Inter).
* **Inline SVG** for glassware and garnishes.
* **`data/catalog.js`** holds all inventory items and recipes (see below).
* **`localStorage`** (per browser): `private_reserve_stock_v2` (stock levels by item id; v1 name-keyed data migrates automatically), `private_reserve_onhand_v1` (which mixers are on hand; old `private_reserve_shopping_v1` checklist ticks migrate automatically) and `private_reserve_catalog_v1` (your edited copy of the catalog, if any).

> ⚠️ **Needs a network connection.** Styling comes from the Tailwind CDN at runtime, so without internet the page loads unstyled. It does not work offline yet, even when launched from the home screen.

### Project layout

```
index.html          page markup only; loads the scripts below in order
data/catalog.js     inventory items + recipes (strict JSON, see below)
js/core.js          constants, enums, storage keys, small helpers
js/glassware.js     glassware guide content + SVG glass/garnish renderer
js/store.js         catalog validation, loading, saving; stock & checklist state
js/render.js        drink grid, inventory, stock drawer, checklist, filter chips
js/ui.js            tabs, filters, recipe modal, dialogs
js/editors.js       recipe builder + inventory item editor
js/data-panel.js    export / import / download catalog.js / reset
js/main.js          key handling and start-up (loaded last)
tests/              smoke tests (see Testing)
```

These are plain scripts, not ES modules: browsers block modules on `file://`, and this keeps "open `index.html` directly" working. They share one global scope, so **a name declared in two files breaks the page**. The tests check for that.

---

## ✅ Testing

```
python tests/run.py               # everything
python tests/run.py main          # one scenario: main | legacy | stale | same | broken
```

Needs Python 3.8+ and Chrome, Chromium or Edge (set `CHROME=/path/to/browser` if it isn't found). No packages to install.

* **Static checks:** pasted `... existing code ...` placeholders, the same function or variable declared twice across `js/`, `<script src>` files that don't exist, and a `data/catalog.js` that isn't valid.
* **Browser scenarios** in headless Chrome, each with empty storage: rendering, filters, Bar-Ready, stock and checklist saving, the recipe and item editors, HTML escaping, export/import/download, migration of old stock data, and stale or broken catalogs.
* Expected values are computed from `data/catalog.js`, so the tests keep passing as you add or change recipes.
* GitHub Actions runs the same command on every push and pull request (`.github/workflows/tests.yml`). Check it's green before relying on a deploy.

---

## 🧩 Editing Recipes & Inventory

### In the app
* **+ Add Recipe** (above the drink grid) opens the recipe builder: glass, garnish and colours with a live preview; ingredients picked from your inventory (or "Other" for untracked extras); one step per line.
* Open any drink for **Edit Recipe**, **Duplicate** or **Delete**.
* On the **Inventory** tab, each section has **+ Add** and every item has **Edit**. Renaming an item never breaks recipes or stock, because both refer to it by id. An item used by recipes can't be deleted (mark it Out instead).
* Edits are saved as an **edited copy in this browser**; the header's **Catalog Data** button shows a dot when one is active.

### Catalog Data (header button)
| Action | What it does |
|---|---|
| Export backup | Downloads a `.json` with recipes, inventory, stock levels and checklist. |
| Import backup | Loads a backup `.json` (or a `catalog.js`) after validation and confirmation. This is how you move edits between phone and laptop. |
| Download catalog.js | Turns your edits into the shipped default: replace `data/catalog.js` in the repo and push. Every device then gets it, and browsers whose edited copy matches it drop that copy automatically. |
| Reset to shipped catalog | Discards this browser's edited copy. |

If the shipped catalog changes after you've started editing, the app warns you and lets you keep your copy or switch.

### File format: `data/catalog.js`
`window.BAR_CATALOG = { ... };` where the object is strict JSON:

```js
{
  "schema": 1,
  "updated": "2026-11-14",
  "items": [
    { "id": "vodka", "name": "Vodka", "kind": "spirit", "category": "Base Spirit",
      "profile": "Clean, crisp, neutral", "notes": "..." },
    { "id": "soda", "name": "Club Soda", "kind": "mixer", "category": "Carbonated Staple",
      "profile": "", "notes": "", "staple": true }
  ],
  "recipes": [
    {
      "id": "watermelon-mint-cooler",
      "name": "Emerald Watermelon Cooler",
      "type": "Mocktail",                 // Cocktail | Mocktail | Wine & Low-ABV
      "vibe": "Refreshing & Crisp",       // Refreshing & Crisp | Tropical & Fruity | Rich & Dessert | Herbal & Bold
      "glass": "Highball",                // Highball | Rocks | Coupe | Martini | Copa | Hurricane | Flute
      "method": "Build & Stir",
      "ice": "Cubed Ice (Full Column)",
      "colors": ["#fb7185", "#e11d48"],   // SVG gradient, #rrggbb
      "garnishType": "mint-lime",         // none | citrus-wheel | mint-lime | orange-twist | berry-rim | umbrella-straw
      "ingredients": [
        { "item": "watermelon-syrup", "amount": "20 ml" },
        { "item": "kombucha", "note": "Original or Ginger", "amount": "120 ml" },
        { "name": "Egg white", "amount": "1" }          // untracked extra, no item
      ],
      "steps": ["..."],
      "servingNotes": "..."
    }
  ]
}
```
(Comments above are for explanation only; the real file has none.)

* **`kind`** decides tracking: `syrup`, `spirit` and `base` are stock-tracked; `mixer` items are marked on hand or not. `"staple": true` makes a mixer on hand by default.
* **Bar-Ready is derived:** a drink is Bar-Ready when every ingredient is a tracked item or a staple mixer.
* **Can make now** is worked out live: every tracked item it uses isn't marked Out (Low still counts), every mixer is on hand, and untracked extras (no `item`, e.g. egg white) are assumed available.
* The app validates the file on load (ids, references, enums, colours). Problems are listed under Catalog Data rather than breaking the page. Editing in the app and using **Download catalog.js** avoids hand-editing JSON altogether.

---

## 📌 Known Limitations

* Stock levels, mixers on hand and edited copies live in one browser's `localStorage`; use Export/Import or publish `catalog.js` to move them.
* Untracked extras (egg white, bitters…) never block *Can make now*; add them to the inventory if you want them tracked.
