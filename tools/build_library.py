#!/usr/bin/env python3
"""
Build data/library.js from Bar Assistant's open recipe data (MIT).

    git clone --depth 1 --filter=blob:none --no-checkout https://github.com/bar-assistant/data ba-data
    cd ba-data && git sparse-checkout init --no-cone
    printf '/LICENSE\\n/data/cocktails/*/data.json\\n/data/ingredients/*/data.json\\n' > .git/info/sparse-checkout
    git checkout && cd ..
    python tools/build_library.py ba-data

Only recipes whose required ingredients all map to items in data/catalog.js (or to
basic pantry items) are kept, so everything in the library can actually be made with
this bar's kinds of bottles. Photos are not used (they carry separate credits).
Re-run after editing INGREDIENT_MAP or the inventory.
"""
import json
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "library.js"

# Bar Assistant ingredient id -> (our item id, note). A note marks stand-ins.
INGREDIENT_MAP = {
    # spirits & wines
    "vodka": ("vodka", ""),
    "tequila": ("tequila", ""), "tequila-blanco": ("tequila", ""), "tequila-reposado": ("tequila", "reposado"),
    "tequila-anejo": ("tequila", "añejo"),
    "dark-rum": ("dark-rum", ""), "brown-rum": ("dark-rum", ""), "demerara-rum": ("dark-rum", ""),
    "jamaican-rum": ("dark-rum", "Jamaican style"), "barbados-rum": ("dark-rum", ""),
    "whiskey": ("whisky", ""), "bourbon-whiskey": ("whisky", "bourbon"), "rye-whiskey": ("whisky", "rye"),
    "scotch-whiskey": ("whisky", "Scotch"), "blended-scotch-whisky": ("whisky", "blended Scotch"),
    "islay-scotch-whiskey": ("whisky", "smoky Islay Scotch"), "irish-whiskey": ("whisky", "Irish"),
    "tennessee-whiskey": ("whisky", "Tennessee"), "japanese-whiskey": ("whisky", "Japanese"),
    "grappa": ("grappa", ""), "jagermeister": ("jagermeister", ""), "baileys-irish-cream": ("baileys", ""),
    "red-wine": ("red-wine", ""), "white-wine": ("white-wine", ""),
    # syrups (orange liqueurs -> the non-alcoholic Triple Sec syrup, labelled as stand-ins)
    "grenadine-syrup": ("grenadine", ""), "passionfruit-syrup": ("passion-fruit-syrup", ""),
    "vanilla-syrup": ("vanilla-syrup", ""), "coconut-syrup": ("coconut-syrup", ""),
    "cream-of-coconut": ("coconut-syrup", "stand-in for cream of coconut"),
    "triple-sec": ("triple-sec-cacao-syrup", "stand-in for triple sec"),
    "cointreau": ("triple-sec-cacao-syrup", "stand-in for Cointreau"),
    "grand-marnier": ("triple-sec-cacao-syrup", "stand-in for Grand Marnier"),
    "orange-curacao": ("triple-sec-cacao-syrup", "stand-in for orange curaçao"),
    "dry-curacao": ("triple-sec-cacao-syrup", "stand-in for dry curaçao"),
    "blue-curacao": ("cacao-blue-syrup", "stand-in for blue curaçao"),
    # mixers
    "lime-juice": ("lime", ""), "lime": ("lime", "fresh lime"), "lemon-juice": ("lemon", ""), "lemon": ("lemon", "fresh lemon"),
    "orange-juice": ("orange", ""), "blood-orange-juice": ("orange", "blood orange if you have it"),
    "pineapple-juice": ("pineapple", ""), "cranberry-juice": ("cranberry", ""),
    "club-soda": ("soda", ""), "tonic": ("tonic", ""), "ginger-beer": ("ginger", "ginger beer"), "cola": ("cola", ""),
    "lemon-soda": ("lemon-lime-soda", ""),
    "cream": ("dairy", "cream"), "milk": ("dairy", "milk"),
    "espresso": ("espresso", ""), "coffee": ("espresso", "coffee"), "cold-brew-coffee": ("espresso", "cold brew"),
}

