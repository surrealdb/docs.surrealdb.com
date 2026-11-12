/**
 * Writes `src/data/labs.json`: the entries of the awesome-surreal repository as
 * Labs items. awesome-surreal is where Labs entries are added and reviewed, one
 * YAML file per entry in its `entries/` folder, and its README is generated from
 * the same files, so the README and /docs/labs list the same things.
 *
 * The file is committed rather than fetched at build or request time, so the
 * docs never depend on GitHub being up, and every change to the list shows in a
 * pull request diff. Run `bun run generate:labs` after an entry is merged there.
 *
 * Reads the `main` branch from GitHub by default. Set `AWESOME_SURREAL_REF` to
 * read another branch or a commit, or `AWESOME_SURREAL_DIR` to read a local
 * checkout instead.
 *
 * An entry with `labs: false` belongs in the README only. Every other entry is
 * checked against `labSchema`, so a value the Labs filters do not know, such as
 * a new topic, fails here until it is added to `src/utils/labs.ts`.
 *
 * An author with a `github` username and no `avatar` gets the photo from their
 * GitHub profile, saved in `src/assets/img/labs-authors` under the username in
 * lowercase and committed with the data, so the site never loads images from
 * GitHub. A photo already there is kept, so a run only downloads new authors.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { labSchema } from "../src/utils/schema.ts";

const REPO = "surrealdb/awesome-surreal";
const OUTPUT_FILE = "src/data/labs.json";
const AVATAR_DIR = "src/assets/img/labs-authors";

/** Returns the avatar name for a GitHub user, downloading the photo if it is not there yet. */
async function githubAvatar(login) {
    const name = login.toLowerCase();
    if (["jpg", "png"].some((ext) => existsSync(join(AVATAR_DIR, `${name}.${ext}`)))) return name;

    const res = await fetch(`https://github.com/${encodeURIComponent(login)}.png?size=160`);
    // GitHub serves an uploaded photo as JPEG and a generated identicon as PNG.
    const ext = { "image/jpeg": "jpg", "image/png": "png" }[res.headers.get("content-type")];
    if (!res.ok || !ext) {
        console.warn(`[labs] no GitHub photo for ${login} (${res.status}), using the placeholder`);
        return undefined;
    }
    writeFileSync(join(AVATAR_DIR, `${name}.${ext}`), Buffer.from(await res.arrayBuffer()));
    console.log(`[labs] saved the GitHub photo of ${login} as ${name}.${ext}`);
    return name;
}

let dir = process.env.AWESOME_SURREAL_DIR;
let cleanup;
if (!dir) {
    const ref = process.env.AWESOME_SURREAL_REF ?? "main";
    const res = await fetch(
        `https://codeload.github.com/${REPO}/tar.gz/${encodeURIComponent(ref)}`,
    );
    if (!res.ok) throw new Error(`Downloading ${REPO}@${ref} answered ${res.status}`);
    const tmp = mkdtempSync(join(tmpdir(), "awesome-surreal-"));
    const archive = join(tmp, "repo.tar.gz");
    writeFileSync(archive, Buffer.from(await res.arrayBuffer()));
    execFileSync("tar", ["-xzf", archive, "-C", tmp, "--strip-components=1"]);
    dir = tmp;
    cleanup = () => rmSync(tmp, { recursive: true, force: true });
    console.log(`[labs] reading ${REPO}@${ref}`);
} else {
    console.log(`[labs] reading ${dir}`);
}

try {
    const entriesDir = join(dir, "entries");
    const items = [];
    for (const file of readdirSync(entriesDir).sort()) {
        if (!file.endsWith(".yml")) continue;
        const entry = Bun.YAML.parse(readFileSync(join(entriesDir, file), "utf8"));
        if (entry.labs === false) continue;
        const author =
            entry.author === "surrealdb"
                ? "surrealdb"
                : {
                      name: entry.author?.name,
                      role: entry.author?.role,
                      avatar:
                          entry.author?.avatar ??
                          (entry.author?.github && (await githubAvatar(entry.author.github))),
                  };
        const parsed = labSchema.safeParse({
            title: entry.title,
            date: entry.date,
            description: entry.description,
            url: entry.url,
            stage: entry.stage,
            format: entry.format,
            author,
            topics: entry.topics ?? [],
            languages: entry.languages,
        });
        if (!parsed.success) {
            throw new Error(
                `entries/${file}: ${parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`,
            );
        }
        items.push({ slug: file.slice(0, -4), ...parsed.data });
    }

    if (items.length === 0) throw new Error("No entries found, refusing to write an empty file");

    writeFileSync(OUTPUT_FILE, JSON.stringify(items));
    // Formatted by biome so that `bun run qc` passes without a `qa` first.
    execFileSync("bunx", ["biome", "format", "--write", OUTPUT_FILE]);
    console.log(`[labs] wrote ${items.length} entries to ${OUTPUT_FILE}`);
} finally {
    cleanup?.();
}
