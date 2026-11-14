/*
 * Main: global key handling and start-up. Loaded last.
 */

// Escape closes the top-most dialog; editors ask before discarding changes.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (isModalOpen("recipeEditorModal")) return closeRecipeEditor();
  if (isModalOpen("itemEditorModal")) return closeItemEditor();
  closeRecipeModal();
  closeShoppingModal();
  closeStockDrawer();
  closeDataModal();
});

// =========================================================================
// INITIALIZATION
// =========================================================================
window.addEventListener("DOMContentLoaded", () => {
  loadCatalog();
  stockStatuses = loadStockStatuses();
  mixerOnHand = loadMixerOnHand();
  refreshAllViews();
  renderGlasswareGuide();
  if (shippedChangedSinceEdit()) {
    showToast("The shipped catalog changed since your edits. See Catalog Data.", "warn");
  } else if (shippedErrors.length && !usingLocalCopy) {
    showToast("The catalog couldn't be loaded. See Catalog Data.", "error");
  }
});