# Basic pantry items kept as untracked extras (assumed on hand).
PANTRY = {
    "simple-syrup": "Simple syrup (1:1 sugar and water)", "sugar": "Sugar", "water": "Water",
    "honey-syrup": "Honey syrup (2:1 honey and water)", "salt": "Salt", "saline-solution": "Saline (pinch of salt in water)",
    "egg-white": "Egg white", "egg": "Egg", "mint": "Mint leaves", "crushed-ice": "Crushed ice",
}

GLASS_MAP = {
    "Lowball": "Rocks", "Highball": "Highball", "Coupe": "Coupe", "Cocktail": "Martini", "Nick and Nora": "Coupe",
    "Wine": "Copa", "Hurricane": "Hurricane", "Tiki": "Hurricane", "Champagne": "Flute", "Fizzio": "Highball",
    "Julep": "Rocks", "Glass mug": "Highball", "Copper mug": "Highball", "Margarita": "Coupe", "Shot": "Rocks",
    "Absinthe": "Rocks",
}
METHOD_MAP = {"Shake": "Shake & Strain", "Stir": "Stir & Strain", "Build": "Build", "Blend": "Blend",
              "Muddle": "Muddle & Build", "Layer": "Layer"}
WORD_UNITS = {"dash": "dash", "dashes": "dash", "barspoon": "barspoon", "drops": "drop", "drop": "drop",
              "whole": "", "leaves": "leaf", "slice": "slice", "sprigs": "sprig", "sprig": "sprig",
              "part": "part", "teaspoon": "tsp", "pinch": "pinch", "pcs": "", "cl": "cl"}


def fmt_num(x):
    x = round(float(x) * 2) / 2
    return str(int(x)) if x == int(x) else str(x)


def amount_text(ing):
    a, amax, unit = ing.get("amount"), ing.get("amount_max"), (ing.get("units") or "").strip().lower()
    if unit == "topup":
        return "Top"
    if a is None:
        return "To taste"
    if unit == "oz":  # the app is ml-only: bar convention 1 oz = 30 ml
        a = a * 30; amax = amax * 30 if amax else amax; unit = "ml"
    num = fmt_num(a) + (f"–{fmt_num(amax)}" if amax else "")
    if unit in ("ml", "cl", ""):
        return f"{num} {unit}".strip() if unit else num
    word = WORD_UNITS.get(unit, unit)
    plural = word and word not in ("tsp", "ml", "cl") and (float(amax or a) != 1)
    return f"{num} {word}{'es' if plural and word.endswith(('sh', 'ch')) else ('s' if plural and word else '')}".strip()


def pick_glass(d):
    g = GLASS_MAP.get(d.get("glass") or "")
    if g:
        return g
    return {"Stir": "Rocks", "Shake": "Coupe"}.get(d.get("method"), "Highball")


def pick_ice(glass, method):
    if glass in ("Coupe", "Martini", "Flute"):
        return "No Ice (Chilled Glass)"
    if glass == "Hurricane":
        return "Crushed Ice"
    if glass == "Rocks" and method == "Stir":
        return "Large Cube"
    return "Cubed Ice"


def pick_vibe(d, items):
    tags = {t.lower() for t in d.get("tags") or []}
    if tags & {"tiki", "tropical"} or items & {"pineapple", "coconut-syrup", "passion-fruit-syrup"}:
        return "Tropical & Fruity"
    if tags & {"creamy", "dessert", "flip"} or items & {"dairy", "baileys", "vanilla-syrup"}:
        return "Rich & Dessert"
    if tags & {"bitter", "herbacious", "herbaceous", "smokey", "smoky", "spicy", "savory"} or d.get("method") == "Stir":
        return "Herbal & Bold"
    if "fruity" in tags or items & {"grenadine", "cranberry", "orange"}:
        return "Tropical & Fruity"
    return "Refreshing & Crisp"


