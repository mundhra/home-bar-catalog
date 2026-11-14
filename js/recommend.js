/*
 * Recommendations: "Picked for you" (from favourites and ratings) and
 * "Similar drinks" (in the recipe view). Pure client-side scoring:
 *   similarity = weighted overlap of inventory items (bottles/syrups count
 *   double vs mixers) + a bonus for the same vibe and the same category.
 */

// Inventory items a recipe uses (listed items only, not substitutes), with weights.
function recipeItemWeights(r) {
  const w = new Map();
  r.ingredients.forEach(i => {
    const it = i.item && itemsById.get(i.item);
    if (it) w.set(it.id, isTracked(it) ? 1 : 0.5);
  });
  return w;
}

// 0..~1.3: weighted Jaccard on ingredients + 0.2 same vibe + 0.1 same category.
function recipeSimilarity(a, b) {
  const wa = recipeItemWeights(a), wb = recipeItemWeights(b);
  let shared = 0, union = 0;
  new Set([...wa.keys(), ...wb.keys()]).forEach(id => {
    const x = wa.get(id) || 0, y = wb.get(id) || 0;
    shared += Math.min(x, y);
    union += Math.max(x, y);
  });
  return (union ? shared / union : 0) + (a.vibe === b.vibe ? 0.2 : 0) + (a.type === b.type ? 0.1 : 0);
}

const MIN_RECOMMEND_SCORE = 0.3;

// Drinks to suggest from what you like. Liked = favourites (weight 1) and
// rated 3+ stars (stars / 5). Drinks rated 1-2 are never suggested.
// Score = best match to any liked drink + 0.2 × the rest, ×1.25 if makeable now;
// results are interleaved across liked drinks (see interleaveByReason).
function recommendations(limit = 6) {
  const liked = catalog.recipes
    .map(r => ({ r, w: Math.max(isFavourite(r.id) ? 1 : 0, ratingOf(r.id) >= 3 ? ratingOf(r.id) / 5 : 0) }))
    .filter(x => x.w > 0);
  if (!liked.length) return [];
  const exclude = id => isFavourite(id) || ratingOf(id) > 0;
  const scored = catalog.recipes
    .filter(c => !exclude(c.id))
    .map(c => {
      let best = null, score = 0;
      liked.forEach(({ r, w }) => {
        const s = w * recipeSimilarity(c, r);
        score += s;
        if (!best || s > best.s) best = { r, s };
      });
      // Best single match, plus a little for resembling several liked drinks; averaging
      // instead would let one favourite crowd out the others.
      score = (best.s + 0.2 * (score - best.s)) * (canMakeNow(c) ? 1.25 : 1);
      return { recipe: c, score, because: best.r };
    })
    .filter(x => x.score >= MIN_RECOMMEND_SCORE)
    .sort((a, b) => b.score - a.score || a.recipe.name.localeCompare(b.recipe.name));
  return interleaveByReason(scored, limit);
}

// Take picks round-robin across the liked drinks they come from (strongest group
// first), so one favourite with many close relatives can't fill the whole strip.
function interleaveByReason(sorted, limit) {
  const groups = new Map();
  sorted.forEach(x => {
    if (!groups.has(x.because.id)) groups.set(x.because.id, []);
    groups.get(x.because.id).push(x);
  });
  const queues = [...groups.values()];
  const out = [];
  while (out.length < limit && queues.some(q => q.length)) {
    queues.forEach(q => { if (q.length && out.length < limit) out.push(q.shift()); });
  }
  return out;
}

function similarRecipes(r, limit = 3) {
  return catalog.recipes
    .filter(c => c.id !== r.id && ratingOf(c.id) !== 1 && ratingOf(c.id) !== 2)
    .map(c => ({ recipe: c, score: recipeSimilarity(r, c) * (canMakeNow(c) ? 1.1 : 1) }))
    .filter(x => x.score >= MIN_RECOMMEND_SCORE)
    .sort((a, b) => b.score - a.score || a.recipe.name.localeCompare(b.recipe.name))
    .slice(0, limit)
    .map(x => x.recipe);
}

// "Picked for you" strip above the grid; hidden while filters are active.
function renderRecommendations(isFiltered) {
  const el = document.getElementById("recommendStrip");
  const picks = isFiltered ? [] : recommendations();
  el.classList.toggle("hidden", picks.length === 0);
  if (!picks.length) { el.innerHTML = ""; return; }
  el.innerHTML = `
    <div class="flex items-baseline justify-between gap-2 px-1">
      <h3 class="font-serif text-xl font-bold text-white">Picked for you</h3>
      <span class="text-[11px] text-gray-400">From your favourites and ratings</span>
    </div>
    <div class="flex gap-3 overflow-x-auto snap-x pb-2 scrollbar-thin">
      ${picks.map(({ recipe: r, because }) => `
        <button type="button" onclick="openRecipeModal('${r.id}')" class="snap-start shrink-0 w-56 text-left glass-card rounded-2xl p-3 flex items-center gap-3 group">
          <span class="min-w-0 flex-1">
            <span class="block font-serif text-lg font-bold text-white group-hover:text-gold leading-tight">${esc(r.name)}</span>
            <span class="block text-[11px] text-gray-400 mt-1 line-clamp-2">Because you like ${esc(because.name)}</span>
            ${canMakeNow(r) ? `<span class="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">✓ Can make now</span>` : ""}
          </span>
          <span class="shrink-0 [&>svg]:w-10 [&>svg]:h-12" aria-hidden="true">${renderGlassSVG(r.glass, r.colors, r.garnishType, `rec-${r.id}`)}</span>
        </button>`).join("")}
    </div>`;
}

// "Similar drinks" block for the recipe view.
function similarDrinksHtml(r) {
  const sims = similarRecipes(r);
  if (!sims.length) return "";
  return `
    <div class="space-y-2 no-print">
      <h4 class="text-xs uppercase tracking-widest text-gold font-bold">Similar drinks</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        ${sims.map(s => `
          <button type="button" onclick="openRecipeModal('${s.id}')" class="text-left p-3 rounded-xl bg-obsidian/80 border border-white/10 hover:border-gold/50 transition">
            <span class="block text-sm font-semibold text-white leading-snug">${esc(s.name)}</span>
            <span class="block text-[11px] ${canMakeNow(s) ? "text-emerald-300" : "text-gray-400"}">${canMakeNow(s) ? "✓ Can make now" : esc(s.vibe)}</span>
          </button>`).join("")}
      </div>
    </div>`;
}
