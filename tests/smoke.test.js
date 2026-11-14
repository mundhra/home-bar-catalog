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
  const expectedReady = RAW.recipes.filter(r => r.ingredients.every(i => {
    const it = i.item && rawItem(i.item);
    return it && (it.kind !== "mixer" || it.staple === true);
  })).length;
  const N = RAW.recipes.length;

  const mode = location.hash.slice(1) || "main";
  try {
    ok("no load errors", __errs.length === 0, __errs.join(" | "));

    if (mode === "legacy") {
      const want = { [tracked[0].id]: "out", [tracked[1].id]: "low" };
      ok("v1 name-keyed stock migrated to ids", JSON.stringify(stockStatuses) === JSON.stringify(want), JSON.stringify(stockStatuses));
      ok("v2 stock key written", JSON.stringify(LS("private_reserve_stock_v2")) === JSON.stringify(want));
      ok("checklist restored, unknown ids dropped", checkedShoppingItems.has(mixers[0].id) && !checkedShoppingItems.has("bogus"));

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
      toggleShoppingItem(M.id);
      ok("checklist tick saved", JSON.stringify(LS("private_reserve_shopping_v1")) === JSON.stringify([M.id]));
      resetChecklist();
      ok("checklist reset saved", JSON.stringify(LS("private_reserve_shopping_v1")) === "[]");
      jumpToIngredient(B.id);
      ok("jump to ingredient", selectedIngredients.has(B.id) && cards() === usesOf(B.id));
      resetAllFilters();

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
      setItemStockStatus(B.id, "out"); toggleShoppingItem(M.id);
      downloads = []; exportBackup();
      const backup = JSON.parse(downloads[0].text);
      ok("backup has catalog, stock, checklist", backup.format === "private-reserve-backup" && backup.catalog.recipes.length === N && backup.stock[B.id] === "out" && backup.shopping.includes(M.id));
      downloads = []; downloadCatalogJs();
      const js = downloads[0].text;
      ok("catalog.js is header + assignment", js.startsWith("/*") && /\nwindow\.BAR_CATALOG = \{/.test(js) && js.trim().endsWith("};"));
      const m = js.match(/^window\.BAR_CATALOG\s*=\s*/m);
      ok("downloaded catalog.js validates", validateCatalog(JSON.parse(js.slice(m.index + m[0].length).trim().replace(/;$/, ""))).catalog !== null);

      resetToShippedCatalog(); resetAllStockStatuses(); resetChecklist();
      ok("back on shipped catalog", !usingLocalCopy && itemsById.get(A.id).kind === A.kind);
      await handleImportFile(fileOf(JSON.stringify(backup), "backup.json"));
      ok("import restores catalog, stock, checklist", usingLocalCopy && itemsById.get(A.id).name === `Premium ${A.name}` && stockStatuses[B.id] === "out" && checkedShoppingItems.has(M.id));
      ok("import does not flag the copy as stale", !shippedChangedSinceEdit());
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
      openShoppingModal(); ok("checklist lists every mixer", document.querySelectorAll("#shoppingChecklist label").length === mixers.length); closeShoppingModal();
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
