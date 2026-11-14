/*
 * Party menus: named lists of drinks with a guest link, QR code and print view.
 * Guests open …/#menu=<title>~<id>,<id> and get a read-only menu ("guest mode"):
 * no stock, no editing. Links carry recipe ids, so guests only see drinks that
 * are in the published catalog (data/catalog.js).
 * Uses js/vendor/qrcode.js (qrcode-generator, MIT) for QR codes.
 */

let partyMenus = [];   // [{ id, title, recipeIds, updatedAt }]
let guestMenu = null;  // { title, ids } when opened from a guest link
let menuEditor = null; // { id, title, selected: Set, filter, query }

// =========================================================================
// STORAGE
// =========================================================================
function sanitizeMenus(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(m => m && typeof m === "object" && typeof m.id === "string" && ID_RE.test(m.id))
    .map(m => ({
      id: m.id,
      title: str(m.title).slice(0, 80) || "Party menu",
      recipeIds: [...new Set((Array.isArray(m.recipeIds) ? m.recipeIds : []).filter(x => typeof x === "string" && ID_RE.test(x)))],
      updatedAt: str(m.updatedAt)
    }));
}
function loadMenus() { return sanitizeMenus(readJSON(STORAGE_KEYS.menus)); }
function saveMenus() { writeJSON(STORAGE_KEYS.menus, partyMenus); }
const menuById = id => partyMenus.find(m => m.id === id);
const menuRecipes = menu => menu.recipeIds.map(recipeById).filter(Boolean);

// Drinks in the menu that guests can't see: they exist only in this browser's edited copy.
function localOnlyRecipes(menu) {
  const shippedIds = new Set((shippedCatalog ? shippedCatalog.recipes : []).map(r => r.id));
  return menuRecipes(menu).filter(r => !shippedIds.has(r.id));
}

// =========================================================================
// GUEST LINKS
// =========================================================================
function appBaseUrl() { return location.href.split("#")[0]; }

function buildMenuLink(menu) {
  return `${appBaseUrl()}#menu=${encodeURIComponent(menu.title)}~${menu.recipeIds.join(",")}`;
}

function parseMenuHash(hash) {
  const m = /^#menu=([^~]*)~(.*)$/.exec(hash || "");
  if (!m) return null;
  let title = "";
  try { title = decodeURIComponent(m[1]); } catch (e) { /* malformed title */ }
  const ids = [...new Set(m[2].split(",").map(s => s.trim()).filter(s => ID_RE.test(s)))].slice(0, 60);
  return { title: title.trim().slice(0, 80) || "Tonight's menu", ids };
}

function makeQrSvg(text) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
}

// =========================================================================
// HOST: PARTY TAB
// =========================================================================
function renderParty() {
  document.getElementById("partyTabCount").textContent = partyMenus.length;
  const el = document.getElementById("partyMenus");
  if (!partyMenus.length) {
    el.innerHTML = `
      <div class="md:col-span-2 glass-card rounded-2xl p-8 text-center space-y-2">
        <p class="font-serif text-2xl text-white">No party menus yet</p>
        <p class="text-sm text-gray-400">Pick the drinks you'll offer, then share a link or QR code with your guests.</p>
        <button onclick="openMenuEditor()" class="mt-2 px-4 py-2 rounded-xl bg-gold text-obsidian text-sm font-semibold no-print">+ New Menu</button>
      </div>`;
    return;
  }
  const btn = "px-2 py-2 rounded-xl text-xs font-semibold border transition";
  el.innerHTML = partyMenus.map(m => {
    const drinks = menuRecipes(m);
    const ready = drinks.filter(canMakeNow).length;
    return `
      <div class="glass-card rounded-2xl p-4 space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="font-serif text-2xl font-bold text-white leading-tight">${esc(m.title)}</h3>
            <p class="text-xs text-gray-400 mt-0.5">${drinks.length} drink${drinks.length === 1 ? "" : "s"} ·
              <span class="${drinks.length && ready === drinks.length ? "text-emerald-300" : "text-amber-300"}">${ready} you can make now</span></p>
          </div>
          <button onclick="openMenuEditor('${m.id}')" class="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-semibold text-gray-200 no-print">Edit</button>
        </div>
        <p class="text-xs text-gray-300 line-clamp-2">${drinks.map(r => esc(r.name)).join('<span class="text-gray-600"> · </span>') || "No drinks yet"}</p>
        <div class="grid grid-cols-3 gap-2 no-print">
          <button onclick="openMenuShare('${m.id}')" class="${btn} bg-gold text-obsidian border-gold hover:bg-gold-light">Share / QR</button>
          <button onclick="previewMenu('${m.id}')" class="${btn} bg-white/5 text-gray-200 border-white/10 hover:bg-white/15">Preview</button>
          <button onclick="printMenu('${m.id}')" class="${btn} bg-white/5 text-gray-200 border-white/10 hover:bg-white/15">Print</button>
        </div>
      </div>`;
  }).join("");
}

