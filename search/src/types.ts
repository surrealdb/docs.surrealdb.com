export interface CrawledPage {
    kind: "page";
    id: string;
    collection: string;
    path: string;
    url: string;
    title: string;
    description: string;
    breadcrumb: string;
    content: string;
    contentHash: string;
}

export interface CrawledSection {
    kind: "section";
    id: string;
    pageId: string;
    anchor: string;
    depth: number;
    url: string;
    title: string;
    breadcrumb: string;
    content: string;
    contentHash: string;
}

export type CrawledEntry = CrawledPage | CrawledSection;

export interface RawSearchHit {
    kind: "page" | "section";
    url: string;
    title: string;
    breadcrumb: string;
    description?: string;
    content?: string;
    score: number;
    page_path: string;
}

export interface SearchResultItem {
    kind: "page" | "section";
    url: string;
    title: string;
    breadcrumb: string;
    description?: string;
    content?: string;
    score: number;
}

export interface SearchResult extends SearchResultItem {
    more: SearchResultItem[];
}