COLOR_RULES = [  # first match wins
    ({"cacao-blue-syrup"}, ["#7dd3fc", "#2563eb"]),
    ({"espresso", "cola"}, ["#a16207", "#422006"]),
    ({"dairy", "baileys"}, ["#fef3c7", "#d6b98c"]),
    ({"grenadine", "cranberry", "red-wine"}, ["#fda4af", "#be123c"]),
    ({"orange"}, ["#fdba74", "#ea580c"]),
    ({"pineapple", "passion-fruit-syrup", "coconut-syrup"}, ["#fde047", "#f59e0b"]),
    ({"jagermeister"}, ["#92400e", "#451a03"]),
    ({"whisky", "dark-rum"}, ["#fbbf24", "#b45309"]),
    ({"white-wine"}, ["#fef9c3", "#fde68a"]),
]


def pick_colors(items):
    for keys, colors in COLOR_RULES:
        if items & keys:
            return colors
    return ["#fef08a", "#eab308"]


def pick_garnish(text):
    t = (text or "").lower()
    for pattern, g in [(r"umbrella|tiki", "umbrella-straw"), (r"mint", "mint-lime"), (r"twist|peel|zest", "orange-twist"),
                       (r"cherr|berr", "berry-rim"), (r"wheel|wedge|slice|lime|lemon|orange", "citrus-wheel")]:
        if re.search(pattern, t):
            return g
    return "none"


def pick_type(d, items, ings_meta):
    alcoholic = [i for i in d["ingredients"] if (ings_meta.get(i["_id"], {}).get("strength") or 0) > 0 and not i.get("optional")]
    if not alcoholic or "virgin" in {t.lower() for t in d.get("tags") or []}:
        return "Mocktail"
    if items & {"red-wine", "white-wine"} and (d.get("abv") or 99) <= 12:
        return "Wine & Low-ABV"
    return "Cocktail"


def split_steps(text):
    lines = [re.sub(r"\s+", " ", re.sub(r"^\s*(\d+[.)]|[-*•])\s*", "", l)).strip() for l in (text or "").splitlines()]
    return [l for l in lines if l] or ["Combine the ingredients and serve."]


def clean_url(url):
    """Drop tracking parameters (utm_* etc.) from source links."""
    if "?" not in url:
        return url
    base, query = url.split("?", 1)
    keep = [q for q in query.split("&") if q and not re.match(r"(utm_|mc_|fbclid|gclid)", q)]
    return base + ("?" + "&".join(keep) if keep else "")


def trim(text, limit=360):
    text = re.sub(r"\s+", " ", text or "").strip()
    if len(text) <= limit:
        return text
    cut = text[:limit]
    return (cut[: cut.rfind(". ") + 1] if ". " in cut else cut.rstrip() + "…").strip()


