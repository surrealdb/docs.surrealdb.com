export interface CategoryItem {
    text: string;
    url: string;
    author: CategoryItemAuthor | 'surrealdb';
    category: string;
    topics?: string[];
}

export interface CategoryItemAuthor {
    name: string;
    role: string; // e.g. "Developer Advocate" or "Software Engineer"
    avatar: string; // The filename of the author's avatar image
}
