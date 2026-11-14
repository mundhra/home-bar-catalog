/*
 * Store: catalog validation, loading and persistence; catalog queries; stock & checklist state.
 * All catalog changes go through commitCatalog(). Untrusted data (data/catalog.js,
 * the saved edited copy, imports) is checked by validateCatalog() first.
 */

// =========================================================================
// CATALOG: VALIDATION, LOADING & PERSISTENCE
//    The shipped catalog comes from data/catalog.js. Any in-app edit saves a
//    full edited copy to localStorage, which then takes precedence. If the
//    edited copy ever matches the shipped one again it is dropped.
// =========================================================================
function normalizeItem(it) {
  const out = { id: it.id, name: str(it.name), kind: it.kind, category: str(it.category), profile: str(it.profile), notes: str(it.notes) };
  if (it.kind === "mixer" && it.staple === true) out.staple = true;
  return out;
}
function normalizeIngredient(ing) {
  let out;
  if (ing.item) {
    out = { item: ing.item };
    const note = str(ing.note);
    if (note) out.note = note;
    out.amount = str(ing.amount);
    const subs = [...new Set((Array.isArray(ing.substitutes) ? ing.substitutes : []).filter(s => s && s !== ing.item))];
    if (subs.length) out.substitutes = subs;
  } else {
    out = { name: str(ing.name), amount: str(ing.amount) };
  }
  if (ing.optional === true) out.optional = true;
  return out;
}
function normalizeRecipe(r) {
  const out = {
    id: r.id, name: str(r.name), type: r.type, vibe: r.vibe, glass: r.glass,
    method: str(r.method), ice: str(r.ice),
    colors: [r.colors[0].toLowerCase(), r.colors[1].toLowerCase()],
    garnishType: r.garnishType,
    ingredients: r.ingredients.map(normalizeIngredient),
    steps: r.steps.map(str).filter(Boolean),
    servingNotes: str(r.servingNotes)
  };
  if (str(r.source)) out.source = str(r.source).slice(0, 500); // credit/link, e.g. for library recipes
  return out;
}

