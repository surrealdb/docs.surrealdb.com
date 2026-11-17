// Figures that SurrealDB University lessons on www.surrealdb.com show as well.
//
// A figure listed in shared.json is copied to public/diagrams/, where it has a
// fixed address: /docs/diagrams/<name>.webp for the dark image and
// /docs/diagrams/<name>-light.webp for the light one. The images under
// src/assets are imported by the docs pages and get a hashed name in each
// build, so they cannot be linked from another site.
//
// shared.json maps each figure to the lesson files in www.surrealdb.com that
// show it, so that a change to the figure here names the lessons to look at.
// www accepts these addresses in course content only (see validate-images.ts
// in that repo), so a shared figure cannot appear on the rest of the website.
//
//   bun scripts/diagrams/share.ts   # copy the shared figures to public/diagrams

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { ROOT } from "./provenance";

const SHARED = join(import.meta.dir, "shared.json");
const ASSETS = join(ROOT, "src/assets/img/diagrams");
export const PUBLIC = join(ROOT, "public/diagrams");
export const WWW = process.env.WWW_REPO ?? join(homedir(), "www.surrealdb.com");

// Figure name to the www.surrealdb.com files that show it, relative to that repo
export type Shared = Record<string, string[]>;

export function readShared(): Shared {
    return existsSync(SHARED) ? JSON.parse(readFileSync(SHARED, "utf8")) : {};
}

export const publicUrl = (name: string) => `/docs/diagrams/${name}.webp`;

// The rendered image and its public copy, for both themes
export function pairs(name: string): [string, string][] {
    return [
        [join(ASSETS, `${name}.webp`), join(PUBLIC, `${name}.webp`)],
        [join(ASSETS, "light", `${name}-light.webp`), join(PUBLIC, `${name}-light.webp`)],
    ];
}

const same = (a: string, b: string) =>
    existsSync(a) && existsSync(b) && readFileSync(a).equals(readFileSync(b));

// Copies every shared figure to public/diagrams and removes any copy that is
// no longer listed. Returns what changed.
export function publishShared(): string[] {
    const shared = readShared();
    const changed: string[] = [];
    mkdirSync(PUBLIC, { recursive: true });
    for (const name of Object.keys(shared)) {
        for (const [from, to] of pairs(name)) {
            if (!existsSync(from)) throw new Error(`${name} has no rendered image at ${from}`);
            if (same(from, to)) continue;
            copyFileSync(from, to);
            changed.push(`copied ${to}`);
        }
    }
    const wanted = new Set(Object.keys(shared).flatMap((n) => pairs(n).map(([, to]) => to)));
    for (const file of readdirSync(PUBLIC)) {
        const path = join(PUBLIC, file);
        if (wanted.has(path)) continue;
        rmSync(path);
        changed.push(`removed ${path}`);
    }
    return changed;
}

// Problems with the shared figures, for check.ts. `figures` is every figure name.
export function sharedIssues(figures: Set<string>): string[] {
    const shared = readShared();
    const notes: string[] = [];
    const www = existsSync(WWW);
    for (const [name, lessons] of Object.entries(shared)) {
        const issues: string[] = [];
        if (!figures.has(name)) issues.push("listed in shared.json but no figure draws it");
        if (pairs(name).some(([from, to]) => !same(from, to)))
            issues.push("public copy missing or out of date; run bun run diagrams:share");
        if (lessons.length === 0) issues.push("shared.json lists no lesson that shows it");
        if (www)
            for (const lesson of lessons) {
                const path = join(WWW, lesson);
                if (!existsSync(path)) issues.push(`lesson not found in www: ${lesson}`);
                else if (!readFileSync(path, "utf8").includes(publicUrl(name)))
                    issues.push(`lesson does not show it: ${lesson}`);
            }
        if (issues.length)
            notes.push(`${name} (shared)\n${issues.map((i) => `  - ${i}`).join("\n")}`);
    }
    if (existsSync(PUBLIC))
        for (const file of readdirSync(PUBLIC)) {
            const name = file.replace(/(-light)?\.webp$/, "");
            if (!(name in shared))
                notes.push(
                    `public/diagrams/${file}\n  - not listed in shared.json; run bun run diagrams:share`,
                );
        }
    if (www) notes.push(...unlistedLessons(shared));
    return notes;
}

// Lessons in www that show a shared figure without being listed for it, so
// that every lesson using a figure is named when the figure changes
function unlistedLessons(shared: Shared): string[] {
    const notes: string[] = [];
    const content = join(WWW, "src/content");
    if (!existsSync(content)) return notes;
    const files = readdirSync(content, { recursive: true, encoding: "utf8" }).filter((f) =>
        /\.mdx?$/.test(f),
    );
    for (const file of files) {
        const text = readFileSync(join(content, file), "utf8");
        for (const m of text.matchAll(/\/docs\/diagrams\/([\w-]+?)(?:-light)?\.webp/g)) {
            const lesson = `src/content/${file}`;
            if (!shared[m[1]]?.includes(lesson))
                notes.push(
                    `${m[1]} (shared)\n  - shown by ${lesson} in www, which shared.json does not list`,
                );
        }
    }
    return [...new Set(notes)];
}