// ---- menu editor --------------------------------------------------------
function openMenuEditor(id) {
  const m = id ? menuById(id) : null;
  menuEditor = { id: m ? m.id : null, title: m ? m.title : "", selected: new Set(m ? m.recipeIds : []), filter: "ALL", query: "" };
  editorDirty = false;
  const pill = (f, label) =>
    `<button type="button" data-filter="${f}" onclick="setMenuEditorFilter('${f}')" class="me-pill px-2.5 py-1 rounded-lg text-xs font-medium transition">${label}</button>`;
  document.getElementById("menuEditorBody").innerHTML = `
    <div class="p-5 sm:p-8 space-y-4">
      <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span class="text-xs uppercase tracking-widest text-gold font-semibold">Party Menu</span>
          <h3 class="font-serif text-2xl font-bold text-white mt-0.5">${m ? "Edit Menu" : "New Menu"}</h3>
        </div>
        <button type="button" onclick="closeMenuEditor()" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div>
        <label class="${LABEL_CLS}" for="me_title">Menu name</label>
        <input id="me_title" class="${INPUT_CLS}" maxlength="80" value="${esc(menuEditor.title)}" placeholder="e.g. Saturday Rooftop Party" oninput="menuEditor.title = this.value; markEditorDirty()" />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <input id="me_query" class="${INPUT_CLS} sm:flex-1" placeholder="Search drinks…" oninput="menuEditor.query = this.value; renderMenuEditorList()" />
        <div class="flex gap-1.5">${pill("ALL", "All")}${pill("CAN", "Can make now")}${pill("SEL", "Selected")}</div>
      </div>
      <div id="me_list" class="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1 scrollbar-thin"></div>
      <div id="me_errors" class="hidden p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-200"></div>
      <div class="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
        ${m ? `<button type="button" onclick="deleteMenuFromEditor()" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/15 border border-red-500/30">Delete</button>` : `<span id="me_count_left"></span>`}
        <div class="flex items-center gap-2">
          <span id="me_count" class="text-xs text-gray-400"></span>
          <button type="button" onclick="closeMenuEditor()" class="px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5">Cancel</button>
          <button type="button" onclick="saveMenuEditor()" class="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-obsidian font-semibold text-sm">Save</button>
        </div>
      </div>
    </div>`;
  renderMenuEditorList();
  showModal("menuEditorModal");
  document.getElementById("me_title").focus();
}

function renderMenuEditorList() {
  const q = menuEditor.query.toLowerCase().trim();
  document.querySelectorAll("#menuEditorBody .me-pill").forEach(b => {
    b.className = `me-pill px-2.5 py-1 rounded-lg text-xs transition ${b.dataset.filter === menuEditor.filter ? "bg-gold text-obsidian font-semibold" : "bg-white/5 text-gray-300 font-medium hover:bg-white/10"}`;
  });
  const list = catalog.recipes.filter(r =>
    (!q || r.name.toLowerCase().includes(q)) &&
    (menuEditor.filter !== "CAN" || canMakeNow(r)) &&
    (menuEditor.filter !== "SEL" || menuEditor.selected.has(r.id)));
  document.getElementById("me_list").innerHTML = list.map(r => {
    const on = menuEditor.selected.has(r.id);
    return `
      <label class="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian/70 border ${on ? "border-gold/50" : "border-white/10"} cursor-pointer">
        <input type="checkbox" ${on ? "checked" : ""} onchange="toggleMenuDrink('${r.id}', this.checked)" class="w-4 h-4 rounded accent-[#d4a359]" />
        <span class="flex-1 min-w-0">
          <span class="block text-sm text-white truncate">${esc(r.name)}</span>
          <span class="block text-[11px] text-gray-400">${esc(r.type)} · ${esc(r.vibe)}</span>
        </span>
        ${canMakeNow(r) ? `<span class="shrink-0 text-[10px] text-emerald-300">✓ can make</span>` : ""}
      </label>`;
  }).join("") || `<p class="text-xs text-gray-400 p-2">No drinks match.</p>`;
  document.getElementById("me_count").textContent = `${menuEditor.selected.size} selected`;
}

function setMenuEditorFilter(f) { menuEditor.filter = f; renderMenuEditorList(); }

function toggleMenuDrink(id, on) {
  if (on) menuEditor.selected.add(id); else menuEditor.selected.delete(id);
  markEditorDirty();
  if (menuEditor.filter === "SEL") renderMenuEditorList();
  else document.getElementById("me_count").textContent = `${menuEditor.selected.size} selected`;
}

function saveMenuEditor() {
  const title = menuEditor.title.trim();
  const errors = [];
  if (!title) errors.push("Give the menu a name.");
  if (!menuEditor.selected.size) errors.push("Pick at least one drink.");
  if (errors.length) return showFormErrors("me_errors", errors);
  const recipeIds = catalog.recipes.filter(r => menuEditor.selected.has(r.id)).map(r => r.id);
  const menu = {
    id: menuEditor.id || uniqueId(slugify(title), new Set(partyMenus.map(m => m.id))),
    title, recipeIds, updatedAt: new Date().toISOString()
  };
  partyMenus = menuEditor.id ? partyMenus.map(m => (m.id === menu.id ? menu : m)) : [...partyMenus, menu];
  saveMenus();
  editorDirty = false;
  hideModal("menuEditorModal");
  renderParty();
  showToast(`Saved “${title}”.`);
}

function deleteMenuFromEditor() {
  const m = menuById(menuEditor.id);
  if (!m || !confirm(`Delete the menu “${m.title}”? The drinks themselves aren't affected.`)) return;
  partyMenus = partyMenus.filter(x => x.id !== m.id);
  saveMenus();
  editorDirty = false;
  hideModal("menuEditorModal");
  renderParty();
  showToast(`Deleted “${m.title}”.`);
}

