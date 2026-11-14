/*
 * Render: drink grid, tonight summary, inventory, stock drawer, shopping dialog, filter chips.
 * All catalog text is passed through esc() before it reaches innerHTML.
 */

// =========================================================================
// RENDERING
// =========================================================================
function refreshAllViews() {
  updateCounts();
  updateStockBadges();
  renderMultiFilterControls();
  renderRecipes();
  renderInventory();
  renderStockDrawer();
  renderShoppingChecklist();
  renderParty();
  if (isModalOpen("dataModal")) renderDataModal();
}

function updateCounts() {
  document.getElementById("totalRecipeCount").textContent = catalog.recipes.length;
  document.getElementById("inventoryTabCount").textContent = trackedItems().length;
  const badge = document.getElementById("catalogEditedBadge");
  badge.classList.toggle("hidden", !usingLocalCopy);
  badge.classList.toggle("bg-amber-400", shippedChangedSinceEdit());
  badge.title = shippedChangedSinceEdit() ? "Edited copy — the shipped catalog has changed since" : "Using your edited copy";
}

function updateStockBadges() {
  const statuses = Object.values(stockStatuses);
  const lowCount = statuses.filter(s => s === "low").length;
  const outCount = statuses.filter(s => s === "out").length;
  const alertTotal = lowCount + outCount;

  const alertBadge = document.getElementById("stockAlertBadge");
  alertBadge.textContent = alertTotal;
  alertBadge.classList.toggle("hidden", alertTotal === 0);
  document.getElementById("lowStockPillCount").textContent = lowCount;

  document.getElementById("stockSummaryStrip").innerHTML = `
    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> ${trackedItems().length - alertTotal} In Stock</span>
    <span class="flex items-center gap-1 ${lowCount > 0 ? 'text-amber-300 font-semibold' : ''}"><span class="w-2 h-2 rounded-full bg-amber-400"></span> ${lowCount} Low</span>
    <span class="flex items-center gap-1 ${outCount > 0 ? 'text-red-400 font-semibold' : ''}"><span class="w-2 h-2 rounded-full bg-red-400"></span> ${outCount} Out</span>
  `;

  // Shopping badge: things worth buying = low/out bottles + anything that alone unlocks a drink.
  const toBuy = new Set(Object.keys(stockStatuses));
  unlockSuggestions().forEach(s => toBuy.add(s.item.id));
  const shopBadge = document.getElementById("shoppingBadge");
  shopBadge.textContent = toBuy.size;
  shopBadge.classList.toggle("hidden", toBuy.size === 0);
}

// "Tonight: X can make now · Y one ingredient away" — each count is a filter shortcut.
function renderTonightSummary() {
  const makeable = catalog.recipes.filter(canMakeNow).length;
  const oneAway = catalog.recipes.filter(r => missingItems(r).length === 1).length;
  const current = document.getElementById("readinessFilter").value;
  const chip = (value, label, n, tone) => `
    <button type="button" onclick="setReadinessFilter('${current === value ? "ALL" : value}')"
      class="px-2 py-0.5 rounded-full border transition ${current === value ? tone.on : tone.off}">${n} ${label}</button>`;
  document.getElementById("tonightSummary").innerHTML = `
    <span class="text-gray-400">Tonight:</span>
    ${chip("CAN_MAKE", "can make now", makeable, { on: "bg-emerald-500 text-obsidian border-emerald-500 font-semibold", off: "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15" })}
    ${chip("ONE_AWAY", "one ingredient away", oneAway, { on: "bg-amber-400 text-obsidian border-amber-400 font-semibold", off: "border-amber-500/40 text-amber-300 hover:bg-amber-500/15" })}`;
}

