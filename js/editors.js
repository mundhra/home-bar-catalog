/*
 * Editors: recipe builder and inventory item editor.
 */

// =========================================================================
// RECIPE EDITOR (add / edit / duplicate / delete)
// =========================================================================
const INPUT_CLS = "w-full px-3 py-2 rounded-xl bg-obsidian border border-white/10 focus:border-gold focus:outline-none text-sm text-white placeholder-gray-500";
const LABEL_CLS = "block text-[11px] uppercase tracking-wider text-gold font-semibold mb-1";
let recipeEditor = null; // { mode, id, draft }
let editorDirty = false;

function markEditorDirty() { editorDirty = true; }
function confirmDiscard() { return !editorDirty || confirm("Discard your unsaved changes?"); }

function optionsHtml(values, current, labels = {}) {
  return values.map(v => `<option value="${esc(v)}" ${v === current ? "selected" : ""}>${esc(labels[v] || v)}</option>`).join("");
}
function datalistHtml(id, values) {
  return `<datalist id="${id}">${[...new Set(values.filter(Boolean))].sort().map(v => `<option value="${esc(v)}"></option>`).join("")}</datalist>`;
}

function openRecipeEditor(mode, id) {
  let draft;
  if (mode === "add") {
    draft = {
      name: "", type: "Cocktail", vibe: VIBES[0], glass: "Highball", method: "", ice: "",
      colors: ["#d4a359", "#92400e"], garnishType: "citrus-wheel",
      ingredients: [], steps: [], servingNotes: ""
    };
  } else {
    const src = recipeById(id);
    if (!src) return;
    draft = JSON.parse(JSON.stringify(src));
    if (mode === "duplicate") draft.name = `${src.name} (Copy)`;
  }
  // Editor rows: text is the note for inventory items, or the name for "other"
  draft.rows = draft.ingredients.map(i => ({
    item: i.item || "", text: i.item ? (i.note || "") : (i.name || ""), amount: i.amount || "",
    optional: i.optional === true, subs: [...(i.substitutes || [])]
  }));
  if (!draft.rows.length) draft.rows.push(blankEditorRow());
  recipeEditor = { mode, id: mode === "edit" ? id : null, draft };
  editorDirty = mode === "duplicate";
  closeRecipeModal();
  renderRecipeEditor();
  showModal("recipeEditorModal");
  document.getElementById("re_name").focus();
}

function ingredientOptions(selected) {
  const groups = KIND_ORDER.map(kind => {
    const list = itemsOfKind(kind);
    if (!list.length) return "";
    return `<optgroup label="${esc(ITEM_KINDS[kind].label)}">${list.map(it =>
      `<option value="${it.id}" ${it.id === selected ? "selected" : ""}>${esc(it.name)}</option>`).join("")}</optgroup>`;
  }).join("");
  return `<option value="" ${!selected ? "selected" : ""}>Other (not in inventory)…</option>${groups}`;
}

function blankEditorRow() { return { item: "", text: "", amount: "", optional: false, subs: [] }; }

// "Optional" checkbox + substitutes (only for inventory items).
function renderSubstituteControls(row, idx) {
  const chips = row.subs.map((id, j) => `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-200 text-[11px]">
      or ${esc(itemsById.get(id)?.name || id)}
      <button type="button" onclick="removeEditorSubstitute(${idx}, ${j})" class="font-bold hover:text-white" aria-label="Remove substitute">&times;</button>
    </span>`).join("");
  const options = catalog.items.filter(it => it.id !== row.item && !row.subs.includes(it.id))
    .map(it => `<option value="${it.id}">${esc(it.name)}</option>`).join("");
  return `
    <div class="col-span-full flex flex-wrap items-center gap-2 pt-1">
      <label class="inline-flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
        <input type="checkbox" class="re-ing-optional w-3.5 h-3.5 rounded accent-[#d4a359]" ${row.optional ? "checked" : ""} /> Optional
      </label>
      ${row.item ? `
        ${chips}
        <select onchange="addEditorSubstitute(${idx}, this.value)" class="px-2 py-1 rounded-lg bg-obsidian border border-white/10 text-[11px] text-gray-300 focus:border-gold focus:outline-none" aria-label="Add a substitute for ingredient ${idx + 1}">
          <option value="">+ or… (substitute)</option>${options}
        </select>` : ""}
    </div>`;
}