// Validates untrusted catalog data (shipped file, saved copy or an import).
// Returns { catalog, errors }: catalog is normalized, or null when invalid.
function validateCatalog(raw) {
  const errors = [];
  const err = msg => { if (errors.length < 50) errors.push(msg); };
  if (!raw || typeof raw !== "object") return { catalog: null, errors: ["Not a catalog object."] };
  if (raw.schema !== CATALOG_SCHEMA) err(`Unsupported schema version "${raw.schema}" (expected ${CATALOG_SCHEMA}).`);
  if (!Array.isArray(raw.items)) err('Missing "items" list.');
  if (!Array.isArray(raw.recipes)) err('Missing "recipes" list.');
  if (errors.length) return { catalog: null, errors };

  const itemIds = new Set(), itemNames = new Set();
  raw.items.forEach((it, i) => {
    const where = `Item ${i + 1}${it && typeof it.name === "string" ? ` "${it.name}"` : ""}`;
    if (!it || typeof it !== "object") return err(`${where}: not an object.`);
    if (typeof it.id !== "string" || !ID_RE.test(it.id)) err(`${where}: id must be lowercase letters, digits and dashes.`);
    else if (itemIds.has(it.id)) err(`${where}: duplicate id "${it.id}".`);
    else itemIds.add(it.id);
    if (!str(it.name)) err(`${where}: name is required.`);
    else if (itemNames.has(str(it.name).toLowerCase())) err(`${where}: another item already has this name.`);
    else itemNames.add(str(it.name).toLowerCase());
    if (!Object.prototype.hasOwnProperty.call(ITEM_KINDS, it.kind)) err(`${where}: kind must be one of ${KIND_ORDER.join(", ")}.`);
    ["category", "profile", "notes"].forEach(f => { if (it[f] != null && typeof it[f] !== "string") err(`${where}: ${f} must be text.`); });
    if (it.staple != null && typeof it.staple !== "boolean") err(`${where}: staple must be true or false.`);
  });

  const recipeIds = new Set();
  raw.recipes.forEach((r, i) => {
    const where = `Recipe ${i + 1}${r && typeof r.name === "string" ? ` "${r.name}"` : ""}`;
    if (!r || typeof r !== "object") return err(`${where}: not an object.`);
    if (typeof r.id !== "string" || !ID_RE.test(r.id)) err(`${where}: id must be lowercase letters, digits and dashes.`);
    else if (recipeIds.has(r.id)) err(`${where}: duplicate id "${r.id}".`);
    else recipeIds.add(r.id);
    if (!str(r.name)) err(`${where}: name is required.`);
    if (!DRINK_TYPES.includes(r.type)) err(`${where}: type must be one of ${DRINK_TYPES.join(", ")}.`);
    if (!VIBES.includes(r.vibe)) err(`${where}: vibe must be one of ${VIBES.join(", ")}.`);
    if (!GLASSES.includes(r.glass)) err(`${where}: glass must be one of ${GLASSES.join(", ")}.`);
    if (!GARNISHES.includes(r.garnishType)) err(`${where}: garnishType must be one of ${GARNISHES.join(", ")}.`);
    if (!Array.isArray(r.colors) || r.colors.length !== 2 || !r.colors.every(c => typeof c === "string" && HEX_RE.test(c))) {
      err(`${where}: colors must be two #rrggbb values.`);
    }
    ["method", "ice", "servingNotes", "source"].forEach(f => { if (r[f] != null && typeof r[f] !== "string") err(`${where}: ${f} must be text.`); });
    if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) {
      err(`${where}: needs at least one ingredient.`);
    } else {
      r.ingredients.forEach((ing, j) => {
        const w = `${where}, ingredient ${j + 1}`;
        if (!ing || typeof ing !== "object") return err(`${w}: not an object.`);
        if (ing.item != null) {
          if (typeof ing.item !== "string" || !itemIds.has(ing.item)) err(`${w}: unknown inventory item "${ing.item}".`);
          if (ing.note != null && typeof ing.note !== "string") err(`${w}: note must be text.`);
          if (ing.substitutes != null && (!Array.isArray(ing.substitutes) || !ing.substitutes.every(s => typeof s === "string" && itemIds.has(s)))) {
            err(`${w}: substitutes must be inventory item ids.`);
          }
        } else if (!str(ing.name)) {
          err(`${w}: needs an inventory item or a name.`);
        } else if (ing.substitutes != null && ing.substitutes.length) {
          err(`${w}: substitutes need an inventory item.`);
        }
        if (ing.optional != null && typeof ing.optional !== "boolean") err(`${w}: optional must be true or false.`);
        if (!str(ing.amount)) err(`${w}: amount is required.`);
      });
    }
    if (!Array.isArray(r.steps) || !r.steps.every(s => typeof s === "string")) err(`${where}: steps must be a list of text.`);
    else if (!r.steps.some(s => str(s))) err(`${where}: needs at least one step.`);
  });

  if (errors.length) return { catalog: null, errors };
  return {
    catalog: {
      schema: CATALOG_SCHEMA,
      updated: str(raw.updated),
      items: raw.items.map(normalizeItem),
      recipes: raw.recipes.map(normalizeRecipe)
    },
    errors
  };
}

const EMPTY_CATALOG = { schema: CATALOG_SCHEMA, updated: "", items: [], recipes: [] };
let shippedCatalog = null;   // validated data/catalog.js, or null if missing/invalid
let shippedErrors = [];
let catalog = EMPTY_CATALOG; // what the app renders: shipped, or the edited copy
let usingLocalCopy = false;
let localBasedOn = "";       // shipped "updated" stamp the edited copy started from
let localLoadError = false;
let itemsById = new Map();

function contentKey(c) { return JSON.stringify({ items: c.items, recipes: c.recipes }); }

function setActiveCatalog(c, isLocal, basedOn) {
  catalog = c;
  usingLocalCopy = isLocal;
  localBasedOn = basedOn;
  itemsById = new Map(c.items.map(i => [i.id, i]));
}

