// Reports figures that may no longer match the pages they are on:
//
//   bun scripts/diagrams/check.ts                 # report, exit 0
//   bun scripts/diagrams/check.ts --strict        # report, exit 1 if anything needs a look
//   bun scripts/diagrams/check.ts --accept NAME   # record the current sections as checked
//   bun scripts/diagrams/check.ts --accept all
//
// A figure needs a look when the text of a section that shows it has changed
// since it was rendered or accepted, when it has been placed somewhere new or
// removed from a page, or when nothing records what it was verified against.
// The check cannot tell whether the figure is now wrong, only that the words
// it was drawn to match are different. After looking, either fix and re-render
// the figure, or accept it as still accurate.

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadFigures } from "./figures-index";
import { type Placement, placements, readManifest, today, writeManifest } from "./provenance";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const acceptAt = args.indexOf("--accept");
const accept = acceptAt >= 0 ? (args[acceptAt + 1] ?? "") : undefined;

const manifest = readManifest();
const figures = await loadFigures();
const key = (p: Placement) => `${p.page} # ${p.heading}`;
const notes: string[] = [];

for (const { figure, file, verified } of figures) {
    const now = placements(figure.name);
    const entry = manifest[figure.name];
    if (accept === "all" || accept === figure.name) {
        manifest[figure.name] = {
            figure: file,
            verified,
            rendered: entry?.rendered,
            accepted: today(),
            placements: now,
        };
        continue;
    }
    const issues: string[] = [];
    if (!verified) issues.push("nothing records what it was verified against");
    if (!entry) issues.push("not in manifest.json; render it or accept it");
    if (now.length === 0) issues.push("not shown on any page");
    if (!existsSync(join(import.meta.dir, `../../src/assets/img/diagrams/${figure.name}.webp`)))
        issues.push("no rendered image; run render.ts");
    if (entry) {
        const before = new Map(entry.placements.map((p) => [key(p), p.hash]));
        const after = new Map(now.map((p) => [key(p), p.hash]));
        for (const [k, hash] of after) {
            if (!before.has(k)) issues.push(`newly shown in ${k}`);
            else if (before.get(k) !== hash) issues.push(`section changed: ${k}`);
        }
        for (const k of before.keys()) if (!after.has(k)) issues.push(`no longer shown in ${k}`);
    }
    if (issues.length)
        notes.push(`${figure.name} (${file})\n${issues.map((i) => `  - ${i}`).join("\n")}`);
}

// Images with no figure source left to draw them
const named = new Set(figures.map((f) => f.figure.name));
for (const image of readdirSync(join(import.meta.dir, "../../src/assets/img/diagrams"))) {
    const name = image.replace(/\.webp$/, "");
    if (image.endsWith(".webp") && !named.has(name))
        notes.push(`${name}\n  - image has no figure in scripts/diagrams/figures`);
}

if (accept !== undefined) {
    writeManifest(manifest);
    console.log(`Accepted ${accept === "all" ? "every figure" : accept} as matching its pages.`);
} else if (notes.length) {
    console.log(`${notes.length} figure(s) to look at:\n\n${notes.join("\n\n")}`);
    if (strict) process.exit(1);
} else {
    console.log(`All ${figures.length} figures match the pages they were drawn for.`);
}