function renderEditorIngredientRows() {
  return recipeEditor.draft.rows.map((row, idx) => `
    <div data-row data-subs="${esc(JSON.stringify(row.subs))}" class="grid grid-cols-[minmax(0,1fr)_6.5rem_auto] sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_7rem_auto] gap-2 items-center p-2 rounded-xl bg-obsidian/60 border border-white/5">
      <select class="re-ing-item col-span-3 sm:col-span-1 ${INPUT_CLS}" onchange="onEditorItemChange(this)" aria-label="Ingredient ${idx + 1}">${ingredientOptions(row.item)}</select>
      <input class="re-ing-text ${INPUT_CLS}" value="${esc(row.text)}" placeholder="${row.item ? "Note, e.g. Chilled" : "Ingredient name"}" aria-label="Ingredient ${idx + 1} ${row.item ? "note" : "name"}" />
      <input class="re-ing-amount ${INPUT_CLS}" value="${esc(row.amount)}" placeholder="45 ml" aria-label="Ingredient ${idx + 1} amount" />
      <button type="button" onclick="removeEditorIngredient(${idx})" class="w-8 h-8 rounded-lg text-gray-400 hover:text-red-300 hover:bg-red-500/15 text-lg leading-none" aria-label="Remove ingredient ${idx + 1}">&times;</button>
      ${renderSubstituteControls(row, idx)}
    </div>`).join("");
}