function closeMenuEditor() {
  if (!confirmDiscard()) return;
  editorDirty = false;
  hideModal("menuEditorModal");
}

// ---- share / QR -----------------------------------------------------------
function openMenuShare(id) {
  const m = menuById(id);
  if (!m) return;
  const link = buildMenuLink(m);
  const localOnly = localOnlyRecipes(m);
  const canShare = typeof navigator.share === "function";
  const btn = "px-3 py-2 rounded-xl text-xs font-semibold border transition";
  document.getElementById("menuShareBody").innerHTML = `
    <div class="text-center space-y-1">
      <p class="text-xs uppercase tracking-widest text-gold font-semibold">Guest menu</p>
      <h3 class="font-serif text-2xl font-bold text-white">${esc(m.title)}</h3>
      <p class="text-xs text-gray-400">Guests scan this or open the link. They see the drinks, not your stock.</p>
    </div>
    <div id="menuQr" class="mx-auto w-56 h-56 p-3 rounded-2xl bg-white">${makeQrSvg(link)}</div>
    <p class="text-[11px] text-gray-400 break-all text-center select-all">${esc(link)}</p>
    ${localOnly.length ? `
      <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200">
        ${localOnly.length} drink${localOnly.length > 1 ? "s are" : " is"} only on this device (${esc(localOnly.map(r => r.name).join(", "))}),
        so guests won't see ${localOnly.length > 1 ? "them" : "it"}. Publish them with Catalog Data → Download catalog.js.
      </div>` : ""}
    <div class="grid grid-cols-2 gap-2">
      <button onclick="copyMenuLink('${m.id}')" class="${btn} bg-white/5 text-gray-200 border-white/10 hover:bg-white/15">Copy link</button>
      ${canShare ? `<button onclick="shareMenuLink('${m.id}')" class="${btn} bg-gold text-obsidian border-gold hover:bg-gold-light">Share…</button>`
                 : `<button onclick="downloadMenuQr('${m.id}')" class="${btn} bg-gold text-obsidian border-gold hover:bg-gold-light">Download QR</button>`}
      ${canShare ? `<button onclick="downloadMenuQr('${m.id}')" class="${btn} bg-white/5 text-gray-200 border-white/10 hover:bg-white/15">Download QR</button>` : ""}
      <button onclick="previewMenu('${m.id}')" class="${btn} bg-white/5 text-gray-200 border-white/10 hover:bg-white/15">Preview</button>
    </div>`;
  showModal("menuShareModal");
}
function closeMenuShare() { hideModal("menuShareModal"); }

