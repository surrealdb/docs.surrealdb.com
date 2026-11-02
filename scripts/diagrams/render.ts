// Renders every figure in `figures/` to a light and dark WebP pair:
//
//   bun scripts/diagrams/render.ts               # all figures
//   bun scripts/diagrams/render.ts spatial-index # figures whose name contains the argument
//
// Output goes to src/assets/img/diagrams/<name>.webp (dark) and
// src/assets/img/diagrams/light/<name>-light.webp, the same pairing the other
// docs images use. Each render also records the figure in manifest.json, with
// a fingerprint of every page section that shows it, and embeds the same
// provenance in the WebP files as XMP. See check.ts for how the fingerprints
// are used.
//
// Needs Google Chrome (set CHROME to override the path), and cwebp and
// webpmux (`brew install webp`).

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadFigures } from "./figures-index";
import { THEMES } from "./lib";
import { placements, readManifest, today, writeManifest } from "./provenance";

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = join(import.meta.dir, "../../src/assets/img/diagrams");
const filter = process.argv[2];

const escapeXml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function xmp(name: string, file: string, against: string, pages: string[]): string {
    const description = `${name}, drawn by ${file}. Verified against ${against}. Shown on ${pages.join(", ") || "no page"}. Provenance and section fingerprints: scripts/diagrams/manifest.json.`;
    return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:source>${escapeXml(file)}</dc:source><dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(description)}</rdf:li></rdf:Alt></dc:description></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
}

const work = mkdtempSync(join(tmpdir(), "diagrams-"));
mkdirSync(join(OUT, "light"), { recursive: true });
const manifest = readManifest();

for (const { figure: fig, file, verified } of await loadFigures()) {
    if (filter && !fig.name.includes(filter)) continue;
    const shown = placements(fig.name);
    const meta = join(work, `${fig.name}.xmp`);
    writeFileSync(
        meta,
        xmp(
            fig.name,
            file,
            verified ? `${verified.against} on ${verified.on}` : "nothing recorded",
            [...new Set(shown.map((p) => p.page))],
        ),
    );
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
        const plain = join(work, `${fig.name}-${theme.name}.webp`);
        execFileSync("cwebp", ["-quiet", "-q", "90", png, "-o", plain]);
        execFileSync("webpmux", ["-set", "xmp", meta, plain, "-o", `${plain}.xmp`], {
            stdio: "ignore",
        });
        renameSync(`${plain}.xmp`, out);
        console.log(`${fig.name} (${theme.name}) -> ${out}`);
    }
    manifest[fig.name] = { figure: file, verified, rendered: today(), placements: shown };
}

writeManifest(manifest);