function renderRecipeEditor() {
  const d = recipeEditor.draft;
  const title = { add: "Add a Recipe", edit: "Edit Recipe", duplicate: "Duplicate Recipe" }[recipeEditor.mode];
  document.getElementById("recipeEditorBody").innerHTML = `
    <div class="p-5 sm:p-8 space-y-5" oninput="markEditorDirty()" onchange="markEditorDirty()">
      <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span class="text-xs uppercase tracking-widest text-gold font-semibold">Recipe Builder</span>
          <h3 class="font-serif text-2xl font-bold text-white mt-0.5">${title}</h3>
        </div>
        <button type="button" onclick="closeRecipeEditor()" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
        <div class="space-y-3">
          <div>
            <label class="${LABEL_CLS}" for="re_name">Drink name</label>
            <input id="re_name" class="${INPUT_CLS}" value="${esc(d.name)}" maxlength="80" placeholder="e.g. Smoky Hazelnut Old Fashioned" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="${LABEL_CLS}" for="re_type">Category</label>
              <select id="re_type" class="${INPUT_CLS}">${optionsHtml(DRINK_TYPES, d.type)}</select>
            </div>
            <div>
              <label class="${LABEL_CLS}" for="re_vibe">Flavour vibe</label>
              <select id="re_vibe" class="${INPUT_CLS}">${optionsHtml(VIBES, d.vibe)}</select>
            </div>
          </div>
        </div>
        <div id="re_preview" class="flex items-center justify-center bg-obsidian/70 rounded-2xl border border-white/10 p-2 sm:p-3" aria-hidden="true">
          ${renderGlassSVG(d.glass, d.colors, d.garnishType, "editor-preview")}
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label class="${LABEL_CLS}" for="re_glass">Glass</label>
          <select id="re_glass" class="${INPUT_CLS}" onchange="updateEditorPreview()">${optionsHtml(GLASSES, d.glass, GLASS_LABELS)}</select>
        </div>
        <div>
          <label class="${LABEL_CLS}" for="re_garnish">Garnish</label>
          <select id="re_garnish" class="${INPUT_CLS}" onchange="updateEditorPreview()">${optionsHtml(GARNISHES, d.garnishType, GARNISH_LABELS)}</select>
        </div>
        <div>
          <label class="${LABEL_CLS}" for="re_c1">Top colour</label>
          <input id="re_c1" type="color" value="${esc(d.colors[0])}" oninput="updateEditorPreview()" class="w-full h-10 rounded-xl bg-obsidian border border-white/10 p-1 cursor-pointer" />
        </div>
        <div>
          <label class="${LABEL_CLS}" for="re_c2">Bottom colour</label>
          <input id="re_c2" type="color" value="${esc(d.colors[1])}" oninput="updateEditorPreview()" class="w-full h-10 rounded-xl bg-obsidian border border-white/10 p-1 cursor-pointer" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="${LABEL_CLS}" for="re_method">Technique</label>
          <input id="re_method" class="${INPUT_CLS}" list="re_methods" value="${esc(d.method)}" placeholder="e.g. Shake & Strain" />
          ${datalistHtml("re_methods", catalog.recipes.map(r => r.method))}
        </div>
        <div>
          <label class="${LABEL_CLS}" for="re_ice">Ice</label>
          <input id="re_ice" class="${INPUT_CLS}" list="re_ices" value="${esc(d.ice)}" placeholder="e.g. Large Cubed Ice" />
          ${datalistHtml("re_ices", catalog.recipes.map(r => r.ice))}
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="${LABEL_CLS} mb-0">Ingredients</span>
          <button type="button" onclick="addEditorIngredient()" class="text-xs text-gold hover:underline font-semibold">+ Add ingredient</button>
        </div>
        <div id="re_ingredients" class="space-y-2">${renderEditorIngredientRows()}</div>
        <p class="text-[11px] text-gray-400">Pick from your inventory so stock tracking, filters and Bar-Ready work. Use “Other” for anything you don't track (e.g. egg white, bitters).</p>
      </div>

      <div>
        <label class="${LABEL_CLS}" for="re_steps">Preparation steps <span class="normal-case tracking-normal text-gray-400 font-normal">(one per line)</span></label>
        <textarea id="re_steps" rows="5" class="${INPUT_CLS}" placeholder="Fill a rocks glass with ice.&#10;Add the whisky and syrup.&#10;Stir for 20 seconds.">${esc(d.steps.join("\n"))}</textarea>
      </div>

      <div>
        <label class="${LABEL_CLS}" for="re_notes">Garnish &amp; serving notes</label>
        <textarea id="re_notes" rows="2" class="${INPUT_CLS}">${esc(d.servingNotes)}</textarea>
      </div>

      <div id="re_errors" class="hidden p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-200"></div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
        <button type="button" onclick="closeRecipeEditor()" class="px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5">Cancel</button>
        <button type="button" onclick="saveRecipeEditor()" class="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-obsidian font-semibold text-sm">Save Recipe</button>
      </div>
    </div>`;
}

function syncRecipeDraftFromForm() {
  const d = recipeEditor.draft;
  const v = id => document.getElementById(id).value;
  d.name = v("re_name");
  d.type = v("re_type");
  d.vibe = v("re_vibe");
  d.glass = v("re_glass");
  d.garnishType = v("re_garnish");
  d.colors = [v("re_c1"), v("re_c2")];
  d.method = v("re_method");
  d.ice = v("re_ice");
  d.steps = v("re_steps").split("\n").map(s => s.trim()).filter(Boolean);
  d.servingNotes = v("re_notes");
  d.rows = [...document.querySelectorAll("#re_ingredients [data-row]")].map(row => {
    const item = row.querySelector(".re-ing-item").value;
    let subs = [];
    try { subs = JSON.parse(row.dataset.subs || "[]"); } catch (e) { subs = []; }
    return {
      item,
      text: row.querySelector(".re-ing-text").value,
      amount: row.querySelector(".re-ing-amount").value,
      optional: row.querySelector(".re-ing-optional").checked,
      subs: item ? subs.filter(s => s !== item) : []
    };
  });
}

