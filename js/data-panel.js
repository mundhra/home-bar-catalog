/*
 * Data panel: export/import backups, download catalog.js, reset to shipped.
 */

// =========================================================================
// CATALOG DATA: EXPORT / IMPORT / PUBLISH / RESET
// =========================================================================
const BACKUP_FORMAT = "private-reserve-backup";

function openDataModal() {
  renderDataModal();
  showModal("dataModal");
}
function closeDataModal() { hideModal("dataModal"); }

function renderDataModal() {
  const counts = `${catalog.recipes.length} recipes · ${catalog.items.length} inventory items`;
  let status;
  if (usingLocalCopy) {
    status = `
      <div class="p-4 rounded-2xl bg-gold/10 border border-gold/30 space-y-1">
        <p class="text-sm text-white font-semibold">You're using an edited copy saved in this browser</p>
        <p class="text-xs text-gray-300">${counts}. Other devices don't see these edits until you export and import them, or publish them as <code class="text-gold">data/catalog.js</code>.</p>
      </div>`;
    if (shippedChangedSinceEdit()) {
      status += `
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-2">
          <p class="text-sm text-amber-200 font-semibold">The shipped catalog has changed since you started editing</p>
          <p class="text-xs text-gray-300">The published version (${esc(shippedCatalog.updated || "undated")}) isn't reflected in your copy. Keep yours, or export a backup and switch to the shipped one.</p>
          <div class="flex flex-wrap gap-2">
            <button onclick="keepLocalCopy()" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white">Keep my copy</button>
            <button onclick="resetToShippedCatalog()" class="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold text-amber-200">Switch to shipped catalog</button>
          </div>
        </div>`;
    }
  } else {
    status = `
      <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
        <p class="text-sm text-white font-semibold">You're using the shipped catalog</p>
        <p class="text-xs text-gray-300">${counts} from <code class="text-gold">data/catalog.js</code>${shippedCatalog?.updated ? `, updated ${esc(shippedCatalog.updated)}` : ""}. Adding, editing or deleting anything saves an edited copy in this browser.</p>
      </div>`;
  }
  if (localLoadError) {
    status += `<div class="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-200">A previously saved edited copy couldn't be read and was ignored. Your next edit will replace it.</div>`;
  }
  if (shippedErrors.length) {
    status += `
      <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-200 space-y-1">
        <p class="font-semibold">data/catalog.js has problems${usingLocalCopy ? " (your edited copy is unaffected)" : ""}:</p>
        <ul class="list-disc pl-4">${shippedErrors.slice(0, 8).map(e => `<li>${esc(e)}</li>`).join("")}</ul>
      </div>`;
  }

  const action = (onclick, title, body, tone = "") => `
    <button onclick="${onclick}" class="w-full text-left p-4 rounded-2xl bg-obsidian/80 border ${tone || "border-white/10 hover:border-gold/50"} transition">
      <span class="block text-sm font-semibold text-white">${title}</span>
      <span class="block text-xs text-gray-400 mt-0.5">${body}</span>
    </button>`;

  document.getElementById("dataModalBody").innerHTML = `
    ${status}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      ${action("exportBackup()", "Export backup (.json)", "Recipes, inventory, stock levels and mixers on hand. Use it to move to another device or keep a safe copy.")}
      ${action("triggerImport()", "Import backup", "Load a backup .json (or a catalog.js). Replaces the catalog in this browser after you confirm.")}
      ${action("downloadCatalogJs()", "Download catalog.js", "Publish your edits for every device: replace <code class='text-gold'>data/catalog.js</code> in the repo and push.")}
      ${usingLocalCopy && shippedCatalog
        ? action("resetToShippedCatalog()", "Reset to shipped catalog", "Discard this browser's edited copy. Export a backup first if you might want it back.", "border-red-500/30 hover:border-red-500/60")
        : ""}
    </div>
    <div id="dataErrors" class="hidden p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-200"></div>`;
}

function showDataErrors(errors) {
  const el = document.getElementById("dataErrors");
  el.innerHTML = `<p class="font-semibold mb-1">That file couldn't be imported:</p><ul class="list-disc pl-4 space-y-0.5">${errors.slice(0, 10).map(e => `<li>${esc(e)}</li>`).join("")}</ul>${errors.length > 10 ? `<p class="mt-1">…and ${errors.length - 10} more.</p>` : ""}`;
  el.classList.remove("hidden");
}

