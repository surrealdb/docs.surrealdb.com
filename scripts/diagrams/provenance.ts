// Where each figure is used, and what it was drawn from, so that a change to a
// page can be traced to the figures that may no longer match it.
//
// A figure's placements are found by scanning src/content for its image path,
// so they never have to be listed by hand. Each placement is fingerprinted by
// the text of the section around it: the lines from the heading above the
// image to the next heading of the same or a higher level, without the image
// lines themselves. The fingerprints are stored in manifest.json when a figure
// is rendered or accepted, and check.ts reports any that have since changed.

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

export const ROOT = join(import.meta.dir, "../..");
const CONTENT = join(ROOT, "src/content");
export const MANIFEST = join(import.meta.dir, "manifest.json");

// What a figure was checked against before it was drawn: a release, a source
// commit, or the page's own example, with the date of the check
export type Verified = { against: string; on: string };

export type Placement = { page: string; heading: string; hash: string };

export type ManifestEntry = {
    figure: string;
    verified?: Verified;
    // When the images were last rendered, and when a person or agent last
    // confirmed that the figure still matches pages that had changed
    rendered?: string;
    accepted?: string;
    placements: Placement[];
};

export type Manifest = Record<string, ManifestEntry>;

function contentFiles(dir: string, out: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) contentFiles(path, out);
        else if (/\.mdx?$/.test(name)) out.push(path);
    }
    return out;
}

const imagePath = (name: string) => `assets/img/diagrams/${name}.webp`;

// The sections of every page that show the figure, with a fingerprint of each
export function placements(name: string): Placement[] {
    const found: Placement[] = [];
    for (const file of contentFiles(CONTENT)) {
        const text = readFileSync(file, "utf8");
        if (!text.includes(imagePath(name))) continue;
        const lines = text.split("\n");
        // Headings outside code fences, with their level
        const headings: [number, number, string][] = [];
        let fenced = false;
        lines.forEach((line, i) => {
            if (/^\s*```/.test(line)) fenced = !fenced;
            const m = !fenced && /^(#{1,6})\s+(.*)$/.exec(line);
            if (m) headings.push([i, m[1].length, m[2].trim()]);
        });
        lines.forEach((line, i) => {
            if (!line.includes(imagePath(name))) return;
            const above = headings.filter(([at]) => at < i).pop();
            const start = above ? above[0] : 0;
            const next = headings.find(([at, level]) => at > i && (!above || level <= above[1]));
            const end = next ? next[0] : lines.length;
            const section = lines
                .slice(start, end)
                .filter((l) => !l.includes("assets/img/diagrams/"))
                .join("\n")
                .trim();
            found.push({
                page: relative(ROOT, file),
                heading: above ? above[2] : "(top of page)",
                hash: createHash("sha256").update(section).digest("hex").slice(0, 16),
            });
        });
    }
    return found.sort((a, b) => a.page.localeCompare(b.page) || a.heading.localeCompare(b.heading));
}

export function readManifest(): Manifest {
    return existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
}

export function writeManifest(manifest: Manifest) {
    const sorted = Object.fromEntries(
        Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
    );
    writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 4)}\n`);
}

export const today = () => new Date().toISOString().slice(0, 10);