function renderRecipes() {
  const grid = document.getElementById("recipeGrid");
  const searchVal = document.getElementById("searchInput").value.toLowerCase().trim();
  const readinessFilter = document.getElementById("readinessFilter").value;
  const hideOutOfStock = document.getElementById("hideOutOfStockToggle").checked;
  const useUpLowStock = document.getElementById("useUpLowStockToggle").checked;
  const favouritesOnly = document.getElementById("favouritesToggle").checked;
  const sortBy = document.getElementById("sortSelect").value;

  if (!catalog.recipes.length && shippedErrors.length && !usingLocalCopy) {
    grid.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-10 text-center space-y-3 border-red-500/40">
        <p class="font-serif text-2xl text-white">The catalog couldn't be loaded</p>
        <p class="text-sm text-gray-300">${esc(shippedErrors[0])}</p>
        <button onclick="openDataModal()" class="mt-2 px-4 py-2 rounded-xl bg-gold text-obsidian text-sm font-semibold">Open Catalog Data</button>
      </div>`;
    document.getElementById("visibleCount").textContent = 0;
    return;
  }

  const filtered = catalog.recipes.filter(r => {
    const { lowItems, outItems } = getRecipeStockAnalysis(r);
    if (hideOutOfStock && outItems.length > 0) return false;
    if (useUpLowStock && lowItems.length === 0) return false;
    if (favouritesOnly && !isFavourite(r.id)) return false;
    if (currentTypeFilter !== "ALL" && r.type !== currentTypeFilter) return false;
    if (currentVibeFilter !== "ALL" && r.vibe !== currentVibeFilter) return false;
    if (readinessFilter === "CAN_MAKE" && !canMakeNow(r)) return false;
    if (readinessFilter === "ONE_AWAY" && missingItems(r).length !== 1) return false;
    if (readinessFilter === "READY_NOW" && !isBarReady(r)) return false;
    if (readinessFilter === "NEEDS_JUICE" && isBarReady(r)) return false;

    if (selectedIngredients.size > 0) {
      const uses = id => r.ingredients.some(i => i.item === id);
      const selected = [...selectedIngredients];
      const isMatch = multiMatchMode === "ALL" ? selected.every(uses) : selected.some(uses);
      if (!isMatch) return false;
    }

    if (searchVal) {
      const haystack = [
        r.name, r.type, r.vibe, r.glass, r.method, r.servingNotes,
        ...r.ingredients.map(ingredientLabel)
      ].join(" ").toLowerCase();
      if (!haystack.includes(searchVal)) return false;
    }
    return true;
  });

  if (sortBy === "RATING") {
    // Highest rated first; favourites break ties; unrated keep catalog order at the end.
    const score = r => ratingOf(r.id) * 2 + (isFavourite(r.id) ? 1 : 0);
    filtered.sort((a, b) => score(b) - score(a));
  } else if (sortBy === "NAME") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  document.getElementById("visibleCount").textContent = filtered.length;
  renderTonightSummary();
  const isFiltered = currentTypeFilter !== "ALL" || currentVibeFilter !== "ALL" || selectedIngredients.size > 0 || readinessFilter !== "ALL" || searchVal !== "" || hideOutOfStock || useUpLowStock || favouritesOnly;
  document.getElementById("resetFiltersBtn").classList.toggle("hidden", !isFiltered);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full glass-card rounded-2xl p-12 text-center space-y-3">
        <p class="font-serif text-2xl text-white">${catalog.recipes.length ? "No matching drinks found" : "No recipes yet"}</p>
        <p class="text-sm text-gray-400">${catalog.recipes.length ? "Try clearing one of your active filters or updating your stock statuses." : "Add your first recipe to get started."}</p>
        ${catalog.recipes.length
          ? `<button onclick="resetAllFilters()" class="mt-2 px-4 py-2 rounded-xl bg-gold text-obsidian text-sm font-semibold">Reset All Filters</button>`
          : `<button onclick="openRecipeEditor('add')" class="mt-2 px-4 py-2 rounded-xl bg-gold text-obsidian text-sm font-semibold no-print">+ Add Recipe</button>`}
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(r => {
    const { lowItems, outItems } = getRecipeStockAnalysis(r);
    const isOut = outItems.length > 0;
    const isLow = !isOut && lowItems.length > 0;

    const typeBadgeColor = r.type === "Mocktail"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : r.type === "Wine & Low-ABV"
        ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
        : "bg-gold/15 text-gold border-gold/30";

    const missing = missingItems(r);
    const readyBadge = missing.length === 0
      ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">✓ Can make now</span>`
      : missing.length === 1
        ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 truncate max-w-full">Need: ${esc(missing[0].name)}</span>`
        : `<span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">Missing ${missing.length}</span>`;

    // Tile = enough to choose a drink. Amounts, glass/technique, ice and stock
    // details live in the full spec (openRecipeModal).
    const names = [];
    r.ingredients.forEach(i => {
      const it = chosenCandidate(i); // shows the substitute you'd actually use
      const label = it ? it.name : (i.name || "");
      if (!label || names.some(n => n.label === label)) return;
      const st = isTracked(it) ? getItemStockStatus(it.id) : null;
      const missingMixer = !!it && !isTracked(it) && !isOnHand(it.id);
      const style = (i.optional ? "italic " : "") + (st === "out" ? "line-through text-red-300/80"
        : st === "low" ? "text-amber-200"
        : missingMixer || i.optional ? "text-gray-500"
        : "text-gray-300");
      names.push({ label, style });
    });
    const ingredientLine = names.map(n => `<span class="${n.style}">${esc(n.label)}</span>`).join('<span class="text-gray-600"> · </span>');

    return `
      <article onclick="openRecipeModal('${r.id}')" class="glass-card rounded-2xl p-4 flex items-start gap-3 cursor-pointer group ${isOut ? 'opacity-60 border-red-500/30 grayscale-[35%]' : isLow ? 'border-amber-500/35' : ''}">
        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="flex items-start gap-1.5">
            <div class="flex flex-wrap items-center gap-1.5 min-w-0">
              <span class="text-[10px] px-2 py-0.5 rounded-full border font-semibold ${typeBadgeColor}">${esc(r.type)}</span>
              ${readyBadge}
              ${ratingOf(r.id) ? `<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/25" title="Your rating">★ ${ratingOf(r.id)}</span>` : ""}
            </div>
            ${heartButton(r.id, "ml-auto -mt-1 -mr-1")}
          </div>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-gold/90 font-medium">${esc(r.vibe)}</p>
            <h3 class="font-serif text-xl font-bold text-white group-hover:text-gold transition leading-snug">${esc(r.name)}</h3>
          </div>
          <p class="text-xs leading-relaxed line-clamp-2">${ingredientLine}</p>
        </div>
        <div class="shrink-0 self-center [&>svg]:w-14 [&>svg]:h-16" aria-hidden="true">${renderGlassSVG(r.glass, r.colors, r.garnishType, r.id)}</div>
      </article>`;
  }).join("");
}

// Heart toggle used on tiles and in the recipe view.
function heartButton(id, extraClass = "") {
  const on = isFavourite(id);
  return `<button type="button" onclick="toggleFavourite('${id}', event)" aria-pressed="${on}" aria-label="${on ? "Remove from favourites" : "Add to favourites"}"
    class="shrink-0 p-1.5 rounded-lg transition no-print ${on ? "text-rose-400 hover:text-rose-300" : "text-gray-500 hover:text-rose-300"} ${extraClass}">
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.4 1.1 4.1 2.3.7-1.2 2.1-2.3 4.1-2.3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>
  </button>`;
}

function renderStockToggleButtons(id) {
  const current = getItemStockStatus(id);
  const btn = (value, label, on) => `
    <button type="button" onclick="setItemStockStatus('${id}', '${value}')" class="py-1 px-2 rounded-lg transition ${current === value ? on : 'text-gray-400 hover:text-white'}">${label}</button>`;
  return `
    <div class="grid grid-cols-3 gap-1 p-1 rounded-xl bg-obsidian border border-white/10 text-[11px] font-semibold">
      ${btn("in", "In Stock", "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40")}
      ${btn("low", "Low Stock", "bg-amber-500/25 text-amber-300 border border-amber-500/40")}
      ${btn("out", "Out", "bg-red-500/25 text-red-300 border border-red-500/40")}
    </div>`;
}

function renderOnHandButtons(id) {
  const have = isOnHand(id);
  const btn = (value, label, on) => `
    <button type="button" onclick="setOnHand('${id}', ${value})" class="py-1 px-2 rounded-lg transition ${have === value ? on : 'text-gray-400 hover:text-white'}">${label}</button>`;
  return `
    <div class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-obsidian border border-white/10 text-[11px] font-semibold">
      ${btn(true, "On hand", "bg-sky-500/25 text-sky-200 border border-sky-500/40")}
      ${btn(false, "Not on hand", "bg-white/10 text-gray-200 border border-white/20")}
    </div>`;
}

function renderInventoryCard(it) {
  const tracked = isTracked(it);
  const st = tracked ? getItemStockStatus(it.id) : "in";
  const uses = recipesUsingItem(it.id).length;
  const tint = st === "out" ? "border-red-500/40 opacity-75" : st === "low" ? "border-amber-500/40" : "";
  return `
    <div class="glass-card rounded-2xl p-4 flex flex-col justify-between gap-3 ${tint}">
      <div>
        <div class="flex items-start justify-between gap-2">
          <h4 class="font-semibold text-base ${st === 'out' ? 'line-through text-red-300' : 'text-white'}">${esc(it.name)}</h4>
          <span class="shrink-0 text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-gray-200 font-medium">${esc(it.category || ITEM_KINDS[it.kind].singular)}</span>
        </div>
        ${it.profile ? `<p class="text-[11px] text-gold mt-0.5">${esc(it.profile)}</p>` : ""}
        ${it.notes ? `<p class="text-xs text-gray-300 mt-2 leading-relaxed">${esc(it.notes)}</p>` : ""}
        ${it.staple ? `<p class="text-[11px] text-emerald-300 mt-2">Staple: on hand by default, and doesn't stop a drink being Bar-Ready</p>` : ""}
      </div>
      <div class="space-y-2 pt-1 no-print">
        ${tracked ? renderStockToggleButtons(it.id) : renderOnHandButtons(it.id)}
        <div class="flex gap-2">
          <button onclick="jumpToIngredient('${it.id}')" ${uses ? "" : "disabled"} class="flex-1 py-2 rounded-xl bg-white/5 enabled:hover:bg-gold enabled:hover:text-obsidian text-gold text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed">
            ${uses ? `View ${uses} drink${uses > 1 ? "s" : ""} →` : "Not used in any drink"}
          </button>
          <button onclick="openItemEditor('edit', '${it.id}')" class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-200 text-xs font-semibold transition">Edit</button>
        </div>
      </div>
    </div>`;
}

function renderInventory() {
  const el = document.getElementById("inventorySections");
  el.innerHTML = KIND_ORDER.map((kind, idx) => {
    const list = itemsOfKind(kind);
    const meta = ITEM_KINDS[kind];
    const cards = list.map(renderInventoryCard).join("");
    return `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="font-serif text-xl sm:text-2xl font-bold text-gold">${idx + 1}. ${meta.label} (${list.length})</h3>
          <div class="flex items-center gap-3 no-print">
            ${kind === "mixer"
              ? `<button onclick="openShoppingModal()" class="text-xs text-gold hover:underline font-medium">Shopping list →</button>`
              : `<span class="hidden sm:inline text-xs text-gray-400">Click status pills to update stock</span>`}
            <button onclick="openItemEditor('add', null, '${kind}')" class="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-gold hover:text-obsidian border border-gold/30 text-xs font-semibold transition">+ Add</button>
          </div>
        </div>
        ${kind === "mixer" ? `<p class="text-xs text-gray-400 -mt-2">Mark what's in the fridge; it decides what you can make now. Staples (soda, tonic…) start as on hand.</p>` : ""}
        ${cards
          ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</div>`
          : `<p class="text-xs text-gray-400">Nothing here yet.</p>`}
      </div>`;
  }).join("");
}