def load_catalog():
    data = (ROOT / "data" / "catalog.js").read_text(encoding="utf-8")
    m = re.search(r"^window\.BAR_CATALOG\s*=\s*", data, re.M)
    return json.loads(data[m.end():].strip().rstrip(";"))


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    catalog = load_catalog()
    our_items = {i["id"] for i in catalog["items"]}
    existing_names = {r["name"].lower() for r in catalog["recipes"]}
    bad = {k: v for k, v in INGREDIENT_MAP.items() if v[0] not in our_items}
    if bad:
        sys.exit(f"INGREDIENT_MAP points at items not in data/catalog.js: {bad}")

    ings_meta = {}
    for p in (src / "data" / "ingredients").glob("*/data.json"):
        d = json.loads(p.read_text(encoding="utf-8"))
        ings_meta[d["_id"]] = d

    kept, blockers, single = [], Counter(), Counter()
    for p in sorted((src / "data" / "cocktails").glob("*/data.json")):
        d = json.loads(p.read_text(encoding="utf-8"))
        if d["name"].lower() in existing_names:
            continue
        missing = [i["_id"] for i in d["ingredients"] if not i.get("optional") and i["_id"] not in INGREDIENT_MAP and i["_id"] not in PANTRY]
        if missing:
            blockers.update(set(missing))
            if len(set(missing)) == 1:
                single[missing[0]] += 1  # buying just this would add the recipe
            continue
        ingredients, items = [], set()
        for i in sorted(d["ingredients"], key=lambda x: x.get("sort") or 0):
            bid = i["_id"]
            if bid in INGREDIENT_MAP:
                item, note = INGREDIENT_MAP[bid]
                extra = (i.get("note") or "").strip()
                note = ", ".join(n for n in (note, extra) if n)
                ing = {"item": item}
                if note:
                    ing["note"] = note[:80]
                ing["amount"] = amount_text(i)
                subs = sorted({INGREDIENT_MAP[s["_id"]][0] for s in i.get("substitutes") or []
                               if isinstance(s, dict) and s.get("_id") in INGREDIENT_MAP} - {item})
                if subs:
                    ing["substitutes"] = subs
                items.add(item)
            else:
                name = PANTRY.get(bid) or (ings_meta.get(bid, {}).get("name") or i.get("name") or bid)
                ing = {"name": name[:80], "amount": amount_text(i)}
            if i.get("optional"):
                ing["optional"] = True
            ingredients.append(ing)
        if not items:
            continue  # nothing from the bar at all
        glass = pick_glass(d)
        method = METHOD_MAP.get(d.get("method") or "", "Build")
        notes = trim(d.get("description"))
        if d.get("garnish"):
            notes = (notes + " " if notes else "") + f"Garnish: {d['garnish'].strip().rstrip('.')}."
        source = d.get("source") or ""
        kept.append({
            "id": ("ba-" + d["_id"])[:63].rstrip("-"),
            "name": d["name"].strip()[:80],
            "type": pick_type(d, items, ings_meta),
            "vibe": pick_vibe(d, items),
            "glass": glass, "method": method, "ice": pick_ice(glass, d.get("method")),
            "colors": pick_colors(items), "garnishType": pick_garnish(d.get("garnish")),
            "ingredients": ingredients,
            "steps": split_steps(d.get("instructions")),
            "servingNotes": notes,
            "source": clean_url(source) if re.match(r"https?://", source) else "Bar Assistant",
        })

    try:
        commit = subprocess.run(["git", "-C", str(src), "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
    except OSError:
        commit = ""
    license_text = (src / "LICENSE").read_text(encoding="utf-8").strip()
    library = {
        "schema": 1,
        "source": {"name": "Bar Assistant recipe data", "url": "https://github.com/bar-assistant/data",
                   "license": "MIT", "commit": commit,
                   "built": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")},
        "recipes": kept,
    }
    header = "/*\n * Recipe library for the Discover tab, generated by tools/build_library.py from\n" \
             " * Bar Assistant's recipe data (https://github.com/bar-assistant/data). Do not edit by hand.\n" \
             " * Everything after \"window.BAR_LIBRARY = \" is strict JSON.\n *\n" + \
             "".join(f" * {l}".rstrip() + "\n" for l in license_text.splitlines()) + " */\n"
    OUT.write_text(header + "window.BAR_LIBRARY = " + json.dumps(library, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    types = Counter(r["type"] for r in kept)
    print(f"kept {len(kept)} recipes {dict(types)} -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
    print("most common blockers (ingredients you don't stock):",
          ", ".join(f"{k} ({n})" for k, n in blockers.most_common(12)))
    print("one bottle away (recipes that need only this):",
          ", ".join(f"{k} (+{n})" for k, n in single.most_common(10)))


if __name__ == "__main__":
    main()
