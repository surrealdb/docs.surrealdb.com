/**
 * Checks that the SDK references share the addresses of their concept pages.
 *
 * A reader who knows `/docs/reference/javascript/concepts/executing-queries`
 * can swap the language in the address and land on the same topic in another
 * SDK, as in `/docs/reference/dotnet/concepts/executing-queries`. That only
 * works while every SDK uses the same slug for the same concept, so this check
 * reads `src/content/reference/<sdk>/concepts` for each SDK that follows the
 * layout and fails when:
 *
 * - An SDK lacks one of the concepts that every SDK has (`REQUIRED`).
 * - An SDK lacks a concept that most SDKs have (`EXPECTED`) and the gap is not
 *   recorded in `KNOWN_GAPS` with its reason.
 * - A recorded gap is out of date, because the page now exists.
 * - An SDK folder has a concept page with a slug that another SDK spells
 *   differently (`ALIASES`), such as `writing-surrealql` where the others use
 *   `executing-queries`.
 * - A shared concept page has a title or a sidebar position other than the one
 *   in `SHARED`, so the sidebar lists the concepts in the same order in every
 *   SDK.
 * - Two pages of one SDK have the same position, because a tie falls back to
 *   the order of the files.
 *
 * A page that only one SDK needs, such as `codecs` in the JavaScript SDK or
 * `dependency-injection` in the .NET SDK, is not a gap. PHP is checked at its
 * current version, `php/v2`.
 *
 * It reads the repository only, so it needs no network.
 *
 * Usage: bun scripts/check-sdk-parity.ts
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const REFERENCE = join(ROOT, "src/content/reference");

/** The SDKs, and the folder under `src/content/reference` that holds their concept pages. */
const SDKS: Record<string, string> = {
    javascript: "javascript",
    python: "python",
    golang: "golang",
    java: "java",
    kotlin: "kotlin",
    mojo: "mojo",
    dotnet: "dotnet",
    rust: "rust",
    swift: "swift",
    php: "php/v2",
};

/** The title and the sidebar position of each shared concept page. */
const SHARED: Record<string, { title: string; position: number }> = {
    "connecting-to-surrealdb": { title: "Connecting to SurrealDB", position: 1 },
    authentication: { title: "Authentication", position: 2 },
    "executing-queries": { title: "Executing queries", position: 3 },
    "data-manipulation": { title: "Data manipulation", position: 4 },
    "value-types": { title: "Value types", position: 5 },
    "live-queries": { title: "Live queries", position: 6 },
    transactions: { title: "Transactions", position: 7 },
    "error-handling": { title: "Error handling", position: 8 },
    "multiple-sessions": { title: "Multiple sessions", position: 9 },
    "import-and-export": { title: "Import and export", position: 13 },
};

/** Concept pages that every SDK has. */
const REQUIRED = [
    "connecting-to-surrealdb",
    "authentication",
    "executing-queries",
    "live-queries",
    "value-types",
];

/** Concept pages that most SDKs have, where a missing one is recorded as a gap. */
const EXPECTED = [
    "data-manipulation",
    "transactions",
    "error-handling",
    "multiple-sessions",
    "import-and-export",
];

/** A recorded gap: the concept, the SDK and why the page is not there. */
const KNOWN_GAPS: Record<string, Record<string, string>> = {
    "data-manipulation": {
        javascript: "The JavaScript SDK covers record methods in executing-queries.",
        php: "Not written yet.",
    },
    transactions: {
        swift: "Not written yet.",
    },
    "error-handling": {
        dotnet: "Not written yet.",
        swift: "Not written yet.",
    },
    "multiple-sessions": {
        rust: "The Rust SDK has no multiple sessions API.",
        swift: "Not written yet.",
    },
    "import-and-export": {
        javascript: "Not written yet.",
        java: "Not written yet.",
        kotlin: "Not written yet.",
        mojo: "Not written yet.",
        swift: "Not written yet.",
        php: "Not written yet.",
    },
};

/** Slugs that mean a shared concept under another name, and the slug to use. */
const ALIASES: Record<string, string> = {
    connecting: "connecting-to-surrealdb",
    "create-a-new-connection": "connecting-to-surrealdb",
    "connection-management": "connecting-to-surrealdb",
    "writing-surrealql": "executing-queries",
    queries: "executing-queries",
    "data-types": "value-types",
    types: "value-types",
    auth: "authentication",
    sessions: "multiple-sessions",
    errors: "error-handling",
    "authenticating-users": "authentication",
    live: "live-queries",
    transaction: "transactions",
    "working-with-types": "value-types",
};