async function copyMenuLink(id) {
  const link = buildMenuLink(menuById(id));
  try {
    await navigator.clipboard.writeText(link);
    showToast("Link copied.");
  } catch (e) {
    prompt("Copy this link:", link);
  }
}

async function shareMenuLink(id) {
  const m = menuById(id);
  try {
    await navigator.share({ title: m.title, text: `${m.title}: here's the drinks menu`, url: buildMenuLink(m) });
  } catch (e) {
    if (e && e.name !== "AbortError") copyMenuLink(id);
  }
}

async function downloadMenuQr(id) {
  const m = menuById(id);
  const svg = makeQrSvg(buildMenuLink(m)).replace("<svg ", '<svg width="1024" height="1024" ');
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode();
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.drawImage(img, 0, 0, 1024, 1024);
  c.toBlob(b => { if (b) downloadBlob(`${m.id}-qr.png`, b); }, "image/png");
}

function previewMenu(id) { window.open(buildMenuLink(menuById(id)), "_blank", "noopener"); }

// =========================================================================
// GUEST VIEW (also used for printing)
// =========================================================================
function renderGuestView(menu, { qrLink = null } = {}) {
  const drinks = menu.ids.map(recipeById).filter(Boolean);
  const card = r => {
    const names = [...new Set(r.ingredients.map(i => (i.item ? itemsById.get(i.item)?.name : i.name)).filter(Boolean))];
    return `
      <article onclick="openRecipeModal('${r.id}')" class="glass-card rounded-2xl p-4 flex items-start gap-3 cursor-pointer group">
        <div class="min-w-0 flex-1 space-y-1">
          <p class="text-[10px] uppercase tracking-wider text-gold/90 font-medium">${esc(r.type)} · ${esc(r.vibe)}</p>
          <h3 class="font-serif text-xl font-bold text-white group-hover:text-gold transition leading-snug">${esc(r.name)}</h3>
          <p class="text-xs text-gray-300 leading-relaxed">${names.map(esc).join('<span class="text-gray-600"> · </span>')}</p>
        </div>
        <div class="shrink-0 self-center [&>svg]:w-14 [&>svg]:h-16" aria-hidden="true">${renderGlassSVG(r.glass, r.colors, r.garnishType, `guest-${r.id}`)}</div>
      </article>`;
  };
  document.getElementById("view-guest").innerHTML = `
    <div class="text-center space-y-1 pt-2">
      <p class="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold">The Private Reserve</p>
      <h2 class="font-serif text-4xl font-bold text-white">${esc(menu.title)}</h2>
      <p class="text-sm text-gray-400 no-print">Tap a drink to see what's in it.</p>
    </div>
    ${drinks.length
      ? `<div id="guestGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${drinks.map(card).join("")}</div>`
      : `<div class="glass-card rounded-2xl p-8 text-center text-sm text-gray-300">This menu's drinks aren't available here.</div>`}
    ${qrLink ? `
      <div class="flex flex-col items-center gap-2 pt-4">
        <div class="w-40 h-40 p-2 bg-white rounded-xl">${makeQrSvg(qrLink)}</div>
        <p class="text-xs text-gray-400">Scan for the menu on your phone</p>
      </div>` : ""}
    <p class="text-center text-xs text-gray-500 pb-4 no-print">
      <a href="${esc(appBaseUrl())}" onclick="exitGuestMode(); return false;" class="underline hover:text-gold">Open the full bar app</a>
    </p>`;
}

function enterGuestMode(menu) {
  guestMenu = menu;
  document.body.classList.add("guest-mode");
  ["headerActions", "mainNav", "view-menu", "view-inventory", "view-glassware", "view-party"]
    .forEach(id => document.getElementById(id).classList.add("hidden"));
  document.getElementById("view-guest").classList.remove("hidden");
  document.title = `${menu.title} · The Private Reserve`;
  renderGuestView(menu);
}

function exitGuestMode() {
  location.href = appBaseUrl();
}

function printMenu(id) {
  const m = menuById(id);
  renderGuestView({ title: m.title, ids: m.recipeIds }, { qrLink: buildMenuLink(m) });
  document.body.classList.add("printing-menu");
  window.print();
}

window.addEventListener("afterprint", () => {
  if (!document.body.classList.contains("printing-menu")) return;
  document.body.classList.remove("printing-menu");
  if (!guestMenu) document.getElementById("view-guest").innerHTML = "";
});
