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
  * **Readiness:** *Bar-Ready Now* lists drinks that need nothing beyond stocked items and basic soda/tonic (no juice, citrus or dairy).
* **Stock manager:** mark each of the 23 bar items **In Stock**, **Low** or **Out**, from the header drawer or the Inventory tab. Statuses are saved in the browser's `localStorage`. Two toggles act on them: *Hide Out-of-Stock Drinks* and *Use Up Low-Stock Items*.
* **Order & restock list:** a tick-off checklist of on-demand mixers and juices, plus automatic alerts for any bar item marked Low or Out.
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
Club soda, tonic water, ginger ale/beer, cola, fresh limes and lemons, orange, pineapple and cranberry juice, milk/cream, and espresso/cold brew. These appear on the restock checklist and in the ingredient filter.

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

* **HTML5 + vanilla JavaScript** in one file, with no build step and no backend.
* **Tailwind CSS** via the Play CDN (`cdn.tailwindcss.com`) and **Google Fonts** (Cormorant Garamond, Inter).
* **Inline SVG** for glassware and garnishes.
* **`localStorage`** for stock statuses (key `private_reserve_stock_v1`).

> ⚠️ **Needs a network connection.** Styling comes from the Tailwind CDN at runtime, so without internet the page loads unstyled. It does not work offline yet, even when launched from the home screen.

---

## 🧩 Editing Recipes & Inventory

All data sits in the `<script>` block near the bottom of `index.html`:

| Constant | Holds |
|---|---|
| `SYRUPS_DATA`, `SPIRITS_DATA` | Stock-tracked bar items (name, profile, notes) |
| `ON_DEMAND_ITEMS` | Mixers and juices on the restock checklist |
| `GLASSWARE_GUIDE` | Glassware tab content |
| `RECIPES` | Every drink |
| `FILTER_GROUPS` | Chips shown in the ingredient multi-select panel |

### Recipe shape

```js
{
  id: "watermelon-mint-cooler",          // unique, used for modal and SVG ids
  name: "Emerald Watermelon Cooler",
  type: "Mocktail",                      // "Cocktail" | "Mocktail" | "Wine & Low-ABV"
  vibe: "Refreshing & Crisp",            // one of the four vibes
  glass: "Highball",                     // Highball | Rocks | Coupe | Martini | Copa | Hurricane | Flute
  method: "Build & Stir",
  ice: "Cubed Ice (Full Column)",
  colors: ["#fb7185", "#e11d48"],        // gradient for the SVG
  garnishType: "mint-lime",
  readyNow: false,                       // true only if no juice/citrus/dairy is needed
  tags: ["Watermelon Syrup", "Mint Mojito Syrup", "Kombucha"],
  ingredients: [
    { name: "Watermelon Syrup", amount: "20 ml", stocked: true },   // stocked: true → stock-tracked
    { name: "Fresh Lime Juice", amount: "15 ml", stocked: false }
  ],
  steps: ["..."],
  servingNotes: "..."
}
```

### Rules that are easy to break

* **Ingredient names drive stock and filters by substring match.** A `stocked: true` ingredient must *contain* a catalog item's exact name to be tracked. For example, `"Kombucha (Citrus or Ginger)"` contains `Kombucha`. Filter chips match against `tags` and ingredient names the same way.
* **Adding a bottle or syrup** means editing `SYRUPS_DATA`/`SPIRITS_DATA` *and* `FILTER_GROUPS`, and updating the hard-coded counts in the markup ("23 Items", "Syrups (12)", "All 23 …", "Reset All 23 Items").
* **`readyNow` is a hand-set flag.** It is not computed from ingredients or stock, so keep it consistent with the recipe.
* **Edit the file whole.** Never paste an AI-generated partial file with `// ... existing code ...` placeholders. Commit `2798987` did this. It deleted most of the app's JavaScript and the live page rendered nothing until the code was restored. After any edit, open the page and check that the recipe grid renders and the browser console shows no errors.

---

## 📌 Known Limitations

* Stock statuses live in one browser's `localStorage`, so phone and laptop do not share state, and clearing site data resets them.
* Restock checklist ticks are not saved and reset on reload.
* "Bar-Ready" is static. It ignores whether you actually have soda or tonic in, and ignores stock statuses.
