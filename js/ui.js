/*
 * UI: tab switching, filters, recipe modal, shopping & stock dialogs.
 */

// =========================================================================
// INTERACTION HANDLERS (tabs, filters, modals)
// =========================================================================
function switchTab(tabName) {
  ["menu", "inventory", "glassware"].forEach(t => {
    document.getElementById(`view-${t}`).classList.toggle("hidden", t !== tabName);
    const btn = document.getElementById(`tab-${t}`);
    const base = "tab-btn whitespace-nowrap shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm transition flex items-center gap-2";
    btn.className = t === tabName
      ? `${base} font-semibold bg-gold text-obsidian shadow`
      : `${base} font-medium text-gray-300 hover:text-white hover:bg-white/5`;
  });
  // On phones the active tab can sit off-screen in the scrollable tab strip
  document.getElementById(`tab-${tabName}`).scrollIntoView({ block: "nearest", inline: "nearest" });
}

function setTypeFilter(type) {
  currentTypeFilter = type;
  document.querySelectorAll(".type-pill").forEach(btn => {
    btn.className = btn.dataset.type === type
      ? "type-pill px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold text-obsidian transition"
      : "type-pill px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition";
  });
  applyFilters();
}

function setVibeFilter(vibe) {
  currentVibeFilter = vibe;
  document.querySelectorAll(".vibe-pill").forEach(btn => {
    btn.className = btn.dataset.vibe === vibe
      ? "vibe-pill px-2.5 py-1 rounded-lg text-xs font-semibold bg-gold/20 text-gold border border-gold/40 transition"
      : "vibe-pill px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition";
  });
  applyFilters();
}

function toggleMultiFilterPanel() {
  const panel = document.getElementById("multiFilterPanel");
  const isHidden = panel.classList.contains("hidden");
  panel.classList.toggle("hidden", !isHidden);
  document.getElementById("multiFilterChevron").classList.toggle("rotate-180", isHidden);
}

function toggleSelectedIngredient(id) {
  if (selectedIngredients.has(id)) selectedIngredients.delete(id);
  else if (itemsById.has(id)) selectedIngredients.add(id);
  renderMultiFilterControls();
  applyFilters();
}

function setMultiMatchMode(mode) {
  multiMatchMode = mode;
  const on = "px-3 py-1 rounded-lg font-semibold bg-gold text-obsidian transition";
  const off = "px-3 py-1 rounded-lg font-medium text-gray-300 hover:text-white transition";
  document.getElementById("matchModeAnyBtn").className = mode === "ANY" ? on : off;
  document.getElementById("matchModeAllBtn").className = mode === "ALL" ? on : off;
  renderMultiFilterControls();
  applyFilters();
}

function clearSelectedIngredients() {
  selectedIngredients.clear();
  renderMultiFilterControls();
  applyFilters();
}

function applyFilters() { renderRecipes(); }

function resetAllFilters() {
  document.getElementById("searchInput").value = "";
  selectedIngredients.clear();
  renderMultiFilterControls();
  document.getElementById("readinessFilter").value = "ALL";
  document.getElementById("hideOutOfStockToggle").checked = false;
  document.getElementById("useUpLowStockToggle").checked = false;
  setTypeFilter("ALL");
  setVibeFilter("ALL");
}

