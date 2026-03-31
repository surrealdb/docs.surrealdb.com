import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { type AnyNode, type BlockNode, parseMarkdown, type Root, visit } from "@surrealdb/ui";
import matter from "gray-matter";
import {
    abstractDoc,
    type DocCollection,
    docCollections,
    urlForCollection,
    versionedSdks,
} from "../../src/content/config";
import type { CrawledEntry, CrawledPage, CrawledSection } from "../src/types";

const CONTENT_DIR = join(import.meta.dirname, "../../src/content");

interface CategoryMeta {
    sidebar_label: string;
    sidebar_position: number;
}

const VERSIONED_COLLECTION_IDS = new Set(
    Object.entries(versionedSdks).flatMap(([sdk, config]) =>
        config ? config.versions.map((v) => `doc-sdk-${sdk}-${v.replace(".", "")}`) : [],
    ),
);

async function* walkMarkdown(dir: string): AsyncGenerator<string> {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const full = join(dir, entry.name);

        if (entry.isDirectory()) {
            yield* walkMarkdown(full);
        } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
            yield full;
        }
    }
}

async function loadCategoryMap(collectionDir: string): Promise<Map<string, CategoryMeta>> {
    const categories = new Map<string, CategoryMeta>();

    try {
        const raw = await readFile(join(collectionDir, "_category_.json"), "utf-8");
        categories.set("", JSON.parse(raw) as CategoryMeta);
    } catch {
        // no root _category_.json
    }

    async function scan(dir: string) {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const subdir = join(dir, entry.name);
            const catPath = join(subdir, "_category_.json");

            try {
                const raw = await readFile(catPath, "utf-8");
                const meta = JSON.parse(raw) as CategoryMeta;
                const relPath = relative(collectionDir, subdir);
                categories.set(relPath, meta);
            } catch {
                // no _category_.json in this dir
            }

            await scan(subdir);
        }
    }

    await scan(collectionDir);
    return categories;
}

const SKIP_TYPES = new Set(["html", "mdxJsxTextElement", "mdxJsxFlowElement", "jsxComponent"]);

function stripHtmlTags(text: string): string {
    return text.replace(/<[^>]+>/g, " ");
}

function extractText(node: AnyNode | Root): string {
    if (SKIP_TYPES.has(node.type)) {
        return "";
    }

    if ("value" in node && typeof node.value === "string") {
        return stripHtmlTags(node.value);
    }

    if ("children" in node && Array.isArray(node.children)) {
        const joined = (node.children as (AnyNode | Root)[]).map(extractText).join(" ");
        return stripHtmlTags(joined).replace(/\s+/g, " ").trim();
    }

    return "";
}

