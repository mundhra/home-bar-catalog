/*
 * Core: constants, enums, storage keys and small helpers.
 * Loaded first. Everything here is used by the later scripts.
 */

// =========================================================================
// REFERENCE DATA & CONSTANTS
//    Inventory items and recipes live in data/catalog.js (window.BAR_CATALOG).
//    The glassware guide is presentation content tied to the SVG renderer,
//    so it stays here.
// =========================================================================

const CATALOG_SCHEMA = 1;
const DRINK_TYPES = ["Cocktail", "Mocktail", "Wine & Low-ABV"];
const VIBES = ["Refreshing & Crisp", "Tropical & Fruity", "Rich & Dessert", "Herbal & Bold"];
const GLASSES = ["Highball", "Rocks", "Coupe", "Martini", "Copa", "Hurricane", "Flute"];
const GLASS_LABELS = { Copa: "Copa (Balloon)", Flute: "Champagne Flute" };
const GARNISHES = ["none", "citrus-wheel", "mint-lime", "orange-twist", "berry-rim", "umbrella-straw"];
const GARNISH_LABELS = {
  "none": "None", "citrus-wheel": "Citrus wheel", "mint-lime": "Mint & lime",
  "orange-twist": "Orange twist", "berry-rim": "Berry rim", "umbrella-straw": "Umbrella & straw"
};
const ITEM_KINDS = {
  syrup:  { label: "Syrups", singular: "Syrup", tracked: true },
  spirit: { label: "Spirits, Liqueurs & Wines", singular: "Spirit / Liqueur / Wine", tracked: true },
  base:   { label: "Fermented & Zero-Proof Bases", singular: "Fermented / Zero-Proof Base", tracked: true },
  mixer:  { label: "On-Demand Mixers & Juices", singular: "On-Demand Mixer / Juice", tracked: false }
};
const KIND_ORDER = ["syrup", "spirit", "base", "mixer"];
const ID_RE = /^[a-z0-9][a-z0-9-]{0,62}$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const STORAGE_KEYS = {
  catalog: "private_reserve_catalog_v1",   // { basedOn, savedAt, catalog } — edited copy
  stock: "private_reserve_stock_v2",       // { itemId: "low" | "out" }
  legacyStock: "private_reserve_stock_v1", // { itemName: "low" | "out" } — migrated once
  shopping: "private_reserve_shopping_v1"  // [mixerId, ...] ticked on the restock checklist
};

// =========================================================================
// SMALL UTILITIES
// =========================================================================
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function str(v) { return typeof v === "string" ? v.trim() : ""; }
function slugify(text) {
  return String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 56) || "item";
}
function uniqueId(base, existingIds) {
  let id = base, n = 2;
  while (existingIds.has(id)) id = `${base}-${n++}`;
  return id;
}
function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn(`Could not read ${key} from localStorage`, e);
    return null;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage`, e);
    showToast("Couldn't save to this browser's storage. Export a backup to keep your changes.", "error");
    return false;
  }
}
function removeKey(key) {
  try { localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
}
function downloadFile(filename, text, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function todayStamp() { return new Date().toISOString().slice(0, 10); }

let toastTimer = null;
function showToast(message, kind = "ok") {
  const el = document.getElementById("toast");
  if (!el) return;
  const tone = kind === "error" ? "border-red-500/50 text-red-200"
             : kind === "warn" ? "border-amber-500/50 text-amber-200"
             : "border-gold/50 text-gray-100";
  el.className = `fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] max-w-[calc(100vw-2rem)] px-4 py-2.5 rounded-xl bg-charcoal border shadow-2xl text-sm no-print ${tone}`;
  el.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 4500);
}

function showModal(id) {
  const m = document.getElementById(id);
  m.classList.remove("hidden");
  m.classList.add("flex");
}
function hideModal(id) {
  const m = document.getElementById(id);
  m.classList.add("hidden");
  m.classList.remove("flex");
}
function isModalOpen(id) {
  return !document.getElementById(id).classList.contains("hidden");
}
