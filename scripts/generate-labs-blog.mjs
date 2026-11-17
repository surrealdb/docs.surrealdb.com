/**
 * Writes `src/data/labs-blog.json`: the SurrealDB blog's tutorial and
 * engineering posts as Labs items, so the Labs listing shows them beside the
 * awesome-surreal entries in `src/data/labs.json`.
 *
 * The file is committed rather than fetched at build or request time, so the
 * docs never depend on the website API being up, and every new post shows in a
 * pull request diff. Run `bun run generate:labs-blog` after posts are published.
 *
 * The list endpoint gives authors only as record ids. `src/data/labs-blog-authors.json`
 * maps an id to the `name`, `role` and `avatar` a Labs card shows; the first of a
 * post's authors found there is credited, and a post with none credits SurrealDB.
 * Add an id there to credit its author, with a matching
 * `src/assets/img/labs-authors/<avatar>.jpg` for the photo.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { labSchema } from "../src/utils/schema.ts";

const BLOG_API = "https://api.surrealdb.com/api/website/v1/blogs";
const OUTPUT_FILE = "src/data/labs-blog.json";
const AUTHORS_FILE = "src/data/labs-blog-authors.json";
const CATEGORIES = ["tutorials", "engineering"];

const authors = JSON.parse(readFileSync(AUTHORS_FILE, "utf8"));

const res = await fetch(BLOG_API, { headers: { Accept: "application/json" } });
if (!res.ok) throw new Error(`${BLOG_API} answered ${res.status}`);

const posts = await res.json();

const items = posts
    .filter((p) => p.publish_date && p.categories?.some((c) => CATEGORIES.includes(c)))
    .map((p) => ({
        slug: `blog-${p.slug}`,
        ...labSchema.parse({
            title: p.title,
            date: p.publish_date.slice(0, 10),
            description: p.summary || undefined,
            url: `https://surrealdb.com/blog/${p.slug}`,
            // A post in both categories is a tutorial first.
            stage: p.categories.includes("tutorials") ? "Learn" : "Explore",
            format: "Article",
            author: p.authors?.map((id) => authors[id]).find(Boolean) ?? "surrealdb",
            topics: p.categories.includes("ai") ? ["AI"] : [],
        }),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

if (items.length === 0) throw new Error("No blog posts matched, refusing to write an empty file");

writeFileSync(OUTPUT_FILE, JSON.stringify(items));
// Formatted by biome so that `bun run qc` passes without a `qa` first.
execFileSync("bunx", ["biome", "format", "--write", OUTPUT_FILE]);
console.log(`[labs-blog] wrote ${items.length} posts to ${OUTPUT_FILE}`);
