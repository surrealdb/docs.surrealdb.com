import type { ImageMetadata } from 'astro';

export type FilterDocsDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type FilterDocsDeploy = 'shared-tier' | 'standard';

export type FilterDocsLessons =
    | 'ai'
    | 'data management'
    | 'ingest'
    | 'integrations'
    | 'python sdk'
    | 'query performance'
    | 'real-time'
    | 'embedding';

export interface CategoryItem {
    text: string;
    url: string;
    author: CategoryItemAuthor | 'surrealdb';
    deploy: FilterDocsDeploy;
    lesson: FilterDocsLessons | [FilterDocsLessons, FilterDocsLessons];
    difficulty: FilterDocsDifficulty;
}

export interface CategoryItemAuthor {
    name: string;
    role: string; // e.g. "Developer Advocate" or "Software Engineer"
    image?: ImageMetadata; // URL to the author's image
}