function concepts(sdk: string): Set<string> {
    const folder = join(REFERENCE, SDKS[sdk], "concepts");

    if (!existsSync(folder)) return new Set();

    return new Set(
        readdirSync(folder)
            .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("index."))
            .map((file) => file.replace(/\.mdx?$/, "")),
    );
}

/** The title and position in the frontmatter of a concept page. */
function frontmatter(sdk: string, slug: string): { title: string; position: number } {
    const text = readFileSync(join(REFERENCE, SDKS[sdk], "concepts", `${slug}.mdx`), "utf8");
    const block = text.split("---")[1] ?? "";
    const title =
        block
            .match(/^title:\s*(.*)$/m)?.[1]
            ?.trim()
            .replace(/^"|"$/g, "") ?? "";
    const position = Number(block.match(/^position:\s*(-?\d+)\s*$/m)?.[1] ?? Number.NaN);

    return { title, position };
}

function main(): number {
    const problems: string[] = [];
    const sdks = Object.keys(SDKS);
    const have = new Map(sdks.map((sdk) => [sdk, concepts(sdk)]));

    for (const slug of REQUIRED) {
        for (const sdk of sdks) {
            if (!have.get(sdk)?.has(slug)) {
                problems.push(`${sdk} has no concepts/${slug}, which every SDK has.`);
            }
        }
    }

    for (const slug of EXPECTED) {
        for (const sdk of sdks) {
            const exists = have.get(sdk)?.has(slug) === true;
            const reason = KNOWN_GAPS[slug]?.[sdk];

            if (!exists && !reason) {
                problems.push(
                    `${sdk} has no concepts/${slug}. Write it, or record the gap in KNOWN_GAPS with its reason.`,
                );
            }

            if (exists && reason) {
                problems.push(
                    `${sdk} now has concepts/${slug}, so remove its entry from KNOWN_GAPS.`,
                );
            }
        }
    }

    for (const [slug, gapSdks] of Object.entries(KNOWN_GAPS)) {
        for (const sdk of Object.keys(gapSdks)) {
            if (!sdks.includes(sdk) || !EXPECTED.includes(slug)) {
                problems.push(
                    `KNOWN_GAPS names ${sdk} and ${slug}, which this check does not cover.`,
                );
            }
        }
    }

    for (const sdk of sdks) {
        for (const slug of have.get(sdk) ?? []) {
            const shared = ALIASES[slug];

            if (shared) {
                problems.push(
                    `${sdk}/concepts/${slug} covers the concept that the other SDKs call ${shared}. Rename the page so the address matches.`,
                );
            }
        }
    }

    for (const sdk of sdks) {
        const seen = new Map<number, string>();

        for (const slug of have.get(sdk) ?? []) {
            const { title, position } = frontmatter(sdk, slug);
            const shared = SHARED[slug];

            if (shared && title !== shared.title) {
                problems.push(
                    `${sdk}/concepts/${slug} is titled "${title}", not "${shared.title}".`,
                );
            }

            if (shared && position !== shared.position) {
                problems.push(
                    `${sdk}/concepts/${slug} has position ${position}, not ${shared.position}.`,
                );
            }

            if (Number.isNaN(position)) {
                problems.push(`${sdk}/concepts/${slug} has no numeric position.`);
            } else if (seen.has(position)) {
                problems.push(
                    `${sdk}/concepts/${slug} and ${seen.get(position)} both have position ${position}.`,
                );
            } else {
                seen.set(position, slug);
            }
        }
    }

    if (problems.length > 0) {
        for (const problem of problems) console.error(`[sdk-parity] ${problem}`);
        console.error(
            `[sdk-parity] ${problems.length} problem${problems.length === 1 ? "" : "s"}.`,
        );
        return 1;
    }

    const gaps = Object.values(KNOWN_GAPS).reduce((sum, list) => sum + Object.keys(list).length, 0);

    console.log(
        `[sdk-parity] ${sdks.length} SDKs, ${REQUIRED.length} concepts in all of them, ${gaps} recorded gaps`,
    );
    return 0;
}

process.exit(main());
