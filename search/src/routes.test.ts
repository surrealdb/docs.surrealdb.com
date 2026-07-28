// Drift guard for the committed route table.
//
// `generated/search-routes.json` is compiled from the content tree by
// plugins/vite-search-index.ts but committed, because api/search.ts
// imports it and that function is bundled by Vercel rather than by
// Vite. A committed artefact can go stale, so these tests recheck it
// against its two sources — the route list the pages are served from,
// and the `search` block each collection declares — without needing
// Vite to recompile anything.
//
// If this fails, run any Vite command (`bun run build`) and commit the
// regenerated generated/search-routes.json.

import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { COLLECTION_ROUTES } from "../../src/utils/routes";
import type { SearchRouteTable } from "./routes";

const REPO_ROOT = new URL("../../", import.meta.url);

const routeTable: SearchRouteTable = await Bun.file(
    new URL("generated/search-routes.json", REPO_ROOT),
).json();

/** The `search` block a collection declares in its root `__category.json`. */
async function declaredMetadata(id: string) {
    const raw = await readFile(new URL(`src/content/${id}/__category.json`, REPO_ROOT), "utf-8");
    return JSON.parse(raw).search as { label: string; kind: string; product?: string } | undefined;
}

describe("committed route table", () => {
    test("covers exactly the collections the pages are served from", () => {
        const compiled = routeTable.collections.map((route) => route.id).sort();
        const served = COLLECTION_ROUTES.map((route) => route.id).sort();

        expect(compiled).toEqual(served);
    });

    test("serves each collection from the prefix its pages use", () => {
        const prefixes = Object.fromEntries(
            COLLECTION_ROUTES.map((route) => [route.id, route.prefix]),
        );

        for (const route of routeTable.collections) {
            expect(route.prefix).toBe(prefixes[route.id]);
        }
    });

    test("matches the label, kind, and product each collection declares", async () => {
        for (const route of routeTable.collections) {
            const declared = await declaredMetadata(route.id);

            if (!declared) {
                throw new Error(`${route.id}/__category.json declares no search metadata`);
            }

            expect(route.label).toBe(declared.label);
            expect(route.kind).toBe(declared.kind);

            if (declared.product) {
                expect(route.product).toBe(declared.product);
            }
        }
    });

    test("names the SDK language after the collection directory", () => {
        for (const route of routeTable.collections) {
            if (!route.language) continue;

            expect(route.language).toBe(route.id.split("/").pop() as string);
        }
    });

    test("records the base path the site is served under", () => {
        expect(routeTable.base).toBe("/docs");
    });
});