function renderStockDrawer() {
  const container = document.getElementById("stockDrawerList");
  const query = (document.getElementById("stockDrawerSearch")?.value || "").toLowerCase().trim();
  const items = trackedItems().filter(item =>
    !query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
  );
  container.innerHTML = items.map(item => {
    const st = getItemStockStatus(item.id);
    return `
      <div class="p-3 rounded-xl bg-obsidian/80 border ${st === 'out' ? 'border-red-500/40' : st === 'low' ? 'border-amber-500/40' : 'border-white/10'} space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-semibold ${st === 'out' ? 'line-through text-red-300' : 'text-white'}">${esc(item.name)}</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">${esc(item.category || ITEM_KINDS[item.kind].singular)}</span>
        </div>
        ${renderStockToggleButtons(item.id)}
      </div>`;
  }).join("") || `<p class="text-xs text-gray-400 col-span-full">No matching items.</p>`;
}

function renderShoppingChecklist() {
  const suggestions = unlockSuggestions();
  document.getElementById("unlockSection").innerHTML = suggestions.length ? `
    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
      <h4 class="text-xs uppercase tracking-wider text-emerald-300 font-bold">Buy one thing, unlock more drinks</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${suggestions.slice(0, 8).map(({ item, unlocks }) => `
          <div class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-obsidian/90 border border-emerald-500/25 text-xs">
            <div class="min-w-0">
              <span class="font-semibold text-white block truncate">${esc(item.name)}</span>
              <button onclick="closeShoppingModal(); showOneAwayFor('${item.id}')" class="text-[10px] text-emerald-300 font-bold uppercase hover:underline">Unlocks ${unlocks} drink${unlocks > 1 ? "s" : ""} →</button>
            </div>
            <button onclick="markAvailable('${item.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-obsidian text-[11px] font-semibold transition shrink-0">Got it ✓</button>
          </div>`).join("")}
      </div>
    </div>` : "";

  const restockSection = document.getElementById("restockAlertSection");
  const flagged = trackedItems().filter(item => getItemStockStatus(item.id) !== "in");
  if (flagged.length === 0) {
    restockSection.innerHTML = `
      <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs text-emerald-300">
        <span>All ${trackedItems().length} tracked bar items are marked <strong>In Stock</strong>.</span>
        <button onclick="closeShoppingModal(); openStockDrawer();" class="underline font-semibold hover:text-white shrink-0">Edit Stock</button>
      </div>`;
  } else {
    restockSection.innerHTML = `
      <div class="p-4 rounded-2xl bg-red-500/10 border border-amber-500/35 space-y-2.5">
        <div class="flex items-center justify-between">
          <h4 class="text-xs uppercase tracking-wider text-amber-300 font-bold">Automatic Bar Restock Alerts (${flagged.length})</h4>
          <button onclick="closeShoppingModal(); openStockDrawer();" class="text-[11px] text-gold hover:underline">Manage Stock</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${flagged.map(item => {
            const st = getItemStockStatus(item.id);
            return `
              <div class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-obsidian/90 border ${st === 'out' ? 'border-red-500/40' : 'border-amber-500/40'} text-xs">
                <div>
                  <span class="font-semibold text-white block">${esc(item.name)}</span>
                  <span class="text-[10px] ${st === 'out' ? 'text-red-400' : 'text-amber-300'} font-bold uppercase">${st === 'out' ? 'Out of Stock' : 'Low Stock'}</span>
                </div>
                <button onclick="setItemStockStatus('${item.id}', 'in')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-obsidian text-[11px] font-semibold transition shrink-0">Restocked ✓</button>
              </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  const mixers = itemsOfKind("mixer");
  document.getElementById("shoppingChecklist").innerHTML = mixers.map(item => {
    const have = isOnHand(item.id);
    return `
      <label class="flex items-center justify-between gap-3 p-3 rounded-xl bg-obsidian/70 border ${have ? 'border-sky-500/30' : 'border-white/10'} hover:border-gold/40 cursor-pointer transition">
        <div class="flex items-center gap-3">
          <input type="checkbox" ${have ? "checked" : ""} onchange="setOnHand('${item.id}', this.checked)" class="w-4 h-4 rounded accent-[#d4a359]" aria-label="${esc(item.name)} on hand" />
          <span class="text-sm ${have ? 'text-gray-100 font-medium' : 'text-gray-400'}">${esc(item.name)}</span>
          ${item.staple ? '<span class="text-[10px] text-emerald-300">staple</span>' : ""}
        </div>
        <span class="text-[11px] px-2 py-0.5 rounded bg-white/5 text-gray-400 shrink-0">${have ? "On hand" : "Not on hand"}</span>
      </label>`;
  }).join("") || `<p class="text-xs text-gray-400">No on-demand mixers in the inventory.</p>`;
}

// Ingredient filter chips (item ids). Spirits + bases share the first group.
function renderMultiFilterControls() {
  const renderGroup = (containerId, items) => {
    document.getElementById(containerId).innerHTML = items.map(item => {
      const active = selectedIngredients.has(item.id);
      return `
        <button type="button" onclick="toggleSelectedIngredient('${item.id}')"
          class="px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
            active
              ? "bg-gold text-obsidian border-gold font-semibold shadow-sm"
              : "bg-charcoal/90 text-gray-300 border-white/10 hover:border-gold/40 hover:text-white"
          }">
          <span>${esc(item.name.replace(/ Syrup$/, ""))}</span>
          ${active ? '<span class="text-[10px] font-bold">✓</span>' : ""}
        </button>`;
    }).join("");
  };
  renderGroup("multiFilterSpirits", [...itemsOfKind("spirit"), ...itemsOfKind("base")]);
  renderGroup("multiFilterSyrups", itemsOfKind("syrup"));
  renderGroup("multiFilterJuices", itemsOfKind("mixer"));

  const count = selectedIngredients.size;
  const badge = document.getElementById("selectedIngCountBadge");
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
  document.getElementById("multiFilterBtnLabel").textContent = count === 0
    ? "Filter Alcohol, Syrups & Juices"
    : `${count} Ingredient${count > 1 ? "s" : ""} Selected (${multiMatchMode === "ALL" ? "Match All" : "Match Any"})`;

  const chipsWrap = document.getElementById("activeIngredientChips");
  if (count === 0) {
    chipsWrap.classList.add("hidden");
    chipsWrap.classList.remove("flex");
    chipsWrap.innerHTML = "";
  } else {
    chipsWrap.classList.remove("hidden");
    chipsWrap.classList.add("flex");
    const chipsHtml = [...selectedIngredients].map(id => `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-medium">
        <span>${esc(itemsById.get(id)?.name || id)}</span>
        <button type="button" onclick="toggleSelectedIngredient('${id}')" class="hover:text-white font-bold leading-none" aria-label="Remove filter">&times;</button>
      </span>`).join("");
    chipsWrap.innerHTML = `
      <span class="text-[11px] text-gray-400 mr-1">Selected (${multiMatchMode === "ALL" ? "AND" : "OR"}):</span>
      ${chipsHtml}
      <button type="button" onclick="clearSelectedIngredients()" class="text-[11px] text-gray-400 hover:text-white underline ml-1">Clear</button>`;
  }
}
