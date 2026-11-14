# 🍸 The Private Reserve — Home Bar Cocktail & Mocktail Catalog

An interactive, single-file web application designed to catalog your personal home bar inventory and generate **48 curated cocktail, wine/low-ABV, and zero-proof kombucha mocktail recipes**—complete with custom glassware illustrations, live stock tracking, and an on-demand mixer checklist.

🔗 **Live App (GitHub Pages):** `https://mundhra.github.io/home-bar-catalog/`

---

## ✨ Key Features

* **48 Curated Recipes:** Spans classic cocktails, zero-proof kombucha mocktails, and low-ABV wine spritzes—every single recipe is built exclusively around your stocked bottles and syrups.
* **Custom Glassware & Garnish Illustrations:** Visual SVG diagrams for each drink showing the exact glass style (*Highball, Rocks, Coupe, Martini, Copa Balloon, Hurricane, Champagne Flute*), ice prep, color gradient, and garnish placement.
* **Smart Menu Filtering:**
  * Filter by **Category** (*Cocktails*, *Mocktails*, *Wine & Low-ABV*) or **Flavor Vibe** (*Refreshing & Crisp*, *Tropical & Fruity*, *Rich & Dessert*, *Herbal & Bold*).
  * Filter by any specific **Spirit, Wine, Kombucha, or Syrup**.
  * Toggle **Bar-Ready** mode to see drinks that require zero extra juices or fresh citrus.
* **Persistent Stock Manager:** Mark any bottle or syrup as **In Stock**, **Low Stock**, or **Out of Stock** (saved automatically in browser `localStorage`). Includes quick toggles to hide out-of-stock drinks or prioritize low-stock ingredients.
* **On-Demand Order & Restock Checklist:** Tracks standard mixers/juices (club soda, tonic, citrus, juices) alongside automatic restock alerts for low/empty bar items.
* **Print / PDF Menu Export:** Built-in print styling so you can export a clean, guest-friendly bar menu PDF anytime.

---

## 🍾 Logged Bar Inventory (23 Items)

### 1. Syrups (12)
* **Fruity & Tart:** Watermelon, Passion Fruit, Green Apple, Strawberry, Grenadine
* **Herbal & Refreshing:** Mint Mojito
* **Citrus:** Cacao Blue (Blue Curaçao), Triple Sec Cacao
* **Rich, Nutty & Dessert:** Vanilla, Cheesecake Syrup, Hazelnut, Coconut

### 2. Spirits, Liqueurs & Wines (10)
* **Base Spirits:** Whisky, Vodka, Tequila, Dark Rum, Grappa
* **Flavored Spirits:** Coffee Gin
* **Liqueurs:** Jägermeister, Baileys
* **Wines:** Red Wine, White Wine

### 3. Fermented / Zero-Proof Base (1)
* **Kombucha** *(Assorted flavors: Ginger, Berry, Citrus, Original)*

### 4. On-Demand Staples
* Club soda, tonic water, ginger ale/beer, cola, fresh limes/lemons, pineapple juice, orange juice, cranberry juice, milk/cream, and espresso/cold brew.

---

## 🚀 Setup & Multi-Device Access

### Hosting on GitHub Pages
1. Upload `bar_catalog.html` to the root of this repository and rename it to **`index.html`**.
2. Navigate to **Settings → Pages** in GitHub.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, select **`main`** and **`/ (root)`**, and click **Save**.
4. Your app will be live within ~60 seconds at `https://mundhra.github.io/home-bar-catalog/`.

### Install on iPhone (App-Style Shortcut)
1. Open `https://mundhra.github.io/home-bar-catalog/` in **Safari** on your iPhone.
2. Tap the **Share** button (`□↑`) at the bottom of the screen.
3. Select **Add to Home Screen** to launch the catalog full-screen like a native app.

---

## 🛠️ Tech Stack
* **HTML5 & Vanilla JavaScript** (Zero build step, zero backend dependencies, works offline)
* **Tailwind CSS** (via CDN)
* **Custom Inline SVGs** for glassware & garnish diagrams