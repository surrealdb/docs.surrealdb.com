// Reports screenshots whose UI may have changed since they were taken:
//
//   bun scripts/screenshots/check.ts                 # report, exit 0
//   bun scripts/screenshots/check.ts --strict        # report, exit 1 if anything needs a look
//   bun scripts/screenshots/check.ts --unmapped      # also list screenshots with no manifest entry
//   bun scripts/screenshots/check.ts --accept NAME   # record the screenshot as matching the current UI
//   bun scripts/screenshots/check.ts --accept all
//
// Each entry in manifest.json names the source files in another repository
// that render the screen, and the commit of that repository the screenshot
// matches. A screenshot needs a look when any of those files has changed on
// the main branch since that commit. The check cannot tell whether the change
// is visible, only that the code drawing the screen is different. After
// looking, either retake the screenshot, or accept it as still accurate.
//
// The repositories are read from local clones, which the check does not fetch.
// Run `git -C ~/studio fetch` first, or set STUDIO_REPO to another clone.

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative } from "node:path";

type Capture = "scripted" | "sign-in" | "manual";

interface Entry {
    app: keyof typeof APPS;
    sources: string[];
    capture: Capture;
    baseline: string;
    accepted: string;
}

const APPS = {
    studio: { env: "STUDIO_REPO", clone: join(homedir(), "studio"), branch: "origin/main" },
} as const;

const HOW: Record<Capture, string> = {
    scripted: "retake with the capture script",
    "sign-in": "retake with the capture script, signed in to SurrealDB Cloud",
    manual: "retake by hand",
};

const ROOT = join(import.meta.dir, "../..");
const IMG = join(ROOT, "src/assets/img");
const CONTENT = join(ROOT, "src/content");
const MANIFEST = join(import.meta.dir, "manifest.json");

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const unmapped = args.includes("--unmapped");
const acceptAt = args.indexOf("--accept");
const accept = acceptAt >= 0 ? (args[acceptAt + 1] ?? "") : undefined;

const manifest: Record<string, Entry> = JSON.parse(readFileSync(MANIFEST, "utf8"));

function repo(app: Entry["app"]): string {
    const { env, clone } = APPS[app];
    const dir = process.env[env] ?? clone;
    if (!existsSync(join(dir, ".git"))) {
        console.error(`No clone of ${app} at ${dir}. Clone it there or set ${env}.`);
        process.exit(2);
    }
    return dir;
}

function git(dir: string, ...rest: string[]): string {
    const out = spawnSync("git", ["-C", dir, ...rest], { encoding: "utf8" });
    if (out.status !== 0) throw new Error(`git ${rest.join(" ")}: ${out.stderr.trim()}`);
    return out.stdout.trim();
}

const today = () => new Date().toISOString().slice(0, 10);

// Screenshots the content shows, as paths under src/assets/img. Diagrams are
// checked by scripts/diagrams/check.ts instead.
function shownImages(): Map<string, string[]> {
    const shown = new Map<string, string[]>();
    const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
            const path = join(dir, name);
            if (statSync(path).isDirectory()) walk(path);
            else if (/\.mdx?$/.test(name)) {
                const text = readFileSync(path, "utf8");
                for (const [, image] of text.matchAll(
                    /~\/assets\/img\/([^"')\s]+\.(?:png|jpe?g|webp|gif))/g,
                )) {
                    if (image.startsWith("diagrams/")) continue;
                    const pages = shown.get(image) ?? [];
                    pages.push(relative(ROOT, path));
                    shown.set(image, pages);
                }
            }
        }
    };
    walk(CONTENT);
    return shown;
}

const shown = shownImages();
const notes: string[] = [];

for (const [image, entry] of Object.entries(manifest)) {
    const dir = repo(entry.app);
    const head = git(dir, "rev-parse", "--short", APPS[entry.app].branch);

    if (accept === "all" || accept === image) {
        manifest[image] = { ...entry, baseline: head, accepted: today() };
        continue;
    }

    const issues: string[] = [];
    if (!existsSync(join(IMG, image))) issues.push("image file is missing");
    if (!shown.has(image)) issues.push("not shown on any page");
    for (const source of entry.sources) {
        if (!git(dir, "ls-tree", "--name-only", APPS[entry.app].branch, "--", source))
            issues.push(`source no longer exists in ${entry.app}: ${source}`);
    }
    const commits = git(
        dir,
        "log",
        "--format=%h %cs %s",
        `${entry.baseline}..${APPS[entry.app].branch}`,
        "--",
        ...entry.sources,
    );
    if (commits) {
        const list = commits.split("\n");
        issues.push(
            `${list.length} ${entry.app} commit(s) changed its sources since ${entry.baseline}:`,
            ...list.slice(0, 5).map((c) => `    ${c}`),
            ...(list.length > 5 ? [`    and ${list.length - 5} more`] : []),
        );
    }
    if (issues.length) {
        const pages = shown.get(image)?.join(", ") ?? "no page";
        notes.push(
            `${image} (${pages})\n${issues.map((i) => (i.startsWith("    ") ? i : `  - ${i}`)).join("\n")}\n  To fix: ${HOW[entry.capture]}, or accept it if the change is not visible.`,
        );
    }
}

const missing = [...shown.keys()].filter((image) => !(image in manifest)).sort();

if (accept !== undefined) {
    writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 4)}\n`);
    console.log(
        `Accepted ${accept === "all" ? "every screenshot" : accept} as matching the current UI.`,
    );
} else {
    const mapped = Object.keys(manifest).length;
    if (notes.length)
        console.log(`${notes.length} screenshot(s) to look at:\n\n${notes.join("\n\n")}\n`);
    else console.log(`All ${mapped} mapped screenshots match the UI they were taken from.\n`);
    console.log(`${missing.length} screenshot(s) shown in the docs have no manifest entry yet.`);
    if (unmapped)
        for (const image of missing) console.log(`  ${image} (${shown.get(image)?.join(", ")})`);
    if (strict && notes.length) process.exit(1);
}
