// Loads every figure in `figures/`, with the file it comes from and what it
// was verified against.

import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Figure } from "./lib";
import type { Verified } from "./provenance";

export type LoadedFigure = { figure: Figure; file: string; verified?: Verified };

export async function loadFigures(): Promise<LoadedFigure[]> {
    const loaded: LoadedFigure[] = [];
    for (const name of readdirSync(join(import.meta.dir, "figures")).sort()) {
        if (!name.endsWith(".ts")) continue;
        const mod = await import(join(import.meta.dir, "figures", name));
        const figures: Figure[] = Array.isArray(mod.default) ? mod.default : [mod.default];
        for (const figure of figures) {
            loaded.push({
                figure,
                file: `scripts/diagrams/figures/${name}`,
                verified: figure.verified ?? mod.verified,
            });
        }
    }
    return loaded;
}
