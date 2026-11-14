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
  if (ing.item) {
    const out = { item: ing.item };
    const note = str(ing.note);
    if (note) out.note = note;
    out.amount = str(ing.amount);
    return out;
  }
  return { name: str(ing.name), amount: str(ing.amount) };
}
function normalizeRecipe(r) {
  return {
    id: r.id, name: str(r.name), type: r.type, vibe: r.vibe, glass: r.glass,
    method: str(r.method), ice: str(r.ice),
    colors: [r.colors[0].toLowerCase(), r.colors[1].toLowerCase()],
    garnishType: r.garnishType,
    ingredients: r.ingredients.map(normalizeIngredient),
    steps: r.steps.map(str).filter(Boolean),
    servingNotes: str(r.servingNotes)
  };
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
    ["method", "ice", "servingNotes"].forEach(f => { if (r[f] != null && typeof r[f] !== "string") err(`${where}: ${f} must be text.`); });
    if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) {
      err(`${where}: needs at least one ingredient.`);
    } else {
      r.ingredients.forEach((ing, j) => {
        const w = `${where}, ingredient ${j + 1}`;
        if (!ing || typeof ing !== "object") return err(`${w}: not an object.`);
        if (ing.item != null) {
          if (typeof ing.item !== "string" || !itemIds.has(ing.item)) err(`${w}: unknown inventory item "${ing.item}".`);
          if (ing.note != null && typeof ing.note !== "string") err(`${w}: note must be text.`);
        } else if (!str(ing.name)) {
          err(`${w}: needs an inventory item or a name.`);
        }
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
// Bar-Ready = needs nothing but stock-tracked bottles and "always on hand" mixers.
function isBarReady(r) {
  return r.ingredients.every(ing => {
    const it = ing.item && itemsById.get(ing.item);
    return !!it && (isTracked(it) || it.staple === true);
  });
}
function recipesUsingItem(id) {
  return catalog.recipes.filter(r => r.ingredients.some(i => i.item === id));
}

// =========================================================================
// STOCK STATUSES & RESTOCK CHECKLIST (per browser)
// =========================================================================
let stockStatuses = {};             // itemId -> "low" | "out" (absent = in stock)
let checkedShoppingItems = new Set();
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

function loadShoppingChecklist() {
  const arr = readJSON(STORAGE_KEYS.shopping);
  return new Set(Array.isArray(arr) ? arr.filter(id => itemsById.get(id)?.kind === "mixer") : []);
}
function saveShoppingChecklist() { writeJSON(STORAGE_KEYS.shopping, [...checkedShoppingItems]); }

// Drop state that points at items which no longer exist or are no longer tracked.
function pruneOrphanState() {
  const cleanStock = sanitizeStock(stockStatuses);
  if (JSON.stringify(cleanStock) !== JSON.stringify(stockStatuses)) {
    stockStatuses = cleanStock;
    saveStockStatuses();
  }
  const cleanShopping = new Set([...checkedShoppingItems].filter(id => itemsById.get(id)?.kind === "mixer"));
  if (cleanShopping.size !== checkedShoppingItems.size) {
    checkedShoppingItems = cleanShopping;
    saveShoppingChecklist();
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
    const it = ing.item && itemsById.get(ing.item);
    if (!isTracked(it)) return; // on-demand mixers aren't stock-tracked
    const st = getItemStockStatus(it.id);
    if (st === "low" && !lowItems.includes(it.name)) lowItems.push(it.name);
    if (st === "out" && !outItems.includes(it.name)) outItems.push(it.name);
  });
  return { lowItems, outItems };
}