function jumpToIngredient(id) {
  switchTab("menu");
  selectedIngredients.clear();
  if (itemsById.has(id)) selectedIngredients.add(id);
  document.getElementById("searchInput").value = "";
  renderMultiFilterControls();
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openRecipeModal(id) {
  const r = recipeById(id);
  if (!r) return;
  const { lowItems, outItems } = getRecipeStockAnalysis(r);

  let modalAlert = "";
  if (outItems.length > 0 || lowItems.length > 0) {
    modalAlert = `
      <div class="p-3.5 rounded-2xl ${outItems.length > 0 ? 'bg-red-500/15 border-red-500/40 text-red-200' : 'bg-amber-500/15 border-amber-500/40 text-amber-200'} border text-xs flex flex-wrap items-center justify-between gap-2">
        <div>
          ${outItems.length > 0 ? `<p><strong>Out of Stock Alert:</strong> ${esc(outItems.join(", "))}</p>` : ""}
          ${lowItems.length > 0 ? `<p><strong>Low Stock Alert:</strong> ${esc(lowItems.join(", "))}</p>` : ""}
        </div>
        <button onclick="closeRecipeModal(); openStockDrawer();" class="px-3 py-1 rounded-lg bg-obsidian/80 text-gold border border-gold/30 font-semibold hover:bg-gold hover:text-obsidian transition no-print">Update Stock</button>
      </div>`;
  }

  const ingRows = r.ingredients.map(i => {
    const it = i.item ? itemsById.get(i.item) : null;
    const st = isTracked(it) ? getItemStockStatus(it.id) : null;
    let badgeClass = "bg-sky-500/15 text-sky-300 border border-sky-500/30";
    let badgeLabel = it ? "On-Demand" : "Extra";
    if (st === "out") { badgeClass = "bg-red-500/20 text-red-300 border border-red-500/40"; badgeLabel = "Out of Stock"; }
    else if (st === "low") { badgeClass = "bg-amber-500/20 text-amber-300 border border-amber-500/40"; badgeLabel = "Low Stock"; }
    else if (st === "in") { badgeClass = "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"; badgeLabel = "In Stock"; }
    return `
      <div class="flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-xl bg-obsidian/80 border border-white/5">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded shrink-0 ${badgeClass}">${badgeLabel}</span>
          <span class="text-sm font-medium ${st === 'out' ? 'line-through text-red-300' : 'text-white'}">${esc(ingredientLabel(i))}</span>
        </div>
        <span class="font-mono text-sm text-gold font-semibold shrink-0">${esc(i.amount)}</span>
      </div>`;
  }).join("");

  const stepsList = r.steps.map((step, index) => `
    <li class="flex gap-3 text-sm text-gray-200 leading-relaxed">
      <span class="w-6 h-6 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">${index + 1}</span>
      <span>${esc(step)}</span>
    </li>`).join("");

  document.getElementById("modalContent").innerHTML = `
    <div class="p-6 sm:p-8 space-y-6">
      <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold font-semibold">${esc(r.type)}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-200">${esc(r.vibe)}</span>
            ${isBarReady(r) ? `<span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">Bar-Ready</span>` : ""}
          </div>
          <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white">${esc(r.name)}</h2>
        </div>
        <button onclick="closeRecipeModal()" class="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition" aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      ${modalAlert}

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-obsidian/90 rounded-2xl p-4 border border-gold/20 items-center">
        <div class="flex items-center justify-center sm:border-r border-white/10 py-2">
          ${renderGlassSVG(r.glass, r.colors, r.garnishType, `modal-${r.id}`)}
        </div>
        <div class="sm:col-span-2 grid grid-cols-2 gap-3 text-xs">
          <div class="p-2.5 rounded-xl bg-white/5">
            <span class="text-gray-400 block">Recommended Glass</span>
            <strong class="text-white text-sm mt-0.5 block">${esc(GLASS_LABELS[r.glass] || r.glass)} Glass</strong>
          </div>
          <div class="p-2.5 rounded-xl bg-white/5">
            <span class="text-gray-400 block">Technique</span>
            <strong class="text-white text-sm mt-0.5 block">${esc(r.method || "—")}</strong>
          </div>
          <div class="col-span-2 p-2.5 rounded-xl bg-white/5">
            <span class="text-gray-400 block">Ice & Temperature Prep</span>
            <strong class="text-gold text-sm mt-0.5 block">${esc(r.ice || "—")}</strong>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <h4 class="text-xs uppercase tracking-widest text-gold font-bold">Exact Measurements</h4>
          <div class="space-y-2">${ingRows}</div>
        </div>
        <div class="space-y-3">
          <h4 class="text-xs uppercase tracking-widest text-gold font-bold">Step-by-Step Preparation</h4>
          <ol class="space-y-3">${stepsList}</ol>
        </div>
      </div>

      ${r.servingNotes ? `
      <div class="p-4 rounded-2xl bg-gold/10 border border-gold/30 space-y-1">
        <h4 class="text-xs uppercase tracking-widest text-gold font-bold">Garnish & Serving Presentation</h4>
        <p class="text-sm text-gray-200 leading-relaxed">${esc(r.servingNotes)}</p>
      </div>` : ""}

      <div class="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-white/10 no-print">
        <button onclick="deleteRecipe('${r.id}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/15 border border-red-500/30 transition">Delete</button>
        <div class="w-full sm:w-auto grid grid-cols-3 sm:flex gap-2">
          <button onclick="openShareDialog('${r.id}')" class="px-3 py-2 rounded-xl text-xs font-semibold text-gold bg-gold/10 hover:bg-gold/20 border border-gold/30 transition"><span class="sm:hidden">Share</span><span class="hidden sm:inline">Share as Image</span></button>
          <button onclick="openRecipeEditor('duplicate', '${r.id}')" class="px-3 py-2 rounded-xl text-xs font-semibold text-gray-200 bg-white/5 hover:bg-white/15 border border-white/10 transition">Duplicate</button>
          <button onclick="openRecipeEditor('edit', '${r.id}')" class="px-3 py-2 rounded-xl text-xs font-semibold bg-gold hover:bg-gold-light text-obsidian transition"><span class="sm:hidden">Edit</span><span class="hidden sm:inline">Edit Recipe</span></button>
        </div>
      </div>
    </div>`;

  showModal("recipeModal");
}

function closeRecipeModal() { hideModal("recipeModal"); }

function openShoppingModal() {
  renderShoppingChecklist();
  showModal("shoppingModal");
}
function closeShoppingModal() { hideModal("shoppingModal"); }

function openStockDrawer() {
  renderStockDrawer();
  showModal("stockDrawerModal");
}
function closeStockDrawer() { hideModal("stockDrawerModal"); }

function setReadinessFilter(value) {
  document.getElementById("readinessFilter").value = value;
  applyFilters();
}

// From the shopping dialog: show the drinks that need only this one item.
function showOneAwayFor(id) {
  resetAllFilters();
  switchTab("menu");
  selectedIngredients.add(id);
  renderMultiFilterControls();
  setReadinessFilter("ONE_AWAY");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
