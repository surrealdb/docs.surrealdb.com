/**
 * Sweeps every page on a running dev server and reports fragment links whose
 * target id does not exist on the destination page.
 *
 * The class of defect this catches: a heading gets renamed and a hand-written
 * link keeps the old slug. The rot is silent - the page still loads, the
 * reader just lands at the top - which is how 299 of these accumulated before
 * the 2026 audit swept for them.
 *
 * Usage: with `bun run dev` up, `bun scripts/check-anchors.mjs [base-url]`.
 * Exits 1 when broken anchors are found. Anchors into inactive <TabItem>
 * content are a known limitation and are reported separately, not as failures.
 */
import { readFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:4321";
const paths = readFileSync(new URL("../generated/valid-paths.json", import.meta.url), "utf8");

// valid-paths only holds the root pages; walk the sitemap route list instead
async function collectPaths() {
    // The dev server does not serve the sitemap; read the last build's copy.
    for (const source of ["../dist/client/sitemap.xml", "../.vercel/output/sitemap.xml"]) {
        try {
            const xml = readFileSync(new URL(source, import.meta.url), "utf8");
            return [...xml.matchAll(/<loc>[^<]*surrealdb\.com(\/docs[^<]*)<\/loc>/g)].map(
                (m) => m[1],
            );
        } catch {
            // try the next location
        }
    }

    const res = await fetch(`${BASE}/docs/sitemap.xml`).catch(() => null);
    if (res?.ok) {
        const xml = await res.text();
        return [...xml.matchAll(/<loc>[^<]*surrealdb\.com(\/docs[^<]*)<\/loc>/g)].map((m) => m[1]);
    }
    return JSON.parse(paths).map((p) => `/docs${p === "/" ? "" : p}`);
}

const pages = await collectPaths();
const cache = new Map();

async function page(path) {
    if (!cache.has(path)) {
        cache.set(
            path,
            fetch(`${BASE}${path}`)
                .then((r) => (r.ok ? r.text() : ""))
                .catch(() => ""),
        );
    }
    return cache.get(path);
}

let broken = 0;
let tabHidden = 0;

for (const path of pages) {
    const html = await page(path);
    if (!html) continue;

    const ids = new Set([...html.matchAll(/id="([^"]*)"/g)].map((m) => m[1]));
    const links = [...html.matchAll(/href="((?:\/docs[^"#]*)?)#([^"]+)"/g)];

    for (const [, target, frag] of links) {
        if (frag === "top") continue;
        const targetPath = target || path;
        const targetHtml = targetPath === path ? html : await page(targetPath);
        if (!targetHtml) continue;
        const targetIds =
            targetPath === path
                ? ids
                : new Set([...targetHtml.matchAll(/id="([^"]*)"/g)].map((m) => m[1]));

        if (!targetIds.has(frag)) {
            // content inside a non-active TabItem never renders server-side
            if (targetHtml.includes("mantine-Tabs-panel")) {
                tabHidden++;
                console.log(`  tab-hidden? ${path} -> ${targetPath}#${frag}`);
            } else {
                broken++;
                console.log(`  BROKEN      ${path} -> ${targetPath}#${frag}`);
            }
        }
    }
}

console.log(`\n${broken} broken anchors, ${tabHidden} pointing into tabbed content`);
process.exit(broken > 0 ? 1 : 0);
