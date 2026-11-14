/*
 * Glassware: the glassware guide content and the SVG glass/garnish renderer.
 * renderGlassSVG(glass, colors, garnish, uid) is pure: it returns an SVG string.
 */

const GLASSWARE_GUIDE = [
  {
    type: "Highball",
    title: "Highball / Collins Glass",
    capacity: "300 – 360 ml",
    ice: "Full column of standard clear ice cubes",
    bestFor: "Fizzy spritzes, kombucha coolers, tonic builds, and tall refreshing highballs.",
    technique: "Always fill glass to the very top with ice before pouring so carbonation stays crisp and dilution stays minimal. Give one gentle bottom-to-top lift with a barspoon.",
    color1: "#38bdf8", color2: "#0284c7", garnish: "citrus-wheel"
  },
  {
    type: "Rocks",
    title: "Rocks / Old Fashioned Glass",
    capacity: "240 – 300 ml",
    ice: "1 large king cube / sphere (or large clear cubes)",
    bestFor: "Spirit-forward stirred cocktails, sours, and bold dark rum or whisky builds.",
    technique: "Chill the glass first. A single large ice cube melts slowly, keeping whisky, dark rum, and coffee gin rich without watering them down.",
    color1: "#d97706", color2: "#78350f", garnish: "orange-twist"
  },
  {
    type: "Coupe",
    title: "Coupe / Martini Glass",
    capacity: "160 – 210 ml",
    ice: "Served 'Up' (shaken with ice, double-strained with no ice in glass)",
    bestFor: "Dessert martinis (Strawberry Cheesecake), silky shaken cocktails, and aromatic sours.",
    technique: "Chill the coupe in the freezer for 10 minutes prior to serving. Double-strain through a fine mesh sieve to catch tiny ice shards for a velvety surface.",
    color1: "#f472b6", color2: "#be185d", garnish: "berry-rim"
  },
  {
    type: "Martini",
    title: "Classic V-Shaped Martini Glass",
    capacity: "150 – 200 ml",
    ice: "Served 'Up' (frosty chilled glass, zero ice)",
    bestFor: "Crisp shaken vodka/gin builds, espresso-style martinis, and dramatic layered serves.",
    technique: "Hold by the stem so body heat never warms the drink. Wide rim amplifies roasted coffee, citrus oil, and aromatic botanicals.",
    color1: "#78350f", color2: "#290e02", garnish: "orange-twist"
  },
  {
    type: "Copa",
    title: "Copa Balloon / Large Wine Glass",
    capacity: "450 – 550 ml",
    ice: "Generous scoop of cubed ice",
    bestFor: "Red & white wine sangrias, aromatic Coffee Gin & Tonics, and botanical kombucha spritzes.",
    technique: "The wide bowl traps botanical and wine aromatics right under your nose with every sip. Garnish inside the bowl alongside the ice.",
    color1: "#9f1239", color2: "#4c0519", garnish: "citrus-wheel"
  },
  {
    type: "Hurricane",
    title: "Hurricane / Tiki Glass",
    capacity: "400 – 480 ml",
    ice: "Crushed or pebble ice",
    bestFor: "Multi-syrup tropical builds, Blue Lagoons, and layered sunset mocktails/cocktails.",
    technique: "Pack with crushed ice to create frost on the outside of the glass. Drizzle heavy syrups (like Grenadine or Cacao Blue) last for dramatic color gradients.",
    color1: "#06b6d4", color2: "#1d4ed8", garnish: "umbrella-straw"
  },
  {
    type: "Flute",
    title: "Champagne / Sparkling Flute",
    capacity: "160 – 190 ml",
    ice: "Chilled glass (no ice—preserves fine bubbles)",
    bestFor: "Sparkling white wine spritzes, Bellini-style kombucha mocktails, and celebratory toasts.",
    technique: "Pour dense fruit syrups first, then tilt the flute at 45° and slowly pour chilled wine or kombucha down the side to retain effervescence.",
    color1: "#fde047", color2: "#f59e0b", garnish: "berry-rim"
  }
];

