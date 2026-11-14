/*
 * Main: global key handling, start-up and offline support. Loaded last.
 */

// Escape closes the top-most dialog; editors ask before discarding changes.
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (isModalOpen("recipeEditorModal")) return closeRecipeEditor();
  if (isModalOpen("itemEditorModal")) return closeItemEditor();
  if (isModalOpen("menuEditorModal")) return closeMenuEditor();
  closeMenuShare();
  closeRecipeModal();
  closeShoppingModal();
  closeStockDrawer();
  closeDataModal();
  closeShareDialog();
});

// =========================================================================
// INITIALIZATION
// =========================================================================
window.addEventListener("DOMContentLoaded", () => {
  loadCatalog();
  stockStatuses = loadStockStatuses();
  mixerOnHand = loadMixerOnHand();
  partyMenus = loadMenus();
  recipePrefs = loadPrefs();
  refreshAllViews();
  renderGlasswareGuide();
  const guest = parseMenuHash(location.hash);
  if (guest) enterGuestMode(guest);
  if (shippedChangedSinceEdit()) {
    showToast("The shipped catalog changed since your edits. See Catalog Data.", "warn");
  } else if (shippedErrors.length && !usingLocalCopy) {
    showToast("The catalog couldn't be loaded. See Catalog Data.", "error");
  }
});

// Opening or leaving a guest-menu link while the page is open: reload into the right mode.
window.addEventListener("hashchange", () => {
  if (!!parseMenuHash(location.hash) !== !!guestMenu) location.reload();
});

// New-version check. GitHub Pages stamps every file with the deploy time, so one
// HEAD request for index.html tells whether a newer deploy exists. Checked at
// start-up and whenever the app returns to the foreground (an installed iPhone app
// resumes the old page rather than reloading); shows a Reload banner, never reloads
// on its own so nothing in progress is lost.
let loadedVersion = null;
let lastUpdateCheck = 0;

async function fetchDeployStamp() {
  try {
    const res = await fetch(`index.html?v=${Date.now()}`, { method: "HEAD", cache: "no-store" });
    return res.ok ? (res.headers.get("Last-Modified") || res.headers.get("ETag")) : null;
  } catch (e) {
    return null; // offline
  }
}

async function checkForUpdate(force = false) {
  if (!/^https?:$/.test(location.protocol) || navigator.onLine === false) return;
  if (!force && Date.now() - lastUpdateCheck < 60000) return;
  lastUpdateCheck = Date.now();
  const stamp = await fetchDeployStamp();
  if (!stamp) return;
  if (!loadedVersion) loadedVersion = stamp;
  else if (stamp !== loadedVersion) showUpdateBanner();
}

function showUpdateBanner() {
  const el = document.getElementById("updateBanner");
  el.classList.remove("hidden");
  el.classList.add("flex");
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") checkForUpdate();
});
window.addEventListener("load", () => checkForUpdate(true));

// Offline support (see sw.js). Service workers only run over http(s), not file://.
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.warn("Offline support unavailable:", err));
  });
}
