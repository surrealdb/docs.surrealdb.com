import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const CONTENT_DIR = "src/content";
const OUTPUT_FILE = "generated/valid-paths.json";

const URL_PREFIX = {
    "doc-surrealdb": "surrealdb",
    "doc-cloud": "cloud",
    "doc-surrealist": "surrealist",
    "doc-surrealml": "surrealml",
    "doc-surrealql": "surrealql",
    "doc-integrations": "integrations",
    "doc-tutorials": "tutorials",
    "doc-sdk-dotnet": "sdk/dotnet",
    "doc-sdk-golang": "sdk/golang",
    "doc-sdk-java": "sdk/java",
    "doc-sdk-javascript": "sdk/javascript",
    "doc-sdk-php": "sdk/php",
    "doc-sdk-python": "sdk/python",
    "doc-sdk-rust": "sdk/rust",
    "doc-sdk-java-1x": "1.x/sdk/java",
    "doc-sdk-javascript-1x": "1.x/sdk/javascript",
    "doc-sdk-python-1x": "1.x/sdk/python",
};

function walkDir(dir) {
    const results = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            results.push(...walkDir(full));
        } else if (entry.endsWith(".mdx")) {
            results.push(full);
        }
    }
    return results;
}

function fileToSlug(filePath, collectionDir) {
    let slug = relative(collectionDir, filePath).replace(/\.\w+$/, "");
    if (slug.endsWith("/index")) slug = slug.slice(0, -6);
    if (slug === "index") slug = "";
    return slug;
}

const paths = new Set(["/", "/labs"]);

for (const [collection, prefix] of Object.entries(URL_PREFIX)) {
    const dir = join(CONTENT_DIR, collection);
    try {
        statSync(dir);
    } catch {
        continue;
    }

    const files = walkDir(dir);
    paths.add(`/${prefix}`);

    for (const file of files) {
        const slug = fileToSlug(file, dir);
        if (slug) {
            paths.add(`/${prefix}/${slug}`);
        }
    }
}

mkdirSync("generated", { recursive: true });
writeFileSync(OUTPUT_FILE, `${JSON.stringify([...paths].sort(), null, 2)}\n`);
console.log(`Generated ${paths.size} valid paths → ${OUTPUT_FILE}`);
