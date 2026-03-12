export const DEFAULT_META_TITLE =
    "SurrealDB | The ultimate multi-model database for tomorrow's applications";
export const DEFAULT_META_DESCRIPTION =
    "SurrealDB is the ultimate database for tomorrow's serverless, jamstack, single-page, and traditional applications.";

export function getSuffixedMetaTitle(title: string) {
    return `${title} | ${DEFAULT_META_TITLE}`;
}