function catalogSnapshot(updated) {
  return { schema: CATALOG_SCHEMA, updated: updated ?? catalog.updated, items: catalog.items, recipes: catalog.recipes };
}

function exportBackup() {
  const payload = {
    format: BACKUP_FORMAT,
    exportedAt: new Date().toISOString(),
    catalog: catalogSnapshot(),
    stock: stockStatuses,
    onHand: mixerOnHand
  };
  downloadFile(`private-reserve-backup-${todayStamp()}.json`, JSON.stringify(payload, null, 2), "application/json");
  showToast("Backup downloaded.");
}

function downloadCatalogJs() {
  const header = [
    "/*",
    " * The Private Reserve — catalog data (inventory items + recipes).",
    " * Loaded by index.html before the app script; works from file:// and GitHub Pages.",
    " * Everything after \"window.BAR_CATALOG = \" is strict JSON. The app's",
    " * \"Catalog Data → Download catalog.js\" regenerates this whole file, and",
    " * \"Import\" accepts the same object. Schema is documented in README.md.",
    " */",
    ""
  ].join("\n");
  const body = JSON.stringify(catalogSnapshot(new Date().toISOString().replace(/\.\d+Z$/, "Z")), null, 2);
  downloadFile("catalog.js", `${header}window.BAR_CATALOG = ${body};\n`, "text/javascript");
  showToast("catalog.js downloaded. Replace data/catalog.js in the repo and push to publish it.");
}

function triggerImport() {
  const input = document.getElementById("importFileInput");
  input.value = "";
  input.click();
}

async function handleImportFile(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  let parsed;
  try {
    let text = await file.text();
    const m = text.match(/^window\.BAR_CATALOG\s*=\s*/m); // accept a catalog.js as well as .json
    if (m) text = text.slice(m.index + m[0].length).trim().replace(/;\s*$/, "");
    parsed = JSON.parse(text);
  } catch (e) {
    return showDataErrors(["It isn't valid JSON or a catalog.js file."]);
  }
  const isBackup = parsed && parsed.format === BACKUP_FORMAT;
  const res = validateCatalog(isBackup ? parsed.catalog : parsed);
  if (!res.catalog) return showDataErrors(res.errors);

  const summary = `Replace the catalog in this browser with ${res.catalog.recipes.length} recipes and ${res.catalog.items.length} inventory items`
    + (isBackup ? ", plus the backup's stock levels and mixers on hand" : "")
    + "?\n\nExport a backup first if you want to keep what you have now.";
  if (!confirm(summary)) return;
  if (!commitCatalog(res.catalog, null, { rebase: true })) return;
  if (isBackup) {
    stockStatuses = sanitizeStock(parsed.stock);
    saveStockStatuses();
    // Older backups stored checklist ticks ("shopping"); a tick meant "got it".
    mixerOnHand = sanitizeOnHand(parsed.onHand
      || Object.fromEntries((Array.isArray(parsed.shopping) ? parsed.shopping : []).map(id => [id, true])));
    saveMixerOnHand();
    refreshAllViews();
  }
  showToast(`Imported ${res.catalog.recipes.length} recipes and ${res.catalog.items.length} items.`);
}

function keepLocalCopy() {
  writeJSON(STORAGE_KEYS.catalog, { basedOn: shippedCatalog.updated, savedAt: new Date().toISOString(), catalog: catalogSnapshot() });
  localBasedOn = shippedCatalog.updated;
  refreshAllViews();
  showToast("Keeping your edited copy.");
}

function resetToShippedCatalog() {
  if (!shippedCatalog) return;
  if (!confirm("Discard this browser's edited copy and switch to the shipped catalog?\n\nExport a backup first if you might want your edits back.")) return;
  removeKey(STORAGE_KEYS.catalog);
  setActiveCatalog(shippedCatalog, false, "");
  localLoadError = false;
  pruneOrphanState();
  refreshAllViews();
  showToast("Switched to the shipped catalog.");
}
