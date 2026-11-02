/**
 * Where a reader is on their journey with SurrealDB. Each lab has exactly one,
 * in journey order, and the listing filters and groups by it.
 */
export const labStages = ["Explore", "Learn", "Prototype", "Build", "Operate"] as const;

/** What kind of thing a lab is. Sets the card's icon and eyebrow. */
export const labFormats = [
    "Source code",
    "Video",
    "Article",
    "Documentation",
    "Interactive demo",
] as const;

/**
 * What a lab is about. Subjects only: kinds of content (examples, templates,
 * libraries) are expressed by `labStages` and `labFormats` instead.
 */
export const labTopics = [
    "AI",
    "Cloud",
    "Data management",
    "Financial services",
    "Security",
] as const;

export const labLanguages = [
    "Python",
    "Rust",
    "TypeScript",
    "Go",
    "Java",
    "PHP",
    "SurrealQL",
] as const;
