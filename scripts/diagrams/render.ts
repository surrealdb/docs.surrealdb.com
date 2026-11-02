// Renders every figure in `figures/` to a light and dark WebP pair:
//
//   bun scripts/diagrams/render.ts               # all figures
//   bun scripts/diagrams/render.ts spatial-index # figures whose name contains the argument
//
// Output goes to src/assets/img/diagrams/<name>.webp (dark) and
// src/assets/img/diagrams/light/<name>-light.webp, the same pairing the other
// docs images use. Needs Google Chrome (set CHROME to override the path) and
// cwebp (`brew install webp`).

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type Figure, THEMES } from "./lib";

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = join(import.meta.dir, "../../src/assets/img/diagrams");
const filter = process.argv[2];

const figures: Figure[] = [];
for (const file of readdirSync(join(import.meta.dir, "figures")).sort()) {
    if (!file.endsWith(".ts")) continue;
    const mod = await import(join(import.meta.dir, "figures", file));
    figures.push(...(Array.isArray(mod.default) ? mod.default : [mod.default]));
}

const work = mkdtempSync(join(tmpdir(), "diagrams-"));
mkdirSync(join(OUT, "light"), { recursive: true });

for (const fig of figures) {
    if (filter && !fig.name.includes(filter)) continue;
    for (const theme of THEMES) {
        const html = join(work, `${fig.name}-${theme.name}.html`);
        const png = join(work, `${fig.name}-${theme.name}.png`);
        writeFileSync(
            html,
            `<!doctype html><html><body style="margin:0">${fig.draw(theme)}</body></html>`,
        );
        execFileSync(
            CHROME,
            [
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                "--force-device-scale-factor=1",
                `--window-size=${fig.width},${fig.height}`,
                `--screenshot=${png}`,
                `file://${html}`,
            ],
            { stdio: "ignore" },
        );
        const out =
            theme.name === "dark"
                ? join(OUT, `${fig.name}.webp`)
                : join(OUT, "light", `${fig.name}-light.webp`);
        execFileSync("cwebp", ["-quiet", "-q", "90", png, "-o", out]);
        console.log(`${fig.name} (${theme.name}) -> ${out}`);
    }
}
