import { SignJWT } from "jose";
import { RecordId, Surreal } from "surrealdb";
import { crawl } from "./crawler";
import { buildEmbedText, embed } from "./embed";
import type { CrawledEntry, CrawledPage, CrawledSection } from "./types";

interface HashRow {
    id: RecordId;
    content_hash: string;
}

async function createJwtToken(
    namespace: string,
    database: string,
    accessName: string,
    accessKey: string,
): Promise<string> {
    const secret = new TextEncoder().encode(accessKey);
    return new SignJWT({
        NS: namespace,
        DB: database,
        AC: accessName,
        RL: ["Viewer"],
    })
        .setProtectedHeader({ alg: "HS512" })
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(secret);
}

async function connectDb(): Promise<Surreal> {
    const endpoint = process.env.SURREAL_ENDPOINT ?? "ws://localhost:8000";
    const namespace = process.env.SURREAL_NAMESPACE ?? "main";
    const database = process.env.SURREAL_DATABASE ?? "main";

    const db = new Surreal();

    db.subscribe("connected", () => console.log("[DB] Connected"));
    db.subscribe("disconnected", () => console.log("[DB] Disconnected"));
    db.subscribe("error", (e) => console.error("[DB] Error", e));

    const accessName = process.env.SURREAL_ACCESS_NAME;
    const accessKey = process.env.SURREAL_ACCESS_KEY;

    if (accessName && accessKey) {
        const token = await createJwtToken(namespace, database, accessName, accessKey);

        await db.connect(endpoint, {
            versionCheck: false,
            namespace,
            database,
            authentication: token,
        });
    } else {
        const username = process.env.SURREAL_USERNAME ?? "root";
        const password = process.env.SURREAL_PASSWORD ?? "root";

        await db.connect(endpoint, { namespace, database });
        await db.signin({ username, password });
    }

    return db;
}

interface ExistingRecord {
    contentHash: string;
    rid: RecordId;
}

async function fetchExistingRecords(db: Surreal): Promise<Map<string, ExistingRecord>> {
    const records = new Map<string, ExistingRecord>();

    const [pages, sections] = await db
        .query<[HashRow[], HashRow[]]>(
            "SELECT id, content_hash FROM page; SELECT id, content_hash FROM section;",
        )
        .collect();

    for (const row of pages) {
        records.set(row.id.toString(), { contentHash: row.content_hash, rid: row.id });
    }

    for (const row of sections) {
        records.set(row.id.toString(), { contentHash: row.content_hash, rid: row.id });
    }

    return records;
}

function pageRecordId(entry: CrawledPage): RecordId {
    return new RecordId("page", entry.id);
}

function sectionRecordId(entry: CrawledSection): RecordId {
    return new RecordId("section", entry.id);
}

function recordIdString(entry: CrawledEntry): string {
    const rid = entry.kind === "page" ? pageRecordId(entry) : sectionRecordId(entry);
    return rid.toString();
}

async function upsertPage(db: Surreal, entry: CrawledPage, embedding: number[]) {
    const id = pageRecordId(entry);

    await db
        .query(
            `UPSERT $id MERGE {
                path: $path,
                collection: $collection,
                title: $title,
                description: $description,
                breadcrumb: $breadcrumb,
                content: $content,
                content_hash: $content_hash,
                embedding: $embedding,
                date: time::now(),
            };`,
            {
                id,
                path: entry.path,
                collection: entry.collection,
                title: entry.title,
                description: entry.description,
                breadcrumb: entry.breadcrumb,
                content: entry.content,
                content_hash: entry.contentHash,
                embedding,
            },
        )
        .collect();
}

async function upsertSection(db: Surreal, entry: CrawledSection, embedding: number[]) {
    const id = sectionRecordId(entry);
    const pageRef = new RecordId("page", entry.pageId);

    await db
        .query(
            `UPSERT $id MERGE {
                page: $page,
                anchor: $anchor,
                depth: $depth,
                title: $title,
                breadcrumb: $breadcrumb,
                content: $content,
                content_hash: $content_hash,
                embedding: $embedding,
                date: time::now(),
            };`,
            {
                id,
                page: pageRef,
                anchor: entry.anchor,
                depth: entry.depth,
                title: entry.title,
                breadcrumb: entry.breadcrumb,
                content: entry.content,
                content_hash: entry.contentHash,
                embedding,
            },
        )
        .collect();
}

async function deleteStaleRecords(db: Surreal, staleRids: RecordId[]) {
    for (const rid of staleRids) {
        await db.query("DELETE $rid;", { rid }).collect();
    }
}

export async function runIndexer() {
    const db = await connectDb();

    console.log("[IX] Fetching existing content hashes...");
    const existingRecords = await fetchExistingRecords(db);
    console.log(`[IX] Found ${existingRecords.size} existing records`);

    const seenIds = new Set<string>();
    const changed: CrawledEntry[] = [];
    const stats = {
        pagesUnchanged: 0,
        pagesUpdated: 0,
        sectionsUnchanged: 0,
        sectionsUpdated: 0,
        pagesDeleted: 0,
        sectionsDeleted: 0,
    };

    console.log("[CW] Crawling content...");

    for await (const entry of crawl()) {
        const rid = recordIdString(entry);
        seenIds.add(rid);

        const existing = existingRecords.get(rid);

        if (existing?.contentHash === entry.contentHash) {
            if (entry.kind === "page") stats.pagesUnchanged++;
            else stats.sectionsUnchanged++;
            continue;
        }

        changed.push(entry);
    }

    console.log(`[CW] Crawl complete. ${changed.length} entries to embed and upsert.`);

    for (let i = 0; i < changed.length; i++) {
        const entry = changed[i];
        const text = buildEmbedText(entry);
        const embedding = await embed(text);

        if (entry.kind === "page") {
            await upsertPage(db, entry, embedding);
            stats.pagesUpdated++;
        } else {
            await upsertSection(db, entry, embedding);
            stats.sectionsUpdated++;
        }

        console.log(`[IX] ${i + 1}/${changed.length} ${entry.kind} ${entry.id}`);
    }

    const stalePages: RecordId[] = [];
    const staleSections: RecordId[] = [];

    for (const [rid, record] of existingRecords) {
        if (seenIds.has(rid)) continue;

        if (rid.startsWith("page:")) {
            stalePages.push(record.rid);
        } else if (rid.startsWith("section:")) {
            staleSections.push(record.rid);
        }
    }

    if (stalePages.length > 0) {
        await deleteStaleRecords(db, stalePages);
        stats.pagesDeleted = stalePages.length;
        console.log(`[IX] Deleted ${stalePages.length} stale page(s)`);
    }

    if (staleSections.length > 0) {
        await deleteStaleRecords(db, staleSections);
        stats.sectionsDeleted = staleSections.length;
        console.log(`[IX] Deleted ${staleSections.length} stale section(s)`);
    }

    console.log("[IX] Indexing complete:");
    console.log(
        `     Pages:    ${stats.pagesUpdated} updated, ${stats.pagesUnchanged} unchanged, ${stats.pagesDeleted} deleted`,
    );
    console.log(
        `     Sections: ${stats.sectionsUpdated} updated, ${stats.sectionsUnchanged} unchanged, ${stats.sectionsDeleted} deleted`,
    );

    await db.close();
}
