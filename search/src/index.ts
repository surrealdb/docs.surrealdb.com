export { connectDb, getDb } from "./db";
export type { EmbeddableEntry } from "./embed";
export { buildEmbedText, embed, embedBatch } from "./embed";
export type { SearchOptions, SearchProduct } from "./handler";
export { handleSearch, MAX_QUERY_LENGTH, normaliseQuery, rankHits } from "./handler";
export type { LanguageIntent, SearchContext, SearchKind } from "./ranking";
export { detectLanguages, formatContextToken, parseContextToken, SDK_KIND } from "./ranking";
export type { RouteResolver, SearchRoute, SearchRouteTable } from "./routes";
export { createRouteResolver } from "./routes";
export type {
    CompiledSearchIndex,
    IndexedDocument,
    IndexedSection,
    RawSearchHit,
    SearchResult,
    SearchResultItem,
} from "./types";
