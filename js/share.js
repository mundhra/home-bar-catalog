/*
 * Share: renders a recipe as a PNG card (canvas, no libraries) and shares,
 * downloads or copies it.
 * openShareDialog() builds the image first and shows a preview, so the Share
 * button calls navigator.share() directly from a tap (phones require that).
 */

const SHARE_W = 1080;          // Instagram/WhatsApp-friendly width; height grows with content
const SHARE_MIN_H = 1350;      // 4:5 portrait minimum
const SHARE_PAD = 80;
const SHARE_COLORS = { bg: "#0f1115", card: "#161920", gold: "#d4a359", goldLight: "#e6be7e", text: "#f3f4f6", muted: "#9ca3af", line: "rgba(212,163,89,0.25)" };
const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = 'Inter, system-ui, sans-serif';

let shareState = null; // { recipeId, blob, file, url }

// Split text into lines that fit maxWidth with the current ctx.font.
function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  return lines;
}

async function loadGlassImage(recipe, size) {
  const svg = renderGlassSVG(recipe.glass, recipe.colors, recipe.garnishType, `share-${recipe.id}`)
    .replace("<svg ", `<svg xmlns="http://www.w3.org/2000/svg" width="${size.w}" height="${size.h}" `);
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode();
  return img;
}

// One layout routine for both passes: with draw=false it only measures and
// returns the height the card needs.
function layoutRecipeCard(ctx, recipe, glassImg, draw) {
  const W = SHARE_W, P = SHARE_PAD, C = SHARE_COLORS;
  const text = (str, x, y, font, color, align = "left") => {
    if (!draw) return;
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic";
    ctx.fillText(str, x, y);
  };
  let y = P;

  // Header: brand, category · vibe, name — glass illustration on the right.
  const glass = { w: 220, h: 253 };
  const titleWidth = W - 2 * P - glass.w - 30;
  y += 26;
  text("THE PRIVATE RESERVE", P, y, `600 24px ${SANS}`, C.gold);
  y += 48;
  text(`${recipe.type}  ·  ${recipe.vibe}`, P, y, `500 28px ${SANS}`, C.goldLight);
  y += 22;
  ctx.font = `700 78px ${SERIF}`;
  const nameLines = wrapText(ctx, recipe.name, titleWidth);
  nameLines.forEach(line => { y += 80; text(line, P, y, `700 78px ${SERIF}`, C.text); });
  if (draw && glassImg) ctx.drawImage(glassImg, W - P - glass.w, P + 10, glass.w, glass.h);
  y = Math.max(y + 24, P + 10 + glass.h);

  // Glass · technique · ice
  const meta = [`${GLASS_LABELS[recipe.glass] || recipe.glass} glass`, recipe.method, recipe.ice].filter(Boolean).join("  ·  ");
  ctx.font = `400 28px ${SANS}`;
  wrapText(ctx, meta, W - 2 * P).forEach(line => { y += 38; text(line, P, y, `400 28px ${SANS}`, C.muted); });
  y += 36;
  if (draw) { ctx.fillStyle = C.line; ctx.fillRect(P, y, W - 2 * P, 2); }
  y += 56;

  // Ingredients
  text("INGREDIENTS", P, y, `700 24px ${SANS}`, C.gold);
  y += 14;
  recipe.ingredients.forEach(ing => {
    ctx.font = `600 30px ${SANS}`;
    const amount = ing.amount;
    const amountW = ctx.measureText(amount).width;
    ctx.font = `500 32px ${SANS}`;
    const extras = ingredientExtrasText(ing);
    const lines = wrapText(ctx, ingredientLabel(ing) + (extras ? ` (${extras})` : ""), W - 2 * P - amountW - 60);
    lines.forEach((line, i) => {
      y += i === 0 ? 50 : 40;
      if (i === 0 && draw) { ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(P + 6, y - 10, 5, 0, Math.PI * 2); ctx.fill(); }
      text(line, P + 28, y, `500 32px ${SANS}`, C.text);
      if (i === 0) text(amount, W - P, y, `600 30px ${SANS}`, C.goldLight, "right");
    });
  });
  y += 76;

  // Method
  text("METHOD", P, y, `700 24px ${SANS}`, C.gold);
  y += 10;
  recipe.steps.forEach((step, i) => {
    ctx.font = `400 30px ${SANS}`;
    const lines = wrapText(ctx, step, W - 2 * P - 64);
    y += 48;
    if (draw) {
      ctx.fillStyle = "rgba(212,163,89,0.18)"; ctx.beginPath(); ctx.arc(P + 20, y - 10, 20, 0, Math.PI * 2); ctx.fill();
    }
    text(String(i + 1), P + 20, y - 1, `700 22px ${SANS}`, C.gold, "center");
    lines.forEach((line, j) => { if (j) y += 42; text(line, P + 64, y, `400 30px ${SANS}`, C.text); });
  });

  // Garnish & serving
  if (recipe.servingNotes) {
    y += 64;
    ctx.font = `italic 400 28px ${SANS}`;
    const lines = wrapText(ctx, recipe.servingNotes, W - 2 * P - 60);
    const boxTop = y - 40, boxH = 70 + lines.length * 40;
    if (draw) {
      ctx.fillStyle = "rgba(212,163,89,0.08)"; ctx.strokeStyle = C.line; ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(P, boxTop, W - 2 * P, boxH, 24); else ctx.rect(P, boxTop, W - 2 * P, boxH);
      ctx.fill(); ctx.stroke();
    }
    text("GARNISH & SERVING", P + 30, y, `700 22px ${SANS}`, C.gold);
    lines.forEach(line => { y += 40; text(line, P + 30, y, `italic 400 28px ${SANS}`, C.muted); });
    y = boxTop + boxH;
  }

  // Footer
  y += 70;
  if (draw) { ctx.fillStyle = C.line; ctx.fillRect(P, y, W - 2 * P, 2); }
  y += 48;
  text("Made with The Private Reserve home bar catalog", W / 2, y, `500 22px ${SANS}`, C.muted, "center");
  return y + P - 20;
}