function blockNodesToPlainText(nodes: BlockNode[]): string {
    const parts: string[] = [];

    for (const node of nodes) {
        visit({ type: "root", children: [node] } as Root, (child) => {
            switch (child.type) {
                case "text":
                    parts.push(child.value);
                    break;
                case "inlineCode":
                    parts.push(child.value);
                    break;
                case "code":
                    return false;
            }
        });
    }

    return parts
        .join("")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function astToPlainText(ast: Root): string {
    return blockNodesToPlainText(ast.children);
}

function splitAtHeadings(
    ast: Root,
): { heading: BlockNode & { type: "heading" }; nodes: BlockNode[] }[] {
    const sections: {
        heading: BlockNode & { type: "heading" };
        nodes: BlockNode[];
    }[] = [];
    let current: {
        heading: BlockNode & { type: "heading" };
        nodes: BlockNode[];
    } | null = null;

    for (const node of ast.children) {
        if (node.type === "heading" && node.depth === 2) {
            if (current) sections.push(current);
            current = { heading: node, nodes: [] };
        } else if (current) {
            current.nodes.push(node);
        }
    }

    if (current) sections.push(current);
    return sections;
}

function buildBreadcrumb(
    collection: DocCollection,
    slug: string,
    categories: Map<string, CategoryMeta>,
    pageLabel: string,
): string {
    const rootLabel = categories.get("")?.sidebar_label ?? collection;
    const parts: string[] = [rootLabel];

    const slugParts = slug.split("/").filter(Boolean);

    for (let i = 1; i <= slugParts.length; i++) {
        const dirPath = slugParts.slice(0, i).join("/");
        const cat = categories.get(dirPath);

        if (cat) {
            parts.push(cat.sidebar_label);
        }
    }

    if (pageLabel) {
        parts.push(pageLabel);
    }

    return parts.join(" > ");
}

function buildSlug(filePath: string, collectionDir: string): string {
    let slug = relative(collectionDir, filePath).replace(/\.mdx?$/, "");

    if (slug.endsWith("/index")) {
        slug = slug.slice(0, -"/index".length);
    }

    if (slug === "index") {
        slug = "";
    }

    return slug;
}

function buildUrl(collection: DocCollection, slug: string): string {
    const base = urlForCollection[collection as keyof typeof urlForCollection];
    const segments = ["/docs", base, slug].filter(Boolean);
    return segments.join("/");
}

function slugifyHeading(text: string): string {
    const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return slug || "section";
}

function createAnchorDeduplicator(): (raw: string) => string {
    const seen = new Map<string, number>();

    return (raw: string) => {
        const base = slugifyHeading(raw);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        return count === 0 ? base : `${base}-${count}`;
    };
}

function contentHash(...parts: string[]): string {
    const hash = createHash("sha256");
    for (const part of parts) hash.update(part);
    return hash.digest("hex");
}

export async function* crawl(): AsyncGenerator<CrawledEntry> {
    for (const collection of docCollections) {
        if (VERSIONED_COLLECTION_IDS.has(collection)) continue;

        const collectionDir = join(CONTENT_DIR, collection);

        let dirExists = true;
        try {
            await readdir(collectionDir);
        } catch {
            dirExists = false;
        }

        if (!dirExists) continue;

        const categories = await loadCategoryMap(collectionDir);

        for await (const filePath of walkMarkdown(collectionDir)) {
            const raw = await readFile(filePath, "utf-8");
            const { data: frontmatter, content: body } = matter(raw);
            const parsed = abstractDoc.parse(frontmatter);

            const slug = buildSlug(filePath, collectionDir);
            const ast = parseMarkdown(body);
            const pageUrl = buildUrl(collection, slug);
            const pageLabel = parsed.sidebar_label ?? parsed.title ?? slug.split("/").pop() ?? "";
            const breadcrumb = buildBreadcrumb(collection, slug, categories, pageLabel);
            const pageContent = astToPlainText(ast);
            const description = parsed.description ?? "";
            const title = pageLabel;

            const pageId = `${collection}:${slug || "index"}`;

            yield {
                kind: "page",
                id: pageId,
                collection,
                path: pageUrl,
                url: pageUrl,
                title,
                description,
                breadcrumb,
                content: pageContent,
                contentHash: contentHash(title, breadcrumb, description, pageContent),
            } satisfies CrawledPage;

            const sections = splitAtHeadings(ast);
            const deduplicateAnchor = createAnchorDeduplicator();

            for (const section of sections) {
                const sectionTitle = extractText(section.heading);
                const anchor = deduplicateAnchor(sectionTitle);
                const sectionContent = blockNodesToPlainText(section.nodes);
                const sectionBreadcrumb = `${breadcrumb} > ${sectionTitle}`;
                const sectionId = `${pageId}#${anchor}`;

                if (!sectionContent) continue;

                yield {
                    kind: "section",
                    id: sectionId,
                    pageId,
                    anchor,
                    depth: 2,
                    url: `${pageUrl}#${anchor}`,
                    title: sectionTitle,
                    breadcrumb: sectionBreadcrumb,
                    content: sectionContent,
                    contentHash: contentHash(sectionTitle, sectionBreadcrumb, sectionContent),
                } satisfies CrawledSection;
            }
        }
    }
}