function loadCatalog() {
  if (window.BAR_CATALOG) {
    const res = validateCatalog(window.BAR_CATALOG);
    shippedCatalog = res.catalog;
    shippedErrors = res.errors;
  } else {
    shippedErrors = ["data/catalog.js did not load (missing file or a syntax error)."];
  }

  const saved = readJSON(STORAGE_KEYS.catalog);
  if (saved && saved.catalog) {
    const res = validateCatalog(saved.catalog);
    if (res.catalog) {
      if (shippedCatalog && contentKey(res.catalog) === contentKey(shippedCatalog)) {
        removeKey(STORAGE_KEYS.catalog); // edits were published as the new shipped catalog
      } else {
        setActiveCatalog(res.catalog, true, str(saved.basedOn));
        return;
      }
    } else {
      // Keep the unreadable copy in storage untouched; it is only replaced on the next save.
      localLoadError = true;
      console.warn("Saved catalog copy is invalid and was ignored:", res.errors);
    }
  }
  setActiveCatalog(shippedCatalog || EMPTY_CATALOG, false, "");
}

// Single entry point for every catalog change (editors, import, reset).
function commitCatalog(next, message, { rebase = false } = {}) {
  const res = validateCatalog(next);
  if (!res.catalog) {
    console.warn("Catalog change rejected:", res.errors);
    showToast(res.errors[0], "error");
    return false;
  }
  const c = res.catalog;
  if (shippedCatalog && contentKey(c) === contentKey(shippedCatalog)) {
    removeKey(STORAGE_KEYS.catalog);
    setActiveCatalog(shippedCatalog, false, "");
  } else {
    const basedOn = (rebase || !usingLocalCopy) ? (shippedCatalog?.updated || "") : localBasedOn;
    writeJSON(STORAGE_KEYS.catalog, { basedOn, savedAt: new Date().toISOString(), catalog: c });
    setActiveCatalog(c, true, basedOn);
  }
  localLoadError = false;
  pruneOrphanState();
  refreshAllViews();
  if (message) showToast(message);
  return true;
}

function shippedChangedSinceEdit() {
  return usingLocalCopy && !!shippedCatalog && localBasedOn !== shippedCatalog.updated;
}

// =========================================================================
// CATALOG QUERIES
// =========================================================================
const isTracked = it => !!(it && ITEM_KINDS[it.kind] && ITEM_KINDS[it.kind].tracked);
const itemsOfKind = kind => catalog.items.filter(i => i.kind === kind);
const trackedItems = () => catalog.items.filter(isTracked);
const recipeById = id => catalog.recipes.find(r => r.id === id);

function ingredientLabel(ing) {
  const it = ing.item ? itemsById.get(ing.item) : null;
  if (!it) return ing.name || "Unknown ingredient";
  return ing.note ? `${it.name} (${ing.note})` : it.name;
}
// Inventory items that can fill an ingredient: the item itself, then its substitutes.
function ingredientCandidates(ing) {
  if (!ing.item) return [];
  return [ing.item, ...(ing.substitutes || [])].map(id => itemsById.get(id)).filter(Boolean);
}
// The item you'd actually pour: the first one available, else the listed one.
function chosenCandidate(ing) {
  const cands = ingredientCandidates(ing);
  return cands.find(isItemAvailable) || cands[0] || null;
}
// "or Fresh Lemon Juice · optional" — shown under an ingredient in the recipe view and card.
function ingredientExtrasText(ing) {
  const parts = [];
  const subs = ingredientCandidates(ing).slice(1);
  if (subs.length) parts.push(`or ${subs.map(s => s.name).join(" / ")}`);
  if (ing.optional) parts.push("optional");
  return parts.join(" · ");
}
// Bar-Ready = needs nothing but stock-tracked bottles and "always on hand" mixers
// (a substitute counts; optional ingredients are ignored).
function isBarReady(r) {
  return r.ingredients.every(ing =>
    ing.optional === true || ingredientCandidates(ing).some(it => isTracked(it) || it.staple === true));
}
function recipesUsingItem(id) {
  return catalog.recipes.filter(r => r.ingredients.some(i => i.item === id));
}
// Includes recipes that only list the item as a substitute (deleting it would break them).
function recipesReferencingItem(id) {
  return catalog.recipes.filter(r => r.ingredients.some(i => i.item === id || (i.substitutes || []).includes(id)));
}

