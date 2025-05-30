export type FilterDocsDifficulty = "beginner"
	| "intermediate"
	| "advanced";

export type FilterDocsDeploy = "shared-tier"
	| "standard";

export type FilterDocsLessons = "ai"
	| "data management"
	| "ingest"
	| "integrations"
	| "kai"
	| "python sdk"
	| "query performance"
	| "real-time";

export interface CategoryItem {
	text: string;
	url: string;
	description?: string;
	author?: string;
	deploy?: FilterDocsDeploy;
	lesson?: FilterDocsLessons;
	difficulty?: FilterDocsDifficulty;
}
