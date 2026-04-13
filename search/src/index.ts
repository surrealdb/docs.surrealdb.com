export { connectDb, getDb } from "./db";
export { buildEmbedText, embed, embedBatch } from "./embed";
export { handleSearch, MAX_QUERY_LENGTH, normaliseQuery } from "./handler";
export type {
    CrawledEntry,
    CrawledPage,
    CrawledSection,
    RawSearchHit,
    SearchResult,
    SearchResultItem,
} from "./types";