// =========================================================================
// STOCK STATUSES & MIXERS ON HAND (per browser)
// =========================================================================
let stockStatuses = {};             // itemId -> "low" | "out" (absent = in stock)
let mixerOnHand = {};               // mixerId -> true | false (absent = default: staples on hand)
let currentTypeFilter = "ALL";
let currentVibeFilter = "ALL";
let selectedIngredients = new Set(); // item ids
let multiMatchMode = "ANY";          // "ANY" (OR) | "ALL" (AND)

function sanitizeStock(obj) {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  Object.entries(obj).forEach(([id, st]) => {
    if (isTracked(itemsById.get(id)) && (st === "low" || st === "out")) out[id] = st;
  });
  return out;
}

function loadStockStatuses() {
  const current = readJSON(STORAGE_KEYS.stock);
  if (current && typeof current === "object") return sanitizeStock(current);
  // One-time migration from v1, which keyed statuses by item name.
  const legacy = readJSON(STORAGE_KEYS.legacyStock);
  if (legacy && typeof legacy === "object") {
    const idByName = new Map(catalog.items.map(i => [i.name.toLowerCase(), i.id]));
    const migrated = {};
    Object.entries(legacy).forEach(([name, st]) => {
      const id = idByName.get(String(name).toLowerCase());
      if (id) migrated[id] = st;
    });
    const clean = sanitizeStock(migrated);
    writeJSON(STORAGE_KEYS.stock, clean);
    return clean;
  }
  return {};
}
function saveStockStatuses() { writeJSON(STORAGE_KEYS.stock, stockStatuses); }

function sanitizeOnHand(obj) {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  Object.entries(obj).forEach(([id, v]) => {
    if (itemsById.get(id)?.kind === "mixer" && typeof v === "boolean") out[id] = v;
  });
  return out;
}

function loadMixerOnHand() {
  const current = readJSON(STORAGE_KEYS.onHand);
  if (current && typeof current === "object") return sanitizeOnHand(current);
  // One-time migration: ticks on the old restock checklist meant "got it".
  const ticked = readJSON(STORAGE_KEYS.legacyShopping);
  if (Array.isArray(ticked)) {
    const migrated = sanitizeOnHand(Object.fromEntries(ticked.map(id => [id, true])));
    writeJSON(STORAGE_KEYS.onHand, migrated);
    return migrated;
  }
  return {};
}
function saveMixerOnHand() { writeJSON(STORAGE_KEYS.onHand, mixerOnHand); }

function isOnHand(id) {
  const it = itemsById.get(id);
  if (!it || it.kind !== "mixer") return false;
  return id in mixerOnHand ? mixerOnHand[id] : it.staple === true;
}

function setOnHand(id, value) {
  if (itemsById.get(id)?.kind !== "mixer") return;
  mixerOnHand[id] = !!value;
  saveMixerOnHand();
  refreshAllViews();
}

function resetMixersToDefaults() {
  mixerOnHand = {};
  saveMixerOnHand();
  refreshAllViews();
}

// Drop state that points at items which no longer exist or are no longer tracked.
function pruneOrphanState() {
  const cleanStock = sanitizeStock(stockStatuses);
  if (JSON.stringify(cleanStock) !== JSON.stringify(stockStatuses)) {
    stockStatuses = cleanStock;
    saveStockStatuses();
  }
  const cleanOnHand = sanitizeOnHand(mixerOnHand);
  if (JSON.stringify(cleanOnHand) !== JSON.stringify(mixerOnHand)) {
    mixerOnHand = cleanOnHand;
    saveMixerOnHand();
  }
  selectedIngredients = new Set([...selectedIngredients].filter(id => itemsById.has(id)));
}

function getItemStockStatus(id) { return stockStatuses[id] || "in"; }

function setItemStockStatus(id, status) {
  if (!isTracked(itemsById.get(id))) return;
  if (status === "in") delete stockStatuses[id];
  else stockStatuses[id] = status;
  saveStockStatuses();
  refreshAllViews();
}

function resetAllStockStatuses() {
  stockStatuses = {};
  saveStockStatuses();
  refreshAllViews();
}

