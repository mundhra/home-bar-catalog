#!/usr/bin/env python3
"""
Smoke tests for The Private Reserve.

    python tests/run.py                 # static checks + every browser scenario
    python tests/run.py main legacy     # only the named scenarios
    CHROME=/path/to/chrome python tests/run.py

Needs Python 3.8+ and Chrome, Chromium or Edge. No other dependencies.

1. Static checks catch the failure modes this repo has actually hit: pasted
   "... existing code ..." placeholders, functions defined twice (the later
   copy silently wins), missing <script src> files and a broken data file.
2. Browser scenarios load index.html in headless Chrome with tests/smoke.test.js
   appended, each in a fresh profile so localStorage starts empty.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TESTS = ROOT / "tests"
GENERATED = TESTS / ".generated.html"
SCENARIOS = ["main", "legacy", "stale", "same", "broken"]

# Runs before any app script: collect errors.
HEAD_HOOK = """<script>
window.__errs = [];
addEventListener("error", e => __errs.push(e.message + " @" + (e.filename || "").split("/").pop() + ":" + e.lineno));
</script>"""

# Runs after data/catalog.js and before the app scripts: keep an untouched copy of
# the shipped catalog for expectations, then seed localStorage for the scenario.
AFTER_CATALOG_HOOK = """<script>
window.__RAW_CATALOG = window.BAR_CATALOG ? JSON.parse(JSON.stringify(window.BAR_CATALOG)) : null;
(function () {
  const mode = location.hash.slice(1), C = window.BAR_CATALOG;
  if (mode === "legacy") {
    const t = C.items.filter(i => i.kind !== "mixer"), m = C.items.filter(i => i.kind === "mixer");
    localStorage.setItem("private_reserve_stock_v1", JSON.stringify({ [t[0].name]: "out", [t[1].name]: "low", "No Such Item": "low" }));
    localStorage.setItem("private_reserve_shopping_v1", JSON.stringify([m[0].id, "bogus"]));
  }
  if (mode === "stale") {
    const c = JSON.parse(JSON.stringify(C)); c.recipes.pop();
    localStorage.setItem("private_reserve_catalog_v1", JSON.stringify({ basedOn: "1999-01-01", catalog: c }));
  }
  if (mode === "same") localStorage.setItem("private_reserve_catalog_v1", JSON.stringify({ basedOn: "x", catalog: C }));
  if (mode === "broken") window.BAR_CATALOG = undefined;
})();
</script>"""

CATALOG_TAG = '<script src="data/catalog.js"></script>'


def fail(msg):
    print(f"FAIL {msg}")
    return 1


def static_checks():
    failures = 0
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    scripts = re.findall(r'<script src="([^":]+)"', html)
    for src in scripts:
        if not (ROOT / src).is_file():
            failures += fail(f"index.html loads missing file {src}")
    if html.count(CATALOG_TAG) != 1:
        failures += fail("index.html must load data/catalog.js exactly once")

    sources = {p.relative_to(ROOT).as_posix(): p.read_text(encoding="utf-8")
               for p in [ROOT / "index.html", *sorted((ROOT / "js").glob("*.js")), ROOT / "data" / "catalog.js"]}
    for name, text in sources.items():
        if re.search(r"\.\.\.\s*existing code", text, re.I):
            failures += fail(f'{name} contains an "... existing code ..." placeholder')

    # Top-level declarations across all app scripts share one global scope.
    decls = Counter()
    where = {}
    for name, text in sources.items():
        if not name.startswith("js/"):
            continue
        for m in re.finditer(r"^(?:async\s+)?function\s+(\w+)|^(?:const|let|var)\s+(\w+)", text, re.M):
            ident = m.group(1) or m.group(2)
            decls[ident] += 1
            where.setdefault(ident, []).append(name)
    for ident, n in decls.items():
        if n > 1:
            failures += fail(f"{ident} is declared {n} times ({', '.join(where[ident])})")
    inline_fns = re.findall(r"^\s*function\s+(\w+)", html, re.M)
    for ident in inline_fns:
        if ident in decls:
            failures += fail(f"{ident} is declared both inline in index.html and in js/")

    data = sources["data/catalog.js"]
    m = re.search(r"^window\.BAR_CATALOG\s*=\s*", data, re.M)
    if not m:
        failures += fail("data/catalog.js has no 'window.BAR_CATALOG = ' line")
    else:
        try:
            cat = json.loads(data[m.end():].strip().rstrip(";"))
            if cat.get("schema") != 1:
                failures += fail("data/catalog.js schema is not 1")
        except json.JSONDecodeError as e:
            failures += fail(f"data/catalog.js is not strict JSON after the assignment: {e}")

    print(f"[static] {len(scripts)} scripts, {sum(decls.values())} top-level declarations: "
          f"{'ok' if not failures else f'{failures} problem(s)'}")
    return failures


def find_browser():
    candidates = [os.environ.get("CHROME")]
    candidates += [shutil.which(n) for n in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome", "msedge")]
    candidates += [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ]
    return next((c for c in candidates if c and Path(c).is_file()), None)


def build_page():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    html = html.replace("<head>", '<head>\n<base href="../">\n' + HEAD_HOOK, 1)
    html = html.replace(CATALOG_TAG, CATALOG_TAG + "\n" + AFTER_CATALOG_HOOK, 1)
    test_js = (TESTS / "smoke.test.js").read_text(encoding="utf-8")
    html = html.replace("</body>", f"<script>\n{test_js}\n</script>\n</body>", 1)
    GENERATED.write_text(html, encoding="utf-8")


def run_scenario(browser, scenario):
    with tempfile.TemporaryDirectory(prefix="bar-tests-") as profile:
        args = [browser, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={profile}",
                "--virtual-time-budget=20000", "--dump-dom", f"{GENERATED.as_uri()}#{scenario}"]
        if os.environ.get("CI"):
            args.insert(1, "--no-sandbox")  # GitHub's Ubuntu runners restrict Chrome's sandbox
        try:
            proc = subprocess.run(args, capture_output=True, timeout=180)
        except subprocess.TimeoutExpired:
            return ["FAIL browser timed out"]
    dom = proc.stdout.decode("utf-8", "replace")
    m = re.search(r'<pre id="__results">(.*?)</pre>', dom, re.S)
    if not m:
        tail = proc.stderr.decode("utf-8", "replace").strip().splitlines()[-3:]
        return ["FAIL no results from the page (did it crash?) " + " | ".join(tail)]
    return unescape(m.group(1)).splitlines()


def main():
    wanted = sys.argv[1:] or SCENARIOS
    unknown = [s for s in wanted if s not in SCENARIOS]
    if unknown:
        sys.exit(f"Unknown scenario(s): {', '.join(unknown)}. Choose from: {', '.join(SCENARIOS)}")

    failures = static_checks()
    browser = find_browser()
    if not browser:
        sys.exit("Chrome/Chromium/Edge not found. Set CHROME=/path/to/browser.")

    build_page()
    try:
        for scenario in wanted:
            lines = run_scenario(browser, scenario)
            bad = [l for l in lines if not l.startswith("PASS")]
            print(f"[{scenario}] {len(lines) - len(bad)} passed, {len(bad)} failed")
            for l in bad:
                print("  " + l)
            failures += len(bad)
    finally:
        GENERATED.unlink(missing_ok=True)

    print("OK" if failures == 0 else f"{failures} FAILURE(S)")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