function updateEditorPreview() {
  const v = id => document.getElementById(id).value;
  document.getElementById("re_preview").innerHTML =
    renderGlassSVG(v("re_glass"), [v("re_c1"), v("re_c2")], v("re_garnish"), "editor-preview");
}

function rerenderEditorRows() {
  document.getElementById("re_ingredients").innerHTML = renderEditorIngredientRows();
  markEditorDirty();
}
function addEditorSubstitute(idx, id) {
  if (!id) return;
  syncRecipeDraftFromForm();
  const row = recipeEditor.draft.rows[idx];
  if (row && id !== row.item && !row.subs.includes(id)) row.subs.push(id);
  rerenderEditorRows();
}
function removeEditorSubstitute(idx, j) {
  syncRecipeDraftFromForm();
  recipeEditor.draft.rows[idx].subs.splice(j, 1);
  rerenderEditorRows();
}

function onEditorItemChange(select) {
  const text = select.closest("[data-row]").querySelector(".re-ing-text");
  text.placeholder = select.value ? "Note, e.g. Chilled" : "Ingredient name";
}

function addEditorIngredient() {
  syncRecipeDraftFromForm();
  recipeEditor.draft.rows.push(blankEditorRow());
  document.getElementById("re_ingredients").innerHTML = renderEditorIngredientRows();
  markEditorDirty();
  const selects = document.querySelectorAll("#re_ingredients .re-ing-item");
  selects[selects.length - 1].focus();
}

function removeEditorIngredient(idx) {
  syncRecipeDraftFromForm();
  recipeEditor.draft.rows.splice(idx, 1);
  if (!recipeEditor.draft.rows.length) recipeEditor.draft.rows.push(blankEditorRow());
  document.getElementById("re_ingredients").innerHTML = renderEditorIngredientRows();
  markEditorDirty();
}