function getRecipeStockAnalysis(recipe) {
  const lowItems = [], outItems = [];
  recipe.ingredients.forEach(ing => {
    if (ing.optional) return;
    const it = ing.item && itemsById.get(ing.item);
    if (!isTracked(it)) return; // on-demand mixers aren't stock-tracked
    const st = getItemStockStatus(it.id);
    if (st === "out") {
      const covered = ingredientCandidates(ing).slice(1).some(isItemAvailable); // a substitute saves the drink
      if (!covered && !outItems.includes(it.name)) outItems.push(it.name);
    } else if (st === "low" && !lowItems.includes(it.name)) {
      lowItems.push(it.name);
    }
  });
  return { lowItems, outItems };
}

// =========================================================================
// WHAT CAN I MAKE TONIGHT?
//   A tracked bottle/syrup is available unless marked Out (Low still counts).
//   A mixer is available when it's on hand. An ingredient is covered if its item
//   or any of its substitutes is available; optional ingredients never block.
//   Untracked extras (no inventory item, e.g. egg white) are assumed available.
// =========================================================================
function isItemAvailable(it) {
  if (!it) return true;
  return isTracked(it) ? getItemStockStatus(it.id) !== "out" : isOnHand(it.id);
}

// Distinct inventory items this recipe needs but you don't have right now.
function missingItems(recipe) {
  const missing = [];
  recipe.ingredients.forEach(ing => {
    if (ing.optional) return;
    const cands = ingredientCandidates(ing);
    if (cands.length && !cands.some(isItemAvailable) && !missing.includes(cands[0])) missing.push(cands[0]);
  });
  return missing;
}

function canMakeNow(recipe) { return missingItems(recipe).length === 0; }

// For every item that is the *only* thing missing from some drink: how many
// drinks getting it would unlock. Sorted by impact.
function unlockSuggestions() {
  const counts = new Map();
  catalog.recipes.forEach(r => {
    const missing = missingItems(r);
    if (missing.length === 1) counts.set(missing[0], (counts.get(missing[0]) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([item, unlocks]) => ({ item, unlocks }))
    .sort((a, b) => b.unlocks - a.unlocks || a.item.name.localeCompare(b.item.name));
}

// Mark an item as available: restock a tracked item, or put a mixer on hand.
function markAvailable(id) {
  const it = itemsById.get(id);
  if (!it) return;
  if (isTracked(it)) setItemStockStatus(id, "in");
  else setOnHand(id, true);
}

// =========================================================================
// FAVOURITES & RATINGS (per browser; included in backups)
// =========================================================================
let recipePrefs = {}; // recipeId -> { fav: true, stars: 1..5 }

function sanitizePrefs(obj) {
  const out = {};
  if (!obj || typeof obj !== "object") return out;
  Object.entries(obj).forEach(([id, p]) => {
    if (!ID_RE.test(id) || !p || typeof p !== "object") return;
    const e = {};
    if (p.fav === true) e.fav = true;
    if (Number.isInteger(p.stars) && p.stars >= 1 && p.stars <= 5) e.stars = p.stars;
    if (Object.keys(e).length) out[id] = e;
  });
  return out;
}
function loadPrefs() { return sanitizePrefs(readJSON(STORAGE_KEYS.ratings)); }
function savePrefs() { writeJSON(STORAGE_KEYS.ratings, recipePrefs); }

const isFavourite = id => !!(recipePrefs[id] && recipePrefs[id].fav);
const ratingOf = id => (recipePrefs[id] && recipePrefs[id].stars) || 0;

function updatePref(id, change) {
  const e = { ...(recipePrefs[id] || {}), ...change };
  if (!e.fav) delete e.fav;
  if (!e.stars) delete e.stars;
  if (Object.keys(e).length) recipePrefs[id] = e; else delete recipePrefs[id];
  savePrefs();
  renderRecipes();
  if (isModalOpen("recipeModal") && openRecipeId === id) openRecipeModal(id);
}

function toggleFavourite(id, event) {
  if (event) event.stopPropagation(); // the heart sits on a clickable tile
  updatePref(id, { fav: !isFavourite(id) });
}

// Tapping the current rating again clears it.
function setRating(id, stars) {
  updatePref(id, { stars: ratingOf(id) === stars ? 0 : stars });
}

