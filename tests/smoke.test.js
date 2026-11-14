/*
 * Browser smoke tests for The Private Reserve. Run with: python tests/run.py
 *
 * tests/run.py loads index.html in headless Chrome with this file appended, once
 * per scenario (the URL hash). Expected values are computed from the raw
 * data/catalog.js (window.__RAW_CATALOG, captured before the app touches it),
 * so the tests keep passing as recipes and inventory are edited.
 */
window.addEventListener("load", () => setTimeout(async () => {
  const out = [];
  const ok = (name, cond, extra = "") => out.push(`${cond ? "PASS" : "FAIL"} ${name}${extra !== "" ? " :: " + extra : ""}`);
  const cards = () => document.querySelectorAll("#recipeGrid article").length;
  const LS = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return "ERR"; } };
  const setVal = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); };
  const fileOf = (text, name) => ({ files: [new File([text], name)] });

  // Stub browser dialogs and downloads.
  let confirmAnswer = true, confirmCalls = 0, alerts = [], downloads = [];
  window.confirm = () => { confirmCalls++; return confirmAnswer; };
  window.alert = m => alerts.push(m);
  window.downloadFile = (name, text, mime) => downloads.push({ name, text, mime });

  // Independent expectations from the raw shipped catalog.
  const RAW = window.__RAW_CATALOG;
  const rawItem = id => RAW.items.find(i => i.id === id);
  const tracked = RAW.items.filter(i => i.kind !== "mixer");
  const mixers = RAW.items.filter(i => i.kind === "mixer");
  const usesOf = id => RAW.recipes.filter(r => r.ingredients.some(i => i.item === id)).length;
  const byUse = list => list.slice().sort((a, b) => usesOf(b.id) - usesOf(a.id));
  const A = byUse(tracked)[0];          // most-used tracked bottle/syrup
  const B = byUse(tracked)[1];          // second most-used tracked item
  const M = byUse(mixers)[0];           // most-used mixer
  // Substitutes and optional ingredients (feature 1) are part of the model.
  const candidatesRaw = i => (i.item ? [i.item, ...(i.substitutes || [])] : []).map(rawItem).filter(Boolean);
  const expectedReady = RAW.recipes.filter(r => r.ingredients.every(i =>
    i.optional === true || candidatesRaw(i).some(it => it.kind !== "mixer" || it.staple === true))).length;
  const N = RAW.recipes.length;
  // availability: { out: Set(trackedIdsOut), onHand: Set(mixerIdsOnHand) }
  const defaultOnHand = () => new Set(mixers.filter(m => m.staple === true).map(m => m.id));
  const availableRaw = (it, av) => it.kind === "mixer" ? av.onHand.has(it.id) : !av.out.has(it.id);
  const missingRaw = (r, av) => [...new Set(r.ingredients
    .filter(i => !i.optional)
    .map(i => candidatesRaw(i))
    .filter(c => c.length && !c.some(it => availableRaw(it, av)))
    .map(c => c[0].id))];
  const countWhere = (av, n) => RAW.recipes.filter(r => missingRaw(r, av).length === n).length;
  const filterCount = value => { setReadinessFilter(value); const c = cards(); setReadinessFilter("ALL"); return c; };

  const mode = location.hash.slice(1) || "main";
  // Over http (offline tests only): keep a slow request to the test server in flight so
  // Chrome's virtual clock waits for service-worker and Cache Storage work.
  const holdClock = () => {
    let done = false;
    (async () => { while (!done) await fetch(`__hold?${Math.random()}`, { cache: "no-store" }).catch(() => {}); })();
    return () => { done = true; };
  };
  try {
    ok("no load errors", __errs.length === 0, __errs.join(" | "));

    if (mode === "legacy") {
      const want = { [tracked[0].id]: "out", [tracked[1].id]: "low" };
      ok("v1 name-keyed stock migrated to ids", JSON.stringify(stockStatuses) === JSON.stringify(want), JSON.stringify(stockStatuses));
      ok("v2 stock key written", JSON.stringify(LS("private_reserve_stock_v2")) === JSON.stringify(want));
      ok("old checklist ticks become on hand", isOnHand(mixers[0].id) && JSON.stringify(LS("private_reserve_onhand_v1")) === JSON.stringify({ [mixers[0].id]: true }));

    } else if (mode === "stale") {
      ok("edited copy active", usingLocalCopy && catalog.recipes.length === N - 1);
      ok("stale copy detected", shippedChangedSinceEdit() === true);
      ok("edited badge visible", !document.getElementById("catalogEditedBadge").classList.contains("hidden"));
      openDataModal();
      ok("stale warning in data panel", document.getElementById("dataModalBody").textContent.includes("has changed since"));
      keepLocalCopy();
      ok("keep my copy rebases", !shippedChangedSinceEdit() && LS("private_reserve_catalog_v1").basedOn === shippedCatalog.updated);
      resetToShippedCatalog();
      ok("reset to shipped", !usingLocalCopy && catalog.recipes.length === N && LS("private_reserve_catalog_v1") === null);

    } else if (mode === "same") {
      ok("copy identical to shipped is dropped on load", !usingLocalCopy && LS("private_reserve_catalog_v1") === null);

    } else if (mode === "share") {
      // Over http with the clock held: canvas, image decoding and fonts are real-time work.
      const release = holdClock();
      const dims = async blob => { const b = await createImageBitmap(blob); return [b.width, b.height]; };
      const first = catalog.recipes[0];
      const blob = await renderRecipeImage(first.id);
      const [w, h] = await dims(blob);
      ok("renders a PNG card", blob.type === "image/png" && blob.size > 30000, `${blob.type} ${blob.size}`);
      ok("card is 1080 wide, at least 4:5", w === 1080 && h >= 1350, `${w}x${h}`);

      const long = JSON.parse(JSON.stringify(first));
      long.id = "zz-long-share"; long.name = "An Unusually Long Cocktail Name That Has To Wrap Over Several Lines";
      long.steps = Array.from({ length: 14 }, (_, i) => `Step ${i + 1}: stir gently for twenty seconds, then taste and adjust the balance before moving on.`);
      commitCatalog({ ...catalog, recipes: [...catalog.recipes, long] });
      const [, hLong] = await dims(await renderRecipeImage("zz-long-share"));
      ok("long recipes get a taller card", hLong > h + 400, `${hLong} vs ${h}`);
      resetToShippedCatalog();

      let shared = null, downloaded = null;
      Object.defineProperty(navigator, "canShare", { configurable: true, value: () => true });
      Object.defineProperty(navigator, "share", { configurable: true, value: async data => { shared = data; } });
      window.downloadBlob = (name, b) => { downloaded = { name, b }; };
      await openShareDialog(first.id);
      const img = document.getElementById("shareImage");
      if (img && !img.complete) await img.decode().catch(() => {});
      ok("preview dialog shows the image", isModalOpen("shareModal") && !!img && img.naturalWidth === 1080);
      ok("Share button offered when the device can share files", document.getElementById("shareModalBody").textContent.includes("Share…"));
      await shareShareImage();
      ok("Share passes the PNG file", !!shared && shared.files.length === 1 && shared.files[0].name === `${first.id}.png` && shared.files[0].type === "image/png");
      downloadShareImage();
      ok("Download saves recipe-id.png", !!downloaded && downloaded.name === `${first.id}.png` && downloaded.b.size === blob.size);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      ok("Escape closes the share dialog", !isModalOpen("shareModal"));
      openRecipeModal(first.id);
      ok("recipe view has Share as Image", document.getElementById("modalContent").textContent.includes("Share as Image"));
      closeRecipeModal();
      release();

    } else if (mode === "update") {
      const release = holdClock();
      await checkForUpdate(true);
      const banner = document.getElementById("updateBanner");
      ok("records the deployed version", typeof loadedVersion === "string" && loadedVersion.length > 0, String(loadedVersion));
      ok("no banner when nothing changed", banner.classList.contains("hidden"));
      loadedVersion = "an older deploy";
      await checkForUpdate(true);
      ok("Reload banner when a newer deploy exists", !banner.classList.contains("hidden"));
      lastUpdateCheck = Date.now();
      const before = lastUpdateCheck;
      await checkForUpdate();
      ok("background checks are throttled to once a minute", lastUpdateCheck === before);
      release();

    } else if (mode === "pwa-install") {
      const release = holdClock();
      // Served over http by tests/run.py. Network requests keep Chrome's virtual clock
      // from racing ahead while the service worker installs and precaches.
      // Wait by real time, not a poll count: slower CI runners take longer to install.
      // Each /__hold request takes ~250 ms, which paces the loop.
      let reg = null;
      const started = Date.now();
      while (!(reg && reg.active && navigator.serviceWorker.controller) && Date.now() - started < 20000) {
        await fetch(`__hold?${Math.random()}`, { cache: "no-store" }).catch(() => {});
        reg = await navigator.serviceWorker.getRegistration();
      }
      // This test page loaded before the worker took control; fetch it once through the
      // worker so the offline run can open it (otherwise it gets the index.html fallback).
      await fetch(location.href.split("#")[0]).catch(() => {});
      release();
      ok("service worker installed and controlling the page", !!(reg && reg.active && navigator.serviceWorker.controller));

    } else if (mode === "pwa-offline") {
      // Same profile, server now drops every connection: everything must come from the service worker.
      const release = holdClock();
      const failed = [];
      for (const path of window.__PRECACHE) {
        const res = await fetch(new URL(path, document.baseURI).href).catch(() => null);
        if (!res || !res.ok) failed.push(path);
      }
      release();
      ok("every PRECACHE file is served offline", failed.length === 0, failed.join(", "));
      ok("stylesheet applied offline", getComputedStyle(document.body).backgroundColor === "rgb(15, 17, 21)");
      ok("all recipes render offline", cards() === N, `${cards()}/${N}`);
      ok("manifest linked", !!document.querySelector('link[rel="manifest"]'));

    } else if (mode === "broken") {
      ok("missing catalog: error state shown", document.getElementById("recipeGrid").textContent.includes("couldn't be loaded"));

    } else {
      // ---------- load & render ----------
      ok("shipped catalog is valid", shippedErrors.length === 0, shippedErrors.slice(0, 3).join(" | "));
      ok("all recipes render", cards() === N, `${cards()}/${N}`);
      ok("using shipped catalog", !usingLocalCopy && LS("private_reserve_catalog_v1") === null);
      ok("header counts", document.getElementById("totalRecipeCount").textContent === String(N)
        && document.getElementById("inventoryTabCount").textContent === String(tracked.length));
      ok("inventory card per item", document.querySelectorAll("#inventorySections .glass-card").length === RAW.items.length);
      ok("stock toggles for every tracked item", document.querySelectorAll('#inventorySections button[onclick^="setItemStockStatus"]').length === tracked.length * 3);
      ok("glassware guide", document.querySelectorAll("#glasswareGuideGrid > div").length === GLASSWARE_GUIDE.length);
      ok("filter chip per item", document.querySelectorAll("#multiFilterSpirits button,#multiFilterSyrups button,#multiFilterJuices button").length === RAW.items.length);

      const wrong = [];
      RAW.items.forEach(it => { selectedIngredients.clear(); toggleSelectedIngredient(it.id); if (cards() !== usesOf(it.id)) wrong.push(`${it.id}=${cards()}/${usesOf(it.id)}`); });
      ok("each chip filters to the recipes using it", wrong.length === 0, wrong.slice(0, 5).join(", "));

      selectedIngredients.clear(); toggleSelectedIngredient(A.id); toggleSelectedIngredient(M.id);
      const anyWant = RAW.recipes.filter(r => r.ingredients.some(i => i.item === A.id || i.item === M.id)).length;
      const allWant = RAW.recipes.filter(r => r.ingredients.some(i => i.item === A.id) && r.ingredients.some(i => i.item === M.id)).length;
      const anyGot = cards(); setMultiMatchMode("ALL"); const allGot = cards();
      ok("Any (OR) / All (AND) matching", anyGot === anyWant && allGot === allWant, `${anyGot}/${anyWant} ${allGot}/${allWant}`);
      setMultiMatchMode("ANY"); resetAllFilters();
      ok("reset filters", cards() === N);

      document.getElementById("readinessFilter").value = "READY_NOW"; applyFilters();
      ok("Bar-Ready derived from ingredients", cards() === expectedReady, `${cards()}/${expectedReady}`);
      resetAllFilters();

      const noted = RAW.recipes.flatMap(r => r.ingredients).find(i => i.item && i.note);
      if (noted) {
        setVal("searchInput", `${rawItem(noted.item).name} (${noted.note}`.toLowerCase());
        ok("search covers ingredient notes", cards() >= 1);
        resetAllFilters();
      }

      // ---------- stock & checklist ----------
      setItemStockStatus(A.id, "out");
      document.getElementById("hideOutOfStockToggle").checked = true; applyFilters();
      ok("hide out-of-stock drinks", cards() === N - usesOf(A.id), `${cards()}/${N - usesOf(A.id)}`);
      ok("stock saved by id", LS("private_reserve_stock_v2")[A.id] === "out");
      ok("stock alert badge", document.getElementById("stockAlertBadge").textContent === "1");
      ok("restock alert lists the item", document.getElementById("restockAlertSection").textContent.includes(A.name));
      resetAllStockStatuses(); resetAllFilters();
      ok("staples default to on hand", mixers.every(m => isOnHand(m.id) === (m.staple === true)));
      setOnHand(M.id, !isOnHand(M.id));
      ok("on-hand change saved", LS("private_reserve_onhand_v1")[M.id] === isOnHand(M.id));
      resetMixersToDefaults();
      ok("reset mixers to defaults", JSON.stringify(LS("private_reserve_onhand_v1")) === "{}" && isOnHand(M.id) === (M.staple === true));

      // ---------- what can I make tonight ----------
      const av = { out: new Set(), onHand: defaultOnHand() };
      ok("can make now (defaults)", filterCount("CAN_MAKE") === countWhere(av, 0), `${filterCount("CAN_MAKE")}/${countWhere(av, 0)}`);
      ok("one ingredient away (defaults)", filterCount("ONE_AWAY") === countWhere(av, 1), `${filterCount("ONE_AWAY")}/${countWhere(av, 1)}`);
      ok("card badges match", document.querySelectorAll("#recipeGrid article").length === N
        && [...document.querySelectorAll("#recipeGrid article")].filter(a => a.textContent.includes("Can make now")).length === countWhere(av, 0));
      ok("tonight summary shows counts", document.getElementById("tonightSummary").textContent.includes(`${countWhere(av, 0)} can make now`)
        && document.getElementById("tonightSummary").textContent.includes(`${countWhere(av, 1)} one ingredient away`));
      setItemStockStatus(A.id, "low");
      ok("low stock still counts as available", filterCount("CAN_MAKE") === countWhere(av, 0));
      setItemStockStatus(A.id, "out"); av.out.add(A.id);
      ok("out of stock removes drinks", filterCount("CAN_MAKE") === countWhere(av, 0) && filterCount("ONE_AWAY") === countWhere(av, 1));
      setOnHand(M.id, true); av.onHand.add(M.id);
      ok("mixer on hand adds drinks", filterCount("CAN_MAKE") === countWhere(av, 0) && filterCount("ONE_AWAY") === countWhere(av, 1));
      const sugg = unlockSuggestions();
      const top = sugg[0];
      const wantUnlocks = top ? RAW.recipes.filter(r => { const m = missingRaw(r, av); return m.length === 1 && m[0] === top.item.id; }).length : 0;
      ok("unlock suggestion counts", !!top && top.unlocks === wantUnlocks && sugg.every((s, i) => i === 0 || sugg[i - 1].unlocks >= s.unlocks), top && `${top.item.id} ${top.unlocks}/${wantUnlocks}`);
      openShoppingModal();
      ok("shopping dialog lists suggestions", document.getElementById("unlockSection").textContent.includes(top.item.name));
      ok("shopping badge counts things to buy", document.getElementById("shoppingBadge").textContent === String(new Set([...Object.keys(stockStatuses), ...sugg.map(s => s.item.id)]).size));
      const before = filterCount("CAN_MAKE");
      markAvailable(top.item.id);
      if (top.item.kind === "mixer") av.onHand.add(top.item.id); else av.out.delete(top.item.id);
      ok("Got it unlocks exactly those drinks", filterCount("CAN_MAKE") === before + top.unlocks && filterCount("CAN_MAKE") === countWhere(av, 0));
      closeShoppingModal();
      const second = unlockSuggestions()[0];
      if (second) {
        showOneAwayFor(second.item.id);
        ok("show one-away drinks for an item", document.getElementById("readinessFilter").value === "ONE_AWAY" && cards() === second.unlocks, `${cards()}/${second.unlocks}`);
      }
      resetAllStockStatuses(); resetMixersToDefaults(); resetAllFilters();
      jumpToIngredient(B.id);
      ok("jump to ingredient", selectedIngredients.has(B.id) && cards() === usesOf(B.id));
      resetAllFilters();

      // ---------- substitutes & optional ingredients ----------
      const subMixer = mixers.find(m => m.id !== M.id && !m.staple) || mixers.find(m => m.id !== M.id);
      const subTest = {
        id: "zz-sub-test", name: "Zz Substitute Test", type: "Mocktail", vibe: VIBES[0], glass: "Highball",
        method: "Build", ice: "Cubed Ice", colors: ["#ffffff", "#000000"], garnishType: "none",
        ingredients: [
          { item: A.id, amount: "30 ml", substitutes: [B.id] },
          { item: subMixer.id, amount: "10 ml", optional: true },
          { name: "Pinch of salt", amount: "1", optional: true }
        ],
        steps: ["Stir."], servingNotes: ""
      };
      ok("substitutes and optional saved", commitCatalog({ ...catalog, recipes: [...catalog.recipes, subTest] }));
      const st = () => recipeById("zz-sub-test");
      setOnHand(subMixer.id, false);
      ok("optional missing mixer doesn't block", canMakeNow(st()) && isBarReady(st()));
      setItemStockStatus(A.id, "out");
      ok("substitute covers an out-of-stock item", canMakeNow(st()) && getRecipeStockAnalysis(st()).outItems.length === 0);
      ok("tile shows the substitute in use", chosenCandidate(st().ingredients[0]).id === B.id);
      openRecipeModal("zz-sub-test");
      ok("recipe view explains the swap", document.getElementById("modalContent").textContent.includes(`Use ${B.name}`)
        && document.getElementById("modalContent").textContent.includes("optional"));
      closeRecipeModal();
      setItemStockStatus(B.id, "out");
      ok("both out: missing lists the listed item", missingItems(st()).length === 1 && missingItems(st())[0].id === A.id
        && getRecipeStockAnalysis(st()).outItems.includes(A.name));
      resetAllStockStatuses(); resetMixersToDefaults();
      alerts = []; openItemEditor("edit", B.id); deleteItemFromEditor();
      ok("item used only as a substitute can't be deleted", alerts.length === 1 && itemsById.has(B.id));
      closeItemEditor();
      const badSub = JSON.parse(JSON.stringify(st())); badSub.ingredients[0].substitutes = ["no-such-item"];
      ok("unknown substitute rejected", validateCatalog({ ...catalog, recipes: [badSub] }).errors.some(e => e.includes("substitutes")));
      // editor round trip
      openRecipeEditor("edit", "zz-sub-test");
      ok("editor shows the substitute chip", document.getElementById("re_ingredients").textContent.includes(`or ${B.name}`));
      removeEditorSubstitute(0, 0);
      const firstRow = document.querySelector("#re_ingredients [data-row]");
      firstRow.querySelector(".re-ing-optional").checked = true;
      addEditorSubstitute(1, M.id);
      saveRecipeEditor();
      const ed = st().ingredients;
      ok("editor saves substitute and optional changes", !ed[0].substitutes && ed[0].optional === true && ed[1].substitutes?.[0] === M.id && ed[1].optional === true);
      closeRecipeModal();
      resetToShippedCatalog();

      // ---------- recipe editor ----------
      openRecipeEditor("add"); saveRecipeEditor();
      ok("empty recipe rejected", !document.getElementById("re_errors").classList.contains("hidden") && catalog.recipes.length === N);
      ok("editor stays open after rejection", isModalOpen("recipeEditorModal"));
      setVal("re_name", "Zz Smoke Test Fizz");
      document.querySelector("#re_ingredients .re-ing-item").value = A.id;
      document.querySelector("#re_ingredients .re-ing-text").value = "Chilled";
      document.querySelector("#re_ingredients .re-ing-amount").value = "45 ml";
      addEditorIngredient();
      const rows = document.querySelectorAll("#re_ingredients [data-row]");
      ok("adding a row keeps typed values", rows.length === 2 && rows[0].querySelector(".re-ing-item").value === A.id && rows[0].querySelector(".re-ing-amount").value === "45 ml");
      rows[1].querySelector(".re-ing-item").value = "";
      rows[1].querySelector(".re-ing-text").value = "Egg white";
      rows[1].querySelector(".re-ing-amount").value = "1";
      setVal("re_steps", "Shake hard.\n\nStrain into a coupe.");
      document.getElementById("re_glass").value = "Coupe"; updateEditorPreview();
      ok("live glass preview", document.getElementById("re_preview").innerHTML.includes("<svg"));
      saveRecipeEditor();
      const added = recipeById("zz-smoke-test-fizz");
      ok("recipe added with slug id", !!added && catalog.recipes.length === N + 1);
      ok("ingredients normalized", added && JSON.stringify(added.ingredients) === JSON.stringify([{ item: A.id, note: "Chilled", amount: "45 ml" }, { name: "Egg white", amount: "1" }]), JSON.stringify(added && added.ingredients));
      ok("blank step lines dropped", added && added.steps.length === 2);
      ok("untracked extra => not Bar-Ready", added && !isBarReady(added));
      ok("saved as edited copy", usingLocalCopy && LS("private_reserve_catalog_v1").catalog.recipes.length === N + 1);
      ok("recipe opens after save", isModalOpen("recipeModal") && document.getElementById("modalContent").textContent.includes(`${A.name} (Chilled)`));
      closeRecipeModal();
      selectedIngredients.clear(); toggleSelectedIngredient(A.id);
      ok("new recipe appears in ingredient filter", cards() === usesOf(A.id) + 1);
      resetAllFilters();

      const first = catalog.recipes[0], firstName = first.name;
      openRecipeEditor("edit", first.id); setVal("re_name", "Zz Renamed"); saveRecipeEditor();
      ok("edit keeps the id", recipeById(first.id).name === "Zz Renamed");
      openRecipeEditor("duplicate", first.id); saveRecipeEditor();
      ok("duplicate gets a new id", !!recipeById("zz-renamed-copy") && catalog.recipes.length === N + 2);
      deleteRecipe("zz-renamed-copy");
      ok("delete recipe", !recipeById("zz-renamed-copy") && catalog.recipes.length === N + 1);
      openRecipeEditor("edit", first.id); setVal("re_name", firstName); saveRecipeEditor();
      deleteRecipe("zz-smoke-test-fizz");
      ok("undoing every edit drops the edited copy", !usingLocalCopy && LS("private_reserve_catalog_v1") === null);
      closeRecipeModal();

      openRecipeEditor("add"); setVal("re_name", "x"); confirmAnswer = false; confirmCalls = 0;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      ok("Escape on a dirty editor asks first", confirmCalls === 1 && isModalOpen("recipeEditorModal"));
      confirmAnswer = true; closeRecipeEditor();
      ok("editor closes after confirming", !isModalOpen("recipeEditorModal"));

      // ---------- escaping ----------
      openRecipeEditor("add"); setVal("re_name", '<img src=x onerror="window.__xss=1">');
      document.querySelector("#re_ingredients .re-ing-item").value = A.id;
      document.querySelector("#re_ingredients .re-ing-amount").value = "<b>9</b>";
      setVal("re_steps", "<script>window.__xss=2<\/script>");
      saveRecipeEditor();
      await new Promise(r => setTimeout(r, 50));
      ok("user text is escaped", window.__xss === undefined && document.getElementById("modalContent").textContent.includes("<img src=x"));
      ok("no injected elements", !document.querySelector("#recipeGrid img, #modalContent img, #modalContent b"));
      closeRecipeModal(); deleteRecipe(catalog.recipes[catalog.recipes.length - 1].id);

      // ---------- item editor ----------
      const items0 = catalog.items.length;
      openItemEditor("add", null, "syrup"); setVal("ie_name", "Zz Smoke Syrup"); saveItemEditor();
      ok("item added", itemsById.get("zz-smoke-syrup")?.kind === "syrup" && document.getElementById("inventoryTabCount").textContent === String(tracked.length + 1));
      openItemEditor("add", null, "syrup"); setVal("ie_name", "zz smoke syrup"); saveItemEditor();
      ok("duplicate item name rejected", !document.getElementById("ie_errors").classList.contains("hidden") && catalog.items.length === items0 + 1);
      closeItemEditor();
      setItemStockStatus(A.id, "low");
      openItemEditor("edit", A.id); setVal("ie_name", `Premium ${A.name}`); saveItemEditor();
      ok("rename keeps stock and recipe links", getItemStockStatus(A.id) === "low" && recipesUsingItem(A.id).length === usesOf(A.id));
      ok("renamed item shows on cards", document.getElementById("recipeGrid").textContent.includes(`Premium ${A.name}`));
      alerts = []; openItemEditor("edit", A.id); deleteItemFromEditor();
      ok("deleting a used item is blocked", alerts.length === 1 && itemsById.has(A.id));
      closeItemEditor();
      openItemEditor("edit", A.id); document.getElementById("ie_kind").value = "mixer"; onItemKindChange();
      ok("kind change warns about stock", !document.getElementById("ie_kind_warning").classList.contains("hidden"));
      saveItemEditor();
      ok("tracked -> mixer clears stock", !(A.id in stockStatuses) && LS("private_reserve_stock_v2")[A.id] === undefined);
      openItemEditor("edit", "zz-smoke-syrup"); deleteItemFromEditor();
      ok("unused item deleted", !itemsById.has("zz-smoke-syrup"));

      // ---------- export / import / publish ----------
      setItemStockStatus(B.id, "out"); setOnHand(M.id, !isOnHand(M.id));
      const mWant = isOnHand(M.id);
      downloads = []; exportBackup();
      const backup = JSON.parse(downloads[0].text);
      ok("backup has catalog, stock, mixers on hand", backup.format === "private-reserve-backup" && backup.catalog.recipes.length === N && backup.stock[B.id] === "out" && backup.onHand[M.id] === mWant);
      downloads = []; downloadCatalogJs();
      const js = downloads[0].text;
      ok("catalog.js is header + assignment", js.startsWith("/*") && /\nwindow\.BAR_CATALOG = \{/.test(js) && js.trim().endsWith("};"));
      const m = js.match(/^window\.BAR_CATALOG\s*=\s*/m);
      ok("downloaded catalog.js validates", validateCatalog(JSON.parse(js.slice(m.index + m[0].length).trim().replace(/;$/, ""))).catalog !== null);

      resetToShippedCatalog(); resetAllStockStatuses(); resetMixersToDefaults();
      ok("back on shipped catalog", !usingLocalCopy && itemsById.get(A.id).kind === A.kind);
      await handleImportFile(fileOf(JSON.stringify(backup), "backup.json"));
      ok("import restores catalog, stock, mixers on hand", usingLocalCopy && itemsById.get(A.id).name === `Premium ${A.name}` && stockStatuses[B.id] === "out" && isOnHand(M.id) === mWant);
      ok("import does not flag the copy as stale", !shippedChangedSinceEdit());
      const oldStyle = { ...backup, onHand: undefined, shopping: [M.id] };
      resetMixersToDefaults();
      await handleImportFile(fileOf(JSON.stringify(oldStyle), "old-backup.json"));
      ok("older backups' checklist ticks import as on hand", isOnHand(M.id) === true);
      openDataModal();
      await handleImportFile(fileOf("{not json", "bad.json"));
      ok("invalid JSON reported", !document.getElementById("dataErrors").classList.contains("hidden"));
      const evil = JSON.parse(JSON.stringify(backup.catalog));
      evil.recipes[0].colors = ['red"><script>', "#000000"];
      evil.recipes[1].ingredients[0].item = "nope";
      evil.items[0].id = "Bad Id";
      renderDataModal();
      await handleImportFile(fileOf(JSON.stringify(evil), "evil.json"));
      const errText = document.getElementById("dataErrors").textContent;
      ok("schema errors reported", errText.includes("colors") && errText.includes("unknown inventory item") && errText.includes("id must be"), errText.slice(0, 160));
      ok("rejected import changes nothing", itemsById.get(A.id).name === `Premium ${A.name}`);
      await handleImportFile(fileOf(js, "catalog.js"));
      ok("catalog.js file is importable", usingLocalCopy && catalog.recipes.length === N);
      closeDataModal();

      // ---------- dialogs & tabs ----------
      resetToShippedCatalog();
      openRecipeModal(catalog.recipes[0].id);
      ok("recipe modal has edit actions", document.getElementById("modalContent").textContent.includes("Edit Recipe"));
      closeRecipeModal();
      openShoppingModal(); ok("on-hand list shows every mixer", document.querySelectorAll("#shoppingChecklist label").length === mixers.length); closeShoppingModal();
      openStockDrawer(); ok("stock drawer lists every tracked item", document.querySelectorAll("#stockDrawerList > div").length === tracked.length); closeStockDrawer();
      switchTab("inventory"); switchTab("glassware"); switchTab("menu");
      ok("tabs switch", !document.getElementById("view-menu").classList.contains("hidden"));
    }
    ok("no runtime errors", __errs.length === 0, __errs.join(" | "));
  } catch (e) {
    out.push(`CRASH ${e.message} ${(e.stack || "").split("\n")[1] || ""}`);
  }
  const pre = document.createElement("pre");
  pre.id = "__results";
  pre.textContent = out.join("\n");
  document.body.appendChild(pre);
}, 300));