// Builds the PNG for a recipe. Resolves to a Blob.
async function renderRecipeImage(recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe) throw new Error(`Unknown recipe ${recipeId}`);
  // Use the web fonts if they're available (they're cached for offline use); fall back silently.
  try {
    await Promise.all([`700 78px ${SERIF}`, `400 30px ${SANS}`, `600 30px ${SANS}`, `700 24px ${SANS}`, `italic 400 28px ${SANS}`]
      .map(f => document.fonts.load(f)));
  } catch (e) { /* system fonts */ }

  let glassImg = null;
  try { glassImg = await loadGlassImage(recipe, { w: 220, h: 253 }); } catch (e) { console.warn("Glass illustration skipped", e); }

  const canvas = document.createElement("canvas");
  canvas.width = SHARE_W;
  canvas.height = SHARE_MIN_H;
  let ctx = canvas.getContext("2d");
  const height = Math.max(SHARE_MIN_H, Math.ceil(layoutRecipeCard(ctx, recipe, null, false)));
  canvas.height = height;            // resets the context
  ctx = canvas.getContext("2d");

  // Background: obsidian with the app's soft gold glows.
  ctx.fillStyle = SHARE_COLORS.bg;
  ctx.fillRect(0, 0, SHARE_W, height);
  [[0.15, 0.1, 0.10], [0.85, 0.9, 0.08]].forEach(([fx, fy, a]) => {
    const g = ctx.createRadialGradient(SHARE_W * fx, height * fy, 0, SHARE_W * fx, height * fy, SHARE_W * 0.7);
    g.addColorStop(0, `rgba(212,163,89,${a})`);
    g.addColorStop(1, "rgba(212,163,89,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SHARE_W, height);
  });
  layoutRecipeCard(ctx, recipe, glassImg, true);

  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Couldn't create the image"))), "image/png"));
}

async function openShareDialog(recipeId) {
  const recipe = recipeById(recipeId);
  if (!recipe) return;
  closeShareDialog();
  const body = document.getElementById("shareModalBody");
  body.innerHTML = `<p class="text-sm text-gray-300 py-16 text-center">Preparing image…</p>`;
  showModal("shareModal");
  try {
    const blob = await renderRecipeImage(recipeId);
    const file = new File([blob], `${recipe.id}.png`, { type: "image/png" });
    const url = URL.createObjectURL(blob);
    shareState = { recipeId, blob, file, url };
    const canShareFile = !!(navigator.canShare && navigator.canShare({ files: [file] }));
    const canCopy = !!(navigator.clipboard && window.ClipboardItem);
    body.innerHTML = `
      <img id="shareImage" src="${url}" alt="${esc(recipe.name)} recipe card" class="w-full rounded-2xl border border-white/10" />
      <div class="flex flex-wrap justify-end gap-2 pt-1">
        ${canCopy ? `<button onclick="copyShareImage()" class="px-4 py-2 rounded-xl text-sm text-gray-200 bg-white/5 hover:bg-white/15 border border-white/10">Copy</button>` : ""}
        <button onclick="downloadShareImage()" class="px-4 py-2 rounded-xl text-sm text-gray-200 bg-white/5 hover:bg-white/15 border border-white/10">Download</button>
        ${canShareFile ? `<button onclick="shareShareImage()" class="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-obsidian font-semibold text-sm">Share…</button>` : ""}
      </div>
      <div class="pt-3 border-t border-white/10 space-y-2">
        <p class="text-[11px] text-gray-400">Or send a link that opens this recipe:</p>
        ${isLocalOnlyRecipe(recipe.id) ? `<p class="text-[11px] text-amber-300">This drink is only on this device, so the link won't open it for anyone else until you publish catalog.js.</p>` : ""}
        <div class="flex gap-2">
          <input id="shareLink" readonly value="${esc(recipeLink(recipe.id))}" onclick="this.select()" class="flex-1 min-w-0 px-3 py-2 rounded-xl bg-obsidian border border-white/10 text-[11px] text-gray-300" aria-label="Recipe link" />
          <button onclick="copyRecipeLink('${recipe.id}')" class="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold text-gold bg-gold/10 hover:bg-gold/20 border border-gold/30">Copy link</button>
        </div>
      </div>`;
  } catch (e) {
    console.warn("Share image failed", e);
    body.innerHTML = `<p class="text-sm text-red-300 py-10 text-center">Sorry, the image couldn't be created on this device.</p>`;
  }
}

async function shareShareImage() {
  if (!shareState) return;
  const recipe = recipeById(shareState.recipeId);
  try {
    await navigator.share({ files: [shareState.file], title: recipe ? recipe.name : "Recipe" });
  } catch (e) {
    if (e && e.name !== "AbortError") showToast("Sharing didn't work here. Use Download instead.", "warn");
  }
}

function downloadShareImage() {
  if (!shareState) return;
  downloadBlob(shareState.file.name, shareState.blob);
  showToast("Image downloaded.");
}

async function copyShareImage() {
  if (!shareState) return;
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": shareState.blob })]);
    showToast("Image copied. Paste it into a chat or email.");
  } catch (e) {
    showToast("Copying images isn't allowed here. Use Download instead.", "warn");
  }
}

function closeShareDialog() {
  if (shareState) URL.revokeObjectURL(shareState.url);
  shareState = null;
  hideModal("shareModal");
}