function showFormErrors(id, errors) {
  const el = document.getElementById(id);
  el.innerHTML = `<p class="font-semibold mb-1">Please fix the following:</p><ul class="list-disc pl-4 space-y-0.5">${errors.map(e => `<li>${esc(e)}</li>`).join("")}</ul>`;
  el.classList.remove("hidden");
  el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function saveRecipeEditor() {
  syncRecipeDraftFromForm();
  const d = recipeEditor.draft;
  const errors = [];
  if (!d.name.trim()) errors.push("Give the drink a name.");
  const rows = d.rows.filter(r => r.item || r.text.trim() || r.amount.trim());
  if (!rows.length) errors.push("Add at least one ingredient.");
  rows.forEach((r, n) => {
    if (!r.item && !r.text.trim()) errors.push(`Ingredient ${n + 1}: choose an inventory item or type a name.`);
    if (!r.amount.trim()) errors.push(`Ingredient ${n + 1}: add an amount (e.g. 45 ml, Top, 2 dashes).`);
  });
  if (!d.steps.length) errors.push("Add at least one preparation step.");
  if (errors.length) return showFormErrors("re_errors", errors);

  const recipe = {
    id: recipeEditor.id, name: d.name, type: d.type, vibe: d.vibe, glass: d.glass,
    method: d.method, ice: d.ice, colors: d.colors, garnishType: d.garnishType,
    ingredients: rows.map(r => {
      const ing = r.item ? { item: r.item, note: r.text, amount: r.amount, substitutes: r.subs } : { name: r.text, amount: r.amount };
      if (r.optional) ing.optional = true;
      return ing;
    }),
    steps: d.steps, servingNotes: d.servingNotes
  };
  const recipes = catalog.recipes.slice();
  if (recipeEditor.mode === "edit") {
    recipes[recipes.findIndex(r => r.id === recipe.id)] = recipe;
  } else {
    recipe.id = uniqueId(slugify(recipe.name), new Set(recipes.map(r => r.id)));
    recipes.push(recipe);
  }
  if (commitCatalog({ ...catalog, recipes }, `Saved “${recipe.name.trim()}”.`)) {
    editorDirty = false;
    hideModal("recipeEditorModal");
    openRecipeModal(recipe.id);
  }
}

function closeRecipeEditor() {
  if (!confirmDiscard()) return;
  editorDirty = false;
  hideModal("recipeEditorModal");
}

function deleteRecipe(id) {
  const r = recipeById(id);
  if (!r) return;
  if (!confirm(`Delete “${r.name}”?\n\nIt's removed from this browser's catalog. To get it back later, import a backup or reset to the shipped catalog.`)) return;
  closeRecipeModal();
  commitCatalog({ ...catalog, recipes: catalog.recipes.filter(x => x.id !== id) }, `Deleted “${r.name}”.`);
}

// =========================================================================
// INVENTORY ITEM EDITOR
// =========================================================================
let itemEditor = null; // { mode, id }

function openItemEditor(mode, id, kind) {
  const it = mode === "edit"
    ? { ...itemsById.get(id) }
    : { name: "", kind: kind || "spirit", category: "", profile: "", notes: "", staple: false };
  if (mode === "edit" && !it.id) return;
  itemEditor = { mode, id: mode === "edit" ? id : null, originalKind: it.kind };
  editorDirty = false;
  const uses = mode === "edit" ? recipesUsingItem(id) : [];
  const categories = catalog.items.map(i => i.category);
  document.getElementById("itemEditorBody").innerHTML = `
    <div class="p-5 sm:p-8 space-y-4" oninput="markEditorDirty()" onchange="markEditorDirty()">
      <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span class="text-xs uppercase tracking-widest text-gold font-semibold">Bar Inventory</span>
          <h3 class="font-serif text-2xl font-bold text-white mt-0.5">${mode === "edit" ? "Edit Item" : "Add an Item"}</h3>
          ${mode === "edit" ? `<p class="text-xs text-gray-400 mt-1">Used in ${uses.length} drink${uses.length === 1 ? "" : "s"}.</p>` : ""}
        </div>
        <button type="button" onclick="closeItemEditor()" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div>
        <label class="${LABEL_CLS}" for="ie_name">Name</label>
        <input id="ie_name" class="${INPUT_CLS}" value="${esc(it.name)}" maxlength="60" placeholder="e.g. Elderflower Syrup" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="${LABEL_CLS}" for="ie_kind">Section</label>
          <select id="ie_kind" class="${INPUT_CLS}" onchange="onItemKindChange()">${optionsHtml(KIND_ORDER, it.kind, Object.fromEntries(KIND_ORDER.map(k => [k, ITEM_KINDS[k].label])))}</select>
        </div>
        <div>
          <label class="${LABEL_CLS}" for="ie_category">Category label</label>
          <input id="ie_category" class="${INPUT_CLS}" list="ie_categories" value="${esc(it.category)}" placeholder="e.g. Base Spirit" />
          ${datalistHtml("ie_categories", categories)}
        </div>
      </div>
      <div>
        <label class="${LABEL_CLS}" for="ie_profile">Flavour profile</label>
        <input id="ie_profile" class="${INPUT_CLS}" value="${esc(it.profile)}" placeholder="e.g. Floral / Light" />
      </div>
      <div>
        <label class="${LABEL_CLS}" for="ie_notes">Notes</label>
        <textarea id="ie_notes" rows="3" class="${INPUT_CLS}" placeholder="Pairings, serving tips…">${esc(it.notes)}</textarea>
      </div>
      <label id="ie_staple_row" class="${it.kind === "mixer" ? "flex" : "hidden"} items-start gap-2.5 p-3 rounded-xl bg-obsidian/70 border border-white/10 cursor-pointer">
        <input id="ie_staple" type="checkbox" ${it.staple ? "checked" : ""} class="mt-0.5 w-4 h-4 rounded accent-[#d4a359]" />
        <span class="text-xs text-gray-300"><strong class="text-white">Always on hand.</strong> Drinks that need this still count as Bar-Ready (like soda or tonic).</span>
      </label>
      <p id="ie_kind_warning" class="hidden text-xs text-amber-300">On-demand mixers aren't stock-tracked, so this item's stock status will be cleared.</p>
      <div id="ie_errors" class="hidden p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-200"></div>
      <div class="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
        ${mode === "edit"
          ? `<button type="button" onclick="deleteItemFromEditor()" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/15 border border-red-500/30 transition">Delete</button>`
          : "<span></span>"}
        <div class="flex gap-2">
          <button type="button" onclick="closeItemEditor()" class="px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5">Cancel</button>
          <button type="button" onclick="saveItemEditor()" class="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-obsidian font-semibold text-sm">Save Item</button>
        </div>
      </div>
    </div>`;
  showModal("itemEditorModal");
  document.getElementById("ie_name").focus();
}

function onItemKindChange() {
  const kind = document.getElementById("ie_kind").value;
  const row = document.getElementById("ie_staple_row");
  row.classList.toggle("hidden", kind !== "mixer");
  row.classList.toggle("flex", kind === "mixer");
  const losesStock = itemEditor.mode === "edit" && ITEM_KINDS[itemEditor.originalKind].tracked && !ITEM_KINDS[kind].tracked
    && getItemStockStatus(itemEditor.id) !== "in";
  document.getElementById("ie_kind_warning").classList.toggle("hidden", !losesStock);
}

function saveItemEditor() {
  const v = id => document.getElementById(id).value.trim();
  const name = v("ie_name"), kind = v("ie_kind");
  const errors = [];
  if (!name) errors.push("Give the item a name.");
  const clash = catalog.items.find(i => i.name.toLowerCase() === name.toLowerCase() && i.id !== itemEditor.id);
  if (clash) errors.push(`“${clash.name}” is already in your inventory.`);
  if (errors.length) return showFormErrors("ie_errors", errors);

  const item = {
    id: itemEditor.id, name, kind, category: v("ie_category"), profile: v("ie_profile"), notes: v("ie_notes"),
    staple: kind === "mixer" && document.getElementById("ie_staple").checked
  };
  const items = catalog.items.slice();
  if (itemEditor.mode === "edit") {
    items[items.findIndex(i => i.id === item.id)] = item;
  } else {
    item.id = uniqueId(slugify(name), new Set(items.map(i => i.id)));
    items.push(item);
  }
  if (commitCatalog({ ...catalog, items }, `Saved “${name}”.`)) {
    editorDirty = false;
    hideModal("itemEditorModal");
  }
}

function deleteItemFromEditor() {
  const it = itemsById.get(itemEditor.id);
  const uses = recipesReferencingItem(it.id);
  if (uses.length) {
    const names = uses.slice(0, 5).map(r => `• ${r.name}`).join("\n") + (uses.length > 5 ? `\n…and ${uses.length - 5} more` : "");
    alert(`“${it.name}” is used in ${uses.length} drink${uses.length > 1 ? "s" : ""}:\n\n${names}\n\nRemove it from those recipes first. If you've simply run out, mark it Out of Stock instead.`);
    return;
  }
  if (!confirm(`Delete “${it.name}” from your inventory?`)) return;
  editorDirty = false;
  hideModal("itemEditorModal");
  commitCatalog({ ...catalog, items: catalog.items.filter(i => i.id !== it.id) }, `Deleted “${it.name}”.`);
}

function closeItemEditor() {
  if (!confirmDiscard()) return;
  editorDirty = false;
  hideModal("itemEditorModal");
}