// =========================================================================
// CUSTOM SVG GLASSWARE & DRINK ILLUSTRATION GENERATOR
// =========================================================================
function renderGlassSVG(glassType, colors, garnishType, uid) {
  const [c1, c2] = colors || ["#d4a359", "#92400e"];
  const gradId = `grad-${uid}`;
  const iceId = `ice-${uid}`;

  // Garnish element helper
  let garnishSVG = "";
  if (garnishType === "citrus-wheel") {
    garnishSVG = `
      <g transform="translate(64, 24)">
        <circle cx="0" cy="0" r="12" fill="#facc15" stroke="#fef08a" stroke-width="1.5"/>
        <circle cx="0" cy="0" r="9" fill="#fde047" stroke="#eab308" stroke-width="0.8" stroke-dasharray="3 2"/>
      </g>`;
  } else if (garnishType === "mint-lime") {
    garnishSVG = `
      <g transform="translate(62, 22)">
        <circle cx="2" cy="4" r="10" fill="#4ade80" stroke="#bbf7d0" stroke-width="1.5"/>
        <path d="M-8 6 Q-16 -6 -4 -10 Q2 -2 -8 6 Z" fill="#16a34a"/>
        <path d="M-4 4 Q-6 -10 6 -12 Q6 -2 -4 4 Z" fill="#22c55e"/>
      </g>`;
  } else if (garnishType === "orange-twist") {
    garnishSVG = `
      <path d="M36 26 Q48 16 58 24 T72 18" fill="none" stroke="#fb923c" stroke-width="3" stroke-linecap="round"/>`;
  } else if (garnishType === "berry-rim") {
    garnishSVG = `
      <g transform="translate(66, 30)">
        <circle cx="0" cy="0" r="6.5" fill="#e11d48"/>
        <path d="M-3 -5 L0 -8 L3 -5 Z" fill="#22c55e"/>
      </g>`;
  } else if (garnishType === "umbrella-straw") {
    garnishSVG = `
      <line x1="56" y1="75" x2="72" y2="10" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M32 22 L46 10 L58 24 Z" fill="#f43f5e" stroke="#fda4af" stroke-width="1"/>
      <line x1="46" y1="10" x2="42" y2="34" stroke="#e2e8f0" stroke-width="1.5"/>`;
  }

  const defs = `
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${c1}" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="${c2}" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="${iceId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.12"/>
      </linearGradient>
    </defs>`;

  if (glassType === "Highball") {
    return `
      <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
        ${defs}
        ${garnishSVG}
        <rect x="31" y="34" width="38" height="68" rx="2" fill="url(#${gradId})"/>
        <rect x="35" y="40" width="13" height="13" rx="2.5" transform="rotate(-8 41 46)" fill="url(#${iceId})" stroke="white" stroke-opacity="0.3" stroke-width="0.7"/>
        <rect x="50" y="46" width="13" height="13" rx="2.5" transform="rotate(10 56 52)" fill="url(#${iceId})" stroke="white" stroke-opacity="0.3" stroke-width="0.7"/>
        <rect x="36" y="62" width="13" height="13" rx="2.5" transform="rotate(6 42 68)" fill="url(#${iceId})" stroke="white" stroke-opacity="0.3" stroke-width="0.7"/>
        <rect x="49" y="75" width="13" height="13" rx="2.5" transform="rotate(-12 55 81)" fill="url(#${iceId})" stroke="white" stroke-opacity="0.3" stroke-width="0.7"/>
        <path d="M29 24 L29 102 Q29 106 33 106 L67 106 Q71 106 71 102 L71 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2" stroke-linecap="round"/>
        <line x1="29" y1="101" x2="71" y2="101" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      </svg>`;
  }

  if (glassType === "Rocks") {
    return `
      <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
        ${defs}
        ${garnishSVG}
        <rect x="25" y="54" width="50" height="44" rx="3" fill="url(#${gradId})"/>
        <rect x="37" y="60" width="26" height="26" rx="4" transform="rotate(-4 50 73)" fill="url(#${iceId})" stroke="white" stroke-opacity="0.4" stroke-width="0.9"/>
        <path d="M23 42 L23 98 Q23 104 29 104 L71 104 Q77 104 77 98 L77 42" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="23" y1="97" x2="77" y2="97" stroke="rgba(255,255,255,0.35)" stroke-width="2.5"/>
      </svg>`;
  }

  if (glassType === "Coupe") {
    return `
      <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
        ${defs}
        ${garnishSVG}
        <path d="M24 38 Q24 62 50 62 Q76 62 76 38 Z" fill="url(#${gradId})"/>
        <ellipse cx="50" cy="38" rx="26" ry="3" fill="rgba(255,255,255,0.35)"/>
        <path d="M22 32 Q22 64 50 64 Q78 64 78 32" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/>
        <line x1="50" y1="64" x2="50" y2="102" stroke="rgba(255,255,255,0.6)" stroke-width="2.2"/>
        <ellipse cx="50" cy="103" rx="18" ry="3.5" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      </svg>`;
  }

  if (glassType === "Martini") {
    return `
      <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
        ${defs}
        ${garnishSVG}
        <polygon points="24,36 76,36 50,64" fill="url(#${gradId})"/>
        <ellipse cx="50" cy="36" rx="26" ry="2.8" fill="rgba(255,255,255,0.35)"/>
        <polyline points="20,31 50,65 80,31" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="50" y1="65" x2="50" y2="102" stroke="rgba(255,255,255,0.6)" stroke-width="2.2"/>
        <ellipse cx="50" cy="103" rx="18" ry="3.5" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      </svg>`;
  }

  if (glassType === "Copa") {
    return `
      <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
        ${defs}
        ${garnishSVG}
        <path d="M26 42 C24 62 36 72 50 72 C64 72 76 62 74 42 Z" fill="url(#${gradId})"/>
        <rect x="36" y="45" width="12" height="12" rx="2.5" transform="rotate(-10 42 51)" fill="url(#${iceId})" stroke="white" stroke-opacity="0.35" stroke-width="0.7"/>
        <rect x="51" y="47" width="12" height="12" rx="2.5" transform="rotate(12 57 53)" fill="url(#${iceId})" stroke="white" stroke-opacity="0.35" stroke-width="0.7"/>
        <path d="M30 26 C22 44 24 73 50 73 C76 73 78 44 70 26" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/>
        <line x1="50" y1="73" x2="50" y2="103" stroke="rgba(255,255,255,0.6)" stroke-width="2.2"/>
        <ellipse cx="50" cy="104" rx="17" ry="3" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      </svg>`;
  }

  if (glassType === "Hurricane") {
    return `
      <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
        ${defs}
        ${garnishSVG}
        <path d="M33 34 C36 52 27 66 32 82 C35 90 42 93 50 93 C58 93 65 90 68 82 C73 66 64 52 67 34 Z" fill="url(#${gradId})"/>
        <circle cx="43" cy="44" r="3" fill="white" fill-opacity="0.3"/>
        <circle cx="54" cy="48" r="3.5" fill="white" fill-opacity="0.25"/>
        <circle cx="46" cy="58" r="3" fill="white" fill-opacity="0.25"/>
        <circle cx="56" cy="68" r="3" fill="white" fill-opacity="0.2"/>
        <path d="M31 24 C36 48 25 65 31 83 C34 91 42 94 50 94 C58 94 66 91 69 83 C75 65 64 48 69 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/>
        <line x1="50" y1="94" x2="50" y2="103" stroke="rgba(255,255,255,0.6)" stroke-width="2.5"/>
        <ellipse cx="50" cy="104" rx="16" ry="3" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      </svg>`;
  }

  if (glassType === "Flute") {
    return `
      <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
        ${defs}
        ${garnishSVG}
        <path d="M39 32 L61 32 L58 66 Q58 74 50 74 Q42 74 42 66 Z" fill="url(#${gradId})"/>
        <circle cx="48" cy="62" r="1.3" fill="white" fill-opacity="0.6"/>
        <circle cx="52" cy="52" r="1.5" fill="white" fill-opacity="0.6"/>
        <circle cx="47" cy="43" r="1.2" fill="white" fill-opacity="0.6"/>
        <path d="M38 22 L62 22 L59 66 Q59 75 50 75 Q41 75 41 66 Z" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2"/>
        <line x1="50" y1="75" x2="50" y2="103" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
        <ellipse cx="50" cy="104" rx="15" ry="3" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
      </svg>`;
  }

  // Default / Shot
  return `
    <svg viewBox="0 0 100 115" class="w-20 h-24 shrink-0 drop-shadow-md">
      ${defs}
      <polygon points="36,56 64,56 60,98 40,98" fill="url(#${gradId})"/>
      <polygon points="34,44 66,44 61,102 39,102" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    </svg>`;
}

function renderGlasswareGuide() {
  const grid = document.getElementById("glasswareGuideGrid");
  grid.innerHTML = GLASSWARE_GUIDE.map((g, idx) => `
    <div class="glass-card rounded-2xl p-6 flex flex-col justify-between gap-4">
      <div class="flex items-center justify-between gap-4 bg-obsidian/70 p-4 rounded-xl border border-white/5">
        <div>
          <span class="text-[11px] uppercase tracking-wider text-gold font-semibold">${g.capacity}</span>
          <h3 class="font-serif text-xl font-bold text-white mt-0.5">${g.title}</h3>
          <p class="text-xs text-gray-400 mt-1">Ice: <span class="text-gray-200">${g.ice}</span></p>
        </div>
        ${renderGlassSVG(g.type, [g.color1, g.color2], g.garnish, `guide-${idx}`)}
      </div>
      <div class="space-y-2 text-xs text-gray-300 leading-relaxed">
        <p><strong class="text-white">Best For:</strong> ${g.bestFor}</p>
        <p><strong class="text-gold">Bartender Technique:</strong> ${g.technique}</p>
      </div>
    </div>
  `).join("");
}
